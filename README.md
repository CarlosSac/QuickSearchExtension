<div align="center">

![Quick Search icon](icons/icon128.png)

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Install-4285F4?logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/quick-search/lloohfpnnajcghiioiajbeimomlhfphg)

</div>

# Quick Search

Quick Search allows you to search any website instantly without needing to locate its specific search bar. 

Pressing **Alt+S** on any page opens a streamlined search overlay. Simply type your query and press Enter. The extension automatically identifies and utilizes the site's native search functionality, without any initial configuration.

## How It Works

1. Press **Alt+S** while browsing any webpage.
2. A clean search overlay will appear at the top of your screen.
3. Enter your search query and press **Enter**.
4. The extension locates the website's native search input and automatically submits your query.

If a native search bar is not detected on the page, the extension reliably falls back to a Google `site:` search scoped specifically to the current domain.

## Features

* **Universal Shortcut**: The Alt+S command functions seamlessly across all websites.
* **Native Search Detection**: The extension automatically identifies search inputs using specific attributes, including type, name, id, class, placeholder, and aria-label.
* **Google Fallback**: In cases where a native search bar is absent, it automatically performs a domain-scoped Google `site:` search.
* **Site Overrides**: (Working on it)
* **Enable/Disable Toggle**: You can easily activate or deactivate the extension using the icon in your browser toolbar.
* **Lightweight Architecture**: The extension operates with minimal permissions, requires no background network requests, and relies on zero external dependencies.

## Installation

**Chrome Web Store** (recommended): [Install Quick Search](https://chromewebstore.google.com/detail/quick-search/lloohfpnnajcghiioiajbeimomlhfphg)

**Manual Install**:
1. Clone or download this repository.
2. Navigate to `chrome://extensions` in your Chrome browser.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the designated project folder.

## Permissions

* **activeTab**: Required to inject the search overlay into the current webpage.
* **scripting**: Necessary to execute the content script when the extension is triggered.
* **storage**: Used to persist your enable/disable preferences and site overrides.

## License

MIT
