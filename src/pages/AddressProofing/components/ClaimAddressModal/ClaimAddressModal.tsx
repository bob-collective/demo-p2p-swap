import { Modal, ModalBody, ModalHeader, ModalProps } from '@interlay/ui';
import { useCallback, useState } from 'react';
import { ClaimAddressForm, ClaimAddressFormData } from '../ClaimAddressForm';
import { useContract } from '../../../../hooks/useContract';
import { ContractType } from '../../../../constants';

type InheritAttrs = Omit<ModalProps, 'children'>;

type ClaimAddressModalProps = InheritAttrs;

const ClaimAddressModal = ({ onClose, ...props }: ClaimAddressModalProps): JSX.Element => {
  const [isLoading, setLoading] = useState(false);
  const { write } = useContract(ContractType.OWNERSHIP);

  const handleClaimAddress = useCallback(
    async (data: ClaimAddressFormData) => {
      setLoading(true);

      try {
        const { btcAddress } = data;
        await write.claimOwnershipWithoutProofThisIsAHackForTesting([btcAddress]);
      } catch (e) {
        return setLoading(false);
      }

      setLoading(false);

      onClose();
    },
    [onClose, write]
  );

  return (
    <Modal {...props} align='top' onClose={onClose}>
      <ModalHeader>Fill Order</ModalHeader>
      <ModalBody>
        <ClaimAddressForm isLoading={isLoading} onSubmit={handleClaimAddress} />
      </ModalBody>
    </Modal>
  );
};

export { ClaimAddressModal };
export type { ClaimAddressModalProps };
