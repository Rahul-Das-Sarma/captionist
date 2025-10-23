import React, { useState } from "react";
import { CaptionStylingContainer } from "./CaptionStyling";
import type { CaptionStyle } from "./CaptionStyling/types";

interface SettingsPanelProps {
  captionStyle: "reel" | "classic" | "bounce" | "slide";
  captionPosition: "bottom" | "center" | "top";
  captionStyling: CaptionStyle;
  onCaptionStyleChange: (
    style: "reel" | "classic" | "bounce" | "slide"
  ) => void;
  onCaptionPositionChange: (position: "bottom" | "center" | "top") => void;
  onCaptionStylingChange: (styling: CaptionStyle) => void;
  onPresetSelect: (presetName: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  captionStyle,
  captionPosition,
  captionStyling,
  onCaptionStyleChange,
  onCaptionPositionChange,
  onCaptionStylingChange,
  onPresetSelect,
}) => {
  const [showAdvancedStyling, setShowAdvancedStyling] = useState(false);

  return (
    <div className="bg-dark-bg-secondary rounded-3xl p-6 mb-5 border border-dark-border-subtle shadow-dark-primary">
      <h4 className="mb-4 text-lg font-bold text-dark-text-primary text-shadow-dark-glow">
        Caption Settings
      </h4>

      {/* Basic Settings */}
      <div className="flex gap-5 flex-wrap mb-6">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-sm font-medium mb-2 text-dark-text-secondary">
            Caption Style
          </label>
          <select
            value={captionStyle}
            onChange={(e) =>
              onCaptionStyleChange(
                e.target.value as "reel" | "classic" | "bounce" | "slide"
              )
            }
            className="w-full p-3 border border-dark-border-subtle rounded-lg text-sm bg-dark-bg-tertiary text-dark-text-primary cursor-pointer focus:border-dark-accent-primary focus:outline-none transition-colors duration-300"
          >
            <option value="reel">Reel</option>
            <option value="classic">Classic</option>
            <option value="bounce">Bounce</option>
            <option value="slide">Slide</option>
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-sm font-medium mb-2 text-dark-text-secondary">
            Position
          </label>
          <select
            value={captionPosition}
            onChange={(e) =>
              onCaptionPositionChange(
                e.target.value as "bottom" | "center" | "top"
              )
            }
            className="w-full p-3 border border-dark-border-subtle rounded-lg text-sm bg-dark-bg-tertiary text-dark-text-primary cursor-pointer focus:border-dark-accent-primary focus:outline-none transition-colors duration-300"
          >
            <option value="bottom">Bottom</option>
            <option value="center">Center</option>
            <option value="top">Top</option>
          </select>
        </div>
      </div>

      {/* Advanced Styling Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowAdvancedStyling(!showAdvancedStyling)}
          className="flex items-center gap-2 px-4 py-2 bg-dark-accent-primary text-white rounded-lg hover:bg-dark-accent-secondary transition-colors duration-300"
        >
          <span className="text-sm font-medium">
            {showAdvancedStyling ? "Hide" : "Show"} Advanced Styling
          </span>
          <span
            className={`transform transition-transform duration-300 ${
              showAdvancedStyling ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>
      </div>

      {/* Advanced Styling Panel */}
      {showAdvancedStyling && (
        <div className="mt-4 p-4 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle">
          <CaptionStylingContainer
            initialStyle={captionStyling}
            onStyleChange={onCaptionStylingChange}
            onPresetSelect={onPresetSelect}
            previewMode={true}
          />
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
