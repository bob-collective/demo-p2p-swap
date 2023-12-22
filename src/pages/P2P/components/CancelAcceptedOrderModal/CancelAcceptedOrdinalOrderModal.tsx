import { CTA, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P } from '@interlay/ui';
import { useState } from 'react';
import { usePublicClient } from 'wagmi';
import { AuthCTA } from '../../../../components/AuthCTA';
import { ContractType } from '../../../../constants';
import { useContract } from '../../../../hooks/useContract';
import { AcceptedOrdinalOrder } from '../../../../types/orders';
import { Inscription } from '../../../../components';
import { ordinalIdToString } from '../../../../utils/format';
import { truncateInscriptionId } from '../../../../utils/truncate';

type CancelOrdinalAcceptedOrderModalProps = {
  order: AcceptedOrdinalOrder | undefined;
  refetchOrders: () => void;
} & Omit<ModalProps, 'children'>;

const CancelOrdinalAcceptedOrderModal = ({
  onClose,
  refetchOrders,
  order,
  ...props
}: CancelOrdinalAcceptedOrderModalProps): JSX.Element | null => {
  const [isLoading, setLoading] = useState(false);
  const { write: writeOrdMarketplace } = useContract(ContractType.ORD_MARKETPLACE);
  const publicClient = usePublicClient();
  if (!order) {
    return null;
  }

  const handleCancelOrder = async () => {
    setLoading(true);

    try {
      const hash = await writeOrdMarketplace.cancelAcceptedOrdinalSellOrder([order.acceptId]);
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
      <ModalBody gap='spacing4'>
        <P size='s'>Cancelling market order #{order.acceptId.toString()} of inscription the following inscription</P>
        <Inscription id={ordinalIdToString(order.ordinalId)} height={200} />
        <P size='s' align='center'>
          {truncateInscriptionId(ordinalIdToString(order.ordinalId))}
        </P>
      </ModalBody>
      <ModalFooter direction='row'>
        <CTA size='large' fullWidth onPress={onClose}>
          Back
        </CTA>
        <AuthCTA loading={isLoading} variant='secondary' size='large' fullWidth onPress={handleCancelOrder}>
          Cancel Order
        </AuthCTA>
      </ModalFooter>
    </Modal>
  );
};

export { CancelOrdinalAcceptedOrderModal };
export type { CancelOrdinalAcceptedOrderModalProps };
