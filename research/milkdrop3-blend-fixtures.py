"""Generate original MILK2 inputs for manual reference-render investigation.

Usage: python3 milkdrop3-blend-fixtures.py OUTPUT_DIRECTORY
Produces 30 mask tests, 30 feedback tests and four classic baseline presets.
No renderer is invoked. Feedback seeds use a preset-local frame counter.
"""
import argparse
from pathlib import Path

PATTERNS = (
    "zoom side plasma plasma2 plasma3 cercle square snail snail2 snail3 "
    "triangle donuts corner patches checkerboard bubbles stars stars2 clock "
    "nuclear arrow cisor wave curtain vertical horizontal linesvertical "
    "lineshorizontal cross cross2"
).split()


def preset(kind, side):
    color = "float3(1,0,0)" if side == 0 else "float3(0,0,1)"
    center = "float2(0.25,0.5)" if side == 0 else "float2(0.75,0.5)"
    shift = "float2(0.005,0)" if side == 0 else "float2(-0.005,0)"
    warp = ["shader_body", "{", "ret = tex2D(sampler_main, uv).xyz;", "}"]
    comp = ["shader_body", "{", f"ret = {color};", "}"]
    if kind == "feedback":
        warp = [
            "shader_body", "{",
            f"ret = tex2D(sampler_main, uv + {shift}).xyz * 0.96;",
            f"float2 d = uv - {center};",
            f"if (q1 <= 6.0) ret += {color} * exp(-dot(d,d)*1200.0);",
            "}",
        ]
        comp = ["shader_body", "{", "ret = tex2D(sampler_main, uv).xyz;", "}"]
    lines = [
        f"NAME=Hex reference {kind} {'red' if side == 0 else 'blue'}",
        "MILKDROP_PRESET_VERSION=201", "PSVERSION=3", "PSVERSION_WARP=3",
        "PSVERSION_COMP=3", "[preset00]", "fDecay=1.0", "fGammaAdj=1.0",
        "fWaveAlpha=0.0", "fVideoEchoAlpha=0.0", "bMotionVectorsOn=0",
        "ob_size=0.0", "ib_size=0.0",
    ]
    if kind == "feedback":
        lines.extend(["per_frame_init_1=framecounter=0;", "per_frame_1=framecounter=framecounter+1; q1=framecounter;"])
    lines.extend(f"warp_{i}=`{line}" for i, line in enumerate(warp, 1))
    lines.extend(f"comp_{i}=`{line}" for i, line in enumerate(comp, 1))
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    for kind in ("mask", "feedback"):
        for pattern in PATTERNS:
            target = args.output / f"Hex reference {kind} {pattern}.milk2"
            if target.exists():
                raise FileExistsError(f"Refusing to overwrite {target}")
            header = (
                f"blending_pattern={pattern}\nblending_progress=0.5\n"
                "blending_direction=1\nrandom_1=0.2\nrandom_2=0.4\n"
                "random_3=0.6\nrandom_4=0.8\nrandom_5=0.5\n"
            )
            body = "\n".join(
                f"[PRESET{side+1}_BEGIN]\n{preset(kind, side)}\n[PRESET{side+1}_END]"
                for side in range(2)
            )
            target.write_text(header + body + "\n", encoding="utf-8")
    for kind in ("mask", "feedback"):
        for side in range(2):
            target = args.output / f"Hex baseline {kind} {side}.milk"
            if target.exists():
                raise FileExistsError(f"Refusing to overwrite {target}")
            target.write_text("\n".join(preset(kind, side).splitlines()[1:]) + "\n", encoding="utf-8")
    print(f"Created 64 reference inputs in {args.output}; rendering is unverified.")


if __name__ == "__main__":
    main()
