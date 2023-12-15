import { Modal, ModalBody, ModalHeader, ModalProps } from '@interlay/ui';
import { useCallback, useState } from 'react';
import { OrdinalOrder } from '../../../../types/orders';
import { FillOrdinalSellOrderForm } from '../FillOrderForm';
import { FillOrdinalSellOrderFormData } from '../FillOrderForm/FillOrdinalSellOrderForm';

type Props = {
  order: OrdinalOrder;
  refetchActiveOrdinalOrders: () => void;
};

type InheritAttrs = Omit<ModalProps, 'children'>;

type FillOrdinalOrderModalProps = Props & InheritAttrs;

const FillOrdinalOrderModal = ({
  order,
  refetchActiveOrdinalOrders,
  onClose,
  ...props
}: FillOrdinalOrderModalProps): JSX.Element => {
  const [isLoading, setLoading] = useState(false);

  // const publicClient = usePublicClient();

  // const { write: writeOrdMarketplace } = useContract(ContractType.ORD_MARKETPLACE);

  const handleFillOrder = useCallback(
    async (data: FillOrdinalSellOrderFormData) => {
      setLoading(true);

      try {
        // TODO: add fill order

        console.log(data);
      } catch (e) {
        return setLoading(false);
      }

      setLoading(false);

      onClose();
      refetchActiveOrdinalOrders();
    },
    [onClose, order, refetchActiveOrdinalOrders]
  );

  return (
    <Modal {...props} align='top' onClose={onClose}>
      <ModalHeader>Fill Order</ModalHeader>
      <ModalBody>
        <FillOrdinalSellOrderForm isLoading={isLoading} onSubmit={handleFillOrder} order={order} />
      </ModalBody>
    </Modal>
  );
};

export { FillOrdinalOrderModal };
export type { FillOrdinalOrderModalProps };
