import { Order } from '../../../../types/orders';
import { isBtcBuyOrder, isErc20Order } from '../../../../utils/orders';
import { FillErc20OrderForm } from './FillErc20OrderForm';
import { FillBtcBuyOrderForm } from './FillBtcBuyOrderForm';
import { FillBtcSellOrderForm } from './FillBtcSellOrderForm';

type FillOrderFormData = {
  input?: string;
};

type FillOrderFormProps = {
  isLoading: boolean;
  order: Order;
  onSubmit: (data?: Required<FillOrderFormData>) => void;
};

const FillOrderForm = ({ isLoading, order, onSubmit }: FillOrderFormProps): JSX.Element => {
  if (isErc20Order(order)) {
    return <FillErc20OrderForm {...{ isLoading, order, onSubmit }} />;
  }
  if (isBtcBuyOrder(order)) return <FillBtcBuyOrderForm {...{ isLoading, order, onSubmit }} />;
  else return <FillBtcSellOrderForm {...{ isLoading, order, onSubmit }} />;
};

export { FillOrderForm };
export type { FillOrderFormProps, FillOrderFormData };
