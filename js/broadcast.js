/**
 * Local node + third-party broadcast helpers.
 * Browser fetch to public APIs may be blocked by CORS.
 */
import { getNetwork, networkCliArgs, networkRpcPort, DOGEGO_URL } from './networks.js';
import { renderCodeView } from './code-view.js';

export { DOGEGO_URL } from './networks.js';

function rpcSendRawCurl(hex, port) {
  const params = JSON.stringify({ jsonrpc: '1.0', id: 'wizard', method: 'sendrawtransaction', params: [hex] });
  return `curl -u user:pass -d '${params}' http://127.0.0.1:${port}/`;
}

export function renderLocalBroadcastHelp(hex, network) {
  const net = getNetwork(network);
  const port = networkRpcPort(network);
  const cliArgs = networkCliArgs(network);
  const legacyTestnetNote = network === 'testnet'
    ? '<p class="field-hint">DogeGo runs the <strong>new testnet</strong> (not legacy). For legacy testnet coins, use Dogecoin Core below.</p>'
    : '';
  const dogegoRecommended = net.dogego
    ? '<p class="broadcast-node-tag">Recommended for this network</p>'
    : '';

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
        ${renderCodeView(rpcSendRawCurl(hex, port), 'dogego-rpc', { title: `DogeGo JSON-RPC (port ${port})`, wrapAt: 120 })}
        <p class="field-hint">
          With DogeGo running, you can also broadcast from its built-in wallet UI.
          Download and docs: <a href="${DOGEGO_URL}" target="_blank" rel="noopener">dogego.org</a>
        </p>
        ${legacyTestnetNote}
      </div>

      <div class="broadcast-node">
        <h5><span class="material-icons">settings</span> Dogecoin Core</h5>
        <p>Original reference node. Same RPC method names; CLI wrapper shown below.</p>
        ${renderCodeView(`dogecoin-cli${cliArgs} sendrawtransaction ${hex}`, 'core-cli', { title: 'dogecoin-cli', wrapAt: 120 })}
      </div>
    </div>
  `;
}

export const BROADCAST_SERVICES = [
  {
    id: 'blockcypher',
    name: 'BlockCypher',
    icon: 'cloud_upload',
    networks: ['mainnet', 'testnet'],
    doc: 'https://www.blockcypher.com/dev/dogecoin/',
    webUrl: (network) => (network === 'testnet'
      ? 'https://live.blockcypher.com/doge-testnet/'
      : 'https://live.blockcypher.com/doge/'),
    async push(hex, network) {
      const net = network === 'testnet' ? 'test3' : 'main';
      const res = await fetch(`https://api.blockcypher.com/v1/doge/${net}/txs/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx: hex }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.errors?.[0]?.error || res.statusText);
      return data.tx?.hash || data.hash || JSON.stringify(data);
    },
  },
  {
    id: 'chainso',
    name: 'Chain.so',
    icon: 'link',
    networks: ['mainnet', 'testnet'],
    doc: 'https://chain.so/api/',
    webUrl: () => 'https://chain.so/broadcast',
    async push(hex, network) {
      const net = network === 'testnet' ? 'DOGETEST' : 'DOGE';
      const body = new URLSearchParams({ tx_hex: hex });
      const res = await fetch(`https://chain.so/api/v2/send_tx/${net}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (data.status !== 'success') {
        throw new Error(data.data?.error_message || data.message || JSON.stringify(data));
      }
      return data.data?.txid || data.data?.hash || JSON.stringify(data.data);
    },
  },
  {
    id: 'blockchair',
    name: 'Blockchair',
    icon: 'public',
    networks: ['mainnet'],
    doc: 'https://blockchair.com/api/docs',
    webUrl: () => 'https://blockchair.com/dogecoin/broadcast',
    async push(hex) {
      const body = new URLSearchParams({ data: hex });
      const res = await fetch('https://api.blockchair.com/dogecoin/push/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!data.data?.transaction_hash && data.data?.error) {
        throw new Error(data.data.error);
      }
      return data.data?.transaction_hash || JSON.stringify(data.data);
    },
  },
  {
    id: 'dogechain',
    name: 'Dogechain.info',
    icon: 'send',
    networks: ['mainnet'],
    doc: 'https://dogechain.info/',
    webUrl: () => 'https://dogechain.info/',
    async push(hex) {
      const body = new URLSearchParams({ tx: hex });
      const res = await fetch('https://dogechain.info/api/v1/pushtx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      if (!res.ok) throw new Error(data.error || data.message || text.slice(0, 200));
      return data.txid || data.tx_hash || data.hash || text.slice(0, 120);
    },
  },
];

export function renderBroadcastPanel(hex, network) {
  const net = getNetwork(network);
  const explorerNetwork = network === 'testnet-new' ? null : network;
  const services = explorerNetwork
    ? BROADCAST_SERVICES.filter((s) => s.networks.includes(explorerNetwork))
    : [];
  const dogegoNote = net.dogego ? `
    <div class="warn-box">
      <span class="material-icons">info</span>
      The new testnet is not on public block explorers yet.
      Broadcast with your local <a href="${DOGEGO_URL}" target="_blank" rel="noopener">DogeGo</a> node (RPC port ${net.rpcPort})
      or <code>dogecoin-cli -testnet sendrawtransaction</code>.
    </div>
  ` : '';
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
        `).join('')}
      </div>` : ''}
      <p class="field-hint">If API buttons fail (browser CORS), copy the hex above and paste on the provider's broadcast page, or use <a href="${DOGEGO_URL}" target="_blank" rel="noopener">DogeGo</a> / <code>dogecoin-cli sendrawtransaction</code> locally.</p>
      <div class="broadcast-result" id="broadcast-result" hidden></div>
    </div>
  `;
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

export function bindBroadcastPanel(root = document, network) {
  if (!root) return;
  const panel = root.querySelector('.broadcast-services');
  if (!panel) return;
  const hex = panel.dataset.broadcastHex;
  const resultEl = panel.querySelector('#broadcast-result');

  panel.querySelectorAll('[data-broadcast]').forEach((btn) => {
    if (btn.dataset.broadcastBound) return;
    btn.dataset.broadcastBound = '1';
    btn.addEventListener('click', async () => {
      const service = BROADCAST_SERVICES.find((s) => s.id === btn.dataset.broadcast);
      if (!service || !hex) return;
      btn.disabled = true;
      const prev = btn.innerHTML;
      btn.innerHTML = '<span class="material-icons">hourglass_empty</span> Sending…';
      if (resultEl) {
        resultEl.hidden = false;
        resultEl.className = 'broadcast-result broadcast-result--pending';
        resultEl.textContent = `Broadcasting via ${service.name}…`;
      }
      try {
        const txid = await service.push(hex, network);
        if (resultEl) {
          resultEl.className = 'broadcast-result broadcast-result--ok';
          resultEl.innerHTML = `<span class="material-icons">check_circle</span> <strong>${service.name}</strong> accepted. TXID: <code>${escapeHtml(String(txid))}</code>`;
        }
      } catch (e) {
        const msg = e.message || String(e);
        const isCors = /failed to fetch|networkerror|cors/i.test(msg);
        if (resultEl) {
          resultEl.className = 'broadcast-result broadcast-result--err';
          resultEl.innerHTML = `
            <span class="material-icons">error</span>
            <div>
              <strong>${service.name} failed</strong>
              <p>${escapeHtml(msg)}</p>
              ${isCors ? '<p>Copy the raw hex and use the <span class="material-icons" style="font-size:1rem;vertical-align:middle">open_in_new</span> link to broadcast manually on their website.</p>' : ''}
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

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
