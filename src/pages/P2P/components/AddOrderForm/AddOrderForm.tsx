import { useForm } from '@interlay/hooks';
import { CTA, Card, Flex, Input, P, Strong, TokenInput } from '@interlay/ui';
import { mergeProps } from '@react-aria/utils';
import { Key, RefObject, useMemo, useState } from 'react';
import * as yup from 'yup';
import { ContractType, CurrencyTicker, Erc20CurrencyTicker } from '../../../../constants';
import { useBalances } from '../../../../hooks/useBalances';
import { useErc20Allowance } from '../../../../hooks/useErc20Allowance';
import { isBitcoinTicker } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';
import { isFormDisabled, isValidBTCAddress } from '../../../../utils/validation';

type AddOrderFormData = {
  inputValue?: string;
  outputValue?: string;
  inputTicker: CurrencyTicker;
  outputTicker: CurrencyTicker;
  btcAddress?: string;
};

type AddOrderFormProps = {
  offerModalRef: RefObject<HTMLDivElement>;
  receiveModalRef: RefObject<HTMLDivElement>;
  onSubmit: (data: Required<AddOrderFormData>) => void;
};

const AddOrderForm = ({ offerModalRef, receiveModalRef, onSubmit }: AddOrderFormProps): JSX.Element => {
  const inititalTickers = useMemo(
    () => ({
      inputTicker: Erc20CurrencyTicker.ZBTC as CurrencyTicker,
      outputTicker: Erc20CurrencyTicker.USDT as CurrencyTicker
    }),
    []
  );

  const [state, setState] = useState<{ isSellingBTC: boolean; isBuyingBTC: boolean }>({
    isSellingBTC: inititalTickers.inputTicker === 'BTC',
    isBuyingBTC: inititalTickers.outputTicker === 'BTC'
  });

  const { getBalanceInBaseDecimals } = useBalances();

  const handleSubmit = (values: AddOrderFormData) => {
    if (state.isSellingBTC) {
      return onSubmit?.(values as Required<AddOrderFormData>);
    }

    wrapInErc20ApprovalTx(() => onSubmit?.(values as Required<AddOrderFormData>));
  };

  const form = useForm<AddOrderFormData>({
    initialValues: {
      ...inititalTickers,
      inputValue: '',
      outputValue: '',
      btcAddress: ''
    },
    validationSchema: yup.object().shape({
      inputTicker: yup.string().required(),
      outputTicker: yup.string().required(),
      inputValue: yup.string().required('Please enter offer amount'),
      outputValue: yup.string().required('Please enter '),
      btcAddress: state.isBuyingBTC
        ? yup
            .string()
            .required('Please enter bitcoin address')
            .test('btcAddress', (value, ctx) => {
              if (value === undefined) {
                return true;
              }

              const isValid = isValidBTCAddress(value || '');

              return isValid ? true : ctx.createError({ message: 'Please enter a valid address' });
            })
        : yup.string()
    }),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  const { isAllowed: inputErc20TransferApproved, wrapInErc20ApprovalTx } = useErc20Allowance(
    isBitcoinTicker(form.values.outputTicker) ? ContractType.BTC_MARKETPLACE : ContractType.ERC20_MARKETPLACE,
    form.values.inputTicker as Erc20CurrencyTicker
  );

  const handleTickerChange = (values: { inputTicker: string; outputTicker: string }) => {
    setState({
      isSellingBTC: values.inputTicker === 'BTC',
      isBuyingBTC: values.outputTicker === 'BTC'
    });
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

  const handleOutputTickerChange = (ticker: Erc20CurrencyTicker) => {
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
          balance={
            isBitcoinTicker(form.values.inputTicker) ? undefined : getBalanceInBaseDecimals(form.values.inputTicker)
          }
          valueUSD={0}
          selectProps={mergeProps(
            {
              modalProps: { ref: offerModalRef },
              items: [
                { value: 'ZBTC', balance: getBalanceInBaseDecimals(Erc20CurrencyTicker.ZBTC), balanceUSD: 0 },
                { value: 'USDT', balance: getBalanceInBaseDecimals(Erc20CurrencyTicker.USDT), balanceUSD: 0 },
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
          balance={
            isBitcoinTicker(form.values.outputTicker) ? undefined : getBalanceInBaseDecimals(form.values.outputTicker)
          }
          valueUSD={0}
          selectProps={mergeProps(
            {
              modalProps: { ref: receiveModalRef },
              items: [
                { value: 'ZBTC', balance: getBalanceInBaseDecimals(Erc20CurrencyTicker.ZBTC), balanceUSD: 0 },
                { value: 'USDT', balance: getBalanceInBaseDecimals(Erc20CurrencyTicker.USDT), balanceUSD: 0 },
                { value: 'BTC', balance: '—', balanceUSD: 0 }
              ],
              onSelectionChange: (key: Key) => handleOutputTickerChange(key as Erc20CurrencyTicker)
            },
            form.getSelectFieldProps('outputTicker')
          )}
          {...form.getTokenFieldProps('outputValue')}
        />
        {state.isBuyingBTC && (
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
                {form.values.inputValue && form.values.outputValue
                  ? parseFloat(form.values.outputValue) / parseFloat(form.values.inputValue)
                  : 0}{' '}
                {form.values.outputTicker}{' '}
              </Strong>
            </P>
          </Card>
          <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
            <P size='xs'>Tx Fees 0 BOB ({formatUSD(0)})</P>
          </Card>
        </Flex>
      </Flex>
      <CTA disabled={isSubmitDisabled} size='large' type='submit'>
        {state.isSellingBTC || inputErc20TransferApproved ? 'Place Order' : 'Approve & Place Order'}
      </CTA>
    </form>
  );
};

export { AddOrderForm };
export type { AddOrderFormData, AddOrderFormProps };
