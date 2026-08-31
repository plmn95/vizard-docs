---
title: "Patches, Slots, and Banks"
---

A patch is one `.viz` file: one signal chain, its modulators, and every mod
assignment on it. `Patches` holds any number of patches as slots in one
session, starting from one and growing every time its `[+]` button is
clicked. Nothing caps how many a session can hold.

`Ctrl+S` saves the active slot; `Ctrl+Shift+S` saves it to a new file. A
slot loaded from a file, or opened via `File > Open...`, remembers that
file's path, so a later plain save writes back to it. A slot that was reset,
duplicated, newly added, or loaded from a factory patch has no path of its
own yet, so its first save behaves as Save As instead of overwriting
anything.

`File > Save Bank` (`Ctrl+B`) writes every open slot, and which one is
active, to a single file in one step; `File > Save Bank As...` writes it to
a new one. `File > Load Bank...` replaces the open slots with a bank's
contents.

`File > Recent Patches` lists the user's own recently opened files. Factory
patches are excluded from it: opening one is meant to start something new,
not become an entry a later session mistakes for the user's own work.

A slot can also be set as the startup default, from its right-click menu's
`Set as Startup Default` or from `File > Set Active Patch as Startup
Default`, so it opens automatically the next time Vizard launches, in place
of the one-`OSC` factory default.

`Reopen Last Patch on Startup`, under `File > Recent Patches`, is the
fallback for when no startup default is set. A startup default always wins
over it.

Related: [Signal Chain](../signal-chain/).
