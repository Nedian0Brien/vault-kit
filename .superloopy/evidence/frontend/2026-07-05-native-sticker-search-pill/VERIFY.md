# Native Sticker Search Pill Verification

## Scope

- Mobile sticker picker no longer opens the existing `StickerModal` palette for native sticker search.
- Native Obsidian `Menu` renders a search input row inside sticker search/category drawers.
- Sticker filtering uses the existing `Sticker` fields: `name`, `value`, and `keywords`.
- Emoji/category drawers no longer request Obsidian `Menu.setNoIcon()`.

## Checks

- `node scripts/check-keyboard-safe-drawer.mjs`: pass
- `npm run build`: pass
- `npm test -- --runInBand`: no Jest test files found in this repository

## Anti-Slop Pre-Flight

- No new palette, font, shell, or decorative layout was introduced.
- New CSS uses existing VaultKit/Obsidian variables: `--mk-ui-border`, `--mk-ui-background-contrast`, `--text-normal`, and `--interactive-accent`.
- The change is limited to the native mobile menu search control and sticker menu routing.
