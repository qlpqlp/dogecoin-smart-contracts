import { asmToScript, bytesToHex, pushNumberOpcode } from './opcodes.js';
import { hash160Hex, sha256Hex, textToHex, p2shAddressFromScript, locktimeFromDate } from './crypto.js';
import { resolveChecksigAsm } from './signer-resolve.js';

/** Push locktime as minimal-endian hex for ASM */
export function locktimePush(locktime) {
  if (locktime >= 1 && locktime <= 16) return pushNumberOpcode(locktime);
  const hex = locktime.toString(16);
  const padded = hex.length % 2 ? '0' + hex : hex;
  return padded.match(/../g).reverse().join('');
}

export async function scriptPackage(asm, network, base = {}) {
  const hex = bytesToHex(asmToScript(asm));
  const address = await p2shAddressFromScript(hex, network);
  return {
    asm,
    hex,
    address,
    redeemScript: asm,
    type: 'p2sh',
    ...base,
  };
}

export async function cltvScript(locktime, signerInput, network, label = 'CLTV lock') {
  const check = await resolveChecksigAsm(signerInput, network);
  const asm = `${locktimePush(locktime)} OP_CHECKLOCKTIMEVERIFY OP_DROP ${check.asm}`;
  return scriptPackage(asm, network, { locktime, label, signer: check });
}

export async function htlcScript({ hash160, locktime, receiverPk, senderPk, network }) {
  const receiver = await resolveChecksigAsm(receiverPk, network);
  const sender = await resolveChecksigAsm(senderPk, network);
  const asm = [
    'OP_IF',
    `OP_HASH160 ${hash160} OP_EQUALVERIFY ${receiver.asm}`,
    'OP_ELSE',
    `${locktimePush(locktime)} OP_CHECKLOCKTIMEVERIFY OP_DROP ${sender.asm}`,
    'OP_ENDIF',
  ].join(' ');
  return scriptPackage(asm, network, { hash160, locktime, type: 'htlc', receiver, sender });
}

export async function multisigAsm(m, pubkeys) {
  const mOp = pushNumberOpcode(m);
  const nOp = pushNumberOpcode(pubkeys.length);
  return `${mOp} ${pubkeys.join(' ')} ${nOp} OP_CHECKMULTISIG`;
}

export async function invoiceRefundScript({ payeePk, payerRefundPk, locktime, network }) {
  const payee = await resolveChecksigAsm(payeePk, network);
  const payer = await resolveChecksigAsm(payerRefundPk, network);
  const asm = [
    'OP_IF',
    payee.asm,
    'OP_ELSE',
    `${locktimePush(locktime)} OP_CHECKLOCKTIMEVERIFY OP_DROP ${payer.asm}`,
    'OP_ENDIF',
  ].join(' ');
  return scriptPackage(asm, network, { locktime, type: 'invoice', payee, payer });
}

export async function savingsChallengeScript({ locktime, saverPk, penaltyPk, network }) {
  const saver = await resolveChecksigAsm(saverPk, network);
  const penalty = await resolveChecksigAsm(penaltyPk, network);
  const asm = [
    'OP_IF',
    `${locktimePush(locktime)} OP_CHECKLOCKTIMEVERIFY OP_DROP ${saver.asm}`,
    'OP_ELSE',
    penalty.asm,
    'OP_ENDIF',
  ].join(' ');
  return scriptPackage(asm, network, { locktime, type: 'savings', saver, penalty });
}

export async function hashLockScript(secret, network, signerInput = null) {
  const h160 = await hash160Hex(secret);
  let asm;
  let signer = null;
  if (signerInput?.trim()) {
    signer = await resolveChecksigAsm(signerInput, network);
    asm = `OP_HASH160 ${h160} OP_EQUALVERIFY ${signer.asm}`;
  } else {
    asm = `OP_HASH160 ${h160} OP_EQUAL`;
  }
  return scriptPackage(asm, network, { hash160: h160, secret, type: 'hashlock', signer });
}

export function standardSteps(kind) {
  const s = {
    fund: [
      'Sign TX → Fund the P2SH address with the required DOGE.',
      'Copy signed hex and broadcast anywhere.',
    ],
    claim: [
      'After conditions are met, Sign TX → Claim with preimage / key.',
      'First valid broadcast wins for competitive locks.',
    ],
    check: [
      'Sign TX → Fund the check P2SH address (funds arrive immediately).',
      'Share QR payload with recipient: WIF|address|locktime.',
      'After the check date, recipient sweeps with the check WIF.',
      'Expiration date is metadata only. Cancel manually after locktime if needed.',
    ],
    htlc: [
      'Party A funds HTLC address on Dogecoin.',
      'Party B funds matching HTLC on other chain (same hash).',
      'Reveal preimage to claim; or wait for timeout refund path.',
    ],
    escrow: [
      'Buyer funds the 2-of-3 escrow address.',
      'Release: buyer + seller sign, or arbitrator breaks tie.',
    ],
  };
  return s[kind] || s.fund;
}

export async function milestoneScripts(dates, signerInput, network) {
  const contracts = [];
  for (let i = 0; i < dates.length; i++) {
    const lt = locktimeFromDate(dates[i].date);
    const pkg = await cltvScript(lt, signerInput, network, `Milestone ${i + 1}`);
    contracts.push({
      ...pkg,
      label: dates[i].label || `Milestone ${i + 1}`,
      amountNote: dates[i].amount,
      unlockDate: dates[i].date,
    });
  }
  return contracts;
}

export async function vestingScripts({ cliffDate, tranches, signerInput, network }) {
  const contracts = [];
  if (cliffDate) {
    const lt = locktimeFromDate(cliffDate);
    contracts.push({
      ...(await cltvScript(lt, signerInput, network, 'Cliff')),
      label: 'Vesting cliff',
      unlockDate: cliffDate,
    });
  }
  for (let i = 0; i < tranches.length; i++) {
    const lt = locktimeFromDate(tranches[i].date);
    contracts.push({
      ...(await cltvScript(lt, signerInput, network, `Tranche ${i + 1}`)),
      label: tranches[i].label || `Tranche ${i + 1}`,
      amountNote: tranches[i].amount,
      unlockDate: tranches[i].date,
    });
  }
  return contracts;
}
