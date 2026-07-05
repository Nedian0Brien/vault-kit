# Mobile Native Picker Preview Icons

## Scope

- Native mobile color picker menu items use dynamically registered circular swatch icons in the left icon slot.
- Native mobile sticker category menu items use dynamically registered sticker preview icons in the left icon slot.
- The existing native menu routing and custom picker fallbacks remain unchanged.

## Evidence

- `node scripts/check-keyboard-safe-drawer.mjs`: passed.
- `npm run build`: passed.
- `npm test -- --runInBand`: no test files are present in this repository, so Jest exited with `No tests found`.

## QA Note

The local environment cannot launch Obsidian mobile directly. Device validation should confirm that color menu rows show circular swatches and sticker category rows show the sticker preview instead of the generic sticker icon.
