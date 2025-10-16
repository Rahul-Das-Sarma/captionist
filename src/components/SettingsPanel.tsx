import React from "react";

interface SettingsPanelProps {
  captionStyle: "reel" | "classic" | "bounce" | "slide";
  captionPosition: "bottom" | "center" | "top";
  onCaptionStyleChange: (
    style: "reel" | "classic" | "bounce" | "slide"
  ) => void;
  onCaptionPositionChange: (position: "bottom" | "center" | "top") => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  captionStyle,
  captionPosition,
  onCaptionStyleChange,
  onCaptionPositionChange,
}) => {
  return (
    <div className="bg-dark-bg-secondary rounded-3xl p-6 mb-5 border border-dark-border-subtle shadow-dark-primary">
      <h4 className="mb-4 text-lg font-bold text-dark-text-primary text-shadow-dark-glow">
        Caption Settings
      </h4>
      <div className="flex gap-5 flex-wrap">
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
    </div>
  );
};

export default SettingsPanel;
