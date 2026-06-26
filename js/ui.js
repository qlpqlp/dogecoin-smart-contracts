export function initConnectionBar() {
  const bar = document.getElementById('connection-bar');
  if (!bar) return;

  const render = () => {
    const online = navigator.onLine;
    const safe = !online;
    bar.className = `connection-bar ${safe ? 'connection-bar--safe' : 'connection-bar--online'}`;
    bar.innerHTML = safe
      ? `<span class="material-icons">wifi_off</span>
         <span><strong>Offline</strong>: safer for private keys and signing</span>`
      : `<span class="material-icons">wifi</span>
         <span><strong>Online</strong>: disconnect Wi-Fi before entering private keys if you want air-gapped signing</span>`;
    document.body.classList.toggle('network-offline', safe);
    document.body.classList.toggle('network-online', online);
    if (typeof window.__updateSignSecurityBanner === 'function') {
      window.__updateSignSecurityBanner();
    }
  };

  window.addEventListener('online', render);
  window.addEventListener('offline', render);
  render();
}

export function renderModernSelect({ id, label, options, value, required = false, className = '' }) {
  const opts = options?.length ? options : [{ value: '', label: 'No options' }];
  const current = opts.find((o) => o.value === value) || opts[0];
  const selectedValue = opts.some((o) => o.value === value) ? value : opts[0].value;
  return `
    <div class="field ${className}">
      ${label ? `<label for="${id}">${label}</label>` : ''}
      <div class="select-modern" data-modern-select="${id}">
        <button type="button" class="select-modern__trigger" aria-haspopup="listbox" aria-expanded="false">
          ${current?.icon ? `<span class="material-icons select-modern__icon">${current.icon}</span>` : ''}
          <span class="select-modern__label">${current?.label ?? 'Select'}</span>
          <span class="material-icons select-modern__arrow">expand_more</span>
        </button>
        <ul class="select-modern__menu" role="listbox" hidden>
          ${opts.map((o) => `
            <li role="option" data-value="${o.value}" class="${o.value === selectedValue ? 'selected' : ''}" aria-selected="${o.value === selectedValue}">
              ${o.icon ? `<span class="material-icons">${o.icon}</span>` : ''}
              <span>${o.label}</span>
            </li>
          `).join('')}
        </ul>
        <select id="${id}" name="${id}" class="select-native-sr" ${required ? 'required' : ''} tabindex="-1" aria-hidden="true">
          ${opts.map((o) => `<option value="${o.value}" ${o.value === selectedValue ? 'selected' : ''}>${o.label}</option>`).join('')}
        </select>
      </div>
    </div>
  `;
}

import { NETWORK_OPTIONS, getNetwork } from './networks.js';

export { NETWORK_OPTIONS } from './networks.js';

export function renderNetworkPicker(value) {
  const current = getNetwork(value);
  return `
    <div class="network-picker select-modern-wrap" data-modern-select="network-select">
      <button type="button" class="select-modern__trigger select-modern__trigger--compact" aria-haspopup="listbox">
        <span class="material-icons select-modern__icon">hub</span>
        <span class="select-modern__label">${current.shortLabel}</span>
        <span class="material-icons select-modern__arrow">expand_more</span>
      </button>
      <ul class="select-modern__menu select-modern__menu--right" role="listbox" hidden>
        ${NETWORK_OPTIONS.map((o) => `
          <li role="option" data-value="${o.value}" class="${o.value === value ? 'selected' : ''}">
            <span class="material-icons">${o.icon}</span>
            <span>${o.label}</span>
          </li>
        `).join('')}
      </ul>
      <select id="network-select" class="select-native-sr" tabindex="-1" aria-hidden="true">
        ${NETWORK_OPTIONS.map((o) => `<option value="${o.value}" ${o.value === value ? 'selected' : ''}>${o.label}</option>`).join('')}
      </select>
    </div>
  `;
}

export function bindModernSelects(root = document, onChange) {
  if (!root) return;
  root.querySelectorAll('[data-modern-select]').forEach((wrap) => {
    if (wrap.dataset.selectBound) return;
    wrap.dataset.selectBound = '1';

    const selectId = wrap.dataset.modernSelect;
    const native = wrap.querySelector(`#${selectId}`) || wrap.querySelector('select');
    const trigger = wrap.querySelector('.select-modern__trigger');
    const menu = wrap.querySelector('.select-modern__menu');
    const labelEl = wrap.querySelector('.select-modern__label');

    const closeAll = () => {
      document.querySelectorAll('.select-modern__menu').forEach((m) => {
        m.hidden = true;
      });
      document.querySelectorAll('.select-modern__trigger').forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
      });
    };

    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = menu?.hidden !== false;
      closeAll();
      if (open && menu) {
        menu.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    menu?.querySelectorAll('[data-value]').forEach((item) => {
      item.addEventListener('click', () => {
        const val = item.dataset.value;
        if (native) native.value = val;
        menu.querySelectorAll('[data-value]').forEach((li) => li.classList.toggle('selected', li.dataset.value === val));
        const opt = native?.querySelector(`option[value="${val}"]`);
        if (labelEl && opt) labelEl.textContent = opt.textContent;
        closeAll();
        native?.dispatchEvent(new Event('change', { bubbles: true }));
        onChange?.(selectId, val, native);
      });
    });
  });

  if (!document.body.dataset.selectCloseBound) {
    document.body.dataset.selectCloseBound = '1';
    document.addEventListener('click', () => {
      document.querySelectorAll('.select-modern__menu').forEach((m) => { m.hidden = true; });
    });
  }
}

export function renderSignSecurityBanner() {
  const safe = !navigator.onLine;
  return `
    <div class="sign-security-banner ${safe ? 'sign-security-banner--safe' : 'sign-security-banner--warn'}">
      <span class="material-icons">${safe ? 'shield' : 'warning'}</span>
      <div>
        <strong>${safe ? 'Offline mode: good for signing' : 'Security: private keys stay in your browser only'}</strong>
        <p>For maximum safety before entering a WIF: disconnect from the internet (Wi‑Fi off or unplug ethernet), then sign. Copy the raw hex and broadcast later from another device.</p>
      </div>
    </div>
  `;
}
