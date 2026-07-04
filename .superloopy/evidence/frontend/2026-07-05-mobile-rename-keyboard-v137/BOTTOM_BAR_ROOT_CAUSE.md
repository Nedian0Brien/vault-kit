# Bottom Bar Root Cause

The user's new observation was that Obsidian's mobile bottom app bar moved too far upward when the keyboard appeared.

Relevant path:

- `src/main.ts` marks `.app-container` with `vaul-drawer-wrapper`.
- `MobileDrawer` always passed `shouldScaleBackground`.
- Vaul applies `transform: scale(...) translate3d(0, 14px, 0)` to `[vaul-drawer-wrapper]`.

Because Obsidian's mobile bottom app bar lives inside `.app-container`, it is included in Vaul's background transform. When the keyboard opens and the visual viewport changes, this background transform can combine with Obsidian's own mobile layout movement, making the bottom bar appear to jump too far upward.

The `v1.3.7` patch keeps background scaling as the default for mobile menu drawers, but disables it for mobile modal drawers such as rename. This keeps the modal patch scoped and avoids transforming the entire Obsidian app container while a keyboard-focused input is open.
