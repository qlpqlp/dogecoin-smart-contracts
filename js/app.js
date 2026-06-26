import { TEMPLATE_CATEGORIES, TEMPLATES, getTemplate } from './templates.js';
import { EXPLORER_OPCODES, asmToScript, bytesToHex } from './opcodes.js';
import { fileSha256, p2shAddressFromScript, textToHex, sha256Hex } from './crypto.js';
import {
  buildOpReturnTx,
  buildFundContractTx,
  buildClaimTx,
  buildCltvSweepTx,
} from './tx.js';
import { asmBlock, bindOpcodeBadgeUI, renderOpcodeBadgeStack, renderOpcodePalette, tokenizeAsm, appendStackToken } from './opcode-badges.js';
import {
  initConnectionBar,
  bindModernSelects,
  renderModernSelect,
  renderNetworkPicker,
  renderSignSecurityBanner,
} from './ui.js';
import { renderCodeView, bindCodeViews } from './code-view.js';
import { renderBroadcastPanel, bindBroadcastPanel, renderLocalBroadcastHelp } from './broadcast.js';
import { dogeInputAttrs, bindDogeInputs, parseDogeAmount, isValidDogeAmount } from './amount.js';
import { signModesForTemplate, signNeedsForMode, opReturnDataHex } from './sign-modes.js';
import { getNetwork, isMainnet, networkReviewLabel } from './networks.js';
import { demoPqcMaterial, PQC_BIP_URL, SUCHQUANTUM_URL } from './pqc.js';
import { renderOpcodeHeroViz, initOpcodeHeroViz } from './hero-animation.js';

const state = {
  view: 'home',
  category: null,
  templateId: null,
  step: 0,
  network: 'testnet-new',
  result: null,
  formData: {},
  signedTx: null,
};

let heroVizCleanup = null;

function stopHeroViz() {
  heroVizCleanup?.();
  heroVizCleanup = null;
}

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const WIZARD_STEPS = ['Choose', 'Configure', 'Review', 'Deploy'];

export function init() {
  initConnectionBar();
  syncHeaderNetwork();
  bindGlobalEvents();
  navigate('home');
  registerServiceWorker();
}

function syncHeaderNetwork() {
  const nav = $('#site-nav');
  if (!nav) return;
  const existing = nav.querySelector('[data-modern-select="network-select"]');
  if (existing) {
    existing.outerHTML = renderNetworkPicker(state.network);
  } else {
    nav.insertAdjacentHTML('beforeend', renderNetworkPicker(state.network));
  }
  bindModernSelects(document);
}

function registerServiceWorker() {
  if (location.protocol === 'file:') return;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function bindGlobalEvents() {
  $('#nav-toggle')?.addEventListener('click', () => {
    $('#site-nav')?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-nav]');
    if (!el) return;
    e.preventDefault();
    navigate(el.dataset.nav);
    $('#site-nav')?.classList.remove('open');
  });

  document.addEventListener('change', (e) => {
    if (e.target.id === 'network-select') {
      state.network = e.target.value;
      if (state.result) rebuildResult();
    }
  });
}

function navigate(view, data = {}) {
  stopHeroViz();
  const scrollToPlayground = view === 'playground';
  state.view = scrollToPlayground ? 'opcodes' : view;
  Object.assign(state, data);
  const main = $('#main');
  if (!main) return;

  switch (state.view) {
    case 'home':
      main.innerHTML = renderHome();
      bindHomeEvents();
      break;
    case 'wizard':
      try {
        main.innerHTML = renderWizard();
        bindWizardEvents();
      } catch (err) {
        console.error(err);
        main.innerHTML = `<section class="wizard"><div class="warn-box"><span class="material-icons">error</span> Could not show contract: ${escapeHtml(err.message)}</div></section>`;
        toast(err.message || 'Could not render contract');
      }
      break;
    case 'templates':
      main.innerHTML = renderTemplateGallery();
      bindGalleryEvents();
      break;
    case 'opcodes':
      main.innerHTML = renderOpcodeExplorer();
      bindOpcodeEvents();
      if (scrollToPlayground) {
        requestAnimationFrame(() => {
          document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
      break;
    case 'docs':
      main.innerHTML = renderDocs();
      break;
    default:
      main.innerHTML = renderHome();
  }
  if (!scrollToPlayground) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  syncHeaderNetwork();
}

function renderNav() {
  syncHeaderNetwork();
}

function renderSmartContractsExplainer() {
  return `
    <div class="sc-explainer__inner">
      <header class="sc-explainer__header">
        <p class="sc-explainer__eyebrow">Layer 1 · OP_CODES</p>
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
          <p>Participants lock value under rules they accept. Break the rules → spend rejected.</p>
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
          <p class="hero-note"><span class="material-icons">offline_bolt</span> Works offline after first load · Test on testnet first</p>
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
      `).join('')}
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
    data: 'Store messages, file hashes, document seals, and NFT checksum mints with OP_RETURN.',
    quantum: 'Post-quantum signature commitments (FLC1, DIL2, RCG4) and carrier proof verification.',
    defi: 'Bank checks, HTLC swaps, escrow, vesting, invoices, and other DeFi-adjacent locks.',
    games: 'Treasure hunts, bounties, CTF flags, geocaches, and puzzle artifacts.',
    unlocks: 'Reveal codes with OP_HASH160 for games, music, software, doors, and IoT access.',
    locks: 'Time capsules and CLTV-locked coins that open on a date.',
    social: 'Multi-signature vaults for families and shared projects.',
    explore: 'Stack your own scripts and learn the opcode machine.',
  };
  return map[id] || '';
}

function bindHomeEvents() {
  heroVizCleanup = initOpcodeHeroViz($('#opcode-hero-viz'));

  $('[data-action="start-wizard"]')?.addEventListener('click', () => {
    state.step = 0;
    state.templateId = null;
    state.category = null;
    state.formData = {};
    state.result = null;
    navigate('wizard');
  });

  $$('[data-action="category"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.category;
      state.step = 0;
      navigate('wizard');
    });
  });

  $$('[data-category]').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      state.category = card.dataset.category;
      state.step = 0;
      navigate('wizard');
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
            <div class="step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}">
              <span class="step-num">${i + 1}</span>
              <span class="step-label">${label}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="wizard-body">
        ${step === 0 ? renderStepChoose() : ''}
        ${step === 1 ? renderStepConfigure() : ''}
        ${step === 2 ? renderStepReview() : ''}
        ${step === 3 ? renderStepDeploy() : ''}
      </div>
      <div class="wizard-footer">
        ${step > 0 ? '<button type="button" class="btn btn-secondary" data-action="prev"><span class="material-icons">arrow_back</span> Back</button>' : '<span></span>'}
        ${step < 2 ? '<button type="button" class="btn btn-primary" data-action="next">Next <span class="material-icons">arrow_forward</span></button>' : ''}
        ${step === 2 ? '<button type="button" class="btn btn-primary" data-action="build"><span class="material-icons">code</span> Generate Contract</button>' : ''}
        ${step === 3 ? '<button type="button" class="btn btn-primary" data-action="new"><span class="material-icons">add</span> New Contract</button>' : ''}
      </div>
    </section>
  `;
}

function renderStepChoose() {
  const filtered = state.category
    ? TEMPLATES.filter((t) => t.category === state.category)
    : TEMPLATES;

  return `
    <h2>Choose a contract template</h2>
    <div class="category-tabs">
      <button class="tab ${!state.category ? 'active' : ''}" data-category="">All</button>
      ${TEMPLATE_CATEGORIES.map((c) => `
        <button class="tab ${state.category === c.id ? 'active' : ''}" data-category="${c.id}">
          <span class="material-icons">${c.icon}</span> ${c.label}
        </button>
      `).join('')}
    </div>
    <div class="template-grid">
      ${filtered.map((t) => `
        <label class="template-card ${state.templateId === t.id ? 'selected' : ''}">
          <input type="radio" name="template" value="${t.id}" ${state.templateId === t.id ? 'checked' : ''} hidden>
          <span class="material-icons">${t.icon}</span>
          <h3>${t.title}</h3>
          <p>${t.tagline}</p>
        </label>
      `).join('')}
    </div>
  `;
}

function renderStepConfigure() {
  const tpl = getTemplate(state.templateId);
  if (!tpl) return '<p>Select a template first.</p>';

  const fields = tpl.fields.map((f) => {
    const val = state.formData[f.id] ?? f.default ?? '';
    if (f.type === 'asm-badges') {
      const tokens = tokenizeAsm(String(val));
      return fieldWrap(f, `
        <div class="asm-field-editor" data-field="${f.id}">
          ${renderOpcodePalette('opcode-palette--inline')}
          ${renderOpcodeBadgeStack(tokens, { id: f.id, editable: true })}
          <textarea id="f-${f.id}" name="${f.id}" hidden ${f.required ? 'required' : ''}>${escapeHtml(String(val))}</textarea>
        </div>
      `);
    }
    if (f.type === 'select') {
      const opts = (f.options || []).map((o) => (
        typeof o === 'string' ? { value: o, label: o } : { value: o.value, label: o.label }
      ));
      return renderModernSelect({
        id: `f-${f.id}`,
        label: `${f.label}${f.required ? ' *' : ''}`,
        options: opts,
        value: val || opts[0]?.value || '',
        required: f.required,
      });
    }
    if (f.type === 'textarea') {
      return fieldWrap(f, `<textarea id="f-${f.id}" name="${f.id}" rows="4" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''}>${escapeHtml(String(val))}</textarea>`);
    }
    if (f.type === 'file') {
      return fieldWrap(f, `<input type="file" id="f-${f.id}" name="${f.id}" ${f.required ? 'required' : ''}><span class="file-hash" id="file-hash-display"></span>`);
    }
    if (f.type === 'doge-address') {
      const ph = f.placeholder || getNetwork(state.network).addressHint;
      return fieldWrap(f, `
        <input type="text" id="f-${f.id}" name="${f.id}" value="${escapeHtml(String(val))}" placeholder="${ph}" autocomplete="off" ${f.required ? 'required' : ''}>
        <p class="field-hint">Your regular wallet address. The script locks funds to this address; spend with the matching private key.</p>
      `);
    }
    if (f.type === 'doge') {
      return fieldWrap(f, dogeInputAttrs({
        id: `f-${f.id}`,
        name: f.id,
        value: val,
        placeholder: f.placeholder || '0.00',
        required: f.required,
      }));
    }
    const inputType = f.type === 'number' ? 'number' : f.type === 'datetime-local' ? 'datetime-local' : 'text';
    const extra = f.min != null ? `min="${f.min}"` : '';
    const extra2 = f.max != null ? `max="${f.max}"` : '';
    return fieldWrap(f, `<input type="${inputType}" id="f-${f.id}" name="${f.id}" value="${escapeHtml(String(val))}" placeholder="${f.placeholder || ''}" ${extra} ${extra2} ${f.required ? 'required' : ''}>`);
  }).join('');

  return `
    <h2>Configure: ${tpl.title}</h2>
    <p class="step-desc">${tpl.tagline}</p>
    <form class="wizard-form" id="wizard-form">${fields}</form>
    ${tpl.id === 'pqc-commitment' ? `
      <div class="pqc-actions">
        <button type="button" class="btn btn-ghost btn-sm" data-action="pqc-demo-fill">
          <span class="material-icons">casino</span> Random demo fill (lengths only)
        </button>
      </div>
    ` : ''}
    <div class="tip-box">
      <span class="material-icons">lightbulb</span>
      <div>${configureTip(tpl.id)}</div>
    </div>
  `;
}

function fieldWrap(f, input) {
  return `
    <div class="field">
      <label for="f-${f.id}">${f.label}${f.required ? ' *' : ''}</label>
      ${input}
    </div>
  `;
}

function configureTip(id) {
  const tips = {
    'treasure-hunt': 'Auto-generate a secret for maximum fairness. Share clues publicly; reveal the secret only to the winner.',
    'multisig': 'Generate keys with <code>dogecoin-cli getnewaddress</code> then <code>validateaddress</code> for pubkeys. Use 2-of-3 for family vaults.',
    'timelock': 'Paste your Dogecoin wallet address for the selected network (D on mainnet, n on legacy testnet, or your new testnet address). CLTV requires spending tx nLockTime ≥ locktime.',
    'time-capsule': 'Use the address from your Dogecoin wallet. You will spend the lock later with that wallet\'s private key.',
    'geocache': 'Broadcast clues as separate OP_RETURN txs in order before funding the prize.',
    'opcode-playground': 'Try: OP_DUP OP_HASH160 &lt;hash&gt; OP_EQUALVERIFY &lt;pubkey&gt; OP_CHECKSIG',
    'bank-check': 'Fund the check address immediately. Share QR payload with recipient. Sweep only works after check date.',
    'atomic-swap-htlc': 'Use the same preimage hash on both chains. Receiver claims with IF branch; sender refunds via ELSE after timeout.',
    'p2p-escrow': 'Buyer funds escrow. 2-of-3: any two of buyer, seller, arbitrator can release.',
    'inheritance-switch': 'Owner keeps control until inheritance date via ELSE branch.',
    'pqc-commitment': 'Paste PQ public key and signature hex from libdogecoin (<code>such -c falcon_sign</code> etc.). Commitment = SHA256(pk||sig). For production binds, sign tx sighash32. See the <a href="https://github.com/edtubbs/libdogecoin/blob/0.1.5-dev-pqc-carrier/doc/spec/bip-post-quantum-signature-commitments.mediawiki" target="_blank" rel="noopener">draft BIP</a>.',
    'pqc-carrier-proof': 'Paste raw hex from your node or explorer. Validates SHA256(pk||sig) against TX_C OP_RETURN, same check SPV scanners use. For full Falcon signature verify, use <a href="https://suchquantum.com/" target="_blank" rel="noopener">Such Quantum</a>.',
    'nft-mint': 'Same OP_RETURN pattern as the <a href="https://x.com/inevitable360/status/1470414541490110472" target="_blank" rel="noopener">first Dogecoin NFT mint (Dec 2021)</a>: <code>[sha256]</code> in OP_RETURN. Upload your image; verifiers re-hash to prove authenticity.',
    'reveal-code-unlock': 'OP_HASH160 locks your reveal code. Buyer gets the preimage after payment; your app, game, or device checks HASH160(code) before unlocking.',
    'game-license-key': 'License key committed on-chain. Game checks the code against OP_HASH160 before enabling DLC.',
    'music-download-code': 'Download code as hash-lock preimage. Serve files only when the code matches.',
    'software-activation': 'Activation code anchored with OP_HASH160 for license verification.',
    'smart-door-access': 'PIN/token hash for smart locks: verify locally or via a spend with the correct preimage.',
    'iot-command-token': 'Device command token locked with OP_HASH160 for privileged IoT actions.',
  };
  return tips[id] || 'Always test on testnet before using real DOGE on mainnet.';
}

function formatReviewValue(field, v) {
  if (field?.type === 'file') return '(file uploaded)';
  const s = String(v ?? '');
  if (!s) return '';
  if (field?.type === 'textarea' || s.length > 64) {
    const preview = escapeHtml(s.slice(0, 40));
    return `<code class="review-hex" title="${escapeHtml(s.slice(0, 512))}${s.length > 512 ? '…' : ''}">${preview}… <span class="muted">(${s.length} chars)</span></code>`;
  }
  return escapeHtml(s);
}

function renderStepReview() {
  const tpl = getTemplate(state.templateId);
  return `
    <h2>Review settings</h2>
    <div class="review-card">
      <h3>${tpl?.title || 'n/a'}</h3>
      <dl class="review-list">
        <dt>Network</dt><dd>${networkReviewLabel(state.network)}</dd>
        ${Object.entries(state.formData).map(([k, v]) => {
          if (k.startsWith('_')) return '';
          const field = tpl?.fields.find((f) => f.id === k);
          const label = field?.label || k;
          return `<dt>${label}</dt><dd>${formatReviewValue(field, v)}</dd>`;
        }).join('')}
      </dl>
    </div>
    ${isMainnet(state.network) ? '<div class="warn-box"><span class="material-icons">warning</span> Mainnet uses real DOGE. Double-check your script before broadcasting.</div>' : ''}
  `;
}

function renderStepDeploy() {
  if (!state.result) return '<p>Generate a contract first.</p>';
  const r = state.result;

  if (r.type === 'pqc_verify') {
    return renderPqcVerifyDeploy(r);
  }

  const steps = Array.isArray(r.steps) ? r.steps : [];
  return `
    <h2>${escapeHtml(r.title)}</h2>
    <p>${escapeHtml(r.description)}</p>

    ${r.meta?.pqc && r.type === 'pqc_commitment' ? pqcCommitmentBlock(r) : ''}
    ${r.meta?.nft ? nftMintBlock(r.meta.nft) : ''}

    ${r.address ? addressBlock(r.address) : ''}
    ${r.meta?.qrPayload ? bankCheckBlock(r.meta) : ''}
    ${r.contracts ? contractsBlock(r.contracts) : ''}
    ${r.refundContract ? '<h4>Refund path script</h4>' + scriptBlock(r.refundContract.asm, 'refund', true) : ''}
    ${r.commitAsm ? '<h4>Commit phase (OP_RETURN)</h4>' + scriptBlock(r.commitAsm, 'commit', true) : ''}
    ${r.markerAsm ? '<h4>Content marker (OP_RETURN)</h4>' + scriptBlock(r.markerAsm, 'marker', true) : ''}
    ${r.meta?.unlock ? unlockBlock(r.meta.unlock) : ''}
    ${r.meta?.secret ? secretBlock(r.meta) : ''}
    ${r.meta?.warning ? warnBlock(r.meta.warning) : ''}

    <div class="output-tabs">
      <button type="button" class="tab active" data-tab="sign">Sign TX</button>
      <button type="button" class="tab" data-tab="asm">Script ASM</button>
      <button type="button" class="tab" data-tab="hex">Script Hex</button>
      <button type="button" class="tab" data-tab="steps">Steps</button>
      ${r.clues ? '<button type="button" class="tab" data-tab="clues">Clues</button>' : ''}
    </div>

    <div class="output-panel" id="tab-sign">
      ${renderSignPanel(r)}
    ${state.signedTx ? renderSignedTxOutput(state.signedTx) : ''}
    </div>
    <div class="output-panel hidden" id="tab-asm">
      ${r.asm ? scriptBlock(r.asm, 'asm', true) : '<p class="muted">No script ASM for this contract.</p>'}
    </div>
    <div class="output-panel hidden" id="tab-hex">
      ${r.hex ? codeBlock(r.hex, 'hex', 'Script hex') : ''}
      ${r.redeemScript ? '<h4>Redeem Script</h4>' + codeBlock(r.redeemScript, 'redeem', 'Redeem script hex') : ''}
    </div>
    <div class="output-panel hidden" id="tab-steps">
      <ol class="steps-list">${steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
    </div>
    ${r.clues ? `<div class="output-panel hidden" id="tab-clues">${renderClues(r.clues)}</div>` : ''}
    ${r.capsuleAsm ? '<h4>Capsule Message Script</h4>' + scriptBlock(r.capsuleAsm, 'capsule', true) : ''}

    <div class="export-row">
      <button type="button" class="btn btn-secondary" data-action="export-json"><span class="material-icons">download</span> Export JSON</button>
      <button type="button" class="btn btn-secondary" data-action="copy-all"><span class="material-icons">content_copy</span> Copy Summary</button>
    </div>
  `;
}

function unlockBlock(unlock) {
  const ops = unlock.opcodes?.join(' → ') || 'OP_HASH160 OP_EQUAL';
  return `
    <div class="unlock-box">
      <h4><span class="material-icons">vpn_key</span> Reveal code lock</h4>
      <dl class="review-list">
        <dt>Use case</dt><dd>${escapeHtml(unlock.contentType)}</dd>
        <dt>Content ID</dt><dd><code>${escapeHtml(unlock.contentId)}</code></dd>
        <dt>Reveal code</dt><dd><code>${escapeHtml(unlock.revealCode)}</code></dd>
        <dt>HASH160</dt><dd><code>${escapeHtml(unlock.hash160)}</code></dd>
        <dt>OP_CODES</dt><dd><code>${escapeHtml(ops)}</code></dd>
        ${unlock.priceNote ? `<dt>Price (off-chain)</dt><dd>${escapeHtml(unlock.priceNote)}</dd>` : ''}
      </dl>
      <p class="field-hint">${escapeHtml(unlock.integration)}</p>
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
        <p>Pay to: <strong>${escapeHtml(meta.payTo)}</strong> · ${escapeHtml(meta.amount)} DOGE · Date: ${escapeHtml(meta.lockDate)}</p>
        <code class="address">${escapeHtml(meta.qrPayload)}</code>
        <small>Format: WIF|P2SH_ADDRESS|LOCKTIME_UNIX. Compatible with dogecoin-wallet sweep.</small>
        <p class="muted">WIF: <code>${escapeHtml(meta.wif)}</code></p>
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
        ${nft.name ? `<dt>Name</dt><dd>${escapeHtml(nft.name)}</dd>` : ''}
        ${nft.author ? `<dt>Creator</dt><dd>${escapeHtml(nft.author)}</dd>` : ''}
        <dt>SHA-256</dt><dd><code>${escapeHtml(nft.sha256)}</code></dd>
        <dt>OP_RETURN (ASCII)</dt><dd><code>${escapeHtml(nft.opReturnAscii)}</code></dd>
      </dl>
      <p class="field-hint">
        Verify: re-hash your file locally. It must match the checksum inside the brackets.
        This records proof on-chain; it is not a transferable token standard like Ethereum NFTs.
      </p>
      <p class="field-hint">
        Historic reference (13 Dec 2021):
        <a href="${escapeHtml(nft.tweetUrl)}" target="_blank" rel="noopener">@inevitable360 on X</a> ·
        <a href="${escapeHtml(nft.blockchairUrl)}" target="_blank" rel="noopener">first mint tx</a>
        <code class="review-hex">${escapeHtml(nft.historicTxid)}</code>
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
        <dt>Algorithm</dt><dd>${escapeHtml(p.schemeLabel)} (<code>${escapeHtml(p.tag)}</code>)</dd>
        <dt>commitment32</dt><dd><code>${escapeHtml(p.commitmentHex)}</code></dd>
        <dt>pk / sig length</dt><dd>${p.pkLen} / ${p.sigLen} bytes</dd>
        <dt>Prefixes</dt><dd>pk <code>${escapeHtml(p.pkPrefix)}…</code> · sig <code>${escapeHtml(p.sigPrefix)}…</code></dd>
        <dt>Carrier tag</dt><dd><code>${escapeHtml(p.carrierTag)}</code> (for TX_R reveal)</dd>
      </dl>
      <p class="field-hint">Canonical wire script: <code>${escapeHtml(r.scriptWireHex || r.hex)}</code></p>
      <p class="field-hint">
        Rule: <code>commitment32 = SHA256(public_key_bytes || signature_bytes)</code>.
        <a href="${PQC_BIP_URL}" target="_blank" rel="noopener">Draft BIP</a> ·
        <a href="${SUCHQUANTUM_URL}" target="_blank" rel="noopener">Such Quantum verifier</a>
      </p>
    </div>
  `;
}

function renderPqcVerifyDeploy(r) {
  const v = r.verification;
  const steps = Array.isArray(r.steps) ? r.steps : [];
  return `
    <h2>${escapeHtml(r.title)}</h2>
    <p>${escapeHtml(r.description)}</p>
    <div class="pqc-box pqc-box--ok">
      <h4><span class="material-icons">verified</span> Carrier commitment validation passed</h4>
      <dl class="review-list">
        <dt>Algorithm</dt><dd>${escapeHtml(v.algorithm)} (<code>${escapeHtml(v.opReturnTag)}</code> / <code>${escapeHtml(v.carrierTag)}</code>)</dt>
        <dt>TX_C txid</dt><dd><code>${escapeHtml(v.txidC)}</code></dd>
        <dt>TX_R txid</dt><dd><code>${escapeHtml(v.txidR)}</code></dd>
        <dt>Matched OP_RETURN vout</dt><dd>${v.matchedVout}</dd>
        <dt>commitment32</dt><dd><code>${escapeHtml(v.commitmentHex)}</code></dd>
        <dt>pk / sig length</dt><dd>${v.pkLen} / ${v.sigLen} bytes</dd>
        <dt>Link</dt><dd>${v.spendsTxC ? 'TX_R spends TX_C output' : escapeHtml(v.note)}</dd>
      </dl>
      <p class="field-hint">
        This validates on-chain commitment material only. Full PQ signature verification over <code>tx_sighash32</code>
        requires libdogecoin, DogeGo SPV, or the
        <a href="${SUCHQUANTUM_URL}" target="_blank" rel="noopener">Such Quantum</a> Falcon verifier.
        <a href="${PQC_BIP_URL}" target="_blank" rel="noopener">Draft BIP</a>
      </p>
    </div>
    <h3>Next steps</h3>
    <ol class="steps-list">${steps.map((s) => `<li>${s}</li>`).join('')}</ol>
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
          <h4>${escapeHtml(c.role || c.label || `Contract ${i + 1}`)}${c.amountNote ? ` (${escapeHtml(c.amountNote)} DOGE)` : ''}</h4>
          ${c.address ? `<p><code>${escapeHtml(c.address)}</code></p>` : ''}
          ${scriptBlock(c.asm, `contract-${i}`, true)}
        </div>
      `).join('')}
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
        <code>${escapeHtml(meta.secret)}</code>
        <small>Hex: ${meta.secretHex || 'n/a'} · HASH160: ${meta.hash160 || 'n/a'}</small>
      </div>
    </div>
  `;
}

function warnBlock(msg) {
  return `<div class="warn-box"><span class="material-icons">warning</span> ${msg}</div>`;
}

function codeBlock(text, id, title = 'Output') {
  const wrapAt = id.includes('hex') || /^[0-9a-fA-F]+$/.test(String(text).replace(/\s/g, '')) ? 64 : 96;
  return renderCodeView(text, id, { title, wrapAt });
}

function scriptBlock(text, id, editable = false, title = 'Script ASM') {
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
  const fundDefault = r.meta?.amount ? String(r.meta.amount) : '';
  const modeIds = new Set(modes.map((m) => m.id));
  const anyNeeds = (key) => modes.some((m) => signNeedsForMode(m.id)[key]);

  const modeSelector = modes.length > 1
    ? renderModernSelect({
      id: 'sign-mode',
      label: 'Transaction type',
      options: modes.map((m) => ({ value: m.id, label: m.label })),
      value: defaultMode,
      required: true,
    })
    : `<input type="hidden" id="sign-mode" name="sign-mode" value="${defaultMode}">`;

  return `
    <div class="sign-panel">
      ${renderSignSecurityBanner()}

      <form id="sign-form" class="wizard-form">
        ${modeSelector}

        <div id="sign-utxo-section" class="sign-section-block ${anyNeeds('utxo') ? '' : 'hidden'}">
          <h4 class="sign-section">Input UTXO (coins you are spending)</h4>
          <div class="field-row field-row--utxo">
            <div class="field"><label for="utxo-txid">Transaction ID (TXID) *</label><input id="utxo-txid" placeholder="64-char hex txid of funding UTXO" required></div>
            <div class="field field-vout"><label for="utxo-vout" title="Output index (vout) in the funding transaction">Vout *</label><input id="utxo-vout" type="number" value="0" min="0" step="1" required></div>
          </div>
          <div class="field-row">
            <div class="field"><label for="utxo-value">Input amount (DOGE) *</label>${dogeInputAttrs({ id: 'utxo-value', name: 'utxo-value', placeholder: 'e.g. 100.5', required: true })}</div>
            <div class="field"><label for="utxo-address">Source Dogecoin address *</label><input id="utxo-address" placeholder="address that received this UTXO" required></div>
          </div>
        </div>

        <div id="sign-wif-section" class="sign-wif-field field ${anyNeeds('wif') ? '' : 'hidden'}">
          <label for="sign-wif">Private key (WIF or hex) <span id="wif-hint">*</span></label>
          <input id="sign-wif" type="password" placeholder="Required for this transaction type" autocomplete="off">
          <small class="field-hint">Used only locally to sign. Never uploaded. Prefer signing while offline.</small>
        </div>

        ${modeIds.has('fund') ? `
        <div id="sign-mode-fund" class="mode-fields ${defaultMode === 'fund' ? '' : 'hidden'}">
          <h4 class="sign-section">Fund contract</h4>
          <div class="field"><label for="fund-amount">Amount to lock (DOGE) *</label>${dogeInputAttrs({ id: 'fund-amount', name: 'fund-amount', value: fundDefault, placeholder: '10.00', required: true })}</div>
          <div class="field"><label>Destination (P2SH)</label><input value="${escapeHtml(r.address || '')}" readonly class="readonly"></div>
        </div>` : ''}

        ${modeIds.has('op_return') ? `
        <div id="sign-mode-op_return" class="mode-fields ${defaultMode === 'op_return' ? '' : 'hidden'}">
          <h4 class="sign-section">OP_RETURN data</h4>
          <div class="field"><label>Data hex</label><input value="${escapeHtml(dataHex || '')}" readonly class="readonly"></div>
        </div>` : ''}

        ${modeIds.has('clue') ? `
        <div id="sign-mode-clue" class="mode-fields ${defaultMode === 'clue' ? '' : 'hidden'}">
          <h4 class="sign-section">Clue OP_RETURN</h4>
          ${(r.clues?.length)
    ? renderModernSelect({
      id: 'clue-index',
      label: 'Clue #',
      options: r.clues.map((_, i) => ({ value: String(i), label: `Clue ${i + 1}` })),
      value: '0',
    })
    : '<p class="field-hint">No clues configured.</p>'}
        </div>` : ''}

        ${modeIds.has('claim') ? `
        <div id="sign-mode-claim" class="mode-fields ${defaultMode === 'claim' ? '' : 'hidden'}">
          <h4 class="sign-section">Claim locked coins</h4>
          <div class="field"><label for="claim-to">Receive at address *</label><input id="claim-to" placeholder="your P2PKH address"></div>
          <div class="field"><label for="claim-preimage">Secret preimage *</label><input id="claim-preimage" value="${escapeHtml(r.meta?.secret || r.meta?.winningNumber || '')}" placeholder="answer / passphrase for hash lock"></div>
          <div class="field"><label>Redeem script hex</label><input value="${escapeHtml(r.hex || '')}" readonly class="readonly"></div>
        </div>` : ''}

        ${modeIds.has('sweep_cltv') ? `
        <div id="sign-mode-sweep_cltv" class="mode-fields ${defaultMode === 'sweep_cltv' ? '' : 'hidden'}">
          <h4 class="sign-section">Sweep CLTV / bank check</h4>
          <div class="field"><label for="sweep-to">Receive at address *</label><input id="sweep-to" placeholder="recipient P2PKH address"></div>
          <div class="field"><label for="sign-wif-cltv">Check WIF *</label><input id="sign-wif-cltv" type="password" value="${escapeHtml(r.meta?.wif || '')}" placeholder="from QR payload or bank check meta" autocomplete="off"></div>
          <p class="field-hint">Tx nLockTime = ${r.meta?.locktime || 'locktime from contract'}. Only valid after unlock date.</p>
        </div>` : ''}

        <div id="sign-fee-section" class="sign-section-block ${anyNeeds('fee') ? '' : 'hidden'}">
          <h4 class="sign-section">Fees & change</h4>
          <div class="field-row">
            <div class="field"><label for="sign-fee">Fee (DOGE)</label>${dogeInputAttrs({ id: 'sign-fee', name: 'sign-fee', value: '0.01', placeholder: '0.01' })}</div>
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
      ${codeBlock(tx.rawHex, 'signed-raw', 'Signed raw transaction hex')}
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
  `).join('');
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
      `).join('')}
    </div>
  `;
}

function bindGalleryEvents() {
  $$('[data-use-template]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.templateId = btn.dataset.useTemplate;
      state.step = 1;
      state.formData = {};
      const tpl = getTemplate(state.templateId);
      state.category = tpl?.category;
      navigate('wizard');
    });
  });
}

function renderOpcodeExplorer() {
  const defaultAsm = 'OP_HASH160 abcd1234 OP_EQUAL';
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
      `).join('')}
    </div>
    <section class="playground-section" id="playground">
      <h2>Quick Playground</h2>
      ${renderOpcodePalette()}
      ${renderOpcodeBadgeStack(tokenizeAsm(defaultAsm), { id: 'playground-asm', editable: true })}
      <textarea id="playground-asm" rows="2" hidden>${defaultAsm}</textarea>
      <button class="btn btn-primary" id="playground-build"><span class="material-icons">play_arrow</span> Build Script</button>
      <div id="playground-output"></div>
    </section>
  `;
}

function bindOpcodeEvents() {
  bindOpcodeBadgeUI($('#main'));
  bindModernSelects($('#main'));

  $('#main')?.addEventListener('asm-changed', (e) => {
    if (e.detail?.id === 'playground-asm') {
      const ta = $('#playground-asm');
      if (ta) ta.value = e.detail.asm;
    }
  });

  $$('[data-insert-op]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const stack = $('[data-stack-id="playground-asm"]');
      if (!stack) return;
      appendStackToken(stack, { type: 'opcode', value: btn.dataset.insertOp });
    });
  });

  $('#playground-build')?.addEventListener('click', async () => {
    const asm = $('#playground-asm')?.value.trim();
    const out = $('#playground-output');
    if (!asm || !out) return;
    try {
      const hex = bytesToHex(asmToScript(asm));
      let addr = '';
      try { addr = await p2shAddressFromScript(hex, state.network); } catch { /* */ }
      out.innerHTML = `
        ${scriptBlock(asm, 'playground-out', false, 'Script ASM')}
        ${renderCodeView(hex, 'playground-hex', { title: 'Script hex', wrapAt: 64 })}
        ${addr ? `<p>P2SH address: <code>${addr}</code></p>` : '<p class="muted">Not a standard P2SH script or too large.</p>'}
      `;
      bindOpcodeBadgeUI(out);
      bindCodeViews(out);
    } catch (e) {
      out.innerHTML = `<div class="warn-box">${escapeHtml(e.message)}</div>`;
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
        <p>Dogecoin’s script language is deliberately <strong>not</strong> Turing-complete. That is a security and predictability feature, not a missing feature:</p>
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
          <tr><td>Legacy testnet</td><td>44555</td><td>Original Dogecoin testnet (<code>n…</code> addresses).</td></tr>
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
  const body = $('.wizard-body');
  if (body) body.innerHTML = renderStepChoose();
  bindWizardChooseEvents();
  bindCategoryTabEvents();
}

function bindCategoryTabEvents() {
  $$('.category-tabs .tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      state.category = tab.dataset.category || null;
      refreshStepChoose();
    });
  });
}

function bindWizardEvents() {
  bindCategoryTabEvents();
  bindWizardChooseEvents();
  bindWizardConfigureEvents();
  bindOpcodeBadgeUI($('.wizard-body'));
  bindModernSelects($('.wizard-body'));

  $('[data-action="prev"]')?.addEventListener('click', () => {
    if (state.step > 0) {
      state.step--;
      navigate('wizard');
    }
  });

  $('[data-action="next"]')?.addEventListener('click', async () => {
    if (state.step === 0 && !state.templateId) {
      toast('Please select a template');
      return;
    }
    if (state.step === 1) {
      const ok = await collectFormData();
      if (!ok) return;
    }
    state.step++;
    navigate('wizard');
  });

  $('[data-action="build"]')?.addEventListener('click', async (e) => {
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

  $('[data-action="pqc-demo-fill"]')?.addEventListener('click', async () => {
    const scheme = $('#f-scheme')?.value || state.formData.scheme || 'falcon';
    try {
      const demo = await demoPqcMaterial(scheme);
      const pkEl = $('#f-pubkey');
      const sigEl = $('#f-signature');
      if (pkEl) pkEl.value = demo.pubkeyHex;
      if (sigEl) sigEl.value = demo.signatureHex;
      state.formData.pubkey = demo.pubkeyHex;
      state.formData.signature = demo.signatureHex;
      toast('Demo material filled (random bytes, for length/preview only)');
    } catch (err) {
      toast(err.message || 'Demo fill failed');
    }
  });

  $('[data-action="new"]')?.addEventListener('click', () => {
    state.step = 0;
    state.templateId = null;
    state.formData = {};
    state.result = null;
    state.signedTx = null;
    navigate('wizard');
  });

  bindOutputEvents();
}

function bindWizardChooseEvents() {
  $$('input[name="template"]').forEach((input) => {
    input.addEventListener('change', () => {
      state.templateId = input.value;
      $$('.template-card').forEach((c) => c.classList.remove('selected'));
      input.closest('.template-card')?.classList.add('selected');
    });
  });

  const fileInput = $('#f-file');
  fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const hash = await fileSha256(file);
    state.formData._fileHash = hash;
    state.formData.hash = hash;
    const hashInput = $('#f-hash');
    if (hashInput) hashInput.value = hash;
    const filenameInput = $('#f-filename');
    if (filenameInput && !filenameInput.value.trim()) filenameInput.value = file.name;
    const disp = $('#file-hash-display');
    if (disp) disp.textContent = `SHA-256: ${hash} (filled in hash field)`;
    toast('File hash computed and filled in');
  });
}

function bindWizardConfigureEvents() {
  bindOpcodeBadgeUI($('#wizard-form'));
  bindModernSelects($('#wizard-form'));
  bindDogeInputs($('#wizard-form'));

  const docEl = $('#f-document');
  let docTimer;
  docEl?.addEventListener('input', () => {
    clearTimeout(docTimer);
    docTimer = setTimeout(async () => {
      const v = docEl.value.trim();
      const preview = $('#document-hash-preview');
      if (!preview) return;
      if (/^[0-9a-fA-F]{64}$/.test(v)) {
        preview.textContent = `Using pasted hash: ${v.toLowerCase()}`;
        state.formData._documentHash = v.toLowerCase();
        return;
      }
      if (!v) {
        preview.textContent = '';
        return;
      }
      const h = await sha256Hex(v);
      preview.textContent = `Computed SHA-256: ${h}`;
      state.formData._documentHash = h;
    }, 400);
  });

  if (state.templateId === 'treasure-hunt') {
    const secretField = $('#f-secret')?.closest('.field');
    if (secretField && !$('#btn-gen-secret')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-secondary btn-sm field-action-btn';
      btn.id = 'btn-gen-secret';
      btn.innerHTML = '<span class="material-icons">casino</span> Generate random secret';
      secretField.appendChild(btn);
      btn.addEventListener('click', () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let s = '';
        for (let i = 0; i < 16; i++) s += chars[Math.floor(Math.random() * chars.length)];
        const el = $('#f-secret');
        if (el) el.value = s;
        toast('Random secret generated');
      });
    }
  }

  if (state.templateId === 'document-commit') {
    const docField = $('#f-document')?.closest('.field');
    if (docField && !$('#document-hash-preview')) {
      const span = document.createElement('span');
      span.id = 'document-hash-preview';
      span.className = 'file-hash';
      docField.appendChild(span);
    }
  }
}

async function collectFormData() {
  const tpl = getTemplate(state.templateId);
  if (!tpl) return false;
  const form = $('#wizard-form');
  if (!form) return false;

  const data = { ...state.formData };
  for (const field of tpl.fields) {
    const el = $(`#f-${field.id}`);
    if (!el) continue;
    if (field.type === 'file') continue;
    data[field.id] = el.value;
      if (field.required && !String(el.value).trim() && field.type !== 'file') {
        toast(`Please fill: ${field.label}`);
        el.focus();
        return false;
      }
      if (field.type === 'doge' && String(el.value).trim()) {
        if (!isValidDogeAmount(el.value)) {
          toast(`${field.label}: numbers only, up to 8 decimals`);
          el.focus();
          return false;
        }
      }
  }
  if ((tpl.id === 'file-checksum' || tpl.id === 'nft-mint') && !data.hash && !data._fileHash) {
    toast('Upload a file or paste a hash');
    return false;
  }
  state.formData = data;
  return true;
}

async function buildContract() {
  const tpl = getTemplate(state.templateId);
  if (!tpl) {
    toast('Select a template first');
    return false;
  }
  try {
    state.result = await tpl.build(state.formData, state.network);
    state.signedTx = null;
    state.step = 3;
    navigate('wizard');
    toast('Contract generated!');
    return true;
  } catch (e) {
    toast(e.message);
    state.step = 2;
    navigate('wizard');
    return false;
  }
}

async function rebuildResult() {
  const tpl = getTemplate(state.templateId);
  if (!tpl || !state.result) return;
  try {
    state.result = await tpl.build(state.formData, state.network);
    navigate('wizard');
  } catch { /* */ }
}

function bindOutputEvents() {
  bindOpcodeBadgeUI($('.wizard-body'));
  bindModernSelects($('.wizard-body'));
  bindDogeInputs($('.wizard-body'));
  bindCodeViews($('.wizard-body'), (text) => toast('Copied!'));
  bindBroadcastPanel($('.wizard-body'), state.network);

  $$('.output-tabs .tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.output-tabs .tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      $$('.output-panel').forEach((p) => p.classList.add('hidden'));
      $(`#tab-${tab.dataset.tab}`)?.classList.remove('hidden');
    });
  });

  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      if (text) copyToClipboard(text);
    });
  });

  $('[data-action="export-json"]')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state.result, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `doge-contract-${state.templateId}.json`;
    a.click();
  });

  $('[data-action="copy-all"]')?.addEventListener('click', () => {
    const r = state.result;
    const summary = [
      r.title, r.description,
      r.address ? `Address: ${r.address}` : '',
      state.signedTx ? `Signed TX: ${state.signedTx.rawHex}` : '',
      `ASM: ${r.asm}`, `Hex: ${r.hex}`,
    ].filter(Boolean).join('\n\n');
    copyToClipboard(summary);
  });

  bindSignForm();
}

function updateSignSecurityBanner() {
  const banner = $('.sign-security-banner');
  if (!banner) return;
  const safe = !navigator.onLine;
  banner.className = `sign-security-banner ${safe ? 'sign-security-banner--safe' : 'sign-security-banner--warn'}`;
  banner.innerHTML = `
    <span class="material-icons">${safe ? 'shield' : 'warning'}</span>
    <div>
      <strong>${safe ? 'Offline mode: good for signing' : 'Security: private keys stay in your browser only'}</strong>
      <p>For maximum safety before entering a WIF: disconnect from the internet (Wi‑Fi off or unplug ethernet), then sign. Copy the raw hex and broadcast later from another device.</p>
    </div>
  `;
}

async function bindSignForm() {
  const form = $('#sign-form');
  if (!form || form.dataset.signBound) return;
  form.dataset.signBound = '1';

  const applyModeVisibility = () => {
    const mode = $('#sign-mode')?.value || 'fund';
    const needs = signNeedsForMode(mode);
    $$('.mode-fields').forEach((el) => el.classList.add('hidden'));
    $(`#sign-mode-${mode}`)?.classList.remove('hidden');

    $('#sign-utxo-section')?.classList.toggle('hidden', !needs.utxo);
    $('#sign-wif-section')?.classList.toggle('hidden', !needs.wif);
    $('#sign-fee-section')?.classList.toggle('hidden', !needs.fee);

    const changeField = $('#sign-change-field');
    const changeInput = $('#sign-change');
    if (changeField && changeInput) {
      changeField.classList.toggle('hidden', !needs.change);
      changeInput.required = !!needs.change;
    }

    const wifMain = $('#sign-wif');
    if (wifMain) wifMain.required = !!needs.wif;

    const hint = $('#wif-hint');
    if (hint) hint.textContent = needs.wif ? '*' : '';
  };

  const modeSelect = $('#sign-mode');
  modeSelect?.addEventListener('change', applyModeVisibility);
  applyModeVisibility();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      state.signedTx = await handleSignSubmit();
      toast('Transaction signed!');
      navigate('wizard');
    } catch (err) {
      toast(err.message || 'Signing failed');
    }
  });
}

async function handleSignSubmit() {
  const r = state.result;
  if (!r) throw new Error('Generate a contract first');

  const mode = $('#sign-mode')?.value || 'fund';
  const needs = signNeedsForMode(mode);
  const utxo = {
    txid: $('#utxo-txid')?.value.trim(),
    vout: $('#utxo-vout')?.value,
    valueDoge: parseDogeAmount($('#utxo-value')?.value, 'Input amount'),
    address: $('#utxo-address')?.value.trim(),
  };
  const privateKey = $('#sign-wif')?.value.trim();
  const feeDoge = parseDogeAmount($('#sign-fee')?.value || '0.01', 'Fee');
  const changeAddress = $('#sign-change')?.value.trim();

  if (needs.utxo && (!utxo.txid || !utxo.address)) {
    throw new Error('Fill in UTXO txid and source address');
  }

  const base = { network: state.network, utxo, feeDoge, changeAddress };

  if (mode === 'op_return') {
    const dataHex = opReturnDataHex(r);
    if (!dataHex) throw new Error('No OP_RETURN data in contract');
    if (!privateKey) throw new Error('Private key required');
    if (!changeAddress) throw new Error('Change address required');
    return buildOpReturnTx({ ...base, privateKey, dataHex });
  }

  if (mode === 'clue') {
    const idx = parseInt($('#clue-index')?.value || '0', 10);
    const clue = r.clues?.[idx];
    const dataHex = clue?.asm?.split(' ')[1];
    if (!dataHex) throw new Error('Invalid clue');
    if (!privateKey) throw new Error('Private key required');
    if (!changeAddress) throw new Error('Change address required');
    return buildOpReturnTx({ ...base, privateKey, dataHex });
  }

  if (mode === 'fund') {
    const amountDoge = parseDogeAmount($('#fund-amount')?.value, 'Amount to lock');
    if (!r.address) throw new Error('No contract address');
    if (!privateKey) throw new Error('Private key required');
    if (!changeAddress) throw new Error('Change address required');
    return buildFundContractTx({ ...base, privateKey, toAddress: r.address, amountDoge });
  }

  if (mode === 'claim') {
    const toAddress = $('#claim-to')?.value.trim();
    const preimage = $('#claim-preimage')?.value;
    if (!toAddress) throw new Error('Enter receive address');
    if (!preimage?.trim()) throw new Error('Enter the secret preimage');
    return buildClaimTx({
      network: state.network,
      utxo: { ...utxo, address: utxo.address || r.address },
      redeemScriptHex: r.hex,
      privateKey: privateKey || undefined,
      preimage,
      toAddress,
      feeDoge,
      locktime: r.meta?.locktime || 0,
      changeAddress: changeAddress || undefined,
    });
  }

  if (mode === 'sweep_cltv') {
    const toAddress = $('#sweep-to')?.value.trim();
    const checkWif = $('#sign-wif-cltv')?.value.trim() || r.meta?.wif;
    if (!toAddress) throw new Error('Enter receive address');
    if (!checkWif) throw new Error('Check WIF required');
    if (!r.meta?.locktime) throw new Error('No locktime on this contract');
    return buildCltvSweepTx({
      network: state.network,
      utxo: { ...utxo, address: utxo.address || r.address },
      checkWif,
      privateKey: checkWif,
      redeemScriptHex: r.hex,
      toAddress,
      feeDoge,
      locktime: r.meta.locktime,
    });
  }

  throw new Error('Unknown sign mode');
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => toast('Copied!')).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    toast('Copied!');
  });
}

function toast(msg) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
  window.__updateSignSecurityBanner = updateSignSecurityBanner;
  init();
});
