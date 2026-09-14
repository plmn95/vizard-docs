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
| `Ctrl+C` | Copy selected module |
| `Ctrl+V` | Paste onto selected module. Adds a new module of the copied type after it if the types differ. |

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

## Insert FX Slot (while hovered)

Live while the mouse is over an Insert FX slot row.

| Keys | Action |
|---|---|
| `Ctrl+C` | Copy this Insert FX slot |
| `Ctrl+V` | Paste Insert FX. Works for any effect type. |

## Section Header (while hovered)

Live while the mouse is over a parameter section header, for example OSC's
`Frequency` or SHAPE's `Symmetry`.

| Keys | Action |
|---|---|
| `Ctrl+C` | Copy this section's values |
| `Ctrl+V` | Paste values. Only works if the target section has the same title. |
| Right-click | Copy/Paste menu, same actions as the keys above |

**NOTE:** `Ctrl+C` and `Ctrl+V` are bound four times across this page: Chain,
Insert FX Slot, Section Header, and Any Parameter below. Which one fires
depends on where the mouse is hovering, the same rule that governs the
`F2`, `Delete`, and `Ctrl+D` note above.

## Any Parameter

Mouse gestures on any parameter control.

| Gesture | Action |
|---|---|
| Drag | Adjust value |
| Shift+Drag | Adjust value finely |
| Ctrl+Click | Type an exact value |
| Double-click, Alt+Click | Reset to default |
| Right-click | Modulation menu (assign, MIDI Learn, reset) |
| `Ctrl+C` | Copy this parameter's value |
| `Ctrl+V` | Paste value. Only works if the target parameter has the same name. |
