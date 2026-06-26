/**
 * Reveal-code / hash-lock templates for digital content, access control, and IoT patterns.
 */
import { textToHex, randomSecret } from './crypto.js';
import { hashLockScript } from './defi-helpers.js';

export const UNLOCK_USE_CASES = [
  { value: 'game', label: 'Video game / DLC' },
  { value: 'music', label: 'Music / audio download' },
  { value: 'software', label: 'Software / app license' },
  { value: 'door', label: 'Door / physical access' },
  { value: 'iot', label: 'IoT device command' },
  { value: 'api', label: 'API / webhook token' },
  { value: 'other', label: 'Other digital content' },
];

const INTEGRATION_HINTS = {
  game: 'Your game checks SHA256(revealCode) or compares HASH160 against the script. Grant access when the player enters the code that matches the on-chain lock.',
  music: 'Host the file off-chain. After payment, give the buyer the reveal code. Your store verifies HASH160(code) against the committed script before serving the download.',
  software: 'Map the reveal code to a license file or activation server. On-chain lock proves you published this exact code at mint time.',
  door: 'Off-chain controller (ESP32, Home Assistant, etc.) polls or watches for a spend with the correct preimage, or verifies the code locally against the published HASH160.',
  iot: 'Device firmware accepts commands only when HMAC or HASH160(commandToken) matches the on-chain commitment. Pair with OP_RETURN device ID.',
  api: 'Reveal code becomes a bearer token. Your backend stores HASH160(token) and compares on each request; chain tx proves token existed at time T.',
  other: 'Any workflow where revealing a preimage unlocks off-chain value: files, features, tickets, or credentials.',
};

async function buildRevealUnlock({
  network,
  params,
  contentType,
  defaultTitle,
  description,
  stepsExtra = [],
}) {
  const secret = params.revealCode?.trim() || params.unlockSecret?.trim() || randomSecret(16);
  const contentId = (params.contentId || params.productId || params.deviceId || '').trim();
  if (!contentId) throw new Error('Content / product / device ID is required');

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
      'Sign TX → optionally broadcast OP_RETURN marker (content ID on-chain).',
      'Sign TX → Fund the P2SH hash-lock address (escrow / proof-of-sale optional).',
      'After payment, share the reveal code with the buyer. Never publish it on-chain.',
      'Buyer enters code in your app, game, door controller, or download gate.',
      'Optional: Sign TX → Claim to move escrow once code is delivered.',
      ...stepsExtra,
    ],
    meta: {
      unlock: {
        contentType,
        contentId,
        revealCode: secret,
        hash160: pkg.hash160,
        integration: INTEGRATION_HINTS[contentType] || INTEGRATION_HINTS.other,
        opcodes: ['OP_HASH160', 'OP_EQUAL', seller ? 'OP_EQUALVERIFY' : null, seller ? 'OP_CHECKSIG' : null].filter(Boolean),
        priceNote,
      },
      secret,
      hash160: pkg.hash160,
      warning: 'Anyone with the reveal code can spend an unfunded lock or claim escrow. Treat the code like a password.',
    },
  };
}

export const UNLOCK_TEMPLATES = [
  {
    id: 'reveal-code-unlock',
    category: 'unlocks',
    icon: 'vpn_key',
    title: 'Reveal Code Unlock',
    tagline: 'Hash-lock a reveal code for games, media, software, doors, or IoT',
    fields: [
      {
        id: 'useCase',
        label: 'Use case',
        type: 'select',
        options: UNLOCK_USE_CASES,
        default: 'game',
        required: true,
      },
      { id: 'contentId', label: 'Content / product ID', type: 'text', placeholder: 'my-game-level-1', required: true },
      { id: 'revealCode', label: 'Reveal code (preimage)', type: 'text', placeholder: 'Auto-generated if empty', required: false },
      { id: 'sellerAddress', label: 'Seller wallet (optional)', type: 'doge-address', placeholder: 'Restrict claim to this address' },
      { id: 'priceLabel', label: 'Price label (off-chain)', type: 'text', placeholder: '10 DOGE', required: false },
    ],
    async build(params, network) {
      const contentType = params.useCase || 'other';
      const useLabel = UNLOCK_USE_CASES.find((u) => u.value === contentType)?.label || 'Digital unlock';
      return buildRevealUnlock({
        network,
        params,
        contentType,
        defaultTitle: 'Reveal Code Unlock',
        description:
          `OP_HASH160 locks a reveal code on Layer 1. Perfect for ${useLabel.toLowerCase()}: `
          + 'the code is the preimage; your app verifies HASH160(code) against this script before unlocking content.',
      });
    },
  },
  {
    id: 'game-license-key',
    category: 'unlocks',
    icon: 'sports_esports',
    title: 'Game License Key',
    tagline: 'On-chain hash lock for a game activation / DLC code',
    fields: [
      { id: 'contentId', label: 'Game or DLC ID', type: 'text', placeholder: 'shibe-quest-dlc-2', required: true },
      { id: 'revealCode', label: 'License key', type: 'text', placeholder: 'XXXX-XXXX-XXXX', required: false },
      { id: 'sellerAddress', label: 'Publisher address (optional)', type: 'doge-address' },
      { id: 'priceLabel', label: 'Price', type: 'text', default: '100 DOGE' },
    ],
    async build(params, network) {
      return buildRevealUnlock({
        network,
        params: { ...params, useCase: 'game' },
        contentType: 'game',
        defaultTitle: 'Game License',
        description:
          'Commits a license key with OP_HASH160. Players redeem off-chain; optional DOGE escrow funds the key sale.',
        stepsExtra: ['Game client: if HASH160(enteredKey) === on-chain hash → unlock DLC.'],
      });
    },
  },
  {
    id: 'music-download-code',
    category: 'unlocks',
    icon: 'library_music',
    title: 'Music Download Code',
    tagline: 'Reveal code unlocks an album, track, or stem pack',
    fields: [
      { id: 'contentId', label: 'Track / album ID', type: 'text', placeholder: 'much-wow-ep-01', required: true },
      { id: 'revealCode', label: 'Download code', type: 'text', required: false },
      { id: 'sellerAddress', label: 'Artist address (optional)', type: 'doge-address' },
      { id: 'priceLabel', label: 'Price', type: 'text', default: '50 DOGE' },
    ],
    async build(params, network) {
      return buildRevealUnlock({
        network,
        params,
        contentType: 'music',
        defaultTitle: 'Music Unlock',
        description:
          'Fans pay off-chain (or to P2SH), receive the download code, and your server verifies the preimage against this hash lock.',
      });
    },
  },
  {
    id: 'software-activation',
    category: 'unlocks',
    icon: 'apps',
    title: 'Software Activation Lock',
    tagline: 'Activation code anchored with OP_HASH160',
    fields: [
      { id: 'productId', label: 'Product ID', type: 'text', placeholder: 'com.example.app-pro', required: true },
      { id: 'revealCode', label: 'Activation code', type: 'text', required: false },
      { id: 'sellerAddress', label: 'Vendor address (optional)', type: 'doge-address' },
      { id: 'priceLabel', label: 'License price', type: 'text', default: '200 DOGE' },
    ],
    async build(params, network) {
      return buildRevealUnlock({
        network,
        params: { ...params, contentId: params.productId },
        contentType: 'software',
        defaultTitle: 'Software Activation',
        description:
          'Prove when a license code was issued. Installer checks HASH160(code) before enabling pro features.',
      });
    },
  },
  {
    id: 'smart-door-access',
    category: 'unlocks',
    icon: 'door_front',
    title: 'Smart Door / Access PIN',
    tagline: 'PIN or token hash for doors, gates, and access control',
    fields: [
      { id: 'deviceId', label: 'Door / gate ID', type: 'text', placeholder: 'garage-door-west', required: true },
      { id: 'revealCode', label: 'Access PIN / token', type: 'text', placeholder: '6-digit PIN', required: false },
      { id: 'sellerAddress', label: 'Owner address (optional)', type: 'doge-address' },
    ],
    async build(params, network) {
      return buildRevealUnlock({
        network,
        params: { ...params, contentId: params.deviceId },
        contentType: 'door',
        defaultTitle: 'Access PIN Lock',
        description:
          'On-chain commitment to an access code. Your controller verifies the PIN against HASH160 before triggering a relay, no cloud account required for verification.',
        stepsExtra: [
          'Integrate: microcontroller compares user PIN → HASH160 → script hash on-chain or in exported JSON.',
        ],
      });
    },
  },
  {
    id: 'iot-command-token',
    category: 'unlocks',
    icon: 'sensors',
    title: 'IoT Command Token',
    tagline: 'Unlock device actions with a hashed command token',
    fields: [
      { id: 'deviceId', label: 'Device ID', type: 'text', placeholder: 'sensor-node-7', required: true },
      { id: 'revealCode', label: 'Command token', type: 'text', required: false },
      { id: 'sellerAddress', label: 'Device owner address (optional)', type: 'doge-address' },
    ],
    async build(params, network) {
      return buildRevealUnlock({
        network,
        params,
        contentType: 'iot',
        defaultTitle: 'IoT Command Lock',
        description:
          'Commit a command token with OP_HASH160. Firmware only runs privileged actions when the presented token matches the on-chain lock.',
      });
    },
  },
];
