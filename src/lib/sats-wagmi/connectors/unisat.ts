import { SatsConnector } from './base';

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
}

export { UnisatConnector };
