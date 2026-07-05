# Phone Drawer Menu Height Cascade

## Scope

- Fixed the mobile table property drawer state shown in the supplied screenshot, where the drawer temporarily occupies the full phone height and places menu items at the top of the screen.
- Scoped the fix to phone `mk-drawer-menu` instances.
- Preserved existing menu actions and manual input behavior.

## Root Cause

- The screenshot shows the drawer content itself sized to almost the full screen, not just a keyboard offset issue.
- The earlier drawer-local `.mk-menu-suggestions` rule was declared before `.is-phone .mk-menu-suggestions`.
- Both selectors had similar effective specificity for the suggestions element, so the later phone rule could restore `flex: 1`.
- If Vaul or phone flex sizing leaves the menu drawer with an inline or stretched full-screen height, the drawer top lands at the screen top during the enter transition.

## Fix

- Added a phone-specific `.mk-drawer-content.mk-drawer-menu` rule that forces `height: auto !important`, `top: auto !important`, and a visual viewport max height.
- Added stronger phone drawer menu selectors so menu containers and suggestions size to content instead of stretching.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed
- `npm run build`: passed
- `npm test -- --runInBand`: passed

## Notes

- Device-level drawer motion still needs final confirmation on Obsidian Mobile.
- Existing unrelated workspace changes were left untouched.
