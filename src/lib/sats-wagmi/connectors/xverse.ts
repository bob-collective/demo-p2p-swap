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
        this.address = res.addresses.find((address) => address.purpose === AddressPurpose.Ordinals)
          ?.address as unknown as Address;
      }
    });
  }

  isReady(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.ready = !!(window as any).XverseProviders;

    return this.ready;
  }
}

export { XVerseConnector };
