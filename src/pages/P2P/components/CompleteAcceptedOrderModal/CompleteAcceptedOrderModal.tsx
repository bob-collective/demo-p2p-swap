import { Card, Flex, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P, Strong, TextLink } from '@interlay/ui';
import QrCode from 'qrcode.react';
import { usePublicClient } from 'wagmi';

import { AuthCTA } from '../../../../components/AuthCTA';
import { Bitcoin, ContractType, REQUIRED_BITCOIN_CONFIRMATIONS } from '../../../../constants';
import { useBtcTx } from '../../../../hooks/useBtcTx';
import { useContract } from '../../../../hooks/useContract';
import { AcceptedBtcOrder } from '../../../../types/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { StyledLoadingSpinner } from './CompleteAcceptedOrderModal.styles';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  const [, setSearchParams] = useSearchParams();
  const { write: writeBTCMarketplace } = useContract(ContractType.BTC_MARKETPLACE);
  const publicClient = usePublicClient();

  const [isLoading, setLoading] = useState(false);

  const { status, txId, confirmations, proofData } = useBtcTx(order?.bitcoinAddress, order?.amountBtc);

  if (!order) {
    return null;
  }

  const handleCompleteOrder = async () => {
    if (!proofData) {
      return;
    }

    setLoading(true);

    try {
      if (order.type === 'buy') {
        const hash = await writeBTCMarketplace.proofBtcBuyOrder([order.acceptId, proofData.info, proofData.proof]);
        await publicClient.waitForTransactionReceipt({ hash });
      } else {
        const hash = await writeBTCMarketplace.proofBtcSellOrder([order.acceptId, proofData.info, proofData.proof]);
        await publicClient.waitForTransactionReceipt({ hash });
      }
    } catch (e) {
      setLoading(false);
    }

    setLoading(false);

    setSearchParams(() => {
      return new URLSearchParams('market=buy');
    });

    refetchAcceptedBtcOrders();
    refetchOrders();

    onClose();
  };

  const isSubmissionDisabled = !confirmations || !proofData || confirmations < REQUIRED_BITCOIN_CONFIRMATIONS;

  return (
    <Modal {...props} align='top' onClose={onClose}>
      <ModalHeader>Complete Order</ModalHeader>
      <ModalBody gap='spacing8'>
        <Flex gap='spacing3' direction='column'>
          <P size='s'>
            1. Send <Strong color='secondary'>{toBaseAmount(order.amountBtc, Bitcoin.ticker)} BTC</Strong> to the
            following bitcoin address:
          </P>
          <Flex gap='spacing2' direction='column' justifyContent='center' alignItems='center'>
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
            <QrCode
              includeMargin
              value={`bitcoin:${order.bitcoinAddress}?amount=${toBaseAmount(order.amountBtc, Bitcoin.ticker)}`}
            />
          </Flex>
          <P size='s'>2. Submit your transaction proof by clicking on Complete order.</P>
          <P size='s'>
            3. Once the order is completed you will receive{' '}
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
                <TextLink external href={`https://mempool.space/testnet/tx/${txId}`}>
                  {txId?.slice(0, 4)}...{txId?.slice(txId.length - 4)}
                </TextLink>
                ) with{' '}
                <Strong color='secondary'>
                  {confirmations} / {REQUIRED_BITCOIN_CONFIRMATIONS}
                </Strong>{' '}
                confirmation.
              </P>
            </Flex>
          )}
        </Card>
      </ModalBody>
      <ModalFooter direction='row'>
        <AuthCTA
          loading={isLoading}
          disabled={isSubmissionDisabled}
          variant='primary'
          size='large'
          fullWidth
          onPress={handleCompleteOrder}
        >
          Complete order
        </AuthCTA>
      </ModalFooter>
    </Modal>
  );
};

export { CompleteAcceptedOrderModal };
export type { CompleteAcceptedOrderModalProps };
