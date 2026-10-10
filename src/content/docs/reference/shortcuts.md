---
title: "Keyboard Shortcuts"
description: "Keyboard shortcuts and mouse gestures in Hex Composer."
---

The in-app shortcut list is available from `Help > Keyboard Shortcuts`.

## Global

| Windows / Linux | macOS | Action |
|---|---|---|
| `F3` | `F3` / `Fn+F3` | Toggle Mixer Mode |
| `Escape` | `Escape` | Close overlay, cancel drag, exit Mixer Mode |
| Double-click | Double-click | Enlarge the Output view to fullscreen |
| `M` | `M` | Toggle MIDI Learn mode |
| `O` | `O` | Toggle OpenSoundControl Learn mode |
| `X` | `X` | Toggle Mod Matrix window |
| `T` | `T` | Tap tempo |
| `Ctrl+S` | `Cmd+S` | Save patch |
| `Ctrl+Shift+S` | `Cmd+Shift+S` | Save patch as (force dialog) |
| `Ctrl+O` | `Cmd+O` | Open patch |
| `Ctrl+B` | `Cmd+B` | Save bank |
| `Ctrl+Z` | `Cmd+Z` | Undo |
| `Ctrl+Shift+Z` | `Cmd+Shift+Z` | Redo |
| `Ctrl+Y` | `Cmd+Y` | Redo |
| `PrintScreen` / `Ctrl+Alt+S` | `Cmd+Option+S` | Snap Still |
| `Ctrl+Alt+R` | `Cmd+Option+R` | Start or stop recording |

## Mixer Mode

| Windows / Linux | macOS | Action |
|---|---|---|
| `H` | `H` | Hide or show live controls |

## Chain (while hovered)

Live while the `Chain` window is under the mouse, acting on the selected
module.

| Windows / Linux | macOS | Action |
|---|---|---|
| `F2` | `F2` / `Fn+F2` | Rename selected module |
| `Delete` | `Delete` / `Backspace` | Remove selected module |
| `Ctrl+D` | `Cmd+D` | Duplicate selected module |
| `Ctrl+C` | `Cmd+C` | Copy selected module |
| `Ctrl+V` | `Cmd+V` | Paste onto selected module. Adds a new module of the copied type after it if the types differ. |

## Patches (while hovered)

Live while the `Patches` window is under the mouse, acting on the active
patch slot.

| Windows / Linux | macOS | Action |
|---|---|---|
| `F2` | `F2` / `Fn+F2` | Rename active patch |
| `Delete` | `Delete` / `Backspace` | Delete active patch |
| `Ctrl+D` | `Cmd+D` | Duplicate active patch |

**NOTE:** these shortcuts act on the window under the mouse, regardless of
keyboard focus.

## Insert FX Slot (while hovered)

Live while the mouse is over an Insert FX slot row.

| Windows / Linux | macOS | Action |
|---|---|---|
| `Ctrl+C` | `Cmd+C` | Copy this Insert FX slot |
| `Ctrl+V` | `Cmd+V` | Paste Insert FX. Works for any effect type. |

## Section Header (while hovered)

Live while the mouse is over a parameter section header, for example OSC's
`Frequency` or SHAPE's `Symmetry`.

| Windows / Linux | macOS | Action |
|---|---|---|
| `Ctrl+C` | `Cmd+C` | Copy this section's values |
| `Ctrl+V` | `Cmd+V` | Paste values. Only works if the target section has the same title. |
| Right-click | Right-click | Copy/Paste menu, same actions as the keys above |

**NOTE:** copy and paste act on the module, slot, section, or parameter
under the mouse.

## Any Parameter

Mouse gestures on any parameter control.

| Windows / Linux | macOS | Action |
|---|---|---|
| Drag | Drag | Adjust value |
| Shift+Drag | Shift+Drag | Adjust value finely |
| Ctrl+Click | Cmd+Click | Type an exact value |
| Double-click, Alt+Click | Double-click, Option+Click | Reset to default |
| Right-click | Right-click | Modulation menu (assign, MIDI Learn, reset) |
| `Ctrl+C` | `Cmd+C` | Copy this parameter's value |
| `Ctrl+V` | `Cmd+V` | Paste value. Only works if the target parameter has the same name. |
