import { useCallback, useEffect, useState } from 'react';
import { HexString } from '../types';
import {
  DefaultElectrsClient,
  getBitcoinTxProof,
  // getBitcoinTxInfo,
  BitcoinTxInfo,
  ElectrsClient,
  encodeRawInput,
  encodeRawOutput
  // encodeRawWitness
} from '@gobob/bob-sdk';
import { BITCOIN_NETWORK, fetchBtcNetwork } from '../utils/bitcoin';
import { addHexPrefix } from '../utils/encoding';
import { Utxo } from '../types/orders';
import { Transaction } from 'bitcoinjs-lib';

type TxStatus = 'NOT_FOUND' | 'IN_MEMPOOL' | 'IN_BLOCK';

type UseBtcTxResult = {
  status: TxStatus;
  txId: HexString | undefined;
  confirmations: number | undefined;
  proofData: ProofData | undefined;
};

type ElectrsTxInfo = {
  version: HexString;
  inputVector: HexString;
  outputVector: HexString;
  locktime: HexString;
};

type ElectrsTxProof = { merkleProof: HexString; txIndexInBlock: bigint; bitcoinHeaders: HexString };

interface ProofData {
  info: ElectrsTxInfo;
  proof: ElectrsTxProof;
}

export async function getBitcoinTxInfo(electrsClient: ElectrsClient, txId: string): Promise<BitcoinTxInfo> {
  const txHex = await electrsClient.getTransactionHex(txId);
  const tx = Transaction.fromHex(txHex);
  console.log(txId, txHex, tx, tx.getId());
  const versionBuffer = Buffer.allocUnsafe(4);
  versionBuffer.writeInt32LE(tx.version);

  const locktimeBuffer = Buffer.allocUnsafe(4);
  locktimeBuffer.writeInt32LE(tx.locktime);

  return {
    version: versionBuffer.toString('hex'),
    inputVector: encodeRawInput(tx).toString('hex'),
    outputVector: encodeRawOutput(tx).toString('hex'),
    locktime: locktimeBuffer.toString('hex')
  };
}

const fetchProofData = async (txId: string): Promise<ProofData> => {
  const electrsClient = new DefaultElectrsClient(BITCOIN_NETWORK);
  // TODO: fetch from chain when available
  const hardcodedProofDifficultyFactor = 1;
  const info = await getBitcoinTxInfo(electrsClient, txId);
  const proof = await getBitcoinTxProof(electrsClient, txId, hardcodedProofDifficultyFactor);
  // TODO: Change types in SDK to return hex-prefixed data
  console.log(txId, info);
  return {
    info: {
      version: addHexPrefix(info.version),
      locktime: addHexPrefix(info.locktime),
      inputVector: addHexPrefix(info.inputVector),
      outputVector: addHexPrefix(info.outputVector)
    },
    proof: {
      merkleProof: addHexPrefix(proof.merkleProof),
      bitcoinHeaders: addHexPrefix(proof.bitcoinHeaders),
      txIndexInBlock: BigInt(proof.txIndexInBlock)
    }
  };
};

// TODO: Refactor this hook to use SDK electrs client for everything.
const useOrdinalTx = (receivingAddress?: string, utxo?: Utxo): UseBtcTxResult => {
  const [status, setStatus] = useState<TxStatus>('NOT_FOUND');
  const [txId, setTxId] = useState<HexString>();
  const [confirmations, setConfirmations] = useState<number>(0);
  const [proofData, setProofData] = useState<ProofData>();

  const getProofData = useCallback(async (txId: string) => {
    const proof = await fetchProofData(txId);
    setProofData(proof);
  }, []);

  useEffect(() => {
    const findBtcTx = async () => {
      if (!receivingAddress) {
        return;
      }

      // Clear data on address or amount change
      setTxId(undefined);
      setConfirmations(0);
      setProofData(undefined);
      setStatus('NOT_FOUND');

      const txHistory = await fetchBtcNetwork(`/address/${receivingAddress}/txs`);
      // MEMO: For the POC we expect that any tx is valid. Receiving address should be empty
      // without any previous txs to make this work.
      // Therefore if TX is found, then we consider it payment tx.

      const tx = txHistory.find(({ vin }: { vin: { txid: HexString; vout: number }[] }) =>
        vin.find(
          ({ txid, vout }: { txid: string; vout: number }) =>
            utxo?.txHash === addHexPrefix(txid) && utxo?.txOutputIndex === vout
        )
      );

      console.log(tx);
      if (tx) {
        setStatus('IN_MEMPOOL');
        setTxId(tx.txid);
        clearInterval(txFetcher);
      }
    };

    findBtcTx();

    const txFetcher = setInterval(() => findBtcTx(), 1000);

    return () => clearInterval(txFetcher);
  }, [receivingAddress, utxo]);

  useEffect(() => {
    const fetchConfirmations = async () => {
      if (!txId) {
        return;
      }
      const txStatus = await fetchBtcNetwork(`/tx/${txId}/status`);
      const [latestBlock] = await fetchBtcNetwork(`/blocks`);

      const confirmations = latestBlock.height - txStatus.block_height + 1;

      setConfirmations(Number.isNaN(confirmations) ? 0 : confirmations);
      if (txStatus.confirmed) {
        setStatus('IN_BLOCK');
      } else {
        setStatus('IN_MEMPOOL');
      }
      if (!proofData) {
        getProofData(txId);
      }
    };

    const confimrationFetcher = setInterval(() => fetchConfirmations(), 1000);
    return () => clearInterval(confimrationFetcher);
  }, [getProofData, proofData, txId]);

  return {
    status,
    txId,
    confirmations,
    proofData
  };
};

export { useOrdinalTx };
