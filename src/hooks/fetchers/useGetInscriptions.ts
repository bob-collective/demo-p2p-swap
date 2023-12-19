import { DefaultElectrsClient, getInscriptionIds } from '@gobob/bob-sdk';
import { useQuery } from '@tanstack/react-query';
import { BITCOIN_NETWORK } from '../../utils/bitcoin';
import { useOrdinalsAPI } from '../useOrdinalsAPI';
import { REFETCH_INTERVAL } from '../../constants/query';
import { useAccount } from '../../lib/sats-wagmi';

const useGetInscriptions = () => {
  const ordinalsApi = useOrdinalsAPI();
  const { address } = useAccount();

  return useQuery({
    queryKey: ['inscriptions', address],
    enabled: !!address && !!ordinalsApi,
    queryFn: async () => {
      if (!ordinalsApi || !address) return;
      const electrsClient = new DefaultElectrsClient(BITCOIN_NETWORK);

      return getInscriptionIds(electrsClient, ordinalsApi, address);
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });
};

export { useGetInscriptions };
