import { SatsConnector } from './base';

class LeatherConnector extends SatsConnector {
  id = 'leather';
  name = 'Leather';

  constructor() {
    super();
  }

  async connect(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userAddresses = await (window as any).btc?.request('getAddresses');
    this.address = userAddresses.result.addresses.find((el: { type: string }) => el.type === 'p2tr').address;
  }

  async disconnect(): Promise<void> {
    this.address = undefined;
  }

  isReady(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.ready = !!(window as any).LeatherProvider;

    return this.ready;
  }
}

export { LeatherConnector };
