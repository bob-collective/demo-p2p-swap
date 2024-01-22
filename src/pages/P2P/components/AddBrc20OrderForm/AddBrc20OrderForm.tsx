import { useForm } from '@interlay/hooks';
import { Card, Flex, P, Strong, TokenInput } from '@interlay/ui';
import { mergeProps } from '@react-aria/utils';
import Big from 'big.js';
import { Key, RefObject, useEffect, useState } from 'react';
import { AuthCTA } from '../../../../components/AuthCTA';
import { CurrencyTicker, Erc20CurrencyTicker } from '../../../../constants';
import { useBrc20Balances } from '../../../../hooks/useBrc20Balances';
import { formatUSD } from '../../../../utils/format';
import { AddOrderSchemaParams, addOrderSchema } from '../../../../utils/schemas';
import { isFormDisabled } from '../../../../utils/validation';

type AddBrc20OrderFormData = {
  inputValue?: string;
  outputValue?: string;
  inputTicker: string;
  outputTicker: CurrencyTicker;
};

type AddBrc20OrderFormProps = {
  isLoading: boolean;
  offerModalRef: RefObject<HTMLDivElement>;
  receiveModalRef: RefObject<HTMLDivElement>;
  onSubmit: (data: Required<AddBrc20OrderFormData>) => void;
};

const AddBrc20OrderForm = ({
  isLoading,
  offerModalRef,
  receiveModalRef,
  onSubmit
}: AddBrc20OrderFormProps): JSX.Element => {
  const [tickers, setTickers] = useState<{ inputTicker: string; outputTicker: Erc20CurrencyTicker }>({
    inputTicker: '',
    outputTicker: Erc20CurrencyTicker.USDC
  });

  const { balances, getBalance } = useBrc20Balances();

  const handleSubmit = (values: AddBrc20OrderFormData) => {
    onSubmit?.(values as Required<AddBrc20OrderFormData>);
  };

  const inputBalance = getBalance(tickers.inputTicker);

  const schemaParams: AddOrderSchemaParams = {
    inputValue: {
      maxAmount: inputBalance !== undefined ? inputBalance.toBig() : undefined
    }
  };

  const form = useForm<AddBrc20OrderFormData>({
    initialValues: {
      ...tickers,
      inputValue: '',
      outputValue: ''
    },
    validationSchema: addOrderSchema(schemaParams),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  useEffect(() => {
    if (!balances) return;

    form.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances]);

  const handleInputTickerChange = (ticker: string) => {
    setTickers((s) => ({ ...s, inputTicker: ticker }));
    form.setFieldValue('inputTicker', ticker, true);
  };

  const handleOutputTickerChange = (ticker: Erc20CurrencyTicker) => {
    setTickers((s) => ({ ...s, outputTicker: ticker }));
    form.setFieldValue('outputTicker', ticker, true);
  };

  const isSubmitDisabled = isFormDisabled(form);

  const brc20Items = Object.keys(balances || {}).map((ticker) => ({
    value: ticker,
    balance: getBalance(ticker).toBig().toNumber(),
    balanceUSD: 0
  }));

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <TokenInput
          type='selectable'
          label='Offer'
          balance={inputBalance?.toBig().toString()}
          valueUSD={0}
          selectProps={mergeProps(
            {
              modalProps: { ref: offerModalRef },
              items: brc20Items,
              onSelectionChange: (key: Key) => handleInputTickerChange(key as Erc20CurrencyTicker)
            },
            form.getSelectFieldProps('inputTicker')
          )}
          {...form.getTokenFieldProps('inputValue')}
        />
        <TokenInput
          type='selectable'
          label='You will Receive'
          valueUSD={0}
          selectProps={mergeProps(
            {
              modalProps: { ref: receiveModalRef },
              items: [
                { value: 'WBTC', balance: getBalance(Erc20CurrencyTicker.WBTC).toBig().toNumber(), balanceUSD: 0 },
                { value: 'USDC', balance: getBalance(Erc20CurrencyTicker.USDC).toBig().toNumber(), balanceUSD: 0 },
                { value: 'BTC', balance: '—', balanceUSD: 0 }
              ],
              onSelectionChange: (key: Key) => handleOutputTickerChange(key as Erc20CurrencyTicker)
            },
            form.getSelectFieldProps('outputTicker')
          )}
          {...form.getTokenFieldProps('outputValue')}
        />
        <Flex direction='column' gap='spacing2'>
          <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
            <P size='xs'>
              Price 1 {form.values.inputTicker} ={' '}
              <Strong>
                {form.values.inputValue &&
                Number(form.values.inputValue) &&
                Number(form.values.outputValue) &&
                new Big(form.values.inputValue || 0).gt(0) &&
                !!form.values.outputValue
                  ? new Big(form.values.outputValue).div(form.values.inputValue).toString()
                  : 0}{' '}
                {form.values.outputTicker}{' '}
              </Strong>
            </P>
          </Card>
          <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
            <P size='xs'>Tx Fees 0 ETH ({formatUSD(0)})</P>
          </Card>
        </Flex>
        <AuthCTA isBtcAuthRequired fullWidth loading={isLoading} disabled={isSubmitDisabled} size='large' type='submit'>
          Place Order
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { AddBrc20OrderForm };
export type { AddBrc20OrderFormData, AddBrc20OrderFormProps };
