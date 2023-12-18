import { theme } from '@interlay/theme';
import { Flex, Span, Table, TableProps } from '@interlay/ui';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { AcceptedOrdinalOrder } from '../../../../types/orders';
import { Amount } from '../../../../utils/amount';
import { formatUSD } from '../../../../utils/format';
import { CancelOrdinalAcceptedOrderModal } from '../CancelAcceptedOrderModal';
import { CompleteAcceptedOrdinalOrderModal } from '../CompleteAcceptedOrderModal';
import { PendingOrderCTA } from '../PendingOrderCTA/PendingOrderCTA';
import { StyledCTA, StyledCard, StyledSpan } from './AcceptedOrdersTable.style';
import { truncateInscriptionId } from '../../../../utils/truncate';

const AmountCell = ({ amount, valueUSD, ticker }: { amount: string; ticker: string; valueUSD?: number }) => (
  <Flex alignItems='flex-start' direction='column'>
    <StyledSpan size='s' weight='bold'>
      {new Intl.NumberFormat('en-US', { maximumFractionDigits: 18 }).format(Number(amount))} {ticker}
    </StyledSpan>
    {valueUSD && <StyledSpan size='s'>{formatUSD(valueUSD)}</StyledSpan>}
  </Flex>
);

const OrdinalCell = () => (
  <Flex alignItems='center' gap='spacing2'>
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g clip-path='url(#clip0_1521_1620)'>
        <path
          d='M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z'
          fill='white'
        />
        <path
          d='M17.2415 11.9091C17.2415 13.0194 17.031 13.964 16.6101 14.7429C16.1925 15.5218 15.6224 16.1167 14.8999 16.5277C14.1806 16.9354 13.3719 17.1392 12.4737 17.1392C11.5689 17.1392 10.7569 16.9337 10.0376 16.5227C9.31842 16.1117 8.75 15.5168 8.33239 14.7379C7.91477 13.959 7.70597 13.0161 7.70597 11.9091C7.70597 10.7988 7.91477 9.85417 8.33239 9.07528C8.75 8.2964 9.31842 7.70312 10.0376 7.29545C10.7569 6.88447 11.5689 6.67898 12.4737 6.67898C13.3719 6.67898 14.1806 6.88447 14.8999 7.29545C15.6224 7.70312 16.1925 8.2964 16.6101 9.07528C17.031 9.85417 17.2415 10.7988 17.2415 11.9091ZM15.0589 11.9091C15.0589 11.1899 14.9512 10.5833 14.7358 10.0895C14.5237 9.59564 14.2237 9.22112 13.8359 8.96591C13.4482 8.7107 12.9941 8.5831 12.4737 8.5831C11.9534 8.5831 11.4993 8.7107 11.1115 8.96591C10.7237 9.22112 10.4221 9.59564 10.2067 10.0895C9.99456 10.5833 9.88849 11.1899 9.88849 11.9091C9.88849 12.6283 9.99456 13.2348 10.2067 13.7287C10.4221 14.2225 10.7237 14.5971 11.1115 14.8523C11.4993 15.1075 11.9534 15.2351 12.4737 15.2351C12.9941 15.2351 13.4482 15.1075 13.8359 14.8523C14.2237 14.5971 14.5237 14.2225 14.7358 13.7287C14.9512 13.2348 15.0589 12.6283 15.0589 11.9091Z'
          fill='black'
        />
      </g>
      <defs>
        <clipPath id='clip0_1521_1620'>
          <rect width='24' height='24' fill='white' />
        </clipPath>
      </defs>
    </svg>
    <Span weight='bold' size='s'>
      Ordinal
    </Span>
  </Flex>
);

enum AcceptedOrdinalOrdersTableColumns {
  ASSET = 'asset',
  PRICE = 'price',
  INSCRIPTION_ID = 'inscriptionId',
  ACTION = 'action'
}

type AcceptedOrdinalOrdersTableRow = {
  id: string;
  [AcceptedOrdinalOrdersTableColumns.ASSET]: ReactNode;
  [AcceptedOrdinalOrdersTableColumns.PRICE]: ReactNode;
  [AcceptedOrdinalOrdersTableColumns.INSCRIPTION_ID]: ReactNode;
  [AcceptedOrdinalOrdersTableColumns.ACTION]: ReactNode;
};

type Props = {
  selectedOrder?: AcceptedOrdinalOrder;
  orders: Array<AcceptedOrdinalOrder> | undefined;
  refetchOrders: () => void;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type AcceptedOrdinalOrdersTableProps = Props & InheritAttrs;

const AcceptedOrdinalOrdersTable = ({
  selectedOrder,
  orders,
  refetchOrders,
  ...props
}: AcceptedOrdinalOrdersTableProps): JSX.Element => {
  const [orderModal, setOrderModal] = useState<{
    isOpen: boolean;
    type: 'fill' | 'cancel';
    order?: AcceptedOrdinalOrder;
  }>({
    isOpen: false,
    type: 'fill'
  });

  useEffect(() => {
    setOrderModal((s) => ({ ...s, isOpen: !!selectedOrder, order: selectedOrder }));
  }, [selectedOrder]);

  const columns = [
    { name: 'Asset', id: AcceptedOrdinalOrdersTableColumns.ASSET },
    { name: 'Price', id: AcceptedOrdinalOrdersTableColumns.PRICE },
    { name: 'Inscription ID', id: AcceptedOrdinalOrdersTableColumns.INSCRIPTION_ID },
    { name: '', id: AcceptedOrdinalOrdersTableColumns.ACTION }
  ];

  const { address } = useAccount();

  const handleOpenFillOrderModal = (order: AcceptedOrdinalOrder) =>
    setOrderModal({ isOpen: true, type: 'fill', order });

  const handleOpenCancelOrderModal = (order: AcceptedOrdinalOrder) =>
    setOrderModal({ isOpen: true, type: 'cancel', order });

  const handleCloseAnyOrderModal = () => setOrderModal((s) => ({ ...s, isOpen: false }));

  const rows: AcceptedOrdinalOrdersTableRow[] = useMemo(
    () =>
      orders
        ? orders.map((order) => {
            return {
              id: `${order.ordinalId}-${order.acceptId.toString()}`,
              asset: <OrdinalCell />,
              price: (
                <AmountCell
                  amount={new Amount(order.askingCurrency, order.totalAskingAmount.toString()).toBig().toString()}
                  ticker={order.askingCurrency.ticker}
                />
              ),
              inscriptionId: <StyledSpan size='s'>{truncateInscriptionId(order.ordinalId.txId)}</StyledSpan>,
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
    [address, orders]
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

export { AcceptedOrdinalOrdersTable };
export type { AcceptedOrdinalOrdersTableProps };
