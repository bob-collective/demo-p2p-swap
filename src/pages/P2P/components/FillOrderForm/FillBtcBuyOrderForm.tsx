import { useForm } from '@interlay/hooks';
import { Card, Flex, P, Strong, TokenInput } from '@interlay/ui';
import { AuthCTA } from '../../../../components/AuthCTA';
import { BtcBuyOrder } from '../../../../types/orders';
import { Amount } from '../../../../utils/amount';
import { toBaseAmount } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';
import { FillOrderSchemaParams, fillOrderSchema } from '../../../../utils/schemas';
import { isFormDisabled } from '../../../../utils/validation';

type FillBTCBuyOrderFormData = {
  inputValue: string;
  outputValue: string;
};

type FillBtcBuyOrderFormProps = {
  isLoading: boolean;
  order: BtcBuyOrder;
  onSubmit: (values: FillBTCBuyOrderFormData) => void;
};

const FillBtcBuyOrderForm = ({ isLoading, order, onSubmit }: FillBtcBuyOrderFormProps): JSX.Element => {
  const handleSubmit = (values: FillBTCBuyOrderFormData) => {
    onSubmit(values);
  };

  const outputMaxAmount = new Amount(order.offeringCurrency, Number(order.availableLiquidity)).toBig();
  const inputMaxAmount = outputMaxAmount.mul(order.price);

  const schemaParams: FillOrderSchemaParams = {
    inputValue: {
      maxAmount: inputMaxAmount
    },
    outputValue: {
      maxAmount: outputMaxAmount
    }
  };

  const form = useForm<FillBTCBuyOrderFormData>({
    initialValues: {
      inputValue: inputMaxAmount.toString(),
      outputValue: outputMaxAmount.toString()
    },
    validationSchema: fillOrderSchema(schemaParams),
    onSubmit: handleSubmit,
    validateOnMount: true
    // TODO: set to hideErrors: "untouced" when allowing partial fullfilments
  });

  const isSubmitDisabled = isFormDisabled(form, false);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
          <P size='xs'>
            Remaining available: {toBaseAmount(order.availableLiquidity, order.offeringCurrency.ticker)}{' '}
            {order.offeringCurrency.ticker}
          </P>
        </Card>
        <TokenInput
          label='Pay with'
          isReadOnly // TODO: remove after we start allowing partial fullfilments
          valueUSD={0}
          ticker={order.askingCurrency.ticker}
          {...form.getTokenFieldProps('inputValue')}
        />
        <TokenInput
          label='You will Receive'
          isReadOnly // TODO: remove after we start allowing partial fullfilments
          balance={outputMaxAmount.toString()}
          balanceLabel='Limit'
          valueUSD={0}
          ticker={order.offeringCurrency.ticker}
          {...form.getTokenFieldProps('outputValue')}
        />
        <Flex direction='column' gap='spacing2'>
          <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
            <P size='xs'>
              Price 1 {order.offeringCurrency.ticker} ={' '}
              <Strong>
                {order.price} {order.askingCurrency.ticker}{' '}
              </Strong>
            </P>
          </Card>
          <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
            <P size='xs'>Tx Fees 0 ETH ({formatUSD(0)})</P>
          </Card>
        </Flex>
        <AuthCTA fullWidth disabled={isSubmitDisabled} loading={isLoading} size='large' type='submit'>
          Fill Order
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { FillBtcBuyOrderForm };
export type { FillBTCBuyOrderFormData };
