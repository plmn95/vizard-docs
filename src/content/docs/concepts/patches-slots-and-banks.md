---
title: "Patches, Slots, and Banks"
description: "Save signal chains and modulation as .hxc patches, manage patch slots, and organize sessions into banks."
---

A `.hxc` patch stores a signal chain, its modulators, and modulation
assignments. A session can hold multiple patches in `Patches`.

`Ctrl+S` saves the active slot; `Ctrl+Shift+S` saves it to a new file. A
slot loaded from a file, or opened via `File > Open...`, remembers that
file's path, so a later plain save writes back to it. A slot that was reset,
duplicated, newly added, or loaded from a factory patch has no path of its
own yet, so its first save behaves as Save As instead of overwriting
anything.

`File > Save Bank` (`Ctrl+B`) writes every open slot, and which one is
active, to a single `.hxcbank` file in one step; `File > Save Bank As...`
writes it to a new one. `File > Load Bank...` replaces the open slots with a
bank's contents.

`File > Open...` also accepts `.viz` patch files and `File > Load Bank...`
accepts `.vizbank` banks. Saving one of them keeps its file name and
extension.

Factory patches are excluded from `File > Recent Patches`.

A slot can also be set as the startup default, from its right-click menu's
`Set as Startup Default` or from `File > Set Active Patch as Startup
Default`, so it opens automatically the next time Hex Composer launches, in place
of the one-`OSC` factory default.

`Reopen Last Patch on Startup`, under `File > Recent Patches`, is the
fallback for when no startup default is set. A startup default always wins
over it.

Related: [Signal Chain](../signal-chain/).
