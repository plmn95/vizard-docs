# MilkDrop 3 primitive ordering and shader compatibility investigation

3 October 2026. This continues the [shared stage prototype](milkdrop3-shared-stage-prototype.md) inside Hex Composer's native MILK module. Hex keeps its other generators, effects, modulation and composition capabilities. The implementation is local and experimental.

The owned reference tests establish two further parts of the double preset pipeline: custom shapes enter the common canvas after the spatial warp blend, and composite blur includes current-frame drawing. They also expose recoverable HLSL compiler failures. These findings justify concrete engine changes; they do not establish full MilkDrop 3 visual fidelity.

## Reference protocol and limits

Eighteen owned ordering inputs and fourteen owned progress inputs were run through official MilkDrop 3.37 under Wine on this Mac. Each reference input has two captures, its source hash and measured crop in an archived manifest. Separate negative-progress and fragmented-equation inputs each have two captures. The renderer's browser directory and filenames were visually verified before the valid sweep. An earlier sweep selected files from the wrong directory and was discarded; none of those images is included here.

Reference images are color-managed ScreenCaptureKit screenshots at 600 by 632 pixels. Measurements crop `(4,55,596,625)`. Native OpenGL readback is 600 by 580, cropped `(4,4,596,574)`. Screenshot and readback intensities are not interchangeable linear shader values. Claims below use ordering, phase, source regions and repeated controls; they do not equate their raw RGB values.

The Wine reference has a polygon geometry anomaly: a four-sided shape loses a quadrant and high-sided polygons can collapse to a thin wedge. Its cause remains unresolved. The host does not imitate that anomaly. Shape ordering and opacity remain supported by controls that repeat across several masks; exact polygon rasterization requires a native Windows reference.

## Custom shapes share the mixed canvas

Input 04 draws overlapping opaque red shapes in preset A and blue shapes in preset B, with identity composites. The official output has uniform overlap color. Changing the mask from circle to vertical or horizontal produces pixel-identical reference images for these controls. The previous native implementation put shapes into separate pre-mask warp results and therefore produced red and blue spatial divisions.

The updated implementation mixes warp images first, then draws B's shapes with opacity `progress`, followed by A's shapes with opacity `1-progress`. At progress 0.5, native overlap is approximately R127 B64; the half-opacity control is approximately R64 B48. These match the expected overdraw recurrence and the reference's qualitative color relationship. A cross-preset detector also strengthens from native G66 to G127 after this correction.

The native pipeline now evaluates both presets once, warps the common previous image, mixes the two warp results, draws each primitive group in B then A order, generates each preset's current-image blur, composites the common canvas through both shaders, and mixes those outputs. The common pre-composite image becomes the next frame's feedback. The host stage API includes `projectm_opengl_render_milk_primitives` alongside the warp and composite calls.

The same scheduling hook is available for custom waves and the remaining primitive groups. Default waveform, darkened center, borders and motion-vector interaction do not yet have an equally complete reference comparison. Do not extrapolate the shape result into a claim that every primitive is exact.

## Composite blur uses current drawing

Alternating red warp injection gives the reference red and green channels in the same phase when the composite reads red from the current image and green from `GetBlur1`. Alternating red shapes on a black warp gives the same result. The previous engine blurred the prior feedback image, producing green in the opposite phase.

Blur generation now follows the common-image copy and primitive drawing, immediately before the composite. The following warp still has the retained blur from the preceding completed frame. Native GPU checks explicitly test both the on and off frames for warp and shape injection. The double-preset phase controls also agree qualitatively with the official reference.

This intentionally changes classic presets that read composite blur. A classic gradient and feedback control that does not use blur remains a separate regression check; it cannot prove that every classic preset remains pixel-identical.

## Shape geometry supports 500 sides

The [official feature documentation](https://github.com/milkdrop2077/MilkDrop3/blob/main/README.md) specifies a 500-side limit. The pinned projectM engine clamped shapes to 100 sides. The patch now enlarges vertex storage and accepts 500. An owned native raster test at 1024 by 1024 proves that 100 and 500 produce distinct images. The Wine geometry anomaly prevents treating its outline as a reliable fidelity target.

## Progress and zoom controls

The fourteen progress controls establish that `zoom` is a uniform color mix for the tested constant-color presets at progress 0, 0.1, 0.25, 0.5, 0.75 and 1. The prototype previously applied a radial field. It now uses the uniform weight for this pattern. Spatial transformations on asymmetric images remain unverified.

The official renderer gives the second preset's solid color at saved progress 1.5, 2 and 3, and the first preset's solid color at -1. The importer preserves the original source text and saturates the derived render progress into 0 to 1. NaN and non-finite values remain errors. Circle still has a spatial transition across the tested range. Other masks need their own curves and endpoints: the earlier cross2 control demonstrates that a blanket endpoint assumption is insufficient for every mode.

## Shader parser failures have concrete causes

The selected installed reference corpus produced seven HLSL parser failures before these fixes. Temporary diagnostics identified five references to an undeclared `MilkDrop3_001` and two syntax errors at local `aspect` declarations. The diagnostic logger was removed after collecting evidence.

`MilkDrop3_001` and `MilkDrop3_008` are shipped JPEG texture names. HLSL permits `sampler MilkDrop3_001;`, but projectM discovers conventional `sampler_` names and removes declarations before parsing. The patch normalizes used bare sampler identifiers before texture discovery. Unused declarations must not trigger new missing-asset failures. An owned embedded green bitmap test checks actual sampling, not just successful shader compilation.

Replacing the built-in `aspect` macro with an equivalent bound vector uniform allows a local scalar with that name. Direct3D compilation of four owned minimal controls additionally confirms that a shadowing declaration's initializer can read the outer vector. The parser must introduce the local binding after parsing that initializer. Both changes preserve shader source in the imported asset. Fractal Pumpkin also uses the standard HLSL `tanh` intrinsic, which was absent from this parser's builtin function table. The patch registers its float scalar and vector overloads, mapped to GLSL's native intrinsic. An owned GPU control checks the numeric result. [Microsoft tanh documentation](https://learn.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-tanh).

The Direct3D experiment used the compiler DLL available in the Wine environment. It is a compiler behavior comparison, not a native Windows rendering result. [Microsoft HLSL variable documentation](https://learn.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-variable-syntax) provides the declaration context; the specific shadowing result is measured locally.

Earlier real-preset runs produced macOS GL texture warnings despite returning GL error 0. The subsequent [PR validation](milkdrop3-pr-handoff.md) traces the warning to initial blur bindings and fixes that path; its repeated selected corpus contains no such warning. A successful load and a short render therefore do not prove that every texture or visual is correct. The three-frame corpus smoke also includes cold shader compilation and cannot establish steady-state performance.

## Numbered equation entries are fragments

The two remaining equation failures were `golden mirror5` and `liquid gold`. Both split the identifier `is_beat` between `per_frame_22` and `per_frame_23`. ProjectM inserted a newline and parsed two identifiers. The inspected old MilkDrop routine strips the stored linefeed character, despite its comment describing a space replacement.

An owned double control splits `long_name` across two entries, assigns it 0.25, and displays that value as red. Both official captures show the expected quarter-red signal. This verifies the fragment behavior in the current reference, independently of the old source comment. The equation reader now removes line comments before joining numbered fragments without adding whitespace. HLSL shader entries retain their newlines. An owned GPU check covers both a split identifier and a split decimal literal, with an intervening line comment. The two real presets now pass that equation stage but both subsequently report the missing texture `worms`; they are not counted as supported renders.

## Closed shader handling remains a separate path

The bare sampler failures are unrelated to closed shader caches. Actual closed references use `MD31` and `MD32`. The runtime now rejects those references with an explicit unsupported-cache diagnostic, rather than silently displaying placeholder shader text. Original preset files are not changed.

The prior [cache investigation](milkdrop3-format-and-shader-findings.md) translated 1151 ordinary legacy bytecode payloads, but did not decode the third cache or establish its identifier mapping. That remains the relevant next step for closed shaders. A working text compiler alone cannot resolve it.

The closed-reference audit identifies 77 classic presets in the installed reference directory and confirms that all 77 reject explicitly. The earlier extracted directory contained 43; these are separate recorded inventories.

The current installed reference directory differs from the earlier extracted package. Its selected smoke inputs are explicitly listed and hashed in [the corpus manifest](milkdrop3-order-assets/corpus-inputs.json). Counts must be tied to that manifest instead of being presented as support for every community preset or every historical package.

## Source availability does not remove the remaining work

The [official code tree](https://github.com/milkdrop2077/MilkDrop3/tree/6b39088f789441e18cc1665519ee7ffe439cece5/code) has a [BSD 3-Clause license](https://github.com/milkdrop2077/MilkDrop3/blob/6b39088f789441e18cc1665519ee7ffe439cece5/code/LICENSE.txt), but the inspected renderer is older: its source lacks the current double wrapper, has the old four blend types and clamps shapes to 100. Its shape transition order corroborates the overdraw hypothesis, while its prior-image blur scheduling does not match the current binary experiments. It cannot be represented as the shipped 3.37 implementation.

The inspected [MilkDrop3 fork](https://github.com/shanevbg/MilkDrop3/tree/6269be8bb5dc0e20a830bcdbd90e114043a9bdef) also does not supply the complete current double-preset engine. No noncommercial MDropDX12 renderer source was copied into Hex.

## Final validation

The development app and MILK test executable build successfully. The expanded native GPU suite passes, including shared feedback, primitive opacity/order, current-frame blur, 500-sided geometry, shader sampler aliases, numeric `tanh`, initializer shadowing, equation fragments, progress saturation and existing MILK integration contracts. Patch persistence, insert effects and the modulation catalog checks pass. The complete 34-file engine patch applies cleanly to pristine files from the pinned revision.

The final selected corpus result is **122 of 162 loaded and rendered**, with **40 explicit rejections: 24 sprite presets, 10 missing-texture presets and 6 closed-cache presets**. There are no observed HLSL or equation parser failures in this run. Seven earlier HLSL failures were recovered. Two equation failures were corrected but expose missing assets. Six earlier placeholder renders are now excluded by the closed-reference check. These counts describe this loading smoke test, not visual compatibility.

The ten missing-asset cases were tested separately with three clearly synthetic green bitmap textures named `worms`, `grad3` and `pic`. All ten then load and render with GL error 0; no additional compiler failure appears. That test isolates the asset blocker and is not included as successful compatibility. Synthetic textures are not installed into Hex or substituted during normal import. These historical diagnostic logs retain the texture warning; the later PR validation fixes initial blur bindings.

The classic gradient/feedback control remains pixel-identical after 180 frames: before and final PPM SHA256 `daac7f4813cd1392e9f0415579a66a815b8bbf8d52e88ac8b2da0ae60a19220b`. This is one controlled regression; classic composite-blur behavior changes intentionally. [Validation and corpus log](milkdrop3-order-assets/final-corpus.txt), [rejection inventory](milkdrop3-order-assets/final-rejections.json), [synthetic asset protocol](milkdrop3-order-assets/synthetic-asset-diagnostic.json), [synthetic asset results](milkdrop3-order-assets/synthetic-asset-results.txt).

## Evidence and remaining work

The [ordering inputs](milkdrop3-order-assets/inputs), [valid reference captures](milkdrop3-order-assets/reference/manifest.json), [native before results](milkdrop3-order-assets/before/manifest.json), [native after results](milkdrop3-order-assets/after/manifest.json) and [progress results](milkdrop3-order-assets/progress-reference/manifest.json) are local review artifacts. Generators, compiler controls, source hashes and validation logs accompany them.

The next investigations are the third shader cache and identifier lookup, sprite expressions and burn/layer scheduling, the ten missing masks and the remaining approximate curves, other asset behavior and missing assets, then motion vectors, echo and transitions between complete doubles. Native Windows comparison remains needed for Wine-sensitive geometry and final fidelity. None of those gaps should be concealed behind a general compatibility percentage.
