import { ERC20Abi__factory } from "./types";

enum ContractType {
  SBTC = "SBTC",
}

// Contracts config with contract address and typechain typings
// that are used in useContract hook to automatically infer smart contract types.
const contracts = {
  [ContractType.SBTC]: {
    address: "0x000 TODO",
    connect: ERC20Abi__factory.connect,
  },
};

export { contracts, ContractType };
