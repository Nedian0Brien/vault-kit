# Native Sticker Drawer Paged Loading

## Context

The requirement is to keep the Obsidian native mobile drawer for sticker categories while avoiding loading all emoji stickers at once.

Obsidian's public `Menu.addItem()` contract says items can only be added before the menu is shown. Because of that, the implementation avoids unsupported append-after-show behavior.

## Change

- Sticker category drawers render the first `100` entries.
- A native `Load More` row is appended when more stickers are available.
- The `Load More` row is marked with `autoLoadMore`.
- The native menu attaches a scroll listener after `showAtPosition()`.
- When the user scrolls within `96px` of the bottom, the `Load More` action triggers automatically and opens the next native drawer batch.
- The `Load More` row remains tappable as a fallback if a mobile WebView does not expose a usable scroll target.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed.
- `npm run build`: passed.
- `npm test -- --runInBand`: no Jest tests exist in this repository, so Jest exits with `No tests found`.

## Device Check Needed

- Open the emoji sticker category on mobile.
- Confirm the native drawer opens with the first batch.
- Scroll near the bottom and confirm the next batch appears through the native drawer path.
