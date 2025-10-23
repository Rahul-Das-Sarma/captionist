import React, { useState } from "react";
import type { BackgroundStyle } from "./types";

export interface BackgroundPanelProps {
  style: CaptionStyle;
  onChange: (updates: Partial<CaptionStyle>) => void;
  errors: string[];
  className?: string;
}

const BackgroundPanel: React.FC<BackgroundPanelProps> = ({
  style,
  onChange,
  errors,
  className = "",
}) => {
  const [backgroundColorInput, setBackgroundColorInput] = useState(
    style.backgroundColor || "rgba(0, 0, 0, 0.8)"
  );
  const [isValidBackgroundColor, setIsValidBackgroundColor] = useState(true);

  const handleBackgroundToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({
        backgroundColor: style.backgroundColor || "rgba(0, 0, 0, 0.8)",
      });
    } else {
      onChange({ backgroundColor: "transparent" });
    }
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColorInput(color);

    // Check if it's a valid color (hex or rgba)
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    const rgbaPattern =
      /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/;
    const isValid = hexPattern.test(color) || rgbaPattern.test(color);
    setIsValidBackgroundColor(isValid);

    if (isValid) {
      onChange({ backgroundColor: color });
    }
  };

  const handleOpacityChange = (opacity: number) => {
    // If current background is rgba, update the alpha value
    const currentBg = style.backgroundColor || "rgba(0, 0, 0, 0.8)";
    if (currentBg.startsWith("rgba")) {
      const rgbMatch = currentBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch;
        onChange({ backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})` });
      }
    } else if (currentBg.startsWith("#")) {
      // Convert hex to rgba
      const hex = currentBg.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      onChange({ backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})` });
    }
  };

  const getBackgroundOpacity = () => {
    const bg = style.backgroundColor || "rgba(0, 0, 0, 0.8)";
    if (bg.startsWith("rgba")) {
      const match = bg.match(/,\s*([\d.]+)\)$/);
      return match ? parseFloat(match[1]) : 0.8;
    }
    return 1; // For hex colors, assume full opacity
  };

  const hasError = (field: string) => {
    return errors.some((error) =>
      error.toLowerCase().includes(field.toLowerCase())
    );
  };

  const isBackgroundEnabled =
    style.backgroundColor && style.backgroundColor !== "transparent";

  return (
    <div
      className={`background-panel bg-dark-bg-secondary rounded-lg p-6 border border-dark-border-subtle ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-dark-text-primary">
          Background & Effects
        </h3>
        <div className="text-xs text-dark-text-secondary">
          Caption background styling
        </div>
      </div>

      <div className="space-y-6">
        {/* Background Toggle */}
        <div className="form-group">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-dark-text-primary">
              Enable Background
            </label>
            <button
              onClick={() => handleBackgroundToggle(!isBackgroundEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isBackgroundEnabled
                  ? "bg-dark-accent-primary"
                  : "bg-dark-bg-tertiary"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isBackgroundEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {isBackgroundEnabled && (
          <>
            {/* Background Color */}
            <div className="form-group">
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Background Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={
                    backgroundColorInput.startsWith("#")
                      ? backgroundColorInput
                      : "#000000"
                  }
                  onChange={(e) => handleBackgroundColorChange(e.target.value)}
                  className="w-12 h-10 bg-transparent border border-dark-border-subtle rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColorInput}
                  onChange={(e) => handleBackgroundColorChange(e.target.value)}
                  placeholder="rgba(0, 0, 0, 0.8) or #000000"
                  className={`flex-1 px-3 py-2 bg-dark-bg-tertiary border rounded-lg text-dark-text-primary focus:ring-2 focus:ring-dark-accent-primary focus:border-transparent transition-all duration-200 ${
                    !isValidBackgroundColor
                      ? "border-red-500"
                      : "border-dark-border-subtle"
                  }`}
                />
              </div>
              {!isValidBackgroundColor && (
                <p className="text-xs text-red-400 mt-1">
                  Please enter a valid color (hex: #000000 or rgba: rgba(0, 0,
                  0, 0.8))
                </p>
              )}
            </div>

            {/* Background Opacity */}
            <div className="form-group">
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Background Opacity: {Math.round(getBackgroundOpacity() * 100)}%
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={getBackgroundOpacity()}
                  onChange={(e) =>
                    handleOpacityChange(parseFloat(e.target.value))
                  }
                  className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={getBackgroundOpacity()}
                  onChange={(e) =>
                    handleOpacityChange(parseFloat(e.target.value) || 0.8)
                  }
                  className="w-20 px-2 py-1 bg-dark-bg-tertiary border border-dark-border-subtle rounded text-dark-text-primary text-center"
                />
              </div>
            </div>

            {/* Padding */}
            <div className="form-group">
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Padding: {style.padding || 0}px
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={style.padding || 0}
                  onChange={(e) =>
                    onChange({ padding: parseInt(e.target.value) })
                  }
                  className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={style.padding || 0}
                  onChange={(e) =>
                    onChange({ padding: parseInt(e.target.value) || 0 })
                  }
                  className={`w-20 px-2 py-1 bg-dark-bg-tertiary border rounded text-dark-text-primary text-center ${
                    hasError("padding")
                      ? "border-red-500"
                      : "border-dark-border-subtle"
                  }`}
                />
              </div>
              {hasError("padding") && (
                <p className="text-xs text-red-400 mt-1">
                  Padding must be between 0 and 50 pixels
                </p>
              )}
            </div>

            {/* Border Radius */}
            <div className="form-group">
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Border Radius: {style.borderRadius || 0}px
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={style.borderRadius || 0}
                  onChange={(e) =>
                    onChange({ borderRadius: parseInt(e.target.value) })
                  }
                  className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={style.borderRadius || 0}
                  onChange={(e) =>
                    onChange({ borderRadius: parseInt(e.target.value) || 0 })
                  }
                  className={`w-20 px-2 py-1 bg-dark-bg-tertiary border rounded text-dark-text-primary text-center ${
                    hasError("border radius")
                      ? "border-red-500"
                      : "border-dark-border-subtle"
                  }`}
                />
              </div>
              {hasError("border radius") && (
                <p className="text-xs text-red-400 mt-1">
                  Border radius must be between 0 and 50 pixels
                </p>
              )}
            </div>

            {/* Backdrop Blur */}
            <div className="form-group">
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Backdrop Blur: {style.backdropBlur || 0}px
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={style.backdropBlur || 0}
                  onChange={(e) =>
                    onChange({ backdropBlur: parseInt(e.target.value) })
                  }
                  className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={style.backdropBlur || 0}
                  onChange={(e) =>
                    onChange({ backdropBlur: parseInt(e.target.value) || 0 })
                  }
                  className="w-20 px-2 py-1 bg-dark-bg-tertiary border border-dark-border-subtle rounded text-dark-text-primary text-center"
                />
              </div>
              <p className="text-xs text-dark-text-secondary mt-1">
                Creates a blur effect behind the caption
              </p>
            </div>
          </>
        )}

        {/* Overall Opacity */}
        <div className="form-group">
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Overall Opacity: {Math.round((style.opacity || 1) * 100)}%
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={style.opacity || 1}
              onChange={(e) =>
                onChange({ opacity: parseFloat(e.target.value) })
              }
              className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={style.opacity || 1}
              onChange={(e) =>
                onChange({ opacity: parseFloat(e.target.value) || 1 })
              }
              className={`w-20 px-2 py-1 bg-dark-bg-tertiary border rounded text-dark-text-primary text-center ${
                hasError("opacity")
                  ? "border-red-500"
                  : "border-dark-border-subtle"
              }`}
            />
          </div>
          {hasError("opacity") && (
            <p className="text-xs text-red-400 mt-1">
              Opacity must be between 0 and 1
            </p>
          )}
        </div>

        {/* Preview */}
        <div className="mt-6 p-4 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle">
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Background Preview
          </label>
          <div className="relative w-full h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg overflow-hidden">
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center px-3 py-1 rounded"
              style={{
                backgroundColor: style.backgroundColor,
                color: style.color,
                fontSize: "14px",
                fontFamily: style.fontFamily,
                fontWeight: style.fontWeight,
                borderRadius: `${style.borderRadius || 0}px`,
                padding: `${style.padding || 0}px`,
                opacity: style.opacity || 1,
                backdropFilter: style.backdropBlur
                  ? `blur(${style.backdropBlur}px)`
                  : "none",
              }}
            >
              Sample Caption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundPanel;
