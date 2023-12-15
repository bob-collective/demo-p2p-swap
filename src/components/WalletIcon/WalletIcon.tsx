import { ChevronDown, IconProps } from '@interlay/icons';
import {
  CoinbaseWallet,
  LeatherWallet,
  Ledger,
  Metamask,
  TrustWallet,
  UnisatWallet,
  WalletConnect,
  XVerse
} from '../../assets/svg';

const Icons: Record<string, typeof Metamask> = {
  Injected: ChevronDown,
  MetaMask: Metamask,
  'Trust Wallet': TrustWallet,
  WalletConnect: WalletConnect,
  WalletConnectLegacy: WalletConnect,
  'Coinbase Wallet': CoinbaseWallet,
  Ledger: Ledger,
  XVerse: XVerse,
  Leather: LeatherWallet,
  Unisat: UnisatWallet
};
type WalletIconProps = Omit<IconProps, 'children'> & { name: string };

const WalletIcon = ({ name, ...props }: WalletIconProps) => {
  const Icon = name in Icons ? Icons[name] : Icons.Injected;

  return <Icon {...props} />;
};

export { WalletIcon };
export type { WalletIconProps };
