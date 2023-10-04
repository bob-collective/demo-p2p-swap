import { BitcoinCurrency, Currency, Erc20Currency } from '../constants';
import { HexString } from './common';

interface BaseOrder {
  id: bigint;
  offeringCurrency: Currency;
  askingCurrency: Currency;
  price: number; // Price per unit of asking token.
  availableLiquidity: bigint; // Amount in offering token.
  requesterAddress: HexString;
}

interface Erc20Order extends BaseOrder {
  offeringCurrency: Erc20Currency;
  askingCurrency: Erc20Currency;
}

interface BtcBuyOrder extends BaseOrder {
  offeringCurrency: Erc20Currency;
  askingCurrency: BitcoinCurrency;
  bitcoinAddress: string;
}

interface BtcSellOrder extends BaseOrder {
  offeringCurrency: BitcoinCurrency;
  askingCurrency: Erc20Currency;
}

type BtcOrder = BtcBuyOrder | BtcSellOrder;

type Order = BtcOrder | Erc20Order;

interface BaseAcceptedOrder {
  id: bigint;
  price: number;
  acceptTime: Date;
  amount: bigint; // Amount accepted token.
  accepterAddress: HexString;
  requesterAddress: HexString;
}

interface AcceptedBuyOrder extends BaseAcceptedOrder {
  offeringCurrency: Erc20Currency;
  askingCurrency: BitcoinCurrency;
}

export type { Order, Erc20Order, BtcBuyOrder, BtcSellOrder, BtcOrder, AcceptedBuyOrder };
