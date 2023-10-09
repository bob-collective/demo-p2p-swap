import { Order } from '../../../../types/orders';
import { isBtcBuyOrder, isErc20Order } from '../../../../utils/orders';
import { FillErc20OrderForm } from './FillErc20OrderForm';
import { FillBtcBuyOrderForm } from './FillBtcBuyOrderForm';
import { FillBtcSellOrderForm } from './FillBtcSellOrderForm';

type FillOrderFormData = {
  input?: string;
  btcAddress?: string;
};

type FillOrderFormProps = {
  order: Order;
  onSubmit: (data?: FillOrderFormData) => void;
};

const FillOrderForm = ({ order, onSubmit }: FillOrderFormProps): JSX.Element => {
  if (isErc20Order(order)) {
    return <FillErc20OrderForm {...{ order, onSubmit }} />;
  }
  if (isBtcBuyOrder(order)) return <FillBtcBuyOrderForm {...{ order, onSubmit }} />;
  else return <FillBtcSellOrderForm {...{ order, onSubmit }} />;
};

export { FillOrderForm };
export type { FillOrderFormProps, FillOrderFormData };
