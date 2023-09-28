import { Modal, ModalBody, ModalHeader, ModalProps } from '@interlay/ui';
import { useCallback, useRef } from 'react';
import { AddOrderForm } from '../AddOrderForm';
import { AddOrderFormData } from '../AddOrderForm/AddOrderForm';
import { useContract } from '../../../../hooks/useContract';
import { ContractType, Erc20Currencies } from '../../../../constants';
import { useAccount, usePublicClient } from 'wagmi';
import { toAtomicAmountErc20 } from '../../../../utils/currencies';

type AddOrderModalProps = { refetchOrders: () => void } & Omit<ModalProps, 'children'>;

const AddOrderModal = ({ onClose, refetchOrders, ...props }: AddOrderModalProps): JSX.Element => {
  const offerModalRef = useRef<HTMLDivElement>(null);
  const receiveModalRef = useRef<HTMLDivElement>(null);

  const { write: writeErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const handleAddOrder = useCallback(
    async ({ inputTicker, outputTicker, inputValue, outputValue }: AddOrderFormData) => {
      if (!inputTicker || !outputTicker || !inputValue || !outputValue || !address) {
        return;
      }
      const inputCurrency = Erc20Currencies[inputTicker];
      const outputCurrency = Erc20Currencies[outputTicker];
      const inputAtomicAmount = toAtomicAmountErc20(inputValue, inputTicker);
      const outputAtomicAmount = toAtomicAmountErc20(outputValue, outputTicker);

      const tx = await writeErc20Marketplace.placeErcErcOrder([
        inputCurrency.address,
        inputAtomicAmount,
        outputCurrency.address,
        outputAtomicAmount
      ]);
      await publicClient.waitForTransactionReceipt({ hash: tx });
      refetchOrders();
      onClose();
    },
    [address, writeErc20Marketplace, onClose, publicClient, refetchOrders]
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
