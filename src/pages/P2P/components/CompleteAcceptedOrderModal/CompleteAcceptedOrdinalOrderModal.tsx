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
import * as bitcoin from 'bitcoinjs-lib';
import QrCode from 'qrcode.react';
import { DefaultElectrsClient } from '@gobob/bob-sdk';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePublicClient } from 'wagmi';
import { Inscription } from '../../../../components';
import { AuthCTA } from '../../../../components/AuthCTA';
import { Bitcoin, ContractType, REQUIRED_BITCOIN_CONFIRMATIONS } from '../../../../constants';
import { useContract } from '../../../../hooks/useContract';
import { useOrdinalTx } from '../../../../hooks/useOrdinalTx';
import { useAccount } from '../../../../lib/sats-wagmi';
import { AcceptedOrdinalOrder } from '../../../../types/orders';
import { BITCOIN_NETWORK, getElectrsUrl } from '../../../../utils/bitcoin';
import { toBaseAmount } from '../../../../utils/currencies';
import { ordinalIdToString } from '../../../../utils/format';
import { truncateInscriptionId } from '../../../../utils/truncate';
import { StyledSpinner } from './CompleteAcceptedOrderModal.styles';
import { shortenBitcoinAddress } from '../../../../utils/string';

export async function broadcastTx(txHex: string): Promise<string> {
  const res = await fetch(`${getElectrsUrl()}/tx`, {
    method: 'POST',
    body: txHex
  });
  return await res.text();
}

type CompleteAcceptedOrdinalOrderModalProps = {
  order: AcceptedOrdinalOrder | undefined;
  refetchOrders: () => void;
} & Omit<ModalProps, 'children'>;

const CompleteAcceptedOrdinalOrderModal = ({
  onClose,
  refetchOrders,
  order,
  ...props
}: CompleteAcceptedOrdinalOrderModalProps): JSX.Element | null => {
  const [, setSearchParams] = useSearchParams();
  const { write: writeOrdinalMarketplace } = useContract(ContractType.ORD_MARKETPLACE);
  const publicClient = usePublicClient();
  const { connector } = useAccount();

  const [isLoading, setLoading] = useState(false);

  const { status, txId, confirmations, proofData } = useOrdinalTx(order?.buyerBitcoinAddress, order?.utxo);

  if (!order) {
    return null;
  }

  const handleSendInscription = async () => {
    const { utxo } = order;
    const electrsClient = new DefaultElectrsClient(BITCOIN_NETWORK);
    const signer = connector?.getSigner();

    if (!signer) return;

    const psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet });

    const txIdWithIndex = utxo.txHash.substring(2);

    const [txId] = txIdWithIndex.split('i');

    const txHex = await electrsClient.getTransactionHex(txId);
    const utx = bitcoin.Transaction.fromHex(txHex);

    // const internalPubKey = Buffer.from(await signer.getPublicKey(), 'hex');

    psbt.addInput({
      hash: txId,
      index: utxo.txOutputIndex,
      witnessUtxo: {
        script: utx.outs[utxo.txOutputIndex].script,
        value: Number(utxo.txOutputValue)
      }
      // tapInternalKey: internalPubKey,
      // sighashType: 3 || 0x80
    });

    // psbt.addOutput({
    //   address: order.buyerBitcoinAddress,
    //   value: Number(utxo.txOutputValue) - 80000
    // });

    // const tx = await connector?.signPsbt([psbt.toHex()]);

    // return broadcastTx(tx as string);
  };

  const handleCompleteOrder = async () => {
    if (!proofData) {
      return;
    }

    setLoading(true);
    try {
      // Use this bitcoin headers data to submit them to relay if the difficulty changed.
      console.log('Submitting proof with bitcoin headers:', proofData.proof.bitcoinHeaders);

      const txHash = await writeOrdinalMarketplace.proofOrdinalSellOrder([
        order.acceptId,
        proofData.info,
        proofData.proof
      ]);

      await publicClient.waitForTransactionReceipt({ hash: txHash });
    } catch (e) {
      setLoading(false);
    }

    setLoading(false);

    setSearchParams(() => {
      return new URLSearchParams('market=buy');
    });

    refetchOrders();

    onClose();
  };

  const isSubmissionDisabled = !confirmations || !proofData || confirmations < REQUIRED_BITCOIN_CONFIRMATIONS;

  return (
    <Modal {...props} align='top' onClose={onClose}>
      <ModalHeader>Complete Order</ModalHeader>
      <ModalBody gap='spacing8'>
        <Flex gap='spacing3' direction='column'>
          {order.brc20Amount ? (
            <>
              <P size='s'>
                1. Transfer{' '}
                <Strong color='secondary'>
                  {order.brc20Amount.toBig().toString()} {order.brc20Amount.currency.ticker}
                </Strong>{' '}
                to <Strong color='secondary'>{shortenBitcoinAddress(order.buyerBitcoinAddress)}</Strong> by using the
                following button:
              </P>
              <CTA disabled={status !== 'NOT_FOUND'} fullWidth size='large' onPress={() => handleSendInscription()}>
                Transfer
              </CTA>
            </>
          ) : (
            <>
              {' '}
              <Flex direction='column' gap='spacing2'>
                <Inscription height={200} id={ordinalIdToString(order.ordinalId)} />
                <Flex justifyContent='center'>
                  <TextLink
                    external
                    icon
                    href={`https://testnet.ordinals.com/inscription/${ordinalIdToString(order.ordinalId)}`}
                    size='s'
                  >
                    {truncateInscriptionId(ordinalIdToString(order.ordinalId))}
                  </TextLink>
                </Flex>
              </Flex>
              <Flex gap='spacing2' direction='column' justifyContent='center' alignItems='center'>
                <Card
                  rounded='lg'
                  variant='bordered'
                  shadowed={false}
                  padding='spacing3'
                  alignItems='center'
                  background='tertiary'
                >
                  <P size='xs'>{order.buyerBitcoinAddress}</P>
                </Card>
                <QrCode
                  includeMargin
                  value={`bitcoin:${order.buyerBitcoinAddress}?amount=${toBaseAmount(0n, Bitcoin.ticker)}`}
                />
              </Flex>
            </>
          )}
          <P size='s'>2. Submit your transaction proof by clicking on Complete order.</P>
          <P size='s'>
            3. Once the order is completed you will receive{' '}
            <Strong color='secondary'>
              {toBaseAmount(order.totalAskingAmount, order.askingCurrency.ticker)} {order.askingCurrency.ticker}
            </Strong>
          </P>
        </Flex>
        <Card variant='bordered' background='secondary' alignItems='center' justifyContent='center'>
          {status === 'NOT_FOUND' ? (
            <Flex gap='spacing2' alignItems='center'>
              <StyledSpinner thickness={2} />
              <P size='s'>Waiting for bitcoin transaction to be made...</P>
            </Flex>
          ) : (
            <Flex alignItems='center' gap='spacing2'>
              {isSubmissionDisabled && <StyledSpinner thickness={2} />}
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

export { CompleteAcceptedOrdinalOrderModal };
export type { CompleteAcceptedOrdinalOrderModalProps };
