# Peer to Peer Swap Demo

This application demonstrates how BOB is leveraged to build a peer-to-peer (P2P) swap application that allows two parties to swap ERC20 tokens and BTC without using a custodian.

Full documentation can be found at:
[https://docs.gobob.xyz/docs/build/examples/btc_swap/](https://docs.gobob.xyz/docs/build/examples/btc_swap/)

## Local development

### Installing the project

1. Install [pnpm](https://pnpm.io/installation)
2. Run `pnpm install`

### Starting the project

1. Run `pnpm dev`

### Connecting an EVM Compatible Wallet

This can be done from the UI or from [Conduit](https://app.conduit.xyz/published/view/fluffy-bob-7mjgi9pmtg).

### Funding your account

Before using the application you will need to fund your account with ETH, ERCC20 tokens. This can be done from the UI. You should fund your account with ETH tokens first so that you can pay the transaction fees when minting the ERC20 tokens.

You can also fund your account with ETH from [Conduit](https://app.conduit.xyz/published/view/fluffy-bob-7mjgi9pmtg), or by calling the api directly: `curl -XPOST -i https://faucetl2-fluffy-bob-7mjgi9pmtg.t.conduit.xyz/drip/0x4062e44077b1e58C3D630a0e4e632fF81868e448`

### Browser support

This application is tested using:

- Chrome
- Brave
- Firefox

In the following environments:

- Linux
- MacOS
- Windows
