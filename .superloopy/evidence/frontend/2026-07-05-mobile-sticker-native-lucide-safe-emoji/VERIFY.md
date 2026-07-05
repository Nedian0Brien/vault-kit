# Mobile Sticker Native Lucide / Safe Emoji Fix

## Root Cause

- The previous mobile sticker preview path registered generated SVGs through Obsidian `addIcon()`.
- On Obsidian mobile native drawers, those registered SVG previews rendered as tiny glyph fragments instead of normal row icons.
- Emoji stickers still touched the preview path visually through row-title prefixing, so the safer native path is to keep emoji out of the native icon slot entirely.

## Change

- Lucide stickers now pass `lucide//<name>` to the native menu so Obsidian renders its own built-in icon at normal native size.
- Emoji and custom sticker rows do not register or render native preview icons in the drawer; they show the sticker name only.
- Removed the dynamic sticker SVG registration path from the mobile native sticker category menu.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed.
- `npm run build`: passed.
- `npm test -- --runInBand`: no Jest tests exist in this repository, so Jest exits with `No tests found`.

## Device Check Needed

- Open lucide sticker category on mobile: icons should render at normal Obsidian native menu size.
- Open emoji sticker category on mobile: drawer should not crash.
