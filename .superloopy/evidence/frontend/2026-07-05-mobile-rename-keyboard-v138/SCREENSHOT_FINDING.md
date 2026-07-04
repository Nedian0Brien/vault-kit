# Screenshot Finding

The supplied screenshot shows the rename modal immediately before the keyboard opens. The modal sits near the bottom of the screen, above the mobile app bar.

This means the modal will be hidden by the software keyboard unless its own positioned `bottom` value changes when the visual viewport shrinks.

Before `v1.3.8`, `MobileDrawer` calculated `--mk-keyboard-inset-bottom`, but `.mk-drawer-content.mk-drawer-modal` only used that value to reduce `margin-bottom`. The actual positioned value remained the generic drawer default:

```css
bottom: 0;
```

If Vaul's internal keyboard resize handler missed the focus timing, the drawer stayed at the bottom of the layout viewport and the keyboard covered it.

The `v1.3.8` patch makes the modal drawer use the runtime keyboard inset directly:

```css
bottom: var(--mk-keyboard-inset-bottom, 0px);
```

Closed keyboard:

- `bottom = 0`
- `margin-bottom = 50px`

Open keyboard:

- `bottom = keyboard inset`
- `margin-bottom = 0px`

This keeps the rename input sheet above the keyboard without reintroducing the earlier app-container background scaling issue.
