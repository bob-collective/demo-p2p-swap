import { CTA, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P } from '@interlay/ui';
import { useContract } from '../../../../hooks/useContract';
import { ContractType } from '../../../../constants';
import { Order } from '../../../../types/orders';
import { isBtcOrder } from '../../../../utils/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { usePublicClient } from 'wagmi';

type CancelOrderModalProps = { order: Order | undefined; refetchOrders: () => void } & Omit<ModalProps, 'children'>;

const CancelOrderModal = ({ onClose, refetchOrders, order, ...props }: CancelOrderModalProps): JSX.Element | null => {
  const { write: writeErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);

  const { write: writeBTCMarketplace } = useContract(ContractType.BTC_MARKETPLACE);
  const publicClient = usePublicClient();

  if (!order) {
    return null;
  }

  const handleCloseOrder = async () => {
    const isBTCOrder = order ? isBtcOrder(order) : false;

    const hash = await (isBTCOrder
      ? writeBTCMarketplace.withdrawBtcBuyOrder([order.id])
      : writeErc20Marketplace.withdrawErcErcOrder([order.id]));
    await publicClient.waitForTransactionReceipt({ hash });
    refetchOrders();
    onClose();
  };

  return (
    <Modal {...props} onClose={onClose}>
      <ModalHeader>Cancel Order</ModalHeader>
      <ModalBody>
        <P>
          Cancelling market order #{order.id.toString()}, you will get back{' '}
          {toBaseAmount(order.availableLiquidity, order.offeringCurrency.ticker)} {order.offeringCurrency.ticker}.
        </P>
      </ModalBody>
      <ModalFooter direction='row'>
        <CTA size='large' fullWidth onPress={handleCloseOrder}>
          Back
        </CTA>
        <CTA variant='secondary' size='large' fullWidth onPress={handleCloseOrder}>
          Cancel Order
        </CTA>
      </ModalFooter>
    </Modal>
  );
};

export { CancelOrderModal };
export type { CancelOrderModalProps };
