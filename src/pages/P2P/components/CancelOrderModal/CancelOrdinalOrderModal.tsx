import { CTA, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P } from '@interlay/ui';
import { useState } from 'react';
import { usePublicClient } from 'wagmi';
import { Inscription } from '../../../../components';
import { AuthCTA } from '../../../../components/AuthCTA';
import { ContractType } from '../../../../constants';
import { useContract } from '../../../../hooks/useContract';
import { OrdinalOrder } from '../../../../types/orders';

type CancelOrdinalOrderModalProps = { order: OrdinalOrder | undefined; refetchOrdinalOrders: () => void } & Omit<
  ModalProps,
  'children'
>;

const CancelOrdinalOrderModal = ({
  onClose,
  refetchOrdinalOrders,
  order,
  ...props
}: CancelOrdinalOrderModalProps): JSX.Element | null => {
  const { write: writeOrdMarketplace } = useContract(ContractType.ORD_MARKETPLACE);

  const publicClient = usePublicClient();

  const [isLoading, setLoading] = useState(false);

  if (!order) {
    return null;
  }

  const handleCloseOrder = async () => {
    setLoading(true);
    try {
      const hash = await writeOrdMarketplace.withdrawOrdinalSellOrder([order.id]);
      await publicClient.waitForTransactionReceipt({ hash });
      refetchOrdinalOrders();
      onClose();
    } catch (e) {
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <Modal {...props} align='top' onClose={onClose}>
      <ModalHeader>Cancel Order</ModalHeader>
      <ModalBody gap='spacing4'>
        <P>
          Cancelling market order #{order.id.toString()} of inscription {order.ordinalId}
        </P>
        <Inscription id={order.ordinalId} height={200} />
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

export { CancelOrdinalOrderModal };
export type { CancelOrdinalOrderModalProps };
