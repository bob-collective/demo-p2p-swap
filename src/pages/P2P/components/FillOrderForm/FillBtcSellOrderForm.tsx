import { useForm } from '@interlay/hooks';
import { CTA, Card, Flex, Input, P, Strong, TokenInput } from '@interlay/ui';
import * as yup from 'yup';
import { ContractType, Erc20CurrencyTicker } from '../../../../constants';
import { useBalances } from '../../../../hooks/useBalances';
import { useErc20Allowance } from '../../../../hooks/useErc20Allowance';
import { BtcSellOrder } from '../../../../types/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';
import { isFormDisabled, isValidBTCAddress } from '../../../../utils/validation';

type FillBTCSellOrderForm = {
  input: string;
  output: string;
  btcAddress: string;
};

type FillBtcSellOrderFormProps = {
  order: BtcSellOrder;
  onSubmit: (values: FillBTCSellOrderForm) => void;
};

const FillBtcSellOrderForm = ({ order, onSubmit }: FillBtcSellOrderFormProps): JSX.Element => {
  const { getBalanceInBaseDecimals } = useBalances();

  const handleSubmit = (values: FillBTCSellOrderForm) => {
    wrapInErc20ApprovalTx(() => onSubmit?.(values));
  };

  const outputAmount = toBaseAmount(order.availableLiquidity, order.offeringCurrency.ticker);

  const form = useForm<FillBTCSellOrderForm>({
    initialValues: { input: (order.price * parseFloat(outputAmount)).toString(), output: outputAmount, btcAddress: '' },
    validationSchema: yup.object().shape({
      input: yup.string().required('Please enter amount'),
      output: yup.string().required('Please enter amount'),
      btcAddress: yup
        .string()
        .required('Please enter bitcoin address')
        .test('btcAddress', (value, ctx) => {
          if (value === undefined) {
            return true;
          }

          const isValid = isValidBTCAddress(value || '');

          return isValid ? true : ctx.createError({ message: 'Please enter a valid address' });
        })
    }),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  const { isAllowed: isAskingCurrencyTransferApproved, wrapInErc20ApprovalTx } = useErc20Allowance(
    ContractType.BTC_MARKETPLACE,
    order.askingCurrency.ticker
  );

  const isSubmitDisabled = isFormDisabled(form);

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
          balance={getBalanceInBaseDecimals(Erc20CurrencyTicker[order.askingCurrency.ticker])}
          isDisabled // TODO: remove after we start allowing partial fullfilments
          valueUSD={0}
          ticker={order.askingCurrency.ticker}
          {...form.getTokenFieldProps('input')}
        />
        <TokenInput
          label='You will Receive'
          isDisabled
          valueUSD={0}
          ticker={order.offeringCurrency.ticker}
          {...form.getTokenFieldProps('output')}
        />
        <Input
          label='Bitcoin Address'
          placeholder='Enter your bitcoin address'
          {...form.getTokenFieldProps('btcAddress')}
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
            <P size='xs'>Tx Fees 0 BOB ({formatUSD(0)})</P>
          </Card>
        </Flex>
      </Flex>
      <CTA disabled={isSubmitDisabled} size='large' type='submit'>
        {!isAskingCurrencyTransferApproved && 'Approve & '} Fill Order
      </CTA>
    </form>
  );
};

export { FillBtcSellOrderForm };
