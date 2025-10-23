// Caption Styling Types
// This file defines all the TypeScript interfaces and types for the caption styling system

export interface CaptionStyle {
  typography: TypographyStyle;
  position: PositionStyle;
  background: BackgroundStyle;
  border: BorderStyle;
  shadow: ShadowStyle;
  animation: AnimationStyle;
  effects: EffectsStyle;
}

export interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: "light" | "normal" | "bold";
  fontColor: string;
  textAlign: "left" | "center" | "right";
  lineHeight: number;
  letterSpacing: number;
}

export interface PositionStyle {
  type: "top" | "center" | "bottom" | "custom";
  customX: number; // 0-1, horizontal position
  customY: number; // 0-1, vertical position
  margin: number; // pixels
}

export interface BackgroundStyle {
  enabled: boolean;
  color: string;
  opacity: number; // 0-1
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  borderRadius: number;
  backdropBlur: number;
}

export interface BorderStyle {
  enabled: boolean;
  color: string;
  width: number;
  style: "solid" | "dashed" | "dotted";
  radius: number;
}

export interface ShadowStyle {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  textShadow: {
    enabled: boolean;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

export interface AnimationStyle {
  type: "none" | "fade" | "slide" | "bounce" | "typewriter";
  duration: number; // milliseconds
  delay: number; // milliseconds
  easing: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "bounce";
  scale: number;
  rotation: number; // degrees
}

export interface EffectsStyle {
  opacity: number; // 0-1
  scale: number;
  rotation: number; // degrees
}

// Preset definitions
export interface CaptionPreset {
  name: string;
  displayName: string;
  thumbnail?: string;
  style: CaptionStyle;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Component props interfaces
export interface CaptionStylingProps {
  initialStyle?: CaptionStyle;
  onStyleChange: (style: CaptionStyle) => void;
  onPresetSelect: (presetName: string) => void;
  previewMode?: boolean;
}

export interface PresetSelectorProps {
  selectedPreset: string | null;
  onPresetChange: (preset: string) => void;
  availablePresets: CaptionPreset[];
}

export interface TypographyPanelProps {
  style: TypographyStyle;
  onChange: (updates: Partial<TypographyStyle>) => void;
}

export interface PositionPanelProps {
  style: PositionStyle;
  onChange: (updates: Partial<PositionStyle>) => void;
}

export interface BackgroundPanelProps {
  style: BackgroundStyle;
  onChange: (updates: Partial<BackgroundStyle>) => void;
}

export interface BorderPanelProps {
  style: BorderStyle;
  onChange: (updates: Partial<BorderStyle>) => void;
}

export interface ShadowPanelProps {
  style: ShadowStyle;
  onChange: (updates: Partial<ShadowStyle>) => void;
}

export interface AnimationPanelProps {
  style: AnimationStyle;
  onChange: (updates: Partial<AnimationStyle>) => void;
}

export interface LivePreviewProps {
  style: CaptionStyle;
  captions: Array<{
    text: string;
    startTime: number;
    endTime: number;
  }>;
}

export interface ValidationPanelProps {
  errors: ValidationError[];
}

export interface ActionButtonsProps {
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onSaveCustom: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// Utility types
export type CaptionStyleKey = keyof CaptionStyle;
export type TypographyKey = keyof TypographyStyle;
export type PositionKey = keyof PositionStyle;
export type BackgroundKey = keyof BackgroundStyle;
export type BorderKey = keyof BorderStyle;
export type ShadowKey = keyof ShadowStyle;
export type AnimationKey = keyof AnimationStyle;
export type EffectsKey = keyof EffectsStyle;
