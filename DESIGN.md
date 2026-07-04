# VaultKit Design Notes

## Direction

VaultKit keeps the Obsidian-native utility surface from make.md while making mobile interaction the first constraint. UI changes should stay quiet, dense, and familiar inside an Obsidian vault.

## Tokens

- Surfaces use existing VaultKit and Obsidian CSS variables such as `--mk-ui-background`, `--mk-ui-background-overlay`, `--mk-ui-divider`, `--mk-shadow-menu`, and `--safe-area-inset-bottom`.
- Mobile drawer and modal sizing should use runtime viewport tokens when the software keyboard changes the visible screen:
  - `--mk-visual-viewport-height`
  - `--mk-visual-viewport-offset-top`
  - `--mk-keyboard-inset-bottom`
- Input and action spacing should reuse the existing modal and drawer spacing from `src/css/Modal/Modal.css` and `src/css/Menus/Menu.css`.

## Constraints

- Do not introduce a new palette, type scale, or decorative shell for modal fixes.
- Mobile rename and input flows must keep action buttons reachable while the keyboard is open.
- Preserve the Vaul bottom drawer behavior used by existing touch UI.
