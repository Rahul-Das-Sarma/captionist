# Captionist 🎬

**Professional video captioning made simple**

Captionist is a modern web application that transforms your videos with professional, animated captions. Upload your video, provide a transcript or SRT file, and generate beautiful captions with multiple animation styles and positioning options.

## ✨ Features

- **Video Upload**: Support for MP4, MOV, AVI, WebM formats
- **Multiple Input Methods**:
  - Upload SRT subtitle files
  - Manual transcript input
  - Sample transcript for testing
- **Animated Captions**: 4 different caption styles
  - Reel style (modern social media look)
  - Classic style (traditional subtitles)
  - Bounce style (dynamic animations)
  - Slide style (smooth transitions)
- **Flexible Positioning**: Bottom, center, or top caption placement
- **Real-time Preview**: See captions as they appear on your video
- **Export Functionality**: Download generated captions as SRT files
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern, professional interface

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd captionist
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Build for Production

```bash
pnpm build
# or
npm run build
```

## 🎯 How to Use

1. **Upload Your Video**

   - Click the upload area or drag and drop your video file
   - Supported formats: MP4, MOV, AVI, WebM

2. **Add Captions**

   - **Option A**: Upload an existing SRT file
   - **Option B**: Paste your transcript manually
   - **Option C**: Use the sample transcript for testing

3. **Generate Captions**

   - Click "Generate Captions" to create animated captions
   - Captions will automatically sync with your video duration

4. **Customize Appearance**

   - Click the settings button to access customization options
   - Choose from 4 caption styles: Reel, Classic, Bounce, Slide
   - Adjust caption position: Bottom, Center, or Top

5. **Download Results**
   - Click "Download Captions" to save as SRT file
   - Use the generated file in other video editing software

## 🛠️ Technical Details

### Built With

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/            # Reusable UI components
│   ├── AppHeader.tsx  # Application header
│   ├── VideoPlayer.tsx # Video player with captions
│   └── ...
├── hooks/             # Custom React hooks
│   ├── useAppState.ts # Main application state
│   ├── useCaptionGenerator.ts # Caption generation logic
│   └── ...
├── utils/             # Utility functions
│   ├── srtParser.ts   # SRT file parsing
│   ├── audioExtractor.ts # Audio processing
│   └── ...
└── lib/               # Shared libraries
```

### Key Features Implementation

- **Caption Generation**: Intelligent text segmentation based on video duration
- **SRT Parsing**: Robust subtitle file processing with validation
- **Animation System**: Smooth, performant caption animations
- **State Management**: Custom hooks for clean state organization
- **File Handling**: Secure file upload and processing

## 🎨 Caption Styles

### Reel Style

Modern, social media-inspired captions with bold typography and smooth animations.

### Classic Style

Traditional subtitle appearance with clean, readable text.

### Bounce Style

Dynamic captions with playful bounce animations.

### Slide Style

Smooth sliding transitions for professional presentations.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by professional video editing tools
- Designed for content creators and video editors

---

**Made with ❤️ for the video content community**
