# Mobile Context Menu Background Scaling

## Scope

- Target: mobile context menu drawers opened through `showMenu`.
- Files changed:
  - `src/core/react/components/UI/Menus/menu.tsx`
  - `scripts/check-keyboard-safe-drawer.mjs`

## Root Cause

Mobile context menus used `MobileDrawer` without passing `scaleBackground`. `MobileDrawer` defaults that prop to `true`, so Vaul scaled and translated the Obsidian app wrapper behind the drawer. On mobile this made the background move first, the menu appear late, and the app remain slightly scaled after the drawer opened.

## Fix

Menu drawers now pass `scaleBackground={false}`, matching the mobile modal path. This keeps the app background stable while preserving the drawer route for the menu itself.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed
- `npm run build`: passed
- `buildDir=. node esbuild.config.mjs production`: passed
