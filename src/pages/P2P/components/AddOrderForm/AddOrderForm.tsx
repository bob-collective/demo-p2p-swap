import { CTA, Card, Flex, P, Strong, TokenInput } from '@interlay/ui';
import { ChangeEvent, FormEvent, RefObject, useCallback, useEffect, useState } from 'react';
import { formatUSD } from '../../../../utils/format';
import { useBalances } from '../../../../hooks/useBalances';
import { ContractType,  Erc20CurrencyTicker, UINT_256_MAX, contracts } from '../../../../constants';
import { useContract } from '../../../../hooks/useContract';
import { useAccount, usePublicClient } from 'wagmi';

type AddOrderFormData = {
  inputValue?: string;
  outputValue?: string;
  inputTicker: Erc20CurrencyTicker;
  outputTicker: Erc20CurrencyTicker;
};

type AddOrderFormProps = {
  offerModalRef: RefObject<HTMLDivElement>;
  receiveModalRef: RefObject<HTMLDivElement>;
  onSubmit: (data: Required<AddOrderFormData>) => void;
};

const AddOrderForm = ({ offerModalRef, receiveModalRef, onSubmit }: AddOrderFormProps): JSX.Element => {
  const [state, setState] = useState<AddOrderFormData>({
    inputTicker: Erc20CurrencyTicker.ZBTC,
    outputTicker: Erc20CurrencyTicker.USDT
  });
  const [inputErc20TransferApproved, setInputErc20TransferApproved] = useState(false);

  const { address } = useAccount();

  const { read: readInputContract, write: writeInputContract } = useContract(ContractType[state.inputTicker]);
  const publicClient = usePublicClient();
  const { getBalanceInBaseDecimals } = useBalances();

  const isComplete = state.inputTicker && state.outputTicker && state.inputValue && state.outputValue;

  const checkAllowance = useCallback(async () => {
    if (readInputContract && address) {
      const allowance = await readInputContract.allowance([address, contracts[ContractType.ERC20_MARKETPLACE].address]);
      // If allowance is lower than maximum, then it is considered unallowed and approval tx is required. (to keep poc simple)
      if (allowance < UINT_256_MAX) {
        setInputErc20TransferApproved(false);
      } else {
        setInputErc20TransferApproved(true);
      }
    }
  }, [readInputContract, setInputErc20TransferApproved, address]);

  useEffect(() => {
    checkAllowance();
  }, [checkAllowance]);

  const allowErc20Transfer = async() => {
     if (!writeInputContract) {
      return;
     }
     
    const txHash = await writeInputContract.approve([contracts[ContractType.ERC20_MARKETPLACE].address, UINT_256_MAX, ])
    await publicClient.waitForTransactionReceipt({hash: txHash});
    checkAllowance();
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputErc20TransferApproved) {
      allowErc20Transfer();
      return;
    }
    onSubmit?.(state as Required<AddOrderFormData>);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) =>
    setState((s) => ({ ...s, inputValue: e.target.value }));

  const handleChangeOutput = (e: ChangeEvent<HTMLInputElement>) =>
    setState((s) => ({ ...s, outputValue: e.target.value }));

  const handleInputTickerChange = (ticker: Erc20CurrencyTicker) => {
    const isDuplicate = ticker === state.outputTicker;

    return setState((s) => ({
      ...s,
      outputTicker: isDuplicate ? s.inputTicker : s.outputTicker,
      inputTicker: ticker
    }));
  };

  const handleOutputTickerChange = (ticker: Erc20CurrencyTicker) => {
    const isDuplicate = ticker === state.inputTicker;

    return setState((s) => ({
      ...s,
      inputTicker: isDuplicate ? s.outputTicker : s.inputTicker,
      outputTicker: ticker
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <P size='s'>Input the details and values of your order's assets</P>
        <TokenInput
          label='Offer'
          balance={state.inputTicker ? getBalanceInBaseDecimals(Erc20CurrencyTicker[state.inputTicker]) : 0}
          onChange={handleChangeInput}
          value={state.inputValue}
          valueUSD={0}
          selectProps={{
            modalRef: offerModalRef,
            value: state.inputTicker,
            items: [
              { value: 'ZBTC', balance: getBalanceInBaseDecimals(Erc20CurrencyTicker.ZBTC), balanceUSD: formatUSD(0) },
              { value: 'USDT', balance: getBalanceInBaseDecimals(Erc20CurrencyTicker.USDT), balanceUSD: formatUSD(0) }
            ],
            onSelectionChange: (key) => handleInputTickerChange(key as Erc20CurrencyTicker)
          }}
        />
        <TokenInput
          label='You will Receive'
          balance={state.outputTicker ? getBalanceInBaseDecimals(Erc20CurrencyTicker[state.outputTicker]) : 0}
          onChange={handleChangeOutput}
          value={state.outputValue}
          valueUSD={0}
          selectProps={{
            modalRef: receiveModalRef,
            value: state.outputTicker,
            items: [
              { value: 'ZBTC', balance: getBalanceInBaseDecimals(Erc20CurrencyTicker.ZBTC), balanceUSD: formatUSD(0) },
              { value: 'USDT', balance: getBalanceInBaseDecimals(Erc20CurrencyTicker.USDT), balanceUSD: formatUSD(0) }
            ],
            onSelectionChange: (key) => handleOutputTickerChange(key as Erc20CurrencyTicker)
          }}
        />
        <Flex direction='column' gap='spacing2'>
          <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
            <P size='xs'>
              Price 1 {state.inputTicker} ={' '}
              <Strong>
                {state.inputValue && state.outputValue
                  ? parseFloat(state.outputValue) / parseFloat(state.inputValue)
                  : 0}{' '}
                {state.outputTicker}{' '}
              </Strong>
            </P>
          </Card>
          <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
            <P size='xs'>Tx Fees 0 BOB ({formatUSD(0)})</P>
          </Card>
        </Flex>
      </Flex>
      <CTA disabled={!isComplete} size='large' type='submit'>
        {inputErc20TransferApproved ? "Place Order" : "Approve"}
      </CTA>
    </form>
  );
};

export { AddOrderForm };
export type { AddOrderFormProps, AddOrderFormData };
