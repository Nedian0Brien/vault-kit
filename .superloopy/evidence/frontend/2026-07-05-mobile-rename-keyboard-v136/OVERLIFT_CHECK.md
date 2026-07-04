# Over-Lift Check

The `v1.3.5` patch used Vaul `fixed` mode. Vaul handles keyboard resize by setting:

```text
height = drawerHeight - keyboardHeight
bottom = keyboardHeight
```

For compact rename drawers this can collapse the drawer height. Example:

```text
drawerHeight = 132px
keyboardHeight = 330px
fixed height = -198px
```

That makes the user's suspicion plausible: the drawer can be pushed too high or effectively disappear.

The `v1.3.6` patch removes `fixed` and keeps the delayed `preventScroll` focus. It also changes the 50px closed-keyboard bottom gap into a keyboard-aware value:

```css
max(0px, calc(50px - var(--mk-keyboard-inset-bottom, 0px)))
```

When the keyboard is closed, the existing 50px spacing remains. When the keyboard opens, Vaul owns the drawer `bottom` offset and the extra CSS gap drops toward 0px instead of adding another lift.
