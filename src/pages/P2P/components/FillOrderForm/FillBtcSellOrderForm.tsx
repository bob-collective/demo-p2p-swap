import { Flex, Card, P, TokenInput, Strong, CTA, Input } from '@interlay/ui';
import { ChangeEvent, FormEvent, useState } from 'react';
import { ContractType, Erc20CurrencyTicker } from '../../../../constants';
import { useBalances } from '../../../../hooks/useBalances';
import { BtcSellOrder } from '../../../../types/orders';
import { toBaseAmount } from '../../../../utils/currencies';
import { formatUSD } from '../../../../utils/format';
import { useErc20Allowance } from '../../../../hooks/useErc20Allowance';

type FillBtcSellOrderFormProps = {
  order: BtcSellOrder;
  onSubmit: () => void;
};

const FillBtcSellOrderForm = ({ order, onSubmit }: FillBtcSellOrderFormProps): JSX.Element => {
  const [receivingBtcAddress, setReceivingBtcAddress] = useState<string>();
  const { getBalanceInBaseDecimals } = useBalances();

  const { isAllowed: isAskingCurrencyTransferApproved, wrapInErc20ApprovalTx } = useErc20Allowance(
    ContractType.BTC_MARKETPLACE,
    order.askingCurrency.ticker
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    wrapInErc20ApprovalTx(() => onSubmit?.());
  };

  const handleBtcAddressInput = (event: ChangeEvent<HTMLInputElement>) => {
    setReceivingBtcAddress(event.target.value);
  };
  const outputAmount = toBaseAmount(order.availableLiquidity, order.offeringCurrency.ticker);

  const inputAmount = order.price * parseFloat(outputAmount);

  return (
    <form onSubmit={handleSubmit}>
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
          value={inputAmount}
          isDisabled // TODO: remove after we start allowing partial fullfilments
          valueUSD={0}
          ticker={order.askingCurrency.ticker}
        />
        <TokenInput
          label='You will Receive'
          value={outputAmount}
          isDisabled
          valueUSD={0}
          ticker={order.offeringCurrency.ticker}
        />
        <Input
          label='Bitcoin Address'
          placeholder='Enter your bitcoin address'
          onChange={handleBtcAddressInput}
          value={receivingBtcAddress}
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
      <CTA disabled={!receivingBtcAddress} size='large' type='submit'>
        {!isAskingCurrencyTransferApproved && 'Approve & '} Fill Order
      </CTA>
    </form>
  );
};

export { FillBtcSellOrderForm };
