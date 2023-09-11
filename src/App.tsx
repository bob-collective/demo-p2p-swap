import { ethers } from "ethers";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import "./App.css";
import { ContractType } from "./contracts/config";
import { TypedListener } from "./contracts/types/common";
import { useConnectors } from "./hooks/useConnectors";
import { useContract } from "./hooks/useContract";

function App() {
  const {
    connectors: { provider, signer },
  } = useConnectors();

  const { read: readSbtc, write: writeSbtc } = useContract(ContractType.SBTC);

  const [balance, setBalance] = useState<string | null>(null);

  /* READING STORAGE */

  const fetchSbtcBalance = useCallback(async () => {
    if (!readSbtc || !signer?.address) {
      return;
    }
    const sbtcBalance = await readSbtc.balanceOf(signer.address);
    const sbtcDecimals = readSbtc.decimals;

    const parsedBalance = ethers.formatUnits(
      sbtcBalance,
      sbtcDecimals.toString()
    );
    setBalance(parsedBalance);
  }, [signer?.address, readSbtc]);

  useEffect(() => {
    fetchSbtcBalance();
  }, [fetchSbtcBalance]);

  /* TRANSACTION SUBMISSION */

  const transferOneSbtc = async () => {
    if (!writeSbtc) {
      throw new Error("Writer not set!");
    }
    const args = getTxArgs();

    /* TRANSACTION LIFECYCLE  */

    const tx = await writeSbtc.transfer(...args);
    // Transaction is now submitted to mempool, now we wait until tx is mined.
    console.log(
      `Transaction ${tx.hash} has been submitted to mempool with has limit of ${tx.gasLimit}.`
    );
    const txReceipt = await tx.wait();
    // Transaction has been mined and included in latest block.
    console.log(
      `Transaction ${tx.hash} has been included. It used ${txReceipt?.gasUsed} gas.`
    );

    // Refetch sBTC balance after the transfer is done.
    fetchSbtcBalance();
  };

  const [transferRecipient, setTransferRecipient] = useState<string | null>(
    null
  );

  const getTxArgs = useCallback((): [string, bigint] => {
    if (!transferRecipient) {
      throw new Error("Transfer recipient address not set!");
    }
    if (!readSbtc) {
      throw new Error("Provider not set!");
    }

    const sbtcDecimals = readSbtc.decimals;
    const oneSbtc = ethers.parseUnits("1", sbtcDecimals.toString());
    return [transferRecipient, oneSbtc];
  }, [readSbtc, transferRecipient]);

  /** FEE ESTIMATE */

  const [txFeeEstimate, setTxFeeEstimate] = useState<string>();

  useEffect(() => {
    const estimateFee = async () => {
      if (!provider) {
        throw new Error("Provider not connected!");
      }
      if (!writeSbtc) {
        throw new Error("Writer not set!");
      }
      const args = getTxArgs();

      const [feeData, gas] = await Promise.all([
        provider.getFeeData(),
        writeSbtc.transfer.estimateGas(...args),
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
  }, [getTxArgs, provider, writeSbtc]);

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
    if (!readSbtc) {
      return;
    }
    const transferEvent = readSbtc.getEvent("Transfer");

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

    readSbtc.on(transferEvent, transferEventListener);

    return () => {
      readSbtc.removeListener(transferEvent, transferEventListener);
    };
  }, [readSbtc]);

  const handleFormSubmission = (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    transferOneSbtc();
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
      <div>Your sBTC balance: {balance || 0} sBTC</div>
      <br />

      <form onSubmit={handleFormSubmission}>
        <h2>sBTC Transfer Form</h2>
        <label>
          Recipient address
          <input
            placeholder="0x..."
            onChange={handleTransferRecipientChange}
            value={transferRecipient || ""}
          />
        </label>
        <label>Estimated tx fee: {txFeeEstimate || 0} BOB</label>
        <button type="submit">Send 1 sBTC</button>
      </form>
      <br />
      <h2>10 Latest sBTC transfers</h2>
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
