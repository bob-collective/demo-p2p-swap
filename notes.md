# ethers.js (v6) POC
JS industry-standard library to help with blockchain interaction. 
- 7k stars on GitHub
- full TS support
- used by biggest projects: Uniswap, Compound, Optimism, ...

## Wallet connection
Straightforward way to connect to injected provider and obtain signer object.
```typescript
  if (window.ethereum == null) {
    console.log("MetaMask not installed; using read-only default provider.");
    provider = ethers.getDefaultProvider(L2_WSS_URL);
  } else {
    provider = new ethers.BrowserProvider(window.ethereum);

    signer = await provider.getSigner();
  }
```

### Other wallet integrations

- does not support WalletConnect out of the box

## Smart contract interaction
Default reading and writing way is suboptimal - it does not provide any type safety:
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
const unwatch = publicClient.watchContractEvent({
  address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
  abi: wagmiAbi,
  eventName: 'Transfer',
  args: {  
    from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac'
  },
  onLogs: logs => console.log(logs)
})
```
Reading and writing are handled by separate connectors. `provider` handles reading, `signer` handles writing.
```typescript
interface Connectors {
  provider: ethers.BrowserProvider | ethers.AbstractProvider | null;
  signer: ethers.JsonRpcSigner | null;
}
```
### Smart contract types
Integration of `typechain` package allows very useful type generation of smart contract typings from ABI. Later, these types can be bound to `Contract` instance which adds type-safety to contract method calls.

#### Custom typegen from ABI flow
1. Place smart contract ABI into `src/contracts/abi/` folder
2. `$ pnpm typechain`
3. All smart contracts types have been (re)generated.
4. Declare smart contract address in `src/contracts/config.ts` with its type factory.
5. Now the smart contract types will be automatically infered and can be used with `useContract` hook.
```typescript
  const { read: readZbtc, write: writeZbtc } = useContract(ContractType.ZBTC);
  
  ...

  // Now we can type-safely call contract methods
  const balance = await readZbtc.balanceOf(account);

  // And submit transaction with type-checked calldata 
  await writeZbtc.transfer(otherAccount, "1");
```

### Multicall, batch requests
- NO direct out of the box support for multicall
- JsonRpcBatchProvider is available for multiple rpc request batching

### Listening to events
Straightforward event subscripttions and event data decoding.
```typescript
    const transferEvent = readZbtc.getEvent("Transfer");

    const transferEventListener: TypedListener<typeof transferEvent> = (
      from,
      to,
      rawAmount,
      event
    ) => {
      const transferEvent = {
        from,
        to,
        amount: ethers.formatEther(rawAmount),
        id: event.transactionHash,
      };
      setLatestTransfer(transferEvent);
    };

    readZbtc.on(transferEvent, transferEventListener);

    return () => {
      readZbtc.removeListener(transferEvent, transferEventListener);
    }
  ```
  - need to manually implement polling/data refetch on each block

### Transaction lifecycle handling
Simple way to handle transaction submission, at first the transaction is sent to mempool. After, `TransactionResponse.wait` method can be called to await block inclusion.
```typescript
    const tx = await writeZbtc.transfer(...args);
    // Transaction is now submitted to mempool, now we wait until tx is mined.

...

    const txReceipt = await tx.wait();
    // Transaction has been mined and included in latest block.

```
- allows easy transaction chaining 

## Data handling
- since v6 uses JS native `bignum`
- getter return types automatically decoded
- useful `parseEther`|`parseUnits` and `formatEther`|`formatUnits` utils to help with decimal conversions
- utils to help with hashing (keccak256)

## Constructing unsigned transaction
- non-trivial, but possible:
```typescript
    const rawTx= await writeZbtc.transfer.populateTransaction(...args);
    const txObject = ethers.Transaction.from(rawTx);
    const signedTx = await signer.signTransaction(txObject);

    await signer.sendTransaction(signedTx);
```

## Dry-running

## Docs & DX
- documentation does not contain many examples, mainly API reference
- industry standard package -> more content on SO/GitHub, but 6 different versions cause outdated answers
- some issues on GitHub seem to be open without any plan to get resolved 



