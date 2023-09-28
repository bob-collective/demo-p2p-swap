import { CTA, Card, Flex, Modal, ModalBody, ModalHeader, Span, Table, TableProps, TokenStack } from '@interlay/ui';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { formatUSD } from '../../../../utils/format';
import { FillOrderForm } from '../FillOrderForm';
import { CancelOrderModal } from '../CancelOrderModal';
import { Erc20Order, useGetActiveErc20Orders } from '../../../../hooks/fetchers/useGetActiveOrders';
import { toAtomicAmountErc20, toBaseAmountErc20 } from '../../../../utils/currencies';
import { FillOrderFormData } from '../FillOrderForm/FillOrderForm';
import { useContract } from '../../../../hooks/useContract';
import { ContractType } from '../../../../constants';
import { usePublicClient } from 'wagmi';

const AmountCell = ({ amount, valueUSD, ticker }: { amount: string; ticker: string; valueUSD?: number }) => (
  <Flex alignItems='flex-start' direction='column'>
    <Span size='s' weight='bold'>
      {amount} {ticker}
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

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type OrdersTableProps = Props & InheritAttrs;

const OrdersTable = (props: OrdersTableProps): JSX.Element => {
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [isCancelOrderModalOpen, setCancelOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Erc20Order>();

  const publicClient = usePublicClient()

  const {write: writeErc20Marketplace} = useContract(ContractType.ERC20_MARKETPLACE);

  const { data: orders } = useGetActiveErc20Orders();

  const handleFillOrder = useCallback(async(data:FillOrderFormData) => {
    if (!selectedOrder || !data.input) {
      return;
    }
    // !TODO: handle case when erc20 allowance is not set for contract
    const atomicAmount = toAtomicAmountErc20(data.input, selectedOrder.askingCurrency.ticker)
    console.log([BigInt(selectedOrder.id), atomicAmount])
    const hash = await writeErc20Marketplace.acceptErcErcOrder([BigInt(selectedOrder.id), atomicAmount]);
    await publicClient.waitForTransactionReceipt({hash});
    handleCloseOrderModal();
  }, [publicClient, selectedOrder, writeErc20Marketplace]) 

  const handleCloseOrderModal = () => setOrderModalOpen(false);

  const columns = [
    { name: 'Asset', uid: OrdersTableColumns.ASSET },
    { name: 'Price per unit', uid: OrdersTableColumns.PRICE_PER_UNIT },
    { name: 'Available to buy', uid: OrdersTableColumns.AVAILABLE_TO_BUY },
    { name: '', uid: OrdersTableColumns.ACTION }
  ];

  const rows: OrdersTableRow[] = useMemo(
    () =>
      orders
        ? orders.map((order, index) => ({
            id: index.toString(),
            asset: (
              <AssetCell
                name={order.offeringCurrency.ticker}
                tickers={[order.offeringCurrency.ticker, order.askingCurrency.ticker]}
              />
            ),
            pricePerUnit: <AmountCell amount={order.price.toString()} ticker={order.askingCurrency.ticker} />,
            availableToBuy: (
              <AmountCell
                amount={toBaseAmountErc20(order.availableLiquidity, order.offeringCurrency.ticker)}
                ticker={order.offeringCurrency.ticker}
              />
            ),
            action: (
              <CTA
                onPress={() => {
                  setSelectedOrder(order);
                  setOrderModalOpen(true);
                }}
                size='small'
              >
                Fill Order
              </CTA>
            )
          }))
        : [],
    [orders]
  );

  return (
    <>
      <Card>
        <Table {...props} columns={columns} rows={rows} />
      </Card>
      <Modal isOpen={isOrderModalOpen} onClose={handleCloseOrderModal}>
        <ModalHeader>Fill Order</ModalHeader>
        <ModalBody>
          <FillOrderForm onSubmit={handleFillOrder} order={selectedOrder} />
        </ModalBody>
      </Modal>
      <CancelOrderModal isOpen={isCancelOrderModalOpen} onClose={() => setCancelOrderModal(false)} />
    </>
  );
};

export { OrdersTable };
export type { OrdersTableProps };
