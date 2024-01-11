import { DefaultElectrsClient, RemoteSigner } from '@gobob/bob-sdk';
import { Network, Psbt, Transaction } from 'bitcoinjs-lib';
import { BITCOIN_NETWORK } from '../../../utils/bitcoin';
import retry from 'async-retry';

async function getTxHex(txId: string) {
  const electrsClient = new DefaultElectrsClient(BITCOIN_NETWORK);

  return await retry(
    async (bail) => {
      // if anything throws, we retry
      const res = await electrsClient.getTransactionHex(txId);

      if (!res) {
        bail(new Error('Failed'));
      }

      return res;
    },
    {
      retries: 20,
      minTimeout: 2000,
      maxTimeout: 5000
    }
  );
}

type Address = string;

abstract class SatsConnector {
  /** Unique connector id */
  abstract readonly id: string;
  /** Connector name */
  abstract readonly name: string;
  /** Whether connector is usable */
  ready: boolean = false;

  address: Address | undefined = '';

  abstract connect(): Promise<void>;

  disconnect() {
    this.address = undefined;
  }

  getAccount(): Address | undefined {
    return this.address;
  }

  isAuthorized(): boolean {
    const address = this.getAccount();

    return !!address;
  }

  abstract isReady(): boolean;

  abstract getNetwork(): Promise<Network>;

  abstract getPublicKey(): Promise<string>;

  abstract sendToAddress(toAddress: string, amount: number): Promise<string>;

  abstract signInput(inputIndex: number, psbt: Psbt): Promise<Psbt>;

  async getTransaction(txId: string): Promise<Transaction> {
    const txHex = await getTxHex(txId);

    return Transaction.fromHex(txHex);
  }

  abstract getSigner(): RemoteSigner;

  abstract inscribe(contentType: 'text' | 'image', content: string): Promise<string>;
}

export { SatsConnector };
export type { Address };
