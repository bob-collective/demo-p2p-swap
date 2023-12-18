import { Modal, ModalBody, ModalHeader, ModalProps } from '@interlay/ui';
import { useCallback, useState } from 'react';
import { OrdinalOrder } from '../../../../types/orders';
import { FillOrdinalSellOrderForm } from '../FillOrderForm';
import { FillOrdinalSellOrderFormData } from '../FillOrderForm/FillOrdinalSellOrderForm';
import { usePublicClient } from 'wagmi';
import { ContractType } from '../../../../constants';
import { useContract } from '../../../../hooks/useContract';
import { getScriptPubKeyFromAddress } from '../../../../utils/bitcoin';

type Props = {
  order: OrdinalOrder;
  refetchActiveOrdinalOrders: () => void;
};

type InheritAttrs = Omit<ModalProps, 'children'>;

type FillOrdinalOrderModalProps = Props & InheritAttrs;

const FillOrdinalOrderModal = ({
  order,
  refetchActiveOrdinalOrders,
  onClose,
  ...props
}: FillOrdinalOrderModalProps): JSX.Element => {
  const [isLoading, setLoading] = useState(false);

  const publicClient = usePublicClient();

  const { write: writeOrdMarketplace } = useContract(ContractType.ORD_MARKETPLACE);

  const handleFillOrder = useCallback(
    async (data: FillOrdinalSellOrderFormData) => {
      setLoading(true);
      console.log('a')
      try {
        console.log(data)
        const btcAddress = {scriptPubKey: getScriptPubKeyFromAddress(data.btcAddress)};
        console.log('b')
        const orderId = order.id;

        const txHash = await writeOrdMarketplace.acceptOrdinalSellOrder([orderId, btcAddress])
        await publicClient.waitForTransactionReceipt({hash: txHash})
      } catch (e) {
        console.log(e);
        return setLoading(false);
      }

      setLoading(false);

      onClose();
      refetchActiveOrdinalOrders();
    },
    [onClose, order.id, publicClient, refetchActiveOrdinalOrders, writeOrdMarketplace]
  );

  return (
    <Modal {...props} align='top' onClose={onClose}>
      <ModalHeader>Fill Order</ModalHeader>
      <ModalBody>
        <FillOrdinalSellOrderForm isLoading={isLoading} onSubmit={handleFillOrder} order={order} />
      </ModalBody>
    </Modal>
  );
};

export { FillOrdinalOrderModal };
export type { FillOrdinalOrderModalProps };
