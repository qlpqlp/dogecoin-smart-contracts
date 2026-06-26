/**
 * Animated hero visualization: stack machine + OP_CODE execution + block validation.
 */

const ORBIT_OPCODES = [
  'OP_DUP', 'OP_HASH160', 'OP_CHECKSIG', 'OP_RETURN', 'OP_IF', 'OP_EQUAL',
  'OP_CHECKLOCKTIMEVERIFY', 'OP_CHECKMULTISIG', 'OP_SHA256', 'OP_ADD', 'OP_VERIFY', 'OP_ELSE',
];

const DEMOS = [
  {
    id: 'hash-lock',
    label: 'Hash lock',
    script: ['OP_HASH160', 'OP_EQUAL', 'OP_VERIFY'],
    steps: [
      { opcode: 'PUSH', data: 'much_secret', stack: ['much_secret'], caption: 'Buyer reveals preimage' },
      { opcode: 'OP_HASH160', stack: ['a3f2…8b1c'], caption: 'Hash the secret' },
      { opcode: 'PUSH', data: 'a3f2…8b1c', stack: ['a3f2…8b1c', 'a3f2…8b1c'], caption: 'Script committed hash' },
      { opcode: 'OP_EQUAL', stack: ['true'], caption: 'Compare hashes' },
      { opcode: 'OP_VERIFY', stack: [], caption: 'Must be true or abort' },
    ],
    valid: 'Unlock content · script passed',
  },
  {
    id: 'p2pkh',
    label: 'Signature check',
    script: ['OP_DUP', 'OP_HASH160', 'OP_EQUALVERIFY', 'OP_CHECKSIG'],
    steps: [
      { opcode: 'PUSH', data: '3044…sig', stack: ['3044…sig'], caption: 'Signature from wallet' },
      { opcode: 'PUSH', data: '02ab…pub', stack: ['3044…sig', '02ab…pub'], caption: 'Public key' },
      { opcode: 'OP_DUP', stack: ['3044…sig', '02ab…pub', '02ab…pub'], caption: 'Duplicate top item' },
      { opcode: 'OP_HASH160', stack: ['3044…sig', '02ab…pub', 'D8xK…h160'], caption: 'Address hash' },
      { opcode: 'PUSH', data: 'D8xK…h160', stack: ['3044…sig', '02ab…pub', 'D8xK…h160', 'D8xK…h160'], caption: 'Expected hash' },
      { opcode: 'OP_EQUALVERIFY', stack: ['3044…sig', '02ab…pub'], caption: 'Equal or fail tx' },
      { opcode: 'OP_CHECKSIG', stack: ['true'], caption: 'ECDSA verify' },
    ],
    valid: 'Spend authorized · OP_CHECKSIG ok',
  },
  {
    id: 'op-return',
    label: 'OP_RETURN data',
    script: ['OP_RETURN'],
    steps: [
      { opcode: 'PUSH', data: '[sha256…]', stack: ['[sha256…]'], caption: 'NFT checksum / message' },
      { opcode: 'OP_RETURN', stack: [], caption: 'Output unspendable · data on-chain' },
    ],
    valid: 'Data committed · included in block',
  },
  {
    id: 'timelock',
    label: 'Time lock',
    script: ['OP_CHECKLOCKTIMEVERIFY', 'OP_DROP', 'OP_CHECKSIG'],
    steps: [
      { opcode: 'PUSH', data: '1704067200', stack: ['1704067200'], caption: 'Lock time (unix)' },
      { opcode: 'OP_CHECKLOCKTIMEVERIFY', stack: [], caption: 'Block time must be past lock' },
      { opcode: 'PUSH', data: '3044…sig', stack: ['3044…sig'], caption: 'Owner signature' },
      { opcode: 'PUSH', data: '02ab…pub', stack: ['3044…sig', '02ab…pub'], caption: 'Owner pubkey' },
      { opcode: 'OP_CHECKSIG', stack: ['true'], caption: 'Release after date' },
    ],
    valid: 'CLTV passed · coins unlocked',
  },
];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderOpcodeHeroViz() {
  const orbit = ORBIT_OPCODES.map((op, i) => `
    <span class="opcode-orbit__chip" style="--orbit-i: ${i}; --orbit-total: ${ORBIT_OPCODES.length}">${op}</span>
  `).join('');

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
            <p class="opcode-hero-viz__caption" data-viz="caption">Executing…</p>
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
            <span>Validating…</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTape(script, activeIndex) {
  return script.map((op, i) => {
    let cls = 'opcode-hero-viz__op';
    if (i < activeIndex) cls += ' opcode-hero-viz__op--done';
    else if (i === activeIndex) cls += ' opcode-hero-viz__op--active';
    return `<span class="${cls}">${escapeHtml(op)}</span>`;
  }).join('');
}

function renderStack(items, reducedMotion) {
  if (!items.length) {
    return `<div class="opcode-hero-viz__stack-empty">empty</div>`;
  }
  const anim = reducedMotion ? '' : ' opcode-hero-viz__item--pop';
  return items.slice().reverse().map((item, i) => `
    <div class="opcode-hero-viz__item${anim}" style="--stack-i: ${i}">${escapeHtml(item)}</div>
  `).join('');
}

function renderProgress(demoIndex, stepIndex, stepCount, demoCount) {
  const dots = [];
  for (let d = 0; d < demoCount; d++) {
    const active = d === demoIndex ? ' opcode-hero-viz__dot--active' : '';
    dots.push(`<span class="opcode-hero-viz__dot${active}"></span>`);
  }
  const bar = stepCount > 0 ? Math.round(((stepIndex + 1) / stepCount) * 100) : 0;
  return `
    <div class="opcode-hero-viz__dots">${dots.join('')}</div>
    <div class="opcode-hero-viz__bar"><span style="width: ${bar}%"></span></div>
  `;
}

function randomBlock() {
  return 4_892_000 + Math.floor(Math.random() * 2000);
}

export function initOpcodeHeroViz(root) {
  if (!root) return () => {};

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tapeEl = root.querySelector('[data-viz="tape"]');
  const stackEl = root.querySelector('[data-viz="stack"]');
  const captionEl = root.querySelector('[data-viz="caption"]');
  const verdictEl = root.querySelector('[data-viz="verdict"]');
  const demoLabelEl = root.querySelector('[data-viz="demo-label"]');
  const blockEl = root.querySelector('[data-viz="block"]');
  const progressEl = root.querySelector('[data-viz="progress"]');

  let demoIndex = 0;
  let stepIndex = -1;
  let phase = 'step'; // step | valid | pause
  let timers = [];
  let stopped = false;

  const delay = (ms) => new Promise((resolve) => {
    const id = setTimeout(resolve, reducedMotion ? Math.min(ms, 400) : ms);
    timers.push(id);
  });

  function setVerdict(mode, text) {
    if (!verdictEl) return;
    verdictEl.className = 'opcode-hero-viz__verdict';
    if (mode === 'valid') {
      verdictEl.classList.add('opcode-hero-viz__verdict--valid');
      verdictEl.innerHTML = `<span class="material-icons">verified</span><span>${escapeHtml(text)}</span>`;
    } else if (mode === 'busy') {
      verdictEl.classList.add('opcode-hero-viz__verdict--busy');
      verdictEl.innerHTML = `<span class="material-icons">hourglass_empty</span><span>${escapeHtml(text)}</span>`;
    } else {
      verdictEl.innerHTML = `<span class="material-icons">sync</span><span>${escapeHtml(text)}</span>`;
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
      demo.script.length - 1,
    );
    const activeScriptIdx = step.opcode === 'PUSH' ? -1 : Math.max(0, scriptIdx);

    if (tapeEl) {
      tapeEl.innerHTML = `
        ${step.opcode === 'PUSH' ? `<span class="opcode-hero-viz__op opcode-hero-viz__op--push opcode-hero-viz__op--active">PUSH ${escapeHtml(step.data)}</span>` : ''}
        ${renderTape(demo.script, activeScriptIdx)}
      `;
    }
    if (stackEl) stackEl.innerHTML = renderStack(step.stack, reducedMotion);
    if (progressEl) {
      progressEl.innerHTML = renderProgress(demoIndex, stepIndex, demo.steps.length, DEMOS.length);
    }
    setVerdict('busy', `Running ${step.opcode}…`);
  }

  function paintValid() {
    const demo = DEMOS[demoIndex];
    if (tapeEl) tapeEl.innerHTML = renderTape(demo.script, demo.script.length);
    if (captionEl) captionEl.textContent = 'Every node runs the same script. Invalid spend = rejected.';
    if (progressEl) {
      progressEl.innerHTML = renderProgress(demoIndex, demo.steps.length - 1, demo.steps.length, DEMOS.length);
    }
    setVerdict('valid', demo.valid);
    root.classList.add('opcode-hero-viz--validated');
  }

  async function loop() {
    while (!stopped) {
      const demo = DEMOS[demoIndex];
      root.classList.remove('opcode-hero-viz--validated');
      stepIndex = -1;
      phase = 'step';

      for (let i = 0; i < demo.steps.length; i++) {
        if (stopped) return;
        stepIndex = i;
        paintStep();
        await delay(reducedMotion ? 700 : 1400);
      }

      phase = 'valid';
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
