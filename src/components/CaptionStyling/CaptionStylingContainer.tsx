import React, { useState, useCallback, useEffect } from "react";
import type { CaptionStyle } from "./types";
import PresetSelector from "./PresetSelector";
import TypographyPanel from "./TypographyPanel";
import PositionPanel from "./PositionPanel";
import BackgroundPanel from "./BackgroundPanel";
import BorderPanel from "./BorderPanel";
import ShadowPanel from "./ShadowPanel";
import AnimationPanel from "./AnimationPanel";
import LivePreview from "./LivePreview";
import ValidationPanel from "./ValidationPanel";
import ActionButtons from "./ActionButtons";

export interface CaptionStylingProps {
  initialStyle?: CaptionStyle;
  onStyleChange: (style: CaptionStyle) => void;
  onPresetSelect: (presetName: string) => void;
  previewMode?: boolean;
  className?: string;
}

export interface CaptionStylingState {
  currentStyle: CaptionStyle;
  selectedPreset: string | null;
  isCustomMode: boolean;
  previewMode: boolean;
  validationErrors: string[];
  styleHistory: CaptionStyle[];
  historyIndex: number;
}

// Preset definitions
export const CAPTION_PRESETS = {
  reel: {
    name: "reel",
    displayName: "Reel Style",
    style: {
      typography: {
        fontFamily: "Arial",
        fontSize: 19,
        fontWeight: "bold",
        fontColor: "#ffffff",
        textAlign: "center",
        lineHeight: 1.2,
        letterSpacing: 0,
      },
      position: {
        type: "bottom",
        customX: 0.5,
        customY: 0.9,
        margin: 20,
      },
      background: {
        enabled: true,
        color: "#000000",
        opacity: 0.8,
        padding: {
          top: 12,
          right: 16,
          bottom: 12,
          left: 16,
        },
        borderRadius: 25,
        backdropBlur: 10,
      },
      border: {
        enabled: true,
        color: "rgba(255, 255, 255, 0.1)",
        width: 1,
        style: "solid",
        radius: 25,
      },
      shadow: {
        enabled: true,
        color: "#000000",
        blur: 8,
        offsetX: 0,
        offsetY: 8,
        textShadow: {
          enabled: true,
          color: "#000000",
          blur: 4,
          offsetX: 0,
          offsetY: 2,
        },
      },
      animation: {
        type: "fade",
        duration: 500,
        delay: 0,
        easing: "ease-out",
        scale: 1,
        rotation: 0,
      },
      effects: {
        opacity: 0.95,
        scale: 1,
        rotation: 0,
      },
    },
  },
  classic: {
    name: "classic",
    displayName: "Classic Style",
    style: {
      typography: {
        fontFamily: "Arial",
        fontSize: 16,
        fontWeight: "normal",
        fontColor: "#ffffff",
        textAlign: "center",
        lineHeight: 1.2,
        letterSpacing: 0,
      },
      position: {
        type: "bottom",
        customX: 0.5,
        customY: 0.9,
        margin: 20,
      },
      background: {
        enabled: true,
        color: "#000000",
        opacity: 0.7,
        padding: {
          top: 8,
          right: 12,
          bottom: 8,
          left: 12,
        },
        borderRadius: 4,
        backdropBlur: 5,
      },
      border: {
        enabled: true,
        color: "rgba(255, 255, 255, 0.2)",
        width: 1,
        style: "solid",
        radius: 4,
      },
      shadow: {
        enabled: true,
        color: "#000000",
        blur: 4,
        offsetX: 0,
        offsetY: 2,
        textShadow: {
          enabled: true,
          color: "#000000",
          blur: 2,
          offsetX: 0,
          offsetY: 1,
        },
      },
      animation: {
        type: "fade",
        duration: 300,
        delay: 0,
        easing: "ease-in-out",
        scale: 1,
        rotation: 0,
      },
      effects: {
        opacity: 1,
        scale: 1,
        rotation: 0,
      },
    },
  },
  modern: {
    name: "modern",
    displayName: "Modern Style",
    style: {
      typography: {
        fontFamily: "Helvetica",
        fontSize: 18,
        fontWeight: "normal",
        fontColor: "#ffffff",
        textAlign: "center",
        lineHeight: 1.2,
        letterSpacing: 0,
      },
      position: {
        type: "center",
        customX: 0.5,
        customY: 0.5,
        margin: 20,
      },
      background: {
        enabled: true,
        color: "#000000",
        opacity: 0.6,
        padding: {
          top: 16,
          right: 20,
          bottom: 16,
          left: 20,
        },
        borderRadius: 12,
        backdropBlur: 8,
      },
      border: {
        enabled: true,
        color: "rgba(255, 255, 255, 0.3)",
        width: 2,
        style: "solid",
        radius: 12,
      },
      shadow: {
        enabled: true,
        color: "#000000",
        blur: 6,
        offsetX: 0,
        offsetY: 4,
        textShadow: {
          enabled: true,
          color: "#000000",
          blur: 3,
          offsetX: 0,
          offsetY: 2,
        },
      },
      animation: {
        type: "bounce",
        duration: 400,
        delay: 0,
        easing: "ease-out",
        scale: 1,
        rotation: 0,
      },
      effects: {
        opacity: 0.9,
        scale: 1,
        rotation: 0,
      },
    },
  },
  minimal: {
    name: "minimal",
    displayName: "Minimal Style",
    style: {
      typography: {
        fontFamily: "Arial",
        fontSize: 14,
        fontWeight: "light",
        fontColor: "#ffffff",
        textAlign: "center",
        lineHeight: 1.2,
        letterSpacing: 0,
      },
      position: {
        type: "bottom",
        customX: 0.5,
        customY: 0.9,
        margin: 20,
      },
      background: {
        enabled: true,
        color: "#000000",
        opacity: 0.5,
        padding: {
          top: 6,
          right: 8,
          bottom: 6,
          left: 8,
        },
        borderRadius: 2,
        backdropBlur: 3,
      },
      border: {
        enabled: false,
        color: "transparent",
        width: 0,
        style: "solid",
        radius: 2,
      },
      shadow: {
        enabled: true,
        color: "#000000",
        blur: 2,
        offsetX: 0,
        offsetY: 1,
        textShadow: {
          enabled: true,
          color: "#000000",
          blur: 1,
          offsetX: 0,
          offsetY: 1,
        },
      },
      animation: {
        type: "slide",
        duration: 200,
        delay: 0,
        easing: "linear",
        scale: 1,
        rotation: 0,
      },
      effects: {
        opacity: 0.8,
        scale: 1,
        rotation: 0,
      },
    },
  },
  bold: {
    name: "bold",
    displayName: "Bold Style",
    style: {
      typography: {
        fontFamily: "Arial",
        fontSize: 24,
        fontWeight: "bold",
        fontColor: "#ffffff",
        textAlign: "center",
        lineHeight: 1.2,
        letterSpacing: 0,
      },
      position: {
        type: "center",
        customX: 0.5,
        customY: 0.5,
        margin: 20,
      },
      background: {
        enabled: true,
        color: "#000000",
        opacity: 0.9,
        padding: {
          top: 20,
          right: 24,
          bottom: 20,
          left: 24,
        },
        borderRadius: 8,
        backdropBlur: 15,
      },
      border: {
        enabled: true,
        color: "rgba(255, 255, 255, 0.5)",
        width: 3,
        style: "solid",
        radius: 8,
      },
      shadow: {
        enabled: true,
        color: "#000000",
        blur: 12,
        offsetX: 0,
        offsetY: 6,
        textShadow: {
          enabled: true,
          color: "#000000",
          blur: 6,
          offsetX: 0,
          offsetY: 3,
        },
      },
      animation: {
        type: "bounce",
        duration: 600,
        delay: 0,
        easing: "ease-out",
        scale: 1,
        rotation: 0,
      },
      effects: {
        opacity: 1,
        scale: 1,
        rotation: 0,
      },
    },
  },
  elegant: {
    name: "elegant",
    displayName: "Elegant Style",
    style: {
      typography: {
        fontFamily: "Times New Roman",
        fontSize: 17,
        fontWeight: "normal",
        fontColor: "#ffffff",
        textAlign: "center",
        lineHeight: 1.2,
        letterSpacing: 0,
      },
      position: {
        type: "bottom",
        customX: 0.5,
        customY: 0.9,
        margin: 20,
      },
      background: {
        enabled: true,
        color: "#000000",
        opacity: 0.75,
        padding: {
          top: 14,
          right: 18,
          bottom: 14,
          left: 18,
        },
        borderRadius: 6,
        backdropBlur: 6,
      },
      border: {
        enabled: true,
        color: "rgba(255, 255, 255, 0.4)",
        width: 1,
        style: "solid",
        radius: 6,
      },
      shadow: {
        enabled: true,
        color: "#000000",
        blur: 5,
        offsetX: 0,
        offsetY: 3,
        textShadow: {
          enabled: true,
          color: "#000000",
          blur: 2,
          offsetX: 0,
          offsetY: 1,
        },
      },
      animation: {
        type: "fade",
        duration: 350,
        delay: 0,
        easing: "ease-in-out",
        scale: 1,
        rotation: 0,
      },
      effects: {
        opacity: 0.95,
        scale: 1,
        rotation: 0,
      },
    },
  },
};

const CaptionStylingContainer: React.FC<CaptionStylingProps> = ({
  initialStyle,
  onStyleChange,
  onPresetSelect,
  previewMode = false,
  className = "",
}) => {
  const [state, setState] = useState<CaptionStylingState>({
    currentStyle: initialStyle || CAPTION_PRESETS.classic.style,
    selectedPreset: initialStyle ? null : "classic",
    isCustomMode: false,
    previewMode,
    validationErrors: [],
    styleHistory: [initialStyle || CAPTION_PRESETS.classic.style],
    historyIndex: 0,
  });

  // Validation function
  const validateCaptionStyle = useCallback(
    (style: CaptionStyle): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (style.typography.fontSize < 8 || style.typography.fontSize > 200) {
        errors.push("Font size must be between 8 and 200 pixels");
      }

      if (
        !style.typography.fontColor ||
        !/^#[0-9A-Fa-f]{6}$/.test(style.typography.fontColor)
      ) {
        errors.push("Font color must be a valid hex color (e.g., #FFFFFF)");
      }

      if (
        style.background.enabled &&
        !style.background.color.includes("rgba") &&
        !/^#[0-9A-Fa-f]{6}$/.test(style.background.color)
      ) {
        errors.push("Background color must be a valid hex color or rgba value");
      }

      if (
        style.background.padding.top < 0 ||
        style.background.padding.top > 100
      ) {
        errors.push("Padding must be between 0 and 100 pixels");
      }

      if (
        style.background.borderRadius < 0 ||
        style.background.borderRadius > 50
      ) {
        errors.push("Border radius must be between 0 and 50 pixels");
      }

      if (style.effects.opacity < 0 || style.effects.opacity > 1) {
        errors.push("Opacity must be between 0 and 1");
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    []
  );

  const handleStyleChange = useCallback(
    (updates: Partial<CaptionStyle>) => {
      const newStyle = { ...state.currentStyle, ...updates };
      const validation = validateCaptionStyle(newStyle);

      setState((prev) => ({
        ...prev,
        currentStyle: newStyle,
        isCustomMode: true,
        selectedPreset: null,
        validationErrors: validation.errors,
        styleHistory: [
          ...prev.styleHistory.slice(0, prev.historyIndex + 1),
          newStyle,
        ],
        historyIndex: prev.historyIndex + 1,
      }));

      onStyleChange(newStyle);
    },
    [state.currentStyle, validateCaptionStyle, onStyleChange]
  );

  const handlePresetSelect = useCallback(
    (presetName: string) => {
      const preset =
        CAPTION_PRESETS[presetName as keyof typeof CAPTION_PRESETS];
      if (preset) {
        setState((prev) => ({
          ...prev,
          currentStyle: preset.style,
          selectedPreset: presetName,
          isCustomMode: false,
          validationErrors: [],
          styleHistory: [
            ...prev.styleHistory.slice(0, prev.historyIndex + 1),
            preset.style,
          ],
          historyIndex: prev.historyIndex + 1,
        }));
        onPresetSelect(presetName);
      }
    },
    [onPresetSelect]
  );

  const handleUndo = useCallback(() => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const previousStyle = state.styleHistory[newIndex];
      setState((prev) => ({
        ...prev,
        currentStyle: previousStyle,
        historyIndex: newIndex,
        isCustomMode: true,
        selectedPreset: null,
      }));
      onStyleChange(previousStyle);
    }
  }, [state.historyIndex, state.styleHistory, onStyleChange]);

  const handleRedo = useCallback(() => {
    if (state.historyIndex < state.styleHistory.length - 1) {
      const newIndex = state.historyIndex + 1;
      const nextStyle = state.styleHistory[newIndex];
      setState((prev) => ({
        ...prev,
        currentStyle: nextStyle,
        historyIndex: newIndex,
        isCustomMode: true,
        selectedPreset: null,
      }));
      onStyleChange(nextStyle);
    }
  }, [state.historyIndex, state.styleHistory, onStyleChange]);

  const handleReset = useCallback(() => {
    const defaultStyle = CAPTION_PRESETS.classic.style;
    setState((prev) => ({
      ...prev,
      currentStyle: defaultStyle,
      selectedPreset: "classic",
      isCustomMode: false,
      validationErrors: [],
      styleHistory: [
        ...prev.styleHistory.slice(0, prev.historyIndex + 1),
        defaultStyle,
      ],
      historyIndex: prev.historyIndex + 1,
    }));
    onStyleChange(defaultStyle);
  }, [onStyleChange]);

  const handleSaveCustom = useCallback(() => {
    // This would typically save to localStorage or send to backend
    const customPresets = JSON.parse(
      localStorage.getItem("customCaptionPresets") || "{}"
    );
    const presetName = `Custom ${Date.now()}`;
    customPresets[presetName] = state.currentStyle;
    localStorage.setItem("customCaptionPresets", JSON.stringify(customPresets));

    // You could also show a success message here
    console.log("Custom preset saved:", presetName);
  }, [state.currentStyle]);

  return (
    <div className={`caption-styling-container ${className}`}>
      <div className="styling-header">
        <h2 className="text-xl font-bold text-dark-text-primary mb-4">
          Caption Styling Configuration
        </h2>

        <PresetSelector
          selectedPreset={state.selectedPreset}
          onPresetChange={handlePresetSelect}
          availablePresets={Object.values(CAPTION_PRESETS)}
        />
      </div>

      <div className="styling-content grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="style-configuration lg:col-span-2">
          <div className="space-y-6">
            {/* Temporarily commented out individual panels until they are updated */}
            <div className="p-6 bg-dark-bg-secondary rounded-lg border border-dark-border-subtle">
              <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                Caption Styling Configuration
              </h3>
              <p className="text-dark-text-secondary">
                Advanced styling panels are being updated. The basic styling
                options are available in the main settings panel.
              </p>
            </div>
          </div>
        </div>

        <div className="preview-section">
          {state.previewMode && (
            <LivePreview
              style={state.currentStyle}
              captions={[
                { text: "Welcome to our video", startTime: 0, endTime: 3 },
                { text: "This is a sample caption", startTime: 3, endTime: 6 },
                { text: "See how it looks!", startTime: 6, endTime: 9 },
              ]}
            />
          )}
        </div>
      </div>

      {state.validationErrors.length > 0 && (
        <ValidationPanel errors={state.validationErrors} />
      )}

      <ActionButtons
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        onSaveCustom={handleSaveCustom}
        canUndo={state.historyIndex > 0}
        canRedo={state.historyIndex < state.styleHistory.length - 1}
        isCustomMode={state.isCustomMode}
      />
    </div>
  );
};

export default CaptionStylingContainer;
