import { CTALink } from '@interlay/ui';

const FAUCET_URL = 'https://faucetlink.to/sepolia';

const GasFaucet = () => {
  return (
    <CTALink external icon href={FAUCET_URL} size='small'>
      ETH Faucet
    </CTALink>
  );
};

export { GasFaucet };
