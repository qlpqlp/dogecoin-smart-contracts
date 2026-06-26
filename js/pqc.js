/**
 * Post-quantum signature commitments (Phase 1 OP_RETURN).
 * Draft BIP: libdogecoin post-quantum signature commitments (FLC1, DIL2, RCG4).
 */
import { bytesToHex, hexToBytes } from './opcodes.js';
import { sha256, sha256Hex } from './crypto.js';

export const PQC_BIP_URL =
  'https://github.com/edtubbs/libdogecoin/blob/0.1.5-dev-pqc-carrier/doc/spec/bip-post-quantum-signature-commitments.mediawiki';
export const SUCHQUANTUM_URL = 'https://suchquantum.com/';

export const PQC_SCHEMES = {
  falcon: {
    id: 'falcon',
    tag: 'FLC1',
    tagHex: '464c4331',
    carrierTag: 'FLC1FULL',
    label: 'Falcon-512',
    pkLen: 897,
    sigLen: 690,
    partTotal: 1,
  },
  dilithium: {
    id: 'dilithium',
    tag: 'DIL2',
    tagHex: '44494c32',
    carrierTag: 'DIL2FULL',
    label: 'Dilithium2',
    pkLen: 1312,
    sigLen: 2420,
    partTotal: 3,
  },
  raccoon: {
    id: 'raccoon',
    tag: 'RCG4',
    tagHex: '52434734',
    carrierTag: 'RCG4FULL',
    label: 'Raccoon-G-44',
    pkLen: 16144,
    sigLen: 20768,
    partTotal: 24,
  },
};

export const PQC_SCHEME_OPTIONS = [
  { value: 'falcon', label: 'Falcon-512 (FLC1)' },
  { value: 'dilithium', label: 'Dilithium2 (DIL2)' },
  { value: 'raccoon', label: 'Raccoon-G-44 (RCG4)' },
];

export function getPqcScheme(id) {
  return PQC_SCHEMES[id] || PQC_SCHEMES.falcon;
}

export function normalizeHex(input) {
  return (input || '').replace(/^0x/i, '').replace(/\s+/g, '').toLowerCase();
}

export function isValidHexBytes(hex, minLen = 2) {
  const s = normalizeHex(hex);
  return /^[0-9a-f]+$/.test(s) && s.length % 2 === 0 && s.length >= minLen;
}

/** commitment32 = SHA256(public_key_bytes || signature_bytes) */
export async function computePqcCommitment(pubkeyHex, signatureHex) {
  const pk = hexToBytes(normalizeHex(pubkeyHex));
  const sig = hexToBytes(normalizeHex(signatureHex));
  if (!pk.length || !sig.length) throw new Error('Public key and signature hex are required');
  const combined = new Uint8Array(pk.length + sig.length);
  combined.set(pk);
  combined.set(sig, pk.length);
  const commitment = await sha256(combined);
  return {
    commitmentHex: bytesToHex(commitment),
    pkLen: pk.length,
    sigLen: sig.length,
    pkPrefix: bytesToHex(pk.slice(0, 16)),
    sigPrefix: bytesToHex(sig.slice(0, 16)),
  };
}

/** 36-byte OP_RETURN payload: 4-byte tag + 32-byte commitment */
export function buildPqcDataHex(schemeId, commitmentHex) {
  const scheme = getPqcScheme(schemeId);
  const commit = normalizeHex(commitmentHex);
  if (!/^[0-9a-f]{64}$/.test(commit)) {
    throw new Error('Commitment must be 32 bytes (64 hex characters)');
  }
  return scheme.tagHex + commit;
}

export function buildPqcOpReturnAsm(schemeId, commitmentHex) {
  return `OP_RETURN ${buildPqcDataHex(schemeId, commitmentHex)}`;
}

/** Canonical wire script: 6a 24 <tag4> <commitment32> */
export function buildPqcOpReturnScriptHex(schemeId, commitmentHex) {
  return `6a24${buildPqcDataHex(schemeId, commitmentHex)}`;
}

export function randomHexBytes(byteLen) {
  const bytes = new Uint8Array(byteLen);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

export async function demoPqcMaterial(schemeId) {
  const scheme = getPqcScheme(schemeId);
  const pubkeyHex = randomHexBytes(scheme.pkLen);
  const signatureHex = randomHexBytes(scheme.sigLen);
  const { commitmentHex } = await computePqcCommitment(pubkeyHex, signatureHex);
  return { pubkeyHex, signatureHex, commitmentHex };
}
