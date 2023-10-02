import { CTA, Flex, H1 } from '@interlay/ui';
import { useState } from 'react';
import { AddOrderModal, OrdersTable } from './components';
import { useGetActiveErc20Orders } from '../../hooks/fetchers/useGetActiveOrders';

const P2P = () => {
  const [isAddNewOrderModal, setAddNewOrderModal] = useState(false);
  const titleId = 'titleId';

  const { data: orders, refetch: refetchActiveErc20Orders } = useGetActiveErc20Orders();

  const handleCloseNewOrderModal = () => setAddNewOrderModal(false);

  return (
    <>
      <Flex flex={1} direction='column' gap='spacing6' justifyContent='center'>
        <Flex alignItems='center' justifyContent='space-between'>
          <H1 size='xl2' id={titleId}>
            Over the counter trading
          </H1>
          <CTA onPress={() => setAddNewOrderModal(true)} size='small'>
            Add an order
          </CTA>
        </Flex>
        <OrdersTable aria-labelledby={titleId} orders={orders} refetchOrders={refetchActiveErc20Orders} />
      </Flex>
      <AddOrderModal
        isOpen={isAddNewOrderModal}
        onClose={handleCloseNewOrderModal}
        refetchOrders={refetchActiveErc20Orders}
      />
    </>
  );
};

export { P2P };
