# Table Property Drawer Fit Content

## Scope

- Stabilized table property and new property mobile drawers that render custom menu content inside `MobileDrawer`.
- Scoped the layout fix to menu containers inside `.mk-drawer-content`, leaving desktop menu sizing untouched.
- Preserved the existing Vaul bottom drawer behavior and existing menu actions.

## Root Cause

- Table property drawers use `showPropertyMenu` and `showNewPropertyMenu`.
- `showNewPropertyMenu` renders a custom `.mk-menu-container` directly inside the mobile drawer.
- The shared `.mk-menu-container` rule set `height: 100%` and `flex-wrap: wrap`; inside a bottom drawer this can make the first frame size to the drawer parent rather than the actual content, then settle downward after layout.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed
- `npm run build`: passed
- `npm test -- --runInBand`: passed

## Notes

- Device-level drawer motion still needs final confirmation on Obsidian Mobile because the original defect depends on native mobile viewport and Vaul timing.
- Existing unrelated workspace changes were left untouched.
