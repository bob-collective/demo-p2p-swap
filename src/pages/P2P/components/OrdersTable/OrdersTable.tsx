import { theme } from '@interlay/theme';
import { CTA, Card, Flex, Span, Table, TableProps, TokenStack } from '@interlay/ui';
import { ReactNode, useMemo, useState } from 'react';
import { Order } from '../../.../../../../types/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';
import { isBtcBuyOrder } from '../../../../utils/orders';
import { CancelOrderModal } from '../CancelOrderModal';
import { FillOrderModal } from '../FillOrderModal';
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
  const [orderModal, setOrderModal] = useState<{ isOpen: boolean; type: 'fill' | 'cancel'; order?: Order }>({
    isOpen: false,
    type: 'fill'
  });

  const handleOpenFillOrderModal = (order: Order) => setOrderModal({ isOpen: true, type: 'fill', order });

  const handleOpenCancelOrderModal = (order: Order) => setOrderModal({ isOpen: true, type: 'cancel', order });

  const handleCloseAnyOrderModal = () => setOrderModal((s) => ({ ...s, isOpen: false }));

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
            const isPendingOrder = isBtcOrder(order) && order.deadline !== undefined;
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
                      onPress={() => handleOpenCancelOrderModal(order)}
                      disabled={isPendingOrder} // MEM0: remove when implementing partial fulfillment.
                      size='small'
                    >
                      Cancel order
                    </CTA>
                  ) : (
                    <CTA onPress={() => handleOpenFillOrderModal(order)} disabled={isPendingOrder} size='small'>
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
      {orderModal.order && (
        <FillOrderModal
          isOpen={orderModal.isOpen && orderModal.type === 'fill'}
          onClose={handleCloseAnyOrderModal}
          refetchOrders={refetchOrders}
          refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
          order={orderModal.order}
        />
      )}
      {orderModal.order && (
        <CancelOrderModal
          isOpen={orderModal.isOpen && orderModal.type === 'cancel'}
          onClose={handleCloseAnyOrderModal}
          order={orderModal.order}
          refetchOrders={refetchOrders}
        />
      )}
    </div>
  );
};

export { OrdersTable };
export type { OrdersTableProps };
