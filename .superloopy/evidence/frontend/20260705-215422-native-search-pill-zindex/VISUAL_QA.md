# Native Search Pill Z-Index Evidence

## Scope

- Surface: mobile Navigator Open native Obsidian menu.
- Reported symptom: the native menu appears, but the floating search pill is not visible.
- Root cause: the pill is appended to `document.body`, while its CSS z-index used `var(--drawer-index)` without a fallback. `--drawer-index` is set on drawer content/overlay, not on body-level children, so the pill z-index could become invalid and render behind the drawer.

## Fix

- Added `var(--drawer-index, 0)` fallback to `.vaultkit-native-search-pill`.
- Added runtime z-index correction from `menu.dom` computed z-index: `menuZIndex + 2`.
- Added a native-menu log when the floating search attaches, including resolved z-index and query value length.

## Static Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: pass.
- `npm run build`: pass on `1.3.33`.
- `git diff --check`: pass.
- `npm test -- --runInBand`: no Jest test files in this repo, exits with Jest's "No tests found" code 1.

## Manual QA Needed

- Install `v1.3.33` on mobile.
- Open Navigator `Open`.
- Confirm the search pill is visible above the native menu.
- If still hidden, check mobile console for `[VaultKit][native-menu] show:floating-search:attached`.
