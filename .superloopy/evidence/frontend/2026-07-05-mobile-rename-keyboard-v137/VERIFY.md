# Verification

Commands run:

```sh
node scripts/check-keyboard-safe-drawer.mjs
npm run build
buildDir=. node esbuild.config.mjs production
```

Results:

- Keyboard-safe drawer contract passed.
- TypeScript and production `dist/` build passed.
- Root `main.js` and `styles.css` build passed.

Manual mobile runtime still needs confirmation in Obsidian because this terminal session cannot open the native mobile keyboard inside the Obsidian app.
