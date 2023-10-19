import { CTA, Flex, H1 } from '@interlay/ui';
import { ClaimAddressModal } from './components/ClaimAddressModal';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useContract } from '../../hooks/useContract';
import { ContractType } from '../../constants';

const AddressProofing = (): JSX.Element => {
  const [isAddNewOrderModal, setAddNewOrderModal] = useState<{ isOpen: boolean }>({
    isOpen: false
  });
  const [claimedAddress, setClaimedAddress] = useState<string>();

  const { address } = useAccount();
  const { read } = useContract(ContractType.OWNERSHIP);

  useEffect(() => {
    if (!address) return;

    const logClaimedAddress = async () => {
      const claimedAddress = await read.ownedAddress([address]);
      setClaimedAddress(claimedAddress);
    };

    logClaimedAddress();
  }, [address, read]);

  const handleCloseNewOrderModal = () => setAddNewOrderModal((s) => ({ ...s, isOpen: false }));

  return (
    <Flex flex={1} direction='column' gap='spacing6' justifyContent='center'>
      <Flex alignItems='center' justifyContent='space-between'>
        <H1 size='xl2' id='address-proofing'>
          {claimedAddress ? `Claimed BTC Address: ${claimedAddress}` : 'Claim Address '}
        </H1>
        {!claimedAddress && (
          <CTA onPress={() => setAddNewOrderModal({ isOpen: true })} size='small'>
            Claim Address
          </CTA>
        )}
      </Flex>
      <ClaimAddressModal isOpen={isAddNewOrderModal.isOpen} onClose={handleCloseNewOrderModal} />
    </Flex>
  );
};

export { AddressProofing };
