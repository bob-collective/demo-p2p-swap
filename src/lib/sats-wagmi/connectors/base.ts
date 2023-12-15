type Address = string;

// type Network = string;

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
}

export { SatsConnector };
export type { Address };
