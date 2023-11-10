import { CTA } from '@interlay/ui';
import { usePublicClient } from 'wagmi';
import { useContract } from '../../hooks/useContract';
import { ContractType } from '../../constants';
import { useState } from 'react';

const Faucet = () => {
  const [isLoading, setLoading] = useState(false);

  const { write } = useContract(ContractType.FAUCET);
  const publicClient = usePublicClient();

  const handleCallFaucet = async () => {
    setLoading(true);
    try {
      const tx = await write.mint();
      await publicClient.waitForTransactionReceipt({ hash: tx });
    } catch (e) {
      window.alert(`Minting failed: ${e}`);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <CTA loading={isLoading} onPress={() => handleCallFaucet()} size='small'>
      Get Tokens
    </CTA>
  );
};

export { Faucet };
