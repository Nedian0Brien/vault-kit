# Native Search Pill Above Drawer Evidence

## Scope

- Surface: mobile Navigator Open native Obsidian menu.
- Reported symptom: the search pill is visible, but appears near the bottom of the drawer instead of above it.
- Root cause: the floating pill used `menu.dom.getBoundingClientRect()` as its anchor. On Obsidian mobile, that rect can represent the menu content area rather than the enclosing bottom drawer, so the computed top can land near the lower part of the drawer.

## Fix

- Resolve a stronger anchor with `getFloatingSearchAnchor()`:
  - `[vaul-drawer]`
  - `[data-vaul-drawer]`
  - `.modal`
  - fallback to `menu.dom`
- Position the pill at `anchorRect.top - pillHeight - gap`.
- Keep the z-index correction from the resolved anchor.
- Log the resolved anchor tag/class for mobile debugging.

## Static Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: pass.
- `npm run build`: pass on `1.3.33` before version bump.
- `git diff --check`: pass.
- `npm test -- --runInBand`: no Jest test files in this repo, exits with Jest's "No tests found" code 1.

## Manual QA Needed

- Install the next release on mobile.
- Open Navigator `Open`.
- Confirm the search pill appears above the bottom drawer, not at the drawer bottom.
- If placement is still wrong, check `[VaultKit][native-menu] show:floating-search:attached` for `anchor` and `anchorClass`.
