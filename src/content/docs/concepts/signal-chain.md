---
title: "Signal Chain"
---

A patch is the chain you build: modules run in the order shown top to bottom
in `Chain`, each one blending its own output into the running composite
before the next module runs. The last module in that order is what `Output`
shows.

Every module carries one of three states, read from a single selector rather
than separate toggles: `LIVE`, `BYP`, or `MUTE`. `LIVE` means the module is
genuinely passing signal to the next stage. `BYP` holds the module's position
in the chain without contributing its output. `MUTE` blanks the chain at
that module: modules below it receive an empty picture until another module
draws, and its Sends carry an empty picture.

How a module's output combines with what came before it is set by its own
`Blend` Selector, with the same seven modes everywhere: Add, Multiply,
Screen, Difference, XOR, Replace, and Phoenix. `INSERT` labels the first one
Additive. `FEEDBACK` has a second selector, `Loop Blend`, for how the loop
recombines with itself; see [FEEDBACK](../../reference/modules/feedback/).

## Empty areas

The chain starts empty. A module that draws only part of the frame, such as
`SCOPE`, `SHAPE`, `TEXT` or `SPRITE`, leaves the rest see-through, and it
stays see-through for every module below until something draws there. The
`Output` window, recordings and snapshots show empty areas as black; NDI,
Spout and Syphon send them as transparency.

Add, Screen, Difference, XOR and Replace paint a module's picture onto what
is below it, so over an empty area the result is the module's own picture.
Multiply and Phoenix only change what is already there, so over an empty
area they leave it empty.

Effects built for a whole picture see the chain over black: an `INSERT`'s
Insert FX, `SCOPE`'s Insert FX, `FEEDBACK`'s `Pre` and `Post` Insert FX, and
ISF filters. They behave exactly as on a black background, and wherever they
draw nothing the area stays empty. An effect that lights an empty area, such
as a Glow halo or Invert turning black to white, makes that area visible. A
generator's own Insert FX run on that module's picture before it enters the
chain, so they see its see-through areas.

Every module also carries its own Insert FX chain and its own Sends,
independent of its position in the chain. See
[Insert FX Chains](../insert-fx-chains/) and
[AUX Sends and Buses](../aux-sends-and-buses/).
