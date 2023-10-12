import { ContractType } from '../constants';
import { useContract } from './useContract';

const useFaucet = () => {
  const { read, write } = useContract(ContractType.MINT_USDT);
  console.log('contracts', read, write);
};

export { useFaucet };
