import { useForm } from '@interlay/hooks';
import { Card, Flex, Input, P, Strong, TokenInput } from '@interlay/ui';
import { mergeProps } from '@react-aria/utils';
import Big from 'big.js';
import { Key, RefObject, useEffect, useState } from 'react';
import { AuthCTA } from '../../../../components/AuthCTA';
import { ContractType, CurrencyTicker, Erc20CurrencyTicker } from '../../../../constants';
import { useBalances } from '../../../../hooks/useBalances';
import { useErc20Allowance } from '../../../../hooks/useErc20Allowance';
import { isBitcoinTicker } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';
import { AddOrderSchemaParams, addOrderSchema } from '../../../../utils/schemas';
import { isFormDisabled } from '../../../../utils/validation';

type AddOrderFormData = {
  inputValue?: string;
  outputValue?: string;
  inputTicker: CurrencyTicker;
  outputTicker: CurrencyTicker;
  btcAddress?: string;
};

type AddOrderFormProps = {
  isLoading: boolean;
  offerModalRef: RefObject<HTMLDivElement>;
  receiveModalRef: RefObject<HTMLDivElement>;
  onSubmit: (data: Required<AddOrderFormData>) => void;
};

const AddOrderForm = ({ isLoading, offerModalRef, receiveModalRef, onSubmit }: AddOrderFormProps): JSX.Element => {
  const [tickers, setTickers] = useState<{ inputTicker: CurrencyTicker; outputTicker: CurrencyTicker }>({
    inputTicker: Erc20CurrencyTicker.ZBTC,
    outputTicker: Erc20CurrencyTicker.USDT
  });

  const isSellingBTC = tickers.inputTicker === 'BTC';
  const isBuyingBTC = tickers.outputTicker === 'BTC';

  const { balances, getBalance } = useBalances();

  const handleSubmit = (values: AddOrderFormData) => {
    if (isSellingBTC) {
      return onSubmit?.(values as Required<AddOrderFormData>);
    }

    wrapInErc20ApprovalTx(() => onSubmit?.(values as Required<AddOrderFormData>));
  };

  const inputBalance = isSellingBTC ? undefined : getBalance(tickers.inputTicker);

  const schemaParams: AddOrderSchemaParams = {
    inputValue: {
      maxAmount: inputBalance !== undefined ? inputBalance.toBig() : undefined
    }
  };

  const form = useForm<AddOrderFormData>({
    initialValues: {
      ...tickers,
      inputValue: '',
      outputValue: '',
      btcAddress: ''
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

  const {
    isLoading: isLoadingAllowance,
    isAllowed: inputErc20TransferApproved,
    wrapInErc20ApprovalTx
  } = useErc20Allowance(
    isBitcoinTicker(form.values.outputTicker) ? ContractType.BTC_MARKETPLACE : ContractType.ERC20_MARKETPLACE,
    form.values.inputTicker as Erc20CurrencyTicker
  );

  const handleTickerChange = (values: { inputTicker: CurrencyTicker; outputTicker: CurrencyTicker }) => {
    setTickers(values);
  };

  const handleInputTickerChange = (ticker: Erc20CurrencyTicker) => {
    const isDuplicate = ticker === form.values.outputTicker;

    const values = {
      outputTicker: isDuplicate ? form.values.inputTicker : form.values.outputTicker,
      inputTicker: ticker
    };

    handleTickerChange(values);

    form.setValues({
      ...form.values,
      ...values
    });
  };

  const handleOutputTickerChange = (ticker: CurrencyTicker) => {
    const isDuplicate = ticker === form.values.inputTicker;

    const values = {
      inputTicker: isDuplicate ? form.values.outputTicker : form.values.inputTicker,
      outputTicker: ticker
    };

    handleTickerChange(values);

    form.setValues({
      ...form.values,
      ...values
    });
  };

  const isSubmitDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <P size='s'>Input the details and values of your order's assets</P>
        <TokenInput
          type='selectable'
          label='Offer'
          balance={inputBalance?.toBig().toString()}
          valueUSD={0}
          selectProps={mergeProps(
            {
              modalProps: { ref: offerModalRef },
              items: [
                { value: 'ZBTC', balance: getBalance(Erc20CurrencyTicker.ZBTC).toBig().toNumber(), balanceUSD: 0 },
                { value: 'USDT', balance: getBalance(Erc20CurrencyTicker.USDT).toBig().toNumber(), balanceUSD: 0 },
                { value: 'BTC', balance: '—', balanceUSD: 0 }
              ],
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
                { value: 'ZBTC', balance: getBalance(Erc20CurrencyTicker.ZBTC).toBig().toNumber(), balanceUSD: 0 },
                { value: 'USDT', balance: getBalance(Erc20CurrencyTicker.USDT).toBig().toNumber(), balanceUSD: 0 },
                { value: 'BTC', balance: '—', balanceUSD: 0 }
              ],
              onSelectionChange: (key: Key) => handleOutputTickerChange(key as Erc20CurrencyTicker)
            },
            form.getSelectFieldProps('outputTicker')
          )}
          {...form.getTokenFieldProps('outputValue')}
        />
        {isBuyingBTC && (
          <Input
            label='Bitcoin Address'
            placeholder='Enter your bitcoin address'
            {...form.getFieldProps('btcAddress')}
          />
        )}

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
        <AuthCTA
          fullWidth
          loading={isLoading || isLoadingAllowance}
          disabled={isSubmitDisabled}
          size='large'
          type='submit'
        >
          {isSellingBTC || inputErc20TransferApproved ? 'Place Order' : 'Approve & Place Order'}
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { AddOrderForm };
export type { AddOrderFormData, AddOrderFormProps };
