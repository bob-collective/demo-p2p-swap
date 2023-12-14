type Address = string;

// type Network = string;

abstract class SatsConnector {
  /** Unique connector id */
  abstract readonly id: string;
  /** Connector name */
  abstract readonly name: string;
  /** Whether connector is usable */
  abstract readonly ready: boolean;
  abstract readonly address: Address | undefined;
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract getAccount(): Promise<Address>;
  abstract isAuthorized(): Promise<boolean>;
  //   protected abstract onAccountsChanged(accounts: Address[]): void;
  //   protected abstract onNetworkChanged(network: Network): void;
  //   protected abstract onDisconnect(error: Error): void;
}

export { SatsConnector };
export type { Address };
