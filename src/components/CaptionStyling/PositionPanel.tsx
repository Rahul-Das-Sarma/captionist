import React from "react";
import type { PositionStyle } from "./types";

export interface PositionPanelProps {
  style: PositionStyle;
  onChange: (updates: Partial<PositionStyle>) => void;
  className?: string;
}

const POSITION_OPTIONS = [
  {
    value: "top",
    label: "Top",
    icon: "⬆️",
    description: "Captions appear at the top of the video",
  },
  {
    value: "center",
    label: "Center",
    icon: "↔️",
    description: "Captions appear in the center of the video",
  },
  {
    value: "bottom",
    label: "Bottom",
    icon: "⬇️",
    description: "Captions appear at the bottom of the video",
  },
];

const PositionPanel: React.FC<PositionPanelProps> = ({
  style,
  onChange,
  errors,
  className = "",
}) => {
  const handlePositionChange = (position: "top" | "center" | "bottom") => {
    onChange({ position });
  };

  const handleMarginChange = (margin: number) => {
    onChange({ margin });
  };

  const handleCustomPositionChange = (x: number, y: number) => {
    onChange({ customPosition: { x, y } });
  };

  const hasError = (field: string) => {
    return errors.some((error) =>
      error.toLowerCase().includes(field.toLowerCase())
    );
  };

  return (
    <div
      className={`position-panel bg-dark-bg-secondary rounded-lg p-6 border border-dark-border-subtle ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-dark-text-primary">
          Position & Layout
        </h3>
        <div className="text-xs text-dark-text-secondary">
          Caption placement and spacing
        </div>
      </div>

      <div className="space-y-6">
        {/* Position Type */}
        <div className="form-group">
          <label className="block text-sm font-medium text-dark-text-primary mb-3">
            Caption Position
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {POSITION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handlePositionChange(option.value as any)}
                className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                  style.position === option.value
                    ? "bg-dark-accent-primary text-white border-dark-accent-primary"
                    : "bg-dark-bg-tertiary text-dark-text-secondary border-dark-border-subtle hover:border-dark-accent-primary hover:text-dark-text-primary"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs opacity-75">
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Margin */}
        <div className="form-group">
          <label className="block text-sm font-medium text-dark-text-primary mb-2">
            Margin from Edge: {style.margin || 0}px
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100"
              value={style.margin || 0}
              onChange={(e) => handleMarginChange(parseInt(e.target.value))}
              className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={style.margin || 0}
              onChange={(e) =>
                handleMarginChange(parseInt(e.target.value) || 0)
              }
              className={`w-20 px-2 py-1 bg-dark-bg-tertiary border rounded text-dark-text-primary text-center ${
                hasError("margin")
                  ? "border-red-500"
                  : "border-dark-border-subtle"
              }`}
            />
          </div>
          <p className="text-xs text-dark-text-secondary mt-1">
            Distance from the edge of the video frame
          </p>
        </div>

        {/* Custom Position (when position is custom) */}
        {style.position === "custom" && (
          <div className="form-group">
            <label className="block text-sm font-medium text-dark-text-primary mb-3">
              Custom Position
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-dark-text-secondary mb-1">
                  X Position:{" "}
                  {Math.round((style.customPosition?.x || 0.5) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={style.customPosition?.x || 0.5}
                  onChange={(e) =>
                    handleCustomPositionChange(
                      parseFloat(e.target.value),
                      style.customPosition?.y || 0.5
                    )
                  }
                  className="w-full h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-text-secondary mb-1">
                  Y Position:{" "}
                  {Math.round((style.customPosition?.y || 0.5) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={style.customPosition?.y || 0.5}
                  onChange={(e) =>
                    handleCustomPositionChange(
                      style.customPosition?.x || 0.5,
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        )}

        {/* Responsive Preview */}
        <div className="form-group">
          <label className="block text-sm font-medium text-dark-text-primary mb-3">
            Responsive Preview
          </label>
          <div className="space-y-4">
            {/* Desktop Preview */}
            <div className="preview-container">
              <div className="text-xs text-dark-text-secondary mb-2">
                Desktop (16:9)
              </div>
              <div className="relative w-full h-32 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle overflow-hidden">
                <div
                  className="absolute text-xs px-2 py-1 rounded"
                  style={{
                    position: "absolute",
                    [style.position === "top"
                      ? "top"
                      : style.position === "bottom"
                      ? "bottom"
                      : "top"]: "8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: style.backgroundColor,
                    color: style.color,
                    fontSize: "10px",
                    fontFamily: style.fontFamily,
                    fontWeight: style.fontWeight,
                    borderRadius: `${Math.min(style.borderRadius, 4)}px`,
                    padding: "4px 8px",
                  }}
                >
                  Sample Caption
                </div>
              </div>
            </div>

            {/* Mobile Preview */}
            <div className="preview-container">
              <div className="text-xs text-dark-text-secondary mb-2">
                Mobile (9:16)
              </div>
              <div className="relative w-24 h-48 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle overflow-hidden mx-auto">
                <div
                  className="absolute text-xs px-1 py-0.5 rounded"
                  style={{
                    position: "absolute",
                    [style.position === "top"
                      ? "top"
                      : style.position === "bottom"
                      ? "bottom"
                      : "top"]: "4px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: style.backgroundColor,
                    color: style.color,
                    fontSize: "8px",
                    fontFamily: style.fontFamily,
                    fontWeight: style.fontWeight,
                    borderRadius: `${Math.min(style.borderRadius, 2)}px`,
                    padding: "2px 4px",
                  }}
                >
                  Sample
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Position Tips */}
        <div className="mt-6 p-4 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle">
          <h4 className="text-sm font-medium text-dark-text-primary mb-2">
            💡 Position Tips
          </h4>
          <ul className="text-xs text-dark-text-secondary space-y-1">
            <li>
              • <strong>Top:</strong> Best for videos with important visual
              content at the bottom
            </li>
            <li>
              • <strong>Center:</strong> Great for social media and mobile-first
              content
            </li>
            <li>
              • <strong>Bottom:</strong> Traditional TV-style placement, most
              common
            </li>
            <li>
              • <strong>Margin:</strong> Keep some distance from edges for
              better readability
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PositionPanel;
