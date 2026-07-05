# Table Property Drawer Autofocus Keyboard

## Scope

- Stabilized table property mobile drawers by preventing menu inputs from automatically focusing on phone-sized UI.
- Preserved manual input editing: users can still tap the input to edit or search.
- Left desktop autofocus behavior unchanged.

## Root Cause

- Table property drawers include a `menuInput` option.
- `SelectMenuSearch` focused its input 50 ms after mount.
- New property drawers also focused their name input 50 ms after mount.
- On mobile, that autofocus opens the keyboard and triggers Vaul's `visualViewport.resize` handler, which directly mutates drawer `height` and `bottom` during the drawer enter transition.
- The visible result is the drawer rising too far and then settling back down.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed
- `npm run build`: passed
- `npm test -- --runInBand`: passed

## Notes

- Device-level drawer motion still needs final confirmation on Obsidian Mobile because the original defect depends on native keyboard and Vaul timing.
- Existing unrelated workspace changes were left untouched.
