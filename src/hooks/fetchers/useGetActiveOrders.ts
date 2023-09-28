import { useCallback, useEffect, useState } from 'react';
import { ContractType, Erc20Currency } from '../../constants';
import { useContract } from '../useContract';
import { HexString } from '../../types';
import { getErc20CurrencyFromContractAddress } from '../../utils/currencies';

interface Erc20Order {
  id: bigint;
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
  id: bigint;
  offeringAmount: bigint;
  offeringToken: HexString;
  askingAmount: bigint;
  askingToken: HexString;
  requesterAddress: HexString;
}): Erc20Order => {
  const { id, offeringAmount, offeringToken, askingAmount, askingToken, requesterAddress } = rawOrder;

  const offeringCurrency = getErc20CurrencyFromContractAddress(offeringToken);
  const askingCurrency = getErc20CurrencyFromContractAddress(askingToken);
  // TODO: make common util to handle decimal conversions or handle all monetary amounts in standalone class
  const price =
    Number(askingAmount) / 10 ** askingCurrency.decimals / (Number(offeringAmount) / 10 ** offeringCurrency.decimals);

  return { id, offeringCurrency, askingCurrency, requesterAddress, availableLiquidity: offeringAmount, price };
};

const useGetActiveErc20Orders = () => {
  const [activeOrders, setActiveOrders] = useState<Array<Erc20Order>>();
  const { read: readErc20Marketplace } = useContract(ContractType.ERC20_MARKETPLACE);

  const fetchErc20Orders = useCallback(async () => {
    if (!readErc20Marketplace) return;
    const [rawOrders, identifiers] = await readErc20Marketplace.getOpenOrders();
    // !MEMO: Should use modified marketplace contract to return ID, this will start breaking when orders
    // get cancelled / totally filled.
    const orders = rawOrders.map((order, index) => parseErc20Order({ ...order, id: identifiers[index] }));
    setActiveOrders(orders);
  }, [setActiveOrders, readErc20Marketplace]);

  useEffect(() => {
    fetchErc20Orders();
  }, [fetchErc20Orders]);

  return { data: activeOrders, refetch: fetchErc20Orders };
};

export { useGetActiveErc20Orders };
export type { Erc20Order };
