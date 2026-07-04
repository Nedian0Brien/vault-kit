# Design Tokens

Task: keep the mobile rename input drawer usable when the software keyboard opens.

Source contract:

- `DESIGN.md`
- `src/css/Menus/Menu.css`
- `src/css/Modal/Modal.css`

Kept tokens:

- Drawer surface: `--mk-ui-background`, `--mk-shadow-menu`, `--layer-menu`
- Overlay: `--mk-ui-background-overlay`
- Mobile safe area: `--safe-area-inset-bottom`
- Runtime viewport: `--mk-visual-viewport-height`, `--mk-visual-viewport-offset-top`, `--mk-keyboard-inset-bottom`

No new color, typography, icon, or container shell was introduced.
