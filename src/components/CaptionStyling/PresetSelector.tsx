import React from "react";
import type { CaptionStyle } from "./types";

export interface Preset {
  name: string;
  displayName: string;
  thumbnail?: string;
  style: CaptionStyle;
}

export interface PresetSelectorProps {
  selectedPreset: string | null;
  onPresetChange: (preset: string) => void;
  availablePresets: Preset[];
  className?: string;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({
  selectedPreset,
  onPresetChange,
  availablePresets,
  className = "",
}) => {
  const getPresetThumbnail = (preset: Preset) => {
    // Generate a simple visual representation of the preset
    const style = preset.style;
    return (
      <div
        className="w-full h-16 rounded-lg border border-dark-border-subtle flex items-center justify-center text-xs font-medium transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: style.background?.enabled
            ? style.background.color
            : "rgba(0, 0, 0, 0.8)",
          color: style.typography?.fontColor || "#ffffff",
          fontSize: Math.min(style.typography?.fontSize || 16, 12),
          fontFamily: style.typography?.fontFamily || "Arial",
          fontWeight:
            style.typography?.fontWeight === "bold"
              ? 700
              : style.typography?.fontWeight === "light"
              ? 300
              : 400,
          borderRadius: `${Math.min(style.background?.borderRadius || 4, 8)}px`,
          padding: `${Math.min(style.background?.padding?.top || 8, 4)}px`,
          opacity: style.effects?.opacity || 1,
          boxShadow:
            style.shadow?.enabled && style.shadow?.blur
              ? `0 ${style.shadow.offsetY || 0}px ${style.shadow.blur || 0}px ${
                  style.shadow.color || "#000000"
                }`
              : "none",
        }}
      >
        {preset.displayName}
      </div>
    );
  };

  return (
    <div className={`preset-selector ${className}`}>
      <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
        Style Presets
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availablePresets.map((preset) => (
          <div
            key={preset.name}
            className={`preset-card cursor-pointer transition-all duration-300 ${
              selectedPreset === preset.name
                ? "ring-2 ring-dark-accent-primary scale-105"
                : "hover:scale-105 hover:ring-1 hover:ring-dark-border-subtle"
            }`}
            onClick={() => onPresetChange(preset.name)}
          >
            <div className="preset-thumbnail mb-2">
              {getPresetThumbnail(preset)}
            </div>

            <div className="preset-info text-center">
              <span
                className={`text-sm font-medium ${
                  selectedPreset === preset.name
                    ? "text-dark-accent-primary"
                    : "text-dark-text-secondary"
                }`}
              >
                {preset.displayName}
              </span>

              {selectedPreset === preset.name && (
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-dark-accent-primary text-white">
                    ✓ Selected
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Custom option */}
        <div
          className={`preset-card cursor-pointer transition-all duration-300 ${
            selectedPreset === null
              ? "ring-2 ring-dark-accent-primary scale-105"
              : "hover:scale-105 hover:ring-1 hover:ring-dark-border-subtle"
          }`}
          onClick={() => onPresetChange("custom")}
        >
          <div className="preset-thumbnail mb-2">
            <div className="w-full h-16 rounded-lg border-2 border-dashed border-dark-border-subtle flex items-center justify-center text-xs font-medium text-dark-text-secondary hover:text-dark-text-primary transition-colors">
              <div className="text-center">
                <div className="text-lg mb-1">🎨</div>
                <div>Custom</div>
              </div>
            </div>
          </div>

          <div className="preset-info text-center">
            <span
              className={`text-sm font-medium ${
                selectedPreset === null
                  ? "text-dark-accent-primary"
                  : "text-dark-text-secondary"
              }`}
            >
              Custom Style
            </span>

            {selectedPreset === null && (
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-dark-accent-primary text-white">
                  ✓ Selected
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle">
        <p className="text-xs text-dark-text-secondary text-center">
          💡 <strong>Tip:</strong> Select a preset to start with a
          pre-configured style, or choose "Custom" to create your own unique
          caption style.
        </p>
      </div>
    </div>
  );
};

export default PresetSelector;
