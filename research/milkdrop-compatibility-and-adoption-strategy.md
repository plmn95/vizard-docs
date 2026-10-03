# Comprehensive MilkDrop support within Hex Composer

Current implementation and review gates: [PR handoff](milkdrop3-pr-handoff.md), validated 3 October 2026. The strategy below remains the broader adoption proposal.

Research reviewed and expanded 2 October 2026 for the Hex Composer developers. This revision incorporates the second research pass and the agreed scope: Hex remains the full visual instrument, with comprehensive native MilkDrop preset support.

Hex Composer should retain and develop its complete composition system: generators, video, effects, feedback, modulation, mixing, recording and external outputs. Native .milk and .milk2 playback adds an extensive family of playable sources to that system. Becoming the preferred application for those files is an adoption objective, not a change in product identity.

The technically strongest route is a versioned MilkDrop compatibility runtime behind a native MILK module, a modern shader compilation pipeline, and integrated browsing and authoring. Directly opening a preset should create a simple Hex composition containing that module. It should use the same application, engine, project model and output path as a more elaborate composition.

Complete MilkDrop 3 compatibility remains an unproven goal. Its closed shaders require a verified, licensed route to portable execution or equivalent source. Our prototype demonstrates integration and substantial preset coverage; it does not establish visual parity, production performance, or market demand. This report proposes implementation and adoption decisions without changing the application.

## The competitive baseline

| Application | What its own documentation establishes | Implication for Hex |
| --- | --- | --- |
| MilkDrop 3 | Extended presets, double presets, authoring and playback additions, and shaders restricted to its application. | Match behavior across versions, not just filename parsing. |
| NestDrop | Four decks, previews, queues and Spout; paid editions add MIDI and other performance integrations. | Mixing, MIDI and attractive previews are already expected. |
| MDropDX12 | A modern Windows renderer; claims .milk2 support, saved blend settings, editing and file associations. | Modern rendering and double presets alone will not differentiate Hex. |
| Milkwave | Preset management, remote control, MIDI and creator tools. | Library organization and editing also have competition. |
| projectM | A reusable cross-platform engine with documented compatibility differences. | A useful foundation that needs measured extensions. |

These are vendor and maintainer descriptions, not independently verified comparative benchmarks. No evidence reviewed establishes market share or proves which application renders every preset best. [MilkDrop 3](https://github.com/milkdrop2077/MilkDrop3), [NestDrop](https://nestimmersion.ca/nestdrop.php), [MDropDX12](https://github.com/shanevbg/MDropDX12), [Milkwave](https://github.com/IkeC/Milkwave), [projectM compatibility](https://github.com/projectM-visualizer/projectm/wiki/Milkdrop-Compatibility).

My strategic inference is that Hex’s strongest opportunity combines dependable playback, native support across platforms, and a playable visual instrument. Let people combine presets with live video, other modules, effects and recording while keeping ordinary preset playback immediately accessible. Native support is valuable, but cross-platform playback alone is insufficient differentiation.

The second pass adds broader composition software to the comparison. Resolume already treats generated sources as composable content and supports routing and effects. TouchDesigner accepts imagery from other applications through Spout or Syphon. Consequently, combining visualization and video is not inherently unique. Hex must demonstrate a compelling native preset workflow and its own instrument interaction rather than claim that no competitor can assemble similar results. [Resolume sources](https://resolume.com/support/en/sources), [Resolume composition](https://resolume.com/support/en/composition), [TouchDesigner texture input](https://derivative.ca/UserGuide/Syphon_Spout_In_TOP).

Interoperability supports adoption alongside those tools. A performer can initially use Hex to generate a visual feed for an existing setup, then use more of Hex’s composition features when useful. Requiring replacement of the entire setup would make migration harder. This is a proposed adoption strategy, not evidence of demand.

## What the local prototype proves

The recorded test corpus contains all 146 double presets extracted from the official package and 13 selected classic presets. Of those 159 files, 119 loaded and rendered. The 40 remaining rejections comprise 24 sprite cases, eight shader or expression cases, and eight missing texture cases. This is a deliberately narrow sample, not an ecosystem compatibility percentage.

Diagnostic variants explain the eight shader or expression failures: five involve bare sampler names, one involves a local variable named aspect colliding with an injected macro, and two split an identifier across expression lines. The sampler experiment also exposed a texture binding warning after compilation succeeded. Fixing compilation is therefore insufficient evidence of correct rendering. The split identifiers require reference testing to distinguish malformed files from syntax MilkDrop tolerates.

The module already connects preset playback to Hex’s native chain and project persistence. However, double presets currently use two independent engines and an approximate spatial blend. Twenty implemented mask types are not evidence of correct behavior for every MilkDrop 3 blend. A complex double preset ran around 12–15 FPS in the Debug preview; there is no comparable Release benchmark.

The existing handoff records these results and limitations. Subsequent shader diagnostics did not change the baseline application or the 119-file result. [Local prototype report](/Users/plamenhadzhiev/repos/others/vizard-docs/research/milkdrop3-local-prototype.md).

An important research correction: projectM documents sprite support in version 4.2. The current module’s rejection of sprite fields does not prove that we need to build a complete sprite engine ourselves. Investigate its host API first, then test MilkDrop 3 extensions and unsupported blend behavior. [projectM compatibility](https://github.com/projectM-visualizer/projectm/wiki/Milkdrop-Compatibility).

## Define compatibility as a contract

The proposed runtime must preserve the original source and expose an explicit compatibility profile. A file extension alone cannot identify all historical behavior.

| Area | Required research and implementation |
| --- | --- |
| Preset language | Defaults, numbered code assembly, expression error recovery, initialization, variable lifetime, memory buffers and random behavior. |
| Shader language | Legacy HLSL, macros, intrinsics, mutable globals, name shadowing, sampler declarations and resource bindings. |
| Rendering | Warp and composite passes, blur, waves, shapes, motion vectors, borders, decay and transitions. |
| Double presets | All documented blend types, saved randomness, spatial coordinates, both preset states and the correct placement of blending in the render pipeline. |
| Audio and input | Sample rate handling, normalization, waveform and FFT values, smoothing, time and mouse coordinates. |
| Assets | Texture lookup, case and path handling, random textures, noise, embedded images, animation and sprite overlays. |
| Numerical behavior | Texture precision, clamping, gamma, NaN handling and feedback accumulation. |
| Persistence | Lossless import and export, unknown fields, source formatting and asset dependencies. |

projectM explicitly documents differences in expression error handling and shader translation. That makes “it parses and produces an image” a weak acceptance test. A modern backend can also change an image through numerical behavior even when the shader compiles successfully. [projectM compatibility](https://github.com/projectM-visualizer/projectm/wiki/Milkdrop-Compatibility), [Microsoft FXC to DXC migration](https://github.com/microsoft/DirectXShaderCompiler/wiki/Porting-shaders-from-FXC-to-DXC).

Proposed user-visible states are verified, supported but unverified, approximate, missing dependency, and unsupported. Keep compatibility separate from file validity. A missing artist texture is not automatically an engine defect, and a substituted image is not full compatibility.

## Recommended runtime and compiler architecture

Create a separate Milk runtime library with a stable host interface for loading source, resolving assets, submitting audio and input, advancing time, rendering, diagnostics and export. Hex should own orchestration and composition; the runtime should own preset semantics. Keep behavior tests outside the UI.

Retain the useful projectM evaluator and rendering components while measuring their correctness. Replace or extend the shader frontend and composition path where evidence requires it. Repeated source-string replacements can diagnose failures but are a poor long-term language implementation: sampler discovery and the aspect collision already demonstrate the risk.

The proposed shader pipeline is original source → compatibility-aware parsing and normalization → modern compiler → backend code and reflected bindings. Preserve a source map throughout so errors identify the original preset and line. Normalize legacy sampling and entry points explicitly, and initialize invocation-local writable state from preset inputs where required.

Compare two compiler candidates against the same real presets and deliberately constructed language tests:

- Slang offers several target languages and compilation and reflection facilities. Its HLSL compatibility still needs testing.
- DXC plus SPIRV-Cross offers HLSL compilation to SPIR-V, reflection and translation into target shading languages. It needs explicit adaptation for older shader syntax.

DXC is not a drop-in replacement for the legacy compiler. Microsoft documents legacy compatibility flags, differing numerical behavior and unsupported old texture sampling syntax. Slang also documents differences from HLSL. Choose from measured semantic coverage, diagnostics, integration cost and reproducibility rather than compiler reputation. [DXC](https://github.com/microsoft/DirectXShaderCompiler), [FXC migration](https://github.com/microsoft/DirectXShaderCompiler/wiki/Porting-shaders-from-FXC-to-DXC), [Slang HLSL compatibility](https://docs.shader-slang.org/en/latest/coming-from-hlsl.html), [SPIRV-Cross](https://github.com/KhronosGroup/SPIRV-Cross).

A writable global in a legacy shader is not inherently impossible to represent in GLSL. The implementation must preserve its storage and lifetime semantics; uniforms themselves cannot become writable state. Treat this as a compiler lowering problem. [GLSL specification](https://registry.khronos.org/OpenGL/specs/gl/GLSLangSpec.4.60.html).

Initially emit code compatible with Hex’s existing OpenGL renderer to isolate language and fidelity work. Later evaluate Metal, Direct3D 12 and Vulkan backends against the same contract. Changing API and language semantics simultaneously would make discrepancies harder to diagnose.

Provide an accurate legacy profile and a separately selected enhanced profile. Higher precision, brighter lines or altered decay can be useful creative options, but they must not silently change imported work. Compile away from the live render thread, retain the last working preset during edits, and key caches by source, compiler, profile, backend and relevant device properties.

## Integration with the full Hex composition system

The local code already implements the right basic relationship. The MILK branch renders a contribution, runs that module’s insert effects, composites it with the current chain using its Mix and Blend controls, captures previews and dispatches sends. The runtime boundary requires the renderer’s owning OpenGL context. These are observed implementation facts, not a proposal to turn Hex into a separate preset player. [MILK composition branch](https://github.com/3rd-Party-Guy/retrovid/blob/codex/native-milk-compatibility/src/renderer/crt_renderer.cpp), [Runtime interface](https://github.com/3rd-Party-Guy/retrovid/blob/codex/native-milk-compatibility/src/renderer/milk_runtime.h).

The proposed design has three distinct layers:

| Layer | Responsibilities | Persistence |
| --- | --- | --- |
| Preset runtime | Execute original language, audio analysis, assets, feedback and double-preset behavior. | Original source, dependencies and compatibility profile. |
| Native MILK module | Select a preset, expose suitable controls, manage lifecycle and provide its image to Hex. | Module settings, control assignments and declared creative overrides. |
| Hex composition | Combine all modules, insert effects, sends, modulation, decks and outputs. | The complete native Hex project. |

Preserve the preset’s own feedback history as part of its runtime. Downstream Hex effects operate on the resulting image; they should not automatically rewrite that history. Feeding camera video or another generator into the preset’s feedback is a separate, explicit creative operation.

projectM’s current OpenGL API provides rendering into a host framebuffer and a texture burn-in operation. The latter draws into the active preset image, including both active presets during its transitions. This is a concrete integration mechanism worth testing, not proof that every MilkDrop 3 image-injection feature is covered. It is present in the pinned source, but the current MILK module does not expose it. [projectM rendering API](https://github.com/projectM-visualizer/projectm/blob/master/src/api/include/projectM-4/render_opengl.h).

Define color space, orientation, alpha and texture precision at the runtime boundary. Preserve the preset’s expected internal numerical behavior, then convert explicitly to Hex’s compositing representation. Do not interpret black pixels as transparent by default: a full-frame preset can intentionally draw black. Luma keying and other creative transparency belong to explicit Hex controls. The prototype allocates RGBA8 targets for its double-preset compositor; that is an observed implementation choice requiring fidelity testing, not an established universal requirement. [Runtime targets](https://github.com/3rd-Party-Guy/retrovid/blob/codex/native-milk-compatibility/src/renderer/milk_runtime.cpp).

The host should coordinate a frame context containing time, dimensions, audio and input events, while each module retains independent state and a declared start time. Share read-only audio samples without replacing MilkDrop-specific analysis with Hex’s existing band values. The prototype passes the new stereo batch from AudioEngine and maintains runtime time independently. Its cap on samples supplied per render frame and its handling of delayed frames require tests with recorded audio. Do not infer that batching every sample is always correct or that the latest-window policy is automatically a bug. [Frame preparation](https://github.com/3rd-Party-Guy/retrovid/blob/codex/native-milk-compatibility/src/engine/engine.cpp), [Runtime audio and time](https://github.com/3rd-Party-Guy/retrovid/blob/codex/native-milk-compatibility/src/renderer/milk_runtime.cpp).

ISF is another stateful shader format already relevant to Hex. Its specification defines time, frame indices and persistent image buffers. Share host infrastructure such as clocks, asset storage, shader caching and GPU scheduling where appropriate, while retaining each format’s semantics. Converting all MilkDrop presets into ISF would still require recreating the MilkDrop runtime. [ISF variables](https://docs.isf.video/ref_variables.html), [ISF persistent buffers](https://docs.isf.video/ref_multipass.html).

Specify lifecycle behavior before optimizing it. Bypass, mute, pause, removal, duplication, undo, preset replacement and resize can each affect accumulated state. Decide whether hidden instances continue advancing, freeze or restart, and make that policy predictable. A saved project must reproduce its sources and settings; restoring the exact live feedback image and expression state is a separate capability that should not be promised without an explicit snapshot design.

## Controls and creative overrides

Universal controls should initially govern module composition: Mix, Blend, effects, sends and native modulation. Restart and preset selection are also clear operations. Arbitrary presets do not necessarily provide artist-defined parameters suitable for sliders, so shader reflection alone cannot produce a meaningful preset control panel.

For deeper controls, add an explicit override layer with a documented execution point. A setting applied before per-frame equations may be overwritten by them; one applied afterward may intentionally change the result. Preset-local q variables, wave and shape variables, and shader inputs have different scopes. Discovering a variable name does not establish its intended meaning. Let authors annotate useful controls and preserve unannotated source.

Native LFO, envelope, MIDI or macro assignments may drive these declared controls. Keep the original preset intact and record interventions in the Hex project. When exporting a standard preset, either express the intervention faithfully in supported preset code or explain that it remains a Hex composition setting. A complete chain containing video, ISF, mixer state and native effects cannot generally be exported as a .milk file without translating all of those behaviors. Recording that chain produces a video, which serves a different purpose.

Three proposed demonstrations would show why the combined application matters:

1. A faithful preset followed by Hex effects and modulation, mixed with another deck and recorded through the normal output path.
2. A preset blended with live camera imagery and native text or shapes, with clean external output.
3. An explicitly selected feedback-injection operation that burns a native generator or video texture into the preset, with restart and undo behavior documented.

These are proposed integration demonstrations, not features newly implemented or tested during this research pass.

## The unresolved route to complete MilkDrop 3 support

MilkDrop 3’s public documentation identifies closed shaders that only work in its application. Its published source repository does not establish that all current implementation details are available. Do not assume old public MilkDrop code contains every modern extension. [MilkDrop 3 documentation](https://github.com/milkdrop2077/MilkDrop3).

Actual cache inspection has now established a translation route for 1,151 ordinary legacy shader payloads: every payload passed MojoShader disassembly, GLSL120 and SPIR-V translation. GPU compilation, resource binding and visual fidelity remain unverified. The third cache and MD31/MD32 lookup still require decoding and runtime tracing; this ordinary-cache result does not establish support for closed shaders. [Detailed findings](milkdrop3-format-and-shader-findings.md).

Preferred options are an explicit portable runtime agreement with the maintainer, permission and specifications for independent support, or source ports supplied by shader authors. A Windows-only compatibility bridge could be investigated if authorized and licensed, but would not satisfy native cross-platform parity.

The maintainers’ licenses also constrain engine choices. MDropDX12’s own code is CC BY-NC 4.0, so copying or commercially forking it requires a separate agreement. Treat its feature list as competitive evidence, not reusable implementation material. [MDropDX12 license](https://github.com/shanevbg/MDropDX12/blob/main/LICENSE).

projectM’s LGPL route supports a separate replaceable library under its requirements, including publishing the exact corresponding source and modifications. Its maintainer guidance also flags store distribution constraints. Keep this boundary deliberate. [projectM licensing](https://github.com/projectM-visualizer/projectm/wiki/projectM-Licensing).

Engine permission and preset artwork permission are separate. Do not ship a community collection merely because it is downloadable. Record author, origin and redistribution permission for bundled presets, textures and animations; importing a user’s library does not require bundling that library.

## Product workflow that could make Hex the preferred application

Direct file opening is a convenience within the full Composer. Open a .milk or .milk2 file into a minimal composition containing a MILK module, retain access to the normal chain and controls, and immediately render when audio configuration permits. Loading a folder should populate the library. The ordinary Hex entry experience must continue to serve all other kinds of composition; a MilkDrop-specific first-run workflow is not a requirement.

The library should index folders without rewriting them, search names and tags, show favorites and queues, detect duplicates, and explain missing assets. Use deterministic thumbnails and schedule a small number of animated previews. Do not run a renderer for every visible library item. Store shared textures once by content hash instead of duplicating an entire texture collection in each Hex project.

For performance, offer queued loading, beat-aware changes, useful macro controls and reliable output routing. Build on Hex’s existing mixer, modulation, MIDI, effects, external video and recording. Those capabilities are promising integration advantages; they have not all been benchmarked together with the Milk runtime.

For authors, prioritize source-mapped errors, safe hot reload, undo, inspection of runtime inputs and state, repeatable audio playback, and understandable controls over waves, shapes and blend settings. Keep authoring interventions explicit: an override applied before per-frame code can behave differently from one applied after it.

Export standard .milk and .milk2 files with their provenance and dependency manifest. Preserve unfamiliar fields. Keep Hex-only composition in the Hex project rather than silently making a standard preset dependent on Hex. Let artists create in Hex and share work with the existing ecosystem.

Offer operating-system file associations through the user’s normal choice. A running instance should accept a new file promptly; during a live performance, stage it in preview rather than replacing the output unexpectedly.

My adoption hypothesis is that dependable preset support can bring users into Hex, and the complete instrument gives them reasons to stay. A free viewer or separate player is not required by the architecture, and this research does not establish a pricing model. Test migration, real compositions, standard export and live shows with a small voluntary creator group. No outreach has been performed for this research.

## Validation and delivery gates

Build a reference harness before promising parity. Capture the pinned MilkDrop 3 version on Windows with recorded audio, controlled time, seeded randomness where possible, identical dimensions and documented settings. Use MilkDrop 2 references for historical behavior. Store file hashes, assets and capture configuration with every case.

Compare expression values and intermediate rendering passes before comparing final images. Feedback systems can amplify tiny differences, so a single universal image-similarity threshold will produce misleading failures or false confidence. Use deterministic short tests, numerical tolerances, temporal behavior checks and artist review for longer sequences.

The proposed gates are:

1. Account for every current corpus file and identify all required features and dependencies. Expand beyond the 159-file sample using licensed collections and owned language tests.
2. Verify the compiler candidates, sampler binding and expression assembly against reference behavior. Resolve the closed-shader feasibility and licensing question.
3. Implement and validate all targeted double-preset modes, sprites and asset extensions. Remove approximate labels only after comparison.
4. Benchmark Release builds on named hardware. A proposed initial target is sustained 1080p at 60 FPS for single and double presets within the complete intended output path; select explicit hardware and preset tiers before making the claim.
5. Test long sessions, repeated preset changes, audio-device changes, output reconnects and invalid input. Measure frame-time percentiles, compile stalls, memory growth and recovery.
6. Deliver browser, authoring and standard export workflows. Test whether artists can move their existing library into Hex and move their work back out.
7. Publish a versioned compatibility matrix and reproducible benchmark method with the release.

4K and higher output should have separate hardware tiers. NestDrop’s high-resolution performance claims are useful competitive context, but are not a benchmark Hex has reproduced. [NestDrop](https://nestimmersion.ca/nestdrop.php).

## Performance and regression gates for the combined application

A fast isolated preset is insufficient if adding normal Hex modules causes missed frames. Benchmark at least five defined workloads: the existing app without MILK, one classic preset, one double preset, a preset plus native effects and video, and both decks with output sharing and recording enabled. Name the presets, source dimensions, hardware and settings. Measure CPU time, GPU time, frame-time percentiles, compile stalls and memory growth separately.

GPU memory budgets must include each preset’s feedback and blur images, double-preset state, Hex chain buffers, insert effects, preview engines and recording/output resources. A 1920×1080 RGBA8 image alone is about 7.9 MiB; one RGBA16F image is about 15.8 MiB. Those are arithmetic examples, not measured total runtime memory. Reuse immutable textures when semantics allow, but never share writable histories accidentally between module instances or previews.

The prototype saves and restores a broad set of OpenGL state around rendering, including texture-unit bindings. This protects coexistence but warrants profiling when multiple engines are active. Establish a precise renderer state contract and explicit resource ownership; replace broad state queries only after validating what the runtime changes. Any asynchronous compiler or loader design must respect OpenGL context ownership. A separate thread without a suitable context is not a solution. [Runtime state boundary](https://github.com/3rd-Party-Guy/retrovid/blob/codex/native-milk-compatibility/src/renderer/milk_runtime.cpp), [projectM integration guide](https://github.com/projectM-visualizer/projectm/wiki/Integration-Quickstart-Guide).

Browser previews should have a bounded budget and never advance the live module’s state. Automatic resolution reduction must be visible and optional because resolution can change feedback appearance. Define behavior during resize and device loss, and retain an active preset until its replacement is ready. The current prototype is not evidence that these production policies are complete.

Acceptance also requires regression checks for existing non-MILK compositions, mixed-module order, insert effects, sends, copy/paste, undo, save/load, deck independence and alpha outputs. Unsupported presets must fail locally without disabling other modules or altering the active project. Compare renders with and without a MILK module in unrelated positions to detect graphics-state leakage. The existing tests from the prototype remain useful, but this pass added no tests and did not rerun them.

Protect playback from failed loads and shader edits with staged replacement and bounded compilation. An isolated compiler process can contain compiler failures; it cannot guarantee recovery from every GPU driver hang. Test GPU failure behavior separately.

## Suggested decision for the developers

Proceed with comprehensive native .milk and .milk2 support as an expansion of Hex Composer’s full visual instrument. Build the compatibility runtime behind a normal MILK module and preserve the current prototype as the integration experiment. Keep existing capabilities, project workflows and development priorities first-class.

The first engineering milestone should be the reference harness, a compiler comparison and a complete inventory of the official feature corpus. Sprite bridging and the known shader failures are useful early work, but do not substitute for verifying double-preset semantics and closed shader feasibility.

Do not commit to a complete renderer rewrite until those experiments identify which existing components actually prevent fidelity. Do not advertise total MilkDrop 3 compatibility until the closed-shader route, visual comparisons and platform results support it.

The suggested positioning is: Hex Composer combines your MilkDrop library with its generators, video, effects and performance controls, while preserving faithful native preset playback. Whether this makes Hex the preferred application is a product hypothesis. This second pass establishes a clearer integration design and identifies what must be proved; it cannot guarantee adoption or complete MilkDrop 3 parity.

## Research scope and evidence

The second pass reviewed the current local runtime and composition code, Hex’s signal-chain, mixer and output documentation, projectM’s framebuffer, texture injection, audio and sprite APIs, ISF’s state conventions, and primary documentation for Resolume and TouchDesigner integration. Existing compatibility counts and performance observations are carried forward from the recorded prototype experiments. No application implementation, new rendering benchmark, reference capture, release or outreach was performed during this document update.

The priority experiments remain compiler coverage, exact double-preset behavior, closed-shader feasibility, and performance under complete compositions. Questions about user demand, default-app adoption, meaningful preset controls and commercial positioning require user research in addition to engineering evidence.

## Followup investigation of actual formats

A subsequent inspection of all 146 double presets, the official executable's pattern labels, closed preset identifiers and three shader cache pairs produced more concrete findings. The wrapper is readable text, the full pattern list has thirty entries, and 43 classic files reference shaders through MD31 or MD32. The two standard caches contain 1,151 structurally validated legacy shader payloads; every payload translated without reported errors through MojoShader's disassembly, GLSL120 and SPIR-V profiles. No GPU compilation or visual comparison was performed.

This provides an additional implementation route for usable legacy bytecode. The third cache remains encoded or otherwise unidentified, and its mapping to closed presets is not yet established. Exact blend semantics require reference experiments because the wrapper names its algorithm but does not embed the formula or pipeline order. The investigation includes a generator for original diagnostic inputs. [Detailed format and shader findings](milkdrop3-format-and-shader-findings.md), [Reference fixture generator](milkdrop3-blend-fixtures.py).

## Initial reference experiment outcome, 2 October 2026

The official MilkDrop 3.37 installer and extracted renderer were executed in an isolated portable Wine environment on macOS. The renderer reached a Direct3D window after an audio warning, then Wine reported a page fault. Windows GDI capture failed on both MilkDrop and a Notepad control. No diagnostic preset was successfully loaded and captured, so this run establishes no blend, feedback or closed-shader parity results. The subsequent Mac recovery below supersedes the need for a Windows host for continuing this investigation. This is a test-environment finding, not a reason to change Hex’s product architecture.

The revised diagnostic generator creates sixty double presets and four classic baselines, with feedback seeding based on a preset-local frame counter. Generation is verified; reference rendering remains unverified. [Full experiment, findings and execution protocol](milkdrop3-reference-experiment.md).

## Recovered Mac reference route, 2 October 2026

The follow-up established that the installer had selected the correct Wine executable. OpenGL retries logged framebuffer errors; Wine’s Vulkan backend through MoltenVK produced visible rendering. Native ScreenCaptureKit solved window capture. Corrected red and blue classic baselines and controlled double presets now render and can be captured on this Mac. A separate Windows machine is no longer a prerequisite for continuing behavioral investigation.

The working reference harness is diagnostic infrastructure, not a proposed shipped dependency. It does not establish native Windows GPU parity, feedback-state semantics, shader resource binding or closed-cache decoding. [Updated experiment and raw evidence](milkdrop3-reference-experiment.md).

The recovered harness captured all thirty patterns twice at progress 0.5 with fixed direction and random inputs. Every paired measured crop is pixel-identical. A cross2 progress sweep additionally shows a spatially mixed output at progress 1, so universal endpoint and mask assumptions are unsafe. The raw evidence is archived in the report; feedback semantics and exact formula recovery remain unverified.

## Pipeline decision from controlled reference tests, 3 October 2026

A double made from two independently black-output presets produces a green ring in MilkDrop 3, while Hex outputs black. Instrumented probes show feedback-dependent cross-preset signal as well. Exact double support therefore requires cooperation inside the preset render pipeline; recovering final-image masks alone cannot solve it. Preserve the native module integration and investigate stage-level rendering with shared intermediate images and feedback. [Detailed findings and PR recommendation](milkdrop3-pipeline-findings.md).
