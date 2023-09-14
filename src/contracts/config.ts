import { ERC20Abi } from "./abi/ERC20.abi";

enum ContractType {
  ZBTC = "ZBTC",
}

// Contracts config with contract address and typechain typings
// that are used in useContract hook to automatically infer smart contract types.
const contracts = {
  [ContractType.ZBTC]: {
    address: "0xd6cd079ee8bc26b5000a5e1ea8d434c840e3434b",
    abi: ERC20Abi,
  },
} as const;

export { contracts, ContractType };
