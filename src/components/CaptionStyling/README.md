# Caption Styling System

A comprehensive React component system for configuring video caption styles with advanced typography, positioning, animations, and effects.

## Features

- **Preset System**: Pre-configured styles (Reel, Classic, Modern, Minimal, Bold, Elegant)
- **Typography Controls**: Font family, size, weight, color, alignment, spacing
- **Position Management**: Top, center, bottom positioning with custom coordinates
- **Background Effects**: Colors, opacity, padding, border radius, backdrop blur
- **Border Styling**: Individual side controls, colors, widths, styles
- **Shadow Effects**: Box and text shadows with offset and blur controls
- **Animation System**: Multiple animation types with easing and timing
- **Live Preview**: Real-time preview with responsive design
- **Validation**: Real-time validation with error handling
- **Import/Export**: JSON configuration import/export
- **Undo/Redo**: Style change history management

## Components

### Main Container

- `CaptionStylingContainer` - Main orchestrator component

### Style Panels

- `TypographyPanel` - Font and text styling
- `PositionPanel` - Caption positioning and layout
- `BackgroundPanel` - Background colors and effects
- `BorderPanel` - Border styling and individual side controls
- `ShadowPanel` - Box and text shadow effects
- `AnimationPanel` - Animation types and timing

### Utility Components

- `PresetSelector` - Style preset selection
- `LivePreview` - Real-time style preview
- `ValidationPanel` - Error display and validation
- `ActionButtons` - Undo/redo/reset/save controls

## Usage

### Basic Implementation

```tsx
import { CaptionStylingContainer } from "./components/CaptionStyling";

function App() {
  const [currentStyle, setCurrentStyle] = useState<CaptionStyle | null>(null);

  const handleStyleChange = (style: CaptionStyle) => {
    setCurrentStyle(style);
    // Apply style to your video captions
  };

  const handlePresetSelect = (presetName: string) => {
    console.log("Selected preset:", presetName);
  };

  return (
    <CaptionStylingContainer
      initialStyle={currentStyle}
      onStyleChange={handleStyleChange}
      onPresetSelect={handlePresetSelect}
      previewMode={true}
    />
  );
}
```

### Advanced Usage with Custom Styling

```tsx
import {
  CaptionStylingContainer,
  TypographyPanel,
  PositionPanel,
  LivePreview,
} from "./components/CaptionStyling";

function CustomCaptionStyler() {
  const [style, setStyle] = useState<CaptionStyle>(defaultStyle);
  const [errors, setErrors] = useState<string[]>([]);

  return (
    <div className="custom-styling-interface">
      <TypographyPanel
        style={style}
        onChange={(updates) => setStyle({ ...style, ...updates })}
        errors={errors}
      />

      <PositionPanel
        style={style}
        onChange={(updates) => setStyle({ ...style, ...updates })}
        errors={errors}
      />

      <LivePreview style={style} captions={sampleCaptions} />
    </div>
  );
}
```

## API Reference

### CaptionStylingContainer Props

```tsx
interface CaptionStylingProps {
  initialStyle?: CaptionStyle;
  onStyleChange: (style: CaptionStyle) => void;
  onPresetSelect: (presetName: string) => void;
  previewMode?: boolean;
  className?: string;
}
```

### CaptionStyle Interface

```tsx
interface CaptionStyle {
  type: "reel" | "classic" | "bounce" | "slide";
  position: "top" | "center" | "bottom";
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  padding: number;
  borderRadius: number;
  animationDuration?: number;
  animationDelay?: number;
  animationEasing?: string;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  opacity?: number;
  rotation?: number;
  textShadowColor?: string;
  textShadowBlur?: number;
  textShadowOffsetX?: number;
  textShadowOffsetY?: number;
  borderColor?: string;
  borderWidth?: number;
  backdropBlur?: number;
  fontWeight?: number;
  // ... additional properties
}
```

## Presets

### Available Presets

1. **Reel Style** - Modern social media style with rounded corners and shadows
2. **Classic Style** - Traditional TV-style captions
3. **Modern Style** - Contemporary design with bounce animations
4. **Minimal Style** - Clean, simple appearance
5. **Bold Style** - High contrast with strong visual presence
6. **Elegant Style** - Sophisticated typography with subtle effects

### Custom Presets

Users can create and save custom presets:

```tsx
const handleSaveCustom = () => {
  const customPresets = JSON.parse(
    localStorage.getItem("customCaptionPresets") || "{}"
  );
  const presetName = `Custom ${Date.now()}`;
  customPresets[presetName] = currentStyle;
  localStorage.setItem("customCaptionPresets", JSON.stringify(customPresets));
};
```

## Validation

The system includes comprehensive validation:

- **Font Size**: 8-200 pixels
- **Color Format**: Hex colors (#FFFFFF) or RGBA (rgba(255, 255, 255, 0.8))
- **Padding**: 0-100 pixels
- **Border Radius**: 0-50 pixels
- **Opacity**: 0-1 range
- **Animation Duration**: 100-2000 milliseconds

## Accessibility

- ARIA labels for all form controls
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators

## Keyboard Shortcuts

- `Ctrl+Z` - Undo last change
- `Ctrl+Y` - Redo last change
- `Ctrl+R` - Reset to default
- `Ctrl+S` - Save custom preset

## Styling

The components use Tailwind CSS classes with a dark theme. Key classes:

- `bg-dark-bg-primary` - Primary background
- `bg-dark-bg-secondary` - Secondary background
- `text-dark-text-primary` - Primary text color
- `border-dark-border-subtle` - Subtle borders
- `bg-dark-accent-primary` - Accent colors

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Optimized re-renders with React.memo
- Debounced input handling
- Efficient state management
- Minimal bundle size impact

## Examples

### Basic Caption Styling

```tsx
<CaptionStylingContainer
  initialStyle={{
    type: "reel",
    position: "bottom",
    fontSize: 19,
    fontFamily: "Arial",
    color: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 12,
    borderRadius: 25,
  }}
  onStyleChange={(style) => console.log("New style:", style)}
  onPresetSelect={(preset) => console.log("Preset:", preset)}
  previewMode={true}
/>
```

### Custom Animation

```tsx
const customStyle = {
  type: "bounce",
  animationDuration: 600,
  animationEasing: "ease-out",
  scale: 1.2,
  rotation: 5,
};
```

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Include accessibility attributes
4. Test with screen readers
5. Update documentation

## License

MIT License - see LICENSE file for details.
