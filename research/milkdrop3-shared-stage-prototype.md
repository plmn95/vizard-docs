# MilkDrop 3 shared-stage prototype: research, implementation and validation

Updated follow-up: [primitive ordering, current-frame blur, progress and shader parser findings](milkdrop3-primitive-and-shader-investigation.md). That report supersedes the earlier inherited primitive and blur scheduling assumptions and records the current local implementation.

3 October 2026. Follow-up to the [pipeline investigation](milkdrop3-pipeline-findings.md). This milestone implements the shared-image hypothesis inside Hex Composer's native MILK module. Hex retains its existing visual instrument capabilities.

## Result

The native prototype now reproduces the previously missing cross-preset signal: the two individually black components produce a green ring when combined. Persistent shared feedback strengthens that signal; color injected only in the final composite does not enter the tested feedback path. The fixed equation counter advances once per complete frame.

This validates a shared-stage implementation as a useful foundation. It does **not** establish exact MilkDrop 3 scheduling, masks, primitive/sprite order, shaderless behavior or full preset compatibility. No PR, commit, distribution package or release was produced in this milestone.

## Research and implementation choice

The local pinned projectM revision is `dd89dfba0852c0c7e0c4e668929118d91ec3a3f0`. Its actual source was inspected, including `MilkdropPreset::RenderFrame`, `PerFrameContext::LoadStateVariables`, `Renderer::CopyTexture`, `FinalComposite`, `ProjectM::RenderFrame` and `Renderer::PresetTransition`.

The preset renderer already separates equation evaluation, history setup, motion vectors, warp, blur, primitives and composite. Its buffer swap retains the pre-composite image. The existing transition renderer mixes completed outputs, which cannot satisfy the owned black-versus-green diagnostic. That code therefore supplies no shortcut for simultaneous double-preset feedback. [Upstream preset interface](https://github.com/projectM-visualizer/projectm/blob/dd89dfba0852c0c7e0c4e668929118d91ec3a3f0/src/libprojectM/Preset.hpp), [transition implementation](https://github.com/projectM-visualizer/projectm/blob/dd89dfba0852c0c7e0c4e668929118d91ec3a3f0/src/libprojectM/Renderer/PresetTransition.cpp).

The [official MilkDrop 3 documentation](https://github.com/milkdrop2077/MilkDrop3/blob/main/README.md) confirms that doubles retain preset order, blend direction, progress and random values. These are preserved by the existing import model. It does not specify the internal GPU pipeline, so the stage topology below is an inference tested against controlled outputs, not a transcription of official implementation.

A further primary-source search found [MDropDX12](https://github.com/shanevbg/MDropDX12), whose README claims thirty recovered masks and deterministic frozen doubles. Its declared CC-BY-NC 4.0 license prevents treating that implementation as a commercial-compatible drop-in. Only its public README was inspected; no renderer source, algorithms or assets from it were copied into this implementation. Its claims are not independently verified here.

The chosen change is a small local projectM extension, preserving the existing preset engine and ordinary `.milk` path rather than replacing the renderer.

## Implemented render flow

Each component retains its own engine, evaluator variables, custom shape/wave state, clock and input configuration. The host supplies the same PCM, frame time, mouse and saved random values to both. Images cooperate as follows:

1. Copy the previous shared pre-composite image into each component's private history surface.
2. Evaluate each preset once and render its existing warp/primitive pass independently.
3. Mix those pre-composite results into one shared image with the frozen spatial mask.
4. Copy that common image into each preset's pre-composite surface and render its composite pass.
5. Mix the two composite results into Hex's output target.
6. Retain the shared image from step 3 as the next frame's feedback, separately from step 5's displayed output.

The two component FBOs are reused first for warp results and then for composite results. A third FBO holds shared feedback. It can be overwritten after both warp passes have copied the preceding history. No pass samples the same texture attachment that it is writing.

The local C API adds `projectm_opengl_render_milk_warp` and `projectm_opengl_render_milk_composite`. They accept complete, non-multisampled, matching-size, nonzero host FBOs and reject unsupported runtime state or an invalid stage sequence. They require a locked loaded Milkdrop preset with no transition. Warp updates time/audio; composite advances the engine frame counter. Sprites are not enabled by this interface.

`MilkdropPreset::RenderFrame` calls the split operations in its original order for ordinary presets, with no external image replacement. The classic path retains its existing behavior. The implementation copies FBO inputs explicitly to avoid shared ownership and texture aliasing; avoiding these extra copies is a later performance optimization, not required for this proof.

For the diagnostic without primitives, let `w` be the second preset's spatial weight, `H` the common pre-composite image and `D` the displayed output:

```text
H[n] = (1-w) * WarpA(H[n-1]) + w * WarpB(H[n-1])
D[n] = (1-w) * CompA(H[n])    + w * CompB(H[n])
```

With A injecting red in warp but displaying black and B detecting red as green, the ideal static green signal is proportional to `w*(1-w)`. With B retaining 0.9 of history, the ideal local steady-state red channel becomes `(1-w)/(1-0.9*w)`. This explains a ring and a stronger retained signal. Filtering, coordinate flips, spatial motion, clipping and quantization mean these equations are an explanatory model, not an exact recurrence fit to screenshots.

## Native results against the reference

Nine owned diagnostics were rendered for 600 host frames at 600×580 in a hidden native macOS OpenGL 4.1 context. Every run completed with GL error 0. The official captures are the already archived MilkDrop 3.37/Wine reference from the preceding investigation; the official renderer was not rerun in this milestone. Source hashes identify the exact inputs used.

| Diagnostic | Official reference | Previous Hex | Updated Hex |
| --- | --- | --- | --- |
| Classic hidden-red / black-detector / memory-detector | Black | Black | Black |
| Classic composite red | Red | Red | Red |
| Shared current-warp signal, input 05 | Green ring | Black | Green ring; max G 66, 69,461 green-dominant pixels |
| Instrumented feedback 0.9, input 08 | Green ring plus full blue counter; max G 177 | Blue only | Green ring plus full blue counter; max G 149 |
| Instrumented feedback 0, input 09 | Weaker green plus full blue counter; max G 85 | Blue only | Weaker green plus full blue counter; max G 66 |
| Composite-only red, input 07 | Red, no green-dominant pixels | Red | Red, G exactly 0 |

Native measurements use aligned crop `(4,4,596,574)`. Reference captures use `(4,55,596,625)`. Native channels come from direct RGBA8 readback; the reference is a color-managed ScreenCaptureKit screenshot. These intensities are not directly comparable as linear shader values. The qualitative interaction matches; exact colors and blend curves remain unverified.

![Native shared feedback: blue frame counter and green interaction ring](milkdrop3-pipeline-assets/staged/08-feedback-frame-count.png)

![Official reference for the same input](milkdrop3-pipeline-assets/reference/08-feedback-frame-count-fixed-a.png)

The [native manifest](milkdrop3-pipeline-assets/staged/manifest.json) contains all nine runs and input hashes. [Artifact hashes](milkdrop3-pipeline-assets/staged/hashes.json) identify output files, runtime source and engine patch.

## Mask orientation corrections

The circle and vertical fields were reversed individually, based on the preceding constant-color evidence. Horizontal was retained as the control. At the existing fixed progress/direction/random configuration:

| Pattern | Previous red/blue region agreement | Updated agreement |
| --- | ---: | ---: |
| cercle | 1.96% | 98.04% |
| vertical | 1.12% | 98.88% |
| horizontal | 98.52% | 98.52% |

This is a coarse source-region classification, **not a compatibility percentage or pixel-fidelity measurement**. It says nothing about all progress values, directions, randomness, aspect ratios or blend softness. Twenty masks remain approximations; ten patterns are still rejected. The [orientation measurements](milkdrop3-pipeline-assets/staged/mask-orientation.json) preserve this narrow comparison.

## Validation actually performed

- Development `vizard` executable and `milk_module_test` compiled successfully in `build-milk`; projectM uses its existing Release dependency build. This is not a distributable package.
- Expanded native GPU suite passed: shared current-warp interaction, retained history versus zero retention, composite-only exclusion, one equation evaluation per frame, image-history reset on resize, equation/history reset on reload, and preservation of host blend/scissor/viewport/color-mask state.
- Existing native GPU suite passed: ordinary MILK, twenty prototype masks, transactional load failures, native inserts, multiple slots, Q64, shape/wave 16, FFT, mouse and saved randoms.
- Persistence executable `patch_snapshot_json_test`, insert-effect executable `insert_fx_test`, and CTest `target_catalog_test` / `milk_module_test` passed. The first sandboxed catalog run could not create a CoreMIDI client; the approved native rerun passed.
- An owned classic preset combines asymmetric UV gradients, persistent frame equations and image feedback. Old and new renderers produced pixel-identical 600×580 PPM files after 180 frames: SHA256 `daac7f4813cd1392e9f0415579a66a815b8bbf8d52e88ac8b2da0ae60a19220b`. The [before](milkdrop3-pipeline-assets/staged/classic-gradient-before.png) and [after](milkdrop3-pipeline-assets/staged/classic-gradient-after.png) PNGs and [input](milkdrop3-pipeline-assets/staged/classic-gradient-feedback.milk) are archived.
- The cumulative local projectM patch passes `git apply --check` against pristine files from the pinned revision. `git diff --check` passes.

No Windows/Linux native run, full 51-test suite, refreshed official-preset corpus, app-interface interaction, Release performance assessment or human visual acceptance was performed. Existing small-resolution GPU timings are not production performance evidence.

## Remaining work and review boundary

The milestone is ready for architecture review as an experimental native module. The code implements a common-history hypothesis consistent with the owned tests; it has not uniquely decoded MilkDrop 3's entire pipeline.

Next, use controlled reference inputs to isolate motion-vector ordering, custom shape/wave masking, whether both warp shaders always sample identical prior history, blur timing/input, shaderless orientation/echo, sprite burn/layer order and transitions between complete doubles. The current warp stage deliberately retains projectM's existing order, including blur generated from its preceding image and primitives drawn before final composite. Those choices are inherited behavior and must not be presented as proven MD3 fidelity.

Recover all mask formulas and parameter mappings across progress, direction, saved randomness and aspect ratio. Avoid repairing just frozen screenshots. Then continue the separate shader-language, closed-cache, audio/FFT and texture/sprite compatibility investigations. This milestone resolves none of those independent gaps.

Production work also needs high-resolution Release profiling of the extra image copies, GPU-memory limits, other GL backends, dependency patch upgrades, and distributable license/source delivery. Hex's existing render-thread ownership, transactional replacement, native inserts, patch persistence and composition remain the host foundation.

## Reproduction

From the application checkout:

```sh
cmake --build build-milk --target milk_module_test vizard --parallel 2
build-milk/milk_module_test --gpu
```

The existing build directory is a local configured development environment, not a portable setup requirement. A fresh setup uses the pinned dependency configuration in `cmake/MilkDrop.cmake`. Applying the expanded patch over a checkout carrying only the older patch requires a clean pinned dependency checkout; the patch helper intentionally rejects an unknown mixed source state.

The owned fixtures are in `tests/fixtures/milk/`: inputs 05, 07, 08 and 09 plus the classic gradient regression. The standalone [native probe](milkdrop3-native-probe.cpp) takes preset path, output PPM path and frame count. It links `src/renderer/milk_runtime.cpp`, the configured GLAD/GLFW libraries and the patched projectM shared library.
