import { useForm } from '@interlay/hooks';
import { CTA, Card, Flex, Input, P, Strong, TokenInput } from '@interlay/ui';
import { ContractType, Erc20CurrencyTicker } from '../../../../constants';
import { useBalances } from '../../../../hooks/useBalances';
import { useErc20Allowance } from '../../../../hooks/useErc20Allowance';
import { BtcSellOrder } from '../../../../types/orders';
import { Amount } from '../../../../utils/amount';
import { toBaseAmount } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';
import { FillOrderSchemaParams, fillOrderSchema } from '../../../../utils/schemas';
import { isFormDisabled } from '../../../../utils/validation';
import { useEffect } from 'react';

type FillBTCSellOrderFormData = {
  inputValue: string;
  outputValue: string;
  btcAddress: string;
};

type FillBtcSellOrderFormProps = {
  isLoading: boolean;
  order: BtcSellOrder;
  onSubmit: (values: FillBTCSellOrderFormData) => void;
};

const FillBtcSellOrderForm = ({ isLoading, order, onSubmit }: FillBtcSellOrderFormProps): JSX.Element => {
  const { balances, getBalance } = useBalances();

  const handleSubmit = (values: FillBTCSellOrderFormData) => {
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

  const form = useForm<FillBTCSellOrderFormData>({
    initialValues: {
      // TODO: set to "" when allowing partial fullfilments
      inputValue: inputMaxAmount.toString(),
      // TODO: set to "" when allowing partial fullfilments
      outputValue: outputMaxAmount.toString(),
      btcAddress: ''
    },
    validationSchema: fillOrderSchema(schemaParams, true),
    onSubmit: handleSubmit,
    // TODO: set to hideErrors: "untouced" when allowing partial fullfilments
    hideErrors: {
      btcAddress: 'untouched'
    }
  });

  useEffect(() => {
    if (!balances) return;

    form.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances]);

  const {
    isLoading: isLoadingAllowance,
    isAllowed: isAskingCurrencyTransferApproved,
    wrapInErc20ApprovalTx
  } = useErc20Allowance(ContractType.BTC_MARKETPLACE, order.askingCurrency.ticker);

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
          balanceLabel='Limit'
          isReadOnly // TODO: remove after we start allowing partial fullfilments
          valueUSD={0}
          ticker={order.askingCurrency.ticker}
          {...form.getTokenFieldProps('inputValue')}
        />
        <TokenInput
          label='You will Receive'
          isReadOnly // TODO: remove after we start allowing partial fullfilments
          valueUSD={0}
          ticker={order.offeringCurrency.ticker}
          {...form.getTokenFieldProps('outputValue')}
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
      <CTA loading={isLoading || isLoadingAllowance} disabled={isSubmitDisabled} size='large' type='submit'>
        {!isAskingCurrencyTransferApproved && 'Approve & '} Fill Order
      </CTA>
    </form>
  );
};

export { FillBtcSellOrderForm };
export type { FillBTCSellOrderFormData };
