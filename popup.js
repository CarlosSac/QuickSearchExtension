const toggleEl = document.getElementById("enabled-toggle");
const toggleLabel = document.getElementById("toggle-label");

// Load initial state
chrome.storage.local.get(["enabled"], (data) => {
    const isEnabled = data.enabled !== false;
    toggleEl.checked = isEnabled;
    toggleLabel.textContent = isEnabled ? "ON" : "OFF";
});

// Toggle
toggleEl.addEventListener("change", () => {
    const isEnabled = toggleEl.checked;
    toggleLabel.textContent = isEnabled ? "ON" : "OFF";
    chrome.storage.local.set({ enabled: isEnabled });
});
