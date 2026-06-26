function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatCodeLines(text, wrapAt = 80) {
  const s = String(text ?? '').replace(/\r\n/g, '\n');
  if (!s) return [''];
  if (s.includes('\n')) {
    return s.split('\n');
  }
  if (s.length <= wrapAt) return [s];
  const lines = [];
  for (let i = 0; i < s.length; i += wrapAt) {
    lines.push(s.slice(i, i + wrapAt));
  }
  return lines;
}

export function renderCodeView(text, id, { title = 'Output', wrapAt = 80, className = '' } = {}) {
  const lines = formatCodeLines(text, wrapAt);
  const raw = lines.join('\n');
  const rows = lines.map((line, i) => `
    <div class="code-view__row">
      <span class="code-view__ln" aria-hidden="true">${i + 1}</span>
      <code class="code-view__line">${escapeHtml(line) || ' '}</code>
    </div>
  `).join('');

  return `
    <div class="code-view ${className}" data-code-view="${id}">
      <div class="code-view__header">
        <span class="code-view__title">${escapeHtml(title)}</span>
        <span class="code-view__meta">${lines.length} line${lines.length === 1 ? '' : 's'}</span>
        <button type="button" class="code-view__copy" data-copy-id="${id}" title="Copy to clipboard">
          <span class="material-icons">content_copy</span>
          <span class="code-view__copy-label">Copy</span>
        </button>
      </div>
      <div class="code-view__body">
        <div class="code-view__rows">${rows}</div>
      </div>
      <textarea id="code-${id}" class="code-view__source" hidden readonly>${escapeHtml(raw)}</textarea>
    </div>
  `;
}

export function bindCodeViews(root = document, onCopy) {
  if (!root) return;
  root.querySelectorAll('[data-copy-id]').forEach((btn) => {
    if (btn.dataset.copyBound) return;
    btn.dataset.copyBound = '1';
    btn.addEventListener('click', async () => {
      const id = btn.dataset.copyId;
      const source = document.getElementById(`code-${id}`);
      const text = source?.value ?? source?.textContent ?? '';
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      const label = btn.querySelector('.code-view__copy-label');
      const icon = btn.querySelector('.material-icons');
      if (label) label.textContent = 'Copied!';
      if (icon) icon.textContent = 'check';
      btn.classList.add('code-view__copy--done');
      onCopy?.(text);
      setTimeout(() => {
        if (label) label.textContent = 'Copy';
        if (icon) icon.textContent = 'content_copy';
        btn.classList.remove('code-view__copy--done');
      }, 2000);
    });
  });

  root.querySelectorAll('[data-copy-target]').forEach((btn) => {
    if (btn.dataset.copyBound) return;
    btn.dataset.copyBound = '1';
    btn.addEventListener('click', () => {
      const text = document.getElementById(btn.dataset.copyTarget)?.textContent;
      if (text) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    });
  });
}
