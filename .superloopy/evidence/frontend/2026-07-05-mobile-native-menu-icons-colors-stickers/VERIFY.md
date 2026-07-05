# Mobile Native Menu Icons, Colors, And Stickers

## Scope

- Native mobile select menus map common `ui//...` Make icons to Obsidian/lucide icon names before calling `MenuItem.setIcon()`.
- Mobile color picker submenus use Obsidian native `Menu` options backed by `getColorPalettes(superstate)`.
- Mobile sticker picker entrypoints use an Obsidian native menu with a search-picker entry plus native category submenus.
- Desktop and non-phone flows keep the existing picker behavior.

## Evidence

- `node scripts/check-keyboard-safe-drawer.mjs`: passed.
- `npm run build`: passed.
- `npm test -- --runInBand`: no test files are present in this repository, so Jest exited with `No tests found`.

## QA Note

The local environment cannot launch Obsidian mobile directly. Device validation should confirm that file and space context menu icons render, color selection opens as a native menu, and sticker selection opens a native category menu while preserving the full search picker through the first native menu item.
