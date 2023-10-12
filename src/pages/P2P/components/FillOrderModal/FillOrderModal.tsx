import { Modal, ModalBody, ModalHeader, ModalProps } from '@interlay/ui';
import { useCallback, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { ContractType } from '../../../../constants';
import { useContract } from '../../../../hooks/useContract';
import { Order } from '../../../../types/orders';
import { toAtomicAmount } from '../../../../utils/currencies';
import { FillOrderForm, FillOrderFormData } from '../FillOrderForm';

type Props = {
  order: Order;
  refetchOrders: () => void;
  refetchAcceptedBtcOrders: () => void;
};

type InheritAttrs = Omit<ModalProps, 'children'>;

type FillOrderModalProps = Props & InheritAttrs;

const FillOrderModal = ({
  order,
  refetchOrders,
  refetchAcceptedBtcOrders,
  onClose,
  ...props
}: FillOrderModalProps): JSX.Element => {
  const [isLoading, setLoading] = useState(false);

  const publicClient = usePublicClient();

  const { write: writeErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);
  const { write: writeBtcMarketplace } = useContract(ContractType.BTC_MARKETPLACE);

  const handleFillOrder = useCallback(
    async (data: FillOrderFormData) => {
      setLoading(true);

      try {
        switch (data.type) {
          case 'buy-btc': {
            const acceptBuyOrderTxHash = await writeBtcMarketplace.acceptBtcBuyOrder([
              order.id,
              order.totalAskingAmount
            ]);
            await publicClient.waitForTransactionReceipt({ hash: acceptBuyOrderTxHash });
            refetchAcceptedBtcOrders();
            break;
          }
          case 'sell-btc': {
            const btcAddress = { bitcoinAddress: data.values.btcAddress };
            const acceptBtcSellOrderTxHash = await writeBtcMarketplace.acceptBtcSellOrder([
              order.id,
              btcAddress,
              order.availableLiquidity
            ]);
            await publicClient.waitForTransactionReceipt({ hash: acceptBtcSellOrderTxHash });
            refetchAcceptedBtcOrders();
            break;
          }
          case 'erc20': {
            const atomicAmount = toAtomicAmount(data.values.inputValue, order.askingCurrency.ticker);

            const hash = await writeErc20Marketplace.acceptErcErcOrder([order.id, atomicAmount]);
            await publicClient.waitForTransactionReceipt({ hash });
            break;
          }
        }
      } catch (e) {
        return setLoading(false);
      }

      setLoading(false);

      onClose();
      refetchOrders();
    },
    [order, onClose, refetchOrders, writeBtcMarketplace, publicClient, refetchAcceptedBtcOrders, writeErc20Marketplace]
  );

  return (
    <Modal {...props} onClose={onClose}>
      <ModalHeader>Fill Order</ModalHeader>
      <ModalBody>
        <FillOrderForm isLoading={isLoading} onSubmit={handleFillOrder} order={order} />
      </ModalBody>
    </Modal>
  );
};

export { FillOrderModal };
export type { FillOrderModalProps };
