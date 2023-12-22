import { CTA, CTAProps } from '@interlay/ui';
import { useAccount } from 'wagmi';
import { useConnectWalletModal } from '../../providers/ConnectWalletContext';

type AuthCTAProps = CTAProps;

const AuthCTA = ({ onPress, onClick, disabled, children, type, ...props }: AuthCTAProps) => {
  const { address } = useAccount();
  const { setOpen } = useConnectWalletModal();

  const authProps = address
    ? { onPress, onClick, disabled, children, type, ...props }
    : { onPress: () => setOpen(true), children: 'Connect EVM Wallet', ...props };

  return <CTA {...authProps} />;
};

export { AuthCTA };
