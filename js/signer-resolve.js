/**
 * Resolve a user-facing Dogecoin address (or hex pubkey) into CHECKSIG script ASM.
 * Addresses cannot be reversed to pubkeys; we lock to HASH160(address) instead.
 */
import { bytesToHex } from './opcodes.js';
import { doubleSha256 } from './crypto.js';
import { base58Decode } from './tx.js';
import { getNetwork } from './networks.js';

const ADDR_RE = /^[1-9A-HJ-NP-Za-km-z]{26,35}$/;

export function isDogecoinAddress(input) {
  const s = (input || '').trim();
  return ADDR_RE.test(s);
}

export function isHexPubkey(input) {
  const s = (input || '').replace(/\s/g, '').replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]+$/.test(s) || s.length % 2 !== 0) return false;
  if (s.length === 66 && (s.startsWith('02') || s.startsWith('03'))) return true;
  if (s.length === 130 && s.startsWith('04')) return true;
  return false;
}

export async function decodeAddressPayload(address, network) {
  const raw = base58Decode(address.trim());
  if (raw.length !== 25) throw new Error('Invalid Dogecoin address length');
  const payload = raw.slice(0, 21);
  const checksum = raw.slice(21);
  const check = (await doubleSha256(payload)).slice(0, 4);
  if (bytesToHex(check) !== bytesToHex(checksum)) {
    throw new Error('Invalid Dogecoin address (checksum failed)');
  }
  const version = payload[0];
  const hash160 = bytesToHex(payload.slice(1));
  const net = getNetwork(network);
  if (version === net.pubKeyHash) {
    return { hash160, type: 'p2pkh', address: address.trim() };
  }
  if (version === net.scriptHash) {
    return { hash160, type: 'p2sh', address: address.trim() };
  }
  const hint = net.addressHint;
  throw new Error(`Address does not match ${net.label}. Expected ${hint}.`);
}

/** Standard P2PKH-style checksig fragment for script embedding. */
export async function resolveChecksigAsm(input, network) {
  const s = (input || '').trim();
  if (!s) throw new Error('Enter your Dogecoin address (D… or n…)');

  if (isHexPubkey(s)) {
    const pubkey = s.replace(/\s/g, '').replace(/^0x/i, '');
    return { asm: `${pubkey} OP_CHECKSIG`, kind: 'pubkey', pubkey };
  }

  if (isDogecoinAddress(s)) {
    const decoded = await decodeAddressPayload(s, network);
    if (decoded.type === 'p2sh') {
      throw new Error('Use a regular wallet address (D… or n…), not a P2SH contract address.');
    }
    return {
      asm: `OP_DUP OP_HASH160 ${decoded.hash160} OP_EQUALVERIFY OP_CHECKSIG`,
      kind: 'address',
      address: decoded.address,
      hash160: decoded.hash160,
    };
  }

  throw new Error('Enter your Dogecoin address (D… or n…) or a hex pubkey (02… / 03…)');
}

/** Multisig still requires raw pubkeys in the redeem script. */
export function resolveMultisigPubkey(input) {
  const s = (input || '').trim();
  if (!s) throw new Error('Pubkey required for multisig');
  if (isDogecoinAddress(s)) {
    throw new Error('Multisig needs hex pubkeys from dogecoin-cli validateaddress, not wallet addresses.');
  }
  if (!isHexPubkey(s)) {
    throw new Error('Enter a hex pubkey (02… / 03…) for each multisig signer.');
  }
  return s.replace(/\s/g, '').replace(/^0x/i, '');
}
