import { CTA, Input, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P } from '@interlay/ui';
import { useContract } from '../../../../hooks/useContract';
import { Bitcoin, ContractType } from '../../../../constants';
import { toBaseAmount } from '../../../../utils/currencies';
import { usePublicClient } from 'wagmi';
import { AcceptedBtcOrder } from '../../../../types/orders';
import { useBtcTx } from '../../../../hooks/useBtcTx';

type CompleteAcceptedOrderModalProps = {
  order: AcceptedBtcOrder | undefined;
  refetchOrders: () => void;
  refetchAcceptedBtcOrders: () => void;
} & Omit<ModalProps, 'children'>;

const CompleteAcceptedOrderModal = ({
  onClose,
  refetchOrders,
  refetchAcceptedBtcOrders,
  order,
  ...props
}: CompleteAcceptedOrderModalProps): JSX.Element | null => {
  const { write: writeBTCMarketplace } = useContract(ContractType.BTC_MARKETPLACE);
  const publicClient = usePublicClient();

  const { status, txId, confirmations } = useBtcTx(order?.bitcoinAddress);

  if (!order) {
    return null;
  }

  const handleCompleteOrder = async () => {
    const mockedProof = { dummy: BigInt(0) };
    if (order.type === 'buy') {
      const hash = await writeBTCMarketplace.proofBtcBuyOrder([order.acceptId, mockedProof]);
      await publicClient.waitForTransactionReceipt({ hash });
    } else {
      const hash = await writeBTCMarketplace.proofBtcSellOrder([order.acceptId, mockedProof]);
      await publicClient.waitForTransactionReceipt({ hash });
    }

    refetchAcceptedBtcOrders();
    refetchOrders();
    onClose();
  };

  const isSubmissionDisabled = !!confirmations && confirmations < 6;

  console.log(status, txId, confirmations)

  return (
    <Modal {...props} onClose={onClose}>
      <ModalHeader>Complete Order</ModalHeader>
      <ModalBody>
        <P>
          To complete accepted order send {toBaseAmount(order.amountBtc, Bitcoin.ticker)} BTC and submit proof, you will
          get {toBaseAmount(order.otherCurrencyAmount, order.otherCurrency.ticker)} {order.otherCurrency.ticker}.
        </P>
        <Input isDisabled label='Send bitcoin here' value={order.bitcoinAddress} />
        {
          status === "NOT_FOUND" ?
          <>
          Waiting for transaction
          </>
          : status === "IN_MEMPOOL" ?
          <>
          Bitcoin transaction found in mempool with txid {txId};
          </> : <>
          Bitcoin transaction found with {confirmations} / 6 confirmations.
          </>
        }
      </ModalBody>
      <ModalFooter direction='row'>
        <CTA disabled={isSubmissionDisabled} variant='primary' size='large' fullWidth onPress={handleCompleteOrder}>
          Complete order
        </CTA>
      </ModalFooter>
    </Modal>
  );
};

export { CompleteAcceptedOrderModal };
export type { CompleteAcceptedOrderModalProps };
