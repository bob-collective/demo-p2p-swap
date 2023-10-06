import { CTA, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P } from '@interlay/ui';
import { useContract } from '../../../../hooks/useContract';
import { ContractType } from '../../../../constants';
import { AcceptedBtcOrder } from '../../../../types/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { usePublicClient } from 'wagmi';

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
  const { write: writeErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);

  const { write: writeBTCMarketplace } = useContract(ContractType.BTC_MARKETPLACE);
  const publicClient = usePublicClient();

  if (!order) {
    return null;
  }

  const handleCancelOrder = async () => {
    const isBuyOrder = order.type === 'buy';

    const hash = await (isBuyOrder
      ? writeBTCMarketplace.cancelAcceptedBtcBuyOrder([order.acceptId])
      : writeErc20Marketplace.cancelAcceptedBtcSellOrder([order.acceptId]));
    await publicClient.waitForTransactionReceipt({ hash });
    refetchOrders();
    onClose();
  };

  return (
    <Modal {...props} onClose={onClose}>
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
        <CTA variant='secondary' size='large' fullWidth onPress={handleCancelOrder}>
          Cancel Order
        </CTA>
      </ModalFooter>
    </Modal>
  );
};

export { CancelAcceptedOrderModal };
export type { CancelAcceptedOrderModalProps };
