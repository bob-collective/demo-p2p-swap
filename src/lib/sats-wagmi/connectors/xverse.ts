import { Network, Psbt, networks } from 'bitcoinjs-lib';
import {
  AddressPurpose,
  BitcoinNetworkType,
  createInscription,
  getAddress,
  sendBtcTransaction,
  signTransaction
} from 'sats-connect';
import { BITCOIN_NETWORK } from '../../../utils/bitcoin';
import { SatsConnector } from './base';
import { RemoteSigner } from '@gobob/bob-sdk';

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

  paymentAddress: string | undefined;

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
        const { address } = res.addresses.find((address) => address.purpose === AddressPurpose.Ordinals) as {
          address: string;
          publicKey: string;
          purpose: string;
        };

        const { publicKey, address: paymentAddress } = res.addresses.find(
          (address) => address.purpose === AddressPurpose.Payment
        ) as {
          address: string;
          publicKey: string;
          purpose: string;
        };

        this.address = address;
        this.paymentAddress = paymentAddress;
        this.publicKey = publicKey;
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

    if (!this.address || !this.paymentAddress) {
      throw new Error('Something went wrong while connecting');
    }

    await sendBtcTransaction({
      payload: {
        network,
        recipients: [{ address: toAddress, amountSats: BigInt(amount) }],
        senderAddress: this.paymentAddress
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
    }, 10 * 10000); // 10 seconds

    if (!txId) {
      throw new Error('Failed to send BTC Transaction');
    }

    return txId;
  }

  async inscribe(contentType: 'text' | 'image', content: string): Promise<string> {
    let txId: string | undefined = undefined;
    let timeoutId: NodeJS.Timeout | undefined = undefined;

    await createInscription({
      payload: {
        network,
        content,
        contentType: contentType === 'text' ? 'text/plain;charset=utf-8' : 'image/jpeg',
        payloadType: contentType === 'text' ? 'PLAIN_TEXT' : 'BASE_64'
      },
      onFinish: (response) => {
        txId = response.txId;
        clearTimeout(timeoutId); // Clear the timeout if the txId is received
      },
      onCancel: () => alert('Canceled')
    });

    // Set a timeout to cancel the request if the txId is not received within a certain time
    timeoutId = setTimeout(() => {
      throw new Error('Sign psbt failed timed out');
    }, 10 * 1000); // 10 seconds

    if (!txId) {
      throw new Error('Failed to send BTC Transaction');
    }

    return txId;
  }

  async signInput(inputIndex: number, psbt: Psbt): Promise<Psbt> {
    let signedPsbt: Psbt | undefined = undefined;
    let timeoutId: NodeJS.Timeout | undefined = undefined;

    if (!this.address || !this.paymentAddress) {
      throw new Error('Something went wrong while connecting');
    }

    await signTransaction({
      payload: {
        network,
        message: 'Sign Transaction',
        psbtBase64: psbt.toBase64(),
        broadcast: false,
        inputsToSign: [
          {
            address: this.address,
            signingIndexes: [inputIndex]
          }
        ]
      },
      onFinish: (response) => {
        signedPsbt = Psbt.fromBase64(response.psbtBase64);
        clearTimeout(timeoutId); // Clear the timeout if the txId is received
      },
      onCancel: () => alert('Canceled')
    });

    // Set a timeout to cancel the request if the txId is not received within a certain time
    timeoutId = setTimeout(() => {
      throw new Error('Sign psbt failed timed out');
    }, 10 * 1000); // 10 seconds

    if (!signedPsbt) {
      throw new Error('Failed to send BTC Transaction');
    }

    return signedPsbt;
  }

  getSigner(): RemoteSigner {
    const data = {
      address: this.address,
      paymentAddress: this.paymentAddress,
      publicKey: this.publicKey
    };

    return {
      // Passing data because methods need access these data fields
      ...data,
      getTransaction: this.getTransaction,
      sendToAddress: this.sendToAddress,
      signInput: this.signInput,
      getNetwork: this.getNetwork,
      getPublicKey: this.getPublicKey
    };
  }
}

export { XVerseConnector };
