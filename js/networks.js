/**
 * Dogecoin network parameters (mainnet, legacy testnet, new reboot testnet).
 * Reboot testnet values match DogeGo chain/params.go (CTestNetParams reboot).
 */
export const NETWORKS = {
  mainnet: {
    id: 'mainnet',
    label: 'Mainnet',
    shortLabel: 'Mainnet',
    icon: 'public',
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e,
    rpcPort: 22555,
    p2pPort: 22556,
    addressHint: 'D… or 9…',
    cliFlag: '',
    isTestnet: false,
    name: 'mainnet',
  },
  testnet: {
    id: 'testnet',
    label: 'Legacy testnet',
    shortLabel: 'Legacy testnet',
    icon: 'history',
    pubKeyHash: 0x71,
    scriptHash: 0xc4,
    wif: 0xf1,
    rpcPort: 44555,
    p2pPort: 44555,
    addressHint: 'n… or 2…',
    cliFlag: '-testnet',
    isTestnet: true,
    name: 'testnet',
  },
  'testnet-new': {
    id: 'testnet-new',
    label: 'New testnet',
    shortLabel: 'New testnet',
    icon: 'new_releases',
    pubKeyHash: 0x41,
    scriptHash: 0x42,
    wif: 0xc1,
    rpcPort: 18556,
    p2pPort: 44556,
    addressHint: 'New testnet address',
    cliFlag: '-testnet',
    isTestnet: true,
    dogego: true,
    name: 'testnet-new',
  },
};

export const NETWORK_OPTIONS = [
  { value: 'testnet-new', label: 'New testnet', icon: 'new_releases' },
  { value: 'testnet', label: 'Legacy testnet', icon: 'history' },
  { value: 'mainnet', label: 'Mainnet', icon: 'public' },
];

export function getNetwork(id) {
  return NETWORKS[id] || NETWORKS.testnet;
}

export function isMainnet(id) {
  return id === 'mainnet';
}

export function isTestnet(id) {
  return getNetwork(id).isTestnet;
}

export function networkReviewLabel(id) {
  const n = getNetwork(id);
  if (n.id === 'mainnet') return 'Mainnet (real DOGE)';
  return `${n.label} (test coins)`;
}

export function networkRpcPort(id) {
  return getNetwork(id).rpcPort;
}

export function networkCliArgs(id) {
  const n = getNetwork(id);
  return n.cliFlag ? ` ${n.cliFlag}` : '';
}

export const DOGEGO_URL = 'https://dogego.org';
