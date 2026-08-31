---
title: "Chain Groups"
---

A chain group clusters a contiguous run of `Chain` pills for organization.
It has no effect on rendering: the chain still runs module by module in the
same order. Grouping only changes how that run looks and behaves in the UI.

`Group Selected`, from the right-click menu on a selection of two or more
pills (Ctrl+click extends the selection), turns that selection into a group.
A non-contiguous selection is normalized on grouping: members move together
in chain order, anchored at the earliest-positioned module's original
position, keeping their relative order to each other.

A group carries its own name, set from its right-click menu's `Rename`, and
its own color, picked from a swatch grid. Collapsing a group (`Collapse` in
the same menu) folds every member but the first into one compact pill;
clicking that pill selects the first member and expands the group again.

`Ungroup` disbands a group: its members become loose pills at their current
chain position, unchanged.

Related: [Signal Chain](../signal-chain/).
