import { Modal, ModalBody, ModalHeader, ModalProps } from '@interlay/ui';
import { useRef } from 'react';
import { AddOrderForm } from '../AddOrderForm';

type AddOrderModalProps = Omit<ModalProps, 'children'>;

const AddOrderModal = ({ onClose, ...props }: AddOrderModalProps): JSX.Element => {
  const offerModalRef = useRef<HTMLDivElement>(null);
  const receiveModalRef = useRef<HTMLDivElement>(null);

  return (
    <Modal
      {...props}
      onClose={onClose}
      shouldCloseOnInteractOutside={(el) =>
        !offerModalRef.current?.contains(el) && !receiveModalRef.current?.contains(el)
      }
    >
      <ModalHeader>New Order</ModalHeader>
      <ModalBody>
        <AddOrderForm offerModalRef={offerModalRef} receiveModalRef={receiveModalRef} onSubmit={onClose} />
      </ModalBody>
    </Modal>
  );
};

export { AddOrderModal };
export type { AddOrderModalProps };
