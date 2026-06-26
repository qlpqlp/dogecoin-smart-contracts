import { asmToScript, bytesToHex, pushNumberOpcode } from './opcodes.js';
import {
  hash160Hex,
  sha256Hex,
  textToHex,
  locktimeOpcode,
  p2shAddressFromScript,
  randomSecret,
} from './crypto.js';
import { DEFI_TEMPLATES } from './defi-templates.js';
import { resolveChecksigAsm, resolveMultisigPubkey } from './signer-resolve.js';
import { cltvScript } from './defi-helpers.js';
import { networkRpcPort } from './networks.js';
import {
  PQC_SCHEME_OPTIONS,
  PQC_BIP_URL,
  SUCHQUANTUM_URL,
  getPqcScheme,
  computePqcCommitment,
  buildPqcOpReturnAsm,
  buildPqcOpReturnScriptHex,
  buildPqcDataHex,
  isValidHexBytes,
} from './pqc.js';
import { verifyPqcCarrierCommitment } from './pqc-carrier.js';
import { UNLOCK_TEMPLATES } from './unlock-templates.js';

/**
 * Contract template definitions for the wizard.
 * Each build() returns { title, description, asm, hex, redeemScript?, address?, steps, meta? }
 */
export const TEMPLATE_CATEGORIES = [
  { id: 'data', label: 'Data on Chain', icon: 'article' },
  { id: 'quantum', label: 'Post-Quantum', icon: 'security' },
  { id: 'defi', label: 'DeFi & Escrow', icon: 'account_balance' },
  { id: 'games', label: 'Games & Hunts', icon: 'sports_esports' },
  { id: 'unlocks', label: 'Reveal & Unlock', icon: 'vpn_key' },
  { id: 'locks', label: 'Locks & Vaults', icon: 'lock' },
  { id: 'social', label: 'Shared Wallets', icon: 'groups' },
  { id: 'explore', label: 'Opcode Playground', icon: 'science' },
];

export const TEMPLATES = [
  {
    id: 'text-message',
    category: 'data',
    icon: 'chat',
    title: 'Text Message (OP_RETURN)',
    tagline: 'Permanently store a message on the Dogecoin blockchain',
    fields: [
      { id: 'message', label: 'Message', type: 'textarea', placeholder: 'Hello Dogecoin!', required: true },
      { id: 'prefix', label: 'Protocol prefix (optional)', type: 'text', placeholder: 'DOGETXT', default: 'DOGETXT' },
    ],
    async build(params, network) {
      const prefix = params.prefix ? `${params.prefix}|` : '';
      const payload = textToHex(prefix + params.message);
      const asm = `OP_RETURN ${payload}`;
      const hex = bytesToHex(asmToScript(asm));
      return {
        title: 'OP_RETURN Text Message',
        description: 'Creates an unspendable output carrying your message. Anyone can read it from the blockchain forever.',
        asm,
        hex,
        type: 'op_return',
        dataHex: payload,
        steps: [
          'Fund a UTXO in your wallet (testnet faucet for experiments).',
          'Use the Sign TX tab to build a signed OP_RETURN transaction.',
          'Copy the raw hex and broadcast via any node or block explorer.',
          'Your message is permanently readable on-chain.',
        ],
        meta: { message: params.message, dataHex: payload },
      };
    },
  },
  {
    id: 'file-checksum',
    category: 'data',
    icon: 'fingerprint',
    title: 'File Checksum Anchor',
    tagline: 'Commit SHA-256 hash of a file to prove it existed',
    fields: [
      { id: 'file', label: 'Upload file', type: 'file', required: false },
      { id: 'hash', label: 'Or paste SHA-256 hex', type: 'text', placeholder: '64-char hex hash', required: false },
      { id: 'filename', label: 'File label (optional)', type: 'text', placeholder: 'whitepaper.pdf' },
    ],
    async build(params, network) {
      let hash = (params.hash || '').replace(/\s/g, '').toLowerCase();
      if (params._fileHash) hash = params._fileHash;
      if (!/^[0-9a-f]{64}$/.test(hash)) throw new Error('Provide a file or valid SHA-256 hex (64 chars)');
      const label = params.filename ? textToHex(params.filename.slice(0, 40)) : '';
      const payload = textToHex(`DOGEHASH|${hash}${params.filename ? '|' + params.filename : ''}`);
      const asm = `OP_RETURN ${payload}`;
      const hex = bytesToHex(asmToScript(asm));
      return {
        title: 'File Checksum Commitment',
        description: 'Anchors a document hash on-chain. Later, re-hash your file locally and compare: match proves authenticity of that exact file at commit time.',
        asm,
        hex,
        type: 'op_return',
        steps: [
          'Compute SHA-256 of your file (upload in wizard or paste hash).',
          'Sign TX → Broadcast OP_RETURN with the hash.',
          'To verify later: re-hash the file and compare to on-chain record.',
        ],
        meta: { sha256: hash, filename: params.filename || null },
      };
    },
  },
  {
    id: 'nft-mint',
    category: 'data',
    icon: 'image',
    title: 'NFT Mint (OP_RETURN checksum)',
    tagline: 'Anchor an image checksum on-chain, same method as the Dec 2021 Dogecoin NFT mint',
    fields: [
      { id: 'file', label: 'NFT image / file', type: 'file', required: false },
      { id: 'hash', label: 'Or paste SHA-256 hex', type: 'text', placeholder: '64-char checksum', required: false },
      { id: 'name', label: 'NFT name', type: 'text', placeholder: 'My Doge Art', required: false },
      { id: 'author', label: 'Creator', type: 'text', placeholder: 'Your name or @handle', required: false },
    ],
    async build(params, network) {
      let hash = (params.hash || '').replace(/\s/g, '').toLowerCase();
      if (params._fileHash) hash = params._fileHash;
      if (!/^[0-9a-f]{64}$/.test(hash)) {
        throw new Error('Upload an image/file or paste a valid SHA-256 hex (64 characters)');
      }
      const opReturnAscii = `[${hash}]`;
      const payload = textToHex(opReturnAscii);
      const asm = `OP_RETURN ${payload}`;
      const hex = bytesToHex(asmToScript(asm));

      const historicTxid = '19aeaa88859c04a333257f1119a77438ac08feec424c6ad3645a0679c8be9882';
      const tweetUrl = 'https://x.com/inevitable360/status/1470414541490110472';

      return {
        title: params.name ? `NFT Mint: ${params.name}` : 'NFT Mint (checksum on-chain)',
        description:
          'Commits a SHA-256 checksum of your digital asset in OP_RETURN using the bracket format '
          + 'from the first Dogecoin NFT experiment (13 Dec 2021). Anyone can re-hash your file and compare to the on-chain record. '
          + 'This is a proof-of-existence mint, not an ERC-721 style transferable token.',
        asm,
        hex,
        type: 'op_return',
        dataHex: payload,
        steps: [
          'Upload your image or paste the SHA-256 of the asset.',
          'Review the OP_RETURN line: format is `[checksum]` inside the output (66 bytes).',
          'Sign TX tab → broadcast the mint transaction (~0.01 DOGE + fee is typical).',
          'Share the txid; verifiers re-hash the file and match against `[sha256]` on-chain.',
          'Optional: keep the creator UTXO in the same tx as the historic mint (small DOGE output to your address).',
        ],
        meta: {
          nft: {
            sha256: hash,
            opReturnAscii,
            name: params.name || null,
            author: params.author || null,
            historicTxid,
            historicDate: '2021-12-13',
            tweetUrl,
            blockchairUrl: `https://blockchair.com/dogecoin/transaction/${historicTxid}`,
          },
        },
        rpc: buildOpReturnRpc(payload, network),
      };
    },
  },
  {
    id: 'document-commit',
    category: 'data',
    icon: 'description',
    title: 'Document Authenticity Seal',
    tagline: 'Timestamp a document hash with author note',
    fields: [
      { id: 'document', label: 'Document text or paste hash', type: 'textarea', required: true },
      { id: 'author', label: 'Author / org', type: 'text', placeholder: 'Shibe Labs' },
    ],
    async build(params, network) {
      const isHash = /^[0-9a-fA-F]{64}$/.test(params.document.trim());
      const hash = isHash ? params.document.trim().toLowerCase() : await sha256Hex(params.document);
      const note = params.author || 'anonymous';
      const payload = textToHex(`DOGEDOC|${hash}|${note}`);
      const asm = `OP_RETURN ${payload}`;
      const hex = bytesToHex(asmToScript(asm));
      return {
        title: 'Document Authenticity Seal',
        description: 'On-chain proof that a specific document (by hash) was committed at broadcast time.',
        asm,
        hex,
        type: 'op_return',
        steps: [
          'Share the document hash with verifiers.',
          'Anyone can hash the original file/text and compare to your on-chain record.',
          'Block timestamp acts as a decentralized timestamp.',
        ],
        rpc: buildOpReturnRpc(payload, network),
        meta: { sha256: hash, author: note },
      };
    },
  },
  {
    id: 'pqc-commitment',
    category: 'quantum',
    icon: 'security',
    title: 'Post-Quantum Commitment (OP_RETURN)',
    tagline: 'Publish a Phase 1 PQ signature commitment on-chain (FLC1, DIL2, RCG4)',
    fields: [
      {
        id: 'scheme',
        label: 'PQ algorithm',
        type: 'select',
        options: PQC_SCHEME_OPTIONS,
        default: 'falcon',
        required: true,
      },
      {
        id: 'pubkey',
        label: 'Public key bytes (hex)',
        type: 'textarea',
        placeholder: 'Paste Falcon / Dilithium / Raccoon public key hex from libdogecoin or your signer',
        required: true,
      },
      {
        id: 'signature',
        label: 'Signature bytes (hex)',
        type: 'textarea',
        placeholder: 'Paste PQ signature hex (message should be tx sighash32 for production binds)',
        required: true,
      },
    ],
    async build(params, network) {
      const schemeId = params.scheme || 'falcon';
      const scheme = getPqcScheme(schemeId);
      if (!isValidHexBytes(params.pubkey)) throw new Error('Enter valid public key hex (even length)');
      if (!isValidHexBytes(params.signature)) throw new Error('Enter valid signature hex (even length)');

      const { commitmentHex, pkLen, sigLen, pkPrefix, sigPrefix } = await computePqcCommitment(
        params.pubkey,
        params.signature,
      );
      const dataHex = buildPqcDataHex(schemeId, commitmentHex);
      const asm = buildPqcOpReturnAsm(schemeId, commitmentHex);
      const hex = buildPqcOpReturnScriptHex(schemeId, commitmentHex);

      return {
        title: `Post-Quantum Commitment (${scheme.tag})`,
        description:
          'Phase 1 OP_RETURN commitment: SHA256(public_key || signature) in canonical tagged form. '
          + 'Parallel evidence alongside secp256k1 spend authorization until Phase 2 opcode validation.',
        asm,
        hex,
        type: 'pqc_commitment',
        dataHex,
        scriptWireHex: hex,
        steps: [
          'Sign the base transaction with secp256k1 (existing wallet path), using tx sighash32 as the PQ message when binding to a spend.',
          `Generate PQ signature over message32 with libdogecoin (such -c ${schemeId === 'falcon' ? 'falcon' : schemeId === 'dilithium' ? 'dilithium2' : 'raccoong'}_sign -x <sighash>).`,
          'Confirm commitment32 = SHA256(pk || sig) matches the value below.',
          'Sign TX tab → broadcast OP_RETURN commitment (TX_C). Optionally add P2SH carrier outputs for full on-chain reveal (TX_R).',
          'Verify carrier proofs with the PQC Carrier Proof template or Such Quantum verifier.',
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
            verifierUrl: SUCHQUANTUM_URL,
          },
        },
        rpc: buildOpReturnRpc(dataHex, network),
      };
    },
  },
  {
    id: 'pqc-carrier-proof',
    category: 'quantum',
    icon: 'verified_user',
    title: 'PQC Carrier Proof Verification',
    tagline: 'Verify TX_C OP_RETURN commitment against TX_R P2SH carrier reveal',
    fields: [
      {
        id: 'txc',
        label: 'TX_C raw hex (commitment tx)',
        type: 'textarea',
        placeholder: '01000000… includes OP_RETURN + optional P2SH carrier outputs',
        required: true,
      },
      {
        id: 'txr',
        label: 'TX_R raw hex (reveal tx)',
        type: 'textarea',
        placeholder: '01000000… spends carrier outputs with FLC1FULL|DIL2FULL|RCG4FULL scriptSig',
        required: true,
      },
    ],
    async build(params) {
      const verification = await verifyPqcCarrierCommitment(params.txc, params.txr);
      return {
        title: 'PQC Carrier Proof: Valid',
        description:
          'Phase 1 carrier commitment validation passed: SHA256(pk || sig) from TX_R matches the canonical tagged OP_RETURN on TX_C.',
        type: 'pqc_verify',
        verification,
        steps: [
          'Commitment-only mode: OP_RETURN on TX_C is enough for SPV detection.',
          'Carrier mode: TX_C adds P2SH outputs; TX_R reveals pk||sig in carrier scriptSig.',
          'Full PQ signature verification over tx sighash32 requires libdogecoin, DogeGo SPV, or Such Quantum (Falcon in-browser).',
          `Draft spec: ${PQC_BIP_URL}`,
        ],
        meta: {
          pqc: verification,
          bipUrl: PQC_BIP_URL,
          verifierUrl: SUCHQUANTUM_URL,
        },
      };
    },
  },
  {
    id: 'treasure-hunt',
    category: 'games',
    icon: 'emoji_events',
    title: 'Treasure Hunt (Hash Lock)',
    tagline: 'Whoever reveals the correct preimage claims the DOGE',
    fields: [
      { id: 'secret', label: 'Secret answer / passphrase', type: 'text', placeholder: 'Leave empty to auto-generate', required: false },
      { id: 'pubkey', label: 'Winner Dogecoin address (optional)', type: 'doge-address', placeholder: 'D… or n…: leave empty for anyone with secret' },
      { id: 'reward', label: 'Reward label', type: 'text', default: '100 DOGE bounty', placeholder: '100 DOGE' },
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
        title: 'Treasure Hunt: Hash Lock',
        description: 'Send DOGE to the P2SH address. First person to spend it must provide the secret in the unlocking script. Share clues publicly; keep the secret for the winner!',
        asm,
        hex,
        redeemScript: asm,
        address,
        type: 'p2sh',
        steps: [
          `Sign TX → Fund the P2SH address with ${params.reward || 'DOGE'}.`,
          'Publish clues leading to the secret passphrase.',
          'Winner uses Sign TX → Claim with the preimage to spend.',
          'First valid broadcast on the network wins!',
        ],
        meta: {
          secret,
          secretHex,
          hash160: h160,
          reward: params.reward,
          warning: 'Store the secret securely until you want someone to win. Anyone with the secret can claim funds.',
        },
      };
    },
  },
  {
    id: 'public-bounty',
    category: 'games',
    icon: 'paid',
    title: 'Public Bounty Coin',
    tagline: 'Open bounty: first solver with the secret spends it',
    fields: [
      { id: 'challenge', label: 'Challenge description', type: 'textarea', required: true },
      { id: 'answer', label: 'Answer (preimage)', type: 'text', required: true },
    ],
    async build(params, network) {
      const secret = params.answer.trim();
      const h160 = await hash160Hex(secret);
      const asm = `OP_HASH160 ${h160} OP_EQUAL`;
      const hex = bytesToHex(asmToScript(asm));
      const address = await p2shAddressFromScript(hex, network);
      const cluePayload = textToHex(`DOGEBOUNTY|${params.challenge.slice(0, 200)}`);
      return {
        title: 'Public Bounty',
        description: 'Classic hash-lock bounty. Fund the address; publish the challenge via OP_RETURN clue tx separately.',
        asm,
        hex,
        address,
        type: 'p2sh',
        clueAsm: `OP_RETURN ${cluePayload}`,
        steps: [
          'Fund the P2SH bounty address.',
          'Optionally broadcast an OP_RETURN tx with the challenge text (second RPC).',
          'First person to solve and broadcast a spend wins.',
        ],
        rpc: {
          fund: buildP2shFundingRpc(address, network),
          clue: buildOpReturnRpc(cluePayload, network),
        },
        meta: { challenge: params.challenge, hash160: h160 },
      };
    },
  },
  {
    id: 'first-to-solve',
    category: 'games',
    icon: 'bolt',
    title: 'First to Solve Wins',
    tagline: 'Race: secret X + valid signature claims the reward',
    fields: [
      { id: 'secret', label: 'Secret X', type: 'text', required: true },
      { id: 'pubkey', label: 'Required signer Dogecoin address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'reward', label: 'Reward amount note', type: 'text', default: '500 DOGE' },
    ],
    async build(params, network) {
      const h160 = await hash160Hex(params.secret);
      const check = await resolveChecksigAsm(params.pubkey, network);
      const asm = `OP_HASH160 ${h160} OP_EQUALVERIFY ${check.asm}`;
      const hex = bytesToHex(asmToScript(asm));
      const address = await p2shAddressFromScript(hex, network);
      return {
        title: 'First-to-Solve Signature Race',
        description: 'Requires BOTH the secret preimage AND a valid signature from the specified pubkey. Useful for "prove you solved it AND control this key" contests.',
        asm,
        hex,
        address,
        type: 'p2sh',
        steps: [
          `Lock ${params.reward} at the P2SH address.`,
          'Publish puzzle; contestants race to find secret X.',
          'Spending scriptSig order: <sig> <pubkey> <secret_hex>',
          'Network confirms first valid tx: that winner takes all.',
        ],
        meta: { secret: params.secret, hash160: h160, signer: check },
        rpc: buildP2shFundingRpc(address, network),
      };
    },
  },
  {
    id: 'geocache',
    category: 'games',
    icon: 'explore',
    title: 'Dogecoin Geocache',
    tagline: 'Chain OP_RETURN clues to a final hash-lock prize',
    fields: [
      { id: 'clue1', label: 'Clue #1 (broadcast first)', type: 'textarea', required: true },
      { id: 'clue2', label: 'Clue #2', type: 'textarea', required: false },
      { id: 'finalSecret', label: 'Final location secret', type: 'text', required: true },
      { id: 'hint', label: 'Theme / geocache name', type: 'text', default: 'Doge Geocache' },
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
        title: 'Dogecoin Geocache Adventure',
        description: 'Real-world or digital ARG: scatter OP_RETURN clues on-chain; final clue leads to secret that unlocks the prize address.',
        asm: prizeAsm,
        hex: prizeHex,
        address: prizeAddress,
        type: 'geocache',
        clues: clueTxs,
        steps: [
          'Broadcast clue transactions in order (each OP_RETURN).',
          'Fund the prize P2SH address with DOGE.',
          'Players follow clues → discover final secret → claim prize.',
          'Perfect for IRL geocaching with blockchain proof of hunt!',
        ],
        meta: { theme: params.hint, clueCount: clues.length, finalHash160: h160 },
        rpc: { prize: buildP2shFundingRpc(prizeAddress, network), clues: clueTxs.map((c) => c.rpc) },
      };
    },
  },
  {
    id: 'ctf-flag',
    category: 'games',
    icon: 'flag',
    title: 'Capture the Flag',
    tagline: 'CTF-style flag hash unlocks the coin',
    fields: [
      { id: 'flag', label: 'Flag string (e.g. DOGE{...})', type: 'text', required: true },
      { id: 'teamPubkey', label: 'Authorized team address (optional)', type: 'doge-address', placeholder: 'D… or n…' },
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
        title: 'Capture the Flag Challenge',
        description: 'Hide the flag in your CTF infrastructure; on-chain reward for whoever submits it first.',
        asm,
        hex,
        address,
        type: 'p2sh',
        steps: [
          'Deploy CTF challenges in your infra.',
          'Fund the P2SH address as the flag prize.',
          'Announce the bounty OP_RETURN marker tx.',
          'First valid flag submission on-chain wins.',
        ],
        rpc: {
          marker: buildOpReturnRpc(payload, network),
          fund: buildP2shFundingRpc(address, network),
        },
        meta: { flagFormat: 'hash160(flag)', hash160: h160 },
      };
    },
  },
  {
    id: 'puzzle-artifact',
    category: 'games',
    icon: 'extension',
    title: 'Puzzle Artifact',
    tagline: 'Provably locked coin until puzzle is solved',
    fields: [
      { id: 'puzzleType', label: 'Lock type', type: 'select', options: ['quote', 'math', 'riddle'], default: 'riddle' },
      { id: 'puzzle', label: 'Puzzle prompt (shown publicly)', type: 'textarea', required: true },
      { id: 'answer', label: 'Answer (kept secret until solved)', type: 'text', required: true },
    ],
    async build(params, network) {
      const answer = params.answer.trim();
      let asm;
      let hashNote;
      if (params.puzzleType === 'quote') {
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
        description: 'A provably spendable artifact: the coins cannot move until someone provides the answer matching the on-chain hash.',
        asm,
        hex,
        address,
        type: 'p2sh',
        steps: [
          'Publish puzzle text via OP_RETURN (optional but fun).',
          'Lock DOGE in the artifact address.',
          'Artifact remains until preimage appears in a spending transaction.',
        ],
        rpc: {
          puzzle: buildOpReturnRpc(payload, network),
          fund: buildP2shFundingRpc(address, network),
        },
        meta: { puzzleType: params.puzzleType, hashNote, puzzle: params.puzzle },
      };
    },
  },
  {
    id: 'timelock',
    category: 'locks',
    icon: 'schedule',
    title: 'Time-Locked Coins',
    tagline: 'Coins unlock only after a chosen date',
    fields: [
      { id: 'unlockDate', label: 'Unlock date & time (UTC)', type: 'datetime-local', required: true },
      { id: 'pubkey', label: 'Your Dogecoin address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'emergencyPubkey', label: 'Emergency address (spend anytime)', type: 'doge-address', required: false, placeholder: 'D… or n…' },
    ],
    async build(params, network) {
      const locktime = Math.floor(new Date(params.unlockDate).getTime() / 1000);
      if (Number.isNaN(locktime)) throw new Error('Invalid date');
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
        title: 'Time-Locked Wallet',
        description: 'Uses OP_CHECKLOCKTIMEVERIFY (BIP65). Transaction nLockTime must be >= locktime when spending the IF branch.',
        asm,
        hex,
        address,
        type: 'p2sh',
        steps: [
          'Send DOGE to the P2SH address.',
          `After ${params.unlockDate} UTC, spend using IF branch with nLockTime set.`,
          'Set nLockTime on the spending transaction to the locktime value.',
          params.emergencyPubkey ? 'Emergency key can spend via ELSE branch anytime.' : '',
        ].filter(Boolean),
        meta: {
          locktime,
          locktimeHex: locktime.toString(16),
          unlockDate: params.unlockDate,
          note: 'For timestamps > 500000000, nLockTime is interpreted as UNIX time.',
        },
        rpc: buildP2shFundingRpc(address, network),
      };
    },
  },
  {
    id: 'time-capsule',
    category: 'locks',
    icon: 'inventory_2',
    title: 'Time Capsule',
    tagline: 'Message + coins locked until a future date',
    fields: [
      { id: 'message', label: 'Capsule message', type: 'textarea', required: true },
      { id: 'unlockDate', label: 'Open date (UTC)', type: 'datetime-local', required: true },
      { id: 'pubkey', label: 'Your Dogecoin address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
    ],
    async build(params, network) {
      const locktime = Math.floor(new Date(params.unlockDate).getTime() / 1000);
      const pkg = await cltvScript(locktime, params.pubkey, network);
      const asm = pkg.asm;
      const hex = bytesToHex(asmToScript(asm));
      const address = await p2shAddressFromScript(hex, network);
      const payload = textToHex(`DOGETIME|${params.message.slice(0, 200)}|opens:${params.unlockDate}`);
      return {
        title: 'Time Capsule',
        description: 'Combine an on-chain message (OP_RETURN) with a CLTV-locked UTXO. Future you (or heirs) opens both on the unlock date.',
        asm,
        hex,
        address,
        capsuleAsm: `OP_RETURN ${payload}`,
        type: 'timelock',
        steps: [
          'Broadcast OP_RETURN with your capsule message.',
          'Fund the time-locked P2SH address.',
          'On unlock date, spend with appropriate nLockTime.',
        ],
        rpc: {
          message: buildOpReturnRpc(payload, network),
          fund: buildP2shFundingRpc(address, network),
        },
        meta: { message: params.message, locktime, unlockDate: params.unlockDate },
      };
    },
  },
  {
    id: 'multisig',
    category: 'social',
    icon: 'family_restroom',
    title: 'Multi-Sig Vault',
    tagline: 'Family vault or shared project funds (M-of-N)',
    fields: [
      { id: 'required', label: 'Signatures required (M)', type: 'number', default: 2, min: 1, max: 15 },
      { id: 'pubkey1', label: 'Signer 1 pubkey (hex)', type: 'text', required: true, placeholder: '02… from validateaddress' },
      { id: 'pubkey2', label: 'Signer 2 pubkey (hex)', type: 'text', required: true, placeholder: '02…' },
      { id: 'pubkey3', label: 'Signer 3 pubkey (hex, optional)', type: 'text', placeholder: '02…' },
      { id: 'pubkey4', label: 'Signer 4 pubkey (hex, optional)', type: 'text', placeholder: '02…' },
      { id: 'vaultName', label: 'Vault name', type: 'text', default: 'Family Vault' },
    ],
    async build(params, network) {
      const m = parseInt(params.required, 10) || 2;
      const keys = [params.pubkey1, params.pubkey2, params.pubkey3, params.pubkey4]
        .filter((k) => k?.trim());
      const resolvedKeys = keys.map(resolveMultisigPubkey);
      if (resolvedKeys.length < m) throw new Error('Need at least M public keys');
      if (m > resolvedKeys.length) throw new Error('M cannot exceed number of keys');
      const mOp = pushNumberOpcode(m);
      const nOp = pushNumberOpcode(resolvedKeys.length);
      const asm = `${mOp} ${resolvedKeys.join(' ')} ${nOp} OP_CHECKMULTISIG`;
      const hex = bytesToHex(asmToScript(asm));
      const address = await p2shAddressFromScript(hex, network);
      return {
        title: `${m}-of-${resolvedKeys.length} Multi-Sig: ${params.vaultName}`,
        description: 'Classic multisig redeem script. Spending requires M valid signatures from the N keys.',
        asm,
        hex,
        address,
        type: 'multisig',
        steps: [
          'Each participant generates a keypair and shares their pubkey (hex).',
          'Fund the P2SH multisig address.',
          'To spend: collect M signatures, build scriptSig: OP_0 <sig1> <sig2> ... <redeemScript>.',
          'Or use createmultisig / addmultisigaddress in Dogecoin Core wallet.',
        ],
        rpc: {
          createmultisig: {
            method: 'createmultisig',
            params: [m, resolvedKeys],
            note: 'Dogecoin Core can create the same address from pubkeys.',
          },
          fund: buildP2shFundingRpc(address, network),
        },
        meta: { m, n: resolvedKeys.length, pubkeys: resolvedKeys, vaultName: params.vaultName },
      };
    },
  },
  {
    id: 'opcode-playground',
    category: 'explore',
    icon: 'build',
    title: 'Opcode Playground',
    tagline: 'Build custom scripts with OP_DUP, OP_IF, hashes & more',
    fields: [
      { id: 'customAsm', label: 'Script ASM', type: 'asm-badges', default: 'OP_DUP OP_HASH160 abcd OP_EQUALVERIFY OP_CHECKSIG', required: true },
    ],
    async build(params, network) {
      const asm = params.customAsm.trim();
      const hex = bytesToHex(asmToScript(asm));
      let address = null;
      try {
        address = await p2shAddressFromScript(hex, network);
      } catch {
        /* non-P2SH scripts */
      }
      return {
        title: 'Custom Opcode Script',
        description: 'Experiment with Dogecoin script opcodes. Learn how the stack machine verifies spending conditions.',
        asm,
        hex,
        address,
        type: 'custom',
        steps: [
          'Edit ASM using opcode names and hex push data.',
          'Use decodescript on Dogecoin Core to verify.',
          'If valid P2SH, fund the generated address.',
          'Test on testnet/regtest before mainnet!',
        ],
        rpc: address ? buildP2shFundingRpc(address, network) : { decodescript: { method: 'decodescript', params: [hex] } },
        meta: { editable: true },
      };
    },
  },
  ...DEFI_TEMPLATES,
  ...UNLOCK_TEMPLATES,
];

function locktimeToPush(locktime) {
  if (locktime >= 1 && locktime <= 16) return pushNumberOpcode(locktime);
  const hex = locktime.toString(16);
  const padded = hex.length % 2 ? '0' + hex : hex;
  const bytes = padded.match(/../g).reverse().join('');
  return bytes;
}

function buildOpReturnRpc(dataHex, network) {
  const port = networkRpcPort(network);
  return {
    network,
    port,
    steps: ['createrawtransaction', 'signrawtransaction', 'sendrawtransaction'],
    createrawtransaction: {
      method: 'createrawtransaction',
      params: [
        [{ txid: 'YOUR_INPUT_TXID', vout: 0 }],
        { data: dataHex },
      ],
      curl: `curl -u user:pass -d '{"method":"createrawtransaction","params":[[{"txid":"INPUT_TXID","vout":0}],{"data":"${dataHex}"}]}' http://127.0.0.1:${port}/`,
    },
    decodescript: {
      method: 'decodescript',
      params: [bytesToHex(asmToScript(`OP_RETURN ${dataHex}`))],
    },
  };
}

function buildP2shFundingRpc(address, network) {
  const port = networkRpcPort(network);
  return {
    network,
    note: `Send DOGE to ${address}`,
    sendtoaddress: {
      method: 'sendtoaddress',
      params: [address, 'AMOUNT_DOGE'],
      curl: `curl -u user:pass -d '{"method":"sendtoaddress","params":["${address}",10.0]}' http://127.0.0.1:${port}/`,
    },
  };
}

export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(categoryId) {
  return TEMPLATES.filter((t) => t.category === categoryId);
}
