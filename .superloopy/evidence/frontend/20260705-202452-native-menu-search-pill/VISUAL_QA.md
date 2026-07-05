# Native Menu Search Pill Evidence

## Scope

- Surface: mobile Navigator Open native Obsidian menu.
- Change: render search as a separate floating pill above the native menu instead of embedding an input in an Obsidian `MenuItem` or routing to the Blink palette.
- Design tokens: existing VaultKit/Obsidian variables from `DESIGN.md`, including `--mk-ui-background-menu-input`, `--mk-ui-border`, `--mk-ui-radius-large`, `--mk-shadow-menu`, `--layer-menu`, and `--drawer-index`.

## Static Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: pass.
- `npm run build`: pass.
- `git diff --check`: pass.
- `npm test -- --runInBand`: no Jest test files in this repo, exits with Jest's "No tests found" code 1.
- `superloopy loop evidence ...`: blocked by a stale local Superloopy CLI cache path (`0.5.2/src/cli.js` missing), so this file is the durable evidence artifact.

## Visual QA

- Browser/device screenshots were not captured in this environment because the target surface is an Obsidian mobile plugin drawer, not a served web route.
- Required manual QA on device:
  - Tap Navigator `Open`.
  - Confirm the Obsidian native menu opens without the old Blink search palette.
  - Confirm the floating search pill appears above the menu.
  - Tap the pill, type a query, and confirm the menu filters without dismissing the keyboard unexpectedly.
  - Confirm tapping a filtered space selects it and closes both the menu and pill.

## Anti-Slop Preflight

- No new palette, typography, or decorative shell.
- No embedded input inside a native `MenuItem`.
- No old Blink palette row in the native menu.
- Motion was not introduced.
