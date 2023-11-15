import { CTA, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P } from '@interlay/ui';
import { useContract } from '../../../../hooks/useContract';
import { ContractType } from '../../../../constants';
import { Order } from '../../../../types/orders';
import { isBtcBuyOrder, isBtcSellOrder } from '../../../../utils/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { usePublicClient } from 'wagmi';
import { useState } from 'react';
import { AuthCTA } from '../../../../components/AuthCTA';

type CancelOrderModalProps = { order: Order | undefined; refetchOrders: () => void } & Omit<ModalProps, 'children'>;

const CancelOrderModal = ({ onClose, refetchOrders, order, ...props }: CancelOrderModalProps): JSX.Element | null => {
  const { write: writeErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);

  const { write: writeBTCMarketplace } = useContract(ContractType.BTC_MARKETPLACE);

  const publicClient = usePublicClient();

  const [isLoading, setLoading] = useState(false);

  if (!order) {
    return null;
  }

  const handleCloseOrder = async () => {
    setLoading(true);
    try {
      const hash = await (isBtcBuyOrder(order)
        ? writeBTCMarketplace('withdrawBtcBuyOrder', [order.id])
        : isBtcSellOrder(order)
        ? writeBTCMarketplace('withdrawBtcSellOrder', [order.id])
        : writeErc20Marketplace('withdrawErcErcOrder', [order.id]));
      await publicClient.waitForTransactionReceipt({ hash });
      refetchOrders();
      onClose();
    } catch (e) {
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <Modal {...props} align='top' onClose={onClose}>
      <ModalHeader>Cancel Order</ModalHeader>
      <ModalBody>
        <P>
          Cancelling market order #{order.id.toString()}, you will get back{' '}
          {toBaseAmount(order.availableLiquidity, order.offeringCurrency.ticker)} {order.offeringCurrency.ticker}.
        </P>
      </ModalBody>
      <ModalFooter direction='row'>
        <CTA size='large' fullWidth onPress={onClose}>
          Back
        </CTA>
        <AuthCTA loading={isLoading} variant='secondary' size='large' fullWidth onPress={handleCloseOrder}>
          Cancel Order
        </AuthCTA>
      </ModalFooter>
    </Modal>
  );
};

export { CancelOrderModal };
export type { CancelOrderModalProps };
