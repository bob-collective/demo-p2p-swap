import { Card, Flex, P, Span, Table, TableProps, TokenStack } from '@interlay/ui';
import { ReactNode, useMemo, useState } from 'react';
import { Brc20Order } from '../../../../types/orders';
import { formatUSD } from '../../../../utils/format';
import { CancelOrdinalOrderModal } from '../CancelOrderModal';
import { FillOrdinalOrderModal } from '../FillOrderModal/FillOrdinalOrderModal';
import { StyledCTA, StyledCard, StyledSpan } from './OrdersTable.style';

const AmountCell = ({ amount, valueUSD, ticker }: { amount: string; ticker: string; valueUSD?: number }) => (
  <Flex alignItems='flex-start' direction='column'>
    <StyledSpan size='s' weight='bold'>
      {!Number(amount)
        ? '—'
        : `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 18 }).format(Number(amount))} ${ticker}`}
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

enum Brc20OrdersTableColumns {
  ASSET = 'asset',
  PRICE_PER_UNIT = 'pricePerUnit',
  AVAILABLE_TO_BUY = 'availableToBuy',
  ACTION = 'action'
}

type Brc20OrdersTableRow = {
  id: string;
  [Brc20OrdersTableColumns.ASSET]: ReactNode;
  [Brc20OrdersTableColumns.PRICE_PER_UNIT]: ReactNode;
  [Brc20OrdersTableColumns.AVAILABLE_TO_BUY]: ReactNode;
  [Brc20OrdersTableColumns.ACTION]: ReactNode;
};

type Props = {
  orders: Array<Brc20Order> | undefined;
  refetchOrders: () => void;
  onFillBuyBtc?: (order: Brc20Order) => void;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type Brc20OrdersTableProps = Props & InheritAttrs;

const Brc20OrdersTable = ({ orders, refetchOrders, ...props }: Brc20OrdersTableProps): JSX.Element => {
  const [orderModal, setOrderModal] = useState<{ isOpen: boolean; type: 'fill' | 'cancel'; order?: Brc20Order }>({
    isOpen: false,
    type: 'fill'
  });

  const handleOpenFillOrderModal = (order: Brc20Order) => setOrderModal({ isOpen: true, type: 'fill', order });

  const handleOpenCancelOrderModal = (order: Brc20Order) => setOrderModal({ isOpen: true, type: 'cancel', order });

  const handleCloseAnyOrderModal = () => setOrderModal((s) => ({ ...s, isOpen: false }));

  const columns = [
    { name: 'Asset', id: Brc20OrdersTableColumns.ASSET },
    { name: 'Price per unit', id: Brc20OrdersTableColumns.PRICE_PER_UNIT },
    { name: 'Available to buy', id: Brc20OrdersTableColumns.AVAILABLE_TO_BUY },
    { name: '', id: Brc20OrdersTableColumns.ACTION }
  ];

  const rows: Brc20OrdersTableRow[] = useMemo(
    () =>
      orders
        ? orders.map((order) => {
            return {
              id: `${order.askingCurrency.ticker}-${order.id.toString()}`,
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
                  {order.isOwnerOfOrder ? (
                    <StyledCTA variant='secondary' onPress={() => handleOpenCancelOrderModal(order)} size='small'>
                      Cancel order
                    </StyledCTA>
                  ) : (
                    <StyledCTA onPress={() => handleOpenFillOrderModal(order)} size='small'>
                      Fill Order
                    </StyledCTA>
                  )}
                </Flex>
              )
            };
          })
        : [],
    [orders]
  );

  if (!orders || !orders.length) {
    return (
      <Card gap='spacing4' alignItems='center'>
        <Table {...props} rows={[]} columns={columns} aria-labelledby={props.id} />
        <P>There are no open orders</P>
      </Card>
    );
  }

  return (
    <>
      <StyledCard>
        <Table {...props} columns={columns} rows={rows} />
      </StyledCard>
      {orderModal.order && (
        <FillOrdinalOrderModal
          isOpen={orderModal.isOpen && orderModal.type === 'fill'}
          onClose={handleCloseAnyOrderModal}
          refetchOrders={refetchOrders}
          order={orderModal.order}
        />
      )}
      {orderModal.order && (
        <CancelOrdinalOrderModal
          isOpen={orderModal.isOpen && orderModal.type === 'cancel'}
          onClose={handleCloseAnyOrderModal}
          order={orderModal.order}
          refetchOrders={refetchOrders}
        />
      )}
    </>
  );
};

export { Brc20OrdersTable };
export type { Brc20OrdersTableProps };
