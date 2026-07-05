# Sticker Palette Incremental Loading

## Context

The emoji sticker category has 1,849 entries. Rendering all entries at once is too heavy for the mobile path.

## Change

- Sticker palette now renders `100` stickers per page.
- Additional stickers load only when the scroll sentinel becomes visible.
- The page resets to `1` when the search query or category changes.
- Selection index resets when the filtered result changes.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed.
- `npm run build`: passed.
- `npm test -- --runInBand`: no Jest tests exist in this repository, so Jest exits with `No tests found`.

## Device Check Needed

- Open emoji category on mobile.
- Confirm only the first batch renders initially.
- Scroll down and confirm more emoji stickers appear.
