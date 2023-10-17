import { CTA, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P } from '@interlay/ui';
import { useContract } from '../../../../hooks/useContract';
import { ContractType } from '../../../../constants';
import { AcceptedBtcOrder } from '../../../../types/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { usePublicClient } from 'wagmi';
import { AuthCTA } from '../../../../components/AuthCTA';
import { useState } from 'react';

type CancelAcceptedOrderModalProps = { order: AcceptedBtcOrder | undefined; refetchOrders: () => void } & Omit<
  ModalProps,
  'children'
>;

const CancelAcceptedOrderModal = ({
  onClose,
  refetchOrders,
  order,
  ...props
}: CancelAcceptedOrderModalProps): JSX.Element | null => {
  const [isLoading, setLoading] = useState(false);
  const { write: writeBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);
  const publicClient = usePublicClient();
  if (!order) {
    return null;
  }

  const handleCancelOrder = async () => {
    const isBuyOrder = order.type === 'buy';
    setLoading(true);

    try {
      const hash = await (isBuyOrder
        ? writeBtcMarketplace.cancelAcceptedBtcBuyOrder([order.acceptId])
        : writeBtcMarketplace.cancelAcceptedBtcSellOrder([order.acceptId]));
      await publicClient.waitForTransactionReceipt({ hash });
    } catch (e) {
      setLoading(false);
    }

    setLoading(false);
    refetchOrders();
    onClose();
  };

  return (
    <Modal {...props} align='top' onClose={onClose}>
      <ModalHeader>Cancel Order</ModalHeader>
      <ModalBody>
        <P>
          Cancelling accepted BTC order #{order.acceptId.toString()}, you will get back{' '}
          {toBaseAmount(order.otherCurrencyAmount, order.otherCurrency.ticker)} {order.otherCurrency.ticker}.
        </P>
      </ModalBody>
      <ModalFooter direction='row'>
        <CTA size='large' fullWidth onPress={handleCancelOrder}>
          Back
        </CTA>
        <AuthCTA loading={isLoading} variant='secondary' size='large' fullWidth onPress={handleCancelOrder}>
          Cancel Order
        </AuthCTA>
      </ModalFooter>
    </Modal>
  );
};

export { CancelAcceptedOrderModal };
export type { CancelAcceptedOrderModalProps };
