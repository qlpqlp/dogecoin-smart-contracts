import { EXPLORER_OPCODES } from './opcodes.js';

import { renderCodeView, formatCodeLines } from './code-view.js';

export function tokenizeAsm(asm) {
  if (!asm || !String(asm).trim()) return [];
  return String(asm)
    .replace(/\n/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((value) => ({
      type: value.startsWith('OP_') || value === 'OP_0' || /^-?\d+$/.test(value) ? 'opcode' : 'data',
      value,
    }));
}

export function tokensToAsm(tokens) {
  return tokens.map((t) => t.value).join(' ');
}

export function renderOpcodePalette(extraClass = '') {
  const ops = EXPLORER_OPCODES.map((o) => o.name);
  return `
    <div class="opcode-palette ${extraClass}" data-opcode-palette>
      <span class="opcode-palette-label">OP_CODES</span>
      ${ops.map((name) => `
        <span class="opcode-badge opcode-badge--op opcode-badge--palette"
              draggable="true" data-drag-op="${name}" title="Drag into script">${name}</span>
      `).join('')}
      <span class="opcode-badge opcode-badge--data opcode-badge--palette"
            draggable="true" data-drag-data="true" title="Drag to add custom hex push">+ data</span>
    </div>
  `;
}

export function renderOpcodeBadgeStack(tokens, { id = 'asm', editable = true, showPalette = false } = {}) {
  const badges = tokens.map((t, i) => renderOpcodeBadge(t, i, editable)).join('');
  return `
    <div class="opcode-script-wrap" data-asm-wrap="${id}">
      ${showPalette ? renderOpcodePalette('opcode-palette--inline') : ''}
      <div class="opcode-script-stack ${editable ? 'opcode-script-stack--editable' : ''}"
           data-stack-id="${id}" data-editable="${editable ? '1' : ''}">
        ${badges || (editable ? '<span class="opcode-drop-hint">Drop OP_CODES here or drag from palette</span>' : '')}
      </div>
      ${editable ? '<p class="opcode-hint muted">Drag badges to reorder · double-click data to edit · drop palette items to add</p>' : ''}
    </div>
  `;
}

function renderOpcodeBadge(token, index, editable) {
  const cls = token.type === 'opcode' ? 'opcode-badge--op' : 'opcode-badge--data';
  return `
    <span class="opcode-badge ${cls}"
          draggable="${editable ? 'true' : 'false'}"
          data-index="${index}"
          data-token-type="${token.type}"
          title="${editable ? 'Drag to reorder' : ''}">${escapeHtml(token.value)}</span>
  `;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function appendStackToken(stack, token) {
  if (!stack) return;
  const tokens = getStackTokens(stack);
  tokens.push(token);
  applyStackTokens(stack, tokens, stack.dataset.stackId);
}

function findStackForPalette(palette) {
  const section = palette.closest('.playground-section, .asm-field-editor, .asm-block, [data-asm-wrap]');
  return section?.querySelector('.opcode-script-stack--editable') || null;
}

export function bindOpcodeBadgeUI(root = document) {
  if (!root) return;

  root.querySelectorAll('[data-opcode-palette]').forEach((palette) => {
    palette.querySelectorAll('[draggable="true"]').forEach((el) => {
      if (el.dataset.paletteBound) return;
      el.dataset.paletteBound = '1';

      el.addEventListener('dragstart', (e) => {
        if (el.dataset.dragOp) {
          e.dataTransfer.setData('application/x-opcode', el.dataset.dragOp);
        } else if (el.dataset.dragData) {
          e.dataTransfer.setData('application/x-opcode-data', '1');
        }
        e.dataTransfer.effectAllowed = 'copy';
      });

      el.addEventListener('click', () => {
        const stack = findStackForPalette(palette);
        if (!stack) return;
        if (el.dataset.dragOp) {
          appendStackToken(stack, { type: 'opcode', value: el.dataset.dragOp });
        } else if (el.dataset.dragData) {
          const hex = prompt('Enter hex push data (even length):', 'abcd');
          if (hex && /^[0-9a-fA-F]*$/.test(hex) && hex.length % 2 === 0) {
            appendStackToken(stack, { type: 'data', value: hex.toLowerCase() });
          }
        }
      });
    });
  });

  root.querySelectorAll('.opcode-script-stack--editable').forEach((stack) => {
    bindStack(stack);
  });

  root.querySelectorAll('.opcode-card[data-op]').forEach((card) => {
    if (card.dataset.cardBound) return;
    card.dataset.cardBound = '1';
    card.setAttribute('draggable', 'true');
    card.addEventListener('dragstart', (e) => {
      if (e.target.closest('button')) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData('application/x-opcode', card.dataset.op);
      e.dataTransfer.effectAllowed = 'copy';
    });
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      const stack = document.querySelector('[data-stack-id="playground-asm"]');
      if (!stack) return;
      appendStackToken(stack, { type: 'opcode', value: card.dataset.op });
    });
  });
}

function bindStack(stack) {
  if (stack.dataset.bound) return;
  stack.dataset.bound = '1';

  stack.addEventListener('dragstart', (e) => {
    const badge = e.target.closest('.opcode-badge:not(.opcode-badge--palette)');
    if (!badge || !stack.contains(badge)) return;
    e.dataTransfer.setData('application/x-badge-index', badge.dataset.index);
    e.dataTransfer.effectAllowed = 'move';
    badge.classList.add('opcode-badge--dragging');
  });

  stack.addEventListener('dragend', (e) => {
    e.target.closest('.opcode-badge')?.classList.remove('opcode-badge--dragging');
  });

  stack.addEventListener('dragover', (e) => {
    e.preventDefault();
    const types = [...(e.dataTransfer.types || [])];
    const isCopy = types.includes('application/x-opcode') || types.includes('application/x-opcode-data');
    e.dataTransfer.dropEffect = isCopy ? 'copy' : 'move';
    stack.classList.add('opcode-script-stack--over');
  });

  stack.addEventListener('dragleave', () => {
    stack.classList.remove('opcode-script-stack--over');
  });

  stack.addEventListener('drop', (e) => {
    e.preventDefault();
    stack.classList.remove('opcode-script-stack--over');
    const stackId = stack.dataset.stackId;
    const tokens = getStackTokens(stack);
    const newOp = e.dataTransfer.getData('application/x-opcode');
    const isData = e.dataTransfer.getData('application/x-opcode-data');
    const fromIdx = e.dataTransfer.getData('application/x-badge-index');

    if (newOp) {
      tokens.push({ type: 'opcode', value: newOp });
      applyStackTokens(stack, tokens, stackId);
      return;
    }

    if (isData) {
      const hex = prompt('Enter hex push data (even length):', 'abcd');
      if (hex && /^[0-9a-fA-F]*$/.test(hex) && hex.length % 2 === 0) {
        tokens.push({ type: 'data', value: hex.toLowerCase() });
        applyStackTokens(stack, tokens, stackId);
      }
      return;
    }

    if (fromIdx !== '') {
      const from = parseInt(fromIdx, 10);
      const badge = e.target.closest('.opcode-badge:not(.opcode-badge--palette)');
      let to = tokens.length;
      if (badge && stack.contains(badge)) {
        to = parseInt(badge.dataset.index, 10);
      }
      if (from === to || Number.isNaN(from)) return;
      const [item] = tokens.splice(from, 1);
      const insertAt = from < to ? to - 1 : to;
      tokens.splice(insertAt, 0, item);
      applyStackTokens(stack, tokens, stackId);
    }
  });

  stack.addEventListener('dblclick', (e) => {
    const badge = e.target.closest('.opcode-badge--data:not(.opcode-badge--palette)');
    if (!badge) return;
    const idx = parseInt(badge.dataset.index, 10);
    const tokens = getStackTokens(stack);
    const hex = prompt('Edit hex push data:', tokens[idx]?.value || '');
    if (hex && /^[0-9a-fA-F]*$/.test(hex) && hex.length % 2 === 0) {
      tokens[idx].value = hex.toLowerCase();
      applyStackTokens(stack, tokens, stack.dataset.stackId);
    }
  });
}

function getStackTokens(stack) {
  return [...stack.querySelectorAll('.opcode-badge:not(.opcode-badge--palette)')].map((el) => ({
    type: el.classList.contains('opcode-badge--data') ? 'data' : 'opcode',
    value: el.textContent.trim(),
  }));
}

function applyStackTokens(stack, tokens, stackId) {
  const asm = tokensToAsm(tokens);
  stack.innerHTML = tokens.length
    ? tokens.map((t, i) => renderOpcodeBadge(t, i, true)).join('')
    : '<span class="opcode-drop-hint">Drop OP_CODES here or drag from palette</span>';

  const hidden = document.getElementById(`f-${stackId}`)
    || document.getElementById(stackId)
    || document.getElementById(`code-${stackId}`);
  if (hidden) {
    if (hidden.tagName === 'TEXTAREA' || hidden.tagName === 'INPUT') {
      hidden.value = asm;
    } else {
      hidden.textContent = asm;
    }
  }

  const wrap = stack.closest('[data-asm-wrap]') || stack.closest('.asm-block');
  const codeView = wrap?.querySelector(`[data-code-view="${stackId}"]`) || wrap?.querySelector('.code-view');
  if (codeView) {
    const lines = formatCodeLines(asm, 96);
    const rows = codeView.querySelector('.code-view__rows');
    const meta = codeView.querySelector('.code-view__meta');
    if (rows) {
      rows.innerHTML = lines.map((line, i) => `
        <div class="code-view__row">
          <span class="code-view__ln" aria-hidden="true">${i + 1}</span>
          <code class="code-view__line">${escapeHtml(line) || ' '}</code>
        </div>
      `).join('');
    }
    if (meta) meta.textContent = `${lines.length} line${lines.length === 1 ? '' : 's'}`;
  }

  wrap?.dispatchEvent(new CustomEvent('asm-changed', { bubbles: true, detail: { id: stackId, asm } }));
}

export function asmBlock(asm, id, { editable = false, showPalette = false, title = 'Script ASM' } = {}) {
  const tokens = tokenizeAsm(asm);
  return `
    <div class="asm-block">
      ${renderCodeView(asm, id, { title, wrapAt: 96, className: 'code-view--asm-toolbar' })}
      <div class="asm-block__badges">
        ${renderOpcodeBadgeStack(tokens, { id, editable, showPalette })}
      </div>
    </div>
  `;
}
