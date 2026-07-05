# Native Emoji Sticker Preview

## Change

- Emoji sticker rows in the native mobile drawer now show the native emoji character before the sticker name.
- Emoji previews stay out of the native icon slot, so the drawer does not use `addIcon()` for emoji.
- The native drawer paged loading path remains intact.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed.
- `npm run build`: passed.
- `npm test -- --runInBand`: no Jest tests exist in this repository, so Jest exits with `No tests found`.

## Device Check Needed

- Open the emoji sticker category on mobile.
- Confirm rows show an emoji preview before each name.
- Scroll near the bottom and confirm additional native drawer batches load.
