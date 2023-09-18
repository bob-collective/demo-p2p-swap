# viem + wagmi
viem = new lightweight 'TypeScript Interface for Ethereum '
- 1.4k viem, 4.9k wagmi stars on GitHub
- smaller bundle size and more performant than ethers v6
- used by MetaMask, SushiSwap, QuickNode, PancakeSwap, ...
- `wagmi` package is becoming React standard for EVM dapps 

## Wallet connection
Wallet connection is abstracted away utilizing `Wagmi.Config`. All needed to be done is specification of custom chain and connectors to use. After that app is wrapped in wagmi provider and wallet and account interactoin hooks can be used to connect, disconnect, get account,...

```typescript
// connectors.ts
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [L2_CHAIN_CONFIG],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [new MetaMaskConnector({ chains })],
});

// main.tsx
// Wraps app in WagmiConfig provider
    <WagmiConfig config={config}>
      <App />
    </WagmiConfig>

// App.tsx
  const { connect } = useConnect({ connector: config.connectors[0] });

  const { address } = useAccount();

  const publicClient = usePublicClient();
```
### Other wallet integrations

- Easy configuration - only need to pass another connector to be used, support for: injected wallets, MetaMask, Ledger, WalletConnect, Coinbase wallet, SafeWallet, wallet mocking.

```typescript
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
 
const connector = new WalletConnectConnector({
  options: {
    projectId: '...',
  },
})
```

## Smart contract interaction
Reading and writing is handled by separate objects called `PublicClient` and `WalletClient`. These clients provide methods called `actions` that utilize Ethereum RPC methods 1 to 1.

Default way of reading and writing is suboptimal - it requires specification of contract address and ABI all over again:
```typescript
//source: https://viem.sh/docs/contract/getContract.html
import { wagmiAbi } from './abi'
import { publicClient, walletClient } from './client'

const balance = await publicClient.readContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: wagmiAbi,
  functionName: 'balanceOf',
  args: ['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC']
})
const hash = await walletClient.writeContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: wagmiAbi,
  functionName: 'mint',
  args: [69420]
})

```
However, with little modification, contract address and ABI can be read from config file in custom hook and all contract member types will be inferred.
```typescript
// contracts/config.ts
const contracts = {
  [ContractType.ZBTC]: {
    address: "0xd6cd079ee8bc26b5000a5e1ea8d434c840e3434b",
    abi: ERC20Abi,
  },
} as const;

// App.tsx
  const {
    read: readZbtc,
    write: writeZbtc,
    estimateGas: estimateGasZbtc,
  } = useContract(ContractType.ZBTC);
  
  // ...
  const zbtcBalance = await readZbtc.balanceOf([address]);
```



### Smart contract types
With the example above and TS version 5.x+, smart contract types are inferred from ABI specification without need to run any typegen commands.
### Multicall, batch requests
- Built-in support for multicall3
```typescript
const results = await publicClient.multicall({
  contracts: [
    {
      ...wagmiContract,
      functionName: 'totalSupply',
    },
    {
      ...wagmiContract,
      functionName: 'ownerOf',
      args: [69420n]
    },
    {
      ...wagmiContract,
      functionName: 'mint'
    }
  ]
})
/**
 * [
 *  { result: 424122n, status: 'success' },
 *  { result: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b', status: 'success' },
 *  { error: [ContractFunctionExecutionError: ...], status: 'failure' }
 * ]
 */
```
- JsonRpcBatchProvider is available for multiple rpc request batching

### Listening to events
Straightforward event subscription available on contract instance under `Contract.watchEvent`.
```typescript
 const unsubscribeFromEvent = watchEventZbtc.Transfer(
      {},
      {
        onLogs: (logs) => {
          const transferEvents = logs.map((log) => {
            const {
              args: { from, to, value },
            } = decodeEventLog({ abi: abiZbtc, ...log });
            return {
              from,
              to,
              amount: formatEther(value),
              id: log.transactionHash,
            };
          });
          setLatestTransfers((previous) => [...transferEvents, ...previous]);
        },
      }
    );
  ```

### Transaction lifecycle handling
Simple way to handle transaction submission, at first the transaction is sent to mempool. After `PublicClient.waitForTransactionReceipt` method can be called to await tx block inclusion.
```typescript
    // Tx is created, signed and sent to network, its hash is returned.
    const txHash = await writeZbtc.transfer(args);

    const txReceipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });
    // Transaction has been mined and included in latest block.
    console.log(
      `Transaction ${txHash} has been included. It used ${txReceipt.gasUsed} gas.`
    );

``` 

## Data handling
- use of JS native `bignum`
- `parseEther`, `parseGwei`,`parseUnits` and `formatEther`, `formatGwei`,`formatUnits` utils to help with decimal conversions
- utils to help with hashing (keccak256), data type checking and deoding

## Constructing unsigned transaction
- straightforward construction of unsigned tranaction with `WalletClient.prepareTransactionRequest` method
```typescript
const request = await walletClient.prepareTransactionRequest({ 
  account,
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: 1000000000000000000n
})


const signature = await walletClient.signTransaction(request)
const hash = await walletClient.sendRawTransaction(signature)
```

## Dry-running
```typescript
import { account, publicClient } from './config'
import { wagmiAbi } from './abi'

const { result } = await publicClient.simulateContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: wagmiAbi,
  functionName: 'mint',
  account,
})
```
## Docs & DX
- very comprehensive documentation with examples for each method / module
- fast resolution of GitHub issues, same reliable team building both viem and wagmi
- smart contract type inheritance significantly simplifies DX 
- `wagmi` abstracts away most of EVM interaction complexity for React 
- migration guide between ethers -> viem provided in viem docs



