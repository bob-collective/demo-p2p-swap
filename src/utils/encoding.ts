import { HexString } from '../types';

const addHexPrefix = (data: string): HexString => `0x${data}`;

export { addHexPrefix };
