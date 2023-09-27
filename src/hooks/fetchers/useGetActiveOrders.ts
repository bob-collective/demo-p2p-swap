import { useCallback, useEffect, useState } from 'react';
import { ContractType, Erc20Currency } from '../../constants';
import { useContract } from '../useContract';
import { HexString } from '../../types';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';

interface Erc20Order {
  offeringCurrency: Erc20Currency;
  askingCurrency: Erc20Currency;
  price: number; // Price per unit of asking token.
  availableLiquidity: bigint; // Amount in offering token.
  requesterAddress: HexString;
}

// const calculateOfferPrice = (
//   offeringAmount: bigint,
//   offeringToken: HexString,
//   askingAmount: bigint,
//   askingToken: HexString
// ) => {
//   const offeringCurrency = getErc20CurrencyFromContractAddress(offeringToken);
//   const askingCurrency = getErc20CurrencyFromContractAddress(askingToken);
//   const atomicPrice = offeringAmount / askingAmount;
//   const basePrice = parseInt(atomicPrice.toString()) / askingCurrency.decimals;
//   return { atomic: atomicPrice, base: basePrice };
// };

const parseErc20Order = (rawOrder: {
  offeringAmount: bigint;
  offeringToken: HexString;
  askingAmount: bigint;
  askingToken: HexString;
  requesterAddress: HexString;
}): Erc20Order => {
  const { offeringAmount, offeringToken, askingAmount, askingToken, requesterAddress } = rawOrder;

  const offeringCurrency = getErc20CurrencyFromContractAddress(offeringToken);
  const askingCurrency = getErc20CurrencyFromContractAddress(askingToken);
  const price = parseInt((askingAmount / offeringAmount).toString()) / offeringCurrency.decimals;

  return { offeringCurrency, askingCurrency, requesterAddress, availableLiquidity: askingAmount, price };
};

const useGetActiveErc20Orders = () => {
  const [activeOrders, setActiveOrders] = useState<Array<Erc20Order>>();
  const { read: readErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);

  const fetchErc20Orders = useCallback(async () => {
    if (!readErc20Marketplace) return;
    const rawOrders = await readErc20Marketplace.getOpenOrders();
    const orders = rawOrders.map(parseErc20Order);
    setActiveOrders(orders);
  }, [setActiveOrders, readErc20Marketplace]);

  useEffect(() => {
    fetchErc20Orders;
  }, [fetchErc20Orders]);

  return { data: activeOrders, refetch: fetchErc20Orders };
};

export { useGetActiveErc20Orders };
