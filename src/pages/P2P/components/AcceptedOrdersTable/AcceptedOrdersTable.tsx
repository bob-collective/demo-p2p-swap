import { CTA, Card, Flex, Span, Table, TableProps, TokenStack } from '@interlay/ui';
import { ReactNode, useMemo, useState } from 'react';
import { AcceptedBtcOrder } from '../../../../types/orders';
import { useCountDown } from 'ahooks';
import { toBaseAmount } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';
import { Bitcoin } from '../../../../constants';
import { useAccount } from 'wagmi';
import { isAddressEqual } from 'viem';
import { CompleteAcceptedOrderModal } from '../CompleteAcceptedOrderModal';
import { CancelAcceptedOrderModal } from '../CancelAcceptedOrderModal';

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

const CancelOrderCTA = ({ deadline, showCTA, onPress }: { deadline: Date; showCTA: boolean; onPress?: () => void }) => {
  const [number, formattedRes] = useCountDown({
    targetDate: deadline
  });

  if (number <= 0) {
    return showCTA ? (
      <CTA onPress={onPress} size='small' variant='secondary'>
        Cancel Order
      </CTA>
    ) : (
      <></>
    );
  }

  const { hours, minutes, seconds } = formattedRes;

  return (
    <Flex gap='spacing2'>
      <Span weight='bold' color='tertiary' size='xs'>
        Pending
      </Span>{' '}
      <Span weight='bold' size='xs' style={{ maxWidth: '3.3rem', width: '3.3rem' }}>
        {hours}:{minutes}:{seconds}
      </Span>
    </Flex>
  );
};

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
  orders: Array<AcceptedBtcOrder> | undefined;
  refetchOrders: () => void;
  refetchAcceptedBtcOrders: () => void;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type AcceptedOrdersTableProps = Props & InheritAttrs;

const AcceptedOrdersTable = ({
  orders,
  refetchOrders,
  refetchAcceptedBtcOrders,
  ...props
}: AcceptedOrdersTableProps): JSX.Element => {
  const [isCompleteOrderModalOpen, setCompleteOrderModalOpen] = useState(false);
  const [isCancelOrderModalOpen, setCancelOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AcceptedBtcOrder>();

  const columns = [
    { name: 'Asset', id: AcceptedOrdersTableColumns.ASSET },
    { name: 'Price per unit', id: AcceptedOrdersTableColumns.PRICE_PER_UNIT },
    { name: 'Available to buy', id: AcceptedOrdersTableColumns.AVAILABLE_TO_BUY },
    { name: '', id: AcceptedOrdersTableColumns.ACTION }
  ];

  const { address } = useAccount();

  const rows: AcceptedOrdersTableRow[] = useMemo(
    () =>
      orders
        ? orders.map((order) => {
            const isBtcReceiver = address && isAddressEqual(order.btcReceiver, address);
            const isBtcSender = address && isAddressEqual(order.btcSender, address);
            return {
              id: order.acceptId.toString(),
              asset: (
                <AssetCell name={order.otherCurrency.ticker} tickers={[order.otherCurrency.ticker, Bitcoin.ticker]} />
              ),
              pricePerUnit: <AmountCell amount={order.price.toString()} ticker={Bitcoin.ticker} />,
              availableToBuy: (
                <AmountCell
                  amount={toBaseAmount(order.otherCurrencyAmount, order.otherCurrency.ticker)}
                  ticker={order.otherCurrency.ticker}
                />
              ),
              action: (
                <Flex justifyContent='flex-end' gap='spacing4' alignItems='center'>
                  {/* Add cancel order event */}
                  <CancelOrderCTA
                    deadline={order.deadline}
                    onPress={() => {
                      setSelectedOrder(order);
                      setCancelOrderModalOpen(true);
                    }}
                    showCTA={!!isBtcReceiver}
                  />
                  {isBtcSender && (
                    <CTA
                      onPress={() => {
                        setSelectedOrder(order);
                        setCompleteOrderModalOpen(true);
                      }}
                      size='small'
                    >
                      Complete Order
                    </CTA>
                  )}
                </Flex>
              )
            };
          })
        : [],
    [address, orders]
  );

  return (
    <>
      <Card>
        <Table {...props} columns={columns} rows={rows} />
      </Card>
      <CompleteAcceptedOrderModal
        isOpen={isCompleteOrderModalOpen}
        order={selectedOrder}
        onClose={() => setCompleteOrderModalOpen(false)}
        refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
        refetchOrders={refetchOrders}
      />
      <CancelAcceptedOrderModal
        isOpen={isCancelOrderModalOpen}
        refetchOrders={refetchOrders}
        order={selectedOrder}
        onClose={() => setCancelOrderModalOpen(false)}
      />
    </>
  );
};

export { AcceptedOrdersTable };
export type { AcceptedOrdersTableProps };
