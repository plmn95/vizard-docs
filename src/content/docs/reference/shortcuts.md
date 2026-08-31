---
title: "Keyboard Shortcuts"
---

Every bound key and mouse gesture in Vizard, grouped by the scope it's live
in. This table matches the app's own `Help > Keyboard Shortcuts` window
exactly.

## Global

Live anywhere, in any mode.

| Keys | Action |
|---|---|
| `F3` | Toggle Mixer Mode |
| `Escape` | Close overlay, cancel drag, exit Mixer Mode |
| Double-click | Enlarge the Output view to fullscreen |
| `M` | Toggle MIDI Learn mode |
| `O` | Toggle OpenSoundControl Learn mode |
| `X` | Toggle Mod Matrix window |
| `T` | Tap tempo |
| `Ctrl+S` | Save patch |
| `Ctrl+Shift+S` | Save patch as (force dialog) |
| `Ctrl+O` | Open patch |
| `Ctrl+B` | Save bank |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+Y` | Redo |

## Mixer Mode

Live only while `F3` Mixer Mode is active.

| Keys | Action |
|---|---|
| `H` | Hide or show live controls |

## Chain (while hovered)

Live while the `Chain` window is under the mouse, acting on the selected
module.

| Keys | Action |
|---|---|
| `F2` | Rename selected module |
| `Delete` | Remove selected module |
| `Ctrl+D` | Duplicate selected module |

## Patches (while hovered)

Live while the `Patches` window is under the mouse, acting on the active
patch slot.

| Keys | Action |
|---|---|
| `F2` | Rename active patch |
| `Delete` | Delete active patch |
| `Ctrl+D` | Duplicate active patch |

**NOTE:** `F2`, `Delete`, and `Ctrl+D` are bound twice, once per window. The
same keys rename, delete, or duplicate a module in `Chain` and a patch slot
in `Patches`; which one fires depends on which window the mouse is over,
not which one has focus.

## Any Parameter

Mouse gestures on any parameter control.

| Gesture | Action |
|---|---|
| Drag | Adjust value |
| Shift+Drag | Adjust value finely |
| Ctrl+Click | Type an exact value |
| Double-click, Alt+Click | Reset to default |
| Right-click | Modulation menu (assign, MIDI Learn, reset) |
