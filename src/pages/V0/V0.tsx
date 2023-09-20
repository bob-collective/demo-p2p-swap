import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { useAccount, useConnect, usePublicClient } from 'wagmi';
import { formatUnits, parseUnits, formatEther, decodeEventLog } from 'viem';

import './App.css';
import { ContractType } from '../../contracts/config';
import { useContract } from '../../hooks/useContract';
import { config } from '../../connectors/wagmi-connectors';

type HexString = `0x${string}`;

const V0 = (): JSX.Element => {
  const { connect } = useConnect({ connector: config.connectors[0] });

  const { address } = useAccount();

  const publicClient = usePublicClient();

  const {
    read: readZbtc,
    write: writeZbtc,
    estimateGas: estimateGasZbtc,
    watchEvent: watchEventZbtc,
    abi: abiZbtc
  } = useContract(ContractType.ZBTC);

  const [balance, setBalance] = useState<string | null>(null);

  /** PROMPT WALLET CONNECTION */
  useEffect(() => {
    connect();
  }, [connect]);

  /* READING STORAGE */

  const fetchzbtcBalance = useCallback(async () => {
    if (!readZbtc || !address) {
      return;
    }
    const zbtcBalance = await readZbtc.balanceOf([address]);
    const zbtcDecimals = await readZbtc.decimals();

    const parsedBalance = formatUnits(zbtcBalance, zbtcDecimals);
    setBalance(parsedBalance);
  }, [address, readZbtc]);

  useEffect(() => {
    fetchzbtcBalance();
  }, [fetchzbtcBalance]);

  /* TRANSACTION SUBMISSION */

  const transferOnezbtc = async () => {
    if (!writeZbtc) {
      throw new Error('Writer not set!');
    }
    const args = getTxArgs();
    if (!args) return;
    /* TRANSACTION LIFECYCLE  */

    // Tx is created, signed and sent to network, its hash is returned.
    const txHash = await writeZbtc.transfer(args);
    // Transaction is now submitted to mempool, now we wait until tx is mined.
    console.log(`Transaction ${txHash} has been submitted to mempool.`);
    const txReceipt = await publicClient.waitForTransactionReceipt({
      hash: txHash
    });
    // Transaction has been mined and included in latest block.
    console.log(`Transaction ${txHash} has been included. It used ${txReceipt.gasUsed} gas.`);

    // Refetch zBTC balance after the transfer is done.
    fetchzbtcBalance();
  };

  const [transferRecipient, setTransferRecipient] = useState<HexString | null>(null);

  const getTxArgs = useCallback((): [HexString, bigint] | null => {
    if (!transferRecipient) {
      return null;
    }

    const zbtcDecimals = 18; // NOTE: hardcoded for POC, decimals should be handled separately readZbtc.decimals();
    const onezbtc = parseUnits('1', zbtcDecimals);
    return [transferRecipient, onezbtc];
  }, [transferRecipient]);

  /** FEE ESTIMATE */

  const [txFeeEstimate, setTxFeeEstimate] = useState<string>();

  useEffect(() => {
    const estimateFee = async () => {
      const args = getTxArgs();
      if (!args) return;

      const [gasPrice, gasNeeded] = await Promise.all([publicClient.getGasPrice(), estimateGasZbtc.transfer(args)]);

      const finalFee = gasNeeded * gasPrice;

      const formattedFeeEstimate = formatEther(finalFee);
      setTxFeeEstimate(formattedFeeEstimate);
    };
    estimateFee();
  }, [estimateGasZbtc, getTxArgs, publicClient]);

  const [latestTransfers, setLatestTransfers] = useState<{ from: string; to: string; amount: string; id: string }[]>(
    []
  );

  /** EVENT LISTENING */

  useEffect(() => {
    if (!watchEventZbtc) {
      return;
    }
    const unsubscribeFromEvent = watchEventZbtc.Transfer(
      {},
      {
        onLogs: (logs) => {
          const transferEvents = logs.map((log) => {
            const {
              args: { from, to, value }
            } = decodeEventLog({ abi: abiZbtc, ...log });
            return {
              from,
              to,
              amount: formatEther(value),
              id: log.transactionHash
            };
          });
          setLatestTransfers((previous) => [...transferEvents, ...previous]);
        }
      }
    );

    return () => {
      unsubscribeFromEvent();
    };
  }, [abiZbtc, watchEventZbtc]);

  const handleFormSubmission = (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    transferOnezbtc();
  };

  const handleTransferRecipientChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTransferRecipient(e.target.value as HexString);
  };

  return (
    <>
      <div>{address ? `Connected with account ${address}` : 'Please connect your Metamask.'}</div>
      <div>Your zBTC balance: {balance || 0} zBTC</div>
      <br />

      <form onSubmit={handleFormSubmission}>
        <h2>zBTC Transfer Form</h2>
        <label>
          Recipient address
          <input placeholder='0x...' onChange={handleTransferRecipientChange} value={transferRecipient || ''} />
        </label>
        <label>Estimated tx fee: {txFeeEstimate || 0} BOB</label>
        <button type='submit'>Send 1 zBTC</button>
      </form>
      <br />
      <h2>10 Latest zBTC transfers</h2>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {latestTransfers.map((transfer) => (
            <tr key={transfer.id}>
              <td>{transfer.from}</td>
              <td>{transfer.to}</td>
              <td>{transfer.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export { V0 };
