const MODE_LABELS = {
  op_return: 'Broadcast OP_RETURN message',
  fund: 'Fund contract (send DOGE to P2SH)',
  claim: 'Claim with secret (hash lock)',
  sweep_cltv: 'Sweep after unlock date (CLTV)',
  clue: 'Broadcast geocache clue',
};

/** Sign TX modes per template (only what applies). */
const TEMPLATE_SIGN_MODES = {
  'text-message': ['op_return'],
  'file-checksum': ['op_return'],
  'nft-mint': ['op_return'],
  'document-commit': ['op_return'],
  'pqc-commitment': ['op_return'],
  'treasure-hunt': ['fund', 'claim'],
  'public-bounty': ['fund', 'claim'],
  'first-to-solve': ['fund', 'claim'],
  'geocache': ['clue', 'fund'],
  'ctf-flag': ['fund', 'claim'],
  'puzzle-artifact': ['fund', 'claim'],
  'timelock': ['fund', 'sweep_cltv'],
  'time-capsule': ['op_return', 'fund', 'sweep_cltv'],
  'multisig': ['fund'],
  'opcode-playground': ['fund'],
  'bank-check': ['fund', 'op_return', 'sweep_cltv'],
  'atomic-swap-htlc': ['fund', 'claim'],
  'p2p-escrow': ['fund'],
  'milestone-escrow': ['fund', 'sweep_cltv'],
  'vesting-schedule': ['fund', 'sweep_cltv'],
  'invoice-refund': ['fund', 'claim'],
  'inheritance-switch': ['fund', 'sweep_cltv'],
  'savings-challenge': ['fund', 'sweep_cltv'],
  'proof-of-reserve': ['op_return', 'fund'],
  'raffle-commit': ['op_return', 'fund'],
  'content-unlock': ['fund', 'claim'],
  'reveal-code-unlock': ['op_return', 'fund', 'claim'],
  'game-license-key': ['op_return', 'fund', 'claim'],
  'music-download-code': ['op_return', 'fund', 'claim'],
  'software-activation': ['op_return', 'fund', 'claim'],
  'smart-door-access': ['op_return', 'fund', 'claim'],
  'iot-command-token': ['op_return', 'fund', 'claim'],
  'channel-open': ['fund'],
  'otc-swap-pair': ['fund', 'claim'],
};

const MODE_NEEDS = {
  op_return: { utxo: true, wif: true, change: true, fee: true },
  fund: { utxo: true, wif: true, change: true, fee: true, fundAmount: true },
  claim: { utxo: true, wif: false, change: false, fee: true, claim: true },
  sweep_cltv: { utxo: true, wif: false, change: false, fee: true, sweep: true },
  clue: { utxo: true, wif: true, change: true, fee: true, clue: true },
};

export function signModesForTemplate(templateId, result) {
  let ids = TEMPLATE_SIGN_MODES[templateId];
  if (!ids) {
    ids = [];
    if (result?.type === 'op_return' || result?.dataHex) ids.push('op_return');
    else if (result?.address) ids.push('fund');
  }
  ids = ids.filter((id) => {
    if (id === 'op_return') {
      return result?.dataHex || result?.capsuleAsm || result?.commitAsm
        || result?.type === 'op_return' || result?.type === 'pqc_commitment' || result?.asm?.startsWith('OP_RETURN');
    }
    if (id === 'fund' || id === 'claim' || id === 'sweep_cltv') return !!result?.address;
    if (id === 'clue') return !!result?.clues?.length;
    return true;
  });
  if (!ids.length) ids = ['fund'];
  return ids.map((id) => ({ id, label: MODE_LABELS[id] || id }));
}

export function signNeedsForMode(modeId) {
  return MODE_NEEDS[modeId] || MODE_NEEDS.fund;
}

export function opReturnDataHex(result) {
  return result?.dataHex
    || (result?.capsuleAsm?.startsWith('OP_RETURN ') ? result.capsuleAsm.split(' ')[1] : null)
    || (result?.commitAsm?.startsWith('OP_RETURN ') ? result.commitAsm.split(' ')[1] : null)
    || (result?.markerAsm?.startsWith('OP_RETURN ') ? result.markerAsm.split(' ')[1] : null)
    || (result?.asm?.startsWith('OP_RETURN ') ? result.asm.split(' ')[1] : null);
}
