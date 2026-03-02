chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(["enabled"], (data) => {
        if (data.enabled === undefined) chrome.storage.local.set({ enabled: true });
    });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-search") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab?.url || !/^https?:\/\//.test(tab.url)) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      }).catch(() => {});
    });
  }
});
