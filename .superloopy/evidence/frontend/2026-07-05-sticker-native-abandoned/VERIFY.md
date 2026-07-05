# Sticker Native Menu Abandoned Verification

## Scope

- `showStickerPickerMenu` now always opens `StickerModal` through `openStickerPalette`.
- Mobile sticker category native `Menu` code was removed.
- The regression checker now rejects sticker native submenu wiring.

## Rationale

Mobile Obsidian native `Menu` proved unstable for the sticker picker flow, especially with emoji/lucide category submenus and embedded search attempts. The stable path is to keep stickers on the existing palette until a separate non-native mobile sticker surface is designed.

## Checks

- `node scripts/check-keyboard-safe-drawer.mjs`: pass
- `npm run build`: pass
- `npm test -- --runInBand`: no Jest test files found in this repository
