# Native Sticker Drawer Navigation, Search, and Emoji Spacing

## Change

- Sticker category drawers now include a native `Back` row.
- Sticker category drawers now include a native `Find Sticker` row that opens the sticker search palette with the current category preselected.
- Emoji category drawers use Obsidian `Menu.setNoIcon()` so emoji title previews start farther left.
- Native paged loading and auto-load-more behavior remain in place.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed.
- `npm run build`: passed.
- `npm test -- --runInBand`: no Jest tests exist in this repository, so Jest exits with `No tests found`.

## Device Check Needed

- Open an emoji sticker category and confirm preview text starts farther left.
- Tap `Find Sticker` and confirm category-specific search opens.
- Tap `Back` and confirm the root sticker category drawer returns.
