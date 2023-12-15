import { Flex, P } from '@interlay/ui';
import { WalletIcon } from '../WalletIcon';
import { StyledConnectedWallet, StyledDisconnectCTA } from './ConnectWalletModal.style';

type ConnectWalleSectionProps = {
  address: string;
  wallet: string;
  onDisconnect: () => void;
};

const ConnectWalleSection = ({ onDisconnect, address, wallet }: ConnectWalleSectionProps) => (
  <StyledConnectedWallet alignItems='center' justifyContent='space-between' gap='spacing2'>
    <Flex alignItems='center' gap='spacing2'>
      <WalletIcon name={wallet} size='lg' />
      <Flex direction='column' gap='spacing2'>
        <P size='s'>Connected with {wallet}</P>
        <P weight='bold' size='s'>
          {address}
        </P>
      </Flex>
    </Flex>
    <StyledDisconnectCTA onPress={onDisconnect} size='small' variant='secondary'>
      Disconnect
    </StyledDisconnectCTA>
  </StyledConnectedWallet>
);

export { ConnectWalleSection };
export type { ConnectWalleSectionProps };
