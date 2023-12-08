# BOB Collective: BTC Peer to peer swap

## Local development

### Installing the project

1. Install [pnpm](https://pnpm.io/installation)
2. Run `pnpm install`

### Connecting Metamask

1. Go to [Conduit](https://app.conduit.xyz/published/view/puff-bob-jznbxtoq7h).
2. Click the 'Add to wallet button.'

### Funding your account

#### Testnet ETH

1. Create a new account in your wallet.
2. Fund your account with Sepolia Eth from a [testnet faucet](https://faucetlink.to/sepolia).
3. Transfer to the BOB network using [Superbridge](https://puff-bob-jznbxtoq7h.testnets.superbridge.app/).

Note: we have seen instances of this failing. If this happens, the api can be called from a terminal:
`curl -XPOST -i https://faucetl2-puff-bob-jznbxtoq7h.t.conduit.xyz/drip/0x4062e44077b1e58C3D630a0e4e632fF81868e448`

#### Other supported tokens

1. This can be done with the faucet button in the UI.

### Starting the project

1. Run `pnpm dev`

### Browser support

This application is tested using:

- Chrome
- Brave
- Firefox

In the following environments:

- Linux
- MacOS
- Windows

It does not currently support any mobile wallets.
