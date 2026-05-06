import SHA512 from 'crypto-js/sha512';
import encHex from 'crypto-js/enc-hex';

/**
 * Hash a password using SHA-512 on the client side before sending to the server.
 * Uses crypto-js to match the double-hash protocol.
 */
export const hashPassword = async (password) => {
  return SHA512(password).toString(encHex);
};
