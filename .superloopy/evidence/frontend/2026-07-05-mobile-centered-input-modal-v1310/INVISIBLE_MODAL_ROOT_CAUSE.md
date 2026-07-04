# Invisible Centered Mobile Modal

The centered mobile modal path introduced in `v1.3.9` rendered `ModalWrapper` into a portal element with the `mk-modal-wrapper-mobile` class.

`mk-modal-wrapper-mobile` did not have the fixed fullscreen overlay styles that `mk-modal-wrapper` has. This meant the modal could exist in the DOM without a visible fullscreen layer for centering and z-index positioning.

The fix adds a centered-modal-only portal class:

```text
mk-modal-wrapper-centered
```

Only mobile non-palette modals receive this class. It shares the fixed fullscreen wrapper styles with desktop modals. Mobile palette drawers still use the existing Vaul drawer path and do not receive this centered wrapper class.
