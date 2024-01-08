import { Network, Psbt, networks } from 'bitcoinjs-lib';
import { SatsConnector } from './base';

type AccountsChangedEvent = (event: 'accountsChanged', handler: (accounts: Array<string>) => void) => void;

type Inscription = {
  inscriptionId: string;
  inscriptionNumber: string;
  address: string;
  outputValue: string;
  content: string;
  contentLength: string;
  contentType: string;
  preview: string;
  timestamp: number;
  offset: number;
  genesisTransaction: string;
  location: string;
};

type getInscriptionsResult = { total: number; list: Inscription[] };

type SendInscriptionsResult = { txid: string };

type Balance = { confirmed: number; unconfirmed: number; total: number };

type Unisat = {
  requestAccounts: () => Promise<string[]>;
  getAccounts: () => Promise<string[]>;
  on: AccountsChangedEvent;
  removeListener: AccountsChangedEvent;
  getInscriptions: (cursor: number, size: number) => Promise<getInscriptionsResult>;
  sendInscription: (
    address: string,
    inscriptionId: string,
    options?: { feeRate: number }
  ) => Promise<SendInscriptionsResult>;
  switchNetwork: (network: 'livenet' | 'testnet') => Promise<void>;
  getNetwork: () => Promise<string>;
  getPublicKey: () => Promise<string>;
  getBalance: () => Promise<Balance>;
  sendBitcoin: (address: string, atomicAmount: number, options?: { feeRate: number }) => Promise<string>;
  signPsbt: (
    psbtHex: string,
    options?: {
      autoFinalized?: boolean;
      toSignInputs: {
        index: number;
        address?: string;
        publicKey?: string;
        sighashTypes?: number[];
        disableTweakSigner?: boolean;
      }[];
    }
  ) => Promise<string>;
};

declare global {
  interface Window {
    unisat: Unisat;
  }
}

class UnisatConnector extends SatsConnector {
  id = 'unisat';
  name = 'Unisat';

  constructor() {
    super();
  }

  async connect(): Promise<void> {
    const accounts = await window.unisat.requestAccounts();
    this.address = accounts[0];

    window.unisat.on('accountsChanged', ([account]) => {
      this.address = account;
    });
  }

  async disconnect(): Promise<void> {
    this.address = undefined;

    window.unisat.removeListener('accountsChanged', ([account]) => {
      this.address = account;
    });
  }

  isReady(): boolean {
    this.ready = typeof window.unisat !== 'undefined';

    return this.ready;
  }

  async getNetwork(): Promise<Network> {
    switch (await window.unisat.getNetwork()) {
      case 'livenet':
        return networks.bitcoin;
      case 'testnet':
        return networks.testnet;
      default:
        throw new Error('Unknown network');
    }
  }

  async getPublicKey() {
    return await window.unisat.getPublicKey();
  }

  async sendToAddress(toAddress: string, amount: number): Promise<string> {
    const txid = await window.unisat.sendBitcoin(toAddress, amount);
    return txid;
  }

  async signInput(inputIndex: number, psbt: Psbt) {
    const publicKey = await this.getPublicKey();

    const psbtHex = await window.unisat.signPsbt(psbt.toHex(), {
      autoFinalized: false,
      toSignInputs: [
        {
          index: inputIndex,
          publicKey,
          disableTweakSigner: true
        }
      ]
    });
    return Psbt.fromHex(psbtHex);
  }
}

export { UnisatConnector };
