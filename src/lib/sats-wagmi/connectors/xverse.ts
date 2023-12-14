import { SatsConnector, Address } from './base';
import { getAddress, AddressPurpose, BitcoinNetworkType } from 'sats-connect';

const payload = {
  purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
  message: 'Address for receiving Ordinals and payments',
  network: {
    type: BitcoinNetworkType.Testnet
  }
};

class XVerseConnector extends SatsConnector {
  id = 'xverse';
  name = 'XVerse';
  ready = true;
  address: Address | undefined;

  constructor() {
    super();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // this.ready = !!(window as any).XverseProviders;
  }

  async connect(): Promise<void> {
    await getAddress({
      payload,
      onCancel: () => {
        throw new Error('User rejected connect');
      },
      onFinish: (res) => {
        this.address = res.addresses.find((address) => address.purpose === AddressPurpose.Ordinals)
          ?.address as unknown as Address;
      }
    });
  }

  async disconnect(): Promise<void> {
    this.address = undefined;
  }

  async getAccount(): Promise<Address> {
    return this.address as any;
  }

  async isAuthorized(): Promise<boolean> {
    const address = await this.getAccount();

    return !!address;
  }
}

export { XVerseConnector };
