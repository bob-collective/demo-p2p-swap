import { createTextInscription, inscribeData } from '@gobob/bob-sdk';
import { Modal, ModalBody, ModalHeader, ModalProps, P, TabsItem } from '@interlay/ui';
import * as bitcoinjsLib from 'bitcoinjs-lib';
import { useCallback, useRef, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { ContractType, Erc20Currency, currencies } from '../../../../constants';
import { InscriptionId } from '../../../../hooks/ordinalsApi';
import { useContract } from '../../../../hooks/useContract';
import { useOrdinalsAPI } from '../../../../hooks/useOrdinalsAPI';
import { useAccount as useBtcAccount } from '../../../../lib/sats-wagmi';
import { Amount } from '../../../../utils/amount';
import { getBlockStreamUrl, getScriptPubKeyFromAddress } from '../../../../utils/bitcoin';
import { isBitcoinCurrency, isErc20Currency } from '../../../../utils/currencies';
import { addHexPrefix } from '../../../../utils/encoding';
import { AddBrc20OrderForm, AddBrc20OrderFormData } from '../AddBrc20OrderForm';
import { AddOrderForm } from '../AddOrderForm';
import { AddOrderFormData } from '../AddOrderForm/AddOrderForm';
import { AddOrdinalOrderForm, AddOrdinalOrderFormData } from '../AddOrdinalOrderForm';
import { StyledTabs, StyledWrapper } from './AddOrderModal.style';

async function getFeeRate(): Promise<number> {
  const res = await fetch(`${getBlockStreamUrl()}/fee-estimates`);
  const feeRates = await res.json();
  return feeRates['6']; // one hour
}

const parseInscriptionId = (id: string): InscriptionId => {
  if (id.length < 65) {
    throw new Error('Incorrect inscription id length.');
  }

  const txid = id.slice(0, 64);
  const index = parseInt(id.slice(65));

  return {
    txid,
    index
  };
};

type AddOrderModalProps = { refetchOrders: () => void } & Omit<ModalProps, 'children'>;

const AddOrderModal = ({ onClose, refetchOrders, ...props }: AddOrderModalProps): JSX.Element => {
  const selectInscriptionModalRef = useRef<HTMLDivElement>(null);
  const offerModalRef = useRef<HTMLDivElement>(null);
  const receiveModalRef = useRef<HTMLDivElement>(null);
  const selectTokenModalRef = useRef<HTMLDivElement>(null);

  const { write: writeErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);
  const { write: writeBTCMarketplace } = useContract(ContractType.BTC_MARKETPLACE);
  const { write: writeOrdMarketplace } = useContract(ContractType.ORD_MARKETPLACE);

  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { address: btcAddress, connector: btcConnector } = useBtcAccount();

  const [isLoading, setLoading] = useState(false);

  const handleAddOrder = useCallback(
    async ({ inputTicker, outputTicker, inputValue, outputValue, btcAddress }: AddOrderFormData) => {
      if (!inputTicker || !outputTicker || !inputValue || !outputValue || !address) {
        return;
      }

      const inputCurrency = currencies[inputTicker];
      const outputCurrency = currencies[outputTicker];
      const inputAtomicAmount = new Amount(inputCurrency, inputValue, true).toAtomic();
      const outputAtomicAmount = new Amount(outputCurrency, outputValue, true).toAtomic();

      setLoading(true);

      try {
        let tx;

        if (isBitcoinCurrency(outputCurrency)) {
          if (!btcAddress) return;
          const bitcoinAddress = { scriptPubKey: getScriptPubKeyFromAddress(btcAddress) };
          tx = await writeBTCMarketplace.placeBtcBuyOrder([
            outputAtomicAmount,
            bitcoinAddress,
            (inputCurrency as Erc20Currency).address,
            inputAtomicAmount
          ]);
        } else if (isBitcoinCurrency(inputCurrency)) {
          tx = await writeBTCMarketplace.placeBtcSellOrder([
            inputAtomicAmount,
            (outputCurrency as Erc20Currency).address,
            outputAtomicAmount
          ]);
        } else {
          tx = await writeErc20Marketplace.placeErcErcOrder([
            inputCurrency.address,
            inputAtomicAmount,
            outputCurrency.address,
            outputAtomicAmount
          ]);
        }

        await publicClient.waitForTransactionReceipt({ hash: tx });
        refetchOrders();
        onClose();
      } catch (e) {
        setLoading(false);
      }
      setLoading(false);
    },
    [address, writeErc20Marketplace, writeBTCMarketplace, onClose, publicClient, refetchOrders]
  );

  const ordClient = useOrdinalsAPI();

  const handleAddOrdinalOrder = async (data: AddOrdinalOrderFormData) => {
    if (!ordClient) {
      throw new Error('TODO');
    }
    const askingCurrency = currencies[data.ticker];
    if (!isErc20Currency(askingCurrency)) {
      throw new Error('TODO');
    }

    setLoading(true);

    try {
      const inscriptionId = parseInscriptionId(data.inscriptionId);
      const inscriptionData = await ordClient.getInscriptionFromId(inscriptionId);

      const utxo = {
        txHash: addHexPrefix(inscriptionData.satpoint.outpoint.txid),
        txOutputIndex: inscriptionData.satpoint.outpoint.vout,
        txOutputValue: BigInt(inscriptionData.output_value || 0) // TODO: Check why the output value can be null and how to handle that case
      };

      // TODO: check that form data are of correct types
      const askingAmount = new Amount(askingCurrency, data.amount, true).toAtomic();

      const tx = await writeOrdMarketplace.placeOrdinalSellOrder([
        { txId: addHexPrefix(inscriptionId.txid), index: inscriptionId.index },
        utxo,
        askingCurrency.address,
        askingAmount
      ]);

      await publicClient.waitForTransactionReceipt({ hash: tx });
    } catch (e) {
      setLoading(false);
    }

    refetchOrders();
    onClose();
    setLoading(false);
  };

  const handleAddBrc20Order = async (data: AddBrc20OrderFormData) => {
    if (!btcAddress) return;

    if (!ordClient) {
      throw new Error('TODO');
    }
    const askingCurrency = currencies[data.outputTicker];

    if (!isErc20Currency(askingCurrency)) {
      throw new Error('TODO');
    }
    setLoading(true);

    const inscriptionObj = {
      p: 'brc-20',
      op: 'transfer',
      tick: data.inputTicker,
      amt: data.inputValue
    };

    const inscriptionJson = JSON.stringify(inscriptionObj);

    try {
      const inscription = await createTextInscription(inscriptionJson);

      const signer = btcConnector?.getSigner();

      if (!signer) {
        throw new Error('Wallet does support getSigner');
      }

      const feeRate = await getFeeRate();

      const inscribeTx = await inscribeData(signer, btcAddress, feeRate, inscription); // 546

      const res = await fetch(`${getBlockStreamUrl()}/tx`, {
        method: 'POST',
        body: inscribeTx.toHex()
      });
      const txid = await res.text();

      const commitTx = await signer.getTransaction(txid);

      const scriptPubKey = bitcoinjsLib.address.toOutputScript(btcAddress, await signer.getNetwork());
      const commitUtxoIndex = commitTx.outs.findIndex((out) => out.script.equals(scriptPubKey));

      const inscriptionId = parseInscriptionId(`${txid}i${commitUtxoIndex}`);

      // const inscriptionData = await getInscriptionFromId(electrsClient, `${txid}i${commitUtxoIndex}`);
      // inscriptionData.body;
      // console.log(inscriptionData.body[0].toString());

      const utxo = {
        txHash: addHexPrefix(txid),
        txOutputIndex: commitUtxoIndex,
        txOutputValue: BigInt(0) // TODO: need to fetch this
        // txOutputValue: BigInt(inscriptionData.output_value || 0) // TODO: Check why the output value can be null and how to handle that case
      };

      const askingAmount = new Amount(askingCurrency, data.outputValue || '0', true).toAtomic();

      const tx = await writeOrdMarketplace.placeOrdinalSellOrder([
        { txId: addHexPrefix(txid), index: inscriptionId.index },
        utxo,
        askingCurrency.address,
        askingAmount
      ]);

      await publicClient.waitForTransactionReceipt({ hash: tx });
    } catch (e) {
      setLoading(false);
    }

    // refetchOrders();
    // onClose();
    setLoading(false);
  };

  return (
    <Modal
      {...props}
      onClose={onClose}
      align='top'
      shouldCloseOnInteractOutside={(el) =>
        !offerModalRef.current?.contains(el) &&
        !receiveModalRef.current?.contains(el) &&
        !selectTokenModalRef.current?.contains(el) &&
        !selectInscriptionModalRef.current?.contains(el)
      }
    >
      <ModalHeader>New Order</ModalHeader>
      <ModalBody gap='spacing4'>
        <P size='s'>Input the details and values of your order's assets</P>
        <StyledTabs size='large' fullWidth>
          <TabsItem key='token' title='Token'>
            <StyledWrapper>
              <AddOrderForm
                isLoading={isLoading}
                offerModalRef={offerModalRef}
                receiveModalRef={receiveModalRef}
                onSubmit={handleAddOrder}
              />
            </StyledWrapper>
          </TabsItem>
          <TabsItem key='brc20' title='BRC20'>
            <StyledWrapper>
              <AddBrc20OrderForm
                isLoading={isLoading}
                offerModalRef={offerModalRef}
                receiveModalRef={receiveModalRef}
                onSubmit={handleAddBrc20Order}
              />
            </StyledWrapper>
          </TabsItem>
          <TabsItem key='ordinal' title='Ordinals'>
            <StyledWrapper>
              <AddOrdinalOrderForm
                isLoading={isLoading}
                onSubmit={handleAddOrdinalOrder}
                selectTokenModalRef={selectTokenModalRef}
                selectInscriptionModalRef={selectInscriptionModalRef}
              />
            </StyledWrapper>
          </TabsItem>
        </StyledTabs>
      </ModalBody>
    </Modal>
  );
};

export { AddOrderModal };
export type { AddOrderModalProps };
