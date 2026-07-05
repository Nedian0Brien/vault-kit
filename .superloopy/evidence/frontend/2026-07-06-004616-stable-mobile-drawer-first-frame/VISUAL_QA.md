# Stable Mobile Drawer First Frame

## Scope

- Stabilized all custom make.md mobile bottom drawers by giving `MobileDrawer` measured visual viewport CSS variables before the first drawer paint.
- Kept the existing Vaul bottom drawer interaction and Make menu feature surface intact.
- Updated the shared drawer height cap so generic custom drawers and modal drawers use the same visual viewport constraint.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed
- `npm run build`: passed
- `npm test -- --runInBand`: passed

## Notes

- Device-level drawer motion still needs final confirmation on Obsidian Mobile because the original defect depends on native mobile viewport timing.
- Existing unrelated workspace changes were left untouched.
