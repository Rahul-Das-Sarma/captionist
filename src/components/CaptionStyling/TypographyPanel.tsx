import React, { useState } from "react";
import type { TypographyStyle } from "./types";

export interface TypographyPanelProps {
  style: TypographyStyle;
  onChange: (updates: Partial<TypographyStyle>) => void;
  className?: string;
}

const FONT_FAMILIES = [
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Georgia", label: "Georgia" },
  { value: "Verdana", label: "Verdana" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Impact", label: "Impact" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
  { value: "Lucida Console", label: "Lucida Console" },
];

const FONT_WEIGHTS = [
  { value: 100, label: "Thin" },
  { value: 200, label: "Extra Light" },
  { value: 300, label: "Light" },
  { value: 400, label: "Normal" },
  { value: 500, label: "Medium" },
  { value: 600, label: "Semi Bold" },
  { value: 700, label: "Bold" },
  { value: 800, label: "Extra Bold" },
  { value: 900, label: "Black" },
];

const TypographyPanel: React.FC<TypographyPanelProps> = ({
  style,
  onChange,
  className = "",
}) => {
  const [colorInput, setColorInput] = useState(style.fontColor);
  const [isValidColor, setIsValidColor] = useState(true);

  const handleColorChange = (color: string) => {
    setColorInput(color);
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    const isValid = hexPattern.test(color);
    setIsValidColor(isValid);

    if (isValid) {
      onChange({ fontColor: color });
    }
  };

  const handleFontSizeChange = (fontSize: number) => {
    onChange({ fontSize });
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    onChange({ fontFamily });
  };

  const handleFontWeightChange = (fontWeight: "light" | "normal" | "bold") => {
    onChange({ fontWeight });
  };

  return (
    <div
      className={`typography-panel bg-dark-bg-secondary rounded-lg p-6 border border-dark-border-subtle ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-dark-text-primary">
          Typography
        </h3>
        <div className="text-xs text-dark-text-secondary">
          Font styling and text appearance
        </div>
      </div>

      <div className="space-y-6">
        {/* Font Family */}
        <div className="form-group">
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Font Family
          </label>
          <select
            value={style.fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-border-subtle rounded-lg text-dark-text-primary focus:ring-2 focus:ring-dark-accent-primary focus:border-transparent transition-all duration-200"
            style={{ fontFamily: style.fontFamily }}
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className="form-group">
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Font Size: {style.fontSize}px
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="8"
              max="200"
              value={style.fontSize}
              onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
              className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="number"
              min="8"
              max="200"
              value={style.fontSize}
              onChange={(e) =>
                handleFontSizeChange(parseInt(e.target.value) || 16)
              }
              className="w-20 px-2 py-1 bg-dark-bg-tertiary border border-dark-border-subtle rounded text-dark-text-primary text-center"
            />
          </div>
        </div>

        {/* Font Weight */}
        <div className="form-group">
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Font Weight
          </label>
          <div className="flex space-x-2">
            {[
              { value: "light", label: "Light" },
              { value: "normal", label: "Normal" },
              { value: "bold", label: "Bold" },
            ].map((weight) => (
              <button
                key={weight.value}
                onClick={() =>
                  handleFontWeightChange(
                    weight.value as "light" | "normal" | "bold"
                  )
                }
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                  style.fontWeight === weight.value
                    ? "bg-dark-accent-primary text-white border-dark-accent-primary"
                    : "bg-dark-bg-tertiary text-dark-text-secondary border-dark-border-subtle hover:border-dark-accent-primary hover:text-dark-text-primary"
                }`}
              >
                {weight.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Color */}
        <div className="form-group">
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Font Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={style.fontColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-10 bg-transparent border border-dark-border-subtle rounded cursor-pointer"
            />
            <input
              type="text"
              value={colorInput}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#FFFFFF"
              className="flex-1 px-3 py-2 bg-dark-bg-tertiary border border-dark-border-subtle rounded-lg text-dark-text-primary focus:ring-2 focus:ring-dark-accent-primary focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Text Alignment */}
        <div className="form-group">
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Text Alignment
          </label>
          <div className="flex space-x-2">
            {[
              { value: "left", label: "Left", icon: "⬅️" },
              { value: "center", label: "Center", icon: "↔️" },
              { value: "right", label: "Right", icon: "➡️" },
            ].map((align) => (
              <button
                key={align.value}
                onClick={() => onChange({ textAlign: align.value as any })}
                className={`flex-1 px-4 py-2 text-sm rounded-lg border transition-all duration-200 ${
                  style.textAlign === align.value
                    ? "bg-dark-accent-primary text-white border-dark-accent-primary"
                    : "bg-dark-bg-tertiary text-dark-text-secondary border-dark-border-subtle hover:border-dark-accent-primary hover:text-dark-text-primary"
                }`}
              >
                <span className="mr-2">{align.icon}</span>
                {align.label}
              </button>
            ))}
          </div>
        </div>

        {/* Line Height */}
        <div className="form-group">
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Line Height: {style.lineHeight || 1.2}
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0.8"
              max="2.0"
              step="0.1"
              value={style.lineHeight || 1.2}
              onChange={(e) =>
                onChange({ lineHeight: parseFloat(e.target.value) })
              }
              className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="number"
              min="0.8"
              max="2.0"
              step="0.1"
              value={style.lineHeight || 1.2}
              onChange={(e) =>
                onChange({ lineHeight: parseFloat(e.target.value) || 1.2 })
              }
              className="w-20 px-2 py-1 bg-dark-bg-tertiary border border-dark-border-subtle rounded text-dark-text-primary text-center"
            />
          </div>
        </div>

        {/* Letter Spacing */}
        <div className="form-group">
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Letter Spacing: {style.letterSpacing || 0}px
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="-2"
              max="10"
              step="0.1"
              value={style.letterSpacing || 0}
              onChange={(e) =>
                onChange({ letterSpacing: parseFloat(e.target.value) })
              }
              className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="number"
              min="-2"
              max="10"
              step="0.1"
              value={style.letterSpacing || 0}
              onChange={(e) =>
                onChange({ letterSpacing: parseFloat(e.target.value) || 0 })
              }
              className="w-20 px-2 py-1 bg-dark-bg-tertiary border border-dark-border-subtle rounded text-dark-text-primary text-center"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6 p-4 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle">
        <label className="block text-sm font-medium text-dark-text-primary mb-2">
          Preview
        </label>
        <div
          className="text-center p-4 rounded-lg"
          style={{
            fontFamily: style.fontFamily,
            fontSize: `${Math.min(style.fontSize, 24)}px`,
            fontWeight: style.fontWeight,
            color: style.fontColor,
            lineHeight: style.lineHeight,
            letterSpacing: `${style.letterSpacing || 0}px`,
            textAlign: style.textAlign || "center",
          }}
        >
          Sample Caption Text
        </div>
      </div>
    </div>
  );
};

export default TypographyPanel;
