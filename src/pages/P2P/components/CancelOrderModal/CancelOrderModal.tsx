import { CTA, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P } from '@interlay/ui';
import { Erc20Order } from '../../../../hooks/fetchers/useGetActiveOrders';
import { useContract } from '../../../../hooks/useContract';
import { ContractType } from '../../../../constants';
import { toBaseAmountErc20 } from '../../../../utils/currencies';
import { usePublicClient } from 'wagmi';

type CancelOrderModalProps = { order: Erc20Order | undefined, refetchOrders: () => void } & Omit<ModalProps, 'children'>;

const CancelOrderModal = ({ onClose, refetchOrders, order, ...props }: CancelOrderModalProps): JSX.Element => {
  const {write: writeErc20Marketplace} = useContract(ContractType.ERC20_MARKETPLACE);
  const publicClient = usePublicClient();

  if (!order) {
    // TODO: handle better.
    return <></>;
  }

  const handleCloseOrder = async() => {
    const hash = await writeErc20Marketplace.withdrawErcErcOrder([order.id]);
    await publicClient.waitForTransactionReceipt({hash});
    refetchOrders()
    onClose();
  }

  return (
    <Modal {...props} onClose={onClose}>
      <ModalHeader>Cancel Order</ModalHeader>
      <ModalBody>
        <P>Cancelling market order #{order.id.toString()}, you will get back {toBaseAmountErc20(order.availableLiquidity, order.offeringCurrency.ticker)} {order.offeringCurrency.ticker}.</P>
      </ModalBody>
      <ModalFooter direction='row'>
        <CTA size='large' fullWidth onPress={handleCloseOrder}>
          Back
        </CTA>
        <CTA size='large' fullWidth onPress={handleCloseOrder}>
          Cancel Order
        </CTA>
      </ModalFooter>
    </Modal>
  );
};

export { CancelOrderModal };
export type { CancelOrderModalProps };
