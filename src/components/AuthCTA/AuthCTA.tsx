import { CTA, CTAProps } from '@interlay/ui';
import { useAccount } from 'wagmi';
import { useAccount as useBtcAccount } from '../../lib/sats-wagmi';
import { useConnectWalletModal } from '../../providers/ConnectWalletContext';

type Props = {
  isBtcAuthRequired?: boolean;
};

type InheritAttrs = Omit<CTAProps, keyof Props>;

type AuthCTAProps = Props & InheritAttrs;

const AuthCTA = ({ onPress, onClick, disabled, children, type, isBtcAuthRequired, ...props }: AuthCTAProps) => {
  const { address } = useAccount();
  const { address: btcAddress } = useBtcAccount();
  const { setOpen } = useConnectWalletModal();

  const authProps = address
    ? isBtcAuthRequired && !btcAddress
      ? { onPress: () => setOpen(true, { walletTab: 'btc' }), children: 'Connect BTC Wallet', ...props }
      : { onPress, onClick, disabled, children, type, ...props }
    : { onPress: () => setOpen(true), children: 'Connect EVM Wallet', ...props };

  return <CTA {...authProps} />;
};

export { AuthCTA };
