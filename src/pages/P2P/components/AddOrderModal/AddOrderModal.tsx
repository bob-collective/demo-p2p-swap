import { Modal, ModalBody, ModalHeader, ModalProps } from '@interlay/ui';
import { useCallback, useRef } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { ContractType, Erc20Currency, currencies } from '../../../../constants';
import { useContract } from '../../../../hooks/useContract';
import { isBitcoinCurrency, toAtomicAmount } from '../../../../utils/currencies';
import { AddOrderForm } from '../AddOrderForm';
import { AddOrderFormData } from '../AddOrderForm/AddOrderForm';

type AddOrderModalProps = { refetchOrders: () => void } & Omit<ModalProps, 'children'>;

const AddOrderModal = ({ onClose, refetchOrders, ...props }: AddOrderModalProps): JSX.Element => {
  const offerModalRef = useRef<HTMLDivElement>(null);
  const receiveModalRef = useRef<HTMLDivElement>(null);

  const { write: writeErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);
  const { write: writeBTCMarketplace } = useContract(ContractType.BTC_MARKETPLACE);

  const publicClient = usePublicClient();
  const { address } = useAccount();

  const handleAddOrder = useCallback(
    async ({ inputTicker, outputTicker, inputValue, outputValue }: AddOrderFormData) => {
      if (!inputTicker || !outputTicker || !inputValue || !outputValue || !address) {
        return;
      }

      const inputCurrency = currencies[inputTicker];
      const outputCurrency = currencies[outputTicker];
      const inputAtomicAmount = toAtomicAmount(inputValue, inputTicker);
      const outputAtomicAmount = toAtomicAmount(outputValue, outputTicker);

      let tx;

      if (isBitcoinCurrency(outputCurrency)) {
        const mockedBtcAddress = { bitcoinAddress: BigInt(0) };
        tx = await writeBTCMarketplace.placeBtcBuyOrder([
          outputAtomicAmount,
          mockedBtcAddress,
          (inputCurrency as Erc20Currency).address,
          inputAtomicAmount
        ]);
      } else if (isBitcoinCurrency(inputCurrency)) {
        tx = await writeBTCMarketplace.placeBtcSellOrder([
          inputAtomicAmount,
          (outputCurrency as Erc20Currency).address,
          inputAtomicAmount
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
    },
    [address, writeErc20Marketplace, writeBTCMarketplace, onClose, publicClient, refetchOrders]
  );

  return (
    <Modal
      {...props}
      onClose={onClose}
      shouldCloseOnInteractOutside={(el) =>
        !offerModalRef.current?.contains(el) && !receiveModalRef.current?.contains(el)
      }
    >
      <ModalHeader>New Order</ModalHeader>
      <ModalBody>
        <AddOrderForm offerModalRef={offerModalRef} receiveModalRef={receiveModalRef} onSubmit={handleAddOrder} />
      </ModalBody>
    </Modal>
  );
};

export { AddOrderModal };
export type { AddOrderModalProps };
