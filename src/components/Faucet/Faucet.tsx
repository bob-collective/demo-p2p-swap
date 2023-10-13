import { CTA } from '@interlay/ui';
import { usePublicClient } from 'wagmi';
import { useContract } from '../../hooks/useContract';
import { ContractType } from '../../constants';

const Faucet = () => {
  const { write } = useContract(ContractType.FAUCET);
  const publicClient = usePublicClient();

  const handleCallFaucet = async () => {
    const tx = await write.mint();
    await publicClient.waitForTransactionReceipt({ hash: tx });
  };

  return (
    <CTA onPress={() => handleCallFaucet()} size='small'>
      Get tokens
    </CTA>
  );
};

export { Faucet };
