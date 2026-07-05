# Native Submenu Restore Verification

## Scope

- Restore mobile native submenu handoff to the synchronous v1.3.24 behavior.
- Keep `Menu.setNoIcon()` removed from the native sticker drawer path.
- Remove the deferred submenu handoff state that caused the parent menu to close without opening the child menu.

## Reference

- `v1.3.24` was the user-confirmed working version for emoji/lucide sticker category opening.
- `v1.3.25` introduced the `noIcon`/`Menu.setNoIcon()` path that correlated with the first mobile sticker drawer opening regression.

## Checks

- `node scripts/check-keyboard-safe-drawer.mjs`: pass
- `npm run build`: pass
- `npm test -- --runInBand`: no Jest test files found in this repository
