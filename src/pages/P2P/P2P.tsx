import { theme } from '@interlay/theme';
import { Alert, CTA, Flex, H1, H2, Spinner, Tabs, TabsItem } from '@interlay/ui';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BRIDGE_URL, FAUCET_URL } from '../../constants/links';
import { useGetInscriptions } from '../../hooks/fetchers/useGetInscriptions';
import { useGetOrders } from '../../hooks/fetchers/useGetOrders';
import { useBalances } from '../../hooks/useBalances';
import { AcceptedBtcOrder } from '../../types/orders';
import { AcceptedOrdersTable, AddOrderModal, OrdersTable } from './components';
import { AcceptedOrdinalOrdersTable } from './components/AcceptedOrdersTable/AcceptedOrdinalOrdersTable';
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
  const titleId5 = 'titleId5';
  const titleId6 = 'titleId6';

  const {
    data: orders,
    refetch,
    refetchAcceptedBtcOrders,
    refetchAcceptedOrdinalOrders,
    refetchActiveOrdinalOrders
  } = useGetOrders();

  // just to prefetch
  useBalances();
  useGetInscriptions();

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
          and transfer it to the BOB network using our{' '}
          <a href={BRIDGE_URL} rel='external' target='_blank'>
            bridge
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
            {!!orders.ordinal.unowned.length && (
              <OrdinalOrdersTable aria-labelledby={titleId} orders={orders.ordinal.unowned} refetchOrders={refetch} />
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
            {!!orders?.ordinal.accepted.accepted.length && (
              <>
                <Flex alignItems='center' justifyContent='space-between'>
                  <H2 size='xl' id={titleId5} style={{ marginTop: theme.spacing.spacing4 }}>
                    Accepted Ordinals Orders
                  </H2>
                </Flex>
                {/* Show all orders in which the current user is either the buyer or the seller */}
                <AcceptedOrdinalOrdersTable
                  aria-labelledby={titleId5}
                  orders={orders.ordinal.accepted.accepted}
                  refetchOrders={refetchAcceptedOrdinalOrders}
                />
              </>
            )}
          </TabsItem>
          <TabsItem key='sell' title='Sell'>
            {(!!orders?.owned.length || orders.ordinal.owned.length) && (
              <>
                <Flex alignItems='center' justifyContent='space-between'>
                  <H2 size='xl' id={titleId3} style={{ marginTop: theme.spacing.spacing4 }}>
                    Sell
                  </H2>
                </Flex>
                {!!orders?.owned.length && (
                  <OrdersTable
                    aria-labelledby={titleId3}
                    orders={orders?.owned}
                    refetchOrders={refetch}
                    refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
                  />
                )}
                {!!orders.ordinal.owned.length && (
                  <OrdinalOrdersTable
                    aria-labelledby={titleId}
                    orders={orders.ordinal.owned}
                    refetchOrders={refetchActiveOrdinalOrders}
                  />
                )}
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
            {!!orders.ordinal.accepted.created.length && (
              <>
                <Flex alignItems='center' justifyContent='space-between'>
                  <H2 size='xl' id={titleId6} style={{ marginTop: theme.spacing.spacing4 }}>
                    Accepted Ordinals Orders
                  </H2>
                </Flex>
                {/* Show all orders in which the current user is either the buyer or the seller */}
                <AcceptedOrdinalOrdersTable
                  aria-labelledby={titleId6}
                  orders={orders.ordinal.accepted.created}
                  refetchOrders={refetchAcceptedOrdinalOrders}
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
