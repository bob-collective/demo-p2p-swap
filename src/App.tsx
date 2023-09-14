import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAccount, useConnect } from "wagmi";
import "./App.css";
import { ContractType } from "./contracts/config";
import { useContract } from "./hooks/useContract";

function App() {

  const {connect} = useConnect()

  const { address, isConnected } = useAccount()

  const { read: readZbtc, write: writeZbtc } = useContract(ContractType.ZBTC);

  const [balance, setBalance] = useState<string | null>(null);

  /** PROMPT WALLET CONNECTION */
  useEffect(() => {
    connect()
  }, [connect])


  /* READING STORAGE */

  const fetchzbtcBalance = useCallback(async () => {
    if (!readZbtc || !address) {
      return;
    }
    const zbtcBalance = await readZbtc.balanceOf([address]);
    const zbtcDecimals = readZbtc.decimals;

    const parsedBalance = ethers.formatUnits(
      zbtcBalance,
      zbtcDecimals.toString()
    );
    setBalance(parsedBalance);
  }, [address, readZbtc]);

  useEffect(() => {
    fetchzbtcBalance();
  }, [fetchzbtcBalance]);

  /* TRANSACTION SUBMISSION */

  const transferOnezbtc = async () => {
    if (!writeZbtc) {
      throw new Error("Writer not set!");
    }
    const args = getTxArgs();

    /* TRANSACTION LIFECYCLE  */

    const tx = await writeZbtc.transfer(args);
    // Transaction is now submitted to mempool, now we wait until tx is mined.
    console.log(
      `Transaction ${tx.hash} has been submitted to mempool with has limit of ${tx.gasLimit}.`
    );
    const txReceipt = await tx.wait();
    // Transaction has been mined and included in latest block.
    console.log(
      `Transaction ${tx.hash} has been included. It used ${txReceipt?.gasUsed} gas.`
    );

    // Refetch zBTC balance after the transfer is done.
    fetchzbtcBalance();
  };

  const [transferRecipient, setTransferRecipient] = useState<string | null>(
    null
  );

  const getTxArgs = useCallback((): [string, bigint] => {
    if (!transferRecipient) {
      throw new Error("Transfer recipient address not set!");
    }
    if (!readZbtc) {
      throw new Error("Provider not set!");
    }

    const zbtcDecimals = readZbtc.decimals;
    const onezbtc = ethers.parseUnits("1", zbtcDecimals.toString());
    return [transferRecipient, onezbtc];
  }, [readZbtc, transferRecipient]);

  /** FEE ESTIMATE */

  const [txFeeEstimate, setTxFeeEstimate] = useState<string>();

  useEffect(() => {
    const estimateFee = async () => {
      if (!provider) {
        throw new Error("Provider not connected!");
      }
      if (!writeZbtc) {
        throw new Error("Writer not set!");
      }
      const args = getTxArgs();

      const [feeData, gas] = await Promise.all([
        provider.getFeeData(),
        writeZbtc.transfer.estimateGas(...args),
      ]);

      // TODO: is our rollup using EIP1559 model?
      // when clear on this discard following lines and use maxFeePerGas or gasPrice accordingly.
      const usingEIP1559 = true;
      let gasPrice: bigint | null;
      if (usingEIP1559) {
        gasPrice = feeData.maxFeePerGas;
      } else {
        gasPrice = feeData.gasPrice;
      }

      if (!gasPrice) {
        throw new Error("Gas price fetching failed.");
      }

      const finalFee = gas * gasPrice;

      const formattedFeeEstimate = ethers.formatEther(finalFee);
      setTxFeeEstimate(formattedFeeEstimate);
    };
    estimateFee();
  }, [getTxArgs, provider, writeZbtc]);

  const [latestTransfers, setLatestTransfers] = useState<
    { from: string; to: string; amount: string; id: string }[]
  >([
    {
      from: ethers.ZeroAddress,
      to: ethers.ZeroAddress,
      amount: "1.2",
      id: "0x823284732849iojdskjfhkdsjaf809",
    },
  ]);

  /** EVENT LISTENING */

  useEffect(() => {
    if (!readZbtc) {
      return;
    }
    const transferEvent = readZbtc.getEvent("Transfer");

    const transferEventListener: TypedListener<typeof transferEvent> = (
      from,
      to,
      rawAmount,
      event
    ) => {
      const transferEvent = {
        from,
        to,
        amount: ethers.formatEther(rawAmount),
        id: event.transactionHash,
      };
      setLatestTransfers((previous) => [
        transferEvent,
        ...previous.slice(0, 9),
      ]);
    };

    readZbtc.on(transferEvent, transferEventListener);

    return () => {
      readZbtc.removeListener(transferEvent, transferEventListener);
    };
  }, [readZbtc]);

  const handleFormSubmission = (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    transferOnezbtc();
  };

  const handleTransferRecipientChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTransferRecipient(e.target.value);
  };

  return (
    <>
      <div>
        {signer
          ? `Connected with account ${signer.address}`
          : "Please connect your Metamask."}
      </div>
      <div>Your zBTC balance: {balance || 0} zBTC</div>
      <br />

      <form onSubmit={handleFormSubmission}>
        <h2>zBTC Transfer Form</h2>
        <label>
          Recipient address
          <input
            placeholder="0x..."
            onChange={handleTransferRecipientChange}
            value={transferRecipient || ""}
          />
        </label>
        <label>Estimated tx fee: {txFeeEstimate || 0} BOB</label>
        <button type="submit">Send 1 zBTC</button>
      </form>
      <br />
      <h2>10 Latest zBTC transfers</h2>
      <table>
        <tr>
          <th>From</th>
          <th>To</th>
          <th>Amount</th>
        </tr>

        {latestTransfers.map((transfer) => (
          <tr key={transfer.id}>
            <td>{transfer.from}</td>
            <td>{transfer.to}</td>
            <td>{transfer.amount}</td>
          </tr>
        ))}
      </table>
    </>
  );
}

export default App;
