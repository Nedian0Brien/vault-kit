# Mobile Context Menu Drawer Jump

## Scope

- Target: mobile context menu drawers opened through `showMenu`.
- Files changed:
  - `src/core/react/components/UI/Menus/menu/SelectMenuComponent.tsx`
  - `scripts/check-keyboard-safe-drawer.mjs`

## Root Cause

`SelectMenuComponent` initialized `options` as an empty array and populated the real options in a mount effect. Mobile context menus render inside Vaul `MobileDrawer`, whose enter transition also starts after mount. That meant the drawer could start opening with an empty, small menu and then re-layout when options appeared, causing a visible jump during the bottom-sheet animation.

## Fix

The first render now computes the menu options synchronously from the current props, query, and section. The existing effect still updates options when query, section, or suggestions change after mount.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed
- `npm run build`: passed

## Notes

This environment cannot run the Obsidian mobile shell, so final motion confirmation still needs device testing through the installed plugin build.
