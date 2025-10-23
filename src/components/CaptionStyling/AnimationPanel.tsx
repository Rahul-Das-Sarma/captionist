import React, { useState } from "react";
import type { AnimationStyle } from "./types";

export interface AnimationPanelProps {
  style: CaptionStyle;
  onChange: (updates: Partial<CaptionStyle>) => void;
  errors: string[];
  className?: string;
}

const ANIMATION_TYPES = [
  { value: "none", label: "None", description: "No animation" },
  { value: "fade", label: "Fade", description: "Fade in/out effect" },
  { value: "slide", label: "Slide", description: "Slide from side" },
  { value: "bounce", label: "Bounce", description: "Bouncing entrance" },
  {
    value: "typewriter",
    label: "Typewriter",
    description: "Character by character reveal",
  },
  { value: "scale", label: "Scale", description: "Scale up/down effect" },
  { value: "rotate", label: "Rotate", description: "Rotation effect" },
];

const EASING_FUNCTIONS = [
  { value: "linear", label: "Linear", description: "Constant speed" },
  {
    value: "ease",
    label: "Ease",
    description: "Slow start, fast middle, slow end",
  },
  { value: "ease-in", label: "Ease In", description: "Slow start" },
  { value: "ease-out", label: "Ease Out", description: "Slow end" },
  {
    value: "ease-in-out",
    label: "Ease In Out",
    description: "Slow start and end",
  },
  { value: "bounce", label: "Bounce", description: "Bouncing effect" },
  { value: "elastic", label: "Elastic", description: "Elastic spring effect" },
];

const AnimationPanel: React.FC<AnimationPanelProps> = ({
  style,
  onChange,
  errors,
  className = "",
}) => {
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleAnimationTypeChange = (type: string) => {
    onChange({ type: type as any });
  };

  const handleDurationChange = (duration: number) => {
    onChange({ animationDuration: duration });
  };

  const handleDelayChange = (delay: number) => {
    onChange({ animationDelay: delay });
  };

  const handleEasingChange = (easing: string) => {
    onChange({ animationEasing: easing });
  };

  const handleScaleChange = (scale: number) => {
    onChange({ scale });
  };

  const handleRotationChange = (rotation: number) => {
    onChange({ rotation });
  };

  const handlePreviewAnimation = () => {
    setIsPreviewing(true);
    setTimeout(
      () => setIsPreviewing(false),
      (style.animationDuration || 500) + (style.animationDelay || 0)
    );
  };

  const hasError = (field: string) => {
    return errors.some((error) =>
      error.toLowerCase().includes(field.toLowerCase())
    );
  };

  const getAnimationStyle = () => {
    const animationType = style.type || "none";
    const duration = style.animationDuration || 500;
    const delay = style.animationDelay || 0;
    const easing = style.animationEasing || "ease-out";

    if (animationType === "none") {
      return {};
    }

    const animations = {
      fade: `fadeIn ${duration}ms ${easing} ${delay}ms forwards`,
      slide: `slideIn ${duration}ms ${easing} ${delay}ms forwards`,
      bounce: `bounceIn ${duration}ms ${easing} ${delay}ms forwards`,
      typewriter: `typewriter ${duration}ms ${easing} ${delay}ms forwards`,
      scale: `scaleIn ${duration}ms ${easing} ${delay}ms forwards`,
      rotate: `rotateIn ${duration}ms ${easing} ${delay}ms forwards`,
    };

    return {
      animation: animations[animationType as keyof typeof animations] || "",
      opacity: animationType === "fade" ? 0 : 1,
      transform:
        animationType === "scale"
          ? "scale(0)"
          : animationType === "rotate"
          ? "rotate(-180deg)"
          : "none",
    };
  };

  return (
    <div
      className={`animation-panel bg-dark-bg-secondary rounded-lg p-6 border border-dark-border-subtle ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-dark-text-primary">
          Animation & Effects
        </h3>
        <div className="text-xs text-dark-text-secondary">
          Caption entrance animations
        </div>
      </div>

      <div className="space-y-6">
        {/* Animation Type */}
        <div className="form-group">
          <label className="block text-sm font-medium text-dark-text-primary mb-3">
            Animation Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ANIMATION_TYPES.map((animation) => (
              <button
                key={animation.value}
                onClick={() => handleAnimationTypeChange(animation.value)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  style.type === animation.value
                    ? "bg-dark-accent-primary text-white border-dark-accent-primary"
                    : "bg-dark-bg-tertiary text-dark-text-secondary border-dark-border-subtle hover:border-dark-accent-primary hover:text-dark-text-primary"
                }`}
              >
                <div className="font-medium text-sm">{animation.label}</div>
                <div className="text-xs opacity-75">
                  {animation.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {style.type && style.type !== "none" && (
          <>
            {/* Animation Duration */}
            <div className="form-group">
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Animation Duration: {style.animationDuration || 500}ms
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={style.animationDuration || 500}
                  onChange={(e) =>
                    handleDurationChange(parseInt(e.target.value))
                  }
                  className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="number"
                  min="100"
                  max="2000"
                  step="50"
                  value={style.animationDuration || 500}
                  onChange={(e) =>
                    handleDurationChange(parseInt(e.target.value) || 500)
                  }
                  className="w-20 px-2 py-1 bg-dark-bg-tertiary border border-dark-border-subtle rounded text-dark-text-primary text-center"
                />
              </div>
            </div>

            {/* Animation Delay */}
            <div className="form-group">
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Animation Delay: {style.animationDelay || 0}ms
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={style.animationDelay || 0}
                  onChange={(e) => handleDelayChange(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="number"
                  min="0"
                  max="1000"
                  step="50"
                  value={style.animationDelay || 0}
                  onChange={(e) =>
                    handleDelayChange(parseInt(e.target.value) || 0)
                  }
                  className="w-20 px-2 py-1 bg-dark-bg-tertiary border border-dark-border-subtle rounded text-dark-text-primary text-center"
                />
              </div>
            </div>

            {/* Easing Function */}
            <div className="form-group">
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Easing Function
              </label>
              <select
                value={style.animationEasing || "ease-out"}
                onChange={(e) => handleEasingChange(e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-border-subtle rounded-lg text-dark-text-primary focus:ring-2 focus:ring-dark-accent-primary focus:border-transparent transition-all duration-200"
              >
                {EASING_FUNCTIONS.map((easing) => (
                  <option key={easing.value} value={easing.value}>
                    {easing.label} - {easing.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Scale Effect */}
            {style.type === "scale" && (
              <div className="form-group">
                <label className="block text-sm font-medium text-dark-text-primary mb-2">
                  Scale Factor: {style.scale || 1}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={style.scale || 1}
                    onChange={(e) =>
                      handleScaleChange(parseFloat(e.target.value))
                    }
                    className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                  />
                  <input
                    type="number"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={style.scale || 1}
                    onChange={(e) =>
                      handleScaleChange(parseFloat(e.target.value) || 1)
                    }
                    className="w-20 px-2 py-1 bg-dark-bg-tertiary border border-dark-border-subtle rounded text-dark-text-primary text-center"
                  />
                </div>
              </div>
            )}

            {/* Rotation Effect */}
            {style.type === "rotate" && (
              <div className="form-group">
                <label className="block text-sm font-medium text-dark-text-primary mb-2">
                  Rotation: {style.rotation || 0}°
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={style.rotation || 0}
                    onChange={(e) =>
                      handleRotationChange(parseInt(e.target.value))
                    }
                    className="flex-1 h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
                  />
                  <input
                    type="number"
                    min="-180"
                    max="180"
                    step="5"
                    value={style.rotation || 0}
                    onChange={(e) =>
                      handleRotationChange(parseInt(e.target.value) || 0)
                    }
                    className="w-20 px-2 py-1 bg-dark-bg-tertiary border border-dark-border-subtle rounded text-dark-text-primary text-center"
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Preview Section */}
        <div className="mt-6 p-4 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-dark-text-primary">
              Animation Preview
            </label>
            <button
              onClick={handlePreviewAnimation}
              disabled={isPreviewing}
              className="px-4 py-2 bg-dark-accent-primary text-white rounded-lg text-sm font-medium hover:bg-dark-accent-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPreviewing ? "Previewing..." : "Preview Animation"}
            </button>
          </div>

          <div className="relative w-full h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg overflow-hidden">
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center px-3 py-1 rounded ${
                isPreviewing ? "animate-preview" : ""
              }`}
              style={{
                backgroundColor: style.backgroundColor,
                color: style.color,
                fontSize: "14px",
                fontFamily: style.fontFamily,
                fontWeight: style.fontWeight,
                borderRadius: `${style.borderRadius || 0}px`,
                padding: `${style.padding || 0}px`,
                ...getAnimationStyle(),
              }}
            >
              Sample Caption
            </div>
          </div>
        </div>

        {/* Animation Tips */}
        <div className="mt-6 p-4 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle">
          <h4 className="text-sm font-medium text-dark-text-primary mb-2">
            💡 Animation Tips
          </h4>
          <ul className="text-xs text-dark-text-secondary space-y-1">
            <li>
              • <strong>Duration:</strong> 300-500ms is ideal for most
              animations
            </li>
            <li>
              • <strong>Delay:</strong> Use small delays to create staggered
              effects
            </li>
            <li>
              • <strong>Easing:</strong> 'ease-out' feels more natural for
              entrances
            </li>
            <li>
              • <strong>Subtle effects:</strong> Avoid overly dramatic
              animations
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes rotateIn {
          from {
            transform: rotate(-180deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-preview {
          animation: ${style.type === "fade"
              ? "fadeIn"
              : style.type === "slide"
              ? "slideIn"
              : style.type === "bounce"
              ? "bounceIn"
              : style.type === "scale"
              ? "scaleIn"
              : style.type === "rotate"
              ? "rotateIn"
              : "fadeIn"}
            ${style.animationDuration || 500}ms
            ${style.animationEasing || "ease-out"}
            ${style.animationDelay || 0}ms forwards;
        }
      `}</style>
    </div>
  );
};

export default AnimationPanel;
