# Mobile Sticker Preview Crash Fix

## Scope

- Emoji stickers no longer register dynamic Obsidian icons through `addIcon()`.
- Emoji stickers are shown as a prefix in the native menu row title to avoid the mobile crash path.
- SVG stickers, including lucide stickers, are scaled to fill more of the 24x24 native icon slot.

## Evidence

- `npm run build`: passed.
- `node scripts/check-keyboard-safe-drawer.mjs`: passed.
- `npm test -- --runInBand`: no test files are present in this repository, so Jest exited with `No tests found`.

## QA Note

Device validation should confirm that opening emoji sticker categories no longer crashes and lucide sticker previews are visibly larger.
