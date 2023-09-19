import { CTA, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P } from '@interlay/ui';

type CancelOrderModalProps = Omit<ModalProps, 'children'>;

const CancelOrderModal = ({ onClose, ...props }: CancelOrderModalProps): JSX.Element => {
  return (
    <Modal {...props} onClose={onClose}>
      <ModalHeader>Cancel Order</ModalHeader>
      <ModalBody>
        <P>You've sold 0 BTC of 0.1 BTC</P>
      </ModalBody>
      <ModalFooter direction='row'>
        <CTA size='large' fullWidth onPress={onClose}>
          Back
        </CTA>
        <CTA size='large' fullWidth onPress={onClose}>
          Cancel Order
        </CTA>
      </ModalFooter>
    </Modal>
  );
};

export { CancelOrderModal };
export type { CancelOrderModalProps };
