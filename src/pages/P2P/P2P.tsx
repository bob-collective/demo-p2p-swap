import { theme } from '@interlay/theme';
import { CTA, Flex, H1, H2, LoadingSpinner, Tabs, TabsItem } from '@interlay/ui';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetOrders } from '../../hooks/fetchers/useGetOrders';
import { useBalances } from '../../hooks/useBalances';
import { useAccount } from 'wagmi';
import { AcceptedOrdersTable, AddOrderModal, OrdersTable } from './components';

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
  const { address } = useAccount();

  // just to prefetch
  useBalances();

  const handleCloseNewOrderModal = () => setAddNewOrderModal((s) => ({ ...s, isOpen: false }));

  const selectedTabKey = searchParams.get('market') || undefined;

  return (
    <>
      <Flex flex={1} direction='column' gap='spacing6' justifyContent='center'>
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
            <>
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
                />
              ) : (
                <Flex style={{ minHeight: 200 }} alignItems='center' justifyContent='center'>
                  <LoadingSpinner color='secondary' variant='indeterminate' diameter={36} thickness={4} />
                </Flex>
              )}
            </>
            {!!orders?.acceptedBtc.owned?.length && (
              <>
                <Flex alignItems='center' justifyContent='space-between'>
                  <H2 size='xl' id={titleId2} style={{ marginTop: theme.spacing.spacing4 }}>
                    Accepted BTC Orders
                  </H2>
                </Flex>
                <AcceptedOrdersTable
                  aria-labelledby={titleId2}
                  orders={orders?.acceptedBtc.owned.filter((order) => order.btcSender === address)}
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
            {!!orders?.acceptedBtc.unowned?.length && (
              <>
                <Flex alignItems='center' justifyContent='space-between'>
                  <H2 size='xl' id={titleId4} style={{ marginTop: theme.spacing.spacing4 }}>
                    Accepted BTC Orders
                  </H2>
                </Flex>
                <AcceptedOrdersTable
                  aria-labelledby={titleId4}
                  orders={orders?.acceptedBtc.unowned.filter((order) => order.btcReceiver === address)}
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
        }}
      />
    </>
  );
};

export { P2P };
