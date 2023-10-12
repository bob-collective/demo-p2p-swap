import { ContractType } from '../constants';
import { useContract } from './useContract';

const useFaucet = () => {
  return useContract(ContractType.MINT_USDT);
};

export { useFaucet };
