import { Network, Psbt } from 'bitcoinjs-lib';
import { SatsConnector } from './base';

type Response<T> = {
  jsonrpc: string;
  id: string;
  result: T;
};

type AddressResult = {
  symbol: 'BTC' | 'STX';
  type: 'p2wpkh' | 'p2tr';
  address: string;
  publicKey: string;
  derivationPath: string;
};

type RequestAddressesResult = {
  addresses: AddressResult[];
};

type RequestAddressesFn = (method: 'getAddresses') => Promise<Response<RequestAddressesResult>>;

type SendBTCFn = (
  method: 'sendTransfer',
  options: {
    address: string;
    amount: string;
  }
) => Promise<Response<{ txid: string }>>;

declare global {
  interface Window {
    btc: {
      request: RequestAddressesFn & SendBTCFn;
    };
  }
}

class LeatherConnector extends SatsConnector {
  id = 'leather';
  name = 'Leather';

  publicKey: string | undefined;

  constructor() {
    super();
  }

  async connect(): Promise<void> {
    const userAddresses = await window.btc.request('getAddresses');
    const account = userAddresses.result.addresses.find((el: { type: string }) => el.type === 'p2tr');

    if (!account) {
      throw new Error('Failed to connect wallet');
    }

    this.address = account.address;
    this.publicKey = account.publicKey;
  }

  async disconnect(): Promise<void> {
    this.address = undefined;
  }

  isReady(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.ready = !!(window as any).LeatherProvider;

    return this.ready;
  }

  getNetwork(): Promise<Network> {
    throw new Error('Method not implemented.');
  }

  async getPublicKey(): Promise<string> {
    if (!this.publicKey) {
      throw new Error('Something went wrong while connecting');
    }

    return this.publicKey;
  }

  async sendToAddress(toAddress: string, amount: number): Promise<string> {
    const resp = await window.btc.request('sendTransfer', {
      address: toAddress,
      amount: amount.toString()
    });

    return resp.result.txid;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signInput(inputIndex: number, psbt: Psbt): Promise<Psbt> {
    throw new Error('Method not implemented.');
  }
}

export { LeatherConnector };
