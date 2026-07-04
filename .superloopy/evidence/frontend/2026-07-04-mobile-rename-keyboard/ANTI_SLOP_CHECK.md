# Anti-Slop Check

- Existing mobile path was preserved: `showModal` still routes touch UI through `MobileDrawer` and Vaul `Drawer.Content`.
- Existing rename content was preserved: `InputModal` still owns input focus, save, and cancel behavior.
- Existing visual style was preserved: only layout variables and drawer max-height/margin were changed.
- Keyboard-open state is no longer represented as a fake fixed spacing. `MobileDrawer` now reads `window.visualViewport` and exposes runtime CSS variables.
- The drawer keeps the existing 50px closed-keyboard bottom spacing and adds keyboard inset only when the visible viewport shrinks.
- Browser screenshot was not captured because this repo does not include an Obsidian mobile runtime harness that can open the native keyboard from the terminal session.
