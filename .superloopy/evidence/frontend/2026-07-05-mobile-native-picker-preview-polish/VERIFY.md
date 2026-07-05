# Mobile Native Picker Preview Polish

## Scope

- Removed the border stroke from circular color swatch icons in native mobile color menus.
- Enlarged sticker text previews from 14px to 20px.
- Normalized SVG sticker previews to 24x24 before registering them with Obsidian `addIcon()`.

## Evidence

- `node scripts/check-keyboard-safe-drawer.mjs`: passed.
- `npm run build`: passed.
- `npm test -- --runInBand`: no test files are present in this repository, so Jest exited with `No tests found`.

## QA Note

Device validation should confirm that color swatches appear as clean filled circles and sticker previews are legible in the native mobile menu icon slot.
