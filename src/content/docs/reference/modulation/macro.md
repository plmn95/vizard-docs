---
title: "Macro"
description: "Control multiple parameters from a named macro with an optional MIDI CC binding."
---

A named control for modulating multiple parameters, with an optional MIDI
CC binding.

A macro's own value is itself a modulation target: assign an LFO, another
macro, or any other source to it like any other parameter, including
self- or cross-macro modulation.

Mixer Mode has a separate, fixed set: 4 macro knobs per deck, each with its
own independent MIDI CC binding. These are scoped to their deck rather than
to the patch, don't grow, and aren't modulation targets.

Related: [Modulation Matrix](../../../concepts/modulation-matrix/),
[Mixer Mode](../../../concepts/mixer-mode/).
