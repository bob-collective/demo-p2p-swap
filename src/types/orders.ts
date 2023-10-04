import { BitcoinCurrency, Currency, Erc20Currency } from '../constants';
import { HexString } from './common';

interface BaseOrder {
  id: bigint;
  offeringCurrency: Currency;
  askingCurrency: Currency;
  price: number; // Price per unit of asking token.
  availableLiquidity: bigint; // Amount in offering token.
  totalAskingAmount: bigint; // Amount in asking token.
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
  acceptTime: bigint | undefined; // If undefined then order has not been accepted.
}

interface BtcSellOrder extends BaseOrder {
  offeringCurrency: BitcoinCurrency;
  askingCurrency: Erc20Currency;
}

interface PendingBtcOrder {
  amountBtc: bigint;
  otherCurrency: Currency;
  otherCurrencyAmount: bigint;
  bitcoinAddress: string;
  btcReceiver: HexString;
  btcPayer: HexString;
}

type BtcOrder = BtcBuyOrder | BtcSellOrder;

type Order = BtcOrder | Erc20Order;

export type { Order, Erc20Order, BtcBuyOrder, BtcSellOrder, BtcOrder, PendingBtcOrder };
