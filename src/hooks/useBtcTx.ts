import { useEffect, useState } from 'react';
import { HexString } from '../types';

type TxStatus = 'NOT_FOUND' | 'IN_MEMPOOL' | 'IN_BLOCK';

type UseBtcTxResult = {
  status: TxStatus;
  txId: HexString | undefined;
  confirmations: number | undefined;
};

const useBtcTx = (receivingAddress?: string /* TODO add btc address type */): UseBtcTxResult => {
  const [status, setStatus] = useState<TxStatus>('NOT_FOUND');
  const [txId, setTxId] = useState<HexString>();
  const [confirmations, setConfirmations] = useState<number>(0);

  useEffect(() => {
    console.log('receiving address', receivingAddress);
    // Find tx in 10s.
    setTimeout(() => setStatus('IN_MEMPOOL'), 10000);
    // Add to block in 15s. and each 5s add confirmation.
    setTimeout(() => {
      setStatus('IN_BLOCK');
      setTxId('0xMOCKED-test_id');
      setConfirmations(1);
      setTimeout(() => setConfirmations((prev) => prev + 1), 5000);
      setTimeout(() => setConfirmations((prev) => prev + 1), 10000);
      setTimeout(() => setConfirmations((prev) => prev + 1), 15000);
      setTimeout(() => setConfirmations((prev) => prev + 1), 20000);
      setTimeout(() => setConfirmations((prev) => prev + 1), 25000);
    }, 15000);
  }, []);

  return {
    status,
    txId,
    confirmations
  };
};

export { useBtcTx };
