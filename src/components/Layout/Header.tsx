import { CTA, CTALink, Flex, Span } from '@interlay/ui';
import { useState } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import truncateEthAddress from 'truncate-eth-address';
import { useAccount, useConnect } from 'wagmi';
import { FAUCET_URL, SUPERBRIDGE_URL } from '../../constants/links';
import { Badge } from '../Badge';
import { ConnectWalletModal } from '../ConnectWalletModal';
import { Faucet } from '../Faucet';
import { CTAWrapper, StyledHeader } from './Layout.styles';

const Header = () => {
  const { address } = useAccount();
  const [isOpen, setOpen] = useState(false);
  const { connectors, connect, pendingConnector } = useConnect();

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
        <CTAWrapper>
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
          <CTA loading={!!pendingConnector} size='small' onClick={() => setOpen(true)}>
            {pendingConnector ? (
              'Authorize Wallet'
            ) : address ? (
              <Flex elementType='span' gap='spacing2'>
                <Jazzicon diameter={20} seed={jsNumberForAddress(address)} />
                <Span style={{ color: 'inherit' }} size='s' color='tertiary'>
                  {truncateEthAddress(address)}
                </Span>
              </Flex>
            ) : (
              'Connect Wallet'
            )}
          </CTA>
        </CTAWrapper>
      </StyledHeader>
      <ConnectWalletModal isOpen={isOpen} onClose={() => setOpen(false)} />
    </>
  );
};

export { Header };
