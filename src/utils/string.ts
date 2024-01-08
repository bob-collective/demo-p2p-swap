function truncateString(inputString: string, prefixLength: number, suffixLength: number) {
  // Check if the input string is long enough to truncate
  if (inputString.length <= prefixLength + suffixLength) {
    return inputString; // Return the original string if no truncation is needed
  }

  // Truncate the string by keeping the prefix and suffix
  const prefix = inputString.slice(0, prefixLength);
  const suffix = inputString.slice(-suffixLength);

  // Concatenate the prefix, ellipsis, and suffix to form the truncated string
  const truncatedString = `${prefix}...${suffix}`;

  return truncatedString;
}

function shortenBitcoinAddress(address: string) {
  // Extract the first and last 6 characters of the address
  const shortenedAddress = address.slice(0, 6) + '...' + address.slice(-6);
  return shortenedAddress;
}

export { truncateString, shortenBitcoinAddress };
