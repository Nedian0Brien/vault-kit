# Native Submenu Handoff Flag Verification

## Scope

- Keep `isOpeningSubmenu` true until the deferred child menu is opened and stored.
- Prevent parent `onHide` from closing the child menu during `showAtPosition`.

## Root Cause

The previous deferred-open patch lowered `isOpeningSubmenu` at the start of the timeout callback. If the parent hide event fired while the child menu was being opened, the parent cleanup path could still run and close the new child menu.

## Checks

- `node scripts/check-keyboard-safe-drawer.mjs`: pass
- `npm run build`: pass
- `npm test -- --runInBand`: no Jest test files found in this repository
