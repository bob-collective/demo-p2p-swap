import { useEffect, useState } from 'react';
import { HexString } from '../types';
import { DefaultElectrsClient, getBitcoinTxProof } from 'bob-sdk/src/index';

export const REGTEST_ESPLORA_BASE_PATH = 'http://localhost:3002';

type TxStatus = 'NOT_FOUND' | 'IN_MEMPOOL' | 'IN_BLOCK';

type UseBtcTxResult = {
  status: TxStatus;
  txId: HexString | undefined;
  confirmations: number | undefined;
};

const fetchBtcNetwork = async (path: `/${string}`) => {
  try {
    const result = await fetch(`${REGTEST_ESPLORA_BASE_PATH}${path}`);
    return await result.json();
  } catch (err) {
    console.error(`Error fetching regtest electrs server: ${err}`);
    console.error('Make sure that electrs server is running at:', REGTEST_ESPLORA_BASE_PATH);
  }
};

const fetchProof = async (txId: string) => {
  // TODO
  const electrsClient = new DefaultElectrsClient('regtest');
  // TODO: fetch from chain
  const ToBeChanged_proofDifficulty = 2;
  getBitcoinTxProof(electrsClient, txId, ToBeChanged_proofDifficulty);
};

const useBtcTx = (receivingAddress?: string /* TODO add btc address type */): UseBtcTxResult => {
  const [status, setStatus] = useState<TxStatus>('NOT_FOUND');
  const [txId, setTxId] = useState<HexString>();
  const [confirmations, setConfirmations] = useState<number>(0);

  useEffect(() => {
    const findBtcTx = async () => {
      if (!receivingAddress || txId) {
        return;
      }
      const txHistory = await fetchBtcNetwork(`/address/${receivingAddress}/txs`);
      // MEMO: For the POC we expect that any tx is valid. Receiving address should be empty
      // without any previous txs to make this work.
      // Therefore if TX is found, then we consider it payment tx.
      const tx = txHistory[0];
      if (tx) {
        setStatus('IN_MEMPOOL');
        setTxId(tx.txid);
        clearInterval(txFetcher);
      } else {
        setStatus('NOT_FOUND');
      }
    };

    const txFetcher = setInterval(() => findBtcTx(), 1000);
    return () => clearInterval(txFetcher);
  }, [receivingAddress, txId]);

  useEffect(() => {
    const fetchConfirmations = async () => {
      if (!txId) {
        return;
      }
      const txStatus = await fetchBtcNetwork(`/tx/${txId}/status`);
      const [latestBlock] = await fetchBtcNetwork(`/blocks`);

      const confirmations = latestBlock.height - txStatus.block_height;

      console.log(txStatus, confirmations);
      setConfirmations(Number.isNaN(confirmations) ? 0 : confirmations);
      if (txStatus.confirmed) {
        setStatus('IN_BLOCK');
      } else {
        setStatus('IN_MEMPOOL');
      }
    };

    const confimrationFetcher = setInterval(() => fetchConfirmations(), 1000);
    return () => clearInterval(confimrationFetcher);
  }, [txId]);

  return {
    status,
    txId,
    confirmations
  };
};

export { useBtcTx };
