import React, { useState } from "react";
import { CaptionStylingContainer } from "./index";
import type { CaptionStyle } from "./types";

const CaptionStylingDemo: React.FC = () => {
  const [currentStyle, setCurrentStyle] = useState<CaptionStyle | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleStyleChange = (style: CaptionStyle) => {
    setCurrentStyle(style);
    console.log("Style changed:", style);
  };

  const handlePresetSelect = (presetName: string) => {
    setSelectedPreset(presetName);
    console.log("Preset selected:", presetName);
  };

  const handleExportStyle = () => {
    if (currentStyle) {
      const styleJson = JSON.stringify(currentStyle, null, 2);
      const blob = new Blob([styleJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "caption-style.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImportStyle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const style = JSON.parse(e.target?.result as string);
          setCurrentStyle(style);
          setSelectedPreset(null);
        } catch (error) {
          console.error("Failed to parse style file:", error);
          alert("Invalid style file format");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-text-primary mb-4">
            Caption Styling Configuration
          </h1>
          <p className="text-dark-text-secondary">
            Configure your video captions with advanced styling options,
            animations, and effects. Choose from presets or create your own
            custom style.
          </p>
        </div>

        {/* Import/Export Controls */}
        <div className="mb-6 p-4 bg-dark-bg-secondary rounded-lg border border-dark-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-dark-text-primary mb-2">
                Style Management
              </h3>
              <p className="text-sm text-dark-text-secondary">
                Import or export your caption styles for reuse across projects.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <label className="px-4 py-2 bg-dark-bg-tertiary text-dark-text-primary rounded-lg cursor-pointer hover:bg-dark-bg-primary transition-colors duration-200 border border-dark-border-subtle">
                📁 Import Style
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportStyle}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleExportStyle}
                disabled={!currentStyle}
                className="px-4 py-2 bg-dark-accent-primary text-white rounded-lg hover:bg-dark-accent-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-dark-accent-primary"
              >
                💾 Export Style
              </button>
            </div>
          </div>
        </div>

        {/* Main Styling Interface */}
        <CaptionStylingContainer
          initialStyle={currentStyle || undefined}
          onStyleChange={handleStyleChange}
          onPresetSelect={handlePresetSelect}
          previewMode={true}
          className="mb-8"
        />

        {/* Style Information */}
        {currentStyle && (
          <div className="mt-8 p-6 bg-dark-bg-secondary rounded-lg border border-dark-border-subtle">
            <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
              Current Style Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-dark-text-primary">
                  Typography
                </h4>
                <div className="text-xs text-dark-text-secondary space-y-1">
                  <div>
                    Font: {currentStyle.fontFamily} {currentStyle.fontSize}px
                  </div>
                  <div>Weight: {currentStyle.fontWeight}</div>
                  <div>Color: {currentStyle.color}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-dark-text-primary">
                  Position
                </h4>
                <div className="text-xs text-dark-text-secondary space-y-1">
                  <div>Position: {currentStyle.position}</div>
                  <div>Margin: {currentStyle.margin || 0}px</div>
                  <div>Padding: {currentStyle.padding}px</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-dark-text-primary">
                  Effects
                </h4>
                <div className="text-xs text-dark-text-secondary space-y-1">
                  <div>Animation: {currentStyle.type || "none"}</div>
                  <div>Duration: {currentStyle.animationDuration || 0}ms</div>
                  <div>
                    Background: {currentStyle.backgroundColor ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-dark-bg-tertiary rounded border border-dark-border-subtle">
              <h5 className="text-xs font-medium text-dark-text-primary mb-2">
                JSON Configuration
              </h5>
              <pre className="text-xs text-dark-text-secondary overflow-x-auto">
                {JSON.stringify(currentStyle, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="mt-8 p-6 bg-dark-bg-secondary rounded-lg border border-dark-border-subtle">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
            How to Use
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-dark-text-primary mb-2">
                Getting Started
              </h4>
              <ul className="text-xs text-dark-text-secondary space-y-1">
                <li>• Choose a preset style to start with</li>
                <li>• Customize typography, position, and effects</li>
                <li>• Use the live preview to see changes in real-time</li>
                <li>• Export your style for use in other projects</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-dark-text-primary mb-2">
                Advanced Features
              </h4>
              <ul className="text-xs text-dark-text-secondary space-y-1">
                <li>• Create custom animations with easing functions</li>
                <li>• Use individual border controls for unique effects</li>
                <li>• Apply text and box shadows for depth</li>
                <li>• Save custom presets for future use</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptionStylingDemo;
