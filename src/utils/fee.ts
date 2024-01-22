import { getBlockStreamUrl } from './bitcoin';

export async function getFeeRate(): Promise<number> {
  const res = await fetch(`${getBlockStreamUrl()}/fee-estimates`);
  const feeRates = await res.json();
  return feeRates['6']; // one hour
}
