# Mobile Emoji Sticker Palette Fallback

## Root Cause Hypothesis

- The emoji sticker set contains 1,849 entries.
- The mobile native drawer path tried to create a native Obsidian menu item for every emoji entry.
- No diagnostic logs appeared on-device, which is consistent with the app crashing inside or before the native drawer rendering boundary.

## Change

- Emoji sticker category now bypasses the native Obsidian drawer.
- It opens the existing sticker palette with `initialCategory="emoji"` instead.
- StickerModal accepts `initialCategory` to preselect the requested category.
- Diagnostic logging now uses `console.log` instead of `console.info`.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed.
- `npm run build`: passed.
- `npm test -- --runInBand`: no Jest tests exist in this repository, so Jest exits with `No tests found`.

## Device Check Needed

- Open sticker menu on mobile.
- Tap the `emoji` category.
- Expected: no crash; sticker palette opens with emoji selected.
