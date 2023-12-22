import { CTALink, Flex } from '@interlay/ui';
import { useAccount, useConnect } from 'wagmi';
import { FAUCET_URL, BRIDGE_URL } from '../../constants/links';
import { useAccount as useSatsAccount } from '../../lib/sats-wagmi';
import { useConnectWalletModal } from '../../providers/ConnectWalletContext';
import { Badge } from '../Badge';
import { ConnectWalletModal } from '../ConnectWalletModal';
import { Faucet } from '../Faucet';
import { WalletIcon } from '../WalletIcon';
import { CTAWrapper, StyledConnectedCTA, StyledHeader, StyledWallets } from './Layout.styles';

const BOB = () => (
  <svg width='86' height='31' viewBox='0 0 86 31' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g clipPath='url(#clip0_541_1197)'>
      <path
        d='M8.62647 0.5H0.506835C0.226918 0.5 0 0.726915 0 1.00683V9.12647C0 9.40638 0.226918 9.6333 0.506835 9.6333H8.62647C8.90638 9.6333 9.1333 9.40638 9.1333 9.12647V1.00683C9.1333 0.726915 8.90638 0.5 8.62647 0.5Z'
        fill='white'
      />
      <path
        d='M0 21.5562L0 29.6758C0 29.9557 0.226915 30.1826 0.506832 30.1826H8.62647C8.90638 30.1826 9.1333 29.9557 9.1333 29.6758V21.5562C9.1333 21.2762 8.90638 21.0493 8.62647 21.0493H0.506832C0.226915 21.0493 0 21.2762 0 21.5562Z'
        fill='white'
      />
      <path
        d='M0 11.2815L0 19.4011C0 19.681 0.226918 19.908 0.506835 19.908H8.62647C8.90639 19.908 9.1333 19.681 9.1333 19.4011V11.2815C9.1333 11.0016 8.90639 10.7747 8.62647 10.7747H0.506835C0.226918 10.7747 0 11.0016 0 11.2815Z'
        fill='white'
      />
      <path
        d='M10.2754 21.5562V29.6758C10.2754 29.9557 10.5023 30.1826 10.7822 30.1826H18.9019C19.1818 30.1826 19.4087 29.9557 19.4087 29.6758V21.5562C19.4087 21.2762 19.1818 21.0493 18.9019 21.0493H10.7822C10.5023 21.0493 10.2754 21.2762 10.2754 21.5562Z'
        fill='white'
      />
      <path
        d='M10.2754 11.2815V19.4011C10.2754 19.681 10.5023 19.908 10.7822 19.908H18.9019C19.1818 19.908 19.4087 19.681 19.4087 19.4011V11.2815C19.4087 11.0016 19.1818 10.7747 18.9019 10.7747H10.7822C10.5023 10.7747 10.2754 11.0016 10.2754 11.2815Z'
        fill='white'
      />
      <path
        d='M28.541 10.7747H38.7539C42.4501 10.7747 44.3414 13.1316 44.3414 15.7214C44.3414 18.1649 42.8292 19.7946 40.9955 20.1737C43.062 20.4931 44.7205 22.5019 44.7205 24.9454C44.7205 27.8545 42.7715 30.1827 39.0753 30.1827H28.5431V10.7747H28.541ZM37.8515 18.5729C39.2484 18.5729 40.1219 17.6705 40.1219 16.4199C40.1219 15.1693 39.2484 14.2957 37.8515 14.2957H32.6719V18.5729H37.8515ZM37.9978 26.6616C39.5698 26.6616 40.501 25.7592 40.501 24.3623C40.501 23.1406 39.6275 22.0919 37.9978 22.0919H32.674V26.6596H37.9978V26.6616Z'
        fill='white'
      />
      <path
        d='M69.6367 10.7747H79.8496C83.5458 10.7747 85.4371 13.1316 85.4371 15.7214C85.4371 18.1649 83.9249 19.7946 82.0912 20.1737C84.1577 20.4931 85.8162 22.5019 85.8162 24.9454C85.8162 27.8545 83.8672 30.1827 80.171 30.1827H69.6388V10.7747H69.6367ZM78.9472 18.5729C80.3441 18.5729 81.2177 17.6705 81.2177 16.4199C81.2177 15.1693 80.3441 14.2957 78.9472 14.2957H73.7676V18.5729H78.9472ZM79.0935 26.6616C80.6655 26.6616 81.5967 25.7592 81.5967 24.3623C81.5967 23.1406 80.7232 22.0919 79.0935 22.0919H73.7697V26.6596H79.0935V26.6616Z'
        fill='white'
      />
      <path
        d='M56.9372 10.4575C62.8194 10.4575 67.0986 14.6399 67.0986 20.4788C67.0986 26.3177 62.8173 30.5001 56.9372 30.5001C51.0571 30.5001 46.8047 26.3177 46.8047 20.4788C46.8047 14.6399 51.086 10.4575 56.9372 10.4575ZM56.9372 14.1166C53.3564 14.1166 51.0551 16.8465 51.0551 20.4767C51.0551 24.107 53.3564 26.8369 56.9372 26.8369C60.518 26.8369 62.8482 24.0782 62.8482 20.4767C62.8482 16.8753 60.518 14.1166 56.9372 14.1166Z'
        fill='white'
      />
    </g>
    <defs>
      <clipPath id='clip0_541_1197'>
        <rect width='85.8176' height='30' fill='white' transform='translate(0 0.5)' />
      </clipPath>
    </defs>
  </svg>
);

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
        <Flex gap='spacing4' alignItems='center'>
          <a href='/' aria-label='navigate to home page'>
            <BOB />
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
              <CTALink external icon href={BRIDGE_URL} size='small'>
                Bridge
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
