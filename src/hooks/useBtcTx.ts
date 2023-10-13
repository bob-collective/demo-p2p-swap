import { useCallback, useEffect, useState } from 'react';
import { HexString } from '../types';
import { DefaultElectrsClient, getBitcoinTxProof, getBitcoinTxInfo } from '@gobob/bob-sdk';
import { BITCOIN_NETWORK, fetchBtcNetwork, hasOutputWithValidAmount } from '../utils/bitcoin';
import { addHexPrefix } from '../utils/encoding';

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

const fetchProofData = async (txId: string): Promise<ProofData> => {
  const electrsClient = new DefaultElectrsClient(BITCOIN_NETWORK);
  // TODO: fetch from chain when available
  const hardcodedProofDifficultyFactor = 1;
  const info = await getBitcoinTxInfo(electrsClient, txId);
  const proof = await getBitcoinTxProof(electrsClient, txId, hardcodedProofDifficultyFactor);
  // TODO: Change types in SDK to return hex-prefixed data
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
const useBtcTx = (receivingAddress?: string /* TODO add btc address type */, amountBtc?: bigint): UseBtcTxResult => {
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
      if (!receivingAddress || !amountBtc) {
        return;
      }
      const txHistory = await fetchBtcNetwork(`/address/${receivingAddress}/txs`);
      // MEMO: For the POC we expect that any tx is valid. Receiving address should be empty
      // without any previous txs to make this work.
      // Therefore if TX is found, then we consider it payment tx.
      const tx = txHistory[0];

      if (tx && hasOutputWithValidAmount(tx.vout, amountBtc, receivingAddress)) {
        setStatus('IN_MEMPOOL');
        setTxId(tx.txid);
        clearInterval(txFetcher);
      } else {
        setStatus('NOT_FOUND');
      }
    };

    const txFetcher = setInterval(() => findBtcTx(), 1000);
    return () => clearInterval(txFetcher);
  }, [receivingAddress, txId, amountBtc]);

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

export { useBtcTx };
