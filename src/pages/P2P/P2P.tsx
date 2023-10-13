import { theme } from '@interlay/theme';
import { CTA, Flex, H1, H2, LoadingSpinner, Tabs, TabsItem } from '@interlay/ui';
import { useState } from 'react';
import { useGetOrders } from '../../hooks/fetchers/useGetOrders';
import { AcceptedOrdersTable, AddOrderModal, OrdersTable } from './components';

const P2P = (): JSX.Element => {
  const [isAddNewOrderModal, setAddNewOrderModal] = useState<{ isOpen: boolean; variant?: 'ERC20' | 'BTC' }>({
    isOpen: false
  });
  const titleId = 'titleId';
  const titleId2 = 'titleId2';
  const titleId3 = 'titleId3';
  const titleId4 = 'titleId4';

  const { data: orders, refetch, refetchAcceptedBtcOrders } = useGetOrders();

  const handleCloseNewOrderModal = () => setAddNewOrderModal((s) => ({ ...s, isOpen: false }));

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
        <Tabs>
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
            {!!orders?.acceptedBtc.unowned?.length && (
              <>
                <Flex alignItems='center' justifyContent='space-between'>
                  <H2 size='xl' id={titleId2} style={{ marginTop: theme.spacing.spacing4 }}>
                    Accepted BTC Orders
                  </H2>
                </Flex>
                <AcceptedOrdersTable
                  aria-labelledby={titleId2}
                  orders={orders?.acceptedBtc.unowned}
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
            {!!orders?.acceptedBtc.owned?.length && (
              <>
                <Flex alignItems='center' justifyContent='space-between'>
                  <H2 size='xl' id={titleId4} style={{ marginTop: theme.spacing.spacing4 }}>
                    Accepted BTC Orders
                  </H2>
                </Flex>
                <AcceptedOrdersTable
                  aria-labelledby={titleId4}
                  orders={orders?.acceptedBtc.owned}
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
