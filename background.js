chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(["enabled", "siteOverrides"], (data) => {
        const updates = {};
        if (data.enabled === undefined) updates.enabled = true;
        if (!data.siteOverrides) updates.siteOverrides = [
            {
                hostname: "mail.google.com",
                urlTemplate: "https://mail.google.com/mail/u/0/#search/{query}",
            },
        ];
        if (Object.keys(updates).length) chrome.storage.local.set(updates);
    });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-search") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
    });
  }
});
