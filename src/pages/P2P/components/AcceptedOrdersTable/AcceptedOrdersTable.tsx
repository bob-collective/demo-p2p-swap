import { Card, Flex, Span, Table, TableProps, TokenStack } from '@interlay/ui';
import { ReactNode, useMemo } from 'react';
import { AcceptedBuyOrder } from '../../../../types/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';

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

enum AcceptedOrdersTableColumns {
  ASSET = 'asset',
  PRICE_PER_UNIT = 'pricePerUnit',
  AVAILABLE_TO_BUY = 'availableToBuy',
  ACTION = 'action'
}

type AcceptedOrdersTableRow = {
  id: string;
  [AcceptedOrdersTableColumns.ASSET]: ReactNode;
  [AcceptedOrdersTableColumns.PRICE_PER_UNIT]: ReactNode;
  [AcceptedOrdersTableColumns.AVAILABLE_TO_BUY]: ReactNode;
  [AcceptedOrdersTableColumns.ACTION]: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {
  orders: Array<AcceptedBuyOrder> | undefined;
  refetchOrders: () => void;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type AcceptedOrdersTableProps = Props & InheritAttrs;

const AcceptedOrdersTable = ({ orders, ...props }: AcceptedOrdersTableProps): JSX.Element => {
  const columns = [
    { name: 'Asset', id: AcceptedOrdersTableColumns.ASSET },
    { name: 'Price per unit', id: AcceptedOrdersTableColumns.PRICE_PER_UNIT },
    { name: 'Available to buy', id: AcceptedOrdersTableColumns.AVAILABLE_TO_BUY },
    { name: '', id: AcceptedOrdersTableColumns.ACTION }
  ];

  const rows: AcceptedOrdersTableRow[] = useMemo(
    () =>
      orders
        ? orders.map((order) => {
            // const isOwnerOfOrder = address && isAddressEqual(order.requesterAddress, address);
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
                  amount={toBaseAmount(order.amount, order.offeringCurrency.ticker)}
                  ticker={order.offeringCurrency.ticker}
                />
              ),
              action: (
                <Flex justifyContent='flex-end' gap='spacing2'>
                  {order.acceptTime.toDateString()}
                </Flex>
              )
            };
          })
        : [],
    [orders]
  );

  return (
    <>
      <Card>
        <Table {...props} columns={columns} rows={rows} />
      </Card>
    </>
  );
};

export { AcceptedOrdersTable };
export type { AcceptedOrdersTableProps };
