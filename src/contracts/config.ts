import { ERC20Abi__factory } from "./types";

enum ContractType {
  SBTC = "SBTC",
}

// Contracts config with contract address and typechain typings
// that are used in useContract hook to automatically infer smart contract types.
const contracts = {
  [ContractType.SBTC]: {
    address: "0xd6cd079ee8bc26b5000a5e1ea8d434c840e3434b",
    connect: ERC20Abi__factory.connect,
  },
};

export { contracts, ContractType };
