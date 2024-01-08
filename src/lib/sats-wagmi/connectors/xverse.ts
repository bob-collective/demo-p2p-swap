import { Network, Psbt, networks } from 'bitcoinjs-lib';
import { AddressPurpose, BitcoinNetworkType, getAddress, sendBtcTransaction } from 'sats-connect';
import { BITCOIN_NETWORK } from '../../../utils/bitcoin';
import { SatsConnector } from './base';

const network = {
  type: BITCOIN_NETWORK === 'mainnet' ? BitcoinNetworkType.Mainnet : BitcoinNetworkType.Testnet
};

const payload = {
  purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
  message: 'Address for receiving Ordinals and payments',
  network
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    XverseProviders: any;
  }
}

class XVerseConnector extends SatsConnector {
  id = 'xverse';
  name = 'XVerse';

  publicKey: string | undefined;

  constructor() {
    super();
  }

  async connect(): Promise<void> {
    await getAddress({
      payload,
      onCancel: () => {
        throw new Error('User rejected connect');
      },
      onFinish: (res) => {
        const account = res.addresses.find((address) => address.purpose === AddressPurpose.Ordinals) as {
          address: string;
          publicKey: string;
          purpose: string;
        };

        this.address = account.address;
        this.publicKey = account.publicKey;
      }
    });
  }

  isReady(): boolean {
    this.ready = !!window.XverseProviders;

    return this.ready;
  }

  async getNetwork(): Promise<Network> {
    return BITCOIN_NETWORK === 'mainnet'
      ? networks.bitcoin
      : BITCOIN_NETWORK === 'testnet'
      ? networks.testnet
      : networks.regtest;
  }

  async getPublicKey(): Promise<string> {
    if (!this.publicKey) {
      throw new Error('Something went wrong while connecting');
    }

    return this.publicKey;
  }

  async sendToAddress(toAddress: string, amount: number): Promise<string> {
    let txId: string | undefined = undefined;
    let timeoutId: NodeJS.Timeout | undefined = undefined;

    await sendBtcTransaction({
      payload: {
        network,
        recipients: [{ address: toAddress, amountSats: BigInt(amount) }],
        senderAddress: 'paymentAddress'
      },
      onFinish: (res) => {
        txId = res;
        clearTimeout(timeoutId); // Clear the timeout if the txId is received
      },
      onCancel: () => {
        throw new Error('Send BTC Transaction canceled');
      }
    });

    // Set a timeout to cancel the request if the txId is not received within a certain time
    timeoutId = setTimeout(() => {
      throw new Error('Send BTC Transaction timed out');
    }, 10 * 1000); // 10 seconds

    if (!txId) {
      throw new Error('Failed to send BTC Transaction');
    }

    return txId;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signInput(inputIndex: number, psbt: Psbt): Promise<Psbt> {
    throw new Error('Method not implemented.');
  }
}

export { XVerseConnector };
