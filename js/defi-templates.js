import { bytesToHex, asmToScript } from './opcodes.js';
import { hash160Hex, sha256Hex, textToHex, locktimeFromDate } from './crypto.js';
import {
  cltvScript,
  htlcScript,
  multisigAsm,
  invoiceRefundScript,
  savingsChallengeScript,
  hashLockScript,
  standardSteps,
  milestoneScripts,
  vestingScripts,
  locktimePush,
  scriptPackage,
} from './defi-helpers.js';
import {
  generateKeypair,
  encodeWIF,
  privateKeyToPubkey,
} from './tx.js';
import { resolveChecksigAsm, resolveMultisigPubkey } from './signer-resolve.js';

function expirationDefault(lockDate) {
  const d = new Date(lockDate);
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 16);
}

export const DEFI_TEMPLATES = [
  {
    id: 'bank-check',
    category: 'defi',
    icon: 'payments',
    title: 'Bank Check (Post-Dated)',
    tagline: 'Like a paper check: DOGE locked until a future date (dogecoin-wallet style)',
    fields: [
      { id: 'payTo', label: 'Pay to the order of', type: 'text', required: true, placeholder: 'Recipient name' },
      { id: 'amount', label: 'Amount (DOGE)', type: 'doge', required: true, placeholder: '100.00' },
      { id: 'lockDate', label: 'Check date: funds unlock on (UTC)', type: 'datetime-local', required: true },
      { id: 'expirationDate', label: 'Expiration (metadata, UTC)', type: 'datetime-local', required: false },
      { id: 'memo', label: 'Memo', type: 'text', placeholder: 'July rent' },
      { id: 'signature', label: 'Signer name', type: 'text', default: 'Anonymous' },
    ],
    async build(params, network) {
      const locktime = locktimeFromDate(params.lockDate);
      const { privateKey, compressed } = generateKeypair();
      const pubkey = bytesToHex(await privateKeyToPubkey(privateKey, compressed));
      const wif = await encodeWIF(privateKey, network, compressed);
      const pkg = await cltvScript(locktime, pubkey, network);
      const qrPayload = `${wif}|${pkg.address}|${locktime}`;
      const exp = params.expirationDate || expirationDefault(params.lockDate);
      const attest = textToHex(`DOGECHECK|${params.payTo}|${params.amount}|${params.memo || ''}|${params.signature || ''}`);
      return {
        title: `Bank Check: ${params.payTo}`,
        description: 'P2SH CLTV post-dated payment. Fund immediately; recipient sweeps after check date with WIF from QR payload. Matches dogecoin-wallet "Write a Check".',
        ...pkg,
        type: 'bank_check',
        steps: standardSteps('check'),
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
          warning: 'WIF is a bearer instrument: anyone with QR can sweep after locktime. Expiration is not enforced on-chain.',
        },
      };
    },
  },
  {
    id: 'atomic-swap-htlc',
    category: 'defi',
    icon: 'swap_horiz',
    title: 'Atomic Swap (HTLC)',
    tagline: 'Trustless cross-chain swap: hash lock + timelock refund',
    fields: [
      { id: 'secret', label: 'Swap secret (preimage)', type: 'text', placeholder: 'auto-generated if empty' },
      { id: 'receiverPk', label: 'Receiver Dogecoin address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'senderPk', label: 'Sender refund address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'refundDate', label: 'Refund after (UTC)', type: 'datetime-local', required: true },
    ],
    async build(params, network) {
      const secret = params.secret?.trim() || crypto.randomUUID().replace(/-/g, '');
      const h160 = await hash160Hex(secret);
      const locktime = locktimeFromDate(params.refundDate);
      const pkg = await htlcScript({
        hash160: h160,
        locktime,
        receiverPk: params.receiverPk,
        senderPk: params.senderPk,
        network,
      });
      return {
        title: 'Atomic Swap HTLC',
        description: 'OP_IF: receiver claims with preimage. OP_ELSE: sender refunds after CLTV timeout. Use same hash on both chains.',
        ...pkg,
        steps: standardSteps('htlc'),
        meta: { secret, hash160: h160, locktime, refundDate: params.refundDate },
      };
    },
  },
  {
    id: 'p2p-escrow',
    category: 'defi',
    icon: 'handshake',
    title: 'P2P Escrow (2-of-3)',
    tagline: 'Buyer, seller & arbitrator: release funds with any 2 signatures',
    fields: [
      { id: 'buyerPk', label: 'Buyer pubkey (hex)', type: 'text', required: true, placeholder: '02… from validateaddress' },
      { id: 'sellerPk', label: 'Seller pubkey (hex)', type: 'text', required: true, placeholder: '02… from validateaddress' },
      { id: 'arbitratorPk', label: 'Arbitrator pubkey (hex)', type: 'text', required: true, placeholder: '02… from validateaddress' },
      { id: 'dealNote', label: 'Deal description', type: 'text', placeholder: 'Used GPU purchase' },
    ],
    async build(params, network) {
      const keys = [params.buyerPk, params.sellerPk, params.arbitratorPk].map(resolveMultisigPubkey);
      const asm = await multisigAsm(2, keys);
      const pkg = await scriptPackage(asm, network, {
        title: 'P2P Escrow: 2-of-3',
        description: 'Buyer funds escrow. Happy path: buyer + seller sign. Dispute: arbitrator + either party.',
      });
      return {
        ...pkg,
        steps: standardSteps('escrow'),
        meta: { roles: { buyer: keys[0], seller: keys[1], arbitrator: keys[2] }, dealNote: params.dealNote },
      };
    },
  },
  {
    id: 'milestone-escrow',
    category: 'defi',
    icon: 'timeline',
    title: 'Milestone Payments',
    tagline: 'Contractor paid in timed tranches: each milestone is a CLTV lock',
    fields: [
      { id: 'contractorPk', label: 'Contractor Dogecoin address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'm1date', label: 'Milestone 1 date', type: 'datetime-local', required: true },
      { id: 'm1amount', label: 'Milestone 1 amount (DOGE)', type: 'doge', required: true },
      { id: 'm2date', label: 'Milestone 2 date', type: 'datetime-local', required: false },
      { id: 'm2amount', label: 'Milestone 2 amount (DOGE)', type: 'doge' },
      { id: 'm3date', label: 'Milestone 3 date', type: 'datetime-local', required: false },
      { id: 'm3amount', label: 'Milestone 3 amount (DOGE)', type: 'doge' },
    ],
    async build(params, network) {
      const dates = [
        { date: params.m1date, amount: params.m1amount, label: 'Milestone 1' },
        params.m2date ? { date: params.m2date, amount: params.m2amount, label: 'Milestone 2' } : null,
        params.m3date ? { date: params.m3date, amount: params.m3amount, label: 'Milestone 3' } : null,
      ].filter(Boolean);
      const contracts = await milestoneScripts(dates, params.contractorPk, network);
      const primary = contracts[0];
      return {
        title: 'Milestone Payment Schedule',
        description: `${contracts.length} separate CLTV locks. Fund each P2SH address with its milestone amount.`,
        asm: primary.asm,
        hex: primary.hex,
        address: primary.address,
        type: 'milestone',
        contracts,
        steps: [
          'Fund each milestone address with its DOGE amount.',
          'Contractor sweeps each lock after its unlock date.',
          'Sign TX → Sweep check pattern for each CLTV UTXO.',
        ],
        meta: { contractorAddress: params.contractorPk, milestoneCount: contracts.length },
      };
    },
  },
  {
    id: 'vesting-schedule',
    category: 'defi',
    icon: 'trending_up',
    title: 'Token Vesting Schedule',
    tagline: 'Team/advisor cliff + linear unlock tranches',
    fields: [
      { id: 'beneficiaryPk', label: 'Beneficiary Dogecoin address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'cliffDate', label: 'Cliff date', type: 'datetime-local', required: true },
      { id: 't1date', label: 'Tranche 1 unlock', type: 'datetime-local', required: true },
      { id: 't1amount', label: 'Tranche 1 (DOGE)', type: 'doge', required: true },
      { id: 't2date', label: 'Tranche 2 unlock', type: 'datetime-local' },
      { id: 't2amount', label: 'Tranche 2 (DOGE)', type: 'doge' },
    ],
    async build(params, network) {
      const tranches = [
        { date: params.t1date, amount: params.t1amount, label: 'Tranche 1' },
        params.t2date ? { date: params.t2date, amount: params.t2amount, label: 'Tranche 2' } : null,
      ].filter(Boolean);
      const contracts = await vestingScripts({
        cliffDate: params.cliffDate,
        tranches,
        signerInput: params.beneficiaryPk,
        network,
      });
      const cliff = contracts[0];
      return {
        title: 'Vesting Schedule',
        description: 'Cliff + tranche CLTV locks. Common team vesting pattern on Dogecoin.',
        asm: cliff.asm,
        hex: cliff.hex,
        address: cliff.address,
        type: 'vesting',
        contracts,
        steps: [
          'Fund each vesting address at token allocation time.',
          'Beneficiary sweeps after each unlock date.',
        ],
        meta: { beneficiaryAddress: params.beneficiaryPk, cliffDate: params.cliffDate },
      };
    },
  },
  {
    id: 'invoice-refund',
    category: 'defi',
    icon: 'receipt_long',
    title: 'Invoice with Refund',
    tagline: 'Payee claims anytime; payer gets refund after deadline',
    fields: [
      { id: 'payeePk', label: 'Payee (seller) address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'payerPk', label: 'Payer (buyer) address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'refundDate', label: 'Refund available after', type: 'datetime-local', required: true },
      { id: 'invoiceId', label: 'Invoice ID', type: 'text', default: 'INV-001' },
    ],
    async build(params, network) {
      const locktime = locktimeFromDate(params.refundDate);
      const pkg = await invoiceRefundScript({
        payeePk: params.payeePk,
        payerRefundPk: params.payerPk,
        locktime,
        network,
      });
      const dataHex = textToHex(`DOGEINV|${params.invoiceId}|refund_after:${params.refundDate}`);
      return {
        title: `Invoice ${params.invoiceId}`,
        description: 'IF branch: payee signs immediately. ELSE: payer refunds after CLTV deadline.',
        ...pkg,
        dataHex,
        steps: [
          'Payer funds the invoice P2SH address.',
          'Payee claims with IF branch signature before deadline.',
          'Or payer reclaims via ELSE branch after refund date.',
        ],
        meta: { invoiceId: params.invoiceId, locktime, refundDate: params.refundDate },
      };
    },
  },
  {
    id: 'inheritance-switch',
    category: 'defi',
    icon: 'account_tree',
    title: 'Inheritance Timelock',
    tagline: 'You can spend now; heir inherits if you do not',
    fields: [
      { id: 'ownerPk', label: 'Your Dogecoin address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'heirPk', label: 'Heir Dogecoin address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'inheritDate', label: 'Heir can claim after', type: 'datetime-local', required: true },
    ],
    async build(params, network) {
      const locktime = locktimeFromDate(params.inheritDate);
      const heir = await resolveChecksigAsm(params.heirPk, network);
      const owner = await resolveChecksigAsm(params.ownerPk, network);
      const asm = [
        'OP_IF',
        `${locktimePush(locktime)} OP_CHECKLOCKTIMEVERIFY OP_DROP ${heir.asm}`,
        'OP_ELSE',
        owner.asm,
        'OP_ENDIF',
      ].join(' ');
      const pkg = await scriptPackage(asm, network);
      return {
        title: 'Inheritance Switch',
        description: 'Owner spends via ELSE anytime. Heir claims via IF only after inheritance date.',
        ...pkg,
        steps: [
          'Lock DOGE in the P2SH address.',
          'Owner can move funds before inheritance date.',
          'After date, heir sweeps with CLTV + signature.',
        ],
        meta: { locktime, inheritDate: params.inheritDate },
      };
    },
  },
  {
    id: 'savings-challenge',
    category: 'defi',
    icon: 'savings',
    title: 'Savings Challenge',
    tagline: 'Locked until goal date: break early and penalty address wins',
    fields: [
      { id: 'saverPk', label: 'Your Dogecoin address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'penaltyPk', label: 'Penalty recipient address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'goalDate', label: 'Goal date: unlock savings', type: 'datetime-local', required: true },
      { id: 'goalLabel', label: 'Challenge name', type: 'text', default: 'Savings Challenge' },
    ],
    async build(params, network) {
      const locktime = locktimeFromDate(params.goalDate);
      const pkg = await savingsChallengeScript({
        locktime,
        saverPk: params.saverPk,
        penaltyPk: params.penaltyPk,
        network,
      });
      return {
        title: `Savings Challenge: ${params.goalLabel}`,
        description: 'IF: withdraw after goal date. ELSE: penalty pubkey takes funds if you break early.',
        ...pkg,
        steps: [
          'Lock your savings DOGE in the P2SH address.',
          'Wait until goal date, then sweep via IF branch.',
          'Breaking early sends funds to penalty address via ELSE.',
        ],
        meta: { goalDate: params.goalDate, locktime, goalLabel: params.goalLabel },
      };
    },
  },
  {
    id: 'proof-of-reserve',
    category: 'defi',
    icon: 'verified',
    title: 'Proof of Reserve',
    tagline: 'Publish treasury address + balance commitment on-chain',
    fields: [
      { id: 'treasuryAddress', label: 'Treasury / reserve address', type: 'text', required: true },
      { id: 'balanceDoge', label: 'Committed balance (DOGE)', type: 'doge', required: true },
      { id: 'orgName', label: 'Organization', type: 'text', required: true },
      { id: 'pubkey1', label: 'Signer pubkey 1 (hex)', type: 'text', required: true, placeholder: '02… from validateaddress' },
      { id: 'pubkey2', label: 'Signer pubkey 2 (hex)', type: 'text', placeholder: '02…' },
      { id: 'pubkey3', label: 'Signer pubkey 3 (hex)', type: 'text', placeholder: '02…' },
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
        description: 'OP_RETURN attestation linked to multisig treasury. Verifiers compare on-chain claim to actual address balance.',
        asm: pkg.asm,
        hex: pkg.hex,
        address: pkg.address,
        type: 'op_return',
        dataHex,
        steps: [
          'Broadcast OP_RETURN attestation (Sign TX tab).',
          'Treasury should match the committed address.',
          'Multisig script proves who controls reserves.',
        ],
        meta: {
          treasuryAddress: params.treasuryAddress,
          balanceDoge: params.balanceDoge,
          orgName: params.orgName,
          commitmentSha256: commit,
        },
      };
    },
  },
  {
    id: 'raffle-commit',
    category: 'defi',
    icon: 'confirmation_number',
    title: 'Raffle (Commit–Reveal)',
    tagline: 'Commit winning number hash, then reveal + claim prize',
    fields: [
      { id: 'winningNumber', label: 'Winning number (secret)', type: 'text', required: true },
      { id: 'raffleName', label: 'Raffle name', type: 'text', default: 'Doge Raffle' },
      { id: 'prizeNote', label: 'Prize description', type: 'text', default: '1000 DOGE' },
    ],
    async build(params, network) {
      const commitHash = await sha256Hex(params.winningNumber);
      const pkg = await hashLockScript(params.winningNumber, network);
      const commitHex = textToHex(`DOGERAFFLE|commit|${params.raffleName}|${commitHash}`);
      return {
        title: `Raffle: ${params.raffleName}`,
        description: 'Phase 1: broadcast commit OP_RETURN. Phase 2: fund prize hash-lock. Winner reveals number to claim.',
        ...pkg,
        commitAsm: `OP_RETURN ${commitHex}`,
        dataHex: commitHex,
        steps: [
          'Broadcast commit OP_RETURN (hash of winning number).',
          'Fund prize P2SH address.',
          'Winner reveals number via Claim to prove they knew it.',
        ],
        meta: {
          raffleName: params.raffleName,
          commitHash,
          prizeNote: params.prizeNote,
          winningNumber: params.winningNumber,
        },
      };
    },
  },
  {
    id: 'content-unlock',
    category: 'defi',
    icon: 'lock_open',
    title: 'Paid Content Unlock',
    tagline: 'Hash lock: buyer gets preimage after paying',
    fields: [
      { id: 'contentId', label: 'Content ID / URL slug', type: 'text', required: true },
      { id: 'unlockSecret', label: 'Unlock secret (give to buyer after payment)', type: 'text', placeholder: 'auto-generated' },
      { id: 'sellerPk', label: 'Seller address (optional)', type: 'doge-address', placeholder: 'D… or n…' },
      { id: 'priceNote', label: 'Price label', type: 'text', default: '50 DOGE' },
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
        description: 'Seller funds lock; buyer pays off-chain; seller shares secret; buyer claims or uses preimage.',
        ...pkg,
        dataHex,
        steps: [
          'List content with P2SH payment address.',
          'After payment, seller gives buyer the unlock secret.',
          'Buyer claims UTXO or uses secret to prove purchase.',
        ],
        meta: { contentId: params.contentId, secret, priceNote: params.priceNote },
      };
    },
  },
  {
    id: 'channel-open',
    category: 'defi',
    icon: 'hub',
    title: 'Payment Channel Open',
    tagline: '2-of-2 multisig + documented refund timelock path',
    fields: [
      { id: 'party1Pk', label: 'Party 1 pubkey (hex)', type: 'text', required: true, placeholder: '02…' },
      { id: 'party2Pk', label: 'Party 2 pubkey (hex)', type: 'text', required: true, placeholder: '02…' },
      { id: 'refundDate', label: 'Refund path unlock date', type: 'datetime-local', required: true },
      { id: 'refundPk', label: 'Refund to address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
    ],
    async build(params, network) {
      const locktime = locktimeFromDate(params.refundDate);
      const p1 = resolveMultisigPubkey(params.party1Pk);
      const p2 = resolveMultisigPubkey(params.party2Pk);
      const multisig = await multisigAsm(2, [p1, p2]);
      const pkg = await scriptPackage(multisig, network, {
        title: 'Payment Channel: 2-of-2',
        description: 'Cooperative close: both sign. Uncooperative: use separate CLTV refund tx after timeout (educational pattern).',
      });
      const refundCheck = await resolveChecksigAsm(params.refundPk, network);
      const refundAsm = `${locktimePush(locktime)} OP_CHECKLOCKTIMEVERIFY OP_DROP ${refundCheck.asm}`;
      const refundPkg = await scriptPackage(refundAsm, network);
      return {
        ...pkg,
        type: 'channel',
        refundContract: refundPkg,
        steps: [
          'Both parties fund the 2-of-2 P2SH address.',
          'Cooperative: spend with both signatures.',
          'Uncooperative fallback: separate CLTV refund script (fund & sweep after date).',
        ],
        meta: { locktime, refundDate: params.refundDate, refundAsm: refundPkg.asm },
      };
    },
  },
  {
    id: 'otc-swap-pair',
    category: 'defi',
    icon: 'currency_exchange',
    title: 'OTC Swap Pair (HTLC)',
    tagline: 'Generate matching HTLC scripts for two-party OTC swap',
    fields: [
      { id: 'secret', label: 'Shared swap secret', type: 'text', placeholder: 'auto' },
      { id: 'alicePk', label: 'Alice Dogecoin address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'bobPk', label: 'Bob Dogecoin address', type: 'doge-address', required: true, placeholder: 'D… or n…' },
      { id: 'refundDate', label: 'Refund deadline', type: 'datetime-local', required: true },
    ],
    async build(params, network) {
      const secret = params.secret?.trim() || crypto.randomUUID().replace(/-/g, '');
      const h160 = await hash160Hex(secret);
      const locktime = locktimeFromDate(params.refundDate);
      const aliceHtlc = await htlcScript({ hash160: h160, locktime, receiverPk: params.bobPk, senderPk: params.alicePk, network });
      const bobHtlc = await htlcScript({ hash160: h160, locktime, receiverPk: params.alicePk, senderPk: params.bobPk, network });
      return {
        title: 'OTC Swap HTLC Pair',
        description: 'Alice funds aliceHtlc; Bob funds bobHtlc. Same hash: first reveal completes atomic swap.',
        asm: aliceHtlc.asm,
        hex: aliceHtlc.hex,
        address: aliceHtlc.address,
        type: 'otc',
        contracts: [
          { role: 'Alice funds', ...aliceHtlc },
          { role: 'Bob funds', ...bobHtlc },
        ],
        steps: standardSteps('htlc'),
        meta: { secret, hash160: h160, locktime, aliceAddress: aliceHtlc.address, bobAddress: bobHtlc.address },
      };
    },
  },
];
