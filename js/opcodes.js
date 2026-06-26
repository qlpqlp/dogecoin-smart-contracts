/**
 * Dogecoin script opcode table (Bitcoin-compatible script language).
 * Reference: https://dogecoincore.com/#opcodes
 */
export const OPCODES = {
  OP_0: 0x00,
  OP_FALSE: 0x00,
  OP_PUSHDATA1: 0x4c,
  OP_PUSHDATA2: 0x4d,
  OP_PUSHDATA4: 0x4e,
  OP_1NEGATE: 0x4f,
  OP_RESERVED: 0x50,
  OP_1: 0x51,
  OP_TRUE: 0x51,
  OP_2: 0x52,
  OP_3: 0x53,
  OP_4: 0x54,
  OP_5: 0x55,
  OP_6: 0x56,
  OP_7: 0x57,
  OP_8: 0x58,
  OP_9: 0x59,
  OP_10: 0x5a,
  OP_11: 0x5b,
  OP_12: 0x5c,
  OP_13: 0x5d,
  OP_14: 0x5e,
  OP_15: 0x5f,
  OP_16: 0x60,
  OP_NOP: 0x61,
  OP_VER: 0x62,
  OP_IF: 0x63,
  OP_NOTIF: 0x64,
  OP_VERIF: 0x65,
  OP_VERNOTIF: 0x66,
  OP_ELSE: 0x67,
  OP_ENDIF: 0x68,
  OP_VERIFY: 0x69,
  OP_RETURN: 0x6a,
  OP_TOALTSTACK: 0x6b,
  OP_FROMALTSTACK: 0x6c,
  OP_2DROP: 0x6d,
  OP_2DUP: 0x6e,
  OP_3DUP: 0x6f,
  OP_2OVER: 0x70,
  OP_2ROT: 0x71,
  OP_2SWAP: 0x72,
  OP_IFDUP: 0x73,
  OP_DEPTH: 0x74,
  OP_DROP: 0x75,
  OP_DUP: 0x76,
  OP_NIP: 0x77,
  OP_OVER: 0x78,
  OP_PICK: 0x79,
  OP_ROLL: 0x7a,
  OP_ROT: 0x7b,
  OP_SWAP: 0x7c,
  OP_TUCK: 0x7d,
  OP_CAT: 0x7e,
  OP_SUBSTR: 0x7f,
  OP_LEFT: 0x80,
  OP_RIGHT: 0x81,
  OP_SIZE: 0x82,
  OP_INVERT: 0x83,
  OP_AND: 0x84,
  OP_OR: 0x85,
  OP_XOR: 0x86,
  OP_EQUAL: 0x87,
  OP_EQUALVERIFY: 0x88,
  OP_RESERVED1: 0x89,
  OP_RESERVED2: 0x8a,
  OP_1ADD: 0x8b,
  OP_1SUB: 0x8c,
  OP_2MUL: 0x8d,
  OP_2DIV: 0x8e,
  OP_NEGATE: 0x8f,
  OP_ABS: 0x90,
  OP_NOT: 0x91,
  OP_0NOTEQUAL: 0x92,
  OP_ADD: 0x93,
  OP_SUB: 0x94,
  OP_MUL: 0x95,
  OP_DIV: 0x96,
  OP_MOD: 0x97,
  OP_LSHIFT: 0x98,
  OP_RSHIFT: 0x99,
  OP_BOOLAND: 0x9a,
  OP_BOOLOR: 0x9b,
  OP_NUMEQUAL: 0x9c,
  OP_NUMEQUALVERIFY: 0x9d,
  OP_NUMNOTEQUAL: 0x9e,
  OP_LESSTHAN: 0x9f,
  OP_GREATERTHAN: 0xa0,
  OP_LESSTHANOREQUAL: 0xa1,
  OP_GREATERTHANOREQUAL: 0xa2,
  OP_MIN: 0xa3,
  OP_MAX: 0xa4,
  OP_WITHIN: 0xa5,
  OP_RIPEMD160: 0xa6,
  OP_SHA1: 0xa7,
  OP_SHA256: 0xa8,
  OP_HASH160: 0xa9,
  OP_HASH256: 0xaa,
  OP_CODESEPARATOR: 0xab,
  OP_CHECKSIG: 0xac,
  OP_CHECKSIGVERIFY: 0xad,
  OP_CHECKMULTISIG: 0xae,
  OP_CHECKMULTISIGVERIFY: 0xaf,
  OP_NOP1: 0xb0,
  OP_CHECKLOCKTIMEVERIFY: 0xb1,
  OP_NOP2: 0xb1,
  OP_CHECKSEQUENCEVERIFY: 0xb2,
  OP_NOP3: 0xb2,
  OP_NOP4: 0xb3,
  OP_NOP5: 0xb4,
  OP_NOP6: 0xb5,
  OP_NOP7: 0xb6,
  OP_NOP8: 0xb7,
  OP_NOP9: 0xb8,
  OP_NOP10: 0xb9,
};

const NAME_TO_CODE = Object.fromEntries(
  Object.entries(OPCODES).map(([name, code]) => [name, code])
);

const CODE_TO_NAME = {};
for (const [name, code] of Object.entries(OPCODES)) {
  if (!CODE_TO_NAME[code] || name.startsWith('OP_') && !name.includes('NOP')) {
    CODE_TO_NAME[code] = name;
  }
}

export const EXPLORER_OPCODES = [
  { name: 'OP_DUP', desc: 'Duplicates the top stack item', category: 'stack' },
  { name: 'OP_HASH160', desc: 'RIPEMD160(SHA256(x)) of top item', category: 'crypto' },
  { name: 'OP_SHA256', desc: 'SHA256 hash of top stack item', category: 'crypto' },
  { name: 'OP_EQUAL', desc: 'True if top two items are equal', category: 'logic' },
  { name: 'OP_EQUALVERIFY', desc: 'Equal + verify or abort', category: 'logic' },
  { name: 'OP_CHECKSIG', desc: 'Verify ECDSA signature against pubkey', category: 'crypto' },
  { name: 'OP_RETURN', desc: 'Mark output unspendable; store data', category: 'data' },
  { name: 'OP_IF', desc: 'Begin conditional branch (top must be true)', category: 'flow' },
  { name: 'OP_ELSE', desc: 'Alternative branch', category: 'flow' },
  { name: 'OP_ENDIF', desc: 'End conditional', category: 'flow' },
  { name: 'OP_CHECKLOCKTIMEVERIFY', desc: 'Require nLockTime reached (BIP65)', category: 'timelock' },
  { name: 'OP_CHECKMULTISIG', desc: 'Verify M-of-N signatures', category: 'crypto' },
  { name: 'OP_ADD', desc: 'Add top two stack numbers', category: 'math' },
  { name: 'OP_SUB', desc: 'Subtract top two stack numbers', category: 'math' },
];

export function hexToBytes(hex) {
  const clean = hex.replace(/\s/g, '').replace(/^0x/i, '');
  if (clean.length % 2 !== 0) throw new Error('Invalid hex length');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return bytes;
}

export function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function encodePushData(data) {
  const bytes = typeof data === 'string' ? hexToBytes(data) : data;
  const len = bytes.length;
  const parts = [];

  if (len < OPCODES.OP_PUSHDATA1) {
    parts.push(len);
  } else if (len <= 0xff) {
    parts.push(OPCODES.OP_PUSHDATA1, len);
  } else if (len <= 0xffff) {
    parts.push(OPCODES.OP_PUSHDATA2, len & 0xff, (len >> 8) & 0xff);
  } else {
    parts.push(
      OPCODES.OP_PUSHDATA4,
      len & 0xff,
      (len >> 8) & 0xff,
      (len >> 16) & 0xff,
      (len >> 24) & 0xff
    );
  }

  for (const b of bytes) parts.push(b);
  return new Uint8Array(parts);
}

export function parseAsmLine(token) {
  if (token.startsWith('OP_')) {
    const code = NAME_TO_CODE[token];
    if (code === undefined) throw new Error(`Unknown opcode: ${token}`);
    return { type: 'opcode', value: code, name: token };
  }
  if (/^-?\d+$/.test(token)) {
    const num = parseInt(token, 10);
    if (num >= 1 && num <= 16) {
      return { type: 'opcode', value: OPCODES[`OP_${num}`], name: `OP_${num}` };
    }
    if (num === 0) {
      return { type: 'opcode', value: OPCODES.OP_0, name: 'OP_0' };
    }
    throw new Error(`Use OP_n for small numbers or push hex data for: ${token}`);
  }
  const hex = token.replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]*$/.test(hex) || hex.length % 2 !== 0) {
    throw new Error(`Invalid push data: ${token}`);
  }
  return { type: 'push', hex };
}

export function asmToScript(asm) {
  const tokens = asm
    .replace(/\n/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const chunks = [];
  for (const token of tokens) {
    const part = parseAsmLine(token);
    if (part.type === 'opcode') {
      chunks.push(new Uint8Array([part.value]));
    } else {
      chunks.push(encodePushData(part.hex));
    }
  }

  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

export function scriptToAsm(scriptBytes) {
  const lines = [];
  let i = 0;
  while (i < scriptBytes.length) {
    const op = scriptBytes[i];
    if (op > 0 && op < OPCODES.OP_PUSHDATA1) {
      const len = op;
      i++;
      const data = scriptBytes.slice(i, i + len);
      lines.push(bytesToHex(data));
      i += len;
      continue;
    }
    if (op === OPCODES.OP_PUSHDATA1) {
      const len = scriptBytes[i + 1];
      i += 2;
      lines.push(bytesToHex(scriptBytes.slice(i, i + len)));
      i += len;
      continue;
    }
    if (op === OPCODES.OP_PUSHDATA2) {
      const len = scriptBytes[i + 1] | (scriptBytes[i + 2] << 8);
      i += 3;
      lines.push(bytesToHex(scriptBytes.slice(i, i + len)));
      i += len;
      continue;
    }
    if (op === OPCODES.OP_PUSHDATA4) {
      const len =
        scriptBytes[i + 1] |
        (scriptBytes[i + 2] << 8) |
        (scriptBytes[i + 3] << 16) |
        (scriptBytes[i + 4] << 24);
      i += 5;
      lines.push(bytesToHex(scriptBytes.slice(i, i + len)));
      i += len;
      continue;
    }
    const name = CODE_TO_NAME[op] || `OP_UNKNOWN_${op.toString(16)}`;
    lines.push(name);
    i++;
  }
  return lines.join(' ');
}

export function pushNumberOpcode(n) {
  if (n === 0) return 'OP_0';
  if (n >= 1 && n <= 16) return `OP_${n}`;
  throw new Error('Use hex push for numbers > 16');
}
