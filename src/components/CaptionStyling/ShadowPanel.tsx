import React, { useState } from "react";
import type { ShadowStyle } from "./types";

export interface ShadowPanelProps {
  style: CaptionStyle;
  onChange: (updates: Partial<CaptionStyle>) => void;
  errors: string[];
  className?: string;
}

const ShadowPanel: React.FC<ShadowPanelProps> = ({
  style,
  onChange,
  errors,
  className = "",
}) => {
  const [shadowColorInput, setShadowColorInput] = useState(
    style.shadowColor || "#000000"
  );
  const [textShadowColorInput, setTextShadowColorInput] = useState(
    style.textShadowColor || "#000000"
  );
  const [isValidShadowColor, setIsValidShadowColor] = useState(true);
  const [isValidTextShadowColor, setIsValidTextShadowColor] = useState(true);

  const handleShadowToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({
        shadowColor: style.shadowColor || "#000000",
        shadowBlur: style.shadowBlur || 4,
        shadowOffsetX: style.shadowOffsetX || 0,
        shadowOffsetY: style.shadowOffsetY || 2,
      });
    } else {
      onChange({
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      });
    }
  };

  const handleTextShadowToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({
        textShadowColor: style.textShadowColor || "#000000",
        textShadowBlur: style.textShadowBlur || 2,
        textShadowOffsetX: style.textShadowOffsetX || 0,
        textShadowOffsetY: style.textShadowOffsetY || 1,
      });
    } else {
      onChange({
        textShadowBlur: 0,
        textShadowOffsetX: 0,
        textShadowOffsetY: 0,
      });
    }
  };

  const handleShadowColorChange = (color: string) => {
    setShadowColorInput(color);

    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    const isValid = hexPattern.test(color);
    setIsValidShadowColor(isValid);

    if (isValid) {
      onChange({ shadowColor: color });
    }
  };

  const handleTextShadowColorChange = (color: string) => {
    setTextShadowColorInput(color);

    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    const isValid = hexPattern.test(color);
    setIsValidTextShadowColor(isValid);

    if (isValid) {
      onChange({ textShadowColor: color });
    }
  };

  const handleShadowBlurChange = (blur: number) => {
    onChange({ shadowBlur: blur });
  };

  const handleShadowOffsetChange = (x: number, y: number) => {
    onChange({
      shadowOffsetX: x,
      shadowOffsetY: y,
    });
  };

  const handleTextShadowBlurChange = (blur: number) => {
    onChange({ textShadowBlur: blur });
  };

  const handleTextShadowOffsetChange = (x: number, y: number) => {
    onChange({
      textShadowOffsetX: x,
      textShadowOffsetY: y,
    });
  };

  const hasError = (field: string) => {
    return errors.some((error) =>
      error.toLowerCase().includes(field.toLowerCase())
    );
  };

  const isBoxShadowEnabled = (style.shadowBlur || 0) > 0;
  const isTextShadowEnabled = (style.textShadowBlur || 0) > 0;

  return (
    <div
      className={`shadow-panel bg-dark-bg-secondary rounded-lg p-6 border border-dark-border-subtle ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-dark-text-primary">
          Shadow & Effects
        </h3>
        <div className="text-xs text-dark-text-secondary">
          Box and text shadow effects
        </div>
      </div>

      <div className="space-y-6">
        {/* Box Shadow Section */}
        <div className="shadow-section">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-dark-text-primary">
              Box Shadow
            </h4>
            <button
              onClick={() => handleShadowToggle(!isBoxShadowEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isBoxShadowEnabled
                  ? "bg-dark-accent-primary"
                  : "bg-dark-bg-tertiary"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isBoxShadowEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {isBoxShadowEnabled && (
            <div className="space-y-4 pl-4 border-l-2 border-dark-border-subtle">
              {/* Shadow Color */}
              <div className="form-group">
                <label className="block text-sm font-medium text-dark-text-primary mb-2">
                  Shadow Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={shadowColorInput}
                    onChange={(e) => handleShadowColorChange(e.target.value)}
                    className="w-12 h-10 bg-transparent border border-dark-border-subtle rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={shadowColorInput}
                    onChange={(e) => handleShadowColorChange(e.target.value)}
                    placeholder="#000000"
                    className={`flex-1 px-3 py-2 bg-dark-bg-tertiary border rounded-lg text-dark-text-primary focus:ring-2 focus:ring-dark-accent-primary focus:border-transparent transition-all duration-200 ${
                      !isValidShadowColor
                        ? "border-red-500"
                        : "border-dark-border-subtle"
                    }`}
                  />
                </div>
                {!isValidShadowColor && (
                  <p className="text-xs text-red-400 mt-1">
                    Please enter a valid hex color
                  </p>
                )}
              </div>

              {/* Shadow Blur */}
              <div className="form-group">
                <label className="block text-sm font-medium text-dark-text-primary mb-2">
                  Shadow Blur: {style.shadowBlur || 0}px
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={style.shadowBlur || 0}
                    onChange={(e) =>
                      handleShadowBlurChange(parseInt(e.target.value))
                    }
                    className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                  />
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={style.shadowBlur || 0}
                    onChange={(e) =>
                      handleShadowBlurChange(parseInt(e.target.value) || 0)
                    }
                    className="w-20 px-2 py-1 bg-dark-bg-tertiary border border-dark-border-subtle rounded text-dark-text-primary text-center"
                  />
                </div>
              </div>

              {/* Shadow Offset */}
              <div className="form-group">
                <label className="block text-sm font-medium text-dark-text-primary mb-2">
                  Shadow Offset
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-dark-text-secondary mb-1">
                      X: {style.shadowOffsetX || 0}px
                    </label>
                    <input
                      type="range"
                      min="-20"
                      max="20"
                      value={style.shadowOffsetX || 0}
                      onChange={(e) =>
                        handleShadowOffsetChange(
                          parseInt(e.target.value),
                          style.shadowOffsetY || 0
                        )
                      }
                      className="w-full h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dark-text-secondary mb-1">
                      Y: {style.shadowOffsetY || 0}px
                    </label>
                    <input
                      type="range"
                      min="-20"
                      max="20"
                      value={style.shadowOffsetY || 0}
                      onChange={(e) =>
                        handleShadowOffsetChange(
                          style.shadowOffsetX || 0,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Text Shadow Section */}
        <div className="shadow-section">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-dark-text-primary">
              Text Shadow
            </h4>
            <button
              onClick={() => handleTextShadowToggle(!isTextShadowEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isTextShadowEnabled
                  ? "bg-dark-accent-primary"
                  : "bg-dark-bg-tertiary"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isTextShadowEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {isTextShadowEnabled && (
            <div className="space-y-4 pl-4 border-l-2 border-dark-border-subtle">
              {/* Text Shadow Color */}
              <div className="form-group">
                <label className="block text-sm font-medium text-dark-text-primary mb-2">
                  Text Shadow Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={textShadowColorInput}
                    onChange={(e) =>
                      handleTextShadowColorChange(e.target.value)
                    }
                    className="w-12 h-10 bg-transparent border border-dark-border-subtle rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={textShadowColorInput}
                    onChange={(e) =>
                      handleTextShadowColorChange(e.target.value)
                    }
                    placeholder="#000000"
                    className={`flex-1 px-3 py-2 bg-dark-bg-tertiary border rounded-lg text-dark-text-primary focus:ring-2 focus:ring-dark-accent-primary focus:border-transparent transition-all duration-200 ${
                      !isValidTextShadowColor
                        ? "border-red-500"
                        : "border-dark-border-subtle"
                    }`}
                  />
                </div>
                {!isValidTextShadowColor && (
                  <p className="text-xs text-red-400 mt-1">
                    Please enter a valid hex color
                  </p>
                )}
              </div>

              {/* Text Shadow Blur */}
              <div className="form-group">
                <label className="block text-sm font-medium text-dark-text-primary mb-2">
                  Text Shadow Blur: {style.textShadowBlur || 0}px
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={style.textShadowBlur || 0}
                    onChange={(e) =>
                      handleTextShadowBlurChange(parseInt(e.target.value))
                    }
                    className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                  />
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={style.textShadowBlur || 0}
                    onChange={(e) =>
                      handleTextShadowBlurChange(parseInt(e.target.value) || 0)
                    }
                    className="w-20 px-2 py-1 bg-dark-bg-tertiary border border-dark-border-subtle rounded text-dark-text-primary text-center"
                  />
                </div>
              </div>

              {/* Text Shadow Offset */}
              <div className="form-group">
                <label className="block text-sm font-medium text-dark-text-primary mb-2">
                  Text Shadow Offset
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-dark-text-secondary mb-1">
                      X: {style.textShadowOffsetX || 0}px
                    </label>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      value={style.textShadowOffsetX || 0}
                      onChange={(e) =>
                        handleTextShadowOffsetChange(
                          parseInt(e.target.value),
                          style.textShadowOffsetY || 0
                        )
                      }
                      className="w-full h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dark-text-secondary mb-1">
                      Y: {style.textShadowOffsetY || 0}px
                    </label>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      value={style.textShadowOffsetY || 0}
                      onChange={(e) =>
                        handleTextShadowOffsetChange(
                          style.textShadowOffsetX || 0,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="mt-6 p-4 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle">
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Shadow Preview
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
                boxShadow: isBoxShadowEnabled
                  ? `${style.shadowOffsetX || 0}px ${
                      style.shadowOffsetY || 0
                    }px ${style.shadowBlur || 0}px ${
                      style.shadowColor || "#000000"
                    }`
                  : "none",
                textShadow: isTextShadowEnabled
                  ? `${style.textShadowOffsetX || 0}px ${
                      style.textShadowOffsetY || 0
                    }px ${style.textShadowBlur || 0}px ${
                      style.textShadowColor || "#000000"
                    }`
                  : "none",
              }}
            >
              Sample Caption
            </div>
          </div>
        </div>

        {/* Shadow Tips */}
        <div className="mt-6 p-4 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle">
          <h4 className="text-sm font-medium text-dark-text-primary mb-2">
            💡 Shadow Tips
          </h4>
          <ul className="text-xs text-dark-text-secondary space-y-1">
            <li>
              • <strong>Box Shadow:</strong> Creates depth and separation from
              background
            </li>
            <li>
              • <strong>Text Shadow:</strong> Improves text readability on
              complex backgrounds
            </li>
            <li>
              • <strong>Subtle effects:</strong> Use small blur and offset
              values for professional look
            </li>
            <li>
              • <strong>High contrast:</strong> Use dark shadows on light
              backgrounds and vice versa
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShadowPanel;
