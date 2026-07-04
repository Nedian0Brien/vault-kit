# Root Cause

The `v1.3.4` release assets contained the first keyboard-safe drawer patch, so the failed mobile test was not explained by a stale release bundle.

The runtime path is:

- Rename action opens `InputModal`.
- Touch modal rendering goes through `MobileDrawer`.
- `MobileDrawer` uses Vaul `Drawer.Root`.

The first patch moved the drawer with CSS variables, but `InputModal` still called `focus()` immediately on mount. Vaul has its own `visualViewport` keyboard handler and documents input autofocus plus mobile keyboard as a scroll-prevention edge case. If the software keyboard opens before the drawer and viewport listener settle, the drawer can still be covered or sized from the wrong viewport state.

The `v1.3.5` patch changes the timing:

- Mobile input focus is delayed until after the drawer open transition.
- Focus uses `preventScroll`.
- Vaul `fixed` mode is enabled so keyboard-open state reduces drawer height instead of relying on CSS margin compensation.
- The CSS keyboard margin fallback from `v1.3.4` is removed to avoid fighting Vaul's inline `bottom` and `height`.
