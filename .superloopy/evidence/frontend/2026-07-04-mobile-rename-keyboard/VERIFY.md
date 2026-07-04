# Verification

Commands run:

```sh
node scripts/check-keyboard-safe-drawer.mjs
npm run build
buildDir=. node esbuild.config.mjs production
```

Results:

- Keyboard-safe drawer checks passed.
- TypeScript and production `dist/` build passed.
- Root `main.js` and `styles.css` bundle build passed.

Runtime path checked:

- `pathContextMenu.tsx` / `spaceContextMenu.tsx` rename action opens `InputModal`.
- Touch `showModal` renders that input through `MobileDrawer`.
- `MobileDrawer` now updates viewport CSS variables on visual viewport resize and scroll.
- `.mk-drawer-content.mk-drawer-modal` uses those variables to move above the keyboard and cap its height to the visible viewport.
