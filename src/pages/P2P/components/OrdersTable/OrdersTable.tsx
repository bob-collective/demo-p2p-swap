import { CTA, Card, Flex, Modal, ModalBody, ModalHeader, Span, Table, TableProps, TokenStack } from '@interlay/ui';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { formatUSD } from '../../../../utils/format';
import { FillOrderForm } from '../FillOrderForm';
import { CancelOrderModal } from '../CancelOrderModal';
import { toAtomicAmount, toBaseAmount } from '../../../../utils/currencies';
import { FillOrderFormData } from '../FillOrderForm/FillOrderForm';
import { useContract } from '../../../../hooks/useContract';
import { ContractType } from '../../../../constants';
import { useAccount, usePublicClient } from 'wagmi';
import { isAddressEqual } from 'viem';
import { Order } from '../../../../types/orders';
import { isBtcBuyOrder, isBtcOrder } from '../../../../utils/orders';

const AmountCell = ({ amount, valueUSD, ticker }: { amount: string; ticker: string; valueUSD?: number }) => (
  <Flex alignItems='flex-start' direction='column'>
    <Span size='s' weight='bold'>
      {new Intl.NumberFormat('en-US', { maximumFractionDigits: 18 }).format(Number(amount))} {ticker}
    </Span>
    {valueUSD && <Span size='s'>{formatUSD(valueUSD)}</Span>}
  </Flex>
);

const AssetCell = ({ name, tickers }: { name: string; tickers: string[] }) => (
  <Flex alignItems='center' gap='spacing2'>
    <TokenStack tickers={tickers} />
    <Span weight='bold' size='s'>
      {name}
    </Span>
  </Flex>
);

enum OrdersTableColumns {
  ASSET = 'asset',
  PRICE_PER_UNIT = 'pricePerUnit',
  AVAILABLE_TO_BUY = 'availableToBuy',
  ACTION = 'action'
}

type OrdersTableRow = {
  id: string;
  [OrdersTableColumns.ASSET]: ReactNode;
  [OrdersTableColumns.PRICE_PER_UNIT]: ReactNode;
  [OrdersTableColumns.AVAILABLE_TO_BUY]: ReactNode;
  [OrdersTableColumns.ACTION]: ReactNode;
};

type Props = {
  orders: Array<Order> | undefined;
  refetchOrders: () => void;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type OrdersTableProps = Props & InheritAttrs;

const OrdersTable = ({ orders, refetchOrders, ...props }: OrdersTableProps): JSX.Element => {
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [isCancelOrderModalOpen, setCancelOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order>();

  const publicClient = usePublicClient();

  const { address } = useAccount();

  const { write: writeErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);
  const { write: writeBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);

  const handleFillOrder = useCallback(
    async (data?: FillOrderFormData) => {
      if (!selectedOrder) {
        return;
      }
      // If we are dealing with BTC, use btc marketplace contract.
      if (isBtcOrder(selectedOrder)) {
        if (isBtcBuyOrder(selectedOrder)) {
          const acceptBuyOrderTxHash = await writeBtcMarketplace.acceptBtcBuyOrder([
            selectedOrder.id,
            selectedOrder.totalAskingAmount
          ]);
          await publicClient.waitForTransactionReceipt({ hash: acceptBuyOrderTxHash });
          // console.log(
          //   receipt.logs.map((log) => decodeEventLog({ abi: contracts[ContractType.BTC_MARKETPLACE].abi, ...log }))
          // );

          // // handling mocked btc relay inclusion proof - just require 2txs
          // const fakeId = BigInt(1);
          // const mockedProof = { dummy: BigInt(0) };
          // const postBuyOrderProofTxHash = await writeBtcMarketplace.proofBtcBuyOrder([fakeId, mockedProof]);
          // await publicClient.waitForTransactionReceipt({ hash: postBuyOrderProofTxHash });
        } else {
          // TODO: handle sell order in similar fashion
        }
      } else {
        if (!data?.input) {
          return;
        }
        const atomicAmount = toAtomicAmount(data.input, selectedOrder.askingCurrency.ticker);

        const hash = await writeErc20Marketplace.acceptErcErcOrder([selectedOrder.id, atomicAmount]);
        await publicClient.waitForTransactionReceipt({ hash });
      }

      handleCloseOrderModal();
      refetchOrders();
    },
    [selectedOrder, refetchOrders, writeBtcMarketplace, publicClient, writeErc20Marketplace]
  );

  const handleCloseOrderModal = () => setOrderModalOpen(false);

  const columns = [
    { name: 'Asset', id: OrdersTableColumns.ASSET },
    { name: 'Price per unit', id: OrdersTableColumns.PRICE_PER_UNIT },
    { name: 'Available to buy', id: OrdersTableColumns.AVAILABLE_TO_BUY },
    { name: '', id: OrdersTableColumns.ACTION }
  ];

  const rows: OrdersTableRow[] = useMemo(
    () =>
      orders
        ? orders.map((order) => {
            const isOwnerOfOrder = address && isAddressEqual(order.requesterAddress, address);
            const isPendingOrder = isBtcBuyOrder(order) && !!order.acceptTime;
            return {
              id: order.id.toString(),
              asset: (
                <AssetCell
                  name={order.offeringCurrency.ticker}
                  tickers={[order.offeringCurrency.ticker, order.askingCurrency.ticker]}
                />
              ),
              pricePerUnit: <AmountCell amount={order.price.toString()} ticker={order.askingCurrency.ticker} />,
              availableToBuy: (
                <AmountCell
                  amount={toBaseAmount(order.availableLiquidity, order.offeringCurrency.ticker)}
                  ticker={order.offeringCurrency.ticker}
                />
              ),
              action: (
                <Flex justifyContent='flex-end' gap='spacing2'>
                  {isBtcBuyOrder(order) && order.acceptTime
                    ? new Date(parseInt(order.acceptTime.toString()) * 1000).toISOString()
                    : isOwnerOfOrder && (
                        <CTA
                          variant='secondary'
                          onPress={() => {
                            setSelectedOrder(order);
                            setCancelOrderModal(true);
                          }}
                          size='small'
                        >
                          Cancel order
                        </CTA>
                      )}
                  <CTA
                    onPress={() => {
                      setSelectedOrder(order);
                      setOrderModalOpen(true);
                    }}
                    disabled={isPendingOrder}
                    size='small'
                  >
                    Fill Order
                  </CTA>
                </Flex>
              )
            };
          })
        : [],
    [orders, address]
  );

  return (
    <>
      <Card>
        <Table {...props} columns={columns} rows={rows} />
      </Card>
      <Modal isOpen={isOrderModalOpen} onClose={handleCloseOrderModal}>
        <ModalHeader>Fill Order</ModalHeader>
        <ModalBody>{selectedOrder && <FillOrderForm onSubmit={handleFillOrder} order={selectedOrder} />}</ModalBody>
      </Modal>
      <CancelOrderModal
        isOpen={isCancelOrderModalOpen}
        refetchOrders={refetchOrders}
        order={selectedOrder}
        onClose={() => setCancelOrderModal(false)}
      />
    </>
  );
};

export { OrdersTable };
export type { OrdersTableProps };
