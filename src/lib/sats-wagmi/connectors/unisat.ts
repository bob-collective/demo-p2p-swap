import { DefaultElectrsClient, RemoteSigner } from '@gobob/bob-sdk';
import { SatsConnector } from './base';
import * as bitcoin from 'bitcoinjs-lib';
import { BITCOIN_NETWORK } from '../../../utils/bitcoin';
import retry from 'async-retry';

async function getTxHex(txId: string) {
  const electrsClient = new DefaultElectrsClient(BITCOIN_NETWORK);

  return await retry(
    async (bail) => {
      // if anything throws, we retry
      const res = await electrsClient.getTransactionHex(txId);

      if (!res) {
        bail('Failed');
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

class UnisatConnector extends SatsConnector {
  id = 'unisat';
  name = 'Unisat';

  constructor() {
    super();
  }

  async connect(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accounts = await (window as any).unisat.requestAccounts();
    this.address = accounts[0];
  }

  async disconnect(): Promise<void> {
    this.address = undefined;
  }

  isReady(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.ready = typeof (window as any).unisat !== 'undefined';

    return this.ready;
  }

  getSigner(): RemoteSigner {
    return {
      async getNetwork(): Promise<bitcoin.networks.Network> {
        switch (await (window as any).unisat.getNetwork()) {
          case 'livenet':
            return bitcoin.networks.bitcoin;
          case 'testnet':
            return bitcoin.networks.testnet;
          default:
            throw new Error('Unknown network');
        }
      },
      async getPublicKey() {
        return await (window as any).unisat.getPublicKey();
      },
      async sendToAddress(toAddress: string, amount: number): Promise<string> {
        const txid = await (window as any).unisat.sendBitcoin(toAddress, amount);
        return txid;
      },
      async getTransaction(txId: string): Promise<bitcoin.Transaction> {
        const txHex = await getTxHex(txId);

        return bitcoin.Transaction.fromHex(txHex);
      },
      async signInput(inputIndex, psbt) {
        const publicKey = await this.getPublicKey();
        const psbtHex = await (window as any).unisat.signPsbt(psbt.toHex(), {
          autoFinalized: false,
          toSignInputs: [
            {
              index: inputIndex,
              publicKey,
              disableTweakSigner: true
            }
          ]
        });
        return bitcoin.Psbt.fromHex(psbtHex);
      }
    };
  }
}

export { UnisatConnector };
