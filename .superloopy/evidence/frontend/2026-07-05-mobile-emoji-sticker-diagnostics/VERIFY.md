# Mobile Emoji Sticker Diagnostics

## Purpose

The emoji sticker category still crashes on mobile after removing preview icons. This patch adds diagnostic logging to locate the crash boundary.

## Instrumentation

- `src/core/react/components/UI/Menus/properties/stickerPickerMenu.tsx`
  - Logs root sticker category counts.
  - Logs submenu click category and offset.
  - Logs category option-build start, total sticker count, category count, and a small sample.
  - Logs before and after `superstate.ui.openMenu()`.
  - Logs any synchronous `openMenu()` error.

- `src/core/react/components/UI/Menus/nativeObsidianMenu.ts`
  - Logs native menu show start with option count and sample.
  - Logs progress while adding large option lists.
  - Logs before and after `menu.showAtPosition()`.
  - Logs submenu clicks.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed.
- `npm run build`: passed.
- `npm test -- --runInBand`: no Jest tests exist in this repository, so Jest exits with `No tests found`.

## Log Tags

- `[VaultKit][sticker-picker]`
- `[VaultKit][native-menu]`
