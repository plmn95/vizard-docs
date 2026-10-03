# MilkDrop 3 double preset and shader cache investigation

Updated follow-up: [primitive ordering, current-frame blur, progress and shader parser findings](milkdrop3-primitive-and-shader-investigation.md). That report supersedes the earlier inherited primitive and blur scheduling assumptions and records the current local implementation.

Investigated 2 October 2026. This report answers whether inspecting actual preset files can resolve the remaining compatibility questions. It supplements [the Hex integration strategy](milkdrop-compatibility-and-adoption-strategy.md).

Yes: the files reveal the format, dependencies and concrete implementation paths. They do not contain every rendering algorithm. The remaining work is now more specific than an unexplained compatibility gap.

## Evidence and reproducibility

The analysis used the previously extracted official package in `/private/tmp/hex-milkdrop3-package/Milkdrop3` and the downloaded executable `/private/tmp/hex-MilkDrop3-official.exe`, SHA256 `e155ca7e600acbb59e91c6ca55a3bcf2c8c7358cead808429ecb8d158bd888d5`. The initial format pass inspected the executable as data. Subsequent local reference experiments executed its installer and extracted renderer. The first OpenGL run failed; a follow-up Vulkan run recovered working reference rendering and capture on this Mac. See [reference experiment findings](milkdrop3-reference-experiment.md).

For the bytecode experiment, MojoShader was built in temporary space from revision `ad5dff84830c2863c841f4b1f4e3df78c705b383`. The tested binaries and logs are under `/private/tmp/hex-milk-mojoshader-build` and `/private/tmp/hex-milk-bytecode-research`; these temporary paths are not durable release artifacts. No proprietary shader code or cache payload is reproduced in this document.

## What the double preset files establish

All 146 inspected .milk2 files contain two embedded classic preset sections bounded by PRESET1 and PRESET2 begin/end markers. All contain a named blending pattern, numeric progress, direction, and five random values. Twenty distinct pattern names occur. Twenty-four files carry a sprite header and sprite data.

For example, the header of `000.milk2` specifies the pattern `cercle`, progress `0.45`, direction `-1`, and five numeric random values. Each embedded section contains its own preset parameters, expression code and shader source. The wrapper does not contain a formula defining cercle.

One sprite example includes its image path, color key, layer, blend, opacity, burn flag, position, scale, rotation, speed, repetition and expression code. It is therefore more than an image pasted onto the final output. Another file has an unusual SPRITE1 marker, so parsing must be tested beyond one idealized example.

The executable's visible pattern labels enumerate thirty names: zoom, side, plasma, plasma2, plasma3, cercle, square, snail, snail2, snail3, triangle, donuts, corner, patches, checkerboard, bubbles, stars, stars2, clock, nuclear, arrow, cisor, wave, curtain, vertical, horizontal, linesvertical, lineshorizontal, cross and cross2.

Ten labels have no example in the inspected double-preset corpus: checkerboard, bubbles, stars2, clock, nuclear, cisor, wave, lineshorizontal, cross and cross2. Supporting every shipped example would still leave these modes untested.

The official changelog also says some blend algorithms changed in version 3.33. Exact behavior must target a pinned application version. A preset's creation label does not itself specify every subsequent engine change. [MilkDrop 3 documentation](https://github.com/milkdrop2077/MilkDrop3).

## Why reading the file is insufficient for exact blending

The name and inputs identify which engine algorithm to run; they do not define that algorithm. Several mathematically different masks can be called circle or plasma and accept the same progress and random values. The file also does not state where the mask is applied relative to warp, primitive drawing, composite shaders and feedback.

The public historical MilkDrop source contains a mesh-based blend generator with directional, radial and plasma transitions. This establishes a useful legacy reference, but the inspected public tree does not contain the modern thirty-name implementation. Replacing it with a final-image crossfade may produce a plausible picture while changing state accumulation.

The proposed way to recover behavior is a controlled reference experiment. First render two constant colors to measure the blend weights across the image. Sweep progress, direction, random inputs, aspect ratio and dimensions. Then use two distinct feedback impulses to determine whether the engines retain independent images or share intermediate state. Finally test primitives, sprites, shaderless presets and transitions between complete double presets. A mask experiment alone cannot settle feedback architecture.

The accompanying fixture generator creates original diagnostic presets for all thirty named patterns. These are prepared test inputs, not reference results. An initial Wine Staging 11.18 experiment failed under OpenGL. A follow-up recovered visible output with Wine’s Vulkan backend through MoltenVK, and captured it using native ScreenCaptureKit. Constant-red and constant-blue baselines now render correctly. All thirty double-preset mask cases were captured twice at one fixed configuration, with pixel-identical measured repeats. Four additional cross2 captures show that progress 1 does not necessarily produce a uniform endpoint. The revised generator fixes classic-file headers and uses a preset-local frame counter for feedback seeding; subsequent continuous probes demonstrate shared intermediate-image interaction and feedback coupling. Exact pipeline reconstruction remains unverified. [Pipeline findings](milkdrop3-pipeline-findings.md). [Execution findings and next protocol](milkdrop3-reference-experiment.md).

## What closed presets actually contain

Forty-three classic preset files contain MD31 or MD32 identifiers: 36 occurrences of MD31 and 26 of MD32, for 62 references in total. No inspected .milk2 file contains either identifier. Closed shader handling is therefore not inherent to the double-preset wrapper; it is another preset-runtime capability.

Several laser presets contain only simple passthrough or decay shader text alongside these identifiers. That source is insufficient to describe the advertised visual. MDropDX12's own local custom-shader documentation independently describes these identifiers as selecting externally stored shaders and identifies the visible text as a placeholder. Its documentation also acknowledges that invented substitutes do not reproduce the original. That is corroborating maintainer evidence, not reused implementation code. [MDropDX12 custom shader documentation](https://github.com/shanevbg/MDropDX12/blob/main/docs/custom_shaders.md).

This reveals a potential false positive in any compatibility audit: a protected preset can compile and render its placeholder without rendering its intended shader. Detect these identifiers explicitly. The previous 159-file test count is unchanged; it was not a test of these 43 files.

## The standard shader caches are understood enough to test

The package contains three pairs of binary index and data files. For the first two pairs, an inferred 24-byte index record contains an identifier followed by offset and length represented as high and low 32-bit words. Every inferred byte range is valid, records are contiguous, and together they cover the entire data file. Every payload ends with a Direct3D shader END token.

| Cache pair | Records | Recognized shader version tokens | Byte ranges and end tokens |
| --- | --- | --- | --- |
| shaders.bin and shaders.dat | 572 | 225 ps 2.0, 275 ps 2.1, 72 ps 3.0 | All validated structurally |
| shaders2.bin and shaders2.dat | 579 | 579 ps 3.0 | All validated structurally |
| shaders3.bin and shaders3.dat | Index size equals 178 records of 24 bytes | No plain shader version tokens identified | Layout and encoding remain unverified |

The numeric version tokens identify Direct3D shader models, rather than DXIL or a modern DXBC container. Microsoft documents this token format. [Shader version token](https://learn.microsoft.com/en-us/windows-hardware/drivers/display/version-token), [Shader code format](https://learn.microsoft.com/en-us/windows-hardware/drivers/display/shader-code-format).

All 1,151 extracted standard-cache payloads were passed through MojoShader's testparse tool. Its Direct3D disassembly, GLSL120 and SPIR-V profiles each reported zero errors for all 1,151 inputs. This was an actual local translation test. It did not compile the generated output on a GPU, bind runtime constants or textures, or compare rendered images.

This changes the architecture recommendation: add a potential legacy bytecode path alongside the source compiler path. MojoShader supports legacy Direct3D bytecode translation and uses a permissive zlib license. It does not replace the source parser, asset resolver or MilkDrop render pipeline. Its generated bindings and host interface still need integration, and its default GLSL profile needs adaptation to Hex's OpenGL context. [MojoShader](https://icculus.org/mojoshader/).

## What remains unknown about the third cache

The third pair does not validate under the plain layout and does not expose ordinary shader headers. Repeated word patterns suggest an encoded or obfuscated variant, but this experiment has not established its algorithm. A simple fixed XOR of the apparent 64-bit identifiers did not produce a meaningful match to the 62 preset references.

The executable contains MD31/MD32 formatting strings and paths to the third cache, but that does not establish the lookup or decoding rules. It is plausible that this cache participates in closed-shader loading; that association remains an inference, not a proven mapping.

Therefore, source absence is not automatically a technical dead end. A verified cache decoder and usable bytecode could support translation without recovering original HLSL. The next technical investigation would trace identifier lookup and shader submission in a Windows reference environment, validate the actual payload format, and test a permitted shader through the bytecode path. Rendering correctness and permission to redistribute or use third-party shader assets must be resolved separately. A permissive translator license does not grant rights to the shaders it translates.

## Updated engineering decision

Treat the double-preset parser as substantially characterized for this corpus. Treat exact blending as a finite behavioral investigation with prepared tests. Treat ordinary legacy shader-bytecode translation as demonstrated at the translation stage. Treat closed-shader cache decoding and mapping as a specific remaining investigation rather than a blanket assertion that closed shaders cannot be supported.

The recovered Mac reference harness can now provide measured masks. The remaining investigations include parameter sweeps, feedback and layer-order tests, and a verified MD31/MD32-to-payload trace. None requires changing Hex into a different product. Any resulting implementation belongs behind its native MILK module.
