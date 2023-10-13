import { CTA, Flex, H1, H2, LoadingSpinner, Tabs, TabsItem } from '@interlay/ui';
import { useCallback, useMemo, useState } from 'react';
import { AcceptedOrdersTable, AddOrderModal, OrdersTable } from './components';
import { useGetActiveErc20Orders } from '../../hooks/fetchers/useGetActiveOrders';
import { useGetActiveBtcBuyOrders } from '../../hooks/fetchers/useGetActiveBtcBuyOrders';
import { useGetAcceptedBtcOrders } from '../../hooks/fetchers/useGetAcceptedBtcOrders';
import { useGetActiveBtcSellOrders } from '../../hooks/fetchers/useGetActiveBtcSellOrders';
import { theme } from '@interlay/theme';

const P2P = (): JSX.Element => {
  const [isAddNewOrderModal, setAddNewOrderModal] = useState<{ isOpen: boolean; variant?: 'ERC20' | 'BTC' }>({
    isOpen: false
  });
  const titleId = 'titleId';
  const titleId2 = 'titleId2';
  const titleId3 = 'titleId3';
  const titleId4 = 'titleId4';

  const { data: erc20Orders, refetch: refetchActiveErc20Orders } = useGetActiveErc20Orders();
  const { data: btcBuyOrders, refetch: refetchBtcBuyOrders } = useGetActiveBtcBuyOrders();
  const { data: btcSellOrders, refetch: refetchBtcSellOrders } = useGetActiveBtcSellOrders();

  const { data: acceptedBtcOrders, refetch: refetchAcceptedBtcOrders } = useGetAcceptedBtcOrders();

  const orders = useMemo(
    () => [
      ...(erc20Orders ? erc20Orders : []),
      ...(btcBuyOrders ? btcBuyOrders : []),
      ...(btcSellOrders ? btcSellOrders : [])
    ],
    [erc20Orders, btcBuyOrders, btcSellOrders]
  );

  // TODO: Merge ownedOrders and ownedAcceptedBtcOrders, and unownedOrders and unownedAcceptedBtcOrders
  // into single arrays.
  const ownedOrders = orders.filter((order) => order.isOwnerOfOrder);
  const unownedOrders = orders.filter((order) => !order.isOwnerOfOrder);
  const ownedAcceptedBtcOrders = acceptedBtcOrders?.filter((order) => order.isOwnerOfOrder);
  const unownedAcceptedBtcOrders = acceptedBtcOrders?.filter((order) => !order.isOwnerOfOrder);

  const refetchOrders = useCallback(() => {
    refetchActiveErc20Orders();
    refetchBtcBuyOrders();
    refetchBtcSellOrders();
  }, [refetchActiveErc20Orders, refetchBtcBuyOrders, refetchBtcSellOrders]);

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
              {unownedOrders.length ? (
                <OrdersTable
                  aria-labelledby={titleId}
                  orders={unownedOrders}
                  refetchOrders={refetchOrders}
                  refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
                />
              ) : (
                <Flex style={{ minHeight: 200 }} alignItems='center' justifyContent='center'>
                  <LoadingSpinner color='secondary' variant='indeterminate' diameter={36} thickness={4} />
                </Flex>
              )}
            </>
            {!!unownedAcceptedBtcOrders?.length && (
              <>
                <Flex alignItems='center' justifyContent='space-between'>
                  <H2 size='xl' id={titleId2} style={{ marginTop: theme.spacing.spacing4 }}>
                    Accepted BTC Orders
                  </H2>
                </Flex>
                <AcceptedOrdersTable
                  aria-labelledby={titleId2}
                  orders={unownedAcceptedBtcOrders}
                  refetchOrders={refetchOrders}
                  refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
                />
              </>
            )}
          </TabsItem>
          <TabsItem key='sell' title='Sell'>
            {!!ownedOrders.length && (
              <>
                <Flex alignItems='center' justifyContent='space-between'>
                  <H2 size='xl' id={titleId3} style={{ marginTop: theme.spacing.spacing4 }}>
                    Sell
                  </H2>
                </Flex>
                <OrdersTable
                  aria-labelledby={titleId3}
                  orders={ownedOrders}
                  refetchOrders={refetchOrders}
                  refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
                />
              </>
            )}
            {!!ownedAcceptedBtcOrders?.length && (
              <>
                <Flex alignItems='center' justifyContent='space-between'>
                  <H2 size='xl' id={titleId4} style={{ marginTop: theme.spacing.spacing4 }}>
                    Accepted BTC Orders
                  </H2>
                </Flex>
                <AcceptedOrdersTable
                  aria-labelledby={titleId4}
                  orders={ownedAcceptedBtcOrders}
                  refetchOrders={refetchOrders}
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
          refetchOrders();
          refetchAcceptedBtcOrders();
        }}
      />
    </>
  );
};

export { P2P };
