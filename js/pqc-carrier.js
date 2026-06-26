/**
 * Phase 1 PQC carrier commitment validation (TX_C OP_RETURN vs TX_R scriptSig).
 * Same on-chain checks SPV scanners and QDVerify perform for commitment matching.
 */
import { bytesToHex, hexToBytes } from './opcodes.js';
import { sha256 } from './crypto.js';
import { getPqcScheme } from './pqc.js';

const TAG8 = {
  FLC1FULL: new Uint8Array([0x46, 0x4c, 0x43, 0x31, 0x46, 0x55, 0x4c, 0x4c]),
  DIL2FULL: new Uint8Array([0x44, 0x49, 0x4c, 0x32, 0x46, 0x55, 0x4c, 0x4c]),
  RCG4FULL: new Uint8Array([0x52, 0x43, 0x47, 0x34, 0x46, 0x55, 0x4c, 0x4c]),
};

const TAG4 = {
  FLC1FULL: new Uint8Array([0x46, 0x4c, 0x43, 0x31]),
  DIL2FULL: new Uint8Array([0x44, 0x49, 0x4c, 0x32]),
  RCG4FULL: new Uint8Array([0x52, 0x43, 0x47, 0x34]),
};

const REDEEM_CARRIER = new Uint8Array([0x75, 0x75, 0x75, 0x75, 0x75, 0x51]);

function eqBytes(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function concatAll(arrays) {
  let len = 0;
  for (const a of arrays) len += a.length;
  const out = new Uint8Array(len);
  let o = 0;
  for (const a of arrays) { out.set(a, o); o += a.length; }
  return out;
}

function readVarInt(buf, off) {
  const x = buf[off];
  if (x < 0xfd) return { n: x, next: off + 1 };
  if (x === 0xfd) return { n: buf[off + 1] | (buf[off + 2] << 8), next: off + 3 };
  if (x === 0xfe) {
    let n = 0;
    for (let i = 0; i < 4; i++) n |= buf[off + 1 + i] << (8 * i);
    return { n: n >>> 0, next: off + 5 };
  }
  let lo = 0; let hi = 0;
  for (let i = 0; i < 4; i++) lo |= buf[off + 1 + i] << (8 * i);
  for (let i = 0; i < 4; i++) hi |= buf[off + 5 + i] << (8 * i);
  const bn = (BigInt(hi) << 32n) | BigInt(lo >>> 0);
  if (bn > Number.MAX_SAFE_INTEGER) throw new Error('varint too large');
  return { n: Number(bn), next: off + 9 };
}

function readUInt32LE(buf, off) {
  return buf[off] | (buf[off + 1] << 8) | (buf[off + 2] << 16) | (buf[off + 3] << 24);
}

function readUInt64LE(buf, off) {
  let lo = 0; let hi = 0;
  for (let i = 0; i < 4; i++) lo |= buf[off + i] << (8 * i);
  for (let i = 0; i < 4; i++) hi |= buf[off + 4 + i] << (8 * i);
  return (BigInt(hi) << 32n) | BigInt(lo >>> 0);
}

function scriptToPushes(script) {
  const pushes = [];
  let i = 0;
  while (i < script.length) {
    const op = script[i++];
    if (op === 0x00) { pushes.push(new Uint8Array(0)); continue; }
    if (op >= 0x01 && op <= 0x4b) {
      const n = op;
      pushes.push(script.slice(i, i + n));
      i += n;
      continue;
    }
    if (op === 0x4c) {
      const n = script[i++];
      pushes.push(script.slice(i, i + n));
      i += n;
      continue;
    }
    if (op === 0x4d) {
      const n = script[i] | (script[i + 1] << 8);
      i += 2;
      pushes.push(script.slice(i, i + n));
      i += n;
      continue;
    }
    if (op === 0x4e) {
      const n = script[i] | (script[i + 1] << 8) | (script[i + 2] << 16) | (script[i + 3] << 24);
      i += 4;
      pushes.push(script.slice(i, i + n));
      i += n;
      continue;
    }
    if (op >= 0x51 && op <= 0x60) {
      pushes.push(new Uint8Array([op - 0x50]));
      continue;
    }
    throw new Error(`Unsupported opcode in scriptSig: 0x${op.toString(16)}`);
  }
  return pushes;
}

function parseTx(raw) {
  let o = 0;
  const version = readUInt32LE(raw, o);
  o += 4;
  let vinCount = readVarInt(raw, o);
  o = vinCount.next;
  const vin = [];
  for (let v = 0; v < vinCount.n; v++) {
    const prevTxid = raw.slice(o, o + 32);
    o += 32;
    const prevIndex = readUInt32LE(raw, o);
    o += 4;
    const sl = readVarInt(raw, o);
    o = sl.next;
    const scriptSig = raw.slice(o, o + sl.n);
    o += sl.n;
    const sequence = readUInt32LE(raw, o);
    o += 4;
    vin.push({ prevTxid, prevIndex, scriptSig, sequence });
  }
  let voutCount = readVarInt(raw, o);
  o = voutCount.next;
  const vout = [];
  for (let v = 0; v < voutCount.n; v++) {
    const value = readUInt64LE(raw, o);
    o += 8;
    const pl = readVarInt(raw, o);
    o = pl.next;
    const pkScript = raw.slice(o, o + pl.n);
    o += pl.n;
    vout.push({ value, pkScript });
  }
  const locktime = readUInt32LE(raw, o);
  return { version, vin, vout, locktime };
}

async function txidFromRaw(raw) {
  const h1 = await sha256(raw);
  const h2 = await sha256(h1);
  const rev = new Uint8Array(32);
  for (let i = 0; i < 32; i++) rev[i] = h2[31 - i];
  return bytesToHex(rev);
}

function findCommitments(tx) {
  const out = [];
  for (let i = 0; i < tx.vout.length; i++) {
    const s = tx.vout[i].pkScript;
    if (s.length === 2 + 36 && s[0] === 0x6a && s[1] === 0x24) {
      const payload = s.slice(2, 38);
      out.push({ voutIndex: i, tag4: payload.slice(0, 4), commitment: payload.slice(4, 36) });
    }
  }
  return out;
}

function detectTag8(u8) {
  for (const name of Object.keys(TAG8)) {
    if (eqBytes(u8, TAG8[name])) return name;
  }
  return null;
}

function parseCarrierVin(scriptSig) {
  let pushes;
  try {
    pushes = scriptToPushes(scriptSig);
  } catch {
    return null;
  }
  if (pushes.length < 6) return null;
  const redeem = pushes[pushes.length - 1];
  if (!eqBytes(redeem, REDEEM_CARRIER)) return null;
  const tag8 = pushes[0];
  const hdr8 = pushes[1];
  const tagName = detectTag8(tag8);
  if (!tagName || hdr8.length !== 8) return null;
  const chunks = pushes.slice(2, pushes.length - 1);
  if (chunks.length !== 3) return null;
  return {
    tagName,
    partIndex: hdr8[1],
    partTotal: hdr8[2],
    pkLen: (hdr8[4] << 8) | hdr8[5],
    fullLen: (hdr8[6] << 8) | hdr8[7],
    partPayload: concatAll(chunks),
  };
}

/**
 * Validate TX_C canonical OP_RETURN against TX_R P2SH carrier reveal material.
 * Returns structured result for the wizard UI.
 */
export async function verifyPqcCarrierCommitment(txcHex, txrHex) {
  const rawC = hexToBytes((txcHex || '').replace(/\s+/g, ''));
  const rawR = hexToBytes((txrHex || '').replace(/\s+/g, ''));
  if (!rawC.length || !rawR.length) throw new Error('Paste both TX_C and TX_R raw hex');

  const txC = parseTx(rawC);
  const txR = parseTx(rawR);
  const [txidC, txidR] = await Promise.all([txidFromRaw(rawC), txidFromRaw(rawR)]);

  const commitments = findCommitments(txC);
  if (!commitments.length) {
    throw new Error('TX_C: no canonical PQ OP_RETURN (expected 6a 24 + FLC1|DIL2|RCG4 + 32-byte commitment)');
  }

  const parts = [];
  for (let i = 0; i < txR.vin.length; i++) {
    const c = parseCarrierVin(txR.vin[i].scriptSig);
    if (c) parts.push({ vinIndex: i, ...c });
  }
  if (!parts.length) {
    throw new Error('TX_R: no carrier scriptSig (expect FLC1FULL|DIL2FULL|RCG4FULL + HDR8 + 3 chunks + redeemScript)');
  }

  const tagName = parts[0].tagName;
  if (!parts.every((p) => p.tagName === tagName)) throw new Error('Mixed carrier tags across inputs');

  const expectedParts = { FLC1FULL: 1, DIL2FULL: 3, RCG4FULL: 24 }[tagName];
  const pt0 = parts[0].partTotal;
  if (pt0 !== expectedParts) {
    throw new Error(`Unexpected part_total for ${tagName}: got ${pt0}, expected ${expectedParts}`);
  }

  const byPart = new Map();
  for (const p of parts) {
    if (p.partTotal !== pt0) throw new Error('Inconsistent part_total in carrier headers');
    if (byPart.has(p.partIndex)) throw new Error(`Duplicate part_index ${p.partIndex}`);
    byPart.set(p.partIndex, p.partPayload);
  }
  if (byPart.size !== pt0) throw new Error(`Missing carrier parts: have ${byPart.size} / ${pt0}`);

  let full = new Uint8Array(0);
  for (let pi = 0; pi < pt0; pi++) {
    if (!byPart.has(pi)) throw new Error(`Missing carrier part ${pi}`);
    full = concatAll([full, byPart.get(pi)]);
  }
  const pkLen = parts[0].pkLen;
  const fullLen = parts[0].fullLen;
  full = full.slice(0, fullLen);
  const pk = full.slice(0, pkLen);
  const sig = full.slice(pkLen);
  const recomputed = await sha256(concatAll([pk, sig]));
  const tag4 = TAG4[tagName];
  const match = commitments.find((co) => eqBytes(co.tag4, tag4) && eqBytes(co.commitment, recomputed));
  if (!match) {
    throw new Error(
      `Commitment mismatch. TX_C: ${commitments.map((c) => bytesToHex(c.commitment)).join(', ')}; `
      + `recomputed SHA256(pk||sig): ${bytesToHex(recomputed)}`,
    );
  }

  let spendsTxC = false;
  for (const vin of txR.vin) {
    const prevTxidDisplay = [...vin.prevTxid].reverse().map((b) => b.toString(16).padStart(2, '0')).join('');
    if (prevTxidDisplay.toLowerCase() === txidC.toLowerCase()) spendsTxC = true;
  }

  const schemeKey = { FLC1FULL: 'falcon', DIL2FULL: 'dilithium', RCG4FULL: 'raccoon' }[tagName];
  const scheme = getPqcScheme(schemeKey);

  return {
    ok: true,
    algorithm: scheme.label,
    carrierTag: tagName,
    opReturnTag: scheme.tag,
    txidC,
    txidR,
    matchedVout: match.voutIndex,
    pkLen: pk.length,
    sigLen: sig.length,
    pkPrefix: bytesToHex(pk.slice(0, 16)),
    sigPrefix: bytesToHex(sig.slice(0, 16)),
    commitmentHex: bytesToHex(recomputed),
    spendsTxC,
    note: spendsTxC
      ? 'TX_R spends an output from TX_C. Carrier reveal is linked.'
      : 'TX_R prevouts did not match TX_C txid (may still be valid if txs are from the same block).',
  };
}
