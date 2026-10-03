"""Inspect/control an already running MilkDrop reference instance inside Windows/Wine.

Run with Windows Python. No preset is installed or edited by this helper.
Examples: python helper.py inspect; python helper.py audio;
          python helper.py load 5 --lock; python helper.py close-browser
Load assumes the preset browser is initially hidden. Verify its ordering first.
"""
import argparse
import ctypes as ctypes
import json
import time
from ctypes import wintypes

user32 = ctypes.WinDLL("user32", use_last_error=True)
callback_type = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)
user32.EnumWindows.argtypes = [callback_type, wintypes.LPARAM]
user32.EnumChildWindows.argtypes = [wintypes.HWND, callback_type, wintypes.LPARAM]
user32.GetWindowTextW.argtypes = [wintypes.HWND, wintypes.LPWSTR, ctypes.c_int]
user32.GetClassNameW.argtypes = [wintypes.HWND, wintypes.LPWSTR, ctypes.c_int]
user32.PostMessageW.argtypes = [wintypes.HWND, wintypes.UINT, wintypes.WPARAM, wintypes.LPARAM]


def describe(handle):
    title = ctypes.create_unicode_buffer(2048)
    kind = ctypes.create_unicode_buffer(256)
    user32.GetWindowTextW(handle, title, len(title))
    user32.GetClassNameW(handle, kind, len(kind))
    return {"handle": handle, "title": title.value, "class": kind.value}


def windows():
    result = []

    def visit(handle, unused):
        item = describe(handle)
        if item["title"]:
            item["children"] = []

            def child(child_handle, unused):
                item["children"].append(describe(child_handle))
                return True

            user32.EnumChildWindows(handle, callback_type(child), 0)
            result.append(item)
        return True

    user32.EnumWindows(callback_type(visit), 0)
    return result


def post(handle, message, value):
    if not user32.PostMessageW(handle, message, value, 1):
        raise ctypes.WinError(ctypes.get_last_error())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["inspect", "audio", "load", "close-browser"])
    parser.add_argument("index", nargs="?", type=int)
    parser.add_argument("--lock", action="store_true", help="Toggle the user preset lock once.")
    args = parser.parse_args()
    if args.action == "load" and (args.index is None or args.index < 0):
        parser.error("load requires a nonnegative browser index")
    current = windows()
    if args.action == "inspect":
        print(json.dumps(current, indent=2))
        return
    if args.action == "audio":
        for item in current:
            if item["title"] == "Error" and any("Audio Capture" in child["title"] for child in item["children"]):
                for child in item["children"]:
                    if child["title"] == "OK":
                        post(child["handle"], 0xF5, 0)
                        print("Dismissed observed audio warning")
                        return
        raise SystemExit("Audio warning not present; wait for startup and inspect again")
    renderers = [item for item in current if item["class"] == "Direct3DWindowClass" and item["title"].startswith("MilkDrop 3")]
    if len(renderers) != 1:
        raise SystemExit("Expected exactly one MilkDrop reference renderer")
    handle = renderers[0]["handle"]
    if args.action == "close-browser":
        post(handle, 0x100, 27)
        return
    post(handle, 0x102, ord("l"))
    time.sleep(0.15)
    post(handle, 0x100, 0x24)
    for unused in range(args.index):
        post(handle, 0x100, 0x28)
        time.sleep(0.03)
    time.sleep(0.15)
    post(handle, 0x100, 13)
    time.sleep(0.3)
    post(handle, 0x100, 27)
    if args.lock:
        post(handle, 0x102, ord("`"))
    print("Selected browser index", args.index)


if __name__ == "__main__":
    main()
