# Native Sticker Baseline Restore Verification

## Scope

- Restore mobile sticker category drawers to the v1.3.24 option shape: sticker rows plus load-more only.
- Remove `nativeSearch` from `SelectOption` and the Obsidian native menu renderer.
- Remove the native search input CSS because embedding inputs in Obsidian `Menu` is not part of the working v1.3.24 baseline.
- Keep `Menu.setNoIcon()` and `noIcon` absent.

## Root Cause Update

After removing `setNoIcon` and deferred submenu handoff, the drawer still failed to open. The remaining blocker was the native search input row introduced after v1.3.25. It used a `DocumentFragment`/`input` inside Obsidian `MenuItem.setTitle`, which is outside the v1.3.24 working option shape and can break mobile native menu presentation.

## Checks

- `node scripts/check-keyboard-safe-drawer.mjs`: pass
- `npm run build`: pass
- `npm test -- --runInBand`: no Jest test files found in this repository
