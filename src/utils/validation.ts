const BTC_REGTEST_REGEX = /\b([2mn][a-km-zA-HJ-NP-Z1-9]{25,34}|bcrt1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;

const btcAddressRegex = new RegExp(BTC_REGTEST_REGEX);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFormDisabled = (form: any): boolean => !form.isValid || !form.dirty;

export const isValidBTCAddress = (address: string): boolean => btcAddressRegex.test(address);
