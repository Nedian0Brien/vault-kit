# Mobile Context Menu Prevent Scroll

## Scope

- Target: mobile context menu drawers opened through `showMenu`.
- Files changed:
  - `src/core/react/components/UI/Drawer.tsx`
  - `src/core/react/components/UI/Menus/menu.tsx`
  - `scripts/check-keyboard-safe-drawer.mjs`

## Root Cause

Disabling Vaul background scaling was not enough. Vaul also runs a separate scroll-prevention path when the drawer opens. That path records the current window scroll position, calls `window.scrollTo(0, 0)`, and later restores the previous scroll position. In the Obsidian mobile shell this can make the app surface behind the menu visibly move upward while the drawer is opening.

## Fix

`MobileDrawer` now exposes Vaul's `disablePreventScroll` prop. Mobile context menu drawers pass `disablePreventScroll={true}` in addition to `scaleBackground={false}`, so the app background should remain still while the menu drawer handles its own opening.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed
- `npm run build`: passed
- `buildDir=. node esbuild.config.mjs production`: passed
