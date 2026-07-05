# Deterministic Mobile Bottom Sheet

## Scope

- Replaced Vaul-backed mobile menu drawer geometry with a deterministic VaultKit bottom sheet.
- Kept the existing `MobileDrawer` API so menu callers continue to work.
- Preserved the existing drawer handle, title, overlay, visual viewport tokens, menu actions, and manual input behavior.

## Root Cause

- Vaul and VaultKit CSS were both controlling the same drawer element geometry.
- Vaul changes visibility in an effect after mount and can also mutate drawer `height`, `bottom`, and `transform` when viewport or input state changes.
- VaultKit custom menus also change rendered content height during mount.
- This creates multiple layout phases during the enter transition, producing the repeated upward-then-downward settling reported on mobile.

## Fix

- `MobileDrawer` no longer imports or renders Vaul.
- The drawer first renders hidden in a measuring phase.
- Before the opening animation starts, it measures the actual content height, clamps it to the visual viewport, and locks that height.
- The opening animation then changes only `transform`, avoiding layout-driven motion.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed
- `npm run build`: passed
- `npm test -- --runInBand`: passed

## Notes

- Device-level drawer motion still needs final confirmation on Obsidian Mobile.
- Existing unrelated workspace changes were left untouched.
