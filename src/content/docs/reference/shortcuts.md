---
title: "Keyboard Shortcuts"
description: "Keyboard shortcuts and mouse gestures in Hex Composer."
---

The in-app shortcut list is available from `Help > Keyboard Shortcuts`.

## Global

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
| `PrintScreen` / `Ctrl+Alt+S` | Snap Still |
| `Ctrl+Alt+R` | Start or stop recording |

## Mixer Mode

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

**NOTE:** these shortcuts act on the window under the mouse, regardless of
keyboard focus.

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

**NOTE:** copy and paste act on the module, slot, section, or parameter
under the mouse.

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
