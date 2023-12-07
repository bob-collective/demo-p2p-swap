import { useQuery } from '@tanstack/react-query';
import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';
import { ContractType } from '../../constants';
import { HexString } from '../../types';
import { Erc20Order } from '../../types/orders';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { calculateOrderPrice } from '../../utils/orders';
import { useContract } from '../useContract';
import { REFETCH_INTERVAL } from '../../constants/query';

const parseErc20Order = (
  rawOrder: {
    id: bigint;
    offeringAmount: bigint;
    offeringToken: HexString;
    askingAmount: bigint;
    askingToken: HexString;
    requesterAddress: HexString;
  },
  address?: HexString
): Erc20Order => {
  const { id, offeringAmount, offeringToken, askingAmount, askingToken, requesterAddress } = rawOrder;
  const isOwnerOfOrder = !!address && isAddressEqual(requesterAddress, address);

  const offeringCurrency = getErc20CurrencyFromContractAddress(offeringToken);
  const askingCurrency = getErc20CurrencyFromContractAddress(askingToken);

  const price = calculateOrderPrice(rawOrder.offeringAmount, offeringCurrency, rawOrder.askingAmount, askingCurrency);

  return {
    id,
    offeringCurrency,
    askingCurrency,
    requesterAddress,
    availableLiquidity: offeringAmount,
    price,
    totalAskingAmount: askingAmount,
    isOwnerOfOrder
  };
};

const useGetActiveErc20Orders = () => {
  const { read: readErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);
  const { address } = useAccount();

  const queryResult = useQuery({
    queryKey: ['active-erc20-orders', address],
    enabled: !!readErc20Marketplace,
    queryFn: async () => {
      const [rawOrders, identifiers] = await readErc20Marketplace.getOpenOrders();
      // !MEMO: Should use modified marketplace contract to return ID, this will start breaking when orders
      // get cancelled / totally filled.
      console.log('rawOrders, identifiers', rawOrders, identifiers);
      return rawOrders
        ? rawOrders.map(
            (
              order: {
                id: bigint;
                offeringAmount: bigint;
                offeringToken: `0x${string}`;
                askingAmount: bigint;
                askingToken: `0x${string}`;
                requesterAddress: `0x${string}`;
              },
              index: string | number
            ) => parseErc20Order({ ...order, id: identifiers[index] }, address)
          )
        : [];
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  return queryResult;
};

export { useGetActiveErc20Orders };
export type { Erc20Order };
