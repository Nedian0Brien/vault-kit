# Native Submenu Deferred Open Verification

## Scope

- Mobile native submenu clicks now close the parent Obsidian `Menu` before opening the child menu.
- Parent `onHide` ignores the intentional submenu handoff while `isOpeningSubmenu` is true.
- This targets sticker category paths such as `emoji` and `lucide`, and any other native mobile submenu rendered by `showNativeObsidianMenu`.

## Root Cause

`showNativeObsidianMenu` opened the child menu before hiding the parent menu. On mobile native action sheet presentation, opening a second menu while the first is still visible can be ignored, making submenu taps look like no-ops.

## Checks

- `node scripts/check-keyboard-safe-drawer.mjs`: pass
- `npm run build`: pass
- `npm test -- --runInBand`: no Jest test files found in this repository
