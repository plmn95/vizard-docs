---
title: "Audio-Reactive"
---

Live audio level as a modulation source, from the app's own audio input. The
`Audio` tab lists every source below as a live meter; clicking one picks it.

| Source | Notes |
|---|---|
| `L Level` / `R Level` | Raw per-channel level. |
| `Sub`, `Bass`, `Low Mid`, `Mid`, `High Mid`, `Presence`, `Brilliance`, `Air` | 8 fixed frequency bands, named rather than numbered. |
| `Custom 1` to `Custom 4` | 4 user-defined bands. Each band's own low/high Hz range is set in `Settings > Audio > Custom Frequency Bands`, shared across the whole patch rather than set per assignment. |

**NOTE:** the per-assignment shaping controls (`RECTIFY`/`LINEAR`, Attack,
Release, and a gate threshold) are available for `L Level` and `R Level`
only. On every other source, bands included, the shaping control in the
[Mod Matrix](../../windows/mod-matrix/) is greyed out. Signed depth applies to
every assignment regardless of source.

Related: [Modulation Matrix](../../../concepts/modulation-matrix/).
