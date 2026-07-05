# Mobile Drawer Open Frame

## Scope

- Restored the visible bottom-up opening animation for the deterministic mobile bottom sheet.
- Kept the Vaul-free measured-height drawer architecture from `v1.3.40`.

## Root Cause

- The previous implementation measured content and then queued `open` with `requestAnimationFrame` from a layout effect.
- That can still run before the browser paints the off-screen closed state.
- Without one painted closed frame, the drawer appears directly in the final open position and the transition is not visible.

## Fix

- Added a distinct `closed` phase between `measuring` and `open`.
- The layout effect now measures content and renders the drawer off-screen in the `closed` phase.
- A normal effect then queues the `open` phase with `requestAnimationFrame`, so the browser can paint the closed frame before the transform transition starts.

## Verification

- `node scripts/check-keyboard-safe-drawer.mjs`: passed
- `npm run build`: passed
- `npm test -- --runInBand`: passed

## Notes

- Device-level animation still needs final confirmation on Obsidian Mobile.
- Existing unrelated workspace changes were left untouched.
