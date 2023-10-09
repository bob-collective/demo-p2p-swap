import { CTA, Card, Flex, Modal, ModalBody, ModalHeader, Span, Table, TableProps, TokenStack } from '@interlay/ui';
import { theme } from '@interlay/theme';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { formatUSD } from '../../../../utils/format';
import { FillOrderForm } from '../FillOrderForm';
import { CancelOrderModal } from '../CancelOrderModal';
import { toAtomicAmount, toBaseAmount } from '../../../../utils/currencies';
import { FillOrderFormData } from '../FillOrderForm/FillOrderForm';
import { useContract } from '../../../../hooks/useContract';
import { ContractType } from '../../../../constants';
import { usePublicClient } from 'wagmi';
import { Order } from '../../.../../../../types/orders';
import { isBtcBuyOrder, isBtcOrder } from '../../../../utils/orders';
import { PendingOrderCTA } from '../PendingOrderCTA/PendingOrderCTA';

const AmountCell = ({ amount, valueUSD, ticker }: { amount: string; ticker: string; valueUSD?: number }) => (
  <Flex alignItems='flex-start' direction='column'>
    <Span size='s' weight='bold'>
      {!Number(amount)
        ? '—'
        : `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 18 }).format(Number(amount))} ${ticker}`}
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
  refetchAcceptedBtcOrders: () => void;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type OrdersTableProps = Props & InheritAttrs;

const OrdersTable = ({ orders, refetchOrders, refetchAcceptedBtcOrders, ...props }: OrdersTableProps): JSX.Element => {
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [isCancelOrderModalOpen, setCancelOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order>();

  const publicClient = usePublicClient();

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
          refetchAcceptedBtcOrders();
        } else {
          if (!data?.btcAddress) return;
          const mockedBtcAddress = { bitcoinAddress: data.btcAddress };
          const acceptBtcSellOrderTxHash = await writeBtcMarketplace.acceptBtcSellOrder([
            selectedOrder.id,
            mockedBtcAddress,
            selectedOrder.availableLiquidity
          ]);
          await publicClient.waitForTransactionReceipt({ hash: acceptBtcSellOrderTxHash });
          refetchAcceptedBtcOrders();
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
    [selectedOrder, refetchOrders, refetchAcceptedBtcOrders, writeBtcMarketplace, publicClient, writeErc20Marketplace]
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
            const isPendingOrder = isBtcBuyOrder(order) && order.deadline !== undefined;
            return {
              id: `${order.offeringCurrency.ticker}-${order.askingCurrency.ticker}-${order.id.toString()}`,
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
                <Flex justifyContent='flex-end' gap='spacing4' alignItems='center'>
                  {isPendingOrder && <PendingOrderCTA showCta={false} deadline={order.deadline as Date} />}
                  {order.isOwnerOfOrder ? (
                    <CTA
                      variant='secondary'
                      onPress={() => {
                        setSelectedOrder(order);
                        setCancelOrderModal(true);
                      }}
                      disabled={isPendingOrder} // MEM0: remove when implementing partial fulfillment.
                      size='small'
                    >
                      Cancel order
                    </CTA>
                  ) : (
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
                  )}
                </Flex>
              )
            };
          })
        : [],
    [orders]
  );

  return (
    <div style={{ margin: `${theme.spacing.spacing4} 0` }}>
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
    </div>
  );
};

export { OrdersTable };
export type { OrdersTableProps };
