import React, { useState } from "react";
import { CaptionStylingContainer } from "./index";
import type { CaptionStyle } from "./types";

// Example integration with your existing app
const CaptionStylingIntegration: React.FC = () => {
  const [currentStyle, setCurrentStyle] = useState<CaptionStyle | null>(null);
  const [isStylingOpen, setIsStylingOpen] = useState(false);

  const handleStyleChange = (style: CaptionStyle) => {
    setCurrentStyle(style);
    // Here you would typically:
    // 1. Update your video player's caption style
    // 2. Save to localStorage or send to backend
    // 3. Update the preview in real-time
    console.log("Caption style updated:", style);
  };

  const handlePresetSelect = (presetName: string) => {
    console.log("Preset selected:", presetName);
    // You might want to show a notification or update UI state
  };

  const handleApplyStyle = () => {
    if (currentStyle) {
      // Apply the style to your video captions
      // This would integrate with your video player component
      console.log("Applying style to video captions:", currentStyle);
      setIsStylingOpen(false);
    }
  };

  const handleCancelStyling = () => {
    setIsStylingOpen(false);
    // Optionally reset to previous style
  };

  return (
    <div className="caption-styling-integration">
      {/* Your existing app content */}
      <div className="main-content">
        {/* Video player, controls, etc. */}

        {/* Style Configuration Button */}
        <button
          onClick={() => setIsStylingOpen(true)}
          className="px-4 py-2 bg-dark-accent-primary text-white rounded-lg hover:bg-dark-accent-secondary transition-colors duration-200"
        >
          🎨 Configure Caption Style
        </button>
      </div>

      {/* Caption Styling Modal/Overlay */}
      {isStylingOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-dark-bg-primary rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-dark-bg-primary border-b border-dark-border-subtle p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-dark-text-primary">
                Caption Style Configuration
              </h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCancelStyling}
                  className="px-4 py-2 bg-dark-bg-tertiary text-dark-text-secondary rounded-lg hover:bg-dark-bg-secondary transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyStyle}
                  disabled={!currentStyle}
                  className="px-4 py-2 bg-dark-accent-primary text-white rounded-lg hover:bg-dark-accent-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Style
                </button>
              </div>
            </div>

            <div className="p-6">
              <CaptionStylingContainer
                initialStyle={currentStyle || undefined}
                onStyleChange={handleStyleChange}
                onPresetSelect={handlePresetSelect}
                previewMode={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Current Style Display */}
      {currentStyle && (
        <div className="mt-4 p-4 bg-dark-bg-secondary rounded-lg border border-dark-border-subtle">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-2">
            Current Caption Style
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-dark-text-secondary">Font:</span>
              <span className="text-dark-text-primary ml-2">
                {currentStyle.fontFamily} {currentStyle.fontSize}px
              </span>
            </div>
            <div>
              <span className="text-dark-text-secondary">Position:</span>
              <span className="text-dark-text-primary ml-2 capitalize">
                {currentStyle.position}
              </span>
            </div>
            <div>
              <span className="text-dark-text-secondary">Animation:</span>
              <span className="text-dark-text-primary ml-2 capitalize">
                {currentStyle.type || "none"}
              </span>
            </div>
            <div>
              <span className="text-dark-text-secondary">Background:</span>
              <span className="text-dark-text-primary ml-2">
                {currentStyle.backgroundColor ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptionStylingIntegration;
