/**
 * Dogecoin legacy transaction builder & signer (client-side only).
 * Produces signed raw hex ready for sendrawtransaction anywhere.
 */
import { bytesToHex, hexToBytes, encodePushData, asmToScript } from './opcodes.js';
import { doubleSha256, hash160, base58Encode } from './crypto.js';
import { NETWORKS, getNetwork } from './networks.js';
import * as secp from '@noble/secp256k1';

export { NETWORKS, getNetwork } from './networks.js';

const COIN = 100000000n;

const SIGHASH_ALL = 1;
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function writeU32LE(n) {
  const b = new Uint8Array(4);
  b[0] = n & 0xff;
  b[1] = (n >> 8) & 0xff;
  b[2] = (n >> 16) & 0xff;
  b[3] = (n >> 24) & 0xff;
  return b;
}

function writeU64LE(n) {
  const b = new Uint8Array(8);
  const v = BigInt(n);
  for (let i = 0; i < 8; i++) b[i] = Number((v >> BigInt(i * 8)) & 0xffn);
  return b;
}

function writeVarInt(n) {
  if (n < 0xfd) return new Uint8Array([n]);
  if (n <= 0xffff) {
    const b = new Uint8Array(3);
    b[0] = 0xfd;
    b[1] = n & 0xff;
    b[2] = (n >> 8) & 0xff;
    return b;
  }
  const b = new Uint8Array(5);
  b[0] = 0xfe;
  b.set(writeU32LE(n), 1);
  return b;
}

function concat(...parts) {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function reverse32(bytes) {
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i++) out[i] = bytes[31 - i];
  return out;
}

export function dogeToKoinu(doge) {
  const parts = String(doge).split('.');
  const whole = BigInt(parts[0] || '0');
  const frac = (parts[1] || '').padEnd(8, '0').slice(0, 8);
  return whole * COIN + BigInt(frac || '0');
}

export function koinuToDoge(koinu) {
  return (Number(koinu) / 1e8).toFixed(8);
}

export function base58Decode(str) {
  const bytes = [0];
  for (const ch of str) {
    const val = B58.indexOf(ch);
    if (val < 0) throw new Error('Invalid base58');
    let carry = val;
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  let zeros = 0;
  for (const ch of str) {
    if (ch === '1') zeros++;
    else break;
  }
  const decoded = new Uint8Array(zeros + bytes.length);
  for (let i = 0; i < bytes.length; i++) decoded[zeros + bytes.length - 1 - i] = bytes[i];
  return decoded;
}

export async function decodeWIF(wif, network = 'testnet') {
  const raw = base58Decode(wif.trim());
  if (raw.length < 37) throw new Error('Invalid WIF');
  const payload = raw.slice(0, -4);
  const checksum = raw.slice(-4);
  const check = (await doubleSha256(payload)).slice(0, 4);
  if (bytesToHex(check) !== bytesToHex(checksum)) throw new Error('WIF checksum failed');
  const net = getNetwork(network);
  if (payload[0] !== net.wif) throw new Error(`WIF not valid for ${net.label}`);
  const compressed = payload.length === 34 && payload[33] === 0x01;
  return { privateKey: payload.slice(1, 33), compressed };
}

export async function parsePrivateKey(input, network = 'testnet') {
  const s = input.trim();
  if (/^[5KL9c][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(s) || /^[9c][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(s)) {
    return decodeWIF(s, network);
  }
  const hex = s.replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) throw new Error('Enter WIF or 64-char private key hex');
  return { privateKey: hexToBytes(hex), compressed: true };
}

export async function privateKeyToPubkey(privateKey, compressed = true) {
  return secp.getPublicKey(privateKey, compressed);
}

export function generateKeypair() {
  const privateKey = secp.utils.randomSecretKey();
  return { privateKey, compressed: true };
}

export async function encodeWIF(privateKey, network = 'testnet', compressed = true) {
  const net = getNetwork(network);
  const payload = compressed
    ? concat(new Uint8Array([net.wif]), privateKey, new Uint8Array([0x01]))
    : concat(new Uint8Array([net.wif]), privateKey);
  const checksum = (await doubleSha256(payload)).slice(0, 4);
  return base58Encode(concat(payload, checksum));
}

export async function pubkeyToP2pkhAddress(pubkey, network = 'testnet') {
  const h = await hash160(pubkey);
  const net = getNetwork(network);
  const payload = new Uint8Array(21);
  payload[0] = net.pubKeyHash;
  payload.set(h, 1);
  const checksum = (await doubleSha256(payload)).slice(0, 4);
  return base58Encode(concat(payload, checksum));
}

export async function addressToScriptPubKey(address, network = 'testnet') {
  const raw = base58Decode(address);
  if (raw.length !== 25) throw new Error('Invalid address');
  const version = raw[0];
  const h = raw.slice(1, 21);
  const net = getNetwork(network);
  if (version === net.pubKeyHash) {
    return concat(new Uint8Array([0x76, 0xa9, 0x14]), h, new Uint8Array([0x88, 0xac]));
  }
  if (version === net.scriptHash) {
    return concat(new Uint8Array([0xa9, 0x14]), h, new Uint8Array([0x87]));
  }
  throw new Error('Address version mismatch for network');
}

export function p2shScriptFromRedeem(redeemScript) {
  return concat(new Uint8Array([0xa9, 0x14]), redeemScript, new Uint8Array([0x87]));
}

export async function p2shScriptFromRedeemAsm(asm) {
  const redeem = asmToScript(asm);
  return p2shScriptFromRedeem(await hash160(redeem).then((h) => {
    // P2SH scriptPubKey uses hash of redeem script
    return concat(new Uint8Array([0xa9, 0x14]), h, new Uint8Array([0x87]));
  }));
}

export function opReturnScript(dataHex) {
  return concat(new Uint8Array([0x6a]), encodePushData(hexToBytes(dataHex)));
}

function serializeOutput(valueKoinu, scriptPubKey) {
  return concat(writeU64LE(valueKoinu), writeVarInt(scriptPubKey.length), scriptPubKey);
}

function serializeInput(txid, vout, scriptSig, sequence = 0xffffffff) {
  return concat(
    reverse32(hexToBytes(txid)),
    writeU32LE(vout),
    writeVarInt(scriptSig.length),
    scriptSig,
    writeU32LE(sequence)
  );
}

async function signatureHash(version, inputsMeta, outputs, locktime, inputIndex, scriptCode) {
  const blank = new Uint8Array(0);
  const serializedInputs = inputsMeta.map((inp, i) => {
    const script = i === inputIndex ? scriptCode : blank;
    return serializeInput(inp.txid, inp.vout, script, inp.sequence);
  });
  const serializedOutputs = outputs.map((o) => serializeOutput(o.value, o.scriptPubKey));
  const preimage = concat(
    writeU32LE(version),
    writeVarInt(inputsMeta.length),
    ...serializedInputs,
    writeVarInt(outputs.length),
    ...serializedOutputs,
    writeU32LE(locktime),
    writeU32LE(SIGHASH_ALL)
  );
  return doubleSha256(preimage);
}

function derEncodeSignature(sigBytes) {
  const r = sigBytes.slice(0, 32);
  const s = sigBytes.slice(32, 64);
  const trim = (b) => {
    let i = 0;
    while (i < b.length - 1 && b[i] === 0) i++;
    let t = b.slice(i);
    if (t[0] & 0x80) t = concat(new Uint8Array([0]), t);
    return t;
  };
  const rT = trim(r);
  const sT = trim(s);
  const body = concat(
    new Uint8Array([0x02, rT.length]), rT,
    new Uint8Array([0x02, sT.length]), sT
  );
  return concat(new Uint8Array([0x30, body.length]), body, new Uint8Array([SIGHASH_ALL]));
}

async function signInput(hash, privateKey) {
  const sig = secp.sign(hash, privateKey, { lowS: true, der: false });
  return derEncodeSignature(sig);
}

function pushBytes(bytes) {
  return encodePushData(bytes);
}

function redeemNeedsSig(redeemScript) {
  const hex = bytesToHex(redeemScript);
  return hex.includes('ac'); // OP_CHECKSIG = 0xac
}

/**
 * Build & sign a Dogecoin transaction entirely in-browser.
 */
export async function buildSignedTransaction(params) {
  const network = params.network || 'testnet';
  const version = 1;
  const locktime = params.locktime || 0;

  const parsedInputs = [];
  for (const inp of params.inputs) {
    const value = typeof inp.value === 'bigint'
      ? inp.value
      : dogeToKoinu(inp.valueDoge ?? inp.value);

    let scriptPubKey = inp.scriptPubKey ? hexToBytes(inp.scriptPubKey) : null;
    if (!scriptPubKey && inp.prevAddress) {
      scriptPubKey = await addressToScriptPubKey(inp.prevAddress, network);
    }

    const redeemScript = inp.redeemScript
      ? (typeof inp.redeemScript === 'string' ? hexToBytes(inp.redeemScript) : inp.redeemScript)
      : null;

    if (redeemScript && !scriptPubKey) {
      const h = await hash160(redeemScript);
      scriptPubKey = concat(new Uint8Array([0xa9, 0x14]), h, new Uint8Array([0x87]));
    }

    if (!scriptPubKey) throw new Error('Input needs prevAddress or scriptPubKey');

    let privateKey = null;
    let pubkey = null;
    if (inp.privateKey) {
      const key = await parsePrivateKey(inp.privateKey, network);
      privateKey = key.privateKey;
      pubkey = await privateKeyToPubkey(privateKey, key.compressed);
    }

    parsedInputs.push({
      txid: inp.txid.replace(/\s/g, ''),
      vout: parseInt(inp.vout, 10),
      value,
      scriptPubKey,
      privateKey,
      pubkey,
      sequence: inp.sequence ?? (locktime > 0 && redeemScript ? 0xfffffffe : 0xffffffff),
      redeemScript,
      preimage: inp.preimage || inp.preimageHex
        ? (inp.preimage ? new TextEncoder().encode(inp.preimage) : hexToBytes(inp.preimageHex))
        : null,
    });
  }

  const outputs = [];
  let totalOut = 0n;

  for (const out of params.outputs) {
    if (out.type === 'op_return' || out.dataHex) {
      outputs.push({ value: 0n, scriptPubKey: opReturnScript(out.dataHex) });
      continue;
    }

    const value = dogeToKoinu(out.valueDoge ?? out.amount ?? 0);
    let scriptPubKey;

    if (out.scriptHex) {
      scriptPubKey = hexToBytes(out.scriptHex);
    } else if (out.address) {
      scriptPubKey = await addressToScriptPubKey(out.address, network);
    } else {
      throw new Error('Output needs address, scriptHex, or dataHex');
    }

    totalOut += value;
    outputs.push({ value, scriptPubKey });
  }

  const totalIn = parsedInputs.reduce((s, i) => s + i.value, 0n);
  const fee = dogeToKoinu(params.feeDoge ?? params.fee ?? 0.01);
  const change = totalIn - totalOut - fee;
  if (change < 0n) {
    throw new Error(`Insufficient input: have ${koinuToDoge(totalIn)} DOGE, need ${koinuToDoge(totalOut + fee)}`);
  }

  if (change > 0n) {
    if (!params.changeAddress) throw new Error('Provide change address for leftover DOGE');
    outputs.push({
      value: change,
      scriptPubKey: await addressToScriptPubKey(params.changeAddress, network),
    });
  }

  const inputsMeta = parsedInputs.map((i) => ({
    txid: i.txid,
    vout: i.vout,
    sequence: i.sequence,
  }));

  const scriptSigs = [];
  for (let idx = 0; idx < parsedInputs.length; idx++) {
    const inp = parsedInputs[idx];

    if (inp.redeemScript) {
      const needsSig = redeemNeedsSig(inp.redeemScript);
      const stackItems = [];
      if (needsSig) {
        if (!inp.privateKey || !inp.pubkey) throw new Error('This redeem script requires a private key to sign');
        const hash = await signatureHash(version, inputsMeta, outputs, locktime, idx, inp.redeemScript);
        stackItems.push(await signInput(hash, inp.privateKey));
        stackItems.push(inp.pubkey);
      }
      if (inp.preimage) stackItems.push(inp.preimage);
      stackItems.push(inp.redeemScript);
      scriptSigs.push(concat(...stackItems.map(pushBytes)));
    } else {
      if (!inp.privateKey) throw new Error('P2PKH input requires private key (WIF)');
      const hash = await signatureHash(version, inputsMeta, outputs, locktime, idx, inp.scriptPubKey);
      const sig = await signInput(hash, inp.privateKey);
      scriptSigs.push(concat(pushBytes(sig), pushBytes(inp.pubkey)));
    }
  }

  const parts = [
    writeU32LE(version),
    writeVarInt(parsedInputs.length),
    ...parsedInputs.map((inp, i) =>
      serializeInput(inp.txid, inp.vout, scriptSigs[i], inp.sequence)
    ),
    writeVarInt(outputs.length),
    ...outputs.map((o) => serializeOutput(o.value, o.scriptPubKey)),
    writeU32LE(locktime),
  ];

  const rawBytes = concat(...parts);
  const hash = await doubleSha256(rawBytes);
  return {
    rawHex: bytesToHex(rawBytes),
    txid: bytesToHex(reverse32(hash)),
    fee: koinuToDoge(fee),
    change: change > 0n ? koinuToDoge(change) : '0',
    sizeBytes: rawBytes.length,
  };
}

export async function buildOpReturnTx(opts) {
  const dataHex = opts.dataHex;
  return buildSignedTransaction({
    network: opts.network,
    inputs: [{
      txid: opts.utxo.txid,
      vout: opts.utxo.vout,
      valueDoge: opts.utxo.valueDoge,
      prevAddress: opts.utxo.address,
      privateKey: opts.privateKey,
    }],
    outputs: [{ type: 'op_return', dataHex }],
    feeDoge: opts.feeDoge ?? 0.01,
    changeAddress: opts.changeAddress,
    locktime: opts.locktime,
  });
}

export async function buildFundContractTx(opts) {
  return buildSignedTransaction({
    network: opts.network,
    inputs: [{
      txid: opts.utxo.txid,
      vout: opts.utxo.vout,
      valueDoge: opts.utxo.valueDoge,
      prevAddress: opts.utxo.address,
      privateKey: opts.privateKey,
    }],
    outputs: [{ address: opts.toAddress, valueDoge: opts.amountDoge }],
    feeDoge: opts.feeDoge ?? 0.01,
    changeAddress: opts.changeAddress,
    locktime: opts.locktime,
  });
}

export async function buildClaimTx(opts) {
  const spendDoge = opts.spendDoge ?? (Number(opts.utxo.valueDoge) - Number(opts.feeDoge ?? 0.01));
  const locktime = opts.locktime || 0;
  return buildSignedTransaction({
    network: opts.network,
    locktime,
    inputs: [{
      txid: opts.utxo.txid,
      vout: opts.utxo.vout,
      valueDoge: opts.utxo.valueDoge,
      redeemScript: opts.redeemScriptHex,
      privateKey: opts.privateKey || undefined,
      preimage: opts.preimage,
      preimageHex: opts.preimageHex,
      sequence: locktime > 0 ? 0xfffffffe : 0xffffffff,
    }],
    outputs: [{ address: opts.toAddress, valueDoge: spendDoge }],
    feeDoge: opts.feeDoge ?? 0.01,
    changeAddress: opts.changeAddress,
  });
}

/** Sweep CLTV bank check / timelock P2SH (dogecoin-wallet compatible) */
export async function buildCltvSweepTx(opts) {
  return buildClaimTx({
    ...opts,
    locktime: opts.locktime,
    privateKey: opts.privateKey || opts.checkWif,
  });
}

export const BROADCAST_HELP = `Paste this signed hex into ANY broadcaster:

DogeGo (recommended): JSON-RPC sendrawtransaction on your local node. See dogego.org
dogecoin-cli sendrawtransaction <hex>
dogecoin-cli -testnet sendrawtransaction <hex>

Third-party APIs (legacy testnet & mainnet only):
  BlockCypher, Chain.so, Blockchair, Dogechain.info

Or use a block explorer "Broadcast raw transaction" page.
No connection to this website is required. Keys never leave your browser.`;
