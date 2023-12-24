import { useQuery } from '@tanstack/react-query';
import { ContractType } from '../../constants';

import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';
import { HexString } from '../../types';
import { AcceptedOrdinalOrder, Utxo } from '../../types/orders';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { calculateOrderDeadline } from '../../utils/orders';
import { useContract } from '../useContract';
import { REFETCH_INTERVAL } from '../../constants/query';
import { BITCOIN_NETWORK, getAddressFromScriptPubKey } from '../../utils/bitcoin';
import { ordinalIdToString } from '../../utils/format';
import { getContentType, getInscriptionFromId } from '../../utils/inscription';
import { DefaultElectrsClient } from '@gobob/bob-sdk';

const parseAcceptedOrdinalOrder = async (
  rawOrder: {
    ordinalID: { txId: `0x${string}`; index: number };
    sellToken: `0x${string}`;
    sellAmount: bigint;
    utxo: Utxo;
    requester: `0x${string}`;
  },
  rawAcceptedOrder: {
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
): Promise<AcceptedOrdinalOrder> => {
  const askingCurrency = getErc20CurrencyFromContractAddress(rawAcceptedOrder.ercToken);

  const deadline = calculateOrderDeadline(rawAcceptedOrder.acceptTime);

  const isAcceptorOfOrder = !!address && isAddressEqual(rawAcceptedOrder.acceptor, address);
  const isCreatorOfOrder = !!address && isAddressEqual(rawAcceptedOrder.requester, address);

  const bitcoinAddress = rawAcceptedOrder.bitcoinAddress;
  if (!bitcoinAddress?.scriptPubKey) {
    throw new Error('Bitcoin address not found');
  }

  const electrsClient = new DefaultElectrsClient(BITCOIN_NETWORK);

  const inscription = await getInscriptionFromId(electrsClient, ordinalIdToString(rawOrder.ordinalID));

  const contentType = getContentType(inscription);

  const isErc20 = contentType?.includes('text/plain');

  return {
    acceptId: id,
    orderId: rawAcceptedOrder.orderId,
    ordinalId: rawOrder.ordinalID,
    deadline,
    askingCurrency,
    totalAskingAmount: rawAcceptedOrder.ercAmount,
    buyerBitcoinAddress: getAddressFromScriptPubKey(bitcoinAddress.scriptPubKey),
    isAcceptorOfOrder,
    isCreatorOfOrder,
    utxo: rawOrder.utxo,
    isErc20: isErc20 as boolean
  };
};

const useGetAcceptedOrdinalOrders = () => {
  const { read: readOrdinalMarketplace } = useContract(ContractType.ORD_MARKETPLACE);
  const { address } = useAccount();

  const queryResult = useQuery({
    queryKey: ['accepted-ordinal-orders', address],
    enabled: !!readOrdinalMarketplace,
    queryFn: async () => {
      const [[rawOrders, ordersIds], [rawOrderAcceptances, acceptIds]] = await Promise.all([
        readOrdinalMarketplace.getOpenOrdinalSellOrders(),
        readOrdinalMarketplace.getOpenAcceptedOrdinalSellOrders()
      ]);

      return Promise.all(
        rawOrderAcceptances.map((order, index) => {
          const orderId = ordersIds.findIndex((id) => id === order.orderId);

          return parseAcceptedOrdinalOrder(rawOrders[orderId], order, acceptIds[index], address);
        })
      );
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  return queryResult;
};

export { useGetAcceptedOrdinalOrders };
