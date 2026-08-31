---
title: "Build a Custom Chain"
---

A fresh slot starts with one `OSC` module already in the chain. If the
current slot has a factory patch loaded from the previous page, right-click
it in `Patches` and choose `Reset to Default` to get back to that
single-module starting point.

Click the `OSC` pill in `Chain` to select it. Its parameters open in
`Module`.

Open the `INSERT FX` section in `Module` and click `+ Add`. A new slot
appears with its effect type set to `NONE`. Pick an effect from the type
Selector, and `Output` updates as soon as one is chosen.

Add a second module the same way: click the `+` at the end of `Chain` and
pick a type. It's appended after `OSC` and runs after it in the signal
chain, on top of whatever `OSC` and its own Insert FX already produced.

Next: [Record and Output](../04-record-and-output/).
