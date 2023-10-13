import { REGTEST_ESPLORA_BASE_PATH, MAINNET_ESPLORA_BASE_PATH, TESTNET_ESPLORA_BASE_PATH } from '@gobob/bob-sdk';

const BITCOIN_NETWORK = import.meta.env.VITE_BITCOIN_NETWORK as string;

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

export { fetchBtcNetwork, getElectrsUrl, hasOutputWithValidAmount, BITCOIN_NETWORK };
