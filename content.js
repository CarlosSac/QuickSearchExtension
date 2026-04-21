(async () => {
    if (document.getElementById("qs-overlay")) {
        document.getElementById("qs-input").focus();
        return;
    }

    // Load settings from storage
    const { enabled } = await chrome.storage.local.get(["enabled"]);
    if (enabled === false) return;

    // --- Site shortcuts (@amazon coffee, @youtube lo-fi, etc.) ---
    const SITE_SHORTCUTS = {
        amazon:    "https://www.amazon.com/s?k={query}",
        youtube:   "https://www.youtube.com/results?search_query={query}",
        reddit:    "https://www.reddit.com/search?q={query}",
        google:    "https://www.google.com/search?q={query}",
        github:    "https://github.com/search?q={query}",
        wikipedia: "https://en.wikipedia.org/w/index.php?search={query}",
        twitter:   "https://twitter.com/search?q={query}",
        x:         "https://x.com/search?q={query}",
        ebay:      "https://www.ebay.com/sch/i.html?_nkw={query}",
        walmart:   "https://www.walmart.com/search?q={query}",
        netflix:   "https://www.netflix.com/search?q={query}",
        maps:      "https://www.google.com/maps/search/{query}",
    };

    // --- Find the site's native search bar ---
    const SEARCH_SELECTORS = [
        'input[type="search"]',
        'input[name="q"]',
        'input[name="s"]',
        'input[name="search"]',
        'input[name="keyword"]',
        'input[name="k"]', // Amazon
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
    const overlay = document.createElement("div");
    overlay.id = "qs-overlay";
    overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 2147483647;
    background: rgba(0,0,0,0.45); display: flex;
    align-items: flex-start; justify-content: center;
    padding-top: 15vh; font-family: system-ui, sans-serif;
  `;

    const box = document.createElement("div");
    box.style.cssText = `
    background: #fff; border-radius: 12px; padding: 16px 20px;
    width: min(560px, 90vw); box-shadow: 0 8px 40px rgba(0,0,0,0.3);
  `;

    const label = document.createElement("div");
    label.textContent = "🔍 Quick Search";
    label.style.cssText =
        "font-size: 12px; color: #888; margin-bottom: 8px; font-weight: 600; letter-spacing: .5px;";

    const input = document.createElement("input");
    input.id = "qs-input";
    input.type = "text";
    input.placeholder = "Type and press Enter…";
    input.style.cssText = `
    width: 100%; box-sizing: border-box; border: 2px solid #0070f3;
    border-radius: 8px; padding: 10px 14px; font-size: 16px; outline: none;
  `;

    const hint = document.createElement("div");
    hint.style.cssText = "font-size: 11px; color: #aaa; margin-top: 8px;";
    hint.textContent = "Enter to search · Esc to close · @site query to search another site";

    const suggestions = document.createElement("div");
    suggestions.style.cssText = `
        display: none; flex-direction: column; margin-top: 6px;
        border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    `;

    box.append(label, input, suggestions, hint);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    input.focus();

    let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyTheme(dark) {
        isDark = dark;
        box.style.background = dark ? '#1e1e1e' : '#fff';
        box.style.boxShadow = dark ? '0 8px 40px rgba(0,0,0,0.6)' : '0 8px 40px rgba(0,0,0,0.3)';
        input.style.background = dark ? '#2a2a2a' : '#fff';
        input.style.color = dark ? '#f0f0f0' : '#111';
        hint.style.color = dark ? '#555' : '#aaa';
        suggestions.style.borderColor = dark ? '#333' : '#e5e5e5';
        suggestions.style.background = dark ? '#1e1e1e' : '#fff';
    }

    applyTheme(isDark);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => applyTheme(e.matches));

    let selectedIndex = -1;

    function getSuggestionItems() {
        return Array.from(suggestions.querySelectorAll("[data-site]"));
    }

    function setSelected(index) {
        const items = getSuggestionItems();
        selectedIndex = Math.max(-1, Math.min(index, items.length - 1));
        items.forEach((el, i) => {
            el.style.background = i === selectedIndex ? (isDark ? '#1a3a5c' : '#f0f7ff') : (isDark ? '#1e1e1e' : '#fff');
            el.style.color = i === selectedIndex ? (isDark ? '#60a5fa' : '#0070f3') : (isDark ? '#f0f0f0' : '#111');
        });
    }

    function selectSuggestion(key) {
        input.value = "@" + key + " ";
        hideSuggestions();
        input.focus();
    }

    function hideSuggestions() {
        suggestions.style.display = "none";
        selectedIndex = -1;
    }

    function showSuggestions(matches) {
        suggestions.innerHTML = "";
        selectedIndex = -1;
        if (matches.length === 0) { hideSuggestions(); return; }
        matches.forEach((key) => {
            const item = document.createElement("div");
            item.dataset.site = key;
            item.textContent = "@" + key;
            item.style.cssText = `padding: 8px 14px; cursor: pointer; font-size: 13px; background: ${isDark ? '#1e1e1e' : '#fff'}; color: ${isDark ? '#f0f0f0' : '#111'};`;
            item.addEventListener("mouseenter", () => setSelected(matches.indexOf(key)));
            item.addEventListener("click", () => selectSuggestion(key));
            suggestions.appendChild(item);
        });
        suggestions.style.display = "flex";
    }

    input.addEventListener("input", () => {
        const val = input.value;
        if (!val.startsWith("@")) { hideSuggestions(); return; }
        const typed = val.slice(1);
        if (typed.length === 0 || typed.includes(" ")) { hideSuggestions(); return; }
        const matches = Object.keys(SITE_SHORTCUTS).filter(k => k.startsWith(typed.toLowerCase()));
        showSuggestions(matches);
    });

    function close() {
        overlay.remove();
    }

    function submit() {
        const query = input.value.trim();
        if (!query) {
            close();
            return;
        }

        const atMatch = query.match(/^@(\S+)\s+([\s\S]+)$/);
        if (atMatch) {
            const template = SITE_SHORTCUTS[atMatch[1].toLowerCase()];
            if (template) {
                close();
                window.open(template.replace("{query}", encodeURIComponent(atMatch[2].trim())), "_blank");
                return;
            }
        }

        const native = findNativeSearch();
        if (native) {
            // Fill & submit the site's own search form
            const nativeInput = native;
            nativeInput.value = query;
            nativeInput.dispatchEvent(new Event("input", { bubbles: true }));
            nativeInput.dispatchEvent(new Event("change", { bubbles: true }));

            const form = nativeInput.closest("form");
            if (form) {
                close();
                form.submit();
            } else {
                nativeInput.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        key: "Enter",
                        keyCode: 13,
                        bubbles: true,
                    }),
                );
                nativeInput.dispatchEvent(
                    new KeyboardEvent("keypress", {
                        key: "Enter",
                        keyCode: 13,
                        bubbles: true,
                    }),
                );
                close();
            }
        } else {
            // Fallback: Google search
            close();
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}+site:${location.hostname}`;
        }
    }

    input.addEventListener("keydown", (e) => {
        const items = getSuggestionItems();
        const open = suggestions.style.display !== "none" && items.length > 0;

        if (open && e.key === "ArrowDown") {
            e.preventDefault();
            setSelected(selectedIndex + 1);
            return;
        }
        if (open && e.key === "ArrowUp") {
            e.preventDefault();
            setSelected(selectedIndex - 1);
            return;
        }
        if (open && e.key === "Tab") {
            e.preventDefault();
            selectSuggestion(items[selectedIndex >= 0 ? selectedIndex : 0].dataset.site);
            return;
        }
        if (open && e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault();
            selectSuggestion(items[selectedIndex].dataset.site);
            return;
        }

        if (e.key === "Enter") submit();
        if (e.key === "Escape") close();
        e.stopPropagation();
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });
})();
