import { useForm } from '@interlay/hooks';
import { Card, Flex, P, Strong, TokenInput } from '@interlay/ui';
import { mergeProps } from '@react-aria/utils';
import Big from 'big.js';
import { useEffect } from 'react';
import { AuthCTA } from '../../../../components/AuthCTA';
import { ContractType, Erc20CurrencyTicker } from '../../../../constants';
import { useBalances } from '../../../../hooks/useBalances';
import { useErc20Allowance } from '../../../../hooks/useErc20Allowance';
import { Erc20Order } from '../../../../types/orders';
import { Amount } from '../../../../utils/amount';
import { toBaseAmount } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';
import { FillOrderSchemaParams, fillOrderSchema } from '../../../../utils/schemas';
import { isFormDisabled } from '../../../../utils/validation';

type FillErc20OrderFormData = {
  inputValue: string;
  outputValue: string;
};

type FillErc20OrderFormProps = {
  isLoading: boolean;
  order: Erc20Order;
  onSubmit: (values: FillErc20OrderFormData) => void;
};

const FillErc20OrderForm = ({ isLoading, order, onSubmit }: FillErc20OrderFormProps): JSX.Element => {
  const { balances, getBalance } = useBalances();

  const {
    isLoading: isLoadingAllowance,
    isAllowed: isAskingCurrencyTransferApproved,
    wrapInErc20ApprovalTx
  } = useErc20Allowance(ContractType.ERC20_MARKETPLACE, order.askingCurrency.ticker);

  const handleSubmit = (values: FillErc20OrderFormData) => {
    wrapInErc20ApprovalTx(() => onSubmit?.(values));
  };

  const inputBalance = getBalance(Erc20CurrencyTicker[order.askingCurrency.ticker]);

  const outputMaxAmount = new Amount(order.offeringCurrency, Number(order.availableLiquidity)).toBig();
  const inputMaxAmount = outputMaxAmount.mul(order.price);

  const inputLimitAmount = inputBalance.toBig().gt(inputMaxAmount) ? inputMaxAmount : inputBalance.toBig();

  const schemaParams: FillOrderSchemaParams = {
    inputValue: {
      maxAmount: inputLimitAmount
    },
    outputValue: {
      maxAmount: outputMaxAmount
    }
  };

  const form = useForm<FillErc20OrderFormData>({
    initialValues: {
      inputValue: '',
      outputValue: ''
    },
    validationSchema: fillOrderSchema(schemaParams),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  useEffect(() => {
    if (!balances) return;

    form.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances]);

  const handleInputChange = (value: string) => {
    if (!form.touched.outputValue) {
      form.setFieldTouched('outputValue', true);
    }

    const calculated = new Big(value || 0).gt(0) ? new Big(value).div(order.price).toString() : '0';

    form.setFieldValue('outputValue', calculated, true);
  };

  const handleOutputChange = (value: string) => {
    if (!form.touched.inputValue) {
      form.setFieldTouched('inputValue', true);
    }

    const calculated = new Big(value || 0).gt(0) ? new Big(value).mul(order.price).toString() : '0';

    form.setFieldValue('inputValue', calculated, true);
  };

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
          balance={inputLimitAmount.toString()}
          balanceLabel='Available'
          valueUSD={0}
          ticker={order.askingCurrency.ticker}
          {...mergeProps(form.getTokenFieldProps('inputValue'), { onValueChange: handleInputChange })}
        />
        <TokenInput
          label='You will Receive'
          balance={outputMaxAmount.toString()}
          balanceLabel='Limit'
          valueUSD={0}
          ticker={order.offeringCurrency.ticker}
          {...mergeProps(form.getTokenFieldProps('outputValue'), { onValueChange: handleOutputChange })}
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
        <AuthCTA loading={isLoading || isLoadingAllowance} disabled={isSubmitDisabled} size='large' type='submit'>
          {isAskingCurrencyTransferApproved ? 'Fill Order' : 'Approve & Fill Order'}
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { FillErc20OrderForm };
export type { FillErc20OrderFormData, FillErc20OrderFormProps };
