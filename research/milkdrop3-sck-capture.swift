import Foundation
import ScreenCaptureKit
import AppKit
let app = NSApplication.shared
app.setActivationPolicy(.prohibited)
Task {
    do {
        let content = try await SCShareableContent.excludingDesktopWindows(true, onScreenWindowsOnly: false)
        let windows = content.windows.filter { ($0.title ?? "").contains("MilkDrop 3.37 - Press F1") }
        guard let window = windows.first else { print("No renderer window"); exit(2) }
        let filter = SCContentFilter(desktopIndependentWindow: window)
        let config = SCStreamConfiguration()
        config.width = Int(window.frame.width)
        config.height = Int(window.frame.height)
        config.showsCursor = false
        config.includeChildWindows = true
        let cg = try await SCScreenshotManager.captureImage(contentFilter: filter, configuration: config)
        let rep = NSBitmapImageRep(cgImage: cg)
        guard let data = rep.representation(using: .png, properties: [:]) else { exit(3) }
        let output = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "/private/tmp/hex-milk-baseline-sck.png"
        try data.write(to: URL(fileURLWithPath: output))
        print("Captured \(window.title ?? "") ID \(window.windowID): \(cg.width)x\(cg.height) -> \(output)")
        exit(0)
    } catch { print("Capture error: \(error)"); exit(1) }
}
app.run()
