# Mobile Native Context Menu Verification

## Scope

- Standard mobile `SelectMenu` context menus now prefer Obsidian `Menu`.
- Searchable, editable, multi-select, input, custom fragment, disclosure, toggle, remove, more-options, reorder, and sectioned menus fall back to the existing React drawer path.
- Make.md submenu actions are preserved by opening the submenu action from the native item click.

## Evidence

- `npm run build`: passed.
- `node scripts/check-keyboard-safe-drawer.mjs`: passed.
- `npm test -- --runInBand`: no test files are present in this repository, so Jest exited with `No tests found`.

## Mobile QA Note

The local environment cannot launch an actual Obsidian mobile shell, so this patch still needs device validation after installing the release. The key expected behavior is that the file/space context menu no longer uses the Vaul `MobileDrawer`, so the Obsidian app background should not translate upward when the menu opens.
