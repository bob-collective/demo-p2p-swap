import { CTA, Flex, H1 } from '@interlay/ui';
import { useCallback, useMemo, useState } from 'react';
import { AddOrderModal, OrdersTable } from './components';
import { useGetActiveErc20Orders } from '../../hooks/fetchers/useGetActiveOrders';
import { useGetActiveBtcBuyOrders } from '../../hooks/fetchers/useGetActiveBtcBuyOrders';

const P2P = () => {
  const [isAddNewOrderModal, setAddNewOrderModal] = useState<{ isOpen: boolean; variant?: 'ERC20' | 'BTC' }>({
    isOpen: false
  });
  const titleId = 'titleId';

  const { data: erc20Orders, refetch: refetchActiveErc20Orders } = useGetActiveErc20Orders();
  const { data: btcBuyOrders, refetch: refetchBtcBuyOrders } = useGetActiveBtcBuyOrders();

  const orders = useMemo(
    () => [...(erc20Orders ? erc20Orders : []), ...(btcBuyOrders ? btcBuyOrders : [])],
    [erc20Orders, btcBuyOrders]
  );
  const refetchOrders = useCallback(() => {
    refetchActiveErc20Orders();
    refetchBtcBuyOrders();
  }, [refetchActiveErc20Orders, refetchBtcBuyOrders]);

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
        {/* NEW TABLE */}
        <OrdersTable aria-labelledby={titleId} orders={orders} refetchOrders={refetchOrders} />
      </Flex>
      <AddOrderModal
        isOpen={isAddNewOrderModal.isOpen}
        onClose={handleCloseNewOrderModal}
        refetchOrders={refetchActiveErc20Orders}
      />
    </>
  );
};

export { P2P };
