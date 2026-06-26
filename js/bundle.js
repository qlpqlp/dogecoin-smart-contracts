var DogeWizard = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // js/app.js
  var app_exports = {};
  __export(app_exports, {
    init: () => init
  });

  // js/opcodes.js
  var OPCODES = {
    OP_0: 0,
    OP_FALSE: 0,
    OP_PUSHDATA1: 76,
    OP_PUSHDATA2: 77,
    OP_PUSHDATA4: 78,
    OP_1NEGATE: 79,
    OP_RESERVED: 80,
    OP_1: 81,
    OP_TRUE: 81,
    OP_2: 82,
    OP_3: 83,
    OP_4: 84,
    OP_5: 85,
    OP_6: 86,
    OP_7: 87,
    OP_8: 88,
    OP_9: 89,
    OP_10: 90,
    OP_11: 91,
    OP_12: 92,
    OP_13: 93,
    OP_14: 94,
    OP_15: 95,
    OP_16: 96,
    OP_NOP: 97,
    OP_VER: 98,
    OP_IF: 99,
    OP_NOTIF: 100,
    OP_VERIF: 101,
    OP_VERNOTIF: 102,
    OP_ELSE: 103,
    OP_ENDIF: 104,
    OP_VERIFY: 105,
    OP_RETURN: 106,
    OP_TOALTSTACK: 107,
    OP_FROMALTSTACK: 108,
    OP_2DROP: 109,
    OP_2DUP: 110,
    OP_3DUP: 111,
    OP_2OVER: 112,
    OP_2ROT: 113,
    OP_2SWAP: 114,
    OP_IFDUP: 115,
    OP_DEPTH: 116,
    OP_DROP: 117,
    OP_DUP: 118,
    OP_NIP: 119,
    OP_OVER: 120,
    OP_PICK: 121,
    OP_ROLL: 122,
    OP_ROT: 123,
    OP_SWAP: 124,
    OP_TUCK: 125,
    OP_CAT: 126,
    OP_SUBSTR: 127,
    OP_LEFT: 128,
    OP_RIGHT: 129,
    OP_SIZE: 130,
    OP_INVERT: 131,
    OP_AND: 132,
    OP_OR: 133,
    OP_XOR: 134,
    OP_EQUAL: 135,
    OP_EQUALVERIFY: 136,
    OP_RESERVED1: 137,
    OP_RESERVED2: 138,
    OP_1ADD: 139,
    OP_1SUB: 140,
    OP_2MUL: 141,
    OP_2DIV: 142,
    OP_NEGATE: 143,
    OP_ABS: 144,
    OP_NOT: 145,
    OP_0NOTEQUAL: 146,
    OP_ADD: 147,
    OP_SUB: 148,
    OP_MUL: 149,
    OP_DIV: 150,
    OP_MOD: 151,
    OP_LSHIFT: 152,
    OP_RSHIFT: 153,
    OP_BOOLAND: 154,
    OP_BOOLOR: 155,
    OP_NUMEQUAL: 156,
    OP_NUMEQUALVERIFY: 157,
    OP_NUMNOTEQUAL: 158,
    OP_LESSTHAN: 159,
    OP_GREATERTHAN: 160,
    OP_LESSTHANOREQUAL: 161,
    OP_GREATERTHANOREQUAL: 162,
    OP_MIN: 163,
    OP_MAX: 164,
    OP_WITHIN: 165,
    OP_RIPEMD160: 166,
    OP_SHA1: 167,
    OP_SHA256: 168,
    OP_HASH160: 169,
    OP_HASH256: 170,
    OP_CODESEPARATOR: 171,
    OP_CHECKSIG: 172,
    OP_CHECKSIGVERIFY: 173,
    OP_CHECKMULTISIG: 174,
    OP_CHECKMULTISIGVERIFY: 175,
    OP_NOP1: 176,
    OP_CHECKLOCKTIMEVERIFY: 177,
    OP_NOP2: 177,
    OP_CHECKSEQUENCEVERIFY: 178,
    OP_NOP3: 178,
    OP_NOP4: 179,
    OP_NOP5: 180,
    OP_NOP6: 181,
    OP_NOP7: 182,
    OP_NOP8: 183,
    OP_NOP9: 184,
    OP_NOP10: 185
  };
  var NAME_TO_CODE = Object.fromEntries(
    Object.entries(OPCODES).map(([name, code]) => [name, code])
  );
  var CODE_TO_NAME = {};
  for (const [name, code] of Object.entries(OPCODES)) {
    if (!CODE_TO_NAME[code] || name.startsWith("OP_") && !name.includes("NOP")) {
      CODE_TO_NAME[code] = name;
    }
  }
  var EXPLORER_OPCODES = [
    { name: "OP_DUP", desc: "Duplicates the top stack item", category: "stack" },
    { name: "OP_HASH160", desc: "RIPEMD160(SHA256(x)) of top item", category: "crypto" },
    { name: "OP_SHA256", desc: "SHA256 hash of top stack item", category: "crypto" },
    { name: "OP_EQUAL", desc: "True if top two items are equal", category: "logic" },
    { name: "OP_EQUALVERIFY", desc: "Equal + verify or abort", category: "logic" },
    { name: "OP_CHECKSIG", desc: "Verify ECDSA signature against pubkey", category: "crypto" },
    { name: "OP_RETURN", desc: "Mark output unspendable; store data", category: "data" },
    { name: "OP_IF", desc: "Begin conditional branch (top must be true)", category: "flow" },
    { name: "OP_ELSE", desc: "Alternative branch", category: "flow" },
    { name: "OP_ENDIF", desc: "End conditional", category: "flow" },
    { name: "OP_CHECKLOCKTIMEVERIFY", desc: "Require nLockTime reached (BIP65)", category: "timelock" },
    { name: "OP_CHECKMULTISIG", desc: "Verify M-of-N signatures", category: "crypto" },
    { name: "OP_ADD", desc: "Add top two stack numbers", category: "math" },
    { name: "OP_SUB", desc: "Subtract top two stack numbers", category: "math" }
  ];
  function hexToBytes(hex) {
    const clean = hex.replace(/\s/g, "").replace(/^0x/i, "");
    if (clean.length % 2 !== 0) throw new Error("Invalid hex length");
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
    }
    return bytes;
  }
  function bytesToHex(bytes) {
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  function encodePushData(data) {
    const bytes = typeof data === "string" ? hexToBytes(data) : data;
    const len = bytes.length;
    const parts = [];
    if (len < OPCODES.OP_PUSHDATA1) {
      parts.push(len);
    } else if (len <= 255) {
      parts.push(OPCODES.OP_PUSHDATA1, len);
    } else if (len <= 65535) {
      parts.push(OPCODES.OP_PUSHDATA2, len & 255, len >> 8 & 255);
    } else {
      parts.push(
        OPCODES.OP_PUSHDATA4,
        len & 255,
        len >> 8 & 255,
        len >> 16 & 255,
        len >> 24 & 255
      );
    }
    for (const b of bytes) parts.push(b);
    return new Uint8Array(parts);
  }
  function parseAsmLine(token) {
    if (token.startsWith("OP_")) {
      const code = NAME_TO_CODE[token];
      if (code === void 0) throw new Error(`Unknown opcode: ${token}`);
      return { type: "opcode", value: code, name: token };
    }
    if (/^-?\d+$/.test(token)) {
      const num = parseInt(token, 10);
      if (num >= 1 && num <= 16) {
        return { type: "opcode", value: OPCODES[`OP_${num}`], name: `OP_${num}` };
      }
      if (num === 0) {
        return { type: "opcode", value: OPCODES.OP_0, name: "OP_0" };
      }
      throw new Error(`Use OP_n for small numbers or push hex data for: ${token}`);
    }
    const hex = token.replace(/^0x/i, "");
    if (!/^[0-9a-fA-F]*$/.test(hex) || hex.length % 2 !== 0) {
      throw new Error(`Invalid push data: ${token}`);
    }
    return { type: "push", hex };
  }
  function asmToScript(asm) {
    const tokens = asm.replace(/\n/g, " ").split(/\s+/).map((t) => t.trim()).filter(Boolean);
    const chunks = [];
    for (const token of tokens) {
      const part = parseAsmLine(token);
      if (part.type === "opcode") {
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
  function pushNumberOpcode(n) {
    if (n === 0) return "OP_0";
    if (n >= 1 && n <= 16) return `OP_${n}`;
    throw new Error("Use hex push for numbers > 16");
  }

  // js/networks.js
  var NETWORKS = {
    mainnet: {
      id: "mainnet",
      label: "Mainnet",
      shortLabel: "Mainnet",
      icon: "public",
      pubKeyHash: 30,
      scriptHash: 22,
      wif: 158,
      rpcPort: 22555,
      p2pPort: 22556,
      addressHint: "D\u2026 or 9\u2026",
      cliFlag: "",
      isTestnet: false,
      name: "mainnet"
    },
    testnet: {
      id: "testnet",
      label: "Legacy testnet",
      shortLabel: "Legacy testnet",
      icon: "history",
      pubKeyHash: 113,
      scriptHash: 196,
      wif: 241,
      rpcPort: 44555,
      p2pPort: 44555,
      addressHint: "n\u2026 or 2\u2026",
      cliFlag: "-testnet",
      isTestnet: true,
      name: "testnet"
    },
    "testnet-new": {
      id: "testnet-new",
      label: "New testnet",
      shortLabel: "New testnet",
      icon: "new_releases",
      pubKeyHash: 65,
      scriptHash: 66,
      wif: 193,
      rpcPort: 18556,
      p2pPort: 44556,
      addressHint: "New testnet address",
      cliFlag: "-testnet",
      isTestnet: true,
      dogego: true,
      name: "testnet-new"
    }
  };
  var NETWORK_OPTIONS = [
    { value: "testnet-new", label: "New testnet", icon: "new_releases" },
    { value: "testnet", label: "Legacy testnet", icon: "history" },
    { value: "mainnet", label: "Mainnet", icon: "public" }
  ];
  function getNetwork(id) {
    return NETWORKS[id] || NETWORKS.testnet;
  }
  function isMainnet(id) {
    return id === "mainnet";
  }
  function networkReviewLabel(id) {
    const n = getNetwork(id);
    if (n.id === "mainnet") return "Mainnet (real DOGE)";
    return `${n.label} (test coins)`;
  }
  function networkRpcPort(id) {
    return getNetwork(id).rpcPort;
  }
  function networkCliArgs(id) {
    const n = getNetwork(id);
    return n.cliFlag ? ` ${n.cliFlag}` : "";
  }
  var DOGEGO_URL = "https://dogego.org";

  // js/crypto.js
  async function sha256(data) {
    const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return new Uint8Array(hash);
  }
  async function sha256Hex(input) {
    const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
    return bytesToHex(await sha256(bytes));
  }
  async function doubleSha256(data) {
    return sha256(await sha256(data));
  }
  function ripemd160(bytes) {
    const rotl = (x, n) => x << n | x >>> 32 - n;
    const f = (j, x, y, z) => {
      if (j < 16) return x ^ y ^ z;
      if (j < 32) return x & y | ~x & z;
      if (j < 48) return (x | ~y) ^ z;
      if (j < 64) return x & z | y & ~z;
      return x ^ (y | ~z);
    };
    const K1 = [
      0,
      1518500249,
      1859775393,
      2400959708,
      2840853838
    ];
    const K2 = [
      1352829926,
      1548603684,
      1836072691,
      2053994217,
      0
    ];
    const R1 = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      7,
      4,
      13,
      1,
      10,
      6,
      15,
      3,
      12,
      0,
      9,
      5,
      2,
      14,
      11,
      8,
      3,
      10,
      14,
      4,
      9,
      15,
      8,
      1,
      2,
      7,
      0,
      6,
      13,
      11,
      5,
      12,
      1,
      9,
      11,
      10,
      0,
      8,
      12,
      4,
      13,
      3,
      7,
      15,
      14,
      5,
      6,
      2,
      4,
      0,
      5,
      9,
      7,
      12,
      2,
      10,
      14,
      1,
      3,
      8,
      11,
      6,
      15,
      13
    ];
    const R2 = [
      5,
      14,
      7,
      0,
      9,
      2,
      11,
      4,
      13,
      6,
      15,
      8,
      1,
      10,
      3,
      12,
      6,
      11,
      3,
      7,
      0,
      13,
      5,
      10,
      14,
      15,
      8,
      12,
      4,
      9,
      1,
      2,
      15,
      5,
      1,
      3,
      7,
      14,
      6,
      9,
      11,
      8,
      12,
      2,
      10,
      0,
      4,
      13,
      8,
      6,
      4,
      1,
      3,
      11,
      15,
      0,
      5,
      12,
      2,
      13,
      9,
      7,
      10,
      14,
      12,
      15,
      10,
      4,
      1,
      5,
      8,
      7,
      6,
      2,
      13,
      14,
      0,
      3,
      9,
      11
    ];
    const S1 = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8];
    const S2 = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6];
    const msg = new Uint8Array(bytes.length + 9 + 63 >> 6 << 6);
    msg.set(bytes);
    msg[bytes.length] = 128;
    const bitLen = bytes.length * 8;
    msg[msg.length - 8] = bitLen & 255;
    msg[msg.length - 7] = bitLen >> 8 & 255;
    msg[msg.length - 6] = bitLen >> 16 & 255;
    msg[msg.length - 5] = bitLen >> 24 & 255;
    let h0 = 1732584193;
    let h1 = 4023233417;
    let h2 = 2562383102;
    let h3 = 271733878;
    let h4 = 3285377520;
    const w = new Uint32Array(16);
    for (let i = 0; i < msg.length; i += 64) {
      for (let j = 0; j < 16; j++) {
        const o = i + j * 4;
        w[j] = msg[o] | msg[o + 1] << 8 | msg[o + 2] << 16 | msg[o + 3] << 24;
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
        const tl = al + f(j, bl, cl, dl) + w[rl] + kl | 0;
        al = el;
        el = dl;
        dl = rotl(cl, 10);
        cl = bl;
        bl = tl + rotl(tl, sl) | 0;
        const tr = ar + f(79 - j, br, cr, dr) + w[rr] + kr | 0;
        ar = er;
        er = dr;
        dr = rotl(cr, 10);
        cr = br;
        br = tr + rotl(tr, sr) | 0;
      }
      const t = h1 + cl + dr | 0;
      h1 = h2 + dl + er | 0;
      h2 = h3 + el + ar | 0;
      h3 = h4 + al + br | 0;
      h4 = h0 + bl + cr | 0;
      h0 = t;
    }
    const out = new Uint8Array(20);
    const hs = [h0, h1, h2, h3, h4];
    for (let i = 0; i < 5; i++) {
      out[i * 4] = hs[i] & 255;
      out[i * 4 + 1] = hs[i] >> 8 & 255;
      out[i * 4 + 2] = hs[i] >> 16 & 255;
      out[i * 4 + 3] = hs[i] >> 24 & 255;
    }
    return out;
  }
  async function hash160(data) {
    const sha = await sha256(data);
    return ripemd160(sha);
  }
  async function hash160Hex(input) {
    const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
    return bytesToHex(await hash160(bytes));
  }
  var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  function base58Encode(bytes) {
    let zeros = 0;
    while (zeros < bytes.length && bytes[zeros] === 0) zeros++;
    const digits = [0];
    for (let i = zeros; i < bytes.length; i++) {
      let carry = bytes[i];
      for (let j = 0; j < digits.length; j++) {
        carry += digits[j] << 8;
        digits[j] = carry % 58;
        carry = carry / 58 | 0;
      }
      while (carry > 0) {
        digits.push(carry % 58);
        carry = carry / 58 | 0;
      }
    }
    let str = "1".repeat(zeros);
    for (let i = digits.length - 1; i >= 0; i--) {
      str += ALPHABET[digits[i]];
    }
    return str;
  }
  async function p2shAddressFromScript(scriptHex, network = "mainnet") {
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
  function textToHex(text) {
    return bytesToHex(new TextEncoder().encode(text));
  }
  function randomSecret(bytes = 16) {
    const arr = new Uint8Array(bytes);
    crypto.getRandomValues(arr);
    return bytesToHex(arr);
  }
  async function fileSha256(file) {
    const buffer = await file.arrayBuffer();
    return bytesToHex(await sha256(new Uint8Array(buffer)));
  }
  function locktimeFromDate(dateStr, type = "unix") {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) throw new Error("Invalid date");
    if (type === "unix") return Math.floor(d.getTime() / 1e3);
    throw new Error("Block height lock requires manual block estimate");
  }

  // node_modules/@noble/secp256k1/index.js
  var secp256k1_CURVE = Object.freeze({
    p: 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn,
    n: 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
    h: 1n,
    a: 0n,
    b: 7n,
    Gx: 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,
    Gy: 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n
  });
  var { p: P, n: N, Gx, Gy, b: _b } = secp256k1_CURVE;
  var L = 32;
  var L2 = 64;
  var lengths = {
    publicKey: L + 1,
    publicKeyUncompressed: L2 + 1,
    signature: L2,
    // 48-byte keygen seed floor: 384 bits exceeds FIPS 186-5 Table A.2's
    // 352-bit recommendation for 256-bit prime curves.
    seed: L + L / 2
  };
  var err = (message = "", E = Error) => {
    const e = new E(message);
    const { captureStackTrace } = Error;
    if (typeof captureStackTrace === "function")
      captureStackTrace(e, err);
    throw e;
  };
  var isBytes = (a) => a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && a.BYTES_PER_ELEMENT === 1;
  var abytes = (value, length, title = "") => {
    const bytes = isBytes(value);
    const len = value?.length;
    const needsLen = length !== void 0;
    if (!bytes || needsLen && len !== length) {
      const prefix = title && `"${title}" `;
      const ofLen = needsLen ? ` of length ${length}` : "";
      const got = bytes ? `length=${len}` : `type=${typeof value}`;
      const msg = prefix + "expected Uint8Array" + ofLen + ", got " + got;
      return bytes ? err(msg, RangeError) : err(msg, TypeError);
    }
    return value;
  };
  var u8n = (len) => new Uint8Array(len);
  var padh = (n, pad) => n.toString(16).padStart(pad, "0");
  var bytesToHex2 = (b) => {
    let hex = "";
    for (const e of abytes(b))
      hex += padh(e, 2);
    return hex;
  };
  var C = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  var _ch = (ch) => ch >= C._0 && ch <= C._9 ? ch - C._0 : ch >= C.A && ch <= C.F ? ch - (C.A - 10) : ch >= C.a && ch <= C.f ? ch - (C.a - 10) : void 0;
  var hexToBytes2 = (hex) => {
    const e = "hex invalid";
    if (typeof hex !== "string")
      return err(e);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
      return err(e);
    const array = u8n(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = _ch(hex.charCodeAt(hi));
      const n2 = _ch(hex.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0)
        return err(e);
      array[ai] = n1 * 16 + n2;
    }
    return array;
  };
  var subtle = () => globalThis?.crypto?.subtle ?? err("crypto.subtle must be defined, consider polyfill");
  var concatBytes = (...arrs) => {
    let len = 0;
    for (const a of arrs)
      len += abytes(a).length;
    const r = u8n(len);
    let pad = 0;
    for (const a of arrs)
      r.set(a, pad), pad += a.length;
    return r;
  };
  var randomBytes = (len = L) => (globalThis?.crypto).getRandomValues(u8n(len));
  var big = BigInt;
  var arange = (n, min, max, msg = "bad number: out of range") => {
    if (typeof n !== "bigint")
      return err(msg, TypeError);
    if (min <= n && n < max)
      return n;
    return err(msg, RangeError);
  };
  var M = (a, b = P) => {
    const r = a % b;
    return r >= 0n ? r : b + r;
  };
  var modN = (a) => M(a, N);
  var invert = (num, md) => {
    if (num === 0n || md <= 0n)
      err("no inverse n=" + num + " mod=" + md);
    let a = M(num, md), b = md, x = 0n, y = 1n, u = 1n, v = 0n;
    while (a !== 0n) {
      const q = b / a, r = b % a;
      const m = x - u * q, n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    return b === 1n ? M(x, md) : err("no inverse");
  };
  var callHash = (name) => {
    const fn = hashes[name];
    if (typeof fn !== "function")
      err("hashes." + name + " not set");
    return fn;
  };
  var gh = (name, a, b) => abytes(callHash(name)(a, b), L, "digest");
  var gha = (name, a, b) => Promise.resolve(callHash(name)(a, b)).then((r) => abytes(r, L, "digest"));
  var apoint = (p) => p instanceof Point ? p : err("Point expected");
  var koblitz = (x) => M(M(x * x) * x + _b);
  var FpIsValid = (n) => arange(n, 0n, P);
  var FpIsValidNot0 = (n) => arange(n, 1n, P);
  var FnIsValidNot0 = (n) => arange(n, 1n, N);
  var isEven = (y) => !(y & 1n);
  var u8of = (n) => Uint8Array.of(n);
  var getPrefix = (y) => u8of(isEven(y) ? 2 : 3);
  var lift_x = (x) => {
    const c = koblitz(FpIsValidNot0(x));
    let r = 1n;
    for (let num = c, e = (P + 1n) / 4n; e > 0n; e >>= 1n) {
      if (e & 1n)
        r = r * num % P;
      num = num * num % P;
    }
    if (M(r * r) !== c)
      err("sqrt invalid");
    return isEven(r) ? r : M(-r);
  };
  var Point = class _Point {
    static BASE;
    static ZERO;
    X;
    Y;
    Z;
    constructor(X, Y, Z) {
      this.X = FpIsValid(X);
      this.Y = FpIsValidNot0(Y);
      this.Z = FpIsValid(Z);
      Object.freeze(this);
    }
    /** Returns the shared curve metadata object by reference.
     * It is readonly only at type level, and mutating it won't retarget arithmetic,
     * which already uses module-load snapshots. */
    static CURVE() {
      return secp256k1_CURVE;
    }
    /** Create 3d xyz point from 2d xy. (0, 0) => (0, 1, 0), not (0, 0, 1) */
    static fromAffine(ap) {
      const { x, y } = ap;
      return x === 0n && y === 0n ? I : new _Point(x, y, 1n);
    }
    /** Convert Uint8Array or hex string to Point. */
    static fromBytes(bytes) {
      abytes(bytes);
      const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
      let p = void 0;
      const length = bytes.length;
      const head = bytes[0];
      const tail = bytes.subarray(1);
      const x = sliceBytesNumBE(tail, 0, L);
      if (length === comp && (head === 2 || head === 3)) {
        let y = lift_x(x);
        if (head === 3)
          y = M(-y);
        p = new _Point(x, y, 1n);
      }
      if (length === uncomp && head === 4)
        p = new _Point(x, sliceBytesNumBE(tail, L, L2), 1n);
      return p ? p.assertValidity() : err("bad point: not on curve");
    }
    static fromHex(hex) {
      return _Point.fromBytes(hexToBytes2(hex));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /** Equality check: compare points P&Q. */
    equals(other) {
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = apoint(other);
      const X1Z2 = M(X1 * Z2);
      const X2Z1 = M(X2 * Z1);
      const Y1Z2 = M(Y1 * Z2);
      const Y2Z1 = M(Y2 * Z1);
      return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    is0() {
      return this.equals(I);
    }
    /** Flip point over y coordinate. */
    negate() {
      return new _Point(this.X, M(-this.Y), this.Z);
    }
    /** Point doubling: P+P, complete formula. */
    double() {
      return this.add(this);
    }
    /**
     * Point addition: P+Q, complete, exception-free formula
     * (Renes-Costello-Batina, algo 1 of [2015/1060](https://eprint.iacr.org/2015/1060)).
     * Cost: `12M + 0S + 3*a + 3*b3 + 23add`.
     */
    // prettier-ignore
    add(other) {
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = apoint(other);
      const a = 0n;
      const b = _b;
      let X3 = 0n, Y3 = 0n, Z3 = 0n;
      const b3 = M(b * 3n);
      let t0 = M(X1 * X2), t1 = M(Y1 * Y2), t2 = M(Z1 * Z2), t3 = M(X1 + Y1);
      let t4 = M(X2 + Y2);
      t3 = M(t3 * t4);
      t4 = M(t0 + t1);
      t3 = M(t3 - t4);
      t4 = M(X1 + Z1);
      let t5 = M(X2 + Z2);
      t4 = M(t4 * t5);
      t5 = M(t0 + t2);
      t4 = M(t4 - t5);
      t5 = M(Y1 + Z1);
      X3 = M(Y2 + Z2);
      t5 = M(t5 * X3);
      X3 = M(t1 + t2);
      t5 = M(t5 - X3);
      Z3 = M(a * t4);
      X3 = M(b3 * t2);
      Z3 = M(X3 + Z3);
      X3 = M(t1 - Z3);
      Z3 = M(t1 + Z3);
      Y3 = M(X3 * Z3);
      t1 = M(t0 + t0);
      t1 = M(t1 + t0);
      t2 = M(a * t2);
      t4 = M(b3 * t4);
      t1 = M(t1 + t2);
      t2 = M(t0 - t2);
      t2 = M(a * t2);
      t4 = M(t4 + t2);
      t0 = M(t1 * t4);
      Y3 = M(Y3 + t0);
      t0 = M(t5 * t4);
      X3 = M(t3 * X3);
      X3 = M(X3 - t0);
      t0 = M(t3 * t1);
      Z3 = M(t5 * Z3);
      Z3 = M(Z3 + t0);
      return new _Point(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(apoint(other).negate());
    }
    /**
     * Point-by-scalar multiplication. Scalar must be in range 1 <= n < CURVE.n.
     * Uses {@link wNAF} for base point.
     * Uses fake point to mitigate leakage shape in JS, not as a hard constant-time guarantee.
     * @param n scalar by which point is multiplied
     * @param safe safe mode guards against timing attacks; unsafe mode is faster
     */
    multiply(n, safe = true) {
      if (!safe && n === 0n)
        return I;
      FnIsValidNot0(n);
      if (n === 1n)
        return this;
      if (this.equals(G))
        return wNAF(n).p;
      let p = I;
      let f = G;
      for (let d = this; n > 0n; d = d.double(), n >>= 1n) {
        if (n & 1n)
          p = p.add(d);
        else if (safe)
          f = f.add(d);
      }
      return p;
    }
    multiplyUnsafe(scalar) {
      return this.multiply(scalar, false);
    }
    /** Convert point to 2d xy affine point. (X, Y, Z) ∋ (x=X/Z, y=Y/Z) */
    toAffine() {
      const { X: x, Y: y, Z: z } = this;
      if (this.equals(I))
        return { x: 0n, y: 0n };
      if (z === 1n)
        return { x, y };
      const iz = invert(z, P);
      if (M(z * iz) !== 1n)
        err("inverse invalid");
      return { x: M(x * iz), y: M(y * iz) };
    }
    /** Checks if the point is valid and on-curve. */
    assertValidity() {
      const { x, y } = this.toAffine();
      FpIsValidNot0(x);
      FpIsValidNot0(y);
      return M(y * y) === koblitz(x) ? this : err("bad point: not on curve");
    }
    /** Converts point to 33/65-byte Uint8Array. */
    toBytes(isCompressed = true) {
      const { x, y } = this.assertValidity().toAffine();
      const x32b = numTo32b(x);
      if (isCompressed)
        return concatBytes(getPrefix(y), x32b);
      return concatBytes(u8of(4), x32b, numTo32b(y));
    }
    toHex(isCompressed) {
      return bytesToHex2(this.toBytes(isCompressed));
    }
  };
  var G = new Point(Gx, Gy, 1n);
  var I = new Point(0n, 1n, 0n);
  Point.BASE = G;
  Point.ZERO = I;
  var bytesToNumBE = (b) => big("0x" + (bytesToHex2(b) || "0"));
  var sliceBytesNumBE = (b, from, to) => bytesToNumBE(b.subarray(from, to));
  var B256 = 2n ** 256n;
  var numTo32b = (num) => hexToBytes2(padh(arange(num, 0n, B256), L2));
  var secretKeyToScalar = (secretKey) => {
    const num = bytesToNumBE(abytes(secretKey, L, "secret key"));
    return arange(num, 1n, N, "invalid secret key: outside of range");
  };
  var highS = (n) => n > N >> 1n;
  var getPublicKey = (privKey, isCompressed = true) => {
    return G.multiply(secretKeyToScalar(privKey)).toBytes(isCompressed);
  };
  var isValidSecretKey = (secretKey) => {
    try {
      return !!secretKeyToScalar(secretKey);
    } catch (error) {
      return false;
    }
  };
  var isValidPublicKey = (publicKey, isCompressed) => {
    const { publicKey: comp, publicKeyUncompressed } = lengths;
    try {
      const l = publicKey.length;
      if (isCompressed === true && l !== comp)
        return false;
      if (isCompressed === false && l !== publicKeyUncompressed)
        return false;
      return !!Point.fromBytes(publicKey);
    } catch (error) {
      return false;
    }
  };
  var assertRecoveryBit = (recovery) => [0, 1, 2, 3].includes(recovery) ? recovery : err("invalid recovery id");
  var assertSigFormat = (format) => {
    if (format === SIG_DER)
      err('Signature format "der" is not supported: switch to noble-curves');
    if (format != null && format !== SIG_COMPACT && format !== SIG_RECOVERED)
      err("Signature format must be one of: compact, recovered, der");
  };
  var assertSigLength = (sig, format = SIG_COMPACT) => {
    assertSigFormat(format);
    const len = lengths.signature + Number(format === SIG_RECOVERED);
    if (sig.length !== len)
      err(`Signature format "${format}" expects Uint8Array with length ${len}`);
  };
  var Signature = class _Signature {
    r;
    s;
    recovery;
    constructor(r, s, recovery) {
      this.r = FnIsValidNot0(r);
      this.s = FnIsValidNot0(s);
      if (recovery != null)
        this.recovery = assertRecoveryBit(recovery);
      Object.freeze(this);
    }
    static fromBytes(b, format = SIG_COMPACT) {
      assertSigLength(b, format);
      let rec;
      if (format === SIG_RECOVERED) {
        rec = b[0];
        b = b.subarray(1);
      }
      const r = sliceBytesNumBE(b, 0, L);
      const s = sliceBytesNumBE(b, L, L2);
      return new _Signature(r, s, rec);
    }
    addRecoveryBit(bit) {
      return new _Signature(this.r, this.s, bit);
    }
    hasHighS() {
      return highS(this.s);
    }
    toBytes(format = SIG_COMPACT) {
      assertSigFormat(format);
      const { r, s, recovery } = this;
      const res = concatBytes(numTo32b(r), numTo32b(s));
      if (format === SIG_RECOVERED) {
        return concatBytes(u8of(assertRecoveryBit(recovery)), res);
      }
      return res;
    }
  };
  var bits2int = (bytes) => {
    if (bytes.length > 8192)
      err("input is too large");
    const delta = bytes.length * 8 - 256;
    const num = bytesToNumBE(bytes);
    return delta > 0 ? num >> big(delta) : num;
  };
  var bits2int_modN = (bytes) => modN(bits2int(abytes(bytes)));
  var SIG_COMPACT = "compact";
  var SIG_RECOVERED = "recovered";
  var SIG_DER = "der";
  var _sha = "SHA-256";
  var hashes = {
    hmacSha256Async: async (key, message) => {
      const s = subtle();
      const name = "HMAC";
      const k = await s.importKey("raw", key, { name, hash: { name: _sha } }, false, ["sign"]);
      return u8n(await s.sign(name, k, message));
    },
    hmacSha256: void 0,
    sha256Async: async (msg) => u8n(await subtle().digest(_sha, msg)),
    sha256: void 0
  };
  var prepMsg = (msg, opts, async_) => {
    const message = abytes(msg, void 0, "message");
    if (!opts.prehash)
      return message;
    return async_ ? gha("sha256Async", message) : gh("sha256", message);
  };
  var NULL = /* @__PURE__ */ u8n(0);
  var byte0 = /* @__PURE__ */ u8of(0);
  var byte1 = /* @__PURE__ */ u8of(1);
  var _maxDrbgIters = 1e3;
  var _drbgErr = "drbg: tried max amount of iterations";
  var hmacDrbg = (seed, pred) => {
    let v = u8n(L);
    let k = u8n(L);
    let i = 0;
    const reset = () => {
      v.fill(1);
      k.fill(0);
    };
    const h = (...b) => gh("hmacSha256", k, concatBytes(v, ...b));
    const reseed = (seed2 = NULL) => {
      k = h(byte0, seed2);
      v = h();
      if (seed2.length === 0)
        return;
      k = h(byte1, seed2);
      v = h();
    };
    const gen = () => {
      if (i++ >= _maxDrbgIters)
        err(_drbgErr);
      v = h();
      return v;
    };
    reset();
    reseed(seed);
    let res = void 0;
    while (!(res = pred(gen())))
      reseed();
    reset();
    return res;
  };
  var _sign = (messageHash, secretKey, opts, hmacDrbg2) => {
    let { lowS, extraEntropy } = opts;
    const int2octets = numTo32b;
    const h1i = bits2int_modN(messageHash);
    const h1o = int2octets(h1i);
    const d = secretKeyToScalar(secretKey);
    const seedArgs = [int2octets(d), h1o];
    if (extraEntropy != null && extraEntropy !== false) {
      const e = extraEntropy === true ? randomBytes(L) : extraEntropy;
      seedArgs.push(abytes(e, void 0, "extraEntropy"));
    }
    const seed = concatBytes(...seedArgs);
    const m = h1i;
    const k2sig = (kBytes) => {
      const k = bits2int(kBytes);
      if (!(1n <= k && k < N))
        return;
      const ik = invert(k, N);
      const q = G.multiply(k).toAffine();
      const r = modN(q.x);
      if (r === 0n)
        return;
      const s = modN(ik * modN(m + r * d));
      if (s === 0n)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & 1n);
      let normS = s;
      if (lowS && highS(s)) {
        normS = modN(-s);
        recovery ^= 1;
      }
      const sig = new Signature(r, normS, recovery);
      return sig.toBytes(opts.format);
    };
    return hmacDrbg2(seed, k2sig);
  };
  var setDefaults = (opts) => {
    return {
      lowS: opts.lowS ?? true,
      prehash: opts.prehash ?? true,
      format: opts.format ?? SIG_COMPACT,
      extraEntropy: opts.extraEntropy ?? false
    };
  };
  var sign = (message, secretKey, opts = {}) => {
    opts = setDefaults(opts);
    assertSigFormat(opts.format);
    const msg = prepMsg(message, opts, false);
    return _sign(msg, secretKey, opts, hmacDrbg);
  };
  var randomSecretKey = (seed) => {
    seed = seed === void 0 ? randomBytes(lengths.seed) : seed;
    abytes(seed);
    if (seed.length < lengths.seed || seed.length > 1024)
      return err("expected 48-1024b", RangeError);
    const num = M(bytesToNumBE(seed), N - 1n);
    return numTo32b(num + 1n);
  };
  var utils = /* @__PURE__ */ Object.freeze({
    isValidSecretKey,
    isValidPublicKey,
    randomSecretKey
    // preserve the optional seeded call
  });
  var W = 8;
  var scalarBits = 256;
  var pwindows = Math.ceil(scalarBits / W) + 1;
  var pwindowSize = 2 ** (W - 1);
  var precompute = () => {
    const points = [];
    let p = G;
    let b = p;
    for (let w = 0; w < pwindows; w++) {
      b = p;
      points.push(b);
      for (let i = 1; i < pwindowSize; i++) {
        b = b.add(p);
        points.push(b);
      }
      p = b.double();
    }
    return points;
  };
  var Gpows = void 0;
  var ctneg = (cnd, p) => {
    const n = p.negate();
    return cnd ? n : p;
  };
  var wNAF = (n) => {
    const comp = Gpows || (Gpows = precompute());
    let p = I;
    let f = G;
    const pow_2_w = 2 ** W;
    const maxNum = pow_2_w;
    const mask = big(pow_2_w - 1);
    const shiftBy = big(W);
    for (let w = 0; w < pwindows; w++) {
      let wbits = Number(n & mask);
      n >>= shiftBy;
      if (wbits > pwindowSize) {
        wbits -= maxNum;
        n += 1n;
      }
      const off = w * pwindowSize;
      const offF = off;
      const offP = off + Math.abs(wbits) - 1;
      const isEven2 = w % 2 !== 0;
      const isNeg = wbits < 0;
      if (wbits === 0) {
        f = f.add(ctneg(isEven2, comp[offF]));
      } else {
        p = p.add(ctneg(isNeg, comp[offP]));
      }
    }
    if (n !== 0n)
      err("invalid wnaf");
    return { p, f };
  };

  // js/tx.js
  var COIN = 100000000n;
  var SIGHASH_ALL = 1;
  var B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  function writeU32LE(n) {
    const b = new Uint8Array(4);
    b[0] = n & 255;
    b[1] = n >> 8 & 255;
    b[2] = n >> 16 & 255;
    b[3] = n >> 24 & 255;
    return b;
  }
  function writeU64LE(n) {
    const b = new Uint8Array(8);
    const v = BigInt(n);
    for (let i = 0; i < 8; i++) b[i] = Number(v >> BigInt(i * 8) & 0xffn);
    return b;
  }
  function writeVarInt(n) {
    if (n < 253) return new Uint8Array([n]);
    if (n <= 65535) {
      const b2 = new Uint8Array(3);
      b2[0] = 253;
      b2[1] = n & 255;
      b2[2] = n >> 8 & 255;
      return b2;
    }
    const b = new Uint8Array(5);
    b[0] = 254;
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
  function dogeToKoinu(doge) {
    const parts = String(doge).split(".");
    const whole = BigInt(parts[0] || "0");
    const frac = (parts[1] || "").padEnd(8, "0").slice(0, 8);
    return whole * COIN + BigInt(frac || "0");
  }
  function koinuToDoge(koinu) {
    return (Number(koinu) / 1e8).toFixed(8);
  }
  function base58Decode(str) {
    const bytes = [0];
    for (const ch of str) {
      const val = B58.indexOf(ch);
      if (val < 0) throw new Error("Invalid base58");
      let carry = val;
      for (let j = 0; j < bytes.length; j++) {
        carry += bytes[j] * 58;
        bytes[j] = carry & 255;
        carry >>= 8;
      }
      while (carry > 0) {
        bytes.push(carry & 255);
        carry >>= 8;
      }
    }
    let zeros = 0;
    for (const ch of str) {
      if (ch === "1") zeros++;
      else break;
    }
    const decoded = new Uint8Array(zeros + bytes.length);
    for (let i = 0; i < bytes.length; i++) decoded[zeros + bytes.length - 1 - i] = bytes[i];
    return decoded;
  }
  async function decodeWIF(wif, network = "testnet") {
    const raw = base58Decode(wif.trim());
    if (raw.length < 37) throw new Error("Invalid WIF");
    const payload = raw.slice(0, -4);
    const checksum = raw.slice(-4);
    const check = (await doubleSha256(payload)).slice(0, 4);
    if (bytesToHex(check) !== bytesToHex(checksum)) throw new Error("WIF checksum failed");
    const net = getNetwork(network);
    if (payload[0] !== net.wif) throw new Error(`WIF not valid for ${net.label}`);
    const compressed = payload.length === 34 && payload[33] === 1;
    return { privateKey: payload.slice(1, 33), compressed };
  }
  async function parsePrivateKey(input, network = "testnet") {
    const s = input.trim();
    if (/^[5KL9c][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(s) || /^[9c][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(s)) {
      return decodeWIF(s, network);
    }
    const hex = s.replace(/^0x/i, "");
    if (!/^[0-9a-fA-F]{64}$/.test(hex)) throw new Error("Enter WIF or 64-char private key hex");
    return { privateKey: hexToBytes(hex), compressed: true };
  }
  async function privateKeyToPubkey(privateKey, compressed = true) {
    return getPublicKey(privateKey, compressed);
  }
  function generateKeypair() {
    const privateKey = utils.randomSecretKey();
    return { privateKey, compressed: true };
  }
  async function encodeWIF(privateKey, network = "testnet", compressed = true) {
    const net = getNetwork(network);
    const payload = compressed ? concat(new Uint8Array([net.wif]), privateKey, new Uint8Array([1])) : concat(new Uint8Array([net.wif]), privateKey);
    const checksum = (await doubleSha256(payload)).slice(0, 4);
    return base58Encode(concat(payload, checksum));
  }
  async function addressToScriptPubKey(address, network = "testnet") {
    const raw = base58Decode(address);
    if (raw.length !== 25) throw new Error("Invalid address");
    const version = raw[0];
    const h = raw.slice(1, 21);
    const net = getNetwork(network);
    if (version === net.pubKeyHash) {
      return concat(new Uint8Array([118, 169, 20]), h, new Uint8Array([136, 172]));
    }
    if (version === net.scriptHash) {
      return concat(new Uint8Array([169, 20]), h, new Uint8Array([135]));
    }
    throw new Error("Address version mismatch for network");
  }
  function opReturnScript(dataHex) {
    return concat(new Uint8Array([106]), encodePushData(hexToBytes(dataHex)));
  }
  function serializeOutput(valueKoinu, scriptPubKey) {
    return concat(writeU64LE(valueKoinu), writeVarInt(scriptPubKey.length), scriptPubKey);
  }
  function serializeInput(txid, vout, scriptSig, sequence = 4294967295) {
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
      if (t[0] & 128) t = concat(new Uint8Array([0]), t);
      return t;
    };
    const rT = trim(r);
    const sT = trim(s);
    const body = concat(
      new Uint8Array([2, rT.length]),
      rT,
      new Uint8Array([2, sT.length]),
      sT
    );
    return concat(new Uint8Array([48, body.length]), body, new Uint8Array([SIGHASH_ALL]));
  }
  async function signInput(hash, privateKey) {
    const sig = sign(hash, privateKey, { lowS: true, der: false });
    return derEncodeSignature(sig);
  }
  function pushBytes(bytes) {
    return encodePushData(bytes);
  }
  function redeemNeedsSig(redeemScript) {
    const hex = bytesToHex(redeemScript);
    return hex.includes("ac");
  }
  async function buildSignedTransaction(params) {
    const network = params.network || "testnet";
    const version = 1;
    const locktime = params.locktime || 0;
    const parsedInputs = [];
    for (const inp of params.inputs) {
      const value = typeof inp.value === "bigint" ? inp.value : dogeToKoinu(inp.valueDoge ?? inp.value);
      let scriptPubKey = inp.scriptPubKey ? hexToBytes(inp.scriptPubKey) : null;
      if (!scriptPubKey && inp.prevAddress) {
        scriptPubKey = await addressToScriptPubKey(inp.prevAddress, network);
      }
      const redeemScript = inp.redeemScript ? typeof inp.redeemScript === "string" ? hexToBytes(inp.redeemScript) : inp.redeemScript : null;
      if (redeemScript && !scriptPubKey) {
        const h = await hash160(redeemScript);
        scriptPubKey = concat(new Uint8Array([169, 20]), h, new Uint8Array([135]));
      }
      if (!scriptPubKey) throw new Error("Input needs prevAddress or scriptPubKey");
      let privateKey = null;
      let pubkey = null;
      if (inp.privateKey) {
        const key = await parsePrivateKey(inp.privateKey, network);
        privateKey = key.privateKey;
        pubkey = await privateKeyToPubkey(privateKey, key.compressed);
      }
      parsedInputs.push({
        txid: inp.txid.replace(/\s/g, ""),
        vout: parseInt(inp.vout, 10),
        value,
        scriptPubKey,
        privateKey,
        pubkey,
        sequence: inp.sequence ?? (locktime > 0 && redeemScript ? 4294967294 : 4294967295),
        redeemScript,
        preimage: inp.preimage || inp.preimageHex ? inp.preimage ? new TextEncoder().encode(inp.preimage) : hexToBytes(inp.preimageHex) : null
      });
    }
    const outputs = [];
    let totalOut = 0n;
    for (const out of params.outputs) {
      if (out.type === "op_return" || out.dataHex) {
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
        throw new Error("Output needs address, scriptHex, or dataHex");
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
      if (!params.changeAddress) throw new Error("Provide change address for leftover DOGE");
      outputs.push({
        value: change,
        scriptPubKey: await addressToScriptPubKey(params.changeAddress, network)
      });
    }
    const inputsMeta = parsedInputs.map((i) => ({
      txid: i.txid,
      vout: i.vout,
      sequence: i.sequence
    }));
    const scriptSigs = [];
    for (let idx = 0; idx < parsedInputs.length; idx++) {
      const inp = parsedInputs[idx];
      if (inp.redeemScript) {
        const needsSig = redeemNeedsSig(inp.redeemScript);
        const stackItems = [];
        if (needsSig) {
          if (!inp.privateKey || !inp.pubkey) throw new Error("This redeem script requires a private key to sign");
          const hash2 = await signatureHash(version, inputsMeta, outputs, locktime, idx, inp.redeemScript);
          stackItems.push(await signInput(hash2, inp.privateKey));
          stackItems.push(inp.pubkey);
        }
        if (inp.preimage) stackItems.push(inp.preimage);
        stackItems.push(inp.redeemScript);
        scriptSigs.push(concat(...stackItems.map(pushBytes)));
      } else {
        if (!inp.privateKey) throw new Error("P2PKH input requires private key (WIF)");
        const hash2 = await signatureHash(version, inputsMeta, outputs, locktime, idx, inp.scriptPubKey);
        const sig = await signInput(hash2, inp.privateKey);
        scriptSigs.push(concat(pushBytes(sig), pushBytes(inp.pubkey)));
      }
    }
    const parts = [
      writeU32LE(version),
      writeVarInt(parsedInputs.length),
      ...parsedInputs.map(
        (inp, i) => serializeInput(inp.txid, inp.vout, scriptSigs[i], inp.sequence)
      ),
      writeVarInt(outputs.length),
      ...outputs.map((o) => serializeOutput(o.value, o.scriptPubKey)),
      writeU32LE(locktime)
    ];
    const rawBytes = concat(...parts);
    const hash = await doubleSha256(rawBytes);
    return {
      rawHex: bytesToHex(rawBytes),
      txid: bytesToHex(reverse32(hash)),
      fee: koinuToDoge(fee),
      change: change > 0n ? koinuToDoge(change) : "0",
      sizeBytes: rawBytes.length
    };
  }
  async function buildOpReturnTx(opts) {
    const dataHex = opts.dataHex;
    return buildSignedTransaction({
      network: opts.network,
      inputs: [{
        txid: opts.utxo.txid,
        vout: opts.utxo.vout,
        valueDoge: opts.utxo.valueDoge,
        prevAddress: opts.utxo.address,
        privateKey: opts.privateKey
      }],
      outputs: [{ type: "op_return", dataHex }],
      feeDoge: opts.feeDoge ?? 0.01,
      changeAddress: opts.changeAddress,
      locktime: opts.locktime
    });
  }
  async function buildFundContractTx(opts) {
    return buildSignedTransaction({
      network: opts.network,
      inputs: [{
        txid: opts.utxo.txid,
        vout: opts.utxo.vout,
        valueDoge: opts.utxo.valueDoge,
        prevAddress: opts.utxo.address,
        privateKey: opts.privateKey
      }],
      outputs: [{ address: opts.toAddress, valueDoge: opts.amountDoge }],
      feeDoge: opts.feeDoge ?? 0.01,
      changeAddress: opts.changeAddress,
      locktime: opts.locktime
    });
  }
  async function buildClaimTx(opts) {
    const spendDoge = opts.spendDoge ?? Number(opts.utxo.valueDoge) - Number(opts.feeDoge ?? 0.01);
    const locktime = opts.locktime || 0;
    return buildSignedTransaction({
      network: opts.network,
      locktime,
      inputs: [{
        txid: opts.utxo.txid,
        vout: opts.utxo.vout,
        valueDoge: opts.utxo.valueDoge,
        redeemScript: opts.redeemScriptHex,
        privateKey: opts.privateKey || void 0,
        preimage: opts.preimage,
        preimageHex: opts.preimageHex,
        sequence: locktime > 0 ? 4294967294 : 4294967295
      }],
      outputs: [{ address: opts.toAddress, valueDoge: spendDoge }],
      feeDoge: opts.feeDoge ?? 0.01,
      changeAddress: opts.changeAddress
    });
  }
  async function buildCltvSweepTx(opts) {
    return buildClaimTx({
      ...opts,
      locktime: opts.locktime,
      privateKey: opts.privateKey || opts.checkWif
    });
  }

  // js/signer-resolve.js
  var ADDR_RE = /^[1-9A-HJ-NP-Za-km-z]{26,35}$/;
  function isDogecoinAddress(input) {
    const s = (input || "").trim();
    return ADDR_RE.test(s);
  }
  function isHexPubkey(input) {
    const s = (input || "").replace(/\s/g, "").replace(/^0x/i, "");
    if (!/^[0-9a-fA-F]+$/.test(s) || s.length % 2 !== 0) return false;
    if (s.length === 66 && (s.startsWith("02") || s.startsWith("03"))) return true;
    if (s.length === 130 && s.startsWith("04")) return true;
    return false;
  }
  async function decodeAddressPayload(address, network) {
    const raw = base58Decode(address.trim());
    if (raw.length !== 25) throw new Error("Invalid Dogecoin address length");
    const payload = raw.slice(0, 21);
    const checksum = raw.slice(21);
    const check = (await doubleSha256(payload)).slice(0, 4);
    if (bytesToHex(check) !== bytesToHex(checksum)) {
      throw new Error("Invalid Dogecoin address (checksum failed)");
    }
    const version = payload[0];
    const hash1602 = bytesToHex(payload.slice(1));
    const net = getNetwork(network);
    if (version === net.pubKeyHash) {
      return { hash160: hash1602, type: "p2pkh", address: address.trim() };
    }
    if (version === net.scriptHash) {
      return { hash160: hash1602, type: "p2sh", address: address.trim() };
    }
    const hint = net.addressHint;
    throw new Error(`Address does not match ${net.label}. Expected ${hint}.`);
  }
  async function resolveChecksigAsm(input, network) {
    const s = (input || "").trim();
    if (!s) throw new Error("Enter your Dogecoin address (D\u2026 or n\u2026)");
    if (isHexPubkey(s)) {
      const pubkey = s.replace(/\s/g, "").replace(/^0x/i, "");
      return { asm: `${pubkey} OP_CHECKSIG`, kind: "pubkey", pubkey };
    }
    if (isDogecoinAddress(s)) {
      const decoded = await decodeAddressPayload(s, network);
      if (decoded.type === "p2sh") {
        throw new Error("Use a regular wallet address (D\u2026 or n\u2026), not a P2SH contract address.");
      }
      return {
        asm: `OP_DUP OP_HASH160 ${decoded.hash160} OP_EQUALVERIFY OP_CHECKSIG`,
        kind: "address",
        address: decoded.address,
        hash160: decoded.hash160
      };
    }
    throw new Error("Enter your Dogecoin address (D\u2026 or n\u2026) or a hex pubkey (02\u2026 / 03\u2026)");
  }
  function resolveMultisigPubkey(input) {
    const s = (input || "").trim();
    if (!s) throw new Error("Pubkey required for multisig");
    if (isDogecoinAddress(s)) {
      throw new Error("Multisig needs hex pubkeys from dogecoin-cli validateaddress, not wallet addresses.");
    }
    if (!isHexPubkey(s)) {
      throw new Error("Enter a hex pubkey (02\u2026 / 03\u2026) for each multisig signer.");
    }
    return s.replace(/\s/g, "").replace(/^0x/i, "");
  }

  // js/defi-helpers.js
  function locktimePush(locktime) {
    if (locktime >= 1 && locktime <= 16) return pushNumberOpcode(locktime);
    const hex = locktime.toString(16);
    const padded = hex.length % 2 ? "0" + hex : hex;
    return padded.match(/../g).reverse().join("");
  }
  async function scriptPackage(asm, network, base = {}) {
    const hex = bytesToHex(asmToScript(asm));
    const address = await p2shAddressFromScript(hex, network);
    return {
      asm,
      hex,
      address,
      redeemScript: asm,
      type: "p2sh",
      ...base
    };
  }
  async function cltvScript(locktime, signerInput, network, label = "CLTV lock") {
    const check = await resolveChecksigAsm(signerInput, network);
    const asm = `${locktimePush(locktime)} OP_CHECKLOCKTIMEVERIFY OP_DROP ${check.asm}`;
    return scriptPackage(asm, network, { locktime, label, signer: check });
  }
  async function htlcScript({ hash160: hash1602, locktime, receiverPk, senderPk, network }) {
    const receiver = await resolveChecksigAsm(receiverPk, network);
    const sender = await resolveChecksigAsm(senderPk, network);
    const asm = [
      "OP_IF",
      `OP_HASH160 ${hash1602} OP_EQUALVERIFY ${receiver.asm}`,
      "OP_ELSE",
      `${locktimePush(locktime)} OP_CHECKLOCKTIMEVERIFY OP_DROP ${sender.asm}`,
      "OP_ENDIF"
    ].join(" ");
    return scriptPackage(asm, network, { hash160: hash1602, locktime, type: "htlc", receiver, sender });
  }
  async function multisigAsm(m, pubkeys) {
    const mOp = pushNumberOpcode(m);
    const nOp = pushNumberOpcode(pubkeys.length);
    return `${mOp} ${pubkeys.join(" ")} ${nOp} OP_CHECKMULTISIG`;
  }
  async function invoiceRefundScript({ payeePk, payerRefundPk, locktime, network }) {
    const payee = await resolveChecksigAsm(payeePk, network);
    const payer = await resolveChecksigAsm(payerRefundPk, network);
    const asm = [
      "OP_IF",
      payee.asm,
      "OP_ELSE",
      `${locktimePush(locktime)} OP_CHECKLOCKTIMEVERIFY OP_DROP ${payer.asm}`,
      "OP_ENDIF"
    ].join(" ");
    return scriptPackage(asm, network, { locktime, type: "invoice", payee, payer });
  }
  async function savingsChallengeScript({ locktime, saverPk, penaltyPk, network }) {
    const saver = await resolveChecksigAsm(saverPk, network);
    const penalty = await resolveChecksigAsm(penaltyPk, network);
    const asm = [
      "OP_IF",
      `${locktimePush(locktime)} OP_CHECKLOCKTIMEVERIFY OP_DROP ${saver.asm}`,
      "OP_ELSE",
      penalty.asm,
      "OP_ENDIF"
    ].join(" ");
    return scriptPackage(asm, network, { locktime, type: "savings", saver, penalty });
  }
  async function hashLockScript(secret, network, signerInput = null) {
    const h160 = await hash160Hex(secret);
    let asm;
    let signer = null;
    if (signerInput?.trim()) {
      signer = await resolveChecksigAsm(signerInput, network);
      asm = `OP_HASH160 ${h160} OP_EQUALVERIFY ${signer.asm}`;
    } else {
      asm = `OP_HASH160 ${h160} OP_EQUAL`;
    }
    return scriptPackage(asm, network, { hash160: h160, secret, type: "hashlock", signer });
  }
  function standardSteps(kind) {
    const s = {
      fund: [
        "Sign TX \u2192 Fund the P2SH address with the required DOGE.",
        "Copy signed hex and broadcast anywhere."
      ],
      claim: [
        "After conditions are met, Sign TX \u2192 Claim with preimage / key.",
        "First valid broadcast wins for competitive locks."
      ],
      check: [
        "Sign TX \u2192 Fund the check P2SH address (funds arrive immediately).",
        "Share QR payload with recipient: WIF|address|locktime.",
        "After the check date, recipient sweeps with the check WIF.",
        "Expiration date is metadata only. Cancel manually after locktime if needed."
      ],
      htlc: [
        "Party A funds HTLC address on Dogecoin.",
        "Party B funds matching HTLC on other chain (same hash).",
        "Reveal preimage to claim; or wait for timeout refund path."
      ],
      escrow: [
        "Buyer funds the 2-of-3 escrow address.",
        "Release: buyer + seller sign, or arbitrator breaks tie."
      ]
    };
    return s[kind] || s.fund;
  }
  async function milestoneScripts(dates, signerInput, network) {
    const contracts = [];
    for (let i = 0; i < dates.length; i++) {
      const lt = locktimeFromDate(dates[i].date);
      const pkg = await cltvScript(lt, signerInput, network, `Milestone ${i + 1}`);
      contracts.push({
        ...pkg,
        label: dates[i].label || `Milestone ${i + 1}`,
        amountNote: dates[i].amount,
        unlockDate: dates[i].date
      });
    }
    return contracts;
  }
  async function vestingScripts({ cliffDate, tranches, signerInput, network }) {
    const contracts = [];
    if (cliffDate) {
      const lt = locktimeFromDate(cliffDate);
      contracts.push({
        ...await cltvScript(lt, signerInput, network, "Cliff"),
        label: "Vesting cliff",
        unlockDate: cliffDate
      });
    }
    for (let i = 0; i < tranches.length; i++) {
      const lt = locktimeFromDate(tranches[i].date);
      contracts.push({
        ...await cltvScript(lt, signerInput, network, `Tranche ${i + 1}`),
        label: tranches[i].label || `Tranche ${i + 1}`,
        amountNote: tranches[i].amount,
        unlockDate: tranches[i].date
      });
    }
    return contracts;
  }

  // js/defi-templates.js
  function expirationDefault(lockDate) {
    const d = new Date(lockDate);
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 16);
  }
  var DEFI_TEMPLATES = [
    {
      id: "bank-check",
      category: "defi",
      icon: "payments",
      title: "Bank Check (Post-Dated)",
      tagline: "Like a paper check: DOGE locked until a future date (dogecoin-wallet style)",
      fields: [
        { id: "payTo", label: "Pay to the order of", type: "text", required: true, placeholder: "Recipient name" },
        { id: "amount", label: "Amount (DOGE)", type: "doge", required: true, placeholder: "100.00" },
        { id: "lockDate", label: "Check date: funds unlock on (UTC)", type: "datetime-local", required: true },
        { id: "expirationDate", label: "Expiration (metadata, UTC)", type: "datetime-local", required: false },
        { id: "memo", label: "Memo", type: "text", placeholder: "July rent" },
        { id: "signature", label: "Signer name", type: "text", default: "Anonymous" }
      ],
      async build(params, network) {
        const locktime = locktimeFromDate(params.lockDate);
        const { privateKey, compressed } = generateKeypair();
        const pubkey = bytesToHex(await privateKeyToPubkey(privateKey, compressed));
        const wif = await encodeWIF(privateKey, network, compressed);
        const pkg = await cltvScript(locktime, pubkey, network);
        const qrPayload = `${wif}|${pkg.address}|${locktime}`;
        const exp = params.expirationDate || expirationDefault(params.lockDate);
        const attest = textToHex(`DOGECHECK|${params.payTo}|${params.amount}|${params.memo || ""}|${params.signature || ""}`);
        return {
          title: `Bank Check: ${params.payTo}`,
          description: 'P2SH CLTV post-dated payment. Fund immediately; recipient sweeps after check date with WIF from QR payload. Matches dogecoin-wallet "Write a Check".',
          ...pkg,
          type: "bank_check",
          steps: standardSteps("check"),
          capsuleAsm: `OP_RETURN ${attest}`,
          meta: {
            payTo: params.payTo,
            amount: params.amount,
            memo: params.memo,
            signature: params.signature,
            locktime,
            lockDate: params.lockDate,
            expirationDate: exp,
            wif,
            pubkey,
            qrPayload,
            warning: "WIF is a bearer instrument: anyone with QR can sweep after locktime. Expiration is not enforced on-chain."
          }
        };
      }
    },
    {
      id: "atomic-swap-htlc",
      category: "defi",
      icon: "swap_horiz",
      title: "Atomic Swap (HTLC)",
      tagline: "Trustless cross-chain swap: hash lock + timelock refund",
      fields: [
        { id: "secret", label: "Swap secret (preimage)", type: "text", placeholder: "auto-generated if empty" },
        { id: "receiverPk", label: "Receiver Dogecoin address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "senderPk", label: "Sender refund address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "refundDate", label: "Refund after (UTC)", type: "datetime-local", required: true }
      ],
      async build(params, network) {
        const secret = params.secret?.trim() || crypto.randomUUID().replace(/-/g, "");
        const h160 = await hash160Hex(secret);
        const locktime = locktimeFromDate(params.refundDate);
        const pkg = await htlcScript({
          hash160: h160,
          locktime,
          receiverPk: params.receiverPk,
          senderPk: params.senderPk,
          network
        });
        return {
          title: "Atomic Swap HTLC",
          description: "OP_IF: receiver claims with preimage. OP_ELSE: sender refunds after CLTV timeout. Use same hash on both chains.",
          ...pkg,
          steps: standardSteps("htlc"),
          meta: { secret, hash160: h160, locktime, refundDate: params.refundDate }
        };
      }
    },
    {
      id: "p2p-escrow",
      category: "defi",
      icon: "handshake",
      title: "P2P Escrow (2-of-3)",
      tagline: "Buyer, seller & arbitrator: release funds with any 2 signatures",
      fields: [
        { id: "buyerPk", label: "Buyer pubkey (hex)", type: "text", required: true, placeholder: "02\u2026 from validateaddress" },
        { id: "sellerPk", label: "Seller pubkey (hex)", type: "text", required: true, placeholder: "02\u2026 from validateaddress" },
        { id: "arbitratorPk", label: "Arbitrator pubkey (hex)", type: "text", required: true, placeholder: "02\u2026 from validateaddress" },
        { id: "dealNote", label: "Deal description", type: "text", placeholder: "Used GPU purchase" }
      ],
      async build(params, network) {
        const keys = [params.buyerPk, params.sellerPk, params.arbitratorPk].map(resolveMultisigPubkey);
        const asm = await multisigAsm(2, keys);
        const pkg = await scriptPackage(asm, network, {
          title: "P2P Escrow: 2-of-3",
          description: "Buyer funds escrow. Happy path: buyer + seller sign. Dispute: arbitrator + either party."
        });
        return {
          ...pkg,
          steps: standardSteps("escrow"),
          meta: { roles: { buyer: keys[0], seller: keys[1], arbitrator: keys[2] }, dealNote: params.dealNote }
        };
      }
    },
    {
      id: "milestone-escrow",
      category: "defi",
      icon: "timeline",
      title: "Milestone Payments",
      tagline: "Contractor paid in timed tranches: each milestone is a CLTV lock",
      fields: [
        { id: "contractorPk", label: "Contractor Dogecoin address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "m1date", label: "Milestone 1 date", type: "datetime-local", required: true },
        { id: "m1amount", label: "Milestone 1 amount (DOGE)", type: "doge", required: true },
        { id: "m2date", label: "Milestone 2 date", type: "datetime-local", required: false },
        { id: "m2amount", label: "Milestone 2 amount (DOGE)", type: "doge" },
        { id: "m3date", label: "Milestone 3 date", type: "datetime-local", required: false },
        { id: "m3amount", label: "Milestone 3 amount (DOGE)", type: "doge" }
      ],
      async build(params, network) {
        const dates = [
          { date: params.m1date, amount: params.m1amount, label: "Milestone 1" },
          params.m2date ? { date: params.m2date, amount: params.m2amount, label: "Milestone 2" } : null,
          params.m3date ? { date: params.m3date, amount: params.m3amount, label: "Milestone 3" } : null
        ].filter(Boolean);
        const contracts = await milestoneScripts(dates, params.contractorPk, network);
        const primary = contracts[0];
        return {
          title: "Milestone Payment Schedule",
          description: `${contracts.length} separate CLTV locks. Fund each P2SH address with its milestone amount.`,
          asm: primary.asm,
          hex: primary.hex,
          address: primary.address,
          type: "milestone",
          contracts,
          steps: [
            "Fund each milestone address with its DOGE amount.",
            "Contractor sweeps each lock after its unlock date.",
            "Sign TX \u2192 Sweep check pattern for each CLTV UTXO."
          ],
          meta: { contractorAddress: params.contractorPk, milestoneCount: contracts.length }
        };
      }
    },
    {
      id: "vesting-schedule",
      category: "defi",
      icon: "trending_up",
      title: "Token Vesting Schedule",
      tagline: "Team/advisor cliff + linear unlock tranches",
      fields: [
        { id: "beneficiaryPk", label: "Beneficiary Dogecoin address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "cliffDate", label: "Cliff date", type: "datetime-local", required: true },
        { id: "t1date", label: "Tranche 1 unlock", type: "datetime-local", required: true },
        { id: "t1amount", label: "Tranche 1 (DOGE)", type: "doge", required: true },
        { id: "t2date", label: "Tranche 2 unlock", type: "datetime-local" },
        { id: "t2amount", label: "Tranche 2 (DOGE)", type: "doge" }
      ],
      async build(params, network) {
        const tranches = [
          { date: params.t1date, amount: params.t1amount, label: "Tranche 1" },
          params.t2date ? { date: params.t2date, amount: params.t2amount, label: "Tranche 2" } : null
        ].filter(Boolean);
        const contracts = await vestingScripts({
          cliffDate: params.cliffDate,
          tranches,
          signerInput: params.beneficiaryPk,
          network
        });
        const cliff = contracts[0];
        return {
          title: "Vesting Schedule",
          description: "Cliff + tranche CLTV locks. Common team vesting pattern on Dogecoin.",
          asm: cliff.asm,
          hex: cliff.hex,
          address: cliff.address,
          type: "vesting",
          contracts,
          steps: [
            "Fund each vesting address at token allocation time.",
            "Beneficiary sweeps after each unlock date."
          ],
          meta: { beneficiaryAddress: params.beneficiaryPk, cliffDate: params.cliffDate }
        };
      }
    },
    {
      id: "invoice-refund",
      category: "defi",
      icon: "receipt_long",
      title: "Invoice with Refund",
      tagline: "Payee claims anytime; payer gets refund after deadline",
      fields: [
        { id: "payeePk", label: "Payee (seller) address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "payerPk", label: "Payer (buyer) address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "refundDate", label: "Refund available after", type: "datetime-local", required: true },
        { id: "invoiceId", label: "Invoice ID", type: "text", default: "INV-001" }
      ],
      async build(params, network) {
        const locktime = locktimeFromDate(params.refundDate);
        const pkg = await invoiceRefundScript({
          payeePk: params.payeePk,
          payerRefundPk: params.payerPk,
          locktime,
          network
        });
        const dataHex = textToHex(`DOGEINV|${params.invoiceId}|refund_after:${params.refundDate}`);
        return {
          title: `Invoice ${params.invoiceId}`,
          description: "IF branch: payee signs immediately. ELSE: payer refunds after CLTV deadline.",
          ...pkg,
          dataHex,
          steps: [
            "Payer funds the invoice P2SH address.",
            "Payee claims with IF branch signature before deadline.",
            "Or payer reclaims via ELSE branch after refund date."
          ],
          meta: { invoiceId: params.invoiceId, locktime, refundDate: params.refundDate }
        };
      }
    },
    {
      id: "inheritance-switch",
      category: "defi",
      icon: "account_tree",
      title: "Inheritance Timelock",
      tagline: "You can spend now; heir inherits if you do not",
      fields: [
        { id: "ownerPk", label: "Your Dogecoin address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "heirPk", label: "Heir Dogecoin address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "inheritDate", label: "Heir can claim after", type: "datetime-local", required: true }
      ],
      async build(params, network) {
        const locktime = locktimeFromDate(params.inheritDate);
        const heir = await resolveChecksigAsm(params.heirPk, network);
        const owner = await resolveChecksigAsm(params.ownerPk, network);
        const asm = [
          "OP_IF",
          `${locktimePush(locktime)} OP_CHECKLOCKTIMEVERIFY OP_DROP ${heir.asm}`,
          "OP_ELSE",
          owner.asm,
          "OP_ENDIF"
        ].join(" ");
        const pkg = await scriptPackage(asm, network);
        return {
          title: "Inheritance Switch",
          description: "Owner spends via ELSE anytime. Heir claims via IF only after inheritance date.",
          ...pkg,
          steps: [
            "Lock DOGE in the P2SH address.",
            "Owner can move funds before inheritance date.",
            "After date, heir sweeps with CLTV + signature."
          ],
          meta: { locktime, inheritDate: params.inheritDate }
        };
      }
    },
    {
      id: "savings-challenge",
      category: "defi",
      icon: "savings",
      title: "Savings Challenge",
      tagline: "Locked until goal date: break early and penalty address wins",
      fields: [
        { id: "saverPk", label: "Your Dogecoin address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "penaltyPk", label: "Penalty recipient address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "goalDate", label: "Goal date: unlock savings", type: "datetime-local", required: true },
        { id: "goalLabel", label: "Challenge name", type: "text", default: "Savings Challenge" }
      ],
      async build(params, network) {
        const locktime = locktimeFromDate(params.goalDate);
        const pkg = await savingsChallengeScript({
          locktime,
          saverPk: params.saverPk,
          penaltyPk: params.penaltyPk,
          network
        });
        return {
          title: `Savings Challenge: ${params.goalLabel}`,
          description: "IF: withdraw after goal date. ELSE: penalty pubkey takes funds if you break early.",
          ...pkg,
          steps: [
            "Lock your savings DOGE in the P2SH address.",
            "Wait until goal date, then sweep via IF branch.",
            "Breaking early sends funds to penalty address via ELSE."
          ],
          meta: { goalDate: params.goalDate, locktime, goalLabel: params.goalLabel }
        };
      }
    },
    {
      id: "proof-of-reserve",
      category: "defi",
      icon: "verified",
      title: "Proof of Reserve",
      tagline: "Publish treasury address + balance commitment on-chain",
      fields: [
        { id: "treasuryAddress", label: "Treasury / reserve address", type: "text", required: true },
        { id: "balanceDoge", label: "Committed balance (DOGE)", type: "doge", required: true },
        { id: "orgName", label: "Organization", type: "text", required: true },
        { id: "pubkey1", label: "Signer pubkey 1 (hex)", type: "text", required: true, placeholder: "02\u2026 from validateaddress" },
        { id: "pubkey2", label: "Signer pubkey 2 (hex)", type: "text", placeholder: "02\u2026" },
        { id: "pubkey3", label: "Signer pubkey 3 (hex)", type: "text", placeholder: "02\u2026" }
      ],
      async build(params, network) {
        const keys = [params.pubkey1, params.pubkey2, params.pubkey3].filter((k) => k?.trim()).map(resolveMultisigPubkey);
        const m = keys.length >= 3 ? 2 : keys.length;
        const asm = await multisigAsm(m, keys);
        const pkg = await scriptPackage(asm, network);
        const commit = await sha256Hex(`${params.treasuryAddress}|${params.balanceDoge}|${params.orgName}`);
        const dataHex = textToHex(`DOGERESERVE|${params.orgName}|${params.treasuryAddress}|${params.balanceDoge}|${commit}`);
        return {
          title: `Proof of Reserve: ${params.orgName}`,
          description: "OP_RETURN attestation linked to multisig treasury. Verifiers compare on-chain claim to actual address balance.",
          asm: pkg.asm,
          hex: pkg.hex,
          address: pkg.address,
          type: "op_return",
          dataHex,
          steps: [
            "Broadcast OP_RETURN attestation (Sign TX tab).",
            "Treasury should match the committed address.",
            "Multisig script proves who controls reserves."
          ],
          meta: {
            treasuryAddress: params.treasuryAddress,
            balanceDoge: params.balanceDoge,
            orgName: params.orgName,
            commitmentSha256: commit
          }
        };
      }
    },
    {
      id: "raffle-commit",
      category: "defi",
      icon: "confirmation_number",
      title: "Raffle (Commit\u2013Reveal)",
      tagline: "Commit winning number hash, then reveal + claim prize",
      fields: [
        { id: "winningNumber", label: "Winning number (secret)", type: "text", required: true },
        { id: "raffleName", label: "Raffle name", type: "text", default: "Doge Raffle" },
        { id: "prizeNote", label: "Prize description", type: "text", default: "1000 DOGE" }
      ],
      async build(params, network) {
        const commitHash = await sha256Hex(params.winningNumber);
        const pkg = await hashLockScript(params.winningNumber, network);
        const commitHex = textToHex(`DOGERAFFLE|commit|${params.raffleName}|${commitHash}`);
        return {
          title: `Raffle: ${params.raffleName}`,
          description: "Phase 1: broadcast commit OP_RETURN. Phase 2: fund prize hash-lock. Winner reveals number to claim.",
          ...pkg,
          commitAsm: `OP_RETURN ${commitHex}`,
          dataHex: commitHex,
          steps: [
            "Broadcast commit OP_RETURN (hash of winning number).",
            "Fund prize P2SH address.",
            "Winner reveals number via Claim to prove they knew it."
          ],
          meta: {
            raffleName: params.raffleName,
            commitHash,
            prizeNote: params.prizeNote,
            winningNumber: params.winningNumber
          }
        };
      }
    },
    {
      id: "content-unlock",
      category: "defi",
      icon: "lock_open",
      title: "Paid Content Unlock",
      tagline: "Hash lock: buyer gets preimage after paying",
      fields: [
        { id: "contentId", label: "Content ID / URL slug", type: "text", required: true },
        { id: "unlockSecret", label: "Unlock secret (give to buyer after payment)", type: "text", placeholder: "auto-generated" },
        { id: "sellerPk", label: "Seller address (optional)", type: "doge-address", placeholder: "D\u2026 or n\u2026" },
        { id: "priceNote", label: "Price label", type: "text", default: "50 DOGE" }
      ],
      async build(params, network) {
        const secret = params.unlockSecret?.trim() || crypto.randomUUID();
        const pkg = await hashLockScript(
          secret,
          network,
          params.sellerPk?.trim() ? params.sellerPk : null
        );
        const dataHex = textToHex(`DOGEPAY|${params.contentId}|${params.priceNote}`);
        return {
          title: `Content Unlock: ${params.contentId}`,
          description: "Seller funds lock; buyer pays off-chain; seller shares secret; buyer claims or uses preimage.",
          ...pkg,
          dataHex,
          steps: [
            "List content with P2SH payment address.",
            "After payment, seller gives buyer the unlock secret.",
            "Buyer claims UTXO or uses secret to prove purchase."
          ],
          meta: { contentId: params.contentId, secret, priceNote: params.priceNote }
        };
      }
    },
    {
      id: "channel-open",
      category: "defi",
      icon: "hub",
      title: "Payment Channel Open",
      tagline: "2-of-2 multisig + documented refund timelock path",
      fields: [
        { id: "party1Pk", label: "Party 1 pubkey (hex)", type: "text", required: true, placeholder: "02\u2026" },
        { id: "party2Pk", label: "Party 2 pubkey (hex)", type: "text", required: true, placeholder: "02\u2026" },
        { id: "refundDate", label: "Refund path unlock date", type: "datetime-local", required: true },
        { id: "refundPk", label: "Refund to address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" }
      ],
      async build(params, network) {
        const locktime = locktimeFromDate(params.refundDate);
        const p1 = resolveMultisigPubkey(params.party1Pk);
        const p2 = resolveMultisigPubkey(params.party2Pk);
        const multisig = await multisigAsm(2, [p1, p2]);
        const pkg = await scriptPackage(multisig, network, {
          title: "Payment Channel: 2-of-2",
          description: "Cooperative close: both sign. Uncooperative: use separate CLTV refund tx after timeout (educational pattern)."
        });
        const refundCheck = await resolveChecksigAsm(params.refundPk, network);
        const refundAsm = `${locktimePush(locktime)} OP_CHECKLOCKTIMEVERIFY OP_DROP ${refundCheck.asm}`;
        const refundPkg = await scriptPackage(refundAsm, network);
        return {
          ...pkg,
          type: "channel",
          refundContract: refundPkg,
          steps: [
            "Both parties fund the 2-of-2 P2SH address.",
            "Cooperative: spend with both signatures.",
            "Uncooperative fallback: separate CLTV refund script (fund & sweep after date)."
          ],
          meta: { locktime, refundDate: params.refundDate, refundAsm: refundPkg.asm }
        };
      }
    },
    {
      id: "otc-swap-pair",
      category: "defi",
      icon: "currency_exchange",
      title: "OTC Swap Pair (HTLC)",
      tagline: "Generate matching HTLC scripts for two-party OTC swap",
      fields: [
        { id: "secret", label: "Shared swap secret", type: "text", placeholder: "auto" },
        { id: "alicePk", label: "Alice Dogecoin address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "bobPk", label: "Bob Dogecoin address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "refundDate", label: "Refund deadline", type: "datetime-local", required: true }
      ],
      async build(params, network) {
        const secret = params.secret?.trim() || crypto.randomUUID().replace(/-/g, "");
        const h160 = await hash160Hex(secret);
        const locktime = locktimeFromDate(params.refundDate);
        const aliceHtlc = await htlcScript({ hash160: h160, locktime, receiverPk: params.bobPk, senderPk: params.alicePk, network });
        const bobHtlc = await htlcScript({ hash160: h160, locktime, receiverPk: params.alicePk, senderPk: params.bobPk, network });
        return {
          title: "OTC Swap HTLC Pair",
          description: "Alice funds aliceHtlc; Bob funds bobHtlc. Same hash: first reveal completes atomic swap.",
          asm: aliceHtlc.asm,
          hex: aliceHtlc.hex,
          address: aliceHtlc.address,
          type: "otc",
          contracts: [
            { role: "Alice funds", ...aliceHtlc },
            { role: "Bob funds", ...bobHtlc }
          ],
          steps: standardSteps("htlc"),
          meta: { secret, hash160: h160, locktime, aliceAddress: aliceHtlc.address, bobAddress: bobHtlc.address }
        };
      }
    }
  ];

  // js/pqc.js
  var PQC_BIP_URL = "https://github.com/edtubbs/libdogecoin/blob/0.1.5-dev-pqc-carrier/doc/spec/bip-post-quantum-signature-commitments.mediawiki";
  var SUCHQUANTUM_URL = "https://suchquantum.com/";
  var PQC_SCHEMES = {
    falcon: {
      id: "falcon",
      tag: "FLC1",
      tagHex: "464c4331",
      carrierTag: "FLC1FULL",
      label: "Falcon-512",
      pkLen: 897,
      sigLen: 690,
      partTotal: 1
    },
    dilithium: {
      id: "dilithium",
      tag: "DIL2",
      tagHex: "44494c32",
      carrierTag: "DIL2FULL",
      label: "Dilithium2",
      pkLen: 1312,
      sigLen: 2420,
      partTotal: 3
    },
    raccoon: {
      id: "raccoon",
      tag: "RCG4",
      tagHex: "52434734",
      carrierTag: "RCG4FULL",
      label: "Raccoon-G-44",
      pkLen: 16144,
      sigLen: 20768,
      partTotal: 24
    }
  };
  var PQC_SCHEME_OPTIONS = [
    { value: "falcon", label: "Falcon-512 (FLC1)" },
    { value: "dilithium", label: "Dilithium2 (DIL2)" },
    { value: "raccoon", label: "Raccoon-G-44 (RCG4)" }
  ];
  function getPqcScheme(id) {
    return PQC_SCHEMES[id] || PQC_SCHEMES.falcon;
  }
  function normalizeHex(input) {
    return (input || "").replace(/^0x/i, "").replace(/\s+/g, "").toLowerCase();
  }
  function isValidHexBytes(hex, minLen = 2) {
    const s = normalizeHex(hex);
    return /^[0-9a-f]+$/.test(s) && s.length % 2 === 0 && s.length >= minLen;
  }
  async function computePqcCommitment(pubkeyHex, signatureHex) {
    const pk = hexToBytes(normalizeHex(pubkeyHex));
    const sig = hexToBytes(normalizeHex(signatureHex));
    if (!pk.length || !sig.length) throw new Error("Public key and signature hex are required");
    const combined = new Uint8Array(pk.length + sig.length);
    combined.set(pk);
    combined.set(sig, pk.length);
    const commitment = await sha256(combined);
    return {
      commitmentHex: bytesToHex(commitment),
      pkLen: pk.length,
      sigLen: sig.length,
      pkPrefix: bytesToHex(pk.slice(0, 16)),
      sigPrefix: bytesToHex(sig.slice(0, 16))
    };
  }
  function buildPqcDataHex(schemeId, commitmentHex) {
    const scheme = getPqcScheme(schemeId);
    const commit = normalizeHex(commitmentHex);
    if (!/^[0-9a-f]{64}$/.test(commit)) {
      throw new Error("Commitment must be 32 bytes (64 hex characters)");
    }
    return scheme.tagHex + commit;
  }
  function buildPqcOpReturnAsm(schemeId, commitmentHex) {
    return `OP_RETURN ${buildPqcDataHex(schemeId, commitmentHex)}`;
  }
  function buildPqcOpReturnScriptHex(schemeId, commitmentHex) {
    return `6a24${buildPqcDataHex(schemeId, commitmentHex)}`;
  }
  function randomHexBytes(byteLen) {
    const bytes = new Uint8Array(byteLen);
    crypto.getRandomValues(bytes);
    return bytesToHex(bytes);
  }
  async function demoPqcMaterial(schemeId) {
    const scheme = getPqcScheme(schemeId);
    const pubkeyHex = randomHexBytes(scheme.pkLen);
    const signatureHex = randomHexBytes(scheme.sigLen);
    const { commitmentHex } = await computePqcCommitment(pubkeyHex, signatureHex);
    return { pubkeyHex, signatureHex, commitmentHex };
  }

  // js/pqc-carrier.js
  var TAG8 = {
    FLC1FULL: new Uint8Array([70, 76, 67, 49, 70, 85, 76, 76]),
    DIL2FULL: new Uint8Array([68, 73, 76, 50, 70, 85, 76, 76]),
    RCG4FULL: new Uint8Array([82, 67, 71, 52, 70, 85, 76, 76])
  };
  var TAG4 = {
    FLC1FULL: new Uint8Array([70, 76, 67, 49]),
    DIL2FULL: new Uint8Array([68, 73, 76, 50]),
    RCG4FULL: new Uint8Array([82, 67, 71, 52])
  };
  var REDEEM_CARRIER = new Uint8Array([117, 117, 117, 117, 117, 81]);
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
    for (const a of arrays) {
      out.set(a, o);
      o += a.length;
    }
    return out;
  }
  function readVarInt(buf, off) {
    const x = buf[off];
    if (x < 253) return { n: x, next: off + 1 };
    if (x === 253) return { n: buf[off + 1] | buf[off + 2] << 8, next: off + 3 };
    if (x === 254) {
      let n = 0;
      for (let i = 0; i < 4; i++) n |= buf[off + 1 + i] << 8 * i;
      return { n: n >>> 0, next: off + 5 };
    }
    let lo = 0;
    let hi = 0;
    for (let i = 0; i < 4; i++) lo |= buf[off + 1 + i] << 8 * i;
    for (let i = 0; i < 4; i++) hi |= buf[off + 5 + i] << 8 * i;
    const bn = BigInt(hi) << 32n | BigInt(lo >>> 0);
    if (bn > Number.MAX_SAFE_INTEGER) throw new Error("varint too large");
    return { n: Number(bn), next: off + 9 };
  }
  function readUInt32LE(buf, off) {
    return buf[off] | buf[off + 1] << 8 | buf[off + 2] << 16 | buf[off + 3] << 24;
  }
  function readUInt64LE(buf, off) {
    let lo = 0;
    let hi = 0;
    for (let i = 0; i < 4; i++) lo |= buf[off + i] << 8 * i;
    for (let i = 0; i < 4; i++) hi |= buf[off + 4 + i] << 8 * i;
    return BigInt(hi) << 32n | BigInt(lo >>> 0);
  }
  function scriptToPushes(script) {
    const pushes = [];
    let i = 0;
    while (i < script.length) {
      const op = script[i++];
      if (op === 0) {
        pushes.push(new Uint8Array(0));
        continue;
      }
      if (op >= 1 && op <= 75) {
        const n = op;
        pushes.push(script.slice(i, i + n));
        i += n;
        continue;
      }
      if (op === 76) {
        const n = script[i++];
        pushes.push(script.slice(i, i + n));
        i += n;
        continue;
      }
      if (op === 77) {
        const n = script[i] | script[i + 1] << 8;
        i += 2;
        pushes.push(script.slice(i, i + n));
        i += n;
        continue;
      }
      if (op === 78) {
        const n = script[i] | script[i + 1] << 8 | script[i + 2] << 16 | script[i + 3] << 24;
        i += 4;
        pushes.push(script.slice(i, i + n));
        i += n;
        continue;
      }
      if (op >= 81 && op <= 96) {
        pushes.push(new Uint8Array([op - 80]));
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
      if (s.length === 2 + 36 && s[0] === 106 && s[1] === 36) {
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
      pkLen: hdr8[4] << 8 | hdr8[5],
      fullLen: hdr8[6] << 8 | hdr8[7],
      partPayload: concatAll(chunks)
    };
  }
  async function verifyPqcCarrierCommitment(txcHex, txrHex) {
    const rawC = hexToBytes((txcHex || "").replace(/\s+/g, ""));
    const rawR = hexToBytes((txrHex || "").replace(/\s+/g, ""));
    if (!rawC.length || !rawR.length) throw new Error("Paste both TX_C and TX_R raw hex");
    const txC = parseTx(rawC);
    const txR = parseTx(rawR);
    const [txidC, txidR] = await Promise.all([txidFromRaw(rawC), txidFromRaw(rawR)]);
    const commitments = findCommitments(txC);
    if (!commitments.length) {
      throw new Error("TX_C: no canonical PQ OP_RETURN (expected 6a 24 + FLC1|DIL2|RCG4 + 32-byte commitment)");
    }
    const parts = [];
    for (let i = 0; i < txR.vin.length; i++) {
      const c = parseCarrierVin(txR.vin[i].scriptSig);
      if (c) parts.push({ vinIndex: i, ...c });
    }
    if (!parts.length) {
      throw new Error("TX_R: no carrier scriptSig (expect FLC1FULL|DIL2FULL|RCG4FULL + HDR8 + 3 chunks + redeemScript)");
    }
    const tagName = parts[0].tagName;
    if (!parts.every((p) => p.tagName === tagName)) throw new Error("Mixed carrier tags across inputs");
    const expectedParts = { FLC1FULL: 1, DIL2FULL: 3, RCG4FULL: 24 }[tagName];
    const pt0 = parts[0].partTotal;
    if (pt0 !== expectedParts) {
      throw new Error(`Unexpected part_total for ${tagName}: got ${pt0}, expected ${expectedParts}`);
    }
    const byPart = /* @__PURE__ */ new Map();
    for (const p of parts) {
      if (p.partTotal !== pt0) throw new Error("Inconsistent part_total in carrier headers");
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
        `Commitment mismatch. TX_C: ${commitments.map((c) => bytesToHex(c.commitment)).join(", ")}; recomputed SHA256(pk||sig): ${bytesToHex(recomputed)}`
      );
    }
    let spendsTxC = false;
    for (const vin of txR.vin) {
      const prevTxidDisplay = [...vin.prevTxid].reverse().map((b) => b.toString(16).padStart(2, "0")).join("");
      if (prevTxidDisplay.toLowerCase() === txidC.toLowerCase()) spendsTxC = true;
    }
    const schemeKey = { FLC1FULL: "falcon", DIL2FULL: "dilithium", RCG4FULL: "raccoon" }[tagName];
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
      note: spendsTxC ? "TX_R spends an output from TX_C. Carrier reveal is linked." : "TX_R prevouts did not match TX_C txid (may still be valid if txs are from the same block)."
    };
  }

  // js/unlock-templates.js
  var UNLOCK_USE_CASES = [
    { value: "game", label: "Video game / DLC" },
    { value: "music", label: "Music / audio download" },
    { value: "software", label: "Software / app license" },
    { value: "door", label: "Door / physical access" },
    { value: "iot", label: "IoT device command" },
    { value: "api", label: "API / webhook token" },
    { value: "other", label: "Other digital content" }
  ];
  var INTEGRATION_HINTS = {
    game: "Your game checks SHA256(revealCode) or compares HASH160 against the script. Grant access when the player enters the code that matches the on-chain lock.",
    music: "Host the file off-chain. After payment, give the buyer the reveal code. Your store verifies HASH160(code) against the committed script before serving the download.",
    software: "Map the reveal code to a license file or activation server. On-chain lock proves you published this exact code at mint time.",
    door: "Off-chain controller (ESP32, Home Assistant, etc.) polls or watches for a spend with the correct preimage, or verifies the code locally against the published HASH160.",
    iot: "Device firmware accepts commands only when HMAC or HASH160(commandToken) matches the on-chain commitment. Pair with OP_RETURN device ID.",
    api: "Reveal code becomes a bearer token. Your backend stores HASH160(token) and compares on each request; chain tx proves token existed at time T.",
    other: "Any workflow where revealing a preimage unlocks off-chain value: files, features, tickets, or credentials."
  };
  async function buildRevealUnlock({
    network,
    params,
    contentType,
    defaultTitle,
    description,
    stepsExtra = []
  }) {
    const secret = params.revealCode?.trim() || params.unlockSecret?.trim() || randomSecret(16);
    const contentId = (params.contentId || params.productId || params.deviceId || "").trim();
    if (!contentId) throw new Error("Content / product / device ID is required");
    const seller = params.sellerAddress?.trim() || params.sellerPk?.trim() || null;
    const pkg = await hashLockScript(secret, network, seller);
    const markerPayload = textToHex(`DOGEUNLOCK|v1|${contentType}|${contentId}`);
    const markerAsm = `OP_RETURN ${markerPayload}`;
    const priceNote = params.priceNote || params.priceLabel || null;
    return {
      title: params.title?.trim() || `${defaultTitle}: ${contentId}`,
      description,
      ...pkg,
      dataHex: markerPayload,
      markerAsm,
      steps: [
        "Sign TX \u2192 optionally broadcast OP_RETURN marker (content ID on-chain).",
        "Sign TX \u2192 Fund the P2SH hash-lock address (escrow / proof-of-sale optional).",
        "After payment, share the reveal code with the buyer. Never publish it on-chain.",
        "Buyer enters code in your app, game, door controller, or download gate.",
        "Optional: Sign TX \u2192 Claim to move escrow once code is delivered.",
        ...stepsExtra
      ],
      meta: {
        unlock: {
          contentType,
          contentId,
          revealCode: secret,
          hash160: pkg.hash160,
          integration: INTEGRATION_HINTS[contentType] || INTEGRATION_HINTS.other,
          opcodes: ["OP_HASH160", "OP_EQUAL", seller ? "OP_EQUALVERIFY" : null, seller ? "OP_CHECKSIG" : null].filter(Boolean),
          priceNote
        },
        secret,
        hash160: pkg.hash160,
        warning: "Anyone with the reveal code can spend an unfunded lock or claim escrow. Treat the code like a password."
      }
    };
  }
  var UNLOCK_TEMPLATES = [
    {
      id: "reveal-code-unlock",
      category: "unlocks",
      icon: "vpn_key",
      title: "Reveal Code Unlock",
      tagline: "Hash-lock a reveal code for games, media, software, doors, or IoT",
      fields: [
        {
          id: "useCase",
          label: "Use case",
          type: "select",
          options: UNLOCK_USE_CASES,
          default: "game",
          required: true
        },
        { id: "contentId", label: "Content / product ID", type: "text", placeholder: "my-game-level-1", required: true },
        { id: "revealCode", label: "Reveal code (preimage)", type: "text", placeholder: "Auto-generated if empty", required: false },
        { id: "sellerAddress", label: "Seller wallet (optional)", type: "doge-address", placeholder: "Restrict claim to this address" },
        { id: "priceLabel", label: "Price label (off-chain)", type: "text", placeholder: "10 DOGE", required: false }
      ],
      async build(params, network) {
        const contentType = params.useCase || "other";
        const useLabel = UNLOCK_USE_CASES.find((u) => u.value === contentType)?.label || "Digital unlock";
        return buildRevealUnlock({
          network,
          params,
          contentType,
          defaultTitle: "Reveal Code Unlock",
          description: `OP_HASH160 locks a reveal code on Layer 1. Perfect for ${useLabel.toLowerCase()}: the code is the preimage; your app verifies HASH160(code) against this script before unlocking content.`
        });
      }
    },
    {
      id: "game-license-key",
      category: "unlocks",
      icon: "sports_esports",
      title: "Game License Key",
      tagline: "On-chain hash lock for a game activation / DLC code",
      fields: [
        { id: "contentId", label: "Game or DLC ID", type: "text", placeholder: "shibe-quest-dlc-2", required: true },
        { id: "revealCode", label: "License key", type: "text", placeholder: "XXXX-XXXX-XXXX", required: false },
        { id: "sellerAddress", label: "Publisher address (optional)", type: "doge-address" },
        { id: "priceLabel", label: "Price", type: "text", default: "100 DOGE" }
      ],
      async build(params, network) {
        return buildRevealUnlock({
          network,
          params: { ...params, useCase: "game" },
          contentType: "game",
          defaultTitle: "Game License",
          description: "Commits a license key with OP_HASH160. Players redeem off-chain; optional DOGE escrow funds the key sale.",
          stepsExtra: ["Game client: if HASH160(enteredKey) === on-chain hash \u2192 unlock DLC."]
        });
      }
    },
    {
      id: "music-download-code",
      category: "unlocks",
      icon: "library_music",
      title: "Music Download Code",
      tagline: "Reveal code unlocks an album, track, or stem pack",
      fields: [
        { id: "contentId", label: "Track / album ID", type: "text", placeholder: "much-wow-ep-01", required: true },
        { id: "revealCode", label: "Download code", type: "text", required: false },
        { id: "sellerAddress", label: "Artist address (optional)", type: "doge-address" },
        { id: "priceLabel", label: "Price", type: "text", default: "50 DOGE" }
      ],
      async build(params, network) {
        return buildRevealUnlock({
          network,
          params,
          contentType: "music",
          defaultTitle: "Music Unlock",
          description: "Fans pay off-chain (or to P2SH), receive the download code, and your server verifies the preimage against this hash lock."
        });
      }
    },
    {
      id: "software-activation",
      category: "unlocks",
      icon: "apps",
      title: "Software Activation Lock",
      tagline: "Activation code anchored with OP_HASH160",
      fields: [
        { id: "productId", label: "Product ID", type: "text", placeholder: "com.example.app-pro", required: true },
        { id: "revealCode", label: "Activation code", type: "text", required: false },
        { id: "sellerAddress", label: "Vendor address (optional)", type: "doge-address" },
        { id: "priceLabel", label: "License price", type: "text", default: "200 DOGE" }
      ],
      async build(params, network) {
        return buildRevealUnlock({
          network,
          params: { ...params, contentId: params.productId },
          contentType: "software",
          defaultTitle: "Software Activation",
          description: "Prove when a license code was issued. Installer checks HASH160(code) before enabling pro features."
        });
      }
    },
    {
      id: "smart-door-access",
      category: "unlocks",
      icon: "door_front",
      title: "Smart Door / Access PIN",
      tagline: "PIN or token hash for doors, gates, and access control",
      fields: [
        { id: "deviceId", label: "Door / gate ID", type: "text", placeholder: "garage-door-west", required: true },
        { id: "revealCode", label: "Access PIN / token", type: "text", placeholder: "6-digit PIN", required: false },
        { id: "sellerAddress", label: "Owner address (optional)", type: "doge-address" }
      ],
      async build(params, network) {
        return buildRevealUnlock({
          network,
          params: { ...params, contentId: params.deviceId },
          contentType: "door",
          defaultTitle: "Access PIN Lock",
          description: "On-chain commitment to an access code. Your controller verifies the PIN against HASH160 before triggering a relay, no cloud account required for verification.",
          stepsExtra: [
            "Integrate: microcontroller compares user PIN \u2192 HASH160 \u2192 script hash on-chain or in exported JSON."
          ]
        });
      }
    },
    {
      id: "iot-command-token",
      category: "unlocks",
      icon: "sensors",
      title: "IoT Command Token",
      tagline: "Unlock device actions with a hashed command token",
      fields: [
        { id: "deviceId", label: "Device ID", type: "text", placeholder: "sensor-node-7", required: true },
        { id: "revealCode", label: "Command token", type: "text", required: false },
        { id: "sellerAddress", label: "Device owner address (optional)", type: "doge-address" }
      ],
      async build(params, network) {
        return buildRevealUnlock({
          network,
          params,
          contentType: "iot",
          defaultTitle: "IoT Command Lock",
          description: "Commit a command token with OP_HASH160. Firmware only runs privileged actions when the presented token matches the on-chain lock."
        });
      }
    }
  ];

  // js/templates.js
  var TEMPLATE_CATEGORIES = [
    { id: "data", label: "Data on Chain", icon: "article" },
    { id: "quantum", label: "Post-Quantum", icon: "security" },
    { id: "defi", label: "DeFi & Escrow", icon: "account_balance" },
    { id: "games", label: "Games & Hunts", icon: "sports_esports" },
    { id: "unlocks", label: "Reveal & Unlock", icon: "vpn_key" },
    { id: "locks", label: "Locks & Vaults", icon: "lock" },
    { id: "social", label: "Shared Wallets", icon: "groups" },
    { id: "explore", label: "Opcode Playground", icon: "science" }
  ];
  var TEMPLATES = [
    {
      id: "text-message",
      category: "data",
      icon: "chat",
      title: "Text Message (OP_RETURN)",
      tagline: "Permanently store a message on the Dogecoin blockchain",
      fields: [
        { id: "message", label: "Message", type: "textarea", placeholder: "Hello Dogecoin!", required: true },
        { id: "prefix", label: "Protocol prefix (optional)", type: "text", placeholder: "DOGETXT", default: "DOGETXT" }
      ],
      async build(params, network) {
        const prefix = params.prefix ? `${params.prefix}|` : "";
        const payload = textToHex(prefix + params.message);
        const asm = `OP_RETURN ${payload}`;
        const hex = bytesToHex(asmToScript(asm));
        return {
          title: "OP_RETURN Text Message",
          description: "Creates an unspendable output carrying your message. Anyone can read it from the blockchain forever.",
          asm,
          hex,
          type: "op_return",
          dataHex: payload,
          steps: [
            "Fund a UTXO in your wallet (testnet faucet for experiments).",
            "Use the Sign TX tab to build a signed OP_RETURN transaction.",
            "Copy the raw hex and broadcast via any node or block explorer.",
            "Your message is permanently readable on-chain."
          ],
          meta: { message: params.message, dataHex: payload }
        };
      }
    },
    {
      id: "file-checksum",
      category: "data",
      icon: "fingerprint",
      title: "File Checksum Anchor",
      tagline: "Commit SHA-256 hash of a file to prove it existed",
      fields: [
        { id: "file", label: "Upload file", type: "file", required: false },
        { id: "hash", label: "Or paste SHA-256 hex", type: "text", placeholder: "64-char hex hash", required: false },
        { id: "filename", label: "File label (optional)", type: "text", placeholder: "whitepaper.pdf" }
      ],
      async build(params, network) {
        let hash = (params.hash || "").replace(/\s/g, "").toLowerCase();
        if (params._fileHash) hash = params._fileHash;
        if (!/^[0-9a-f]{64}$/.test(hash)) throw new Error("Provide a file or valid SHA-256 hex (64 chars)");
        const label = params.filename ? textToHex(params.filename.slice(0, 40)) : "";
        const payload = textToHex(`DOGEHASH|${hash}${params.filename ? "|" + params.filename : ""}`);
        const asm = `OP_RETURN ${payload}`;
        const hex = bytesToHex(asmToScript(asm));
        return {
          title: "File Checksum Commitment",
          description: "Anchors a document hash on-chain. Later, re-hash your file locally and compare: match proves authenticity of that exact file at commit time.",
          asm,
          hex,
          type: "op_return",
          steps: [
            "Compute SHA-256 of your file (upload in wizard or paste hash).",
            "Sign TX \u2192 Broadcast OP_RETURN with the hash.",
            "To verify later: re-hash the file and compare to on-chain record."
          ],
          meta: { sha256: hash, filename: params.filename || null }
        };
      }
    },
    {
      id: "nft-mint",
      category: "data",
      icon: "image",
      title: "NFT Mint (OP_RETURN checksum)",
      tagline: "Anchor an image checksum on-chain, same method as the Dec 2021 Dogecoin NFT mint",
      fields: [
        { id: "file", label: "NFT image / file", type: "file", required: false },
        { id: "hash", label: "Or paste SHA-256 hex", type: "text", placeholder: "64-char checksum", required: false },
        { id: "name", label: "NFT name", type: "text", placeholder: "My Doge Art", required: false },
        { id: "author", label: "Creator", type: "text", placeholder: "Your name or @handle", required: false }
      ],
      async build(params, network) {
        let hash = (params.hash || "").replace(/\s/g, "").toLowerCase();
        if (params._fileHash) hash = params._fileHash;
        if (!/^[0-9a-f]{64}$/.test(hash)) {
          throw new Error("Upload an image/file or paste a valid SHA-256 hex (64 characters)");
        }
        const opReturnAscii = `[${hash}]`;
        const payload = textToHex(opReturnAscii);
        const asm = `OP_RETURN ${payload}`;
        const hex = bytesToHex(asmToScript(asm));
        const historicTxid = "19aeaa88859c04a333257f1119a77438ac08feec424c6ad3645a0679c8be9882";
        const tweetUrl = "https://x.com/inevitable360/status/1470414541490110472";
        return {
          title: params.name ? `NFT Mint: ${params.name}` : "NFT Mint (checksum on-chain)",
          description: "Commits a SHA-256 checksum of your digital asset in OP_RETURN using the bracket format from the first Dogecoin NFT experiment (13 Dec 2021). Anyone can re-hash your file and compare to the on-chain record. This is a proof-of-existence mint, not an ERC-721 style transferable token.",
          asm,
          hex,
          type: "op_return",
          dataHex: payload,
          steps: [
            "Upload your image or paste the SHA-256 of the asset.",
            "Review the OP_RETURN line: format is `[checksum]` inside the output (66 bytes).",
            "Sign TX tab \u2192 broadcast the mint transaction (~0.01 DOGE + fee is typical).",
            "Share the txid; verifiers re-hash the file and match against `[sha256]` on-chain.",
            "Optional: keep the creator UTXO in the same tx as the historic mint (small DOGE output to your address)."
          ],
          meta: {
            nft: {
              sha256: hash,
              opReturnAscii,
              name: params.name || null,
              author: params.author || null,
              historicTxid,
              historicDate: "2021-12-13",
              tweetUrl,
              blockchairUrl: `https://blockchair.com/dogecoin/transaction/${historicTxid}`
            }
          },
          rpc: buildOpReturnRpc(payload, network)
        };
      }
    },
    {
      id: "document-commit",
      category: "data",
      icon: "description",
      title: "Document Authenticity Seal",
      tagline: "Timestamp a document hash with author note",
      fields: [
        { id: "document", label: "Document text or paste hash", type: "textarea", required: true },
        { id: "author", label: "Author / org", type: "text", placeholder: "Shibe Labs" }
      ],
      async build(params, network) {
        const isHash = /^[0-9a-fA-F]{64}$/.test(params.document.trim());
        const hash = isHash ? params.document.trim().toLowerCase() : await sha256Hex(params.document);
        const note = params.author || "anonymous";
        const payload = textToHex(`DOGEDOC|${hash}|${note}`);
        const asm = `OP_RETURN ${payload}`;
        const hex = bytesToHex(asmToScript(asm));
        return {
          title: "Document Authenticity Seal",
          description: "On-chain proof that a specific document (by hash) was committed at broadcast time.",
          asm,
          hex,
          type: "op_return",
          steps: [
            "Share the document hash with verifiers.",
            "Anyone can hash the original file/text and compare to your on-chain record.",
            "Block timestamp acts as a decentralized timestamp."
          ],
          rpc: buildOpReturnRpc(payload, network),
          meta: { sha256: hash, author: note }
        };
      }
    },
    {
      id: "pqc-commitment",
      category: "quantum",
      icon: "security",
      title: "Post-Quantum Commitment (OP_RETURN)",
      tagline: "Publish a Phase 1 PQ signature commitment on-chain (FLC1, DIL2, RCG4)",
      fields: [
        {
          id: "scheme",
          label: "PQ algorithm",
          type: "select",
          options: PQC_SCHEME_OPTIONS,
          default: "falcon",
          required: true
        },
        {
          id: "pubkey",
          label: "Public key bytes (hex)",
          type: "textarea",
          placeholder: "Paste Falcon / Dilithium / Raccoon public key hex from libdogecoin or your signer",
          required: true
        },
        {
          id: "signature",
          label: "Signature bytes (hex)",
          type: "textarea",
          placeholder: "Paste PQ signature hex (message should be tx sighash32 for production binds)",
          required: true
        }
      ],
      async build(params, network) {
        const schemeId = params.scheme || "falcon";
        const scheme = getPqcScheme(schemeId);
        if (!isValidHexBytes(params.pubkey)) throw new Error("Enter valid public key hex (even length)");
        if (!isValidHexBytes(params.signature)) throw new Error("Enter valid signature hex (even length)");
        const { commitmentHex, pkLen, sigLen, pkPrefix, sigPrefix } = await computePqcCommitment(
          params.pubkey,
          params.signature
        );
        const dataHex = buildPqcDataHex(schemeId, commitmentHex);
        const asm = buildPqcOpReturnAsm(schemeId, commitmentHex);
        const hex = buildPqcOpReturnScriptHex(schemeId, commitmentHex);
        return {
          title: `Post-Quantum Commitment (${scheme.tag})`,
          description: "Phase 1 OP_RETURN commitment: SHA256(public_key || signature) in canonical tagged form. Parallel evidence alongside secp256k1 spend authorization until Phase 2 opcode validation.",
          asm,
          hex,
          type: "pqc_commitment",
          dataHex,
          scriptWireHex: hex,
          steps: [
            "Sign the base transaction with secp256k1 (existing wallet path), using tx sighash32 as the PQ message when binding to a spend.",
            `Generate PQ signature over message32 with libdogecoin (such -c ${schemeId === "falcon" ? "falcon" : schemeId === "dilithium" ? "dilithium2" : "raccoong"}_sign -x <sighash>).`,
            "Confirm commitment32 = SHA256(pk || sig) matches the value below.",
            "Sign TX tab \u2192 broadcast OP_RETURN commitment (TX_C). Optionally add P2SH carrier outputs for full on-chain reveal (TX_R).",
            "Verify carrier proofs with the PQC Carrier Proof template or Such Quantum verifier."
          ],
          meta: {
            pqc: {
              schemeId,
              schemeLabel: scheme.label,
              tag: scheme.tag,
              carrierTag: scheme.carrierTag,
              commitmentHex,
              pkLen,
              sigLen,
              pkPrefix,
              sigPrefix,
              bipUrl: PQC_BIP_URL,
              verifierUrl: SUCHQUANTUM_URL
            }
          },
          rpc: buildOpReturnRpc(dataHex, network)
        };
      }
    },
    {
      id: "pqc-carrier-proof",
      category: "quantum",
      icon: "verified_user",
      title: "PQC Carrier Proof Verification",
      tagline: "Verify TX_C OP_RETURN commitment against TX_R P2SH carrier reveal",
      fields: [
        {
          id: "txc",
          label: "TX_C raw hex (commitment tx)",
          type: "textarea",
          placeholder: "01000000\u2026 includes OP_RETURN + optional P2SH carrier outputs",
          required: true
        },
        {
          id: "txr",
          label: "TX_R raw hex (reveal tx)",
          type: "textarea",
          placeholder: "01000000\u2026 spends carrier outputs with FLC1FULL|DIL2FULL|RCG4FULL scriptSig",
          required: true
        }
      ],
      async build(params) {
        const verification = await verifyPqcCarrierCommitment(params.txc, params.txr);
        return {
          title: "PQC Carrier Proof: Valid",
          description: "Phase 1 carrier commitment validation passed: SHA256(pk || sig) from TX_R matches the canonical tagged OP_RETURN on TX_C.",
          type: "pqc_verify",
          verification,
          steps: [
            "Commitment-only mode: OP_RETURN on TX_C is enough for SPV detection.",
            "Carrier mode: TX_C adds P2SH outputs; TX_R reveals pk||sig in carrier scriptSig.",
            "Full PQ signature verification over tx sighash32 requires libdogecoin, DogeGo SPV, or Such Quantum (Falcon in-browser).",
            `Draft spec: ${PQC_BIP_URL}`
          ],
          meta: {
            pqc: verification,
            bipUrl: PQC_BIP_URL,
            verifierUrl: SUCHQUANTUM_URL
          }
        };
      }
    },
    {
      id: "treasure-hunt",
      category: "games",
      icon: "emoji_events",
      title: "Treasure Hunt (Hash Lock)",
      tagline: "Whoever reveals the correct preimage claims the DOGE",
      fields: [
        { id: "secret", label: "Secret answer / passphrase", type: "text", placeholder: "Leave empty to auto-generate", required: false },
        { id: "pubkey", label: "Winner Dogecoin address (optional)", type: "doge-address", placeholder: "D\u2026 or n\u2026: leave empty for anyone with secret" },
        { id: "reward", label: "Reward label", type: "text", default: "100 DOGE bounty", placeholder: "100 DOGE" }
      ],
      async build(params, network) {
        const secret = params.secret?.trim() || randomSecret(12);
        const secretHex = textToHex(secret);
        const h160 = await hash160Hex(secret);
        let asm;
        if (params.pubkey?.trim()) {
          const check = await resolveChecksigAsm(params.pubkey, network);
          asm = `OP_HASH160 ${h160} OP_EQUALVERIFY ${check.asm}`;
        } else {
          asm = `OP_HASH160 ${h160} OP_EQUAL`;
        }
        const hex = bytesToHex(asmToScript(asm));
        const address = await p2shAddressFromScript(hex, network);
        return {
          title: "Treasure Hunt: Hash Lock",
          description: "Send DOGE to the P2SH address. First person to spend it must provide the secret in the unlocking script. Share clues publicly; keep the secret for the winner!",
          asm,
          hex,
          redeemScript: asm,
          address,
          type: "p2sh",
          steps: [
            `Sign TX \u2192 Fund the P2SH address with ${params.reward || "DOGE"}.`,
            "Publish clues leading to the secret passphrase.",
            "Winner uses Sign TX \u2192 Claim with the preimage to spend.",
            "First valid broadcast on the network wins!"
          ],
          meta: {
            secret,
            secretHex,
            hash160: h160,
            reward: params.reward,
            warning: "Store the secret securely until you want someone to win. Anyone with the secret can claim funds."
          }
        };
      }
    },
    {
      id: "public-bounty",
      category: "games",
      icon: "paid",
      title: "Public Bounty Coin",
      tagline: "Open bounty: first solver with the secret spends it",
      fields: [
        { id: "challenge", label: "Challenge description", type: "textarea", required: true },
        { id: "answer", label: "Answer (preimage)", type: "text", required: true }
      ],
      async build(params, network) {
        const secret = params.answer.trim();
        const h160 = await hash160Hex(secret);
        const asm = `OP_HASH160 ${h160} OP_EQUAL`;
        const hex = bytesToHex(asmToScript(asm));
        const address = await p2shAddressFromScript(hex, network);
        const cluePayload = textToHex(`DOGEBOUNTY|${params.challenge.slice(0, 200)}`);
        return {
          title: "Public Bounty",
          description: "Classic hash-lock bounty. Fund the address; publish the challenge via OP_RETURN clue tx separately.",
          asm,
          hex,
          address,
          type: "p2sh",
          clueAsm: `OP_RETURN ${cluePayload}`,
          steps: [
            "Fund the P2SH bounty address.",
            "Optionally broadcast an OP_RETURN tx with the challenge text (second RPC).",
            "First person to solve and broadcast a spend wins."
          ],
          rpc: {
            fund: buildP2shFundingRpc(address, network),
            clue: buildOpReturnRpc(cluePayload, network)
          },
          meta: { challenge: params.challenge, hash160: h160 }
        };
      }
    },
    {
      id: "first-to-solve",
      category: "games",
      icon: "bolt",
      title: "First to Solve Wins",
      tagline: "Race: secret X + valid signature claims the reward",
      fields: [
        { id: "secret", label: "Secret X", type: "text", required: true },
        { id: "pubkey", label: "Required signer Dogecoin address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "reward", label: "Reward amount note", type: "text", default: "500 DOGE" }
      ],
      async build(params, network) {
        const h160 = await hash160Hex(params.secret);
        const check = await resolveChecksigAsm(params.pubkey, network);
        const asm = `OP_HASH160 ${h160} OP_EQUALVERIFY ${check.asm}`;
        const hex = bytesToHex(asmToScript(asm));
        const address = await p2shAddressFromScript(hex, network);
        return {
          title: "First-to-Solve Signature Race",
          description: 'Requires BOTH the secret preimage AND a valid signature from the specified pubkey. Useful for "prove you solved it AND control this key" contests.',
          asm,
          hex,
          address,
          type: "p2sh",
          steps: [
            `Lock ${params.reward} at the P2SH address.`,
            "Publish puzzle; contestants race to find secret X.",
            "Spending scriptSig order: <sig> <pubkey> <secret_hex>",
            "Network confirms first valid tx: that winner takes all."
          ],
          meta: { secret: params.secret, hash160: h160, signer: check },
          rpc: buildP2shFundingRpc(address, network)
        };
      }
    },
    {
      id: "geocache",
      category: "games",
      icon: "explore",
      title: "Dogecoin Geocache",
      tagline: "Chain OP_RETURN clues to a final hash-lock prize",
      fields: [
        { id: "clue1", label: "Clue #1 (broadcast first)", type: "textarea", required: true },
        { id: "clue2", label: "Clue #2", type: "textarea", required: false },
        { id: "finalSecret", label: "Final location secret", type: "text", required: true },
        { id: "hint", label: "Theme / geocache name", type: "text", default: "Doge Geocache" }
      ],
      async build(params, network) {
        const h160 = await hash160Hex(params.finalSecret);
        const prizeAsm = `OP_HASH160 ${h160} OP_EQUAL`;
        const prizeHex = bytesToHex(asmToScript(prizeAsm));
        const prizeAddress = await p2shAddressFromScript(prizeHex, network);
        const clues = [params.clue1, params.clue2].filter(Boolean);
        const clueTxs = clues.map((c, i) => {
          const payload = textToHex(`DOGEGC|${i + 1}|${c}`);
          return { asm: `OP_RETURN ${payload}`, rpc: buildOpReturnRpc(payload, network) };
        });
        return {
          title: "Dogecoin Geocache Adventure",
          description: "Real-world or digital ARG: scatter OP_RETURN clues on-chain; final clue leads to secret that unlocks the prize address.",
          asm: prizeAsm,
          hex: prizeHex,
          address: prizeAddress,
          type: "geocache",
          clues: clueTxs,
          steps: [
            "Broadcast clue transactions in order (each OP_RETURN).",
            "Fund the prize P2SH address with DOGE.",
            "Players follow clues \u2192 discover final secret \u2192 claim prize.",
            "Perfect for IRL geocaching with blockchain proof of hunt!"
          ],
          meta: { theme: params.hint, clueCount: clues.length, finalHash160: h160 },
          rpc: { prize: buildP2shFundingRpc(prizeAddress, network), clues: clueTxs.map((c) => c.rpc) }
        };
      }
    },
    {
      id: "ctf-flag",
      category: "games",
      icon: "flag",
      title: "Capture the Flag",
      tagline: "CTF-style flag hash unlocks the coin",
      fields: [
        { id: "flag", label: "Flag string (e.g. DOGE{...})", type: "text", required: true },
        { id: "teamPubkey", label: "Authorized team address (optional)", type: "doge-address", placeholder: "D\u2026 or n\u2026" }
      ],
      async build(params, network) {
        const h160 = await hash160Hex(params.flag);
        let asm;
        if (params.teamPubkey?.trim()) {
          const check = await resolveChecksigAsm(params.teamPubkey, network);
          asm = `OP_HASH160 ${h160} OP_EQUALVERIFY ${check.asm}`;
        } else {
          asm = `OP_HASH160 ${h160} OP_EQUAL`;
        }
        const hex = bytesToHex(asmToScript(asm));
        const address = await p2shAddressFromScript(hex, network);
        const payload = textToHex(`DOGECTF|Capture the flag! Hash locks the prize.`);
        return {
          title: "Capture the Flag Challenge",
          description: "Hide the flag in your CTF infrastructure; on-chain reward for whoever submits it first.",
          asm,
          hex,
          address,
          type: "p2sh",
          steps: [
            "Deploy CTF challenges in your infra.",
            "Fund the P2SH address as the flag prize.",
            "Announce the bounty OP_RETURN marker tx.",
            "First valid flag submission on-chain wins."
          ],
          rpc: {
            marker: buildOpReturnRpc(payload, network),
            fund: buildP2shFundingRpc(address, network)
          },
          meta: { flagFormat: "hash160(flag)", hash160: h160 }
        };
      }
    },
    {
      id: "puzzle-artifact",
      category: "games",
      icon: "extension",
      title: "Puzzle Artifact",
      tagline: "Provably locked coin until puzzle is solved",
      fields: [
        { id: "puzzleType", label: "Lock type", type: "select", options: ["quote", "math", "riddle"], default: "riddle" },
        { id: "puzzle", label: "Puzzle prompt (shown publicly)", type: "textarea", required: true },
        { id: "answer", label: "Answer (kept secret until solved)", type: "text", required: true }
      ],
      async build(params, network) {
        const answer = params.answer.trim();
        let asm;
        let hashNote;
        if (params.puzzleType === "quote") {
          const h = await sha256Hex(answer);
          asm = `OP_SHA256 ${h} OP_EQUAL`;
          hashNote = `SHA256("${answer}")`;
        } else {
          const h160 = await hash160Hex(answer);
          asm = `OP_HASH160 ${h160} OP_EQUAL`;
          hashNote = `HASH160("${answer}")`;
        }
        const hex = bytesToHex(asmToScript(asm));
        const address = await p2shAddressFromScript(hex, network);
        const payload = textToHex(`DOGEPUZZLE|${params.puzzleType}|${params.puzzle.slice(0, 180)}`);
        return {
          title: `Puzzle Artifact (${params.puzzleType})`,
          description: "A provably spendable artifact: the coins cannot move until someone provides the answer matching the on-chain hash.",
          asm,
          hex,
          address,
          type: "p2sh",
          steps: [
            "Publish puzzle text via OP_RETURN (optional but fun).",
            "Lock DOGE in the artifact address.",
            "Artifact remains until preimage appears in a spending transaction."
          ],
          rpc: {
            puzzle: buildOpReturnRpc(payload, network),
            fund: buildP2shFundingRpc(address, network)
          },
          meta: { puzzleType: params.puzzleType, hashNote, puzzle: params.puzzle }
        };
      }
    },
    {
      id: "timelock",
      category: "locks",
      icon: "schedule",
      title: "Time-Locked Coins",
      tagline: "Coins unlock only after a chosen date",
      fields: [
        { id: "unlockDate", label: "Unlock date & time (UTC)", type: "datetime-local", required: true },
        { id: "pubkey", label: "Your Dogecoin address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" },
        { id: "emergencyPubkey", label: "Emergency address (spend anytime)", type: "doge-address", required: false, placeholder: "D\u2026 or n\u2026" }
      ],
      async build(params, network) {
        const locktime = Math.floor(new Date(params.unlockDate).getTime() / 1e3);
        if (Number.isNaN(locktime)) throw new Error("Invalid date");
        const main = await resolveChecksigAsm(params.pubkey, network);
        let asm;
        if (params.emergencyPubkey?.trim()) {
          const emerg = await resolveChecksigAsm(params.emergencyPubkey, network);
          const ltPush = locktimeToPush(locktime);
          asm = `OP_IF ${ltPush} OP_CHECKLOCKTIMEVERIFY OP_DROP ${main.asm} OP_ELSE ${emerg.asm} OP_ENDIF`;
        } else {
          const pkg = await cltvScript(locktime, params.pubkey, network);
          asm = pkg.asm;
        }
        const hex = bytesToHex(asmToScript(asm));
        const address = await p2shAddressFromScript(hex, network);
        return {
          title: "Time-Locked Wallet",
          description: "Uses OP_CHECKLOCKTIMEVERIFY (BIP65). Transaction nLockTime must be >= locktime when spending the IF branch.",
          asm,
          hex,
          address,
          type: "p2sh",
          steps: [
            "Send DOGE to the P2SH address.",
            `After ${params.unlockDate} UTC, spend using IF branch with nLockTime set.`,
            "Set nLockTime on the spending transaction to the locktime value.",
            params.emergencyPubkey ? "Emergency key can spend via ELSE branch anytime." : ""
          ].filter(Boolean),
          meta: {
            locktime,
            locktimeHex: locktime.toString(16),
            unlockDate: params.unlockDate,
            note: "For timestamps > 500000000, nLockTime is interpreted as UNIX time."
          },
          rpc: buildP2shFundingRpc(address, network)
        };
      }
    },
    {
      id: "time-capsule",
      category: "locks",
      icon: "inventory_2",
      title: "Time Capsule",
      tagline: "Message + coins locked until a future date",
      fields: [
        { id: "message", label: "Capsule message", type: "textarea", required: true },
        { id: "unlockDate", label: "Open date (UTC)", type: "datetime-local", required: true },
        { id: "pubkey", label: "Your Dogecoin address", type: "doge-address", required: true, placeholder: "D\u2026 or n\u2026" }
      ],
      async build(params, network) {
        const locktime = Math.floor(new Date(params.unlockDate).getTime() / 1e3);
        const pkg = await cltvScript(locktime, params.pubkey, network);
        const asm = pkg.asm;
        const hex = bytesToHex(asmToScript(asm));
        const address = await p2shAddressFromScript(hex, network);
        const payload = textToHex(`DOGETIME|${params.message.slice(0, 200)}|opens:${params.unlockDate}`);
        return {
          title: "Time Capsule",
          description: "Combine an on-chain message (OP_RETURN) with a CLTV-locked UTXO. Future you (or heirs) opens both on the unlock date.",
          asm,
          hex,
          address,
          capsuleAsm: `OP_RETURN ${payload}`,
          type: "timelock",
          steps: [
            "Broadcast OP_RETURN with your capsule message.",
            "Fund the time-locked P2SH address.",
            "On unlock date, spend with appropriate nLockTime."
          ],
          rpc: {
            message: buildOpReturnRpc(payload, network),
            fund: buildP2shFundingRpc(address, network)
          },
          meta: { message: params.message, locktime, unlockDate: params.unlockDate }
        };
      }
    },
    {
      id: "multisig",
      category: "social",
      icon: "family_restroom",
      title: "Multi-Sig Vault",
      tagline: "Family vault or shared project funds (M-of-N)",
      fields: [
        { id: "required", label: "Signatures required (M)", type: "number", default: 2, min: 1, max: 15 },
        { id: "pubkey1", label: "Signer 1 pubkey (hex)", type: "text", required: true, placeholder: "02\u2026 from validateaddress" },
        { id: "pubkey2", label: "Signer 2 pubkey (hex)", type: "text", required: true, placeholder: "02\u2026" },
        { id: "pubkey3", label: "Signer 3 pubkey (hex, optional)", type: "text", placeholder: "02\u2026" },
        { id: "pubkey4", label: "Signer 4 pubkey (hex, optional)", type: "text", placeholder: "02\u2026" },
        { id: "vaultName", label: "Vault name", type: "text", default: "Family Vault" }
      ],
      async build(params, network) {
        const m = parseInt(params.required, 10) || 2;
        const keys = [params.pubkey1, params.pubkey2, params.pubkey3, params.pubkey4].filter((k) => k?.trim());
        const resolvedKeys = keys.map(resolveMultisigPubkey);
        if (resolvedKeys.length < m) throw new Error("Need at least M public keys");
        if (m > resolvedKeys.length) throw new Error("M cannot exceed number of keys");
        const mOp = pushNumberOpcode(m);
        const nOp = pushNumberOpcode(resolvedKeys.length);
        const asm = `${mOp} ${resolvedKeys.join(" ")} ${nOp} OP_CHECKMULTISIG`;
        const hex = bytesToHex(asmToScript(asm));
        const address = await p2shAddressFromScript(hex, network);
        return {
          title: `${m}-of-${resolvedKeys.length} Multi-Sig: ${params.vaultName}`,
          description: "Classic multisig redeem script. Spending requires M valid signatures from the N keys.",
          asm,
          hex,
          address,
          type: "multisig",
          steps: [
            "Each participant generates a keypair and shares their pubkey (hex).",
            "Fund the P2SH multisig address.",
            "To spend: collect M signatures, build scriptSig: OP_0 <sig1> <sig2> ... <redeemScript>.",
            "Or use createmultisig / addmultisigaddress in Dogecoin Core wallet."
          ],
          rpc: {
            createmultisig: {
              method: "createmultisig",
              params: [m, resolvedKeys],
              note: "Dogecoin Core can create the same address from pubkeys."
            },
            fund: buildP2shFundingRpc(address, network)
          },
          meta: { m, n: resolvedKeys.length, pubkeys: resolvedKeys, vaultName: params.vaultName }
        };
      }
    },
    {
      id: "opcode-playground",
      category: "explore",
      icon: "build",
      title: "Opcode Playground",
      tagline: "Build custom scripts with OP_DUP, OP_IF, hashes & more",
      fields: [
        { id: "customAsm", label: "Script ASM", type: "asm-badges", default: "OP_DUP OP_HASH160 abcd OP_EQUALVERIFY OP_CHECKSIG", required: true }
      ],
      async build(params, network) {
        const asm = params.customAsm.trim();
        const hex = bytesToHex(asmToScript(asm));
        let address = null;
        try {
          address = await p2shAddressFromScript(hex, network);
        } catch {
        }
        return {
          title: "Custom Opcode Script",
          description: "Experiment with Dogecoin script opcodes. Learn how the stack machine verifies spending conditions.",
          asm,
          hex,
          address,
          type: "custom",
          steps: [
            "Edit ASM using opcode names and hex push data.",
            "Use decodescript on Dogecoin Core to verify.",
            "If valid P2SH, fund the generated address.",
            "Test on testnet/regtest before mainnet!"
          ],
          rpc: address ? buildP2shFundingRpc(address, network) : { decodescript: { method: "decodescript", params: [hex] } },
          meta: { editable: true }
        };
      }
    },
    ...DEFI_TEMPLATES,
    ...UNLOCK_TEMPLATES
  ];
  function locktimeToPush(locktime) {
    if (locktime >= 1 && locktime <= 16) return pushNumberOpcode(locktime);
    const hex = locktime.toString(16);
    const padded = hex.length % 2 ? "0" + hex : hex;
    const bytes = padded.match(/../g).reverse().join("");
    return bytes;
  }
  function buildOpReturnRpc(dataHex, network) {
    const port = networkRpcPort(network);
    return {
      network,
      port,
      steps: ["createrawtransaction", "signrawtransaction", "sendrawtransaction"],
      createrawtransaction: {
        method: "createrawtransaction",
        params: [
          [{ txid: "YOUR_INPUT_TXID", vout: 0 }],
          { data: dataHex }
        ],
        curl: `curl -u user:pass -d '{"method":"createrawtransaction","params":[[{"txid":"INPUT_TXID","vout":0}],{"data":"${dataHex}"}]}' http://127.0.0.1:${port}/`
      },
      decodescript: {
        method: "decodescript",
        params: [bytesToHex(asmToScript(`OP_RETURN ${dataHex}`))]
      }
    };
  }
  function buildP2shFundingRpc(address, network) {
    const port = networkRpcPort(network);
    return {
      network,
      note: `Send DOGE to ${address}`,
      sendtoaddress: {
        method: "sendtoaddress",
        params: [address, "AMOUNT_DOGE"],
        curl: `curl -u user:pass -d '{"method":"sendtoaddress","params":["${address}",10.0]}' http://127.0.0.1:${port}/`
      }
    };
  }
  function getTemplate(id) {
    return TEMPLATES.find((t) => t.id === id);
  }

  // js/code-view.js
  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function formatCodeLines(text, wrapAt = 80) {
    const s = String(text ?? "").replace(/\r\n/g, "\n");
    if (!s) return [""];
    if (s.includes("\n")) {
      return s.split("\n");
    }
    if (s.length <= wrapAt) return [s];
    const lines = [];
    for (let i = 0; i < s.length; i += wrapAt) {
      lines.push(s.slice(i, i + wrapAt));
    }
    return lines;
  }
  function renderCodeView(text, id, { title = "Output", wrapAt = 80, className = "" } = {}) {
    const lines = formatCodeLines(text, wrapAt);
    const raw = lines.join("\n");
    const rows = lines.map((line, i) => `
    <div class="code-view__row">
      <span class="code-view__ln" aria-hidden="true">${i + 1}</span>
      <code class="code-view__line">${escapeHtml(line) || " "}</code>
    </div>
  `).join("");
    return `
    <div class="code-view ${className}" data-code-view="${id}">
      <div class="code-view__header">
        <span class="code-view__title">${escapeHtml(title)}</span>
        <span class="code-view__meta">${lines.length} line${lines.length === 1 ? "" : "s"}</span>
        <button type="button" class="code-view__copy" data-copy-id="${id}" title="Copy to clipboard">
          <span class="material-icons">content_copy</span>
          <span class="code-view__copy-label">Copy</span>
        </button>
      </div>
      <div class="code-view__body">
        <div class="code-view__rows">${rows}</div>
      </div>
      <textarea id="code-${id}" class="code-view__source" hidden readonly>${escapeHtml(raw)}</textarea>
    </div>
  `;
  }
  function bindCodeViews(root = document, onCopy) {
    if (!root) return;
    root.querySelectorAll("[data-copy-id]").forEach((btn) => {
      if (btn.dataset.copyBound) return;
      btn.dataset.copyBound = "1";
      btn.addEventListener("click", async () => {
        const id = btn.dataset.copyId;
        const source = document.getElementById(`code-${id}`);
        const text = source?.value ?? source?.textContent ?? "";
        if (!text) return;
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        const label = btn.querySelector(".code-view__copy-label");
        const icon = btn.querySelector(".material-icons");
        if (label) label.textContent = "Copied!";
        if (icon) icon.textContent = "check";
        btn.classList.add("code-view__copy--done");
        onCopy?.(text);
        setTimeout(() => {
          if (label) label.textContent = "Copy";
          if (icon) icon.textContent = "content_copy";
          btn.classList.remove("code-view__copy--done");
        }, 2e3);
      });
    });
    root.querySelectorAll("[data-copy-target]").forEach((btn) => {
      if (btn.dataset.copyBound) return;
      btn.dataset.copyBound = "1";
      btn.addEventListener("click", () => {
        const text = document.getElementById(btn.dataset.copyTarget)?.textContent;
        if (text) {
          navigator.clipboard.writeText(text).catch(() => {
          });
        }
      });
    });
  }

  // js/opcode-badges.js
  function tokenizeAsm(asm) {
    if (!asm || !String(asm).trim()) return [];
    return String(asm).replace(/\n/g, " ").split(/\s+/).map((t) => t.trim()).filter(Boolean).map((value) => ({
      type: value.startsWith("OP_") || value === "OP_0" || /^-?\d+$/.test(value) ? "opcode" : "data",
      value
    }));
  }
  function tokensToAsm(tokens) {
    return tokens.map((t) => t.value).join(" ");
  }
  function renderOpcodePalette(extraClass = "") {
    const ops = EXPLORER_OPCODES.map((o) => o.name);
    return `
    <div class="opcode-palette ${extraClass}" data-opcode-palette>
      <span class="opcode-palette-label">OP_CODES</span>
      ${ops.map((name) => `
        <span class="opcode-badge opcode-badge--op opcode-badge--palette"
              draggable="true" data-drag-op="${name}" title="Drag into script">${name}</span>
      `).join("")}
      <span class="opcode-badge opcode-badge--data opcode-badge--palette"
            draggable="true" data-drag-data="true" title="Drag to add custom hex push">+ data</span>
    </div>
  `;
  }
  function renderOpcodeBadgeStack(tokens, { id = "asm", editable = true, showPalette = false } = {}) {
    const badges = tokens.map((t, i) => renderOpcodeBadge(t, i, editable)).join("");
    return `
    <div class="opcode-script-wrap" data-asm-wrap="${id}">
      ${showPalette ? renderOpcodePalette("opcode-palette--inline") : ""}
      <div class="opcode-script-stack ${editable ? "opcode-script-stack--editable" : ""}"
           data-stack-id="${id}" data-editable="${editable ? "1" : ""}">
        ${badges || (editable ? '<span class="opcode-drop-hint">Drop OP_CODES here or drag from palette</span>' : "")}
      </div>
      ${editable ? '<p class="opcode-hint muted">Drag badges to reorder \xB7 double-click data to edit \xB7 drop palette items to add</p>' : ""}
    </div>
  `;
  }
  function renderOpcodeBadge(token, index, editable) {
    const cls = token.type === "opcode" ? "opcode-badge--op" : "opcode-badge--data";
    return `
    <span class="opcode-badge ${cls}"
          draggable="${editable ? "true" : "false"}"
          data-index="${index}"
          data-token-type="${token.type}"
          title="${editable ? "Drag to reorder" : ""}">${escapeHtml2(token.value)}</span>
  `;
  }
  function escapeHtml2(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function appendStackToken(stack, token) {
    if (!stack) return;
    const tokens = getStackTokens(stack);
    tokens.push(token);
    applyStackTokens(stack, tokens, stack.dataset.stackId);
  }
  function findStackForPalette(palette) {
    const section = palette.closest(".playground-section, .asm-field-editor, .asm-block, [data-asm-wrap]");
    return section?.querySelector(".opcode-script-stack--editable") || null;
  }
  function bindOpcodeBadgeUI(root = document) {
    if (!root) return;
    root.querySelectorAll("[data-opcode-palette]").forEach((palette) => {
      palette.querySelectorAll('[draggable="true"]').forEach((el) => {
        if (el.dataset.paletteBound) return;
        el.dataset.paletteBound = "1";
        el.addEventListener("dragstart", (e) => {
          if (el.dataset.dragOp) {
            e.dataTransfer.setData("application/x-opcode", el.dataset.dragOp);
          } else if (el.dataset.dragData) {
            e.dataTransfer.setData("application/x-opcode-data", "1");
          }
          e.dataTransfer.effectAllowed = "copy";
        });
        el.addEventListener("click", () => {
          const stack = findStackForPalette(palette);
          if (!stack) return;
          if (el.dataset.dragOp) {
            appendStackToken(stack, { type: "opcode", value: el.dataset.dragOp });
          } else if (el.dataset.dragData) {
            const hex = prompt("Enter hex push data (even length):", "abcd");
            if (hex && /^[0-9a-fA-F]*$/.test(hex) && hex.length % 2 === 0) {
              appendStackToken(stack, { type: "data", value: hex.toLowerCase() });
            }
          }
        });
      });
    });
    root.querySelectorAll(".opcode-script-stack--editable").forEach((stack) => {
      bindStack(stack);
    });
    root.querySelectorAll(".opcode-card[data-op]").forEach((card) => {
      if (card.dataset.cardBound) return;
      card.dataset.cardBound = "1";
      card.setAttribute("draggable", "true");
      card.addEventListener("dragstart", (e) => {
        if (e.target.closest("button")) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("application/x-opcode", card.dataset.op);
        e.dataTransfer.effectAllowed = "copy";
      });
      card.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        const stack = document.querySelector('[data-stack-id="playground-asm"]');
        if (!stack) return;
        appendStackToken(stack, { type: "opcode", value: card.dataset.op });
      });
    });
  }
  function bindStack(stack) {
    if (stack.dataset.bound) return;
    stack.dataset.bound = "1";
    stack.addEventListener("dragstart", (e) => {
      const badge = e.target.closest(".opcode-badge:not(.opcode-badge--palette)");
      if (!badge || !stack.contains(badge)) return;
      e.dataTransfer.setData("application/x-badge-index", badge.dataset.index);
      e.dataTransfer.effectAllowed = "move";
      badge.classList.add("opcode-badge--dragging");
    });
    stack.addEventListener("dragend", (e) => {
      e.target.closest(".opcode-badge")?.classList.remove("opcode-badge--dragging");
    });
    stack.addEventListener("dragover", (e) => {
      e.preventDefault();
      const types = [...e.dataTransfer.types || []];
      const isCopy = types.includes("application/x-opcode") || types.includes("application/x-opcode-data");
      e.dataTransfer.dropEffect = isCopy ? "copy" : "move";
      stack.classList.add("opcode-script-stack--over");
    });
    stack.addEventListener("dragleave", () => {
      stack.classList.remove("opcode-script-stack--over");
    });
    stack.addEventListener("drop", (e) => {
      e.preventDefault();
      stack.classList.remove("opcode-script-stack--over");
      const stackId = stack.dataset.stackId;
      const tokens = getStackTokens(stack);
      const newOp = e.dataTransfer.getData("application/x-opcode");
      const isData = e.dataTransfer.getData("application/x-opcode-data");
      const fromIdx = e.dataTransfer.getData("application/x-badge-index");
      if (newOp) {
        tokens.push({ type: "opcode", value: newOp });
        applyStackTokens(stack, tokens, stackId);
        return;
      }
      if (isData) {
        const hex = prompt("Enter hex push data (even length):", "abcd");
        if (hex && /^[0-9a-fA-F]*$/.test(hex) && hex.length % 2 === 0) {
          tokens.push({ type: "data", value: hex.toLowerCase() });
          applyStackTokens(stack, tokens, stackId);
        }
        return;
      }
      if (fromIdx !== "") {
        const from = parseInt(fromIdx, 10);
        const badge = e.target.closest(".opcode-badge:not(.opcode-badge--palette)");
        let to = tokens.length;
        if (badge && stack.contains(badge)) {
          to = parseInt(badge.dataset.index, 10);
        }
        if (from === to || Number.isNaN(from)) return;
        const [item] = tokens.splice(from, 1);
        const insertAt = from < to ? to - 1 : to;
        tokens.splice(insertAt, 0, item);
        applyStackTokens(stack, tokens, stackId);
      }
    });
    stack.addEventListener("dblclick", (e) => {
      const badge = e.target.closest(".opcode-badge--data:not(.opcode-badge--palette)");
      if (!badge) return;
      const idx = parseInt(badge.dataset.index, 10);
      const tokens = getStackTokens(stack);
      const hex = prompt("Edit hex push data:", tokens[idx]?.value || "");
      if (hex && /^[0-9a-fA-F]*$/.test(hex) && hex.length % 2 === 0) {
        tokens[idx].value = hex.toLowerCase();
        applyStackTokens(stack, tokens, stack.dataset.stackId);
      }
    });
  }
  function getStackTokens(stack) {
    return [...stack.querySelectorAll(".opcode-badge:not(.opcode-badge--palette)")].map((el) => ({
      type: el.classList.contains("opcode-badge--data") ? "data" : "opcode",
      value: el.textContent.trim()
    }));
  }
  function applyStackTokens(stack, tokens, stackId) {
    const asm = tokensToAsm(tokens);
    stack.innerHTML = tokens.length ? tokens.map((t, i) => renderOpcodeBadge(t, i, true)).join("") : '<span class="opcode-drop-hint">Drop OP_CODES here or drag from palette</span>';
    const hidden = document.getElementById(`f-${stackId}`) || document.getElementById(stackId) || document.getElementById(`code-${stackId}`);
    if (hidden) {
      if (hidden.tagName === "TEXTAREA" || hidden.tagName === "INPUT") {
        hidden.value = asm;
      } else {
        hidden.textContent = asm;
      }
    }
    const wrap = stack.closest("[data-asm-wrap]") || stack.closest(".asm-block");
    const codeView = wrap?.querySelector(`[data-code-view="${stackId}"]`) || wrap?.querySelector(".code-view");
    if (codeView) {
      const lines = formatCodeLines(asm, 96);
      const rows = codeView.querySelector(".code-view__rows");
      const meta = codeView.querySelector(".code-view__meta");
      if (rows) {
        rows.innerHTML = lines.map((line, i) => `
        <div class="code-view__row">
          <span class="code-view__ln" aria-hidden="true">${i + 1}</span>
          <code class="code-view__line">${escapeHtml2(line) || " "}</code>
        </div>
      `).join("");
      }
      if (meta) meta.textContent = `${lines.length} line${lines.length === 1 ? "" : "s"}`;
    }
    wrap?.dispatchEvent(new CustomEvent("asm-changed", { bubbles: true, detail: { id: stackId, asm } }));
  }
  function asmBlock(asm, id, { editable = false, showPalette = false, title = "Script ASM" } = {}) {
    const tokens = tokenizeAsm(asm);
    return `
    <div class="asm-block">
      ${renderCodeView(asm, id, { title, wrapAt: 96, className: "code-view--asm-toolbar" })}
      <div class="asm-block__badges">
        ${renderOpcodeBadgeStack(tokens, { id, editable, showPalette })}
      </div>
    </div>
  `;
  }

  // js/ui.js
  function initConnectionBar() {
    const bar = document.getElementById("connection-bar");
    if (!bar) return;
    const render = () => {
      const online = navigator.onLine;
      const safe = !online;
      bar.className = `connection-bar ${safe ? "connection-bar--safe" : "connection-bar--online"}`;
      bar.innerHTML = safe ? `<span class="material-icons">wifi_off</span>
         <span><strong>Offline</strong>: safer for private keys and signing</span>` : `<span class="material-icons">wifi</span>
         <span><strong>Online</strong>: disconnect Wi-Fi before entering private keys if you want air-gapped signing</span>`;
      document.body.classList.toggle("network-offline", safe);
      document.body.classList.toggle("network-online", online);
      if (typeof window.__updateSignSecurityBanner === "function") {
        window.__updateSignSecurityBanner();
      }
    };
    window.addEventListener("online", render);
    window.addEventListener("offline", render);
    render();
  }
  function renderModernSelect({ id, label, options, value, required = false, className = "" }) {
    const opts = options?.length ? options : [{ value: "", label: "No options" }];
    const current = opts.find((o) => o.value === value) || opts[0];
    const selectedValue = opts.some((o) => o.value === value) ? value : opts[0].value;
    return `
    <div class="field ${className}">
      ${label ? `<label for="${id}">${label}</label>` : ""}
      <div class="select-modern" data-modern-select="${id}">
        <button type="button" class="select-modern__trigger" aria-haspopup="listbox" aria-expanded="false">
          ${current?.icon ? `<span class="material-icons select-modern__icon">${current.icon}</span>` : ""}
          <span class="select-modern__label">${current?.label ?? "Select"}</span>
          <span class="material-icons select-modern__arrow">expand_more</span>
        </button>
        <ul class="select-modern__menu" role="listbox" hidden>
          ${opts.map((o) => `
            <li role="option" data-value="${o.value}" class="${o.value === selectedValue ? "selected" : ""}" aria-selected="${o.value === selectedValue}">
              ${o.icon ? `<span class="material-icons">${o.icon}</span>` : ""}
              <span>${o.label}</span>
            </li>
          `).join("")}
        </ul>
        <select id="${id}" name="${id}" class="select-native-sr" ${required ? "required" : ""} tabindex="-1" aria-hidden="true">
          ${opts.map((o) => `<option value="${o.value}" ${o.value === selectedValue ? "selected" : ""}>${o.label}</option>`).join("")}
        </select>
      </div>
    </div>
  `;
  }
  function renderNetworkPicker(value) {
    const current = getNetwork(value);
    return `
    <div class="network-picker select-modern-wrap" data-modern-select="network-select">
      <button type="button" class="select-modern__trigger select-modern__trigger--compact" aria-haspopup="listbox">
        <span class="material-icons select-modern__icon">hub</span>
        <span class="select-modern__label">${current.shortLabel}</span>
        <span class="material-icons select-modern__arrow">expand_more</span>
      </button>
      <ul class="select-modern__menu select-modern__menu--right" role="listbox" hidden>
        ${NETWORK_OPTIONS.map((o) => `
          <li role="option" data-value="${o.value}" class="${o.value === value ? "selected" : ""}">
            <span class="material-icons">${o.icon}</span>
            <span>${o.label}</span>
          </li>
        `).join("")}
      </ul>
      <select id="network-select" class="select-native-sr" tabindex="-1" aria-hidden="true">
        ${NETWORK_OPTIONS.map((o) => `<option value="${o.value}" ${o.value === value ? "selected" : ""}>${o.label}</option>`).join("")}
      </select>
    </div>
  `;
  }
  function bindModernSelects(root = document, onChange) {
    if (!root) return;
    root.querySelectorAll("[data-modern-select]").forEach((wrap) => {
      if (wrap.dataset.selectBound) return;
      wrap.dataset.selectBound = "1";
      const selectId = wrap.dataset.modernSelect;
      const native = wrap.querySelector(`#${selectId}`) || wrap.querySelector("select");
      const trigger = wrap.querySelector(".select-modern__trigger");
      const menu = wrap.querySelector(".select-modern__menu");
      const labelEl = wrap.querySelector(".select-modern__label");
      const closeAll = () => {
        document.querySelectorAll(".select-modern__menu").forEach((m) => {
          m.hidden = true;
        });
        document.querySelectorAll(".select-modern__trigger").forEach((t) => {
          t.setAttribute("aria-expanded", "false");
        });
      };
      trigger?.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = menu?.hidden !== false;
        closeAll();
        if (open && menu) {
          menu.hidden = false;
          trigger.setAttribute("aria-expanded", "true");
        }
      });
      menu?.querySelectorAll("[data-value]").forEach((item) => {
        item.addEventListener("click", () => {
          const val = item.dataset.value;
          if (native) native.value = val;
          menu.querySelectorAll("[data-value]").forEach((li) => li.classList.toggle("selected", li.dataset.value === val));
          const opt = native?.querySelector(`option[value="${val}"]`);
          if (labelEl && opt) labelEl.textContent = opt.textContent;
          closeAll();
          native?.dispatchEvent(new Event("change", { bubbles: true }));
          onChange?.(selectId, val, native);
        });
      });
    });
    if (!document.body.dataset.selectCloseBound) {
      document.body.dataset.selectCloseBound = "1";
      document.addEventListener("click", () => {
        document.querySelectorAll(".select-modern__menu").forEach((m) => {
          m.hidden = true;
        });
      });
    }
  }
  function renderSignSecurityBanner() {
    const safe = !navigator.onLine;
    return `
    <div class="sign-security-banner ${safe ? "sign-security-banner--safe" : "sign-security-banner--warn"}">
      <span class="material-icons">${safe ? "shield" : "warning"}</span>
      <div>
        <strong>${safe ? "Offline mode: good for signing" : "Security: private keys stay in your browser only"}</strong>
        <p>For maximum safety before entering a WIF: disconnect from the internet (Wi\u2011Fi off or unplug ethernet), then sign. Copy the raw hex and broadcast later from another device.</p>
      </div>
    </div>
  `;
  }

  // js/broadcast.js
  function rpcSendRawCurl(hex, port) {
    const params = JSON.stringify({ jsonrpc: "1.0", id: "wizard", method: "sendrawtransaction", params: [hex] });
    return `curl -u user:pass -d '${params}' http://127.0.0.1:${port}/`;
  }
  function renderLocalBroadcastHelp(hex, network) {
    const net = getNetwork(network);
    const port = networkRpcPort(network);
    const cliArgs = networkCliArgs(network);
    const legacyTestnetNote = network === "testnet" ? '<p class="field-hint">DogeGo runs the <strong>new testnet</strong> (not legacy). For legacy testnet coins, use Dogecoin Core below.</p>' : "";
    const dogegoRecommended = net.dogego ? '<p class="broadcast-node-tag">Recommended for this network</p>' : "";
    return `
    <div class="broadcast-help">
      <h4><span class="material-icons">send</span> Broadcast with your own node</h4>
      <p class="muted">Run a local full node and push the signed hex. Both options expose Core-compatible <code>sendrawtransaction</code> JSON-RPC.</p>

      <div class="broadcast-node broadcast-node--dogego">
        <h5>
          <span class="material-icons">rocket_launch</span>
          <a href="${DOGEGO_URL}" target="_blank" rel="noopener">DogeGo</a>
          ${dogegoRecommended}
        </h5>
        <p>
          <strong>DogeGo</strong> is an improved Dogecoin full node built on Core, with wallet, web dashboard,
          and JSON-RPC compatible with standard Core calls. It supports the new testnet and adds features beyond stock Core.
        </p>
        ${renderCodeView(rpcSendRawCurl(hex, port), "dogego-rpc", { title: `DogeGo JSON-RPC (port ${port})`, wrapAt: 120 })}
        <p class="field-hint">
          With DogeGo running, you can also broadcast from its built-in wallet UI.
          Download and docs: <a href="${DOGEGO_URL}" target="_blank" rel="noopener">dogego.org</a>
        </p>
        ${legacyTestnetNote}
      </div>

      <div class="broadcast-node">
        <h5><span class="material-icons">settings</span> Dogecoin Core</h5>
        <p>Original reference node. Same RPC method names; CLI wrapper shown below.</p>
        ${renderCodeView(`dogecoin-cli${cliArgs} sendrawtransaction ${hex}`, "core-cli", { title: "dogecoin-cli", wrapAt: 120 })}
      </div>
    </div>
  `;
  }
  var BROADCAST_SERVICES = [
    {
      id: "blockcypher",
      name: "BlockCypher",
      icon: "cloud_upload",
      networks: ["mainnet", "testnet"],
      doc: "https://www.blockcypher.com/dev/dogecoin/",
      webUrl: (network) => network === "testnet" ? "https://live.blockcypher.com/doge-testnet/" : "https://live.blockcypher.com/doge/",
      async push(hex, network) {
        const net = network === "testnet" ? "test3" : "main";
        const res = await fetch(`https://api.blockcypher.com/v1/doge/${net}/txs/push`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tx: hex })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || data.errors?.[0]?.error || res.statusText);
        return data.tx?.hash || data.hash || JSON.stringify(data);
      }
    },
    {
      id: "chainso",
      name: "Chain.so",
      icon: "link",
      networks: ["mainnet", "testnet"],
      doc: "https://chain.so/api/",
      webUrl: () => "https://chain.so/broadcast",
      async push(hex, network) {
        const net = network === "testnet" ? "DOGETEST" : "DOGE";
        const body = new URLSearchParams({ tx_hex: hex });
        const res = await fetch(`https://chain.so/api/v2/send_tx/${net}`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body
        });
        const data = await res.json().catch(() => ({}));
        if (data.status !== "success") {
          throw new Error(data.data?.error_message || data.message || JSON.stringify(data));
        }
        return data.data?.txid || data.data?.hash || JSON.stringify(data.data);
      }
    },
    {
      id: "blockchair",
      name: "Blockchair",
      icon: "public",
      networks: ["mainnet"],
      doc: "https://blockchair.com/api/docs",
      webUrl: () => "https://blockchair.com/dogecoin/broadcast",
      async push(hex) {
        const body = new URLSearchParams({ data: hex });
        const res = await fetch("https://api.blockchair.com/dogecoin/push/transaction", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body
        });
        const data = await res.json().catch(() => ({}));
        if (!data.data?.transaction_hash && data.data?.error) {
          throw new Error(data.data.error);
        }
        return data.data?.transaction_hash || JSON.stringify(data.data);
      }
    },
    {
      id: "dogechain",
      name: "Dogechain.info",
      icon: "send",
      networks: ["mainnet"],
      doc: "https://dogechain.info/",
      webUrl: () => "https://dogechain.info/",
      async push(hex) {
        const body = new URLSearchParams({ tx: hex });
        const res = await fetch("https://dogechain.info/api/v1/pushtx", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body
        });
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = { raw: text };
        }
        if (!res.ok) throw new Error(data.error || data.message || text.slice(0, 200));
        return data.txid || data.tx_hash || data.hash || text.slice(0, 120);
      }
    }
  ];
  function renderBroadcastPanel(hex, network) {
    const net = getNetwork(network);
    const explorerNetwork = network === "testnet-new" ? null : network;
    const services = explorerNetwork ? BROADCAST_SERVICES.filter((s) => s.networks.includes(explorerNetwork)) : [];
    const dogegoNote = net.dogego ? `
    <div class="warn-box">
      <span class="material-icons">info</span>
      The new testnet is not on public block explorers yet.
      Broadcast with your local <a href="${DOGEGO_URL}" target="_blank" rel="noopener">DogeGo</a> node (RPC port ${net.rpcPort})
      or <code>dogecoin-cli -testnet sendrawtransaction</code>.
    </div>
  ` : "";
    return `
    <div class="broadcast-services" data-broadcast-hex="${escapeAttr(hex)}">
      <h4><span class="material-icons">public</span> Broadcast via third-party service</h4>
      <p class="muted">Optional. Public APIs also used by libdogecoin scripts as fallbacks. This sends your signed hex to an external provider over the internet.</p>
      ${dogegoNote}
      ${services.length ? `<div class="broadcast-grid">
        ${services.map((s) => `
          <button type="button" class="btn btn-secondary broadcast-btn" data-broadcast="${s.id}" title="Push via ${s.name} API">
            <span class="material-icons">${s.icon}</span>
            ${s.name}
          </button>
          <a href="${s.webUrl(explorerNetwork)}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm broadcast-link" title="Open ${s.name} in new tab">
            <span class="material-icons">open_in_new</span>
          </a>
        `).join("")}
      </div>` : ""}
      <p class="field-hint">If API buttons fail (browser CORS), copy the hex above and paste on the provider's broadcast page, or use <a href="${DOGEGO_URL}" target="_blank" rel="noopener">DogeGo</a> / <code>dogecoin-cli sendrawtransaction</code> locally.</p>
      <div class="broadcast-result" id="broadcast-result" hidden></div>
    </div>
  `;
  }
  function escapeAttr(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  }
  function bindBroadcastPanel(root = document, network) {
    if (!root) return;
    const panel = root.querySelector(".broadcast-services");
    if (!panel) return;
    const hex = panel.dataset.broadcastHex;
    const resultEl = panel.querySelector("#broadcast-result");
    panel.querySelectorAll("[data-broadcast]").forEach((btn) => {
      if (btn.dataset.broadcastBound) return;
      btn.dataset.broadcastBound = "1";
      btn.addEventListener("click", async () => {
        const service = BROADCAST_SERVICES.find((s) => s.id === btn.dataset.broadcast);
        if (!service || !hex) return;
        btn.disabled = true;
        const prev = btn.innerHTML;
        btn.innerHTML = '<span class="material-icons">hourglass_empty</span> Sending\u2026';
        if (resultEl) {
          resultEl.hidden = false;
          resultEl.className = "broadcast-result broadcast-result--pending";
          resultEl.textContent = `Broadcasting via ${service.name}\u2026`;
        }
        try {
          const txid = await service.push(hex, network);
          if (resultEl) {
            resultEl.className = "broadcast-result broadcast-result--ok";
            resultEl.innerHTML = `<span class="material-icons">check_circle</span> <strong>${service.name}</strong> accepted. TXID: <code>${escapeHtml3(String(txid))}</code>`;
          }
        } catch (e) {
          const msg = e.message || String(e);
          const isCors = /failed to fetch|networkerror|cors/i.test(msg);
          if (resultEl) {
            resultEl.className = "broadcast-result broadcast-result--err";
            resultEl.innerHTML = `
            <span class="material-icons">error</span>
            <div>
              <strong>${service.name} failed</strong>
              <p>${escapeHtml3(msg)}</p>
              ${isCors ? '<p>Copy the raw hex and use the <span class="material-icons" style="font-size:1rem;vertical-align:middle">open_in_new</span> link to broadcast manually on their website.</p>' : ""}
            </div>
          `;
          }
        } finally {
          btn.disabled = false;
          btn.innerHTML = prev;
        }
      });
    });
  }
  function escapeHtml3(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // js/amount.js
  var DOGE_AMOUNT_RE = /^\d+(\.\d{1,8})?$/;
  function isValidDogeAmount(value) {
    const s = String(value ?? "").trim();
    return s.length > 0 && DOGE_AMOUNT_RE.test(s) && parseFloat(s) > 0;
  }
  function parseDogeAmount(value, label = "DOGE amount") {
    const s = String(value ?? "").trim();
    if (!DOGE_AMOUNT_RE.test(s)) {
      throw new Error(`${label}: use numbers only, up to 8 decimals (e.g. 1.00 or 20000.12345678)`);
    }
    if (parseFloat(s) <= 0) throw new Error(`${label} must be greater than zero`);
    return s;
  }
  function dogeInputAttrs({ id, name, value = "", placeholder = "0.00", required = false, extra = "" } = {}) {
    const req = required ? "required" : "";
    const val = value ? `value="${String(value).replace(/"/g, "&quot;")}"` : "";
    return `<input type="text" inputmode="decimal" class="input-doge" id="${id}" name="${name}" ${val} placeholder="${placeholder}" autocomplete="off" pattern="[0-9]+(\\.[0-9]{1,8})?" title="Numbers only, up to 8 decimal places" ${req} ${extra}>`;
  }
  function bindDogeInputs(root = document) {
    if (!root) return;
    root.querySelectorAll(".input-doge").forEach((el) => {
      if (el.dataset.dogeBound) return;
      el.dataset.dogeBound = "1";
      el.addEventListener("input", () => {
        let v = el.value.replace(/[^0-9.]/g, "");
        const dot = v.indexOf(".");
        if (dot !== -1) {
          v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, "");
          const frac = v.slice(dot + 1);
          if (frac.length > 8) v = v.slice(0, dot + 1 + 8);
        }
        el.value = v;
      });
    });
  }

  // js/sign-modes.js
  var MODE_LABELS = {
    op_return: "Broadcast OP_RETURN message",
    fund: "Fund contract (send DOGE to P2SH)",
    claim: "Claim with secret (hash lock)",
    sweep_cltv: "Sweep after unlock date (CLTV)",
    clue: "Broadcast geocache clue"
  };
  var TEMPLATE_SIGN_MODES = {
    "text-message": ["op_return"],
    "file-checksum": ["op_return"],
    "nft-mint": ["op_return"],
    "document-commit": ["op_return"],
    "pqc-commitment": ["op_return"],
    "treasure-hunt": ["fund", "claim"],
    "public-bounty": ["fund", "claim"],
    "first-to-solve": ["fund", "claim"],
    "geocache": ["clue", "fund"],
    "ctf-flag": ["fund", "claim"],
    "puzzle-artifact": ["fund", "claim"],
    "timelock": ["fund", "sweep_cltv"],
    "time-capsule": ["op_return", "fund", "sweep_cltv"],
    "multisig": ["fund"],
    "opcode-playground": ["fund"],
    "bank-check": ["fund", "op_return", "sweep_cltv"],
    "atomic-swap-htlc": ["fund", "claim"],
    "p2p-escrow": ["fund"],
    "milestone-escrow": ["fund", "sweep_cltv"],
    "vesting-schedule": ["fund", "sweep_cltv"],
    "invoice-refund": ["fund", "claim"],
    "inheritance-switch": ["fund", "sweep_cltv"],
    "savings-challenge": ["fund", "sweep_cltv"],
    "proof-of-reserve": ["op_return", "fund"],
    "raffle-commit": ["op_return", "fund"],
    "content-unlock": ["fund", "claim"],
    "reveal-code-unlock": ["op_return", "fund", "claim"],
    "game-license-key": ["op_return", "fund", "claim"],
    "music-download-code": ["op_return", "fund", "claim"],
    "software-activation": ["op_return", "fund", "claim"],
    "smart-door-access": ["op_return", "fund", "claim"],
    "iot-command-token": ["op_return", "fund", "claim"],
    "channel-open": ["fund"],
    "otc-swap-pair": ["fund", "claim"]
  };
  var MODE_NEEDS = {
    op_return: { utxo: true, wif: true, change: true, fee: true },
    fund: { utxo: true, wif: true, change: true, fee: true, fundAmount: true },
    claim: { utxo: true, wif: false, change: false, fee: true, claim: true },
    sweep_cltv: { utxo: true, wif: false, change: false, fee: true, sweep: true },
    clue: { utxo: true, wif: true, change: true, fee: true, clue: true }
  };
  function signModesForTemplate(templateId, result) {
    let ids = TEMPLATE_SIGN_MODES[templateId];
    if (!ids) {
      ids = [];
      if (result?.type === "op_return" || result?.dataHex) ids.push("op_return");
      else if (result?.address) ids.push("fund");
    }
    ids = ids.filter((id) => {
      if (id === "op_return") {
        return result?.dataHex || result?.capsuleAsm || result?.commitAsm || result?.type === "op_return" || result?.type === "pqc_commitment" || result?.asm?.startsWith("OP_RETURN");
      }
      if (id === "fund" || id === "claim" || id === "sweep_cltv") return !!result?.address;
      if (id === "clue") return !!result?.clues?.length;
      return true;
    });
    if (!ids.length) ids = ["fund"];
    return ids.map((id) => ({ id, label: MODE_LABELS[id] || id }));
  }
  function signNeedsForMode(modeId) {
    return MODE_NEEDS[modeId] || MODE_NEEDS.fund;
  }
  function opReturnDataHex(result) {
    return result?.dataHex || (result?.capsuleAsm?.startsWith("OP_RETURN ") ? result.capsuleAsm.split(" ")[1] : null) || (result?.commitAsm?.startsWith("OP_RETURN ") ? result.commitAsm.split(" ")[1] : null) || (result?.markerAsm?.startsWith("OP_RETURN ") ? result.markerAsm.split(" ")[1] : null) || (result?.asm?.startsWith("OP_RETURN ") ? result.asm.split(" ")[1] : null);
  }

  // js/hero-animation.js
  var ORBIT_OPCODES = [
    "OP_DUP",
    "OP_HASH160",
    "OP_CHECKSIG",
    "OP_RETURN",
    "OP_IF",
    "OP_EQUAL",
    "OP_CHECKLOCKTIMEVERIFY",
    "OP_CHECKMULTISIG",
    "OP_SHA256",
    "OP_ADD",
    "OP_VERIFY",
    "OP_ELSE"
  ];
  var DEMOS = [
    {
      id: "hash-lock",
      label: "Hash lock",
      script: ["OP_HASH160", "OP_EQUAL", "OP_VERIFY"],
      steps: [
        { opcode: "PUSH", data: "much_secret", stack: ["much_secret"], caption: "Buyer reveals preimage" },
        { opcode: "OP_HASH160", stack: ["a3f2\u20268b1c"], caption: "Hash the secret" },
        { opcode: "PUSH", data: "a3f2\u20268b1c", stack: ["a3f2\u20268b1c", "a3f2\u20268b1c"], caption: "Script committed hash" },
        { opcode: "OP_EQUAL", stack: ["true"], caption: "Compare hashes" },
        { opcode: "OP_VERIFY", stack: [], caption: "Must be true or abort" }
      ],
      valid: "Unlock content \xB7 script passed"
    },
    {
      id: "p2pkh",
      label: "Signature check",
      script: ["OP_DUP", "OP_HASH160", "OP_EQUALVERIFY", "OP_CHECKSIG"],
      steps: [
        { opcode: "PUSH", data: "3044\u2026sig", stack: ["3044\u2026sig"], caption: "Signature from wallet" },
        { opcode: "PUSH", data: "02ab\u2026pub", stack: ["3044\u2026sig", "02ab\u2026pub"], caption: "Public key" },
        { opcode: "OP_DUP", stack: ["3044\u2026sig", "02ab\u2026pub", "02ab\u2026pub"], caption: "Duplicate top item" },
        { opcode: "OP_HASH160", stack: ["3044\u2026sig", "02ab\u2026pub", "D8xK\u2026h160"], caption: "Address hash" },
        { opcode: "PUSH", data: "D8xK\u2026h160", stack: ["3044\u2026sig", "02ab\u2026pub", "D8xK\u2026h160", "D8xK\u2026h160"], caption: "Expected hash" },
        { opcode: "OP_EQUALVERIFY", stack: ["3044\u2026sig", "02ab\u2026pub"], caption: "Equal or fail tx" },
        { opcode: "OP_CHECKSIG", stack: ["true"], caption: "ECDSA verify" }
      ],
      valid: "Spend authorized \xB7 OP_CHECKSIG ok"
    },
    {
      id: "op-return",
      label: "OP_RETURN data",
      script: ["OP_RETURN"],
      steps: [
        { opcode: "PUSH", data: "[sha256\u2026]", stack: ["[sha256\u2026]"], caption: "NFT checksum / message" },
        { opcode: "OP_RETURN", stack: [], caption: "Output unspendable \xB7 data on-chain" }
      ],
      valid: "Data committed \xB7 included in block"
    },
    {
      id: "timelock",
      label: "Time lock",
      script: ["OP_CHECKLOCKTIMEVERIFY", "OP_DROP", "OP_CHECKSIG"],
      steps: [
        { opcode: "PUSH", data: "1704067200", stack: ["1704067200"], caption: "Lock time (unix)" },
        { opcode: "OP_CHECKLOCKTIMEVERIFY", stack: [], caption: "Block time must be past lock" },
        { opcode: "PUSH", data: "3044\u2026sig", stack: ["3044\u2026sig"], caption: "Owner signature" },
        { opcode: "PUSH", data: "02ab\u2026pub", stack: ["3044\u2026sig", "02ab\u2026pub"], caption: "Owner pubkey" },
        { opcode: "OP_CHECKSIG", stack: ["true"], caption: "Release after date" }
      ],
      valid: "CLTV passed \xB7 coins unlocked"
    }
  ];
  function escapeHtml4(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function renderOpcodeHeroViz() {
    const orbit = ORBIT_OPCODES.map((op, i) => `
    <span class="opcode-orbit__chip" style="--orbit-i: ${i}; --orbit-total: ${ORBIT_OPCODES.length}">${op}</span>
  `).join("");
    return `
    <div class="opcode-hero-viz" id="opcode-hero-viz" aria-hidden="true">
      <div class="opcode-orbit" aria-hidden="true">${orbit}</div>
      <div class="opcode-hero-viz__panel">
        <div class="opcode-hero-viz__top">
          <div class="opcode-hero-viz__node">
            <span class="opcode-hero-viz__pulse"></span>
            <span class="opcode-hero-viz__node-label">Full node</span>
          </div>
          <div class="opcode-hero-viz__meta">
            <span class="opcode-hero-viz__demo-label" data-viz="demo-label">Hash lock</span>
            <span class="opcode-hero-viz__block" data-viz="block">Block #4,892,103</span>
          </div>
        </div>

        <div class="opcode-hero-viz__stage">
          <div class="opcode-hero-viz__script-col">
            <p class="opcode-hero-viz__col-title"><span class="material-icons">reorder</span> Script</p>
            <div class="opcode-hero-viz__tape" data-viz="tape"></div>
            <p class="opcode-hero-viz__caption" data-viz="caption">Executing\u2026</p>
          </div>
          <div class="opcode-hero-viz__arrow" aria-hidden="true">
            <span class="material-icons">arrow_forward</span>
          </div>
          <div class="opcode-hero-viz__stack-col">
            <p class="opcode-hero-viz__col-title"><span class="material-icons">layers</span> Stack</p>
            <div class="opcode-hero-viz__stack" data-viz="stack"></div>
          </div>
        </div>

        <div class="opcode-hero-viz__bottom">
          <div class="opcode-hero-viz__progress" data-viz="progress"></div>
          <div class="opcode-hero-viz__verdict" data-viz="verdict">
            <span class="material-icons">hourglass_empty</span>
            <span>Validating\u2026</span>
          </div>
        </div>
      </div>
    </div>
  `;
  }
  function renderTape(script, activeIndex) {
    return script.map((op, i) => {
      let cls = "opcode-hero-viz__op";
      if (i < activeIndex) cls += " opcode-hero-viz__op--done";
      else if (i === activeIndex) cls += " opcode-hero-viz__op--active";
      return `<span class="${cls}">${escapeHtml4(op)}</span>`;
    }).join("");
  }
  function renderStack(items, reducedMotion) {
    if (!items.length) {
      return `<div class="opcode-hero-viz__stack-empty">empty</div>`;
    }
    const anim = reducedMotion ? "" : " opcode-hero-viz__item--pop";
    return items.slice().reverse().map((item, i) => `
    <div class="opcode-hero-viz__item${anim}" style="--stack-i: ${i}">${escapeHtml4(item)}</div>
  `).join("");
  }
  function renderProgress(demoIndex, stepIndex, stepCount, demoCount) {
    const dots = [];
    for (let d = 0; d < demoCount; d++) {
      const active = d === demoIndex ? " opcode-hero-viz__dot--active" : "";
      dots.push(`<span class="opcode-hero-viz__dot${active}"></span>`);
    }
    const bar = stepCount > 0 ? Math.round((stepIndex + 1) / stepCount * 100) : 0;
    return `
    <div class="opcode-hero-viz__dots">${dots.join("")}</div>
    <div class="opcode-hero-viz__bar"><span style="width: ${bar}%"></span></div>
  `;
  }
  function randomBlock() {
    return 4892e3 + Math.floor(Math.random() * 2e3);
  }
  function initOpcodeHeroViz(root) {
    if (!root) return () => {
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tapeEl = root.querySelector('[data-viz="tape"]');
    const stackEl = root.querySelector('[data-viz="stack"]');
    const captionEl = root.querySelector('[data-viz="caption"]');
    const verdictEl = root.querySelector('[data-viz="verdict"]');
    const demoLabelEl = root.querySelector('[data-viz="demo-label"]');
    const blockEl = root.querySelector('[data-viz="block"]');
    const progressEl = root.querySelector('[data-viz="progress"]');
    let demoIndex = 0;
    let stepIndex = -1;
    let phase = "step";
    let timers = [];
    let stopped = false;
    const delay = (ms) => new Promise((resolve) => {
      const id = setTimeout(resolve, reducedMotion ? Math.min(ms, 400) : ms);
      timers.push(id);
    });
    function setVerdict(mode, text) {
      if (!verdictEl) return;
      verdictEl.className = "opcode-hero-viz__verdict";
      if (mode === "valid") {
        verdictEl.classList.add("opcode-hero-viz__verdict--valid");
        verdictEl.innerHTML = `<span class="material-icons">verified</span><span>${escapeHtml4(text)}</span>`;
      } else if (mode === "busy") {
        verdictEl.classList.add("opcode-hero-viz__verdict--busy");
        verdictEl.innerHTML = `<span class="material-icons">hourglass_empty</span><span>${escapeHtml4(text)}</span>`;
      } else {
        verdictEl.innerHTML = `<span class="material-icons">sync</span><span>${escapeHtml4(text)}</span>`;
      }
    }
    function paintStep() {
      const demo = DEMOS[demoIndex];
      const step = demo.steps[stepIndex];
      if (!step) return;
      if (demoLabelEl) demoLabelEl.textContent = demo.label;
      if (blockEl) blockEl.textContent = `Block #${randomBlock().toLocaleString()}`;
      if (captionEl) captionEl.textContent = step.caption;
      const scriptIdx = Math.min(
        demo.script.findIndex((op) => op === step.opcode),
        demo.script.length - 1
      );
      const activeScriptIdx = step.opcode === "PUSH" ? -1 : Math.max(0, scriptIdx);
      if (tapeEl) {
        tapeEl.innerHTML = `
        ${step.opcode === "PUSH" ? `<span class="opcode-hero-viz__op opcode-hero-viz__op--push opcode-hero-viz__op--active">PUSH ${escapeHtml4(step.data)}</span>` : ""}
        ${renderTape(demo.script, activeScriptIdx)}
      `;
      }
      if (stackEl) stackEl.innerHTML = renderStack(step.stack, reducedMotion);
      if (progressEl) {
        progressEl.innerHTML = renderProgress(demoIndex, stepIndex, demo.steps.length, DEMOS.length);
      }
      setVerdict("busy", `Running ${step.opcode}\u2026`);
    }
    function paintValid() {
      const demo = DEMOS[demoIndex];
      if (tapeEl) tapeEl.innerHTML = renderTape(demo.script, demo.script.length);
      if (captionEl) captionEl.textContent = "Every node runs the same script. Invalid spend = rejected.";
      if (progressEl) {
        progressEl.innerHTML = renderProgress(demoIndex, demo.steps.length - 1, demo.steps.length, DEMOS.length);
      }
      setVerdict("valid", demo.valid);
      root.classList.add("opcode-hero-viz--validated");
    }
    async function loop() {
      while (!stopped) {
        const demo = DEMOS[demoIndex];
        root.classList.remove("opcode-hero-viz--validated");
        stepIndex = -1;
        phase = "step";
        for (let i = 0; i < demo.steps.length; i++) {
          if (stopped) return;
          stepIndex = i;
          paintStep();
          await delay(reducedMotion ? 700 : 1400);
        }
        phase = "valid";
        paintValid();
        await delay(reducedMotion ? 1200 : 2800);
        demoIndex = (demoIndex + 1) % DEMOS.length;
        await delay(reducedMotion ? 400 : 800);
      }
    }
    loop();
    return () => {
      stopped = true;
      timers.forEach(clearTimeout);
      timers = [];
    };
  }

  // js/app.js
  var state = {
    view: "home",
    category: null,
    templateId: null,
    step: 0,
    network: "testnet-new",
    result: null,
    formData: {},
    signedTx: null
  };
  var heroVizCleanup = null;
  function stopHeroViz() {
    heroVizCleanup?.();
    heroVizCleanup = null;
  }
  var $ = (sel, root = document) => root.querySelector(sel);
  var $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  var WIZARD_STEPS = ["Choose", "Configure", "Review", "Deploy"];
  function init() {
    initConnectionBar();
    syncHeaderNetwork();
    bindGlobalEvents();
    navigate("home");
    registerServiceWorker();
  }
  function syncHeaderNetwork() {
    const nav = $("#site-nav");
    if (!nav) return;
    const existing = nav.querySelector('[data-modern-select="network-select"]');
    if (existing) {
      existing.outerHTML = renderNetworkPicker(state.network);
    } else {
      nav.insertAdjacentHTML("beforeend", renderNetworkPicker(state.network));
    }
    bindModernSelects(document);
  }
  function registerServiceWorker() {
    if (location.protocol === "file:") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch(() => {
      });
    }
  }
  function bindGlobalEvents() {
    $("#nav-toggle")?.addEventListener("click", () => {
      $("#site-nav")?.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-nav]");
      if (!el) return;
      e.preventDefault();
      navigate(el.dataset.nav);
      $("#site-nav")?.classList.remove("open");
    });
    document.addEventListener("change", (e) => {
      if (e.target.id === "network-select") {
        state.network = e.target.value;
        if (state.result) rebuildResult();
      }
    });
  }
  function navigate(view, data = {}) {
    stopHeroViz();
    const scrollToPlayground = view === "playground";
    state.view = scrollToPlayground ? "opcodes" : view;
    Object.assign(state, data);
    const main = $("#main");
    if (!main) return;
    switch (state.view) {
      case "home":
        main.innerHTML = renderHome();
        bindHomeEvents();
        break;
      case "wizard":
        try {
          main.innerHTML = renderWizard();
          bindWizardEvents();
        } catch (err2) {
          console.error(err2);
          main.innerHTML = `<section class="wizard"><div class="warn-box"><span class="material-icons">error</span> Could not show contract: ${escapeHtml5(err2.message)}</div></section>`;
          toast(err2.message || "Could not render contract");
        }
        break;
      case "templates":
        main.innerHTML = renderTemplateGallery();
        bindGalleryEvents();
        break;
      case "opcodes":
        main.innerHTML = renderOpcodeExplorer();
        bindOpcodeEvents();
        if (scrollToPlayground) {
          requestAnimationFrame(() => {
            document.getElementById("playground")?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
        break;
      case "docs":
        main.innerHTML = renderDocs();
        break;
      default:
        main.innerHTML = renderHome();
    }
    if (!scrollToPlayground) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    syncHeaderNetwork();
  }
  function renderSmartContractsExplainer() {
    return `
    <div class="sc-explainer__inner">
      <header class="sc-explainer__header">
        <p class="sc-explainer__eyebrow">Layer 1 \xB7 OP_CODES</p>
        <h2>Why call them smart contracts?</h2>
        <p class="sc-explainer__lead">
          If it has <strong>logic</strong>, both sides agree to <strong>rules</strong>, and the network
          <strong>executes</strong> those rules when a transaction lands in a block. That is a contract.
          We call it a smart contract. No permission required.
        </p>
      </header>

      <div class="sc-pillars">
        <article class="sc-pillar">
          <div class="sc-pillar__icon"><span class="material-icons">account_tree</span></div>
          <h3>Logic</h3>
          <p>Hash locks, time locks, multisig, <code>OP_IF</code> branches: real conditions encoded in script.</p>
        </article>
        <article class="sc-pillar">
          <div class="sc-pillar__icon"><span class="material-icons">handshake</span></div>
          <h3>Agreement</h3>
          <p>Participants lock value under rules they accept. Break the rules \u2192 spend rejected.</p>
        </article>
        <article class="sc-pillar">
          <div class="sc-pillar__icon"><span class="material-icons">bolt</span></div>
          <h3>Execution</h3>
          <p>Every node runs the script at spend time. Included in a block = enforced on-chain.</p>
        </article>
      </div>

      <div class="sc-compare">
        <div class="sc-compare__card sc-compare__card--muted">
          <h4>Account chains</h4>
          <ul>
            <li>Turing-complete loops</li>
            <li>Persistent contract storage</li>
            <li>One address, many calls</li>
          </ul>
        </div>
        <div class="sc-compare__vs">vs</div>
        <div class="sc-compare__card sc-compare__card--highlight">
          <h4>Dogecoin OP_CODES</h4>
          <ul>
            <li>No loops or repeat</li>
            <li>UTXO model, no shared memory</li>
            <li>Each lock is its own script</li>
            <li class="sc-compare__yes"><span class="material-icons">check</span> Rules enforced at spend</li>
          </ul>
        </div>
      </div>

      <p class="sc-explainer__note">
        Dogecoin still runs logic on Layer 1: smart, simple, and auditable. Escrows, reveal codes,
        timelocks, and commitments are contracts; just not a general-purpose computer.
      </p>

      <footer class="sc-explainer__footer">
        <div class="sc-quote">
          <span class="material-icons">celebration</span>
          <p><strong>Permissionless words.</strong> No organization owns &ldquo;smart contract.&rdquo; Call it what you like. We call them smart contracts. Much wow.</p>
        </div>
      </footer>
    </div>
  `;
  }
  function renderHome() {
    return `
    <section class="hero">
      <div class="hero-layout">
        <div class="hero-content">
          <div class="hero-badge"><span class="material-icons">code</span> Dogecoin OP_CODES</div>
          <h1>Dogecoin Smart Contracts Wizard</h1>
          <p class="hero-lead">Build Layer 1 smart contracts on Dogecoin with native OP_CODES. Hash locks, time locks, multisig, OP_RETURN messages, post-quantum commitments, treasure hunts, and more.</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" data-action="start-wizard">
              <span class="material-icons">auto_fix_high</span> Start Wizard
            </button>
            <button class="btn btn-secondary btn-lg" data-nav="templates">
              <span class="material-icons">dashboard</span> Browse Templates
            </button>
          </div>
          <p class="hero-note"><span class="material-icons">offline_bolt</span> Works offline after first load \xB7 Test on testnet first</p>
        </div>
        ${renderOpcodeHeroViz()}
      </div>
    </section>

    <section class="feature-grid">
      ${TEMPLATE_CATEGORIES.map((c) => `
        <article class="feature-card" data-category="${c.id}">
          <span class="material-icons feature-icon">${c.icon}</span>
          <h3>${c.label}</h3>
          <p>${categoryBlurb(c.id)}</p>
          <button class="btn btn-ghost" data-action="category" data-category="${c.id}">Explore <span class="material-icons">arrow_forward</span></button>
        </article>
      `).join("")}
    </section>

    <section class="sc-explainer">
      ${renderSmartContractsExplainer()}
    </section>

    <section class="info-band">
      <h2><span class="material-icons">school</span> What are OP_CODES?</h2>
      <p>Dogecoin transactions use a stack-based scripting language. <strong>OP_CODES</strong> are instructions like <code>OP_HASH160</code>, <code>OP_CHECKSIG</code>, and <code>OP_RETURN</code> that define spending rules for conditional locks, data storage, and multi-party wallets without a separate VM.</p>
      <a href="https://dogecoincore.com/#opcodes" target="_blank" rel="noopener" class="btn btn-ghost">Official Docs <span class="material-icons">open_in_new</span></a>
    </section>
  `;
  }
  function categoryBlurb(id) {
    const map = {
      data: "Store messages, file hashes, document seals, and NFT checksum mints with OP_RETURN.",
      quantum: "Post-quantum signature commitments (FLC1, DIL2, RCG4) and carrier proof verification.",
      defi: "Bank checks, HTLC swaps, escrow, vesting, invoices, and other DeFi-adjacent locks.",
      games: "Treasure hunts, bounties, CTF flags, geocaches, and puzzle artifacts.",
      unlocks: "Reveal codes with OP_HASH160 for games, music, software, doors, and IoT access.",
      locks: "Time capsules and CLTV-locked coins that open on a date.",
      social: "Multi-signature vaults for families and shared projects.",
      explore: "Stack your own scripts and learn the opcode machine."
    };
    return map[id] || "";
  }
  function bindHomeEvents() {
    heroVizCleanup = initOpcodeHeroViz($("#opcode-hero-viz"));
    $('[data-action="start-wizard"]')?.addEventListener("click", () => {
      state.step = 0;
      state.templateId = null;
      state.category = null;
      state.formData = {};
      state.result = null;
      navigate("wizard");
    });
    $$('[data-action="category"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        state.category = btn.dataset.category;
        state.step = 0;
        navigate("wizard");
      });
    });
    $$("[data-category]").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        state.category = card.dataset.category;
        state.step = 0;
        navigate("wizard");
      });
    });
  }
  function renderWizard() {
    const step = Number(state.step) || 0;
    return `
    <section class="wizard">
      <div class="wizard-header">
        <h1><span class="material-icons">auto_fix_high</span> Contract Wizard</h1>
        <div class="stepper">
          ${WIZARD_STEPS.map((label, i) => `
            <div class="step ${i === step ? "active" : ""} ${i < step ? "done" : ""}">
              <span class="step-num">${i + 1}</span>
              <span class="step-label">${label}</span>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="wizard-body">
        ${step === 0 ? renderStepChoose() : ""}
        ${step === 1 ? renderStepConfigure() : ""}
        ${step === 2 ? renderStepReview() : ""}
        ${step === 3 ? renderStepDeploy() : ""}
      </div>
      <div class="wizard-footer">
        ${step > 0 ? '<button type="button" class="btn btn-secondary" data-action="prev"><span class="material-icons">arrow_back</span> Back</button>' : "<span></span>"}
        ${step < 2 ? '<button type="button" class="btn btn-primary" data-action="next">Next <span class="material-icons">arrow_forward</span></button>' : ""}
        ${step === 2 ? '<button type="button" class="btn btn-primary" data-action="build"><span class="material-icons">code</span> Generate Contract</button>' : ""}
        ${step === 3 ? '<button type="button" class="btn btn-primary" data-action="new"><span class="material-icons">add</span> New Contract</button>' : ""}
      </div>
    </section>
  `;
  }
  function renderStepChoose() {
    const filtered = state.category ? TEMPLATES.filter((t) => t.category === state.category) : TEMPLATES;
    return `
    <h2>Choose a contract template</h2>
    <div class="category-tabs">
      <button class="tab ${!state.category ? "active" : ""}" data-category="">All</button>
      ${TEMPLATE_CATEGORIES.map((c) => `
        <button class="tab ${state.category === c.id ? "active" : ""}" data-category="${c.id}">
          <span class="material-icons">${c.icon}</span> ${c.label}
        </button>
      `).join("")}
    </div>
    <div class="template-grid">
      ${filtered.map((t) => `
        <label class="template-card ${state.templateId === t.id ? "selected" : ""}">
          <input type="radio" name="template" value="${t.id}" ${state.templateId === t.id ? "checked" : ""} hidden>
          <span class="material-icons">${t.icon}</span>
          <h3>${t.title}</h3>
          <p>${t.tagline}</p>
        </label>
      `).join("")}
    </div>
  `;
  }
  function renderStepConfigure() {
    const tpl = getTemplate(state.templateId);
    if (!tpl) return "<p>Select a template first.</p>";
    const fields = tpl.fields.map((f) => {
      const val = state.formData[f.id] ?? f.default ?? "";
      if (f.type === "asm-badges") {
        const tokens = tokenizeAsm(String(val));
        return fieldWrap(f, `
        <div class="asm-field-editor" data-field="${f.id}">
          ${renderOpcodePalette("opcode-palette--inline")}
          ${renderOpcodeBadgeStack(tokens, { id: f.id, editable: true })}
          <textarea id="f-${f.id}" name="${f.id}" hidden ${f.required ? "required" : ""}>${escapeHtml5(String(val))}</textarea>
        </div>
      `);
      }
      if (f.type === "select") {
        const opts = (f.options || []).map((o) => typeof o === "string" ? { value: o, label: o } : { value: o.value, label: o.label });
        return renderModernSelect({
          id: `f-${f.id}`,
          label: `${f.label}${f.required ? " *" : ""}`,
          options: opts,
          value: val || opts[0]?.value || "",
          required: f.required
        });
      }
      if (f.type === "textarea") {
        return fieldWrap(f, `<textarea id="f-${f.id}" name="${f.id}" rows="4" placeholder="${f.placeholder || ""}" ${f.required ? "required" : ""}>${escapeHtml5(String(val))}</textarea>`);
      }
      if (f.type === "file") {
        return fieldWrap(f, `<input type="file" id="f-${f.id}" name="${f.id}" ${f.required ? "required" : ""}><span class="file-hash" id="file-hash-display"></span>`);
      }
      if (f.type === "doge-address") {
        const ph = f.placeholder || getNetwork(state.network).addressHint;
        return fieldWrap(f, `
        <input type="text" id="f-${f.id}" name="${f.id}" value="${escapeHtml5(String(val))}" placeholder="${ph}" autocomplete="off" ${f.required ? "required" : ""}>
        <p class="field-hint">Your regular wallet address. The script locks funds to this address; spend with the matching private key.</p>
      `);
      }
      if (f.type === "doge") {
        return fieldWrap(f, dogeInputAttrs({
          id: `f-${f.id}`,
          name: f.id,
          value: val,
          placeholder: f.placeholder || "0.00",
          required: f.required
        }));
      }
      const inputType = f.type === "number" ? "number" : f.type === "datetime-local" ? "datetime-local" : "text";
      const extra = f.min != null ? `min="${f.min}"` : "";
      const extra2 = f.max != null ? `max="${f.max}"` : "";
      return fieldWrap(f, `<input type="${inputType}" id="f-${f.id}" name="${f.id}" value="${escapeHtml5(String(val))}" placeholder="${f.placeholder || ""}" ${extra} ${extra2} ${f.required ? "required" : ""}>`);
    }).join("");
    return `
    <h2>Configure: ${tpl.title}</h2>
    <p class="step-desc">${tpl.tagline}</p>
    <form class="wizard-form" id="wizard-form">${fields}</form>
    ${tpl.id === "pqc-commitment" ? `
      <div class="pqc-actions">
        <button type="button" class="btn btn-ghost btn-sm" data-action="pqc-demo-fill">
          <span class="material-icons">casino</span> Random demo fill (lengths only)
        </button>
      </div>
    ` : ""}
    <div class="tip-box">
      <span class="material-icons">lightbulb</span>
      <div>${configureTip(tpl.id)}</div>
    </div>
  `;
  }
  function fieldWrap(f, input) {
    return `
    <div class="field">
      <label for="f-${f.id}">${f.label}${f.required ? " *" : ""}</label>
      ${input}
    </div>
  `;
  }
  function configureTip(id) {
    const tips = {
      "treasure-hunt": "Auto-generate a secret for maximum fairness. Share clues publicly; reveal the secret only to the winner.",
      "multisig": "Generate keys with <code>dogecoin-cli getnewaddress</code> then <code>validateaddress</code> for pubkeys. Use 2-of-3 for family vaults.",
      "timelock": "Paste your Dogecoin wallet address for the selected network (D on mainnet, n on legacy testnet, or your new testnet address). CLTV requires spending tx nLockTime \u2265 locktime.",
      "time-capsule": "Use the address from your Dogecoin wallet. You will spend the lock later with that wallet's private key.",
      "geocache": "Broadcast clues as separate OP_RETURN txs in order before funding the prize.",
      "opcode-playground": "Try: OP_DUP OP_HASH160 &lt;hash&gt; OP_EQUALVERIFY &lt;pubkey&gt; OP_CHECKSIG",
      "bank-check": "Fund the check address immediately. Share QR payload with recipient. Sweep only works after check date.",
      "atomic-swap-htlc": "Use the same preimage hash on both chains. Receiver claims with IF branch; sender refunds via ELSE after timeout.",
      "p2p-escrow": "Buyer funds escrow. 2-of-3: any two of buyer, seller, arbitrator can release.",
      "inheritance-switch": "Owner keeps control until inheritance date via ELSE branch.",
      "pqc-commitment": 'Paste PQ public key and signature hex from libdogecoin (<code>such -c falcon_sign</code> etc.). Commitment = SHA256(pk||sig). For production binds, sign tx sighash32. See the <a href="https://github.com/edtubbs/libdogecoin/blob/0.1.5-dev-pqc-carrier/doc/spec/bip-post-quantum-signature-commitments.mediawiki" target="_blank" rel="noopener">draft BIP</a>.',
      "pqc-carrier-proof": 'Paste raw hex from your node or explorer. Validates SHA256(pk||sig) against TX_C OP_RETURN, same check SPV scanners use. For full Falcon signature verify, use <a href="https://suchquantum.com/" target="_blank" rel="noopener">Such Quantum</a>.',
      "nft-mint": 'Same OP_RETURN pattern as the <a href="https://x.com/inevitable360/status/1470414541490110472" target="_blank" rel="noopener">first Dogecoin NFT mint (Dec 2021)</a>: <code>[sha256]</code> in OP_RETURN. Upload your image; verifiers re-hash to prove authenticity.',
      "reveal-code-unlock": "OP_HASH160 locks your reveal code. Buyer gets the preimage after payment; your app, game, or device checks HASH160(code) before unlocking.",
      "game-license-key": "License key committed on-chain. Game checks the code against OP_HASH160 before enabling DLC.",
      "music-download-code": "Download code as hash-lock preimage. Serve files only when the code matches.",
      "software-activation": "Activation code anchored with OP_HASH160 for license verification.",
      "smart-door-access": "PIN/token hash for smart locks: verify locally or via a spend with the correct preimage.",
      "iot-command-token": "Device command token locked with OP_HASH160 for privileged IoT actions."
    };
    return tips[id] || "Always test on testnet before using real DOGE on mainnet.";
  }
  function formatReviewValue(field, v) {
    if (field?.type === "file") return "(file uploaded)";
    const s = String(v ?? "");
    if (!s) return "";
    if (field?.type === "textarea" || s.length > 64) {
      const preview = escapeHtml5(s.slice(0, 40));
      return `<code class="review-hex" title="${escapeHtml5(s.slice(0, 512))}${s.length > 512 ? "\u2026" : ""}">${preview}\u2026 <span class="muted">(${s.length} chars)</span></code>`;
    }
    return escapeHtml5(s);
  }
  function renderStepReview() {
    const tpl = getTemplate(state.templateId);
    return `
    <h2>Review settings</h2>
    <div class="review-card">
      <h3>${tpl?.title || "n/a"}</h3>
      <dl class="review-list">
        <dt>Network</dt><dd>${networkReviewLabel(state.network)}</dd>
        ${Object.entries(state.formData).map(([k, v]) => {
      if (k.startsWith("_")) return "";
      const field = tpl?.fields.find((f) => f.id === k);
      const label = field?.label || k;
      return `<dt>${label}</dt><dd>${formatReviewValue(field, v)}</dd>`;
    }).join("")}
      </dl>
    </div>
    ${isMainnet(state.network) ? '<div class="warn-box"><span class="material-icons">warning</span> Mainnet uses real DOGE. Double-check your script before broadcasting.</div>' : ""}
  `;
  }
  function renderStepDeploy() {
    if (!state.result) return "<p>Generate a contract first.</p>";
    const r = state.result;
    if (r.type === "pqc_verify") {
      return renderPqcVerifyDeploy(r);
    }
    const steps = Array.isArray(r.steps) ? r.steps : [];
    return `
    <h2>${escapeHtml5(r.title)}</h2>
    <p>${escapeHtml5(r.description)}</p>

    ${r.meta?.pqc && r.type === "pqc_commitment" ? pqcCommitmentBlock(r) : ""}
    ${r.meta?.nft ? nftMintBlock(r.meta.nft) : ""}

    ${r.address ? addressBlock(r.address) : ""}
    ${r.meta?.qrPayload ? bankCheckBlock(r.meta) : ""}
    ${r.contracts ? contractsBlock(r.contracts) : ""}
    ${r.refundContract ? "<h4>Refund path script</h4>" + scriptBlock(r.refundContract.asm, "refund", true) : ""}
    ${r.commitAsm ? "<h4>Commit phase (OP_RETURN)</h4>" + scriptBlock(r.commitAsm, "commit", true) : ""}
    ${r.markerAsm ? "<h4>Content marker (OP_RETURN)</h4>" + scriptBlock(r.markerAsm, "marker", true) : ""}
    ${r.meta?.unlock ? unlockBlock(r.meta.unlock) : ""}
    ${r.meta?.secret ? secretBlock(r.meta) : ""}
    ${r.meta?.warning ? warnBlock(r.meta.warning) : ""}

    <div class="output-tabs">
      <button type="button" class="tab active" data-tab="sign">Sign TX</button>
      <button type="button" class="tab" data-tab="asm">Script ASM</button>
      <button type="button" class="tab" data-tab="hex">Script Hex</button>
      <button type="button" class="tab" data-tab="steps">Steps</button>
      ${r.clues ? '<button type="button" class="tab" data-tab="clues">Clues</button>' : ""}
    </div>

    <div class="output-panel" id="tab-sign">
      ${renderSignPanel(r)}
    ${state.signedTx ? renderSignedTxOutput(state.signedTx) : ""}
    </div>
    <div class="output-panel hidden" id="tab-asm">
      ${r.asm ? scriptBlock(r.asm, "asm", true) : '<p class="muted">No script ASM for this contract.</p>'}
    </div>
    <div class="output-panel hidden" id="tab-hex">
      ${r.hex ? codeBlock(r.hex, "hex", "Script hex") : ""}
      ${r.redeemScript ? "<h4>Redeem Script</h4>" + codeBlock(r.redeemScript, "redeem", "Redeem script hex") : ""}
    </div>
    <div class="output-panel hidden" id="tab-steps">
      <ol class="steps-list">${steps.map((s) => `<li>${escapeHtml5(s)}</li>`).join("")}</ol>
    </div>
    ${r.clues ? `<div class="output-panel hidden" id="tab-clues">${renderClues(r.clues)}</div>` : ""}
    ${r.capsuleAsm ? "<h4>Capsule Message Script</h4>" + scriptBlock(r.capsuleAsm, "capsule", true) : ""}

    <div class="export-row">
      <button type="button" class="btn btn-secondary" data-action="export-json"><span class="material-icons">download</span> Export JSON</button>
      <button type="button" class="btn btn-secondary" data-action="copy-all"><span class="material-icons">content_copy</span> Copy Summary</button>
    </div>
  `;
  }
  function unlockBlock(unlock) {
    const ops = unlock.opcodes?.join(" \u2192 ") || "OP_HASH160 OP_EQUAL";
    return `
    <div class="unlock-box">
      <h4><span class="material-icons">vpn_key</span> Reveal code lock</h4>
      <dl class="review-list">
        <dt>Use case</dt><dd>${escapeHtml5(unlock.contentType)}</dd>
        <dt>Content ID</dt><dd><code>${escapeHtml5(unlock.contentId)}</code></dd>
        <dt>Reveal code</dt><dd><code>${escapeHtml5(unlock.revealCode)}</code></dd>
        <dt>HASH160</dt><dd><code>${escapeHtml5(unlock.hash160)}</code></dd>
        <dt>OP_CODES</dt><dd><code>${escapeHtml5(ops)}</code></dd>
        ${unlock.priceNote ? `<dt>Price (off-chain)</dt><dd>${escapeHtml5(unlock.priceNote)}</dd>` : ""}
      </dl>
      <p class="field-hint">${escapeHtml5(unlock.integration)}</p>
      <p class="field-hint muted">Share the reveal code only after payment. Anyone with the code can satisfy the hash lock.</p>
    </div>
  `;
  }
  function bankCheckBlock(meta) {
    return `
    <div class="check-box">
      <span class="material-icons">payments</span>
      <div>
        <strong>Bank Check: QR / sweep payload</strong>
        <p>Pay to: <strong>${escapeHtml5(meta.payTo)}</strong> \xB7 ${escapeHtml5(meta.amount)} DOGE \xB7 Date: ${escapeHtml5(meta.lockDate)}</p>
        <code class="address">${escapeHtml5(meta.qrPayload)}</code>
        <small>Format: WIF|P2SH_ADDRESS|LOCKTIME_UNIX. Compatible with dogecoin-wallet sweep.</small>
        <p class="muted">WIF: <code>${escapeHtml5(meta.wif)}</code></p>
      </div>
      <button class="btn btn-icon" data-copy="${meta.qrPayload}" title="Copy QR payload"><span class="material-icons">content_copy</span></button>
    </div>
  `;
  }
  function nftMintBlock(nft) {
    return `
    <div class="nft-box">
      <h4><span class="material-icons">image</span> NFT checksum mint</h4>
      <dl class="review-list">
        ${nft.name ? `<dt>Name</dt><dd>${escapeHtml5(nft.name)}</dd>` : ""}
        ${nft.author ? `<dt>Creator</dt><dd>${escapeHtml5(nft.author)}</dd>` : ""}
        <dt>SHA-256</dt><dd><code>${escapeHtml5(nft.sha256)}</code></dd>
        <dt>OP_RETURN (ASCII)</dt><dd><code>${escapeHtml5(nft.opReturnAscii)}</code></dd>
      </dl>
      <p class="field-hint">
        Verify: re-hash your file locally. It must match the checksum inside the brackets.
        This records proof on-chain; it is not a transferable token standard like Ethereum NFTs.
      </p>
      <p class="field-hint">
        Historic reference (13 Dec 2021):
        <a href="${escapeHtml5(nft.tweetUrl)}" target="_blank" rel="noopener">@inevitable360 on X</a> \xB7
        <a href="${escapeHtml5(nft.blockchairUrl)}" target="_blank" rel="noopener">first mint tx</a>
        <code class="review-hex">${escapeHtml5(nft.historicTxid)}</code>
      </p>
    </div>
  `;
  }
  function pqcCommitmentBlock(r) {
    const p = r.meta.pqc;
    return `
    <div class="pqc-box">
      <h4><span class="material-icons">security</span> Post-quantum commitment (Phase 1)</h4>
      <dl class="review-list">
        <dt>Algorithm</dt><dd>${escapeHtml5(p.schemeLabel)} (<code>${escapeHtml5(p.tag)}</code>)</dd>
        <dt>commitment32</dt><dd><code>${escapeHtml5(p.commitmentHex)}</code></dd>
        <dt>pk / sig length</dt><dd>${p.pkLen} / ${p.sigLen} bytes</dd>
        <dt>Prefixes</dt><dd>pk <code>${escapeHtml5(p.pkPrefix)}\u2026</code> \xB7 sig <code>${escapeHtml5(p.sigPrefix)}\u2026</code></dd>
        <dt>Carrier tag</dt><dd><code>${escapeHtml5(p.carrierTag)}</code> (for TX_R reveal)</dd>
      </dl>
      <p class="field-hint">Canonical wire script: <code>${escapeHtml5(r.scriptWireHex || r.hex)}</code></p>
      <p class="field-hint">
        Rule: <code>commitment32 = SHA256(public_key_bytes || signature_bytes)</code>.
        <a href="${PQC_BIP_URL}" target="_blank" rel="noopener">Draft BIP</a> \xB7
        <a href="${SUCHQUANTUM_URL}" target="_blank" rel="noopener">Such Quantum verifier</a>
      </p>
    </div>
  `;
  }
  function renderPqcVerifyDeploy(r) {
    const v = r.verification;
    const steps = Array.isArray(r.steps) ? r.steps : [];
    return `
    <h2>${escapeHtml5(r.title)}</h2>
    <p>${escapeHtml5(r.description)}</p>
    <div class="pqc-box pqc-box--ok">
      <h4><span class="material-icons">verified</span> Carrier commitment validation passed</h4>
      <dl class="review-list">
        <dt>Algorithm</dt><dd>${escapeHtml5(v.algorithm)} (<code>${escapeHtml5(v.opReturnTag)}</code> / <code>${escapeHtml5(v.carrierTag)}</code>)</dt>
        <dt>TX_C txid</dt><dd><code>${escapeHtml5(v.txidC)}</code></dd>
        <dt>TX_R txid</dt><dd><code>${escapeHtml5(v.txidR)}</code></dd>
        <dt>Matched OP_RETURN vout</dt><dd>${v.matchedVout}</dd>
        <dt>commitment32</dt><dd><code>${escapeHtml5(v.commitmentHex)}</code></dd>
        <dt>pk / sig length</dt><dd>${v.pkLen} / ${v.sigLen} bytes</dd>
        <dt>Link</dt><dd>${v.spendsTxC ? "TX_R spends TX_C output" : escapeHtml5(v.note)}</dd>
      </dl>
      <p class="field-hint">
        This validates on-chain commitment material only. Full PQ signature verification over <code>tx_sighash32</code>
        requires libdogecoin, DogeGo SPV, or the
        <a href="${SUCHQUANTUM_URL}" target="_blank" rel="noopener">Such Quantum</a> Falcon verifier.
        <a href="${PQC_BIP_URL}" target="_blank" rel="noopener">Draft BIP</a>
      </p>
    </div>
    <h3>Next steps</h3>
    <ol class="steps-list">${steps.map((s) => `<li>${s}</li>`).join("")}</ol>
    <div class="export-row">
      <button type="button" class="btn btn-secondary" data-action="export-json"><span class="material-icons">download</span> Export JSON</button>
    </div>
  `;
  }
  function contractsBlock(contracts) {
    return `
    <div class="contracts-block">
      <h4><span class="material-icons">layers</span> Related contracts (${contracts.length})</h4>
      ${contracts.map((c, i) => `
        <div class="clue-card">
          <h4>${escapeHtml5(c.role || c.label || `Contract ${i + 1}`)}${c.amountNote ? ` (${escapeHtml5(c.amountNote)} DOGE)` : ""}</h4>
          ${c.address ? `<p><code>${escapeHtml5(c.address)}</code></p>` : ""}
          ${scriptBlock(c.asm, `contract-${i}`, true)}
        </div>
      `).join("")}
    </div>
  `;
  }
  function addressBlock(addr) {
    return `
    <div class="address-box">
      <span class="material-icons">account_balance_wallet</span>
      <div>
        <small>Fund this P2SH address</small>
        <code class="address">${addr}</code>
      </div>
      <button class="btn btn-icon" data-copy="${addr}" title="Copy"><span class="material-icons">content_copy</span></button>
    </div>
  `;
  }
  function secretBlock(meta) {
    return `
    <div class="secret-box">
      <span class="material-icons">key</span>
      <div>
        <strong>Secret (keep private until ready!)</strong>
        <code>${escapeHtml5(meta.secret)}</code>
        <small>Hex: ${meta.secretHex || "n/a"} \xB7 HASH160: ${meta.hash160 || "n/a"}</small>
      </div>
    </div>
  `;
  }
  function warnBlock(msg) {
    return `<div class="warn-box"><span class="material-icons">warning</span> ${msg}</div>`;
  }
  function codeBlock(text, id, title = "Output") {
    const wrapAt = id.includes("hex") || /^[0-9a-fA-F]+$/.test(String(text).replace(/\s/g, "")) ? 64 : 96;
    return renderCodeView(text, id, { title, wrapAt });
  }
  function scriptBlock(text, id, editable = false, title = "Script ASM") {
    if (/\bOP_[A-Z0-9_]+\b/.test(text)) {
      return asmBlock(text, id, { editable, showPalette: editable, title });
    }
    return codeBlock(text, id, title);
  }
  function signModes(result) {
    return signModesForTemplate(state.templateId, result);
  }
  function renderSignPanel(r) {
    const modes = signModes(r);
    const defaultMode = modes[0].id;
    const dataHex = opReturnDataHex(r);
    const fundDefault = r.meta?.amount ? String(r.meta.amount) : "";
    const modeIds = new Set(modes.map((m) => m.id));
    const anyNeeds = (key) => modes.some((m) => signNeedsForMode(m.id)[key]);
    const modeSelector = modes.length > 1 ? renderModernSelect({
      id: "sign-mode",
      label: "Transaction type",
      options: modes.map((m) => ({ value: m.id, label: m.label })),
      value: defaultMode,
      required: true
    }) : `<input type="hidden" id="sign-mode" name="sign-mode" value="${defaultMode}">`;
    return `
    <div class="sign-panel">
      ${renderSignSecurityBanner()}

      <form id="sign-form" class="wizard-form">
        ${modeSelector}

        <div id="sign-utxo-section" class="sign-section-block ${anyNeeds("utxo") ? "" : "hidden"}">
          <h4 class="sign-section">Input UTXO (coins you are spending)</h4>
          <div class="field-row field-row--utxo">
            <div class="field"><label for="utxo-txid">Transaction ID (TXID) *</label><input id="utxo-txid" placeholder="64-char hex txid of funding UTXO" required></div>
            <div class="field field-vout"><label for="utxo-vout" title="Output index (vout) in the funding transaction">Vout *</label><input id="utxo-vout" type="number" value="0" min="0" step="1" required></div>
          </div>
          <div class="field-row">
            <div class="field"><label for="utxo-value">Input amount (DOGE) *</label>${dogeInputAttrs({ id: "utxo-value", name: "utxo-value", placeholder: "e.g. 100.5", required: true })}</div>
            <div class="field"><label for="utxo-address">Source Dogecoin address *</label><input id="utxo-address" placeholder="address that received this UTXO" required></div>
          </div>
        </div>

        <div id="sign-wif-section" class="sign-wif-field field ${anyNeeds("wif") ? "" : "hidden"}">
          <label for="sign-wif">Private key (WIF or hex) <span id="wif-hint">*</span></label>
          <input id="sign-wif" type="password" placeholder="Required for this transaction type" autocomplete="off">
          <small class="field-hint">Used only locally to sign. Never uploaded. Prefer signing while offline.</small>
        </div>

        ${modeIds.has("fund") ? `
        <div id="sign-mode-fund" class="mode-fields ${defaultMode === "fund" ? "" : "hidden"}">
          <h4 class="sign-section">Fund contract</h4>
          <div class="field"><label for="fund-amount">Amount to lock (DOGE) *</label>${dogeInputAttrs({ id: "fund-amount", name: "fund-amount", value: fundDefault, placeholder: "10.00", required: true })}</div>
          <div class="field"><label>Destination (P2SH)</label><input value="${escapeHtml5(r.address || "")}" readonly class="readonly"></div>
        </div>` : ""}

        ${modeIds.has("op_return") ? `
        <div id="sign-mode-op_return" class="mode-fields ${defaultMode === "op_return" ? "" : "hidden"}">
          <h4 class="sign-section">OP_RETURN data</h4>
          <div class="field"><label>Data hex</label><input value="${escapeHtml5(dataHex || "")}" readonly class="readonly"></div>
        </div>` : ""}

        ${modeIds.has("clue") ? `
        <div id="sign-mode-clue" class="mode-fields ${defaultMode === "clue" ? "" : "hidden"}">
          <h4 class="sign-section">Clue OP_RETURN</h4>
          ${r.clues?.length ? renderModernSelect({
      id: "clue-index",
      label: "Clue #",
      options: r.clues.map((_, i) => ({ value: String(i), label: `Clue ${i + 1}` })),
      value: "0"
    }) : '<p class="field-hint">No clues configured.</p>'}
        </div>` : ""}

        ${modeIds.has("claim") ? `
        <div id="sign-mode-claim" class="mode-fields ${defaultMode === "claim" ? "" : "hidden"}">
          <h4 class="sign-section">Claim locked coins</h4>
          <div class="field"><label for="claim-to">Receive at address *</label><input id="claim-to" placeholder="your P2PKH address"></div>
          <div class="field"><label for="claim-preimage">Secret preimage *</label><input id="claim-preimage" value="${escapeHtml5(r.meta?.secret || r.meta?.winningNumber || "")}" placeholder="answer / passphrase for hash lock"></div>
          <div class="field"><label>Redeem script hex</label><input value="${escapeHtml5(r.hex || "")}" readonly class="readonly"></div>
        </div>` : ""}

        ${modeIds.has("sweep_cltv") ? `
        <div id="sign-mode-sweep_cltv" class="mode-fields ${defaultMode === "sweep_cltv" ? "" : "hidden"}">
          <h4 class="sign-section">Sweep CLTV / bank check</h4>
          <div class="field"><label for="sweep-to">Receive at address *</label><input id="sweep-to" placeholder="recipient P2PKH address"></div>
          <div class="field"><label for="sign-wif-cltv">Check WIF *</label><input id="sign-wif-cltv" type="password" value="${escapeHtml5(r.meta?.wif || "")}" placeholder="from QR payload or bank check meta" autocomplete="off"></div>
          <p class="field-hint">Tx nLockTime = ${r.meta?.locktime || "locktime from contract"}. Only valid after unlock date.</p>
        </div>` : ""}

        <div id="sign-fee-section" class="sign-section-block ${anyNeeds("fee") ? "" : "hidden"}">
          <h4 class="sign-section">Fees & change</h4>
          <div class="field-row">
            <div class="field"><label for="sign-fee">Fee (DOGE)</label>${dogeInputAttrs({ id: "sign-fee", name: "sign-fee", value: "0.01", placeholder: "0.01" })}</div>
            <div class="field" id="sign-change-field"><label for="sign-change">Change address</label><input id="sign-change" placeholder="your change address"></div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-lg" id="sign-submit">
          <span class="material-icons">draw</span> Generate Signed Transaction
        </button>
      </form>
    </div>
  `;
  }
  function renderSignedTxOutput(tx) {
    return `
    <div class="signed-tx-box">
      <h3><span class="material-icons">check_circle</span> Signed raw transaction</h3>
      <dl class="review-list">
        <dt>TXID (expected)</dt><dd><code>${tx.txid}</code></dd>
        <dt>Fee</dt><dd>${tx.fee} DOGE</dd>
        <dt>Change</dt><dd>${tx.change} DOGE</dd>
        <dt>Size</dt><dd>${tx.sizeBytes} bytes</dd>
      </dl>
      ${codeBlock(tx.rawHex, "signed-raw", "Signed raw transaction hex")}
      ${renderLocalBroadcastHelp(tx.rawHex, state.network)}
      ${renderBroadcastPanel(tx.rawHex, state.network)}
    </div>
  `;
  }
  function renderClues(clues) {
    return clues.map((c, i) => `
    <div class="clue-card">
      <h4>Clue ${i + 1}</h4>
      ${scriptBlock(c.asm, `clue-${i}`, true)}
    </div>
  `).join("");
  }
  function renderTemplateGallery() {
    return `
    <section class="page-header">
      <h1><span class="material-icons">dashboard</span> Template Gallery</h1>
      <p>${TEMPLATES.length} ready-made smart contract patterns for Dogecoin.</p>
    </section>
    <div class="template-grid gallery">
      ${TEMPLATES.map((t) => `
        <article class="gallery-card">
          <span class="material-icons">${t.icon}</span>
          <h3>${t.title}</h3>
          <p>${t.tagline}</p>
          <span class="badge">${TEMPLATE_CATEGORIES.find((c) => c.id === t.category)?.label}</span>
          <button class="btn btn-primary" data-use-template="${t.id}">Use Template</button>
        </article>
      `).join("")}
    </div>
  `;
  }
  function bindGalleryEvents() {
    $$("[data-use-template]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.templateId = btn.dataset.useTemplate;
        state.step = 1;
        state.formData = {};
        const tpl = getTemplate(state.templateId);
        state.category = tpl?.category;
        navigate("wizard");
      });
    });
  }
  function renderOpcodeExplorer() {
    const defaultAsm = "OP_HASH160 abcd1234 OP_EQUAL";
    return `
    <section class="page-header">
      <h1><span class="material-icons">science</span> Opcode Explorer</h1>
      <p>Learn the stack machine behind Dogecoin smart contracts. Drag OP_CODES into the playground.</p>
    </section>
    <div class="opcode-grid">
      ${EXPLORER_OPCODES.map((op) => `
        <article class="opcode-card" data-op="${op.name}" draggable="true" title="Drag to playground">
          <code>${op.name}</code>
          <span class="badge">${op.category}</span>
          <p>${op.desc}</p>
          <button class="btn btn-ghost btn-sm" data-insert-op="${op.name}">Add to Playground</button>
        </article>
      `).join("")}
    </div>
    <section class="playground-section" id="playground">
      <h2>Quick Playground</h2>
      ${renderOpcodePalette()}
      ${renderOpcodeBadgeStack(tokenizeAsm(defaultAsm), { id: "playground-asm", editable: true })}
      <textarea id="playground-asm" rows="2" hidden>${defaultAsm}</textarea>
      <button class="btn btn-primary" id="playground-build"><span class="material-icons">play_arrow</span> Build Script</button>
      <div id="playground-output"></div>
    </section>
  `;
  }
  function bindOpcodeEvents() {
    bindOpcodeBadgeUI($("#main"));
    bindModernSelects($("#main"));
    $("#main")?.addEventListener("asm-changed", (e) => {
      if (e.detail?.id === "playground-asm") {
        const ta = $("#playground-asm");
        if (ta) ta.value = e.detail.asm;
      }
    });
    $$("[data-insert-op]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const stack = $('[data-stack-id="playground-asm"]');
        if (!stack) return;
        appendStackToken(stack, { type: "opcode", value: btn.dataset.insertOp });
      });
    });
    $("#playground-build")?.addEventListener("click", async () => {
      const asm = $("#playground-asm")?.value.trim();
      const out = $("#playground-output");
      if (!asm || !out) return;
      try {
        const hex = bytesToHex(asmToScript(asm));
        let addr = "";
        try {
          addr = await p2shAddressFromScript(hex, state.network);
        } catch {
        }
        out.innerHTML = `
        ${scriptBlock(asm, "playground-out", false, "Script ASM")}
        ${renderCodeView(hex, "playground-hex", { title: "Script hex", wrapAt: 64 })}
        ${addr ? `<p>P2SH address: <code>${addr}</code></p>` : '<p class="muted">Not a standard P2SH script or too large.</p>'}
      `;
        bindOpcodeBadgeUI(out);
        bindCodeViews(out);
      } catch (e) {
        out.innerHTML = `<div class="warn-box">${escapeHtml5(e.message)}</div>`;
      }
    });
  }
  function renderDocs() {
    return `
    <section class="docs">
      <h1><span class="material-icons">menu_book</span> How to Use This Wizard</h1>

      <article class="doc-section">
        <h2>What This Tool Does</h2>
        <p>This is an <strong>educational offline-first</strong> builder for Dogecoin scripts (smart contracts). It generates:</p>
        <ul>
          <li><strong>Script ASM & hex</strong>: the smart contract logic</li>
          <li><strong>P2SH addresses</strong>: where to send locked DOGE</li>
          <li><strong>Signed raw transactions</strong>: copy hex and broadcast anywhere</li>
        </ul>
        <p>No connection to a node is required to build or sign. Keys stay in your browser; paste the signed hex into <a href="https://dogego.org" target="_blank" rel="noopener">DogeGo</a>, Dogecoin Core, or any broadcaster.</p>
      </article>

      <article class="doc-section" id="smart-contracts-philosophy">
        <h2>Why &ldquo;Smart Contracts&rdquo; on Dogecoin?</h2>
        <p>
          Bitcoin-family chains have used script logic since day one, but the label <strong>smart contract</strong>
          became popular with account-based platforms. That does not mean Dogecoin lacks contracts. Only that
          the shape is different.
        </p>
        <h3>The three-part test</h3>
        <p>If a system has all of the following, calling it a smart contract is reasonable:</p>
        <ol>
          <li><strong>Logic</strong>: encoded rules (OP_CODES like <code>OP_CHECKSIG</code>, <code>OP_CHECKLOCKTIMEVERIFY</code>, <code>OP_IF</code>)</li>
          <li><strong>Agreement</strong>: participants lock value under those rules by choice</li>
          <li><strong>Execution</strong>: the network evaluates the script when a transaction is included in a block; invalid spends are rejected</li>
        </ol>
        <p>No separate VM required. The script <em>is</em> the contract. Inclusion in a block <em>is</em> execution.</p>

        <h3>What OP_CODES cannot do (by design)</h3>
        <p>Dogecoin\u2019s script language is deliberately <strong>not</strong> Turing-complete. That is a security and predictability feature, not a missing feature:</p>
        <ul>
          <li><strong>No loops or repeat</strong>: scripts cannot iterate; they run once per input validation</li>
          <li><strong>No persistent contract memory</strong>: state lives in UTXOs, not in a global contract store</li>
          <li><strong>No single callable contract address</strong>: each funded output carries its own script; spending it consumes that UTXO</li>
        </ul>
        <table class="doc-table">
          <tr><th>Capability</th><th>General-purpose chain</th><th>Dogecoin OP_CODES</th></tr>
          <tr><td>Turing completeness</td><td>Often yes</td><td>No</td></tr>
          <tr><td>Persistent on-chain state</td><td>Contract storage</td><td>UTXO set only</td></tr>
          <tr><td>Re-entrant / repeated calls</td><td>Common pattern</td><td>New UTXO per lock</td></tr>
          <tr><td>Conditional release of DOGE</td><td>Yes</td><td><strong>Yes</strong></td></tr>
          <tr><td>Multisig, timelocks, hash locks</td><td>Yes (higher layer)</td><td><strong>Native Layer 1</strong></td></tr>
        </table>
        <p>
          So the difference is not &ldquo;contracts vs no contracts&rdquo;. It is <strong>simple, auditable Layer 1 locks</strong>
          versus <strong>general-purpose programs</strong>. Dogecoin still executes logic in a smart, simple way:
          treasure hunts, escrows, vesting tranches, and post-quantum commitments are all agreements enforced by code on-chain.
        </p>

        <h3>Permissionless words</h3>
        <p>
          There is no standards body that grants permission to use the term <em>smart contract</em>.
          Dogecoin is permissionless; so is language. This wizard uses <strong>smart contracts</strong> because
          OP_CODE scripts are agreements with automatic execution, and because the community can adopt whatever
          name fits. Much wow, very contract.
        </p>
      </article>

      <article class="doc-section">
        <h2>Broadcasting with DogeGo</h2>
        <p>
          <strong><a href="https://dogego.org" target="_blank" rel="noopener">DogeGo</a></strong> is an improved Dogecoin full node based on Core.
          It includes a wallet, web dashboard, and JSON-RPC API that speaks the same methods as Dogecoin Core
          (<code>sendrawtransaction</code>, <code>createrawtransaction</code>, <code>decodescript</code>, and more).
        </p>
        <ul>
          <li><strong>New testnet</strong>: DogeGo is a reference node (P2P port 44556, RPC typically 18556).</li>
          <li><strong>Mainnet</strong>: DogeGo also syncs mainnet with the same RPC workflow as Core.</li>
          <li><strong>Legacy testnet</strong>: use Dogecoin Core; public explorers and DogeGo target the reboot chain.</li>
        </ul>
        <p>After signing in this wizard, copy the raw hex and either:</p>
        <ol>
          <li>Paste into DogeGo's wallet / broadcast UI while your node is running, or</li>
          <li>Call <code>sendrawtransaction</code> via JSON-RPC (curl example shown on the Sign TX step), or</li>
          <li>Use <code>dogecoin-cli -testnet sendrawtransaction &lt;hex&gt;</code> against any compatible node.</li>
        </ol>
        <p>Download and documentation: <a href="https://dogego.org" target="_blank" rel="noopener">dogego.org</a></p>
      </article>

      <article class="doc-section">
        <h2>Networks</h2>
        <table class="doc-table">
          <tr><th>Network</th><th>RPC Port</th><th>Use</th></tr>
          <tr><td>New testnet</td><td>18556</td><td>Rebooted chain from 2025. P2P port 44556. Use <code>-testnet</code> with DogeGo or compatible nodes.</td></tr>
          <tr><td>Legacy testnet</td><td>44555</td><td>Original Dogecoin testnet (<code>n\u2026</code> addresses).</td></tr>
          <tr><td>Mainnet</td><td>22555</td><td>Real DOGE for production.</td></tr>
          <tr><td>Regtest</td><td>18332</td><td>Local instant blocks (<code>-regtest</code>)</td></tr>
        </table>
      </article>

      <article class="doc-section">
        <h2>Workflow</h2>
        <ol>
          <li>Pick a template and configure your contract</li>
          <li>Open the <strong>Sign TX</strong> tab on the deploy step</li>
          <li>Enter your UTXO details and private key (WIF). Keys stay local.</li>
          <li>Click <strong>Generate Signed Transaction</strong></li>
          <li>Copy the raw hex and broadcast via <a href="https://dogego.org" target="_blank" rel="noopener">DogeGo</a>, Dogecoin Core, CLI, or a block explorer</li>
        </ol>
      </article>

      <article class="doc-section">
        <h2>Post-Quantum Commitments (Phase 1)</h2>
        <p>
          Dogecoin is adding a staged path for post-quantum (PQ) signature evidence via canonical
          <code>OP_RETURN</code> commitments. See the
          <a href="${PQC_BIP_URL}" target="_blank" rel="noopener">draft BIP: Post-Quantum Signature Commitments</a>
          in libdogecoin.
        </p>
        <ul>
          <li><strong>Algorithms</strong>: Falcon-512 (<code>FLC1</code>), Dilithium2 (<code>DIL2</code>), Raccoon-G-44 (<code>RCG4</code>)</li>
          <li><strong>Commitment rule</strong>: <code>commitment32 = SHA256(public_key_bytes || signature_bytes)</code></li>
          <li><strong>Wire format</strong>: <code>6a 24 &lt;tag4&gt; &lt;32-byte-commitment&gt;</code></li>
          <li><strong>Carrier mode</strong>: TX_C publishes OP_RETURN + P2SH carrier outputs; TX_R reveals full pk||sig in scriptSig (<code>FLC1FULL</code>, <code>DIL2FULL</code>, <code>RCG4FULL</code>)</li>
        </ul>
        <p>
          Use the wizard <strong>Post-Quantum</strong> templates to build commitment scripts or verify TX_C+TX_R carrier proofs in-browser.
          For interactive digest preview and Falcon verification, see
          <a href="${SUCHQUANTUM_URL}" target="_blank" rel="noopener">Such Quantum</a>.
          Production signing uses libdogecoin <code>such -c</code> commands (<code>falcon_sign</code>, <code>falcon_commit</code>, <code>falcon_add_commit_tx</code>, etc.).
        </p>
        <p class="muted">Phase 1 commitments are parallel evidence alongside secp256k1 spend rules, not yet consensus-enforced PQ validation.</p>
      </article>

      <article class="doc-section">
        <h2>Template Guide</h2>
        <dl class="doc-dl">
          <dt>Post-quantum commitment</dt><dd>Build canonical FLC1/DIL2/RCG4 OP_RETURN from pk + sig hex; broadcast via Sign TX.</dd>
          <dt>PQC carrier proof</dt><dd>Paste TX_C and TX_R raw hex; validates SHA256(pk||sig) against on-chain commitment.</dd>
          <dt>Reveal code unlock</dt><dd>OP_HASH160 locks a code for games, music, software, doors, or IoT. Share preimage after payment.</dd>
          <dt>Game / music / software keys</dt><dd>Specialized reveal-code templates with integration hints for each use case.</dd>
          <dt>File checksum</dt><dd>SHA-256 of a file committed permanently; verify by re-hashing.</dd>
          <dt>NFT mint (checksum)</dt><dd>OP_RETURN <code>[sha256]</code> anchor for digital art, same pattern as the <a href="https://x.com/inevitable360/status/1470414541490110472" target="_blank" rel="noopener">Dec 2021 Dogecoin NFT mint</a>.</dd>
          <dt>OP_RETURN messages</dt><dd>Unspendable outputs storing up to ~80 bytes of data on-chain.</dd>
          <dt>Hash lock / treasure hunt</dt><dd>Spender must reveal preimage matching HASH160 in script.</dd>
          <dt>Time lock (CLTV)</dt><dd><code>OP_CHECKLOCKTIMEVERIFY</code> blocks spend until nLockTime.</dd>
          <dt>Multi-sig</dt><dd>M-of-N signatures via <code>OP_CHECKMULTISIG</code>.</dd>
          <dt>Geocache / ARG</dt><dd>Chain OP_RETURN clues to a final hash-locked prize.</dd>
          <dt>Bank Check</dt><dd>CLTV post-dated payment, same pattern as dogecoin-wallet. QR: <code>WIF|address|locktime</code>.</dd>
          <dt>HTLC / Atomic swap</dt><dd><code>OP_IF</code> hash claim + <code>OP_ELSE</code> CLTV refund.</dd>
          <dt>Escrow & vesting</dt><dd>Multisig or milestone CLTV tranches for DeFi-adjacent flows.</dd>
        </dl>
      </article>

      <article class="doc-section">
        <h2>Spending a Hash Lock (P2SH)</h2>
        <p>Redeem script: <code>OP_HASH160 &lt;hash&gt; OP_EQUAL</code></p>
        <p>ScriptSig when spending: <code>&lt;preimage_hex&gt;</code> plus redeem script in P2SH input.</p>
        <p>For pubkey+hash: <code>&lt;sig&gt; &lt;pubkey&gt; &lt;preimage&gt;</code></p>
      </article>

      <article class="doc-section">
        <h2>Safety</h2>
        <ul>
          <li>Test every script on testnet or regtest first</li>
          <li>Never share private keys; pubkeys are safe to share for multisig</li>
          <li>First-to-solve races are irreversible. First valid tx wins.</li>
          <li>This tool is not financial advice; scripts are provided as-is</li>
        </ul>
      </article>

      <article class="doc-section">
        <h2>Offline / GitHub Pages</h2>
        <p>After the first visit, a service worker caches assets so you can build contracts without internet. Host by enabling GitHub Pages on this repo (root or <code>/docs</code>).</p>
      </article>
    </section>
  `;
  }
  function refreshStepChoose() {
    const body = $(".wizard-body");
    if (body) body.innerHTML = renderStepChoose();
    bindWizardChooseEvents();
    bindCategoryTabEvents();
  }
  function bindCategoryTabEvents() {
    $$(".category-tabs .tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        state.category = tab.dataset.category || null;
        refreshStepChoose();
      });
    });
  }
  function bindWizardEvents() {
    bindCategoryTabEvents();
    bindWizardChooseEvents();
    bindWizardConfigureEvents();
    bindOpcodeBadgeUI($(".wizard-body"));
    bindModernSelects($(".wizard-body"));
    $('[data-action="prev"]')?.addEventListener("click", () => {
      if (state.step > 0) {
        state.step--;
        navigate("wizard");
      }
    });
    $('[data-action="next"]')?.addEventListener("click", async () => {
      if (state.step === 0 && !state.templateId) {
        toast("Please select a template");
        return;
      }
      if (state.step === 1) {
        const ok = await collectFormData();
        if (!ok) return;
      }
      state.step++;
      navigate("wizard");
    });
    $('[data-action="build"]')?.addEventListener("click", async (e) => {
      e.preventDefault();
      const btn = e.currentTarget;
      if (btn.disabled) return;
      btn.disabled = true;
      try {
        await buildContract();
      } finally {
        btn.disabled = false;
      }
    });
    $('[data-action="pqc-demo-fill"]')?.addEventListener("click", async () => {
      const scheme = $("#f-scheme")?.value || state.formData.scheme || "falcon";
      try {
        const demo = await demoPqcMaterial(scheme);
        const pkEl = $("#f-pubkey");
        const sigEl = $("#f-signature");
        if (pkEl) pkEl.value = demo.pubkeyHex;
        if (sigEl) sigEl.value = demo.signatureHex;
        state.formData.pubkey = demo.pubkeyHex;
        state.formData.signature = demo.signatureHex;
        toast("Demo material filled (random bytes, for length/preview only)");
      } catch (err2) {
        toast(err2.message || "Demo fill failed");
      }
    });
    $('[data-action="new"]')?.addEventListener("click", () => {
      state.step = 0;
      state.templateId = null;
      state.formData = {};
      state.result = null;
      state.signedTx = null;
      navigate("wizard");
    });
    bindOutputEvents();
  }
  function bindWizardChooseEvents() {
    $$('input[name="template"]').forEach((input) => {
      input.addEventListener("change", () => {
        state.templateId = input.value;
        $$(".template-card").forEach((c) => c.classList.remove("selected"));
        input.closest(".template-card")?.classList.add("selected");
      });
    });
    const fileInput = $("#f-file");
    fileInput?.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const hash = await fileSha256(file);
      state.formData._fileHash = hash;
      state.formData.hash = hash;
      const hashInput = $("#f-hash");
      if (hashInput) hashInput.value = hash;
      const filenameInput = $("#f-filename");
      if (filenameInput && !filenameInput.value.trim()) filenameInput.value = file.name;
      const disp = $("#file-hash-display");
      if (disp) disp.textContent = `SHA-256: ${hash} (filled in hash field)`;
      toast("File hash computed and filled in");
    });
  }
  function bindWizardConfigureEvents() {
    bindOpcodeBadgeUI($("#wizard-form"));
    bindModernSelects($("#wizard-form"));
    bindDogeInputs($("#wizard-form"));
    const docEl = $("#f-document");
    let docTimer;
    docEl?.addEventListener("input", () => {
      clearTimeout(docTimer);
      docTimer = setTimeout(async () => {
        const v = docEl.value.trim();
        const preview = $("#document-hash-preview");
        if (!preview) return;
        if (/^[0-9a-fA-F]{64}$/.test(v)) {
          preview.textContent = `Using pasted hash: ${v.toLowerCase()}`;
          state.formData._documentHash = v.toLowerCase();
          return;
        }
        if (!v) {
          preview.textContent = "";
          return;
        }
        const h = await sha256Hex(v);
        preview.textContent = `Computed SHA-256: ${h}`;
        state.formData._documentHash = h;
      }, 400);
    });
    if (state.templateId === "treasure-hunt") {
      const secretField = $("#f-secret")?.closest(".field");
      if (secretField && !$("#btn-gen-secret")) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-secondary btn-sm field-action-btn";
        btn.id = "btn-gen-secret";
        btn.innerHTML = '<span class="material-icons">casino</span> Generate random secret';
        secretField.appendChild(btn);
        btn.addEventListener("click", () => {
          const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          let s = "";
          for (let i = 0; i < 16; i++) s += chars[Math.floor(Math.random() * chars.length)];
          const el = $("#f-secret");
          if (el) el.value = s;
          toast("Random secret generated");
        });
      }
    }
    if (state.templateId === "document-commit") {
      const docField = $("#f-document")?.closest(".field");
      if (docField && !$("#document-hash-preview")) {
        const span = document.createElement("span");
        span.id = "document-hash-preview";
        span.className = "file-hash";
        docField.appendChild(span);
      }
    }
  }
  async function collectFormData() {
    const tpl = getTemplate(state.templateId);
    if (!tpl) return false;
    const form = $("#wizard-form");
    if (!form) return false;
    const data = { ...state.formData };
    for (const field of tpl.fields) {
      const el = $(`#f-${field.id}`);
      if (!el) continue;
      if (field.type === "file") continue;
      data[field.id] = el.value;
      if (field.required && !String(el.value).trim() && field.type !== "file") {
        toast(`Please fill: ${field.label}`);
        el.focus();
        return false;
      }
      if (field.type === "doge" && String(el.value).trim()) {
        if (!isValidDogeAmount(el.value)) {
          toast(`${field.label}: numbers only, up to 8 decimals`);
          el.focus();
          return false;
        }
      }
    }
    if ((tpl.id === "file-checksum" || tpl.id === "nft-mint") && !data.hash && !data._fileHash) {
      toast("Upload a file or paste a hash");
      return false;
    }
    state.formData = data;
    return true;
  }
  async function buildContract() {
    const tpl = getTemplate(state.templateId);
    if (!tpl) {
      toast("Select a template first");
      return false;
    }
    try {
      state.result = await tpl.build(state.formData, state.network);
      state.signedTx = null;
      state.step = 3;
      navigate("wizard");
      toast("Contract generated!");
      return true;
    } catch (e) {
      toast(e.message);
      state.step = 2;
      navigate("wizard");
      return false;
    }
  }
  async function rebuildResult() {
    const tpl = getTemplate(state.templateId);
    if (!tpl || !state.result) return;
    try {
      state.result = await tpl.build(state.formData, state.network);
      navigate("wizard");
    } catch {
    }
  }
  function bindOutputEvents() {
    bindOpcodeBadgeUI($(".wizard-body"));
    bindModernSelects($(".wizard-body"));
    bindDogeInputs($(".wizard-body"));
    bindCodeViews($(".wizard-body"), (text) => toast("Copied!"));
    bindBroadcastPanel($(".wizard-body"), state.network);
    $$(".output-tabs .tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".output-tabs .tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        $$(".output-panel").forEach((p) => p.classList.add("hidden"));
        $(`#tab-${tab.dataset.tab}`)?.classList.remove("hidden");
      });
    });
    $$("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.dataset.copy;
        if (text) copyToClipboard(text);
      });
    });
    $('[data-action="export-json"]')?.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state.result, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `doge-contract-${state.templateId}.json`;
      a.click();
    });
    $('[data-action="copy-all"]')?.addEventListener("click", () => {
      const r = state.result;
      const summary = [
        r.title,
        r.description,
        r.address ? `Address: ${r.address}` : "",
        state.signedTx ? `Signed TX: ${state.signedTx.rawHex}` : "",
        `ASM: ${r.asm}`,
        `Hex: ${r.hex}`
      ].filter(Boolean).join("\n\n");
      copyToClipboard(summary);
    });
    bindSignForm();
  }
  function updateSignSecurityBanner() {
    const banner = $(".sign-security-banner");
    if (!banner) return;
    const safe = !navigator.onLine;
    banner.className = `sign-security-banner ${safe ? "sign-security-banner--safe" : "sign-security-banner--warn"}`;
    banner.innerHTML = `
    <span class="material-icons">${safe ? "shield" : "warning"}</span>
    <div>
      <strong>${safe ? "Offline mode: good for signing" : "Security: private keys stay in your browser only"}</strong>
      <p>For maximum safety before entering a WIF: disconnect from the internet (Wi\u2011Fi off or unplug ethernet), then sign. Copy the raw hex and broadcast later from another device.</p>
    </div>
  `;
  }
  async function bindSignForm() {
    const form = $("#sign-form");
    if (!form || form.dataset.signBound) return;
    form.dataset.signBound = "1";
    const applyModeVisibility = () => {
      const mode = $("#sign-mode")?.value || "fund";
      const needs = signNeedsForMode(mode);
      $$(".mode-fields").forEach((el) => el.classList.add("hidden"));
      $(`#sign-mode-${mode}`)?.classList.remove("hidden");
      $("#sign-utxo-section")?.classList.toggle("hidden", !needs.utxo);
      $("#sign-wif-section")?.classList.toggle("hidden", !needs.wif);
      $("#sign-fee-section")?.classList.toggle("hidden", !needs.fee);
      const changeField = $("#sign-change-field");
      const changeInput = $("#sign-change");
      if (changeField && changeInput) {
        changeField.classList.toggle("hidden", !needs.change);
        changeInput.required = !!needs.change;
      }
      const wifMain = $("#sign-wif");
      if (wifMain) wifMain.required = !!needs.wif;
      const hint = $("#wif-hint");
      if (hint) hint.textContent = needs.wif ? "*" : "";
    };
    const modeSelect = $("#sign-mode");
    modeSelect?.addEventListener("change", applyModeVisibility);
    applyModeVisibility();
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        state.signedTx = await handleSignSubmit();
        toast("Transaction signed!");
        navigate("wizard");
      } catch (err2) {
        toast(err2.message || "Signing failed");
      }
    });
  }
  async function handleSignSubmit() {
    const r = state.result;
    if (!r) throw new Error("Generate a contract first");
    const mode = $("#sign-mode")?.value || "fund";
    const needs = signNeedsForMode(mode);
    const utxo = {
      txid: $("#utxo-txid")?.value.trim(),
      vout: $("#utxo-vout")?.value,
      valueDoge: parseDogeAmount($("#utxo-value")?.value, "Input amount"),
      address: $("#utxo-address")?.value.trim()
    };
    const privateKey = $("#sign-wif")?.value.trim();
    const feeDoge = parseDogeAmount($("#sign-fee")?.value || "0.01", "Fee");
    const changeAddress = $("#sign-change")?.value.trim();
    if (needs.utxo && (!utxo.txid || !utxo.address)) {
      throw new Error("Fill in UTXO txid and source address");
    }
    const base = { network: state.network, utxo, feeDoge, changeAddress };
    if (mode === "op_return") {
      const dataHex = opReturnDataHex(r);
      if (!dataHex) throw new Error("No OP_RETURN data in contract");
      if (!privateKey) throw new Error("Private key required");
      if (!changeAddress) throw new Error("Change address required");
      return buildOpReturnTx({ ...base, privateKey, dataHex });
    }
    if (mode === "clue") {
      const idx = parseInt($("#clue-index")?.value || "0", 10);
      const clue = r.clues?.[idx];
      const dataHex = clue?.asm?.split(" ")[1];
      if (!dataHex) throw new Error("Invalid clue");
      if (!privateKey) throw new Error("Private key required");
      if (!changeAddress) throw new Error("Change address required");
      return buildOpReturnTx({ ...base, privateKey, dataHex });
    }
    if (mode === "fund") {
      const amountDoge = parseDogeAmount($("#fund-amount")?.value, "Amount to lock");
      if (!r.address) throw new Error("No contract address");
      if (!privateKey) throw new Error("Private key required");
      if (!changeAddress) throw new Error("Change address required");
      return buildFundContractTx({ ...base, privateKey, toAddress: r.address, amountDoge });
    }
    if (mode === "claim") {
      const toAddress = $("#claim-to")?.value.trim();
      const preimage = $("#claim-preimage")?.value;
      if (!toAddress) throw new Error("Enter receive address");
      if (!preimage?.trim()) throw new Error("Enter the secret preimage");
      return buildClaimTx({
        network: state.network,
        utxo: { ...utxo, address: utxo.address || r.address },
        redeemScriptHex: r.hex,
        privateKey: privateKey || void 0,
        preimage,
        toAddress,
        feeDoge,
        locktime: r.meta?.locktime || 0,
        changeAddress: changeAddress || void 0
      });
    }
    if (mode === "sweep_cltv") {
      const toAddress = $("#sweep-to")?.value.trim();
      const checkWif = $("#sign-wif-cltv")?.value.trim() || r.meta?.wif;
      if (!toAddress) throw new Error("Enter receive address");
      if (!checkWif) throw new Error("Check WIF required");
      if (!r.meta?.locktime) throw new Error("No locktime on this contract");
      return buildCltvSweepTx({
        network: state.network,
        utxo: { ...utxo, address: utxo.address || r.address },
        checkWif,
        privateKey: checkWif,
        redeemScriptHex: r.hex,
        toAddress,
        feeDoge,
        locktime: r.meta.locktime
      });
    }
    throw new Error("Unknown sign mode");
  }
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => toast("Copied!")).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      toast("Copied!");
    });
  }
  function toast(msg) {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2800);
  }
  function escapeHtml5(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  document.addEventListener("DOMContentLoaded", () => {
    window.__updateSignSecurityBanner = updateSignSecurityBanner;
    init();
  });
  return __toCommonJS(app_exports);
})();
/*! Bundled license information:

@noble/secp256k1/index.js:
  (*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) *)
*/
