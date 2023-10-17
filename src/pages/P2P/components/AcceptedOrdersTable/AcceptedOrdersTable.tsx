import { theme } from '@interlay/theme';
import { Flex, Span, Table, TableProps, TokenStack } from '@interlay/ui';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';
import { Bitcoin } from '../../../../constants';
import { AcceptedBtcOrder } from '../../../../types/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';
import { CancelAcceptedOrderModal } from '../CancelAcceptedOrderModal';
import { CompleteAcceptedOrderModal } from '../CompleteAcceptedOrderModal';
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

type Props = {
  selectedOrder?: AcceptedBtcOrder;
  orders: Array<AcceptedBtcOrder> | undefined;
  refetchOrders: () => void;
  refetchAcceptedBtcOrders: () => void;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type AcceptedOrdersTableProps = Props & InheritAttrs;

const AcceptedOrdersTable = ({
  selectedOrder,
  orders,
  refetchOrders,
  refetchAcceptedBtcOrders,
  ...props
}: AcceptedOrdersTableProps): JSX.Element => {
  const [orderModal, setOrderModal] = useState<{ isOpen: boolean; type: 'fill' | 'cancel'; order?: AcceptedBtcOrder }>({
    isOpen: false,
    type: 'fill'
  });

  useEffect(() => {
    setOrderModal((s) => ({ ...s, isOpen: !!selectedOrder, order: selectedOrder }));
  }, [selectedOrder]);

  const columns = [
    { name: 'Asset', id: AcceptedOrdersTableColumns.ASSET },
    { name: 'Price per unit', id: AcceptedOrdersTableColumns.PRICE_PER_UNIT },
    { name: 'Available to buy', id: AcceptedOrdersTableColumns.AVAILABLE_TO_BUY },
    { name: '', id: AcceptedOrdersTableColumns.ACTION }
  ];

  const { address } = useAccount();

  const handleOpenFillOrderModal = (order: AcceptedBtcOrder) => setOrderModal({ isOpen: true, type: 'fill', order });

  const handleOpenCancelOrderModal = (order: AcceptedBtcOrder) =>
    setOrderModal({ isOpen: true, type: 'cancel', order });

  const handleCloseAnyOrderModal = () => setOrderModal((s) => ({ ...s, isOpen: false }));

  const rows: AcceptedOrdersTableRow[] = useMemo(
    () =>
      orders
        ? orders.map((order) => {
            const isBtcReceiver = address && isAddressEqual(order.btcReceiver, address);
            const isBtcSender = address && isAddressEqual(order.btcSender, address);

            return {
              id: `${order.type}-${order.acceptId.toString()}`,
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
                  <PendingOrderCTA
                    deadline={order.deadline}
                    onPress={() => handleOpenCancelOrderModal(order)}
                    ctaText='Cancel Order'
                    showCta={!!isBtcReceiver}
                  />
                  {isBtcSender && (
                    <StyledCTA onPress={() => handleOpenFillOrderModal(order)} size='small'>
                      Complete Order
                    </StyledCTA>
                  )}
                </Flex>
              )
            };
          })
        : [],
    [address, orders]
  );

  return (
    <div style={{ margin: `${theme.spacing.spacing4} 0` }}>
      <StyledCard>
        <Table {...props} columns={columns} rows={rows} />
      </StyledCard>
      {orderModal.order && (
        <CompleteAcceptedOrderModal
          isOpen={orderModal.isOpen && orderModal.type === 'fill'}
          onClose={handleCloseAnyOrderModal}
          refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
          refetchOrders={refetchOrders}
          order={orderModal.order}
        />
      )}
      {orderModal.order && (
        <CancelAcceptedOrderModal
          isOpen={orderModal.isOpen && orderModal.type === 'cancel'}
          onClose={handleCloseAnyOrderModal}
          order={orderModal.order}
          refetchOrders={refetchOrders}
        />
      )}
    </div>
  );
};

export { AcceptedOrdersTable };
export type { AcceptedOrdersTableProps };
