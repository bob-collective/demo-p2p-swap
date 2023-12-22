import { REGTEST_ESPLORA_BASE_PATH, MAINNET_ESPLORA_BASE_PATH, TESTNET_ESPLORA_BASE_PATH } from '@gobob/bob-sdk';
import * as bitcoinJsLib from 'bitcoinjs-lib/';
import * as ecc from 'tiny-secp256k1';
import { HexString } from '../types';
import { addHexPrefix } from './encoding';

bitcoinJsLib.initEccLib(ecc);
const BITCOIN_NETWORK = import.meta.env.VITE_BITCOIN_NETWORK as string;

const getBitcoinLibNetwork = () => {
  if (BITCOIN_NETWORK === 'testnet') {
    return bitcoinJsLib.networks.testnet;
  }
  if (BITCOIN_NETWORK === 'regtest') {
    return bitcoinJsLib.networks.regtest;
  }
  if (BITCOIN_NETWORK === 'mainnet') {
    return bitcoinJsLib.networks.bitcoin;
  }
  throw new Error(
    `Invalid bitcoin network configured: ${BITCOIN_NETWORK}. Valid values are: testnet | regtest | mainnet.`
  );
};

const getElectrsUrl = () => {
  if (BITCOIN_NETWORK === 'testnet') {
    return TESTNET_ESPLORA_BASE_PATH;
  }
  if (BITCOIN_NETWORK === 'regtest') {
    return REGTEST_ESPLORA_BASE_PATH;
  }
  if (BITCOIN_NETWORK === 'mainnet') {
    return MAINNET_ESPLORA_BASE_PATH;
  }
  throw new Error(
    `Invalid bitcoin network configured: ${BITCOIN_NETWORK}. Valid values are: testnet | regtest | mainnet.`
  );
};

const fetchBtcNetwork = async (path: `/${string}`) => {
  const electrsUrl = getElectrsUrl();
  try {
    const result = await fetch(`${electrsUrl}${path}`);
    return await result.json();
  } catch (err) {
    console.error(`Error fetching regtest electrs server: ${err}`);
    console.error('Make sure that electrs server is running at:', electrsUrl);
  }
};

const hasOutputWithValidAmount = (
  vout: { scriptpubkey_address: string; value: number }[],
  requiredBtcAmount: bigint,
  requiredBtcAddress: string
) =>
  vout.some(
    (output) => BigInt(output.value) === requiredBtcAmount && output.scriptpubkey_address === requiredBtcAddress
  );

const getAddressFromScriptPubKey = (scriptPubKey: HexString): string => {
  const network = getBitcoinLibNetwork();
  const hexData = scriptPubKey.slice(2); // Strips 0x prefix
  return bitcoinJsLib.address.fromOutputScript(Buffer.from(hexData, 'hex'), network);
};

const getScriptPubKeyFromAddress = (address: string): HexString => {
  const network = getBitcoinLibNetwork();
  const hexScriptPubKey = bitcoinJsLib.address.toOutputScript(address, network);
  return addHexPrefix(hexScriptPubKey.toString('hex'));
};

export {
  fetchBtcNetwork,
  getElectrsUrl,
  hasOutputWithValidAmount,
  BITCOIN_NETWORK,
  getAddressFromScriptPubKey,
  getScriptPubKeyFromAddress
};
