import { bytesToHex, hexToBytes } from './opcodes.js';
import { getNetwork } from './networks.js';

/** SHA-256 via Web Crypto API */
export async function sha256(data) {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return new Uint8Array(hash);
}

export async function sha256Hex(input) {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  return bytesToHex(await sha256(bytes));
}

export async function doubleSha256(data) {
  return sha256(await sha256(data));
}

/** Compact RIPEMD-160 for HASH160 */
function ripemd160(bytes) {
  const rotl = (x, n) => (x << n) | (x >>> (32 - n));

  const f = (j, x, y, z) => {
    if (j < 16) return x ^ y ^ z;
    if (j < 32) return (x & y) | (~x & z);
    if (j < 48) return (x | ~y) ^ z;
    if (j < 64) return (x & z) | (y & ~z);
    return x ^ (y | ~z);
  };

  const K1 = [
    0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e,
  ];
  const K2 = [
    0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000,
  ];

  const R1 = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
    3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
    1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
    4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
  ];
  const R2 = [
    5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
    6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
    15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
    8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
    12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
  ];
  const S1 = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8];
  const S2 = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6];

  const msg = new Uint8Array(((bytes.length + 9 + 63) >> 6) << 6);
  msg.set(bytes);
  msg[bytes.length] = 0x80;
  const bitLen = bytes.length * 8;
  msg[msg.length - 8] = bitLen & 0xff;
  msg[msg.length - 7] = (bitLen >> 8) & 0xff;
  msg[msg.length - 6] = (bitLen >> 16) & 0xff;
  msg[msg.length - 5] = (bitLen >> 24) & 0xff;

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const w = new Uint32Array(16);
  for (let i = 0; i < msg.length; i += 64) {
    for (let j = 0; j < 16; j++) {
      const o = i + j * 4;
      w[j] = msg[o] | (msg[o + 1] << 8) | (msg[o + 2] << 16) | (msg[o + 3] << 24);
    }

    let al = h0, bl = h1, cl = h2, dl = h3, el = h4;
    let ar = h0, br = h1, cr = h2, dr = h3, er = h4;

    for (let j = 0; j < 80; j++) {
      const group = j >> 4;
      const kl = K1[group];
      const kr = K2[group];
      const rl = R1[j];
      const rr = R2[j];
      const sl = S1[j % 16];
      const sr = S2[j % 16];

      const tl = (al + f(j, bl, cl, dl) + w[rl] + kl) | 0;
      al = el;
      el = dl;
      dl = rotl(cl, 10);
      cl = bl;
      bl = (tl + rotl(tl, sl)) | 0;

      const tr = (ar + f(79 - j, br, cr, dr) + w[rr] + kr) | 0;
      ar = er;
      er = dr;
      dr = rotl(cr, 10);
      cr = br;
      br = (tr + rotl(tr, sr)) | 0;
    }

    const t = (h1 + cl + dr) | 0;
    h1 = (h2 + dl + er) | 0;
    h2 = (h3 + el + ar) | 0;
    h3 = (h4 + al + br) | 0;
    h4 = (h0 + bl + cr) | 0;
    h0 = t;
  }

  const out = new Uint8Array(20);
  const hs = [h0, h1, h2, h3, h4];
  for (let i = 0; i < 5; i++) {
    out[i * 4] = hs[i] & 0xff;
    out[i * 4 + 1] = (hs[i] >> 8) & 0xff;
    out[i * 4 + 2] = (hs[i] >> 16) & 0xff;
    out[i * 4 + 3] = (hs[i] >> 24) & 0xff;
  }
  return out;
}

export async function hash160(data) {
  const sha = await sha256(data);
  return ripemd160(sha);
}

export async function hash160Hex(input) {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  return bytesToHex(await hash160(bytes));
}

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export function base58Encode(bytes) {
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++;

  const digits = [0];
  for (let i = zeros; i < bytes.length; i++) {
    let carry = bytes[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }

  let str = '1'.repeat(zeros);
  for (let i = digits.length - 1; i >= 0; i--) {
    str += ALPHABET[digits[i]];
  }
  return str;
}

export async function p2shAddressFromScript(scriptHex, network = 'mainnet') {
  const script = hexToBytes(scriptHex);
  const hash = await hash160(script);
  const version = getNetwork(network).scriptHash;
  const payload = new Uint8Array(21);
  payload[0] = version;
  payload.set(hash, 1);
  const checksum = (await doubleSha256(payload)).slice(0, 4);
  const full = new Uint8Array(25);
  full.set(payload);
  full.set(checksum, 21);
  return base58Encode(full);
}

export function textToHex(text) {
  return bytesToHex(new TextEncoder().encode(text));
}

export function hexToText(hex) {
  const bytes = hexToBytes(hex);
  return new TextDecoder().decode(bytes);
}

export function randomSecret(bytes = 16) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return bytesToHex(arr);
}

export async function fileSha256(file) {
  const buffer = await file.arrayBuffer();
  return bytesToHex(await sha256(new Uint8Array(buffer)));
}

export function locktimeFromDate(dateStr, type = 'unix') {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid date');
  if (type === 'unix') return Math.floor(d.getTime() / 1000);
  throw new Error('Block height lock requires manual block estimate');
}

export function locktimeOpcode(n) {
  if (n === 0) return 'OP_0';
  if (n >= 1 && n <= 16) return `OP_${n}`;
  // BIP65 pushes locktime as 4-byte little-endian in real txs;
  // wizard documents the value and uses minimal encoding in ASM preview.
  const hex = n.toString(16).padStart(8, '0');
  const le = hex.match(/../g).reverse().join('');
  return le.replace(/^0+/, '') || '00';
}
