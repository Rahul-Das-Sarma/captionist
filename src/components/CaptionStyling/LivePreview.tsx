import React, { useState, useEffect } from "react";
import type { CaptionStyle } from "./types";

export interface CaptionSegment {
  text: string;
  startTime: number;
  endTime: number;
}

export interface LivePreviewProps {
  style: CaptionStyle;
  captions: CaptionSegment[];
  className?: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  style,
  captions,
  className = "",
}) => {
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let interval: number;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 0.1;

          // Check if we need to move to the next caption
          if (currentCaptionIndex < captions.length - 1) {
            const nextCaption = captions[currentCaptionIndex + 1];
            if (newTime >= nextCaption.startTime) {
              setCurrentCaptionIndex((prev) => prev + 1);
            }
          }

          // Loop back to start
          if (
            newTime >= captions[captions.length - 1]?.endTime ||
            newTime >= 10
          ) {
            setCurrentCaptionIndex(0);
            return 0;
          }

          return newTime;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentCaptionIndex, captions]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentCaptionIndex(0);
  };

  const getCurrentCaption = () => {
    if (captions.length === 0) return null;

    const currentCaption = captions[currentCaptionIndex];
    if (!currentCaption) return null;

    // Check if current time is within the caption's time range
    if (
      currentTime >= currentCaption.startTime &&
      currentTime <= currentCaption.endTime
    ) {
      return currentCaption;
    }

    return null;
  };

  const getProgressPercentage = () => {
    if (captions.length === 0) return 0;
    const totalDuration = captions[captions.length - 1]?.endTime || 10;
    return (currentTime / totalDuration) * 100;
  };

  const getCaptionStyle = () => {
    const currentCaption = getCurrentCaption();
    if (!currentCaption) return { opacity: 0 };

    return {
      fontFamily: style.typography?.fontFamily || "Arial",
      fontSize: `${style.typography?.fontSize || 16}px`,
      fontWeight:
        style.typography?.fontWeight === "bold"
          ? 700
          : style.typography?.fontWeight === "light"
          ? 300
          : 400,
      color: style.typography?.fontColor || "#ffffff",
      backgroundColor: style.background?.enabled
        ? style.background.color
        : "transparent",
      padding: `${style.background?.padding?.top || 8}px ${
        style.background?.padding?.right || 12
      }px ${style.background?.padding?.bottom || 8}px ${
        style.background?.padding?.left || 12
      }px`,
      borderRadius: `${style.background?.borderRadius || 4}px`,
      textAlign: style.typography?.textAlign || "center",
      lineHeight: style.typography?.lineHeight || 1.2,
      letterSpacing: `${style.typography?.letterSpacing || 0}px`,
      opacity: style.effects?.opacity || 1,
      boxShadow:
        style.shadow?.enabled && style.shadow?.blur
          ? `${style.shadow.offsetX || 0}px ${style.shadow.offsetY || 0}px ${
              style.shadow.blur || 0
            }px ${style.shadow.color || "#000000"}`
          : "none",
      textShadow:
        style.shadow?.textShadow?.enabled && style.shadow?.textShadow?.blur
          ? `${style.shadow.textShadow.offsetX || 0}px ${
              style.shadow.textShadow.offsetY || 0
            }px ${style.shadow.textShadow.blur || 0}px ${
              style.shadow.textShadow.color || "#000000"
            }`
          : "none",
      borderColor: style.border?.enabled ? style.border.color : "transparent",
      borderWidth: `${style.border?.width || 0}px`,
      borderStyle: style.border?.style || "solid",
      backdropFilter: style.background?.backdropBlur
        ? `blur(${style.background.backdropBlur}px)`
        : "none",
      position: "absolute" as const,
      [style.position?.type === "top"
        ? "top"
        : style.position?.type === "bottom"
        ? "bottom"
        : "top"]: "20px",
      left: "50%",
      transform: `translateX(-50%) scale(${style.effects?.scale || 1}) rotate(${
        style.effects?.rotation || 0
      }deg)`,
      transition: "all 0.3s ease-out",
    };
  };

  return (
    <div
      className={`live-preview bg-dark-bg-secondary rounded-lg p-6 border border-dark-border-subtle ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-text-primary">
          Live Preview
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePlayPause}
            className="px-3 py-1 bg-dark-accent-primary text-white rounded text-sm font-medium hover:bg-dark-accent-secondary transition-colors duration-200"
          >
            {isPlaying ? "⏸️ Pause" : "▶️ Play"}
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-dark-bg-tertiary text-dark-text-secondary rounded text-sm font-medium hover:bg-dark-bg-primary hover:text-dark-text-primary transition-colors duration-200"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Video Preview Container */}
      <div className="relative w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-dark-border-subtle">
        {/* Simulated video background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-50"></div>

        {/* Caption Display */}
        <div className="absolute z-10" style={getCaptionStyle()}>
          {getCurrentCaption()?.text || "No caption active"}
        </div>

        {/* Video overlay elements */}
        <div className="absolute top-4 left-4 text-white text-xs opacity-75">
          📹 Video Preview
        </div>
        <div className="absolute bottom-4 right-4 text-white text-xs opacity-75">
          {style.position?.type || "bottom"} position
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-dark-text-secondary mb-2">
          <span>Progress</span>
          <span>{Math.round(getProgressPercentage())}%</span>
        </div>
        <div className="w-full bg-dark-bg-tertiary rounded-full h-2">
          <div
            className="h-full bg-dark-accent-primary rounded-full transition-all duration-100"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Caption List */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-dark-text-primary mb-2">
          Caption Timeline
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {captions.map((caption, index) => (
            <div
              key={index}
              className={`p-2 rounded text-xs transition-colors duration-200 ${
                index === currentCaptionIndex
                  ? "bg-dark-accent-primary text-white"
                  : "bg-dark-bg-tertiary text-dark-text-secondary"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{caption.text}</span>
                <span className="opacity-75">
                  {caption.startTime.toFixed(1)}s - {caption.endTime.toFixed(1)}
                  s
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Style Information */}
      <div className="mt-4 p-3 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle">
        <h4 className="text-sm font-medium text-dark-text-primary mb-2">
          Current Style
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-dark-text-secondary">
          <div>
            Font: {style.typography?.fontFamily || "Arial"}{" "}
            {style.typography?.fontSize || 16}px
          </div>
          <div>Weight: {style.typography?.fontWeight || "normal"}</div>
          <div>Position: {style.position?.type || "bottom"}</div>
          <div>Animation: {style.animation?.type || "none"}</div>
          <div>Background: {style.background?.enabled ? "Yes" : "No"}</div>
          <div>Border: {style.border?.enabled ? "Yes" : "No"}</div>
        </div>
      </div>

      {/* Responsive Preview */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-dark-text-primary mb-2">
          Responsive Preview
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Desktop */}
          <div className="text-center">
            <div className="text-xs text-dark-text-secondary mb-1">
              Desktop (16:9)
            </div>
            <div className="relative w-full h-16 bg-dark-bg-tertiary rounded border border-dark-border-subtle overflow-hidden">
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded"
                style={{
                  ...getCaptionStyle(),
                  fontSize: "10px",
                  padding: "4px 8px",
                }}
              >
                Sample
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="text-center">
            <div className="text-xs text-dark-text-secondary mb-1">
              Mobile (9:16)
            </div>
            <div className="relative w-12 h-24 bg-dark-bg-tertiary rounded border border-dark-border-subtle overflow-hidden mx-auto">
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs px-1 py-0.5 rounded"
                style={{
                  ...getCaptionStyle(),
                  fontSize: "8px",
                  padding: "2px 4px",
                }}
              >
                Sample
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
