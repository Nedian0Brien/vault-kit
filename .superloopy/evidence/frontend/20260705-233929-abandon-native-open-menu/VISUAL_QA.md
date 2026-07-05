# Abandon Native Navigator Open Menu Evidence

## Scope

- Surface: mobile Navigator `Open`.
- Decision: abandon the native Obsidian menu conversion for this flow after repeated placement failures.
- Result: Navigator `Open` uses the existing `BlinkMode.Open` quickOpen palette again.

## Changes

- Removed `showNativeSpacesMenu`.
- Removed `floatingSearch` from `SelectMenuProps`.
- Removed the floating search DOM/CSS from the native Obsidian menu bridge.
- Updated regression checks so Navigator `Open` is expected to use `BlinkMode.Open`.

## Static Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: pass.
- `npm run build`: pass before version bump.
- `git diff --check`: pass.
- `npm test -- --runInBand`: no Jest test files in this repo, exits with Jest's "No tests found" code 1.

## Manual QA Needed

- Install the next release on mobile.
- Tap Navigator `Open`.
- Confirm the old searchable Blink palette opens instead of the native menu drawer.
