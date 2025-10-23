import React, { useState } from "react";
import type { BorderStyle } from "./types";

export interface BorderPanelProps {
  style: CaptionStyle;
  onChange: (updates: Partial<CaptionStyle>) => void;
  errors: string[];
  className?: string;
}

const BORDER_STYLES = [
  { value: "solid", label: "Solid", description: "Continuous line" },
  { value: "dashed", label: "Dashed", description: "Broken line segments" },
  { value: "dotted", label: "Dotted", description: "Small dots" },
  { value: "double", label: "Double", description: "Two parallel lines" },
];

const BorderPanel: React.FC<BorderPanelProps> = ({
  style,
  onChange,
  errors,
  className = "",
}) => {
  const [borderColorInput, setBorderColorInput] = useState(
    style.borderColor || "rgba(255, 255, 255, 0.3)"
  );
  const [isValidBorderColor, setIsValidBorderColor] = useState(true);

  const handleBorderToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({
        borderColor: style.borderColor || "rgba(255, 255, 255, 0.3)",
        borderWidth: style.borderWidth || 1,
      });
    } else {
      onChange({ borderWidth: 0 });
    }
  };

  const handleBorderColorChange = (color: string) => {
    setBorderColorInput(color);

    // Check if it's a valid color (hex or rgba)
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    const rgbaPattern =
      /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/;
    const isValid = hexPattern.test(color) || rgbaPattern.test(color);
    setIsValidBorderColor(isValid);

    if (isValid) {
      onChange({ borderColor: color });
    }
  };

  const handleBorderWidthChange = (width: number) => {
    onChange({ borderWidth: width });
  };

  const handleBorderStyleChange = (borderStyle: string) => {
    onChange({ borderStyle: borderStyle as any });
  };

  const hasError = (field: string) => {
    return errors.some((error) =>
      error.toLowerCase().includes(field.toLowerCase())
    );
  };

  const isBorderEnabled = (style.borderWidth || 0) > 0;

  return (
    <div
      className={`border-panel bg-dark-bg-secondary rounded-lg p-6 border border-dark-border-subtle ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-dark-text-primary">
          Border & Outline
        </h3>
        <div className="text-xs text-dark-text-secondary">
          Caption border styling
        </div>
      </div>

      <div className="space-y-6">
        {/* Border Toggle */}
        <div className="form-group">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-dark-text-primary">
              Enable Border
            </label>
            <button
              onClick={() => handleBorderToggle(!isBorderEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isBorderEnabled
                  ? "bg-dark-accent-primary"
                  : "bg-dark-bg-tertiary"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isBorderEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {isBorderEnabled && (
          <>
            {/* Border Color */}
            <div className="form-group">
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Border Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={
                    borderColorInput.startsWith("#")
                      ? borderColorInput
                      : "#ffffff"
                  }
                  onChange={(e) => handleBorderColorChange(e.target.value)}
                  className="w-12 h-10 bg-transparent border border-dark-border-subtle rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={borderColorInput}
                  onChange={(e) => handleBorderColorChange(e.target.value)}
                  placeholder="rgba(255, 255, 255, 0.3) or #ffffff"
                  className={`flex-1 px-3 py-2 bg-dark-bg-tertiary border rounded-lg text-dark-text-primary focus:ring-2 focus:ring-dark-accent-primary focus:border-transparent transition-all duration-200 ${
                    !isValidBorderColor
                      ? "border-red-500"
                      : "border-dark-border-subtle"
                  }`}
                />
              </div>
              {!isValidBorderColor && (
                <p className="text-xs text-red-400 mt-1">
                  Please enter a valid color (hex: #ffffff or rgba: rgba(255,
                  255, 255, 0.3))
                </p>
              )}
            </div>

            {/* Border Width */}
            <div className="form-group">
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Border Width: {style.borderWidth || 0}px
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={style.borderWidth || 0}
                  onChange={(e) =>
                    handleBorderWidthChange(parseInt(e.target.value))
                  }
                  className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={style.borderWidth || 0}
                  onChange={(e) =>
                    handleBorderWidthChange(parseInt(e.target.value) || 0)
                  }
                  className="w-20 px-2 py-1 bg-dark-bg-tertiary border border-dark-border-subtle rounded text-dark-text-primary text-center"
                />
              </div>
            </div>

            {/* Border Style */}
            <div className="form-group">
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Border Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BORDER_STYLES.map((borderStyle) => (
                  <button
                    key={borderStyle.value}
                    onClick={() => handleBorderStyleChange(borderStyle.value)}
                    className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                      style.borderStyle === borderStyle.value
                        ? "bg-dark-accent-primary text-white border-dark-accent-primary"
                        : "bg-dark-bg-tertiary text-dark-text-secondary border-dark-border-subtle hover:border-dark-accent-primary hover:text-dark-text-primary"
                    }`}
                  >
                    <div className="font-medium text-sm">
                      {borderStyle.label}
                    </div>
                    <div className="text-xs opacity-75">
                      {borderStyle.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Border Controls */}
            <div className="form-group">
              <label className="block text-sm font-medium text-dark-text-primary mb-3">
                Individual Border Sides
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-dark-text-secondary mb-1">
                    Top: {style.borderTopWidth || 0}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={style.borderTopWidth || 0}
                    onChange={(e) =>
                      onChange({ borderTopWidth: parseInt(e.target.value) })
                    }
                    className="w-full h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark-text-secondary mb-1">
                    Right: {style.borderRightWidth || 0}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={style.borderRightWidth || 0}
                    onChange={(e) =>
                      onChange({ borderRightWidth: parseInt(e.target.value) })
                    }
                    className="w-full h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark-text-secondary mb-1">
                    Bottom: {style.borderBottomWidth || 0}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={style.borderBottomWidth || 0}
                    onChange={(e) =>
                      onChange({ borderBottomWidth: parseInt(e.target.value) })
                    }
                    className="w-full h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark-text-secondary mb-1">
                    Left: {style.borderLeftWidth || 0}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={style.borderLeftWidth || 0}
                    onChange={(e) =>
                      onChange({ borderLeftWidth: parseInt(e.target.value) })
                    }
                    className="w-full h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Preview */}
        <div className="mt-6 p-4 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle">
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Border Preview
          </label>
          <div className="relative w-full h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg overflow-hidden">
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center px-3 py-1"
              style={{
                backgroundColor: style.backgroundColor,
                color: style.color,
                fontSize: "14px",
                fontFamily: style.fontFamily,
                fontWeight: style.fontWeight,
                borderRadius: `${style.borderRadius || 0}px`,
                padding: `${style.padding || 0}px`,
                borderColor: style.borderColor,
                borderWidth: `${style.borderWidth || 0}px`,
                borderStyle: style.borderStyle || "solid",
                borderTopWidth: style.borderTopWidth
                  ? `${style.borderTopWidth}px`
                  : undefined,
                borderRightWidth: style.borderRightWidth
                  ? `${style.borderRightWidth}px`
                  : undefined,
                borderBottomWidth: style.borderBottomWidth
                  ? `${style.borderBottomWidth}px`
                  : undefined,
                borderLeftWidth: style.borderLeftWidth
                  ? `${style.borderLeftWidth}px`
                  : undefined,
              }}
            >
              Sample Caption
            </div>
          </div>
        </div>

        {/* Border Tips */}
        <div className="mt-6 p-4 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle">
          <h4 className="text-sm font-medium text-dark-text-primary mb-2">
            💡 Border Tips
          </h4>
          <ul className="text-xs text-dark-text-secondary space-y-1">
            <li>
              • <strong>Subtle borders:</strong> Use low opacity colors for
              elegant outlines
            </li>
            <li>
              • <strong>High contrast:</strong> Use contrasting colors for
              better readability
            </li>
            <li>
              • <strong>Individual sides:</strong> Create unique effects with
              different border widths
            </li>
            <li>
              • <strong>Style variety:</strong> Dashed and dotted borders add
              visual interest
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BorderPanel;
