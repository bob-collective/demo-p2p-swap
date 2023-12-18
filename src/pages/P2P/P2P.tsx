import { theme } from '@interlay/theme';
import { Alert, CTA, Flex, H1, H2, Spinner, Tabs, TabsItem } from '@interlay/ui';
import { useState } from 'react';
import { useGetOrders } from '../../hooks/fetchers/useGetOrders';
import { AcceptedOrdersTable, AddOrderModal, OrdersTable } from './components';
import { useBalances } from '../../hooks/useBalances';
import { useSearchParams } from 'react-router-dom';
import { AcceptedBtcOrder } from '../../types/orders';
import { FAUCET_URL, SUPERBRIDGE_URL } from '../../constants/links';
import { useGetActiveOrdinalOrders } from '../../hooks/fetchers/useGetActiveOrdinalOrders';
import { OrdinalOrdersTable } from './components/OrdersTable/OrdinalsOrdersTable';

const findOrder = (orders: AcceptedBtcOrder[], id: number) => orders.find((order) => Number(order.orderId) === id);

const P2P = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams(new URLSearchParams('market=buy'));

  const [isAddNewOrderModal, setAddNewOrderModal] = useState<{ isOpen: boolean; variant?: 'ERC20' | 'BTC' }>({
    isOpen: false
  });
  const titleId = 'titleId';
  const titleId2 = 'titleId2';
  const titleId3 = 'titleId3';
  const titleId4 = 'titleId4';

  const { data: orders, refetch, refetchAcceptedBtcOrders } = useGetOrders();
  const { data: activeOrdinalOrders, refetch: refetchActiveOrdinalOrders } = useGetActiveOrdinalOrders();

  // just to prefetch
  useBalances();

  const handleCloseNewOrderModal = () => setAddNewOrderModal((s) => ({ ...s, isOpen: false }));

  const selectedTabKey = searchParams.get('market') || undefined;

  const selectedAcceptedOrder = findOrder(orders.acceptedBtc.accepted || [], Number(searchParams.get('order')));
  return (
    <>
      <Flex flex={1} direction='column' gap='spacing6' justifyContent='center'>
        {/* TODO: Replace info banner with FAQ accordion */}
        <Alert status='warning'>
          To fund your account you will need to get Sepolia ETH from a{' '}
          <a href={FAUCET_URL} rel='external' target='_blank'>
            testnet faucet
          </a>{' '}
          and transfer it to the BOB network using{' '}
          <a href={SUPERBRIDGE_URL} rel='external' target='_blank'>
            Superbridge
          </a>
          .
        </Alert>
        <Flex alignItems='center' justifyContent='space-between'>
          <H1 size='xl2' id={titleId}>
            BTC Marketplace
          </H1>
          <CTA onPress={() => setAddNewOrderModal({ isOpen: true, variant: 'BTC' })} size='small'>
            Add an order
          </CTA>
        </Flex>
        <Tabs
          selectedKey={selectedTabKey}
          onSelectionChange={(key) => {
            setSearchParams(() => {
              const newParams = new URLSearchParams();
              newParams.set('market', key as string);
              return newParams;
            });
          }}
        >
          <TabsItem key='buy' title='Buy'>
            <Flex alignItems='center' justifyContent='space-between'>
              <H2 size='xl' id={titleId} style={{ marginTop: theme.spacing.spacing4 }}>
                Buy
              </H2>
            </Flex>
            {orders?.unowned.length ? (
              <OrdersTable
                aria-labelledby={titleId}
                orders={orders?.unowned}
                refetchOrders={refetch}
                refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
                onFillBuyBtc={(order) => {
                  setSearchParams((params) => {
                    params.set('order', order.id.toString());
                    params.set('market', 'buy');
                    return params;
                  });
                }}
              />
            ) : (
              <Flex style={{ minHeight: 200 }} alignItems='center' justifyContent='center'>
                <Spinner color='secondary' />
              </Flex>
            )}
            {activeOrdinalOrders && (
              <OrdinalOrdersTable
                aria-labelledby={titleId}
                orders={activeOrdinalOrders}
                refetchActiveOrdinalOrders={refetchActiveOrdinalOrders}
              />
            )}
            {/* Only unowned BTC orders can be bought */}
            {!!orders?.acceptedBtc.accepted?.length && (
              <>
                <Flex alignItems='center' justifyContent='space-between'>
                  <H2 size='xl' id={titleId2} style={{ marginTop: theme.spacing.spacing4 }}>
                    Accepted BTC Orders
                  </H2>
                </Flex>
                {/* Show all orders in which the current user is either the buyer or the seller */}
                <AcceptedOrdersTable
                  selectedOrder={selectedAcceptedOrder}
                  aria-labelledby={titleId2}
                  orders={orders.acceptedBtc.accepted}
                  refetchOrders={refetch}
                  refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
                />
              </>
            )}
          </TabsItem>
          <TabsItem key='sell' title='Sell'>
            {!!orders?.owned.length && (
              <>
                <Flex alignItems='center' justifyContent='space-between'>
                  <H2 size='xl' id={titleId3} style={{ marginTop: theme.spacing.spacing4 }}>
                    Sell
                  </H2>
                </Flex>
                <OrdersTable
                  aria-labelledby={titleId3}
                  orders={orders?.owned}
                  refetchOrders={refetch}
                  refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
                />
              </>
            )}
            {/* Only owned BTC orders can be sold */}
            {!!orders.acceptedBtc.created?.length && (
              <>
                <Flex alignItems='center' justifyContent='space-between'>
                  <H2 size='xl' id={titleId4} style={{ marginTop: theme.spacing.spacing4 }}>
                    Accepted BTC Orders
                  </H2>
                </Flex>
                <AcceptedOrdersTable
                  aria-labelledby={titleId4}
                  orders={orders?.acceptedBtc.created}
                  refetchOrders={refetch}
                  refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
                />
              </>
            )}
          </TabsItem>
        </Tabs>
      </Flex>
      <AddOrderModal
        isOpen={isAddNewOrderModal.isOpen}
        onClose={handleCloseNewOrderModal}
        refetchOrders={() => {
          refetch();
          refetchAcceptedBtcOrders();
          refetchActiveOrdinalOrders();
        }}
      />
    </>
  );
};

export { P2P };
