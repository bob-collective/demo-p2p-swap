import {
  CTA,
  Card,
  Flex,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  P,
  Strong,
  TextLink
} from '@interlay/ui';
import { usePublicClient } from 'wagmi';
import { Bitcoin, ContractType } from '../../../../constants';
import { useBtcTx } from '../../../../hooks/useBtcTx';
import { useContract } from '../../../../hooks/useContract';
import { AcceptedBtcOrder } from '../../../../types/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { StyledLoadingSpinner } from './CompleteAcceptedOrderModal.styles';

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

  const isSubmissionDisabled = !confirmations || confirmations < 6;

  console.log(status, txId, confirmations);

  return (
    <Modal {...props} onClose={onClose}>
      <ModalHeader>Complete Order</ModalHeader>
      <ModalBody gap='spacing8'>
        <Flex gap='spacing3' direction='column'>
          <Flex gap='spacing2' direction='column'>
            <P size='s'>
              1. Send <Strong color='secondary'>{toBaseAmount(order.amountBtc, Bitcoin.ticker)} BTC</Strong> to the
              following bitcoin address:
            </P>
            <Card
              rounded='lg'
              variant='bordered'
              shadowed={false}
              padding='spacing3'
              alignItems='center'
              background='tertiary'
            >
              <P size='s'>{order.bitcoinAddress}</P>
            </Card>
          </Flex>
          <P size='s'>2. Submit your transaction proof.</P>
          <P size='s'>
            3. Once the order is complete you will receive{' '}
            <Strong color='secondary'>
              {toBaseAmount(order.otherCurrencyAmount, order.otherCurrency.ticker)} {order.otherCurrency.ticker}
            </Strong>
          </P>
        </Flex>
        <Card variant='bordered' background='secondary' alignItems='center' justifyContent='center'>
          {status === 'NOT_FOUND' ? (
            <Flex gap='spacing2'>
              <StyledLoadingSpinner variant='indeterminate' diameter={18} thickness={2} />
              <P size='s'>Waiting for bitcoin transaction to be made...</P>
            </Flex>
          ) : (
            <Flex alignItems='center' gap='spacing2'>
              {isSubmissionDisabled && <StyledLoadingSpinner variant='indeterminate' diameter={18} thickness={2} />}
              <P size='s'>
                Bitcoin transaction found (
                <TextLink external href={`http://127.0.0.1:3002/tx/${txId}`}>
                  {txId?.slice(0, 4)}...{txId?.slice(txId.length - 4)}
                </TextLink>
                ) with <Strong color='secondary'>{confirmations} / 6</Strong> confirmations.
              </P>
            </Flex>
          )}
        </Card>
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
