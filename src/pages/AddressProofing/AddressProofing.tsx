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
  const [avatar, setAvatar] = useState<string>();

  const { address } = useAccount();
  const { read: readOwnership } = useContract(ContractType.OWNERSHIP);
  const { write: writePing, read: readPing } = useContract(ContractType.PING);

  console.log(writePing, readPing);

  // const ping = async () => {
  //   await writePing.postMessage(['pong']);
  // };

  // if (claimedAddress) {
  //   ping();
  // }

  useEffect(() => {
    // const getMessages = async () => {
    //   if (!address) return;

    //   const end = await readPing.id();

    //   for (let i = 0; i < end; i++) {
    //     const poster = await readPing.posters([BigInt(i)]);
    //     console.log('posters', i, poster);
    //     console.log('posters', i, await readOwnership.ownedAddress([poster]));
    //     console.log('messages', i, await readPing.messages([BigInt(i)])); // might need to convert i to bigint
    //   }
    // };

    const fetchOrdinal = async () => {
      if (!claimedAddress) return;

      await fetch(`https://api.hiro.so/ordinals/v1/inscriptions?address=${claimedAddress}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setAvatar(data.results[0].id);
        });

      // const info = await fetch(
      //   `https://open-api.unisat.io/v1/indexer/address/bc1pjak5p4sj7vrkh50ffz0ky3r270j60c29l0eurl98rh3ll7f3ewaqk27zmk/history`,
      //   {
      //     headers: {
      //       Authorization: 'Bearer c986d2965dcc9cd0a18603697df266bbf7dfcf6ffd44d12beccecac22811dbfb'
      //     }
      //   }
      // );
    };

    fetchOrdinal();
  }, [address, claimedAddress, readOwnership, readPing]);

  useEffect(() => {
    if (!address) return;

    const logClaimedAddress = async () => {
      const claimedAddress = await readOwnership.ownedAddress([address]);
      setClaimedAddress(claimedAddress);
    };

    logClaimedAddress();
  }, [address, readOwnership]);

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
      {avatar && <img width='50' height='50' src={`https://static.unisat.io/content/${avatar}`} />}
      <ClaimAddressModal isOpen={isAddNewOrderModal.isOpen} onClose={handleCloseNewOrderModal} />
    </Flex>
  );
};

export { AddressProofing };
