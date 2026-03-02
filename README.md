
![Quick Search icon](icons/icon128.png)

# Quick Search

Search any website instantly without looking for the search bar.

Press **Alt+S** anywhere to open a quick search overlay, type your query, and hit Enter. Quick Search automatically finds and uses the site's own search functionality. No setup required.

## How It Works

1. Press **Alt+S** on any webpage
2. A clean search overlay appears at the top of the page
3. Type your query and press **Enter**
4. Quick Search locates the site's native search bar and submits your query through it

If no search bar is found on the page, it falls back to a Google `site:` search scoped to the current domain.

## Features

**Universal shortcut**:Alt+S works on any website

**Native search detection**:automatically finds search inputs by type, name, id, class, placeholder, and aria-label attributes

**Google fallback**:when no native search bar exists, performs a `site:` scoped Google search

**Site overrides**:preconfigured URL templates for sites like Gmail that need special handling

**Enable/disable toggle**:click the extension icon to turn Quick Search on or off

**Lightweight**:no dependencies, no background network requests, minimal permissions

## Installation

1. Clone or download this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the project folder

## Permissions

**activeTab**:to inject the search overlay into the current page

**scripting**:to execute the content script on demand

**storage**:to persist the enable/disable toggle and site overrides

## License

MIT
