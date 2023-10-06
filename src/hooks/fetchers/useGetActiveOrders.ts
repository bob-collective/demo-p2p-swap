import { useCallback, useEffect, useState } from 'react';
import { ContractType } from '../../constants';
import { useContract } from '../useContract';
import { HexString } from '../../types';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';
import { Erc20Order } from '../../types/orders';
import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';
import { calculateOrderPrice } from '../../utils/orders';

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

  const price = calculateOrderPrice(
    rawOrder.offeringAmount,
    offeringCurrency.decimals,
    rawOrder.askingAmount,
    askingCurrency.decimals
  );

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
  const [activeOrders, setActiveOrders] = useState<Array<Erc20Order>>();
  const { read: readErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);

  const { address } = useAccount();

  const fetchErc20Orders = useCallback(async () => {
    if (!readErc20Marketplace) return;
    const [rawOrders, identifiers] = await readErc20Marketplace.getOpenOrders();
    // !MEMO: Should use modified marketplace contract to return ID, this will start breaking when orders
    // get cancelled / totally filled.
    const orders = rawOrders.map((order, index) => parseErc20Order({ ...order, id: identifiers[index] }, address));
    setActiveOrders(orders);
  }, [setActiveOrders, readErc20Marketplace, address]);

  useEffect(() => {
    fetchErc20Orders();
  }, [fetchErc20Orders]);

  return { data: activeOrders, refetch: fetchErc20Orders };
};

export { useGetActiveErc20Orders };
export type { Erc20Order };
