# Hex Composer Wiki: Style Guide

This guide covers the walkthrough, concepts, and reference pages.

## Editing standard

Explain what the reader needs beyond what a control or action already says.
A factual sentence is not automatically a useful sentence.

- Cut expected outcomes: loading a patch runs it, choosing a value applies
  it, clicking a slot selects it. Document exceptions to those expectations.
- Keep concrete actions, unfamiliar terms, operating limits, and behavior
  that could surprise the reader, such as a first save requiring a path or
  closing a picker preserving an assignment.
- Cut reassurance, design justifications, implementation details, and
  narration about how the documentation should be read.
- Do not explain a familiar action with its own name (`Reset` resets,
  `Remove` removes), or repeat a range in an obvious example (180 degrees
  is a half turn).
- Keep limits that affect use. Avoid incidental totals such as the number
  of module types or catalog entries in explanatory prose.
- Delete redundant wording rather than replacing it with shorter filler.

Apply this standard to descriptions, tables, callouts, and shared site text
as well as paragraphs. The section guidance below does not require padding
or a fixed template where there is nothing useful to add.

---

## 1. Section Voice

The section determines what a reader is there to do.

### `reference/**`: TD-style (modules, fx, modulation, windows)

Write concise descriptions and parameter tables for lookup. Include
instructions when a gesture or interaction needs explaining, and callouts
for limitations that do not fit in the table. Do not add an introduction,
table, or related link solely to fill a template.

> **Example (FX page: Barrel):**
> Barrel bows the image outward from its center, simulating CRT curvature.
> `Amount`: 0 to 0.6.

### `concepts/**`: Hex Composer's product register

Explain the feature's purpose and behavior. Include a short instruction
when it helps the reader find or use the feature; put extended walkthroughs
in Getting Started.

Open with the situation the feature exists to solve, not with its cardinality
or internal accounting: how many module types can use it, how many slots or
buses exist, how many blend modes it offers. A count is an implementation
detail restated in prose. Lead with why a reader would reach for this piece of
the model, then state how it works. The test: if the opening sentence would
read the same whether the app had 3 buses or 30, it's counting, not
explaining, and belongs after the purpose, not before it.

> **Example (Concepts page: Signal Chain):**
> A patch is the chain you build: modules run top to bottom, each reading the
> output of the one above it, until the last module in chain order is what the
> Output window shows.

### `getting-started/**`: sustained second-person imperative

Give concrete actions in the order a first-time user performs them.
Explain an outcome only when it is unexpected or needed for the next step.

> **Example (Getting Started page: load a factory patch):**
> Open `File > Factory Patches` and choose a patch.

---

## 2. Hard Bans

These apply in all three sections, no exceptions.

| Banned | Why |
|---|---|
| Em-dashes (—) | Reads as AI-generated prose. Use a period, comma, colon, or parentheses instead. This document was rewritten to remove its own em-dashes once this rule existed; there should be none left below. |
| Echo-fragment and comma-stacked triplet sentences: a fragment (no subject and verb of its own) that repeats a number or word for rhythm ("Three sections, three jobs."), or strings three short parallel phrases together for cadence instead of writing a real sentence ("Evergreen, readable in any order, referenced anytime.") | Reads as tagline copy, not documentation. Write a full sentence that states the fact plainly, or cut the line. Three parallel fragments in a row is the tell regardless of what the fragments say. |
| Decorative glyphs as structure: arrows (→), emoji, or other symbols used to dress up a link or heading instead of plain markdown | Adds visual flourish with no information. A plain `[link text](path)` or heading says the same thing without the costume. |
| Retro-kitsch / nostalgia language ("groovy," "old-school vibes," "throwback") | The CRT vocabulary exists because the engine is a real phosphor/scanline simulator, not because old things look cool. Costume language contradicts the product's own claim about itself. |
| Marketing adjectives (powerful, seamless, intuitive, simply, just, easily) | These assert a value judgment in place of a fact, and go stale the moment a reader hits the rough edge the adjective quietly denied existed. |
| Hedging (might, should probably, generally) | Hedging is what a claim looks like when it hasn't been checked. State the fact, or mark the sentence explicitly as unverified. Don't blur the two into one soft word. |
| Generic UI vocabulary standing in for a Hex Composer control-vocabulary term | Hex Composer assigns each control word in the table below one exact meaning. Calling a Trough a "slider" or a Rocker a "toggle" reintroduces ambiguity. |
| Paraphrased module/state names | Write `LIVE`, `BYP`, `MUTE`, not "on," "bypassed," "disabled" standing in for them. A paraphrase describes a different, generic concept and breaks the reader's ability to match the page to what's on screen. |
| Screenshots / embedded images | The interface changes quickly, and a screenshot goes stale faster than the prose describing it. Hex Composer's control vocabulary is precise enough that prose can do the job alone. |
| Code internals: function/class/struct names, file paths, source citations (`OscModule::adsr`, `CrtRenderer::osc[]`, `Patch::addModule()`, `src/app.cpp`) | A user reading this wiki never sees the source code and doesn't recognize these names. State the on-screen behavior or limitation directly ("has no effect," "not available for this control") instead of pointing at the implementation that causes it. Maintainers verify implementation details during review. |
| App-history framing: explaining what used to exist, was retired, or changed over time | A wiki documents the app as it is. History belongs in release notes or a changelog, not here, and a reader who never knew the old behavior existed has no use for why it is gone. |
| A line break landing right after a hyphen or slash (`single-` / `module`, `ACTIVE`/ / `BYPASSED`) | Markdown joins wrapped lines with a single space, so the break renders as a stray space glued to the punctuation: "single- module," "ACTIVE/ BYPASSED." Reword or move the wrap point so no line ends in `-` or `/`. |

---

## 3. Terminology

Spell out platform-specific shortcuts wherever they appear. In prose, use
`Ctrl+S` (`Cmd+S` on macOS), for example; shortcut tables have separate
Windows/Linux and macOS columns. Match the app's bindings and labels,
including mouse gestures, Option, Delete/Backspace, and function keys.
Do not assume a modifier substitution without checking the binding.

Use these control names exactly:

| Term | Meaning |
|---|---|
| Knob | A primary parameter performed with directly. |
| Trough | A bounded numeric parameter with a minimum and maximum. |
| Wheel | A numeric parameter that wraps, such as phase or angle. |
| Pad | Two continuous parameters controlled as one gesture. |
| Rocker | A binary state. |
| Selector | A choice from a fixed set of values. |
| Lamp | A reported boolean or continuous state. |
| Meter | A level shown over time. |
| Screen | A live signal display, preview, or output. |

The one collision worth naming explicitly, as a worked example of the
discipline expected everywhere else: **OpenSoundControl vs. the OSC module.**
Hex Composer has two unrelated things a writer might reach for the string "OSC" to
name: the OSC generator module (an oscillator: Sine/Sawtooth/Square/etc.) and
the OpenSoundControl protocol (a modulation input source, UDP-based, distinct
from MIDI). The app resolves this collision in user-facing strings by spelling
the protocol out in full. The wiki follows the same rule:

- Write **"OpenSoundControl"** in full, every time, for the protocol. Never
  abbreviate it to "OSC" in prose.
- Reserve the bare word **"OSC"** exclusively for the oscillator generator
  module.
- If a single page has to mention both (rare, but `reference/modules/osc.md`
  and `reference/modulation/opensoundcontrol.md` cross-link each other), the
  first use of each term on that page must disambiguate in the same sentence.
  Don't rely on the reader inferring which one from context.

This is the pattern for any future naming collision the app turns up: find
how the app itself resolved it in its own UI text, and match that resolution
in the wiki rather than inventing a separate one.

**Backtick literal UI text; reserve plain quotes for citing an example
value.** A menu item, button label, section header, key, or window name is
a fixed string the reader can find on screen: write it in backticks
(`` `Reset to Default` ``, `` `+ Add` ``, `` `INSERT FX` ``), matching how
the control-vocabulary terms above are treated. Plain quotes are for
citing an example of something that varies, like a factory patch's name
("Big Brother") or a window title template ("Modulate:
&lt;parameter&gt;"), not for a control a reader could click.

---

## 4. Self-Check Before Calling a Page Done

Run this checklist against the page. It's written to be usable by a writer
with no memory of why each rule exists. Apply it literally.

- [ ] **Zero em-dashes anywhere on the page.** Use a period, comma, colon, or
      parentheses instead.
- [ ] **No standalone echo-fragment or comma-stacked triplet sentences.** A
      line that repeats a number/word purely for rhythm, or strings three
      parallel fragments together for cadence, is cut or rewritten as an
      actual sentence.
- [ ] **No decorative glyphs (arrows, emoji) standing in for plain markdown**
      on links or headings.
- [ ] **No code internals.** No function/class/struct names, no file paths,
      no `Namespace::identifier()` citations, anywhere in the page text.
      State what happens on screen, not what implements it.
- [ ] **No app-history framing.** Nothing about what used to exist, was
      retired, or changed over a past session. Document current behavior
      only.
- [ ] **No line ends in `-` or `/`.** Grep the page for both; either one
      renders as a stray space glued to the punctuation on the next line.
- [ ] **The page serves its section's purpose:** lookup, explanation, or
      walkthrough. Instructions are included where they help.
- [ ] **Every control is named by the vocabulary in this guide**, not a generic word.
      Grep the page for `slider`, `toggle`, `dropdown`, `switch`, `button`
      (unless "button" is genuinely correct and none of the nine parts apply).
      Each hit is either fixed or deliberately justified.
- [ ] **Every module/parameter/state name matches the app's on-screen text
      exactly**, including case: `LIVE`/`BYP`/`MUTE`, not a prose paraphrase
      presented as if it were the label.
- [ ] **Zero hits for the banned-word list**: powerful, seamless, intuitive,
      simply, just, easily, might, should probably, generally, groovy,
      old-school, vibes, retro.
- [ ] **Every menu item, button, section header, and window name is in
      backticks, not plain quotes.** Plain quotes are only for an example
      value (a patch name, a title template), never a clickable control.
- [ ] **"OSC" never appears alone meaning the protocol.** "OpenSoundControl"
      is spelled out every time. If both meanings appear on the page, the
      first use of each is disambiguated inline.
- [ ] **No screenshots or embedded images.**
- [ ] **No template padding.** Tables, summaries, and callouts contain
      useful information rather than repeating control labels or paragraphs.
- [ ] **Concepts pages only:** opens with the situation the feature solves,
      not a count of types/slots/buses/options. If the first sentence would
      read identically at a different count, move it after the purpose
      sentence, not before.
- [ ] **Getting Started pages only:** every instruction names a concrete,
      checkable action: a specific menu path, key, or control, not a vague
      suggestion ("adjust the settings as needed" is not an instruction).
- [ ] **Every cross-link resolves to a real page in the approved wiki file
      tree.** No linking to a page name that sounds right but wasn't in the
      sign-off.
- [ ] **Every factual claim about current app behavior is checked in the
      current Hex Composer release.** Include the tested version in the pull request.
      A claim that cannot be verified is marked inline as unverified and
      flagged for maintainer review, not stated as fact.
