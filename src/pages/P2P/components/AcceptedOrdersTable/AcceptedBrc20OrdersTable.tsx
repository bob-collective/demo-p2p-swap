import { theme } from '@interlay/theme';
import { Flex, Span, Table, TableProps, TokenStack } from '@interlay/ui';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { AcceptedBrc20Order } from '../../../../types/orders';
import { formatUSD } from '../../../../utils/format';
import { CancelOrdinalAcceptedOrderModal } from '../CancelAcceptedOrderModal';
import { CompleteAcceptedOrdinalOrderModal } from '../CompleteAcceptedOrderModal';
import { PendingOrderCTA } from '../PendingOrderCTA/PendingOrderCTA';
import { StyledCTA, StyledCard, StyledSpan } from './AcceptedOrdersTable.style';

const AmountCell = ({ amount, valueUSD, ticker }: { amount: string; ticker: string; valueUSD?: number }) => (
  <Flex alignItems='flex-start' direction='column'>
    <StyledSpan size='s' weight='bold'>
      {new Intl.NumberFormat('en-US', { maximumFractionDigits: 18 }).format(Number(amount))} {ticker}
    </StyledSpan>
    {valueUSD && <StyledSpan size='s'>{formatUSD(valueUSD)}</StyledSpan>}
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

enum AcceptedBrc20OrdersTableColumns {
  ASSET = 'asset',
  PRICE_PER_UNIT = 'pricePerUnit',
  AVAILABLE_TO_BUY = 'availableToBuy',
  ACTION = 'action'
}

type AcceptedBrc20OrdersTableRow = {
  id: string;
  [AcceptedBrc20OrdersTableColumns.ASSET]: ReactNode;
  [AcceptedBrc20OrdersTableColumns.PRICE_PER_UNIT]: ReactNode;
  [AcceptedBrc20OrdersTableColumns.AVAILABLE_TO_BUY]: ReactNode;
  [AcceptedBrc20OrdersTableColumns.ACTION]: ReactNode;
};

type Props = {
  selectedOrder?: AcceptedBrc20Order;
  orders: Array<AcceptedBrc20Order> | undefined;
  refetchOrders: () => void;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type AcceptedBrc20OrdersTableProps = Props & InheritAttrs;

const AcceptedBrc20OrdersTable = ({
  selectedOrder,
  orders,
  refetchOrders,
  ...props
}: AcceptedBrc20OrdersTableProps): JSX.Element => {
  const [orderModal, setOrderModal] = useState<{
    isOpen: boolean;
    type: 'fill' | 'cancel';
    order?: AcceptedBrc20Order;
  }>({
    isOpen: false,
    type: 'fill'
  });

  useEffect(() => {
    setOrderModal((s) => ({ ...s, isOpen: !!selectedOrder, order: selectedOrder }));
  }, [selectedOrder]);

  const columns = [
    { name: 'Asset', id: AcceptedBrc20OrdersTableColumns.ASSET },
    { name: 'Price per unit', id: AcceptedBrc20OrdersTableColumns.PRICE_PER_UNIT },
    { name: 'Available to buy', id: AcceptedBrc20OrdersTableColumns.AVAILABLE_TO_BUY },
    { name: '', id: AcceptedBrc20OrdersTableColumns.ACTION }
  ];

  const handleOpenFillOrderModal = (order: AcceptedBrc20Order) => setOrderModal({ isOpen: true, type: 'fill', order });

  const handleOpenCancelOrderModal = (order: AcceptedBrc20Order) =>
    setOrderModal({ isOpen: true, type: 'cancel', order });

  const handleCloseAnyOrderModal = () => setOrderModal((s) => ({ ...s, isOpen: false }));

  const rows: AcceptedBrc20OrdersTableRow[] = useMemo(
    () =>
      orders
        ? orders.map((order) => {
            return {
              id: order.acceptId.toString(),
              asset: (
                <AssetCell
                  name={order.amount.currency.ticker}
                  tickers={[order.amount.currency.ticker, order.askingCurrency.ticker]}
                />
              ),
              pricePerUnit: <AmountCell amount={order.price.toString()} ticker={order.askingCurrency.ticker} />,
              availableToBuy: (
                <AmountCell amount={order.amount.toBig().toString()} ticker={order.amount.currency.ticker} />
              ),
              action: (
                <Flex justifyContent='flex-end' gap='spacing4' alignItems='center'>
                  {/* Add cancel order event */}
                  <PendingOrderCTA
                    deadline={order.deadline}
                    onPress={() => handleOpenCancelOrderModal(order)}
                    ctaText='Cancel Order'
                    showCta={!!order.isAcceptorOfOrder}
                  />
                  {order.isCreatorOfOrder && (
                    <StyledCTA onPress={() => handleOpenFillOrderModal(order)} size='small'>
                      Complete Order
                    </StyledCTA>
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
      <StyledCard>
        <Table {...props} columns={columns} rows={rows} />
      </StyledCard>
      {orderModal.order && (
        <CompleteAcceptedOrdinalOrderModal
          isOpen={orderModal.isOpen && orderModal.type === 'fill'}
          onClose={handleCloseAnyOrderModal}
          refetchOrders={refetchOrders}
          order={orderModal.order}
        />
      )}
      {orderModal.order && (
        <CancelOrdinalAcceptedOrderModal
          isOpen={orderModal.isOpen && orderModal.type === 'cancel'}
          onClose={handleCloseAnyOrderModal}
          order={orderModal.order}
          refetchOrders={refetchOrders}
        />
      )}
    </div>
  );
};

export { AcceptedBrc20OrdersTable };
export type { AcceptedBrc20OrdersTableProps };
