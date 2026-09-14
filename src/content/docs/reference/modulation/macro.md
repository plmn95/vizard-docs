---
title: "Macro"
---

A named, freely assignable value with no source of its own: set it by hand,
or bind it to a MIDI CC, and every parameter it modulates follows.

In the main editing view, a patch starts with one macro and grows the bank
from its own add button; nothing caps how many a patch can hold. Each
macro carries its own name and its own MIDI CC binding.

A macro's own value is itself a modulation target: assign an LFO, another
macro, or any other source to it like any other parameter, including
self- or cross-macro modulation.

Mixer Mode has a separate, fixed set: 4 macro knobs per deck, each with its
own independent MIDI CC binding. These are scoped to their deck rather than
to the patch, don't grow, and aren't modulation targets.

Related: [Modulation Matrix](../../../concepts/modulation-matrix/),
[Mixer Mode](../../../concepts/mixer-mode/).
