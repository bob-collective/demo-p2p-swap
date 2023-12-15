import { useQuery } from '@tanstack/react-query';
import { ContractType } from '../../constants';

import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';
import { HexString } from '../../types';
import { AcceptedOrdinalOrder } from '../../types/orders';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { calculateOrderDeadline } from '../../utils/orders';
import { useContract } from '../useContract';
import { REFETCH_INTERVAL } from '../../constants/query';
import { getAddressFromScriptPubKey } from '../../utils/bitcoin';

const parseAcceptedOrdinalOrder = (
  rawOrder: {
    orderId: bigint;
    bitcoinAddress: {
      scriptPubKey: HexString;
    };
    ercToken: HexString;
    ercAmount: bigint;
    requester: HexString;
    acceptor: HexString;
    acceptTime: bigint;
  },
  id: bigint,
  address: HexString | undefined
): AcceptedOrdinalOrder => {
  const askingCurrency = getErc20CurrencyFromContractAddress(rawOrder.ercToken);

  const deadline = calculateOrderDeadline(rawOrder.acceptTime);

  const isAcceptorOfOrder = !!address && isAddressEqual(rawOrder.acceptor, address);
  const isCreatorOfOrder = !!address && isAddressEqual(rawOrder.requester, address);

  const bitcoinAddress = rawOrder.bitcoinAddress;
  if (!bitcoinAddress?.scriptPubKey) {
    throw new Error('Bitcoin address not found');
  }

  return {
    acceptId: id,
    orderId: rawOrder.orderId,
    deadline,
    askingCurrency,
    totalAskingAmount: rawOrder.ercAmount,
    buyerBitcoinAddress: getAddressFromScriptPubKey(bitcoinAddress.scriptPubKey),
    isAcceptorOfOrder,
    isCreatorOfOrder
  };
};

const useGetAcceptedOrdinalOrders = () => {
  const { read: readOrdinalMarketplace } = useContract(ContractType.ORD_MARKETPLACE);
  const { address } = useAccount();

  const queryResult = useQuery({
    queryKey: ['accepted-ordinal-orders', address],
    enabled: !!readOrdinalMarketplace,
    queryFn: async () => {
      const [rawAcceptedOrdOrders, acceptIds] = await readOrdinalMarketplace.getOpenAcceptedOrdinalSellOrders();

      return rawAcceptedOrdOrders.map((order, index) => parseAcceptedOrdinalOrder(order, acceptIds[index], address));
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  return queryResult;
};

export { useGetAcceptedOrdinalOrders };
