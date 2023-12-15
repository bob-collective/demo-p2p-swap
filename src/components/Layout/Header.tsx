import { CTALink, Flex } from '@interlay/ui';
import { useAccount, useConnect } from 'wagmi';
import { FAUCET_URL, SUPERBRIDGE_URL } from '../../constants/links';
import { useAccount as useSatsAccount } from '../../lib/sats-wagmi';
import { useConnectWalletModal } from '../../providers/ConnectWalletContext';
import { Badge } from '../Badge';
import { ConnectWalletModal } from '../ConnectWalletModal';
import { Faucet } from '../Faucet';
import { WalletIcon } from '../WalletIcon';
import { CTAWrapper, StyledConnectedCTA, StyledHeader, StyledWallets } from './Layout.styles';

const Header = () => {
  const { address } = useAccount();
  const { pendingConnector } = useConnect();
  const { connector } = useAccount();
  const { connector: btcConnector } = useSatsAccount();
  const { isOpen, setOpen } = useConnectWalletModal();

  const hasSomeWalletConnected = !!connector || !!btcConnector;

  return (
    <>
      <StyledHeader elementType='header' alignItems='center' justifyContent='space-between'>
        <Flex>
          <a href='/' aria-label='navigate to home page'>
            <img
              src='https://uploads-ssl.webflow.com/64e85c2f3609488b3ed725f4/64ede4ad095a0a3801df095f_BobLogo.svg'
              width='137'
              alt='logo'
            />
          </a>
          <Badge />
        </Flex>
        <CTAWrapper alignItems='center'>
          {address && (
            <>
              <Faucet />
              <CTALink external icon href={FAUCET_URL} size='small'>
                ETH Faucet
              </CTALink>
              <CTALink external icon href={SUPERBRIDGE_URL} size='small'>
                Superbridge
              </CTALink>
            </>
          )}
          <StyledConnectedCTA loading={!!pendingConnector} onClick={() => setOpen(true)}>
            {pendingConnector ? (
              'Authorize Wallet'
            ) : hasSomeWalletConnected ? (
              <Flex elementType='span' gap='spacing2'>
                <StyledWallets alignItems='center'>
                  {connector && <WalletIcon name={connector.name} size='s' />}
                  {btcConnector && <WalletIcon name={btcConnector.name} size='s' />}
                </StyledWallets>
                Wallet
              </Flex>
            ) : (
              'Connect Wallet'
            )}
          </StyledConnectedCTA>
        </CTAWrapper>
      </StyledHeader>
      <ConnectWalletModal isOpen={isOpen} onClose={() => setOpen(false)} />
    </>
  );
};

export { Header };
