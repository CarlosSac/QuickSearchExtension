(() => {
  // Don't inject twice
  if (document.getElementById('qs-overlay')) {
    document.getElementById('qs-input').focus();
    return;
  }

  // --- Find the site's native search bar ---
  const SEARCH_SELECTORS = [
    'input[type="search"]',
    'input[name="q"]',
    'input[name="s"]',
    'input[name="search"]',
    'input[name="keyword"]',
    'input[name="k"]',        // Amazon
    'input[id*="search"]',
    'input[class*="search"]',
    'input[placeholder*="earch"]',
    'input[aria-label*="earch"]',
  ];

  function findNativeSearch() {
    for (const sel of SEARCH_SELECTORS) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  // --- Build overlay UI ---
  const overlay = document.createElement('div');
  overlay.id = 'qs-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 2147483647;
    background: rgba(0,0,0,0.45); display: flex;
    align-items: flex-start; justify-content: center;
    padding-top: 15vh; font-family: system-ui, sans-serif;
  `;

  const box = document.createElement('div');
  box.style.cssText = `
    background: #fff; border-radius: 12px; padding: 16px 20px;
    width: min(560px, 90vw); box-shadow: 0 8px 40px rgba(0,0,0,0.3);
  `;

  const label = document.createElement('div');
  label.textContent = '🔍 Quick Search';
  label.style.cssText = 'font-size: 12px; color: #888; margin-bottom: 8px; font-weight: 600; letter-spacing: .5px;';

  const input = document.createElement('input');
  input.id = 'qs-input';
  input.type = 'text';
  input.placeholder = 'Type and press Enter…';
  input.style.cssText = `
    width: 100%; box-sizing: border-box; border: 2px solid #0070f3;
    border-radius: 8px; padding: 10px 14px; font-size: 16px; outline: none;
  `;

  const hint = document.createElement('div');
  hint.style.cssText = 'font-size: 11px; color: #aaa; margin-top: 8px;';
  hint.textContent = 'Enter to search · Esc to close';

  box.append(label, input, hint);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  input.focus();

  function close() { overlay.remove(); }

  function submit() {
    const query = input.value.trim();
    if (!query) { close(); return; }

    const native = findNativeSearch();
    if (native) {
      // Fill & submit the site's own search form
      const nativeInput = native;
      nativeInput.value = query;
      nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
      nativeInput.dispatchEvent(new Event('change', { bubbles: true }));

      const form = nativeInput.closest('form');
      if (form) {
        close();
        form.submit();
      } else {
        nativeInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
        nativeInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', keyCode: 13, bubbles: true }));
        close();
      }
    } else {
      // Fallback: Google search
      close();
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}+site:${location.hostname}`;
    }
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') close();
    e.stopPropagation();
  });

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
})();
