/** Dogecoin amount: up to 8 decimal places */
export const DOGE_AMOUNT_RE = /^\d+(\.\d{1,8})?$/;

export function isValidDogeAmount(value) {
  const s = String(value ?? '').trim();
  return s.length > 0 && DOGE_AMOUNT_RE.test(s) && parseFloat(s) > 0;
}

export function parseDogeAmount(value, label = 'DOGE amount') {
  const s = String(value ?? '').trim();
  if (!DOGE_AMOUNT_RE.test(s)) {
    throw new Error(`${label}: use numbers only, up to 8 decimals (e.g. 1.00 or 20000.12345678)`);
  }
  if (parseFloat(s) <= 0) throw new Error(`${label} must be greater than zero`);
  return s;
}

export function dogeInputAttrs({ id, name, value = '', placeholder = '0.00', required = false, extra = '' } = {}) {
  const req = required ? 'required' : '';
  const val = value ? `value="${String(value).replace(/"/g, '&quot;')}"` : '';
  return `<input type="text" inputmode="decimal" class="input-doge" id="${id}" name="${name}" ${val} placeholder="${placeholder}" autocomplete="off" pattern="[0-9]+(\\.[0-9]{1,8})?" title="Numbers only, up to 8 decimal places" ${req} ${extra}>`;
}

export function bindDogeInputs(root = document) {
  if (!root) return;
  root.querySelectorAll('.input-doge').forEach((el) => {
    if (el.dataset.dogeBound) return;
    el.dataset.dogeBound = '1';
    el.addEventListener('input', () => {
      let v = el.value.replace(/[^0-9.]/g, '');
      const dot = v.indexOf('.');
      if (dot !== -1) {
        v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, '');
        const frac = v.slice(dot + 1);
        if (frac.length > 8) v = v.slice(0, dot + 1 + 8);
      }
      el.value = v;
    });
  });
}
