import { CTA, Flex, H1, H2, Tabs, TabsItem } from '@interlay/ui';
import { useCallback, useMemo, useState } from 'react';
import { AcceptedOrdersTable, AddOrderModal, OrdersTable } from './components';
import { useGetActiveErc20Orders } from '../../hooks/fetchers/useGetActiveOrders';
import { useGetActiveBtcBuyOrders } from '../../hooks/fetchers/useGetActiveBtcBuyOrders';
import { useGetAcceptedBtcOrders } from '../../hooks/fetchers/useGetAcceptedBtcOrders';
import { useGetActiveBtcSellOrders } from '../../hooks/fetchers/useGetActiveBtcSellOrders';

const P2P = (): JSX.Element => {
  const [isAddNewOrderModal, setAddNewOrderModal] = useState<{ isOpen: boolean; variant?: 'ERC20' | 'BTC' }>({
    isOpen: false
  });
  const titleId = 'titleId';
  const titleId2 = 'titleId2';

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

  const ownerOrders = orders.filter((order) => order.isOwnerOfOrder);
  const marketplaceOrders = orders.filter((order) => !order.isOwnerOfOrder);

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
            <OrdersTable
              aria-labelledby={titleId}
              orders={marketplaceOrders}
              refetchOrders={refetchOrders}
              refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
            />
          </TabsItem>
          {!!ownerOrders.length && (
            <TabsItem key='sell' title='Sell'>
              <>
                <OrdersTable
                  aria-labelledby={titleId}
                  orders={ownerOrders}
                  refetchOrders={refetchOrders}
                  refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
                />
              </>
              {/* NEW TABLE */}
              {acceptedBtcOrders?.length && (
                <>
                  <Flex alignItems='center' justifyContent='space-between'>
                    <H2 size='xl' id={titleId2}>
                      Accepted BTC Orders
                    </H2>
                  </Flex>
                  <AcceptedOrdersTable
                    aria-labelledby={titleId2}
                    orders={acceptedBtcOrders}
                    refetchOrders={refetchOrders}
                    refetchAcceptedBtcOrders={refetchAcceptedBtcOrders}
                  />
                </>
              )}
            </TabsItem>
          )}
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
