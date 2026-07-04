# Centered Mobile Input Modal

The previous bottom drawer approach kept fighting the mobile keyboard. The new direction is simpler:

- Mobile palettes still use `MobileDrawer`.
- Mobile non-palette modals such as rename use `ModalWrapper`.
- `.mk-modal-wrapper-mobile .mk-modal` overrides the phone bottom-sheet rules and renders as a centered card.
- Mobile non-palette modals keep the prior minimal content shape, so the desktop title header is not added on touch devices.

Keyboard behavior:

- `ModalWrapper` now writes visual viewport CSS variables to `.mk-modal-container`.
- The mobile modal container uses `--mk-visual-viewport-height`.
- The centered modal card is constrained by the visible viewport height.

This avoids Vaul's bottom drawer positioning for text input modals entirely.
