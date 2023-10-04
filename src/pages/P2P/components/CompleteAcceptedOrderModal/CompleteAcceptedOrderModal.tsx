import { CTA, Input, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P } from '@interlay/ui';
import { useContract } from '../../../../hooks/useContract';
import { ContractType } from '../../../../constants';
import { BtcOrder } from '../../../../types/orders';
import { isBtcOrder } from '../../../../utils/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { usePublicClient } from 'wagmi';

type CompleteAcceptedOrderModalProps = { order: BtcOrder | undefined; refetchOrders: () => void } & Omit<ModalProps, 'children'>;

const CompleteAcceptedOrderModal = ({ onClose, refetchOrders, order, ...props }: CompleteAcceptedOrderModalProps): JSX.Element | null => {

  const { write: writeBTCMarketplace } = useContract(
    ContractType.BTC_MARKETPLACE 
  );
  const publicClient = usePublicClient();

  if(!order) {
    return null
  }

  const handleCloseOrder = async () => {


    // TODO:
    refetchOrders();
    onClose();
  };

  return (
    <Modal {...props} onClose={onClose}>
      <ModalHeader>Complete Order</ModalHeader>
      <ModalBody>
        <P>
          To complete trade send {order.totalAskingAmount.toString()}, you will get back{' '}
          {toBaseAmount(order.availableLiquidity, order.offeringCurrency.ticker)} {order.offeringCurrency.ticker}.
          to bitcoin address:
          <Input isDisabled label='BTC Address' value='dummyBTCAddress' />
        </P>
      </ModalBody>
      <ModalFooter direction='row'>
        <CTA size='large' fullWidth onPress={handleCloseOrder}>
          
        </CTA>
        <CTA variant='primary' size='large' fullWidth onPress={handleCloseOrder}>
          Complete order
        </CTA>
      </ModalFooter>
    </Modal>
  );
};

export { CompleteAcceptedOrderModal };
export type { CompleteAcceptedOrderModalProps };
