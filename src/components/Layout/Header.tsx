import { CTALink, Flex } from '@interlay/ui';
import { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { FAUCET_URL, SUPERBRIDGE_URL } from '../../constants/links';
import { useAccount as useSatsAccount } from '../../lib/sats-wagmi';
import { Badge } from '../Badge';
import { ConnectWalletModal } from '../ConnectWalletModal';
import { Icons } from '../ConnectWalletModal/ConnectWalletModal';
import { Faucet } from '../Faucet';
import { CTAWrapper, StyledConnectedCTA, StyledHeader, StyledWallets } from './Layout.styles';
const Header = () => {
  const { address } = useAccount();
  const [isOpen, setOpen] = useState(false);
  const { pendingConnector } = useConnect();
  const { connector } = useAccount();
  const { connector: btcConnector } = useSatsAccount();

  const hasSomeWalletConnected = !!connector || !!btcConnector;

  const EthereumWallet = connector ? Icons[connector.name] : undefined;
  const BTCWallet = btcConnector ? Icons[btcConnector.name] : undefined;

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
                  {EthereumWallet && <EthereumWallet size='s' />}
                  {BTCWallet && <BTCWallet size='s' />}
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
