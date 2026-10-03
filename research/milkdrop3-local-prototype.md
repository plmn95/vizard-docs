# MilkDrop 3 in Hex Composer: local prototype and implementation handoff

Updated follow-up: [primitive ordering, current-frame blur, progress and shader parser findings](milkdrop3-primitive-and-shader-investigation.md). That report supersedes the earlier inherited primitive and blur scheduling assumptions and records the current local implementation.

Research and native macOS validation: 2026-10-02. This document describes a local,
unreleased experiment. It is a reference for an independent implementation, not
a claim of complete MilkDrop 3 compatibility.

## Recommendation

Keep MILK as a native generator in Hex Composer's chain. Treat classic `.milk`
and MilkDrop 3 `.milk2` as two inputs to a versioned compatibility runtime. Import
the original preset text and required textures; evaluate its expressions and
shaders at runtime. Converting presets into Hex's own effect definitions would
lose their feedback, custom waves, and shader behavior.

projectM is a useful cross-platform foundation, but its standard API is not a
complete MilkDrop 3 engine. The local experiment patches a pinned projectM build
and adds a two-preset compositor in Hex. A production implementation seeking
visual parity should investigate composition within the preset render pipeline,
including feedback and warp behavior, rather than assume that compositing two
finished images is equivalent.

## Research evidence and provenance

- [Official MilkDrop 3 repository and feature documentation](https://github.com/milkdrop2077/MilkDrop3),
  inspected at revision `6b39088f789441e18cc1665519ee7ffe439cece5`.
  Documents simultaneous double presets, saved blending values, 64 Q variables,
  sixteen custom shapes/waves, FFT access, mouse support, and closed shaders.
  The inspected `code` tree did not expose the current double-preset/FFT engine;
  it cannot be assumed to be the complete implementation shipped in the binary.
- [Official release package](https://github.com/milkdrop2077/MilkDrop3/releases/download/MilkDrop3/MilkDrop3.exe),
  extracted without executing it. PE metadata reports 3.37. SHA-256:
  `e155ca7e600acbb59e91c6ca55a3bcf2c8c7358cead808429ecb8d158bd888d5`.
  Contains 333 `.milk`, 146 `.milk2`, and 129 conventional texture files. Actual
  shipped files supplied the format examples and compatibility corpus.
- [projectM](https://github.com/projectM-visualizer/projectm), pinned to
  `dd89dfba0852c0c7e0c4e668929118d91ec3a3f0`. This revision supplies the host-clock
  and output-FBO interfaces used by Hex. Recursive checkout is required for its
  vendored expression evaluator. The upstream engine already includes sixteen
  built-in waveform modes; custom-wave slot count is a separate limit.
- [MDropDX12](https://github.com/shanevbg/MDropDX12) was inspected as a secondary
  format reference. Its own code is licensed CC-BY-NC-4.0; its implementation was
  not copied into this commercial app. The parser and spatial masks here were
  independently written. Do not treat this repository as a permissively
  licensed drop-in renderer.

The official README lists more blend patterns than the twenty present in this
release's `.milk2` corpus. Supporting this corpus does not imply all versions or
all patterns are supported. Some current documentation also describes embedded
images and closed shaders, which this experiment does not implement.

## Observed `.milk2` contract

The tested format is a text wrapper, not a pair of filenames:

```ini
blending_pattern=vertical
blending_progress=0.5
blending_direction=1
random_1=0.1
random_2=0.2
random_3=0.3
random_4=0.4
random_5=0.5
[PRESET1_BEGIN]
[preset00]
; complete first preset, including shader text
[PRESET1_END]
[PRESET2_BEGIN]
[preset00]
; complete second preset
[PRESET2_END]
```

Real files may contain a creation-date line, NAME/version lines, and additional
header keys. The reader preserves the complete original text. It requires the
four block markers in order, one `[preset00]` per embedded preset, finite progress
in `[0,1]`, direction `1` or `-1`, and either no saved random values or all five
finite values in `[0,1]`. Duplicate header fields and unknown patterns fail.
Unknown header keys are preserved but not executed. Sprite blocks or nonzero
`sprite` fields fail explicitly rather than silently losing the overlay.

Supported pattern names are `zoom`, `side`, `plasma`, `cercle`, `triangle`,
`snail`, `plasma2`, `curtain`, `plasma3`, `snail2`, `horizontal`, `vertical`,
`stars`, `linesvertical`, `donuts`, `arrow`, `snail3`, `square`, `patches`,
and `corner`. These use original approximations, not recovered MD3 algorithms.

## Implementation map

Paths below are relative to the app repository, `retrovid`.

| Area | Files and behavior |
| --- | --- |
| Format and assets | `src/renderer/milk_format.h`, `milk_preset.h`: strict wrapper reader, immutable raw source, bounded texture import, no live GPU state in saved data |
| Native module | `src/modules/milk_module.h` and existing module/chain integrations: eight instances per chain, native Mix/Blend, insert FX, sends, clipboard and modulation |
| Runtime | `src/renderer/milk_runtime.cpp`: one engine for `.milk`, two for `.milk2`; shared host time, PCM and mouse input; independent feedback surfaces; final GL spatial compositor |
| Extended engine | `cmake/projectm-milk3.patch`: Q64 expression/shader plumbing, sixteen custom shapes/waves, FFT shader uniforms/helpers, mouse and saved-random API, GLSL noise-name collision fix, shader diagnostics, JFIF textures |
| Dependency build | `cmake/MilkDrop.cmake`, `ApplyProjectMPatch.cmake`: pinned shared library, idempotent patch application, mismatch rejection, patch/source/license notices |
| Host input | `src/app.cpp`, `app.h`, `crt_renderer.*`: file dialog/drop accepts both extensions; output-canvas coordinates produce normalized mouse x/y, held and released values |
| Persistence | `src/io/patch_serializer.cpp`: raw wrapper and textures embedded in patches/banks; experimental runtime identifier; accepts the earlier classic MILK identifier |
| Verification | `tests/milk_module_test.cpp`, `tests/fixtures/milk`: owned synthetic fixtures, model and GPU assertions, optional external-corpus smoke runner |

Loading is transactional: construct and compile both new engines before replacing
the previous runtime. A failure in either embedded preset retains the old visual.
Shader fallback warnings are treated as failures, preventing a silently degraded
load from being reported as compatibility. Restart reconstructs state; recalling
a patch restarts feedback. Changes to unrelated controls retain existing state.

The FFT implementation uses a 512-bin spectrum over projectM's audio window,
undoes its waveform scaling, applies a Hann window, and normalizes amplitude.
`get_fft(pos)` interpolates normalized positions; `get_fft_hz(hz)` maps Hz using
the engine's 44.1 kHz assumption. Attack/decay use bounded retention factors.
Tone/silence behavior is tested; exact MD3 calibration and smoothing parity are
not established. Saved random values 1–4 feed the engines' `rand_preset`; all five
influence the compositor. Other internal random behavior is not proven identical.

## Local reproduction

With the app's normal development prerequisites available:

```sh
cmake -S . -B build-milk -DCMAKE_BUILD_TYPE=Debug
cmake --build build-milk --target vizard milk_module_test --parallel 2
build-milk/milk_module_test
build-milk/milk_module_test --gpu
```

The build fetches pinned projectM and applies the local patch. For an existing
checkout, pass `-DVIZARD_PROJECTM_SOURCE_DIR=/absolute/path/to/projectm`; use a
clean checkout at the pinned revision, with submodules initialized. The patch
checker rejects conflicting source changes. Engine changes add API/state fields,
so substituting an unpatched projectM library is unsupported.

The validated local tree reused other dependency checkouts through CMake's
`FETCHCONTENT_SOURCE_DIR_*` options. These cache paths are machine-specific and
are not required for a fresh network-enabled development configure.

Start the development app with an isolated settings directory:

```sh
env XDG_CONFIG_HOME=/private/tmp/hex-milk3-profile build-milk/vizard
```

Add MILK from the chain `+` menu and choose **Load preset…**. Start with the owned
fixture `tests/fixtures/milk/red-green.milk2`; it should show red/green regions.
For an actual animated example, the extracted official package includes
`MilkDrop2077 - Double stringy things2b.milk2`. Keep the package's sibling
`textures` directory in place. Import embeds the collected textures into the
patch; textures elsewhere are not discovered. The same conventional asset limits
apply as classic MILK (256 files, 64 MiB total, unique texture stems).

The optional corpus runner takes an extracted official preset directory:

```sh
build-milk/milk_module_test --gpu /absolute/path/to/Milkdrop3/presets --milk3
```

It selects all `.milk2` files plus `.milk` files whose names include Equalizer,
MOUSE or Traffic. It renders three frames per file at 320×180 with synthetic
audio and reports each failure. This is a short import/render smoke test, not a
pixel comparison or long-duration stability benchmark. The official presets
remain external test data; they have not been added to either repository.

## Validation and limits

The local native app loaded an official `.milk2` through the macOS file dialog
and visibly animated it in the MILK chain. Automated GPU checks cover classic
rendering, Q33/Q64, slot-16 shapes and waves, live mouse values, FFT tone versus
silence, saved random replay, twenty mask families, progress endpoints, direction
reversal, resize, GL state isolation, and failed-second-preset rollback. Model
checks cover wrapper preservation, validation, clipboard and patch round trips.

The first real-package sweep loaded/rendered **113 of 159** files. Of the 46
rejections, 24 involved sprite overlays, 16 shader/expression compatibility, and
six missing textures (`worms` or `pic`) absent from the extracted texture set.
After repairing GLSL built-in `noise3` name collisions, the rebuilt engine loaded
and rendered **119 of 159** files. The remaining 40 rejected files comprise:

| Cause | Files |
| --- | ---: |
| Unsupported sprite overlays | 24 |
| HLSL translation or expression compilation | 8 |
| Missing conventional textures | 8 |

Some missing assets were only exposed after fixing the earlier shader error in
the same file. The eight shader/expression failures were Royal Mashup (128),
NeonAngel Black Hole Textures 2 Triple Images, NeonAngel Red Textures 3 double,
NeonAngel Venom Textures 2 double2, golden mirror5, liquid gold, R070 double and
Equalizer4d doubleV. The golden mirror5/liquid gold cases fail expression parsing;
the others fail HLSL translation. Exact names and diagnostics are in the local
log `/private/tmp/hex-milk3-final-corpus.log`.

The final GPU suite passed, including an independently authored `noise3` helper
test. The rebuilt `insert_fx_test`, `patch_snapshot_json_test`, `clipboard_test`
and `target_catalog_test` all passed. The modification patch applied to a clean
archive of the pinned upstream revision and passed repeat application.
`npm run check:docs` validated 100 documentation pages. The final native build
also loaded Double stringy things2b through the file chooser and animated it,
with all 129 conventional package textures imported.

Open limitations:

- Double blending is image composition over separate feedback histories. Mask
  shapes, parameter mapping and feedback behavior are not MD3 visual parity.
- Sprite overlays, embedded-image extensions, closed/cached shader binaries and
  blend patterns outside the tested twenty are unsupported.
- Some HLSL or expression syntax still fails. Report the original error and
  preserve the previous preset; do not silently fall back or claim success.
- No Windows/Linux build or native MilkDrop 3 side-by-side comparison was run.
- Debug-build performance varies substantially. A complex official double preset
  showed roughly 15 FPS in the local app. The three-frame corpus timings include
  compilation/warm-up and are unsuitable as steady-state performance promises.
- No release package, installer, deployment, commit or publication was produced.

For a production implementation, first establish a reference suite on Windows
against native MD3 using identical audio, time, random values, resolution and
mouse inputs. Match blend and feedback semantics, FFT calibration and unsupported
shader cases against that suite. Then optimize the two-preset path and validate
all supported platforms. Full compatibility with closed shaders requires a
supported route from their author; no equivalent is established by this work.

## Licensing boundary

projectM is a replaceable shared library under LGPL-2.1-or-later. Build/package
hooks retain upstream license notices, the exact revision and the modification
patch; follow its applicable source/relinking obligations before distribution.
The vendored shader parser and evaluator have their own notices. Official preset
comments include author-specific terms, including some noncommercial notices.
Downloading them for local testing does not establish redistribution rights.
This prototype ships no official preset corpus and copies no MDropDX12 runtime.

## Subsequent architecture finding, 3 October 2026

The later Mac reference harness now runs official MilkDrop 3 through Wine/Vulkan and captures it natively. Controlled probes establish that double presets interact through shared intermediate images and feedback. The existing two-complete-engine/final-image compositor fails a black-versus-green diagnostic and should remain labelled an approximation. Preserve the integration foundation while replacing the double execution strategy. The ordinary shader-cache translation route is also now characterized, but closed-cache decoding remains unresolved. See [pipeline investigation](milkdrop3-pipeline-findings.md) and [shader-cache findings](milkdrop3-format-and-shader-findings.md); these supersede the earlier Windows-reference prerequisite and blanket closed-shader feasibility statement.


## Shared-stage implementation, 3 October 2026

The earlier independent-history runtime described above has been replaced by a tested common pre-composite history and shared intermediate input for both composite passes. The [implementation and validation report](milkdrop3-shared-stage-prototype.md) supersedes the earlier double-preset runtime description. The native module and host integrations remain; twenty masks are still approximate and ten patterns unsupported.
