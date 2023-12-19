import { DocumentDuplicate } from '@interlay/icons';
import { Flex, P, Span } from '@interlay/ui';
import { useCopyToClipboard } from 'react-use';
import truncateEthAddress from 'truncate-eth-address';
import { WalletIcon } from '../WalletIcon';
import { StyledAddressCTA, StyledConnectedWallet, StyledDisconnectCTA } from './ConnectWalletModal.style';

function shortenBitcoinAddress(address: string) {
  // Extract the first and last 6 characters of the address
  const shortenedAddress = address.slice(0, 6) + '...' + address.slice(-6);
  return shortenedAddress;
}

type ConnectWalleSectionProps = {
  type: 'evm' | 'btc';
  address: string;
  wallet: string;
  onDisconnect: () => void;
};

const ConnectWalleSection = ({ type, onDisconnect, address, wallet }: ConnectWalleSectionProps) => {
  const [, copy] = useCopyToClipboard();

  return (
    <StyledConnectedWallet alignItems='center' justifyContent='space-between' gap='spacing2'>
      <Flex alignItems='center' gap='spacing2'>
        <WalletIcon name={wallet} size='lg' />
        <Flex direction='column' gap='spacing2' alignItems='flex-start'>
          <P size='s'>Connected with {wallet}</P>
          <StyledAddressCTA variant='text' size='x-small' onPress={() => copy(address)}>
            <Span weight='bold' size='s'>
              {type === 'evm' ? truncateEthAddress(address) : shortenBitcoinAddress(address)}
            </Span>
            <DocumentDuplicate size='s' />
          </StyledAddressCTA>
        </Flex>
      </Flex>
      <StyledDisconnectCTA onPress={onDisconnect} size='small' variant='secondary'>
        Disconnect
      </StyledDisconnectCTA>
    </StyledConnectedWallet>
  );
};

export { ConnectWalleSection };
export type { ConnectWalleSectionProps };
