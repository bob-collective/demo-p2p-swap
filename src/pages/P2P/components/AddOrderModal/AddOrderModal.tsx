import { Modal, ModalBody, ModalHeader, ModalProps, P, TabsItem } from '@interlay/ui';
import { useCallback, useRef, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { ContractType, Erc20Currency, currencies } from '../../../../constants';
import { useContract } from '../../../../hooks/useContract';
import { Amount } from '../../../../utils/amount';
import { isBitcoinCurrency, isErc20Currency } from '../../../../utils/currencies';
import { AddOrderForm } from '../AddOrderForm';
import { AddOrderFormData } from '../AddOrderForm/AddOrderForm';
import { StyledTabs, StyledWrapper } from './AddOrderModal.style';
import { AddOrdinalOrderForm, AddOrdinalOrderFormData } from '../AddOrdinalOrderForm';
import { getScriptPubKeyFromAddress } from '../../../../utils/bitcoin';
import { useOrdinalsAPI } from '../../../../hooks/useOrdinalsAPI';
import { InscriptionId } from '../../../../hooks/ordinalsApi';
import { addHexPrefix } from '../../../../utils/encoding';

type AddOrderModalProps = { refetchOrders: () => void } & Omit<ModalProps, 'children'>;

const AddOrderModal = ({ onClose, refetchOrders, ...props }: AddOrderModalProps): JSX.Element => {
  const offerModalRef = useRef<HTMLDivElement>(null);
  const receiveModalRef = useRef<HTMLDivElement>(null);

  const { write: writeErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);
  const { write: writeBTCMarketplace } = useContract(ContractType.BTC_MARKETPLACE);
  const { write: writeOrdMarketplace } = useContract(ContractType.ORD_MARKETPLACE);

  const publicClient = usePublicClient();
  const { address } = useAccount();

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
      { ordinalID: addHexPrefix(inscriptionId.txid) },
      utxo,
      askingCurrency.address,
      askingAmount
    ]);

    await publicClient.waitForTransactionReceipt({ hash: tx });
    refetchOrders();
    onClose();
  };

  return (
    <Modal
      {...props}
      onClose={onClose}
      align='top'
      shouldCloseOnInteractOutside={(el) =>
        !offerModalRef.current?.contains(el) && !receiveModalRef.current?.contains(el)
      }
    >
      <ModalHeader>New Order</ModalHeader>
      <ModalBody gap='spacing4'>
        <P size='s'>Input the details and values of your order's assets</P>
        <StyledTabs size='large' fullWidth>
          <TabsItem key='deposit' title='Token'>
            <StyledWrapper>
              <AddOrderForm
                isLoading={isLoading}
                offerModalRef={offerModalRef}
                receiveModalRef={receiveModalRef}
                onSubmit={handleAddOrder}
              />
            </StyledWrapper>
          </TabsItem>
          <TabsItem key='withdraw' title='Ordinals'>
            <StyledWrapper>
              <AddOrdinalOrderForm
                overlappingModalRef={receiveModalRef}
                isLoading={isLoading}
                onSubmit={handleAddOrdinalOrder}
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
