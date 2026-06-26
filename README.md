# Dogecoin Smart Contracts Wizard

An educational, offline-capable web wizard for building Dogecoin smart contracts using native OP_CODES.

![Dogecoin](https://img.shields.io/badge/Dogecoin-OP__CODES-c2a633)

## What is this?

Dogecoin uses a Bitcoin-compatible scripting language, not Solidity or a separate VM. This tool helps anyone:

- Store **messages** and **file checksums** on-chain (`OP_RETURN`)
- Create **treasure hunts**, **bounties**, **CTF flags**, and **geocaches**
- Lock coins with **hash puzzles**, **quotes**, and **math challenges**
- Build **time-locked** wallets (`OP_CHECKLOCKTIMEVERIFY`)
- Set up **multi-sig vaults** for families and shared funds
- Explore opcodes like `OP_DUP`, `OP_HASH160`, `OP_IF`, `OP_CHECKSIG`

All generation happens **in your browser**. No private keys are sent anywhere. You broadcast signed transactions through your own node: **[DogeGo](https://dogego.org)** (actively developed, Core-compatible) or **[Dogecoin Core](https://dogecoin.com/)**.

## Live site

**https://wizard.dogego.org**

Hosted on GitHub Pages from [qlpqlp/dogecoin-smart-contracts](https://github.com/qlpqlp/dogecoin-smart-contracts).

### Deploy to GitHub Pages

1. Push this repo to GitHub (`qlpqlp/dogecoin-smart-contracts`)
2. Run `npm run build` so `js/bundle.js` is up to date before pushing
3. Go to **Settings → Pages**
4. Source: **Deploy from branch** → `main` → `/ (root)`
5. Under **Custom domain**, set `wizard.dogego.org` (the `CNAME` file in the repo root should match)
6. In your DNS provider, add a **CNAME** record: `wizard` → `qlpqlp.github.io`
7. Enable **Enforce HTTPS** in GitHub Pages settings once DNS propagates

After DNS propagates, the wizard is available at **https://wizard.dogego.org**.

## Local use

```bash
# Any static server works, e.g. Python:
python -m http.server 8080
# Open http://localhost:8080
```

Or open `index.html` directly (ES modules may require a local server in some browsers).

## Offline mode

After the first load, a service worker caches HTML, CSS, JS, and Google Fonts/Material Icons so you can build contracts without internet.

## Quick start

1. Open `index.html` in a browser (double-click works with bundled `js/bundle.js`)
2. Pick a template in the wizard and fill parameters
3. On the **Sign TX** tab, enter your UTXO + private key (WIF)
4. Click **Generate Signed Transaction**
5. Copy the raw hex and broadcast via your node:

**[DogeGo](https://dogego.org)** (recommended for the new testnet and mainnet; JSON-RPC compatible with Core):

```bash
curl --user <rpcuser>:<rpcpassword> \
  --data-binary '{"jsonrpc":"1.0","id":"wizard","method":"sendrawtransaction","params":["<paste_hex_here>"]}' \
  -H 'content-type: application/json' \
  http://127.0.0.1:18556/
```

Use port `22555` on mainnet. DogeGo also provides a wallet UI and dashboard; see [dogego.org](https://dogego.org).

**Dogecoin Core** (legacy testnet and mainnet):

```bash
dogecoin-cli -testnet sendrawtransaction <paste_hex_here>
```

Or paste into any block explorer's "broadcast raw transaction" tool.

### Rebuild bundle (after editing JS source)

```bash
npm install
npm run build
```

## What gets signed locally

| Action | What you need |
|--------|----------------|
| OP_RETURN message | UTXO + WIF + change address |
| Fund P2SH contract | UTXO + WIF + amount + change |
| Claim hash lock | UTXO at contract + preimage (+ WIF if script uses CHECKSIG) |

Private keys **never leave your browser**. No live connection to a node is required to build or sign.

## DogeGo and Dogecoin Core

This wizard does not connect to a node. After signing, you paste raw hex into a broadcaster of your choice.

| Node | Status | Notes |
|------|--------|-------|
| **[DogeGo](https://dogego.org)** | Actively developed | Improved full node based on Core. Wallet, web dashboard, and JSON-RPC (`sendrawtransaction`, `decodescript`, etc.). Reference implementation for the **new testnet** (reboot chain, RPC port 18556, P2P 44556). Also syncs mainnet. |
| **Dogecoin Core** | Official reference | Use for **legacy testnet** (port 44555) or mainnet. Same RPC workflow as DogeGo for broadcasting signed hex. |

The wizard defaults to **New testnet** in the network picker. DogeGo is highlighted on the Sign TX step when that network is selected.

## Templates included

| Template | Description |
|----------|-------------|
| Text Message | `OP_RETURN` on-chain message |
| File Checksum | SHA-256 anchor for document proof |
| Document Seal | Timestamp + author metadata |
| Treasure Hunt | HASH160 preimage lock |
| Public Bounty | Open first-to-solve bounty |
| First to Solve | Secret + signature race |
| Geocache | Chained OP_RETURN clues → prize |
| Capture the Flag | CTF flag hash unlock |
| Puzzle Artifact | Quote / math / riddle locks |
| Time Lock | CLTV date-locked coins |
| Time Capsule | Message + timed unlock |
| Multi-Sig Vault | M-of-N shared wallet |
| Opcode Playground | Custom ASM builder |

### DeFi & Escrow (new)

| Template | Description |
|----------|-------------|
| Bank Check | Post-dated CLTV check (dogecoin-wallet compatible QR) |
| Atomic Swap HTLC | Cross-chain hash + timelock swap |
| P2P Escrow | 2-of-3 buyer/seller/arbitrator |
| Milestone Payments | Contractor tranches with CLTV |
| Vesting Schedule | Cliff + unlock tranches |
| Invoice with Refund | Payee claim or payer refund after deadline |
| Inheritance Timelock | Owner now or heir later |
| Savings Challenge | Goal date or penalty path |
| Proof of Reserve | OP_RETURN + multisig treasury attestation |
| Raffle Commit–Reveal | Commit hash then prize hash-lock |
| Paid Content Unlock | Hash-lock micro-payment pattern |
| Payment Channel Open | 2-of-2 + refund CLTV path |
| OTC Swap Pair | Matching HTLCs for two-party swap |

## Networks

| Network | RPC Port | P2P Port | CLI flag | Typical node |
|---------|----------|----------|----------|--------------|
| **New testnet** (reboot) | 18556 | 44556 | `-testnet` | [DogeGo](https://dogego.org) |
| Legacy testnet | 44555 | 44555 | `-testnet` | Dogecoin Core |
| Mainnet | 22555 | 22556 | (default) | DogeGo or Dogecoin Core |
| Regtest | 18332 | 18444 | `-regtest` | Local dev only |

**Always test on the new testnet first** before mainnet.

## Project structure

```
├── index.html          # Main app shell
├── css/style.css       # Comic Neue + responsive UI
├── js/
│   ├── app.js          # Wizard UI & navigation
│   ├── templates.js    # Contract templates
│   ├── opcodes.js      # Script assembler
│   └── crypto.js       # SHA256, HASH160, P2SH addresses
├── sw.js               # Offline service worker
├── manifest.json       # PWA manifest
└── README.md
```

## Resources

- [DogeGo](https://dogego.org): actively developed Dogecoin full node (Core-compatible RPC)
- [Dogecoin Core OP_CODES docs](https://dogecoincore.com/#opcodes)
- [Dogecoin GitHub](https://github.com/dogecoin/dogecoin)
- [Libdogecoin](https://github.com/dogecoinfoundation/libdogecoin)
- [Wizard live](https://wizard.dogego.org): this project hosted at wizard.dogego.org

## Disclaimer

This is an **educational tool**. Scripts are generated as-is. Losing funds from incorrect scripts, failed races, or mainnet mistakes is your responsibility. Use testnet first and verify scripts before mainnet use.

## License

MIT. Use, fork, and teach freely.
