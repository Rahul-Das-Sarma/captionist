import VideoPlayer from "./components/VideoPlayer";
import VideoUploadSection from "./components/VideoUploadSection";
import ActionButtonsPanel from "./components/ActionButtonsPanel";
import CaptionGenerationPanel from "./components/CaptionGenerationPanel";
import SettingsPanel from "./components/SettingsPanel";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import { useAppState } from "./hooks/useAppState";
import "./App.css";

function App() {
  const {
    videoFile,
    videoUrl,
    captionStyle,
    captionPosition,
    showSettings,
    srtFile,
    isUploadingSrt,
    transcript,
    captionGenerator,
    handleFileUpload,
    handleSRTUpload,
    handleSetMockTranscript,
    handleGenerateCaptions,
    handleDownloadCaptions,
    handleToggleSettings,
    handleCaptionStyleChange,
    handleCaptionPositionChange,
    handleTranscriptChange,
  } = useAppState();

  return (
    <div className="app">
      <AppHeader />

      <main className="app-main">
        {!videoFile ? (
          <VideoUploadSection onFileUpload={handleFileUpload} />
        ) : (
          <div className="flex flex-row gap-6 h-[calc(100vh-200px)] overflow-hidden p-5 items-start">
            {/* Video Player - Left Side */}
            <div className="flex-1 min-w-[400px] max-w-[450px] h-full flex flex-col">
              <VideoPlayer
                videoUrl={videoUrl}
                captions={captionGenerator.captions}
                captionStyle={captionStyle}
                captionPosition={captionPosition}
                showControls={true}
              />
            </div>

            {/* Controls - Right Side */}
            <div className="flex w-full gap-4 h-[500px] overflow-y-auto p-0">
              <ActionButtonsPanel
                showSettings={showSettings}
                onToggleSettings={handleToggleSettings}
                onDownloadCaptions={handleDownloadCaptions}
                onCreateTestCaptions={() =>
                  captionGenerator.createTestCaptions()
                }
                captionsCount={captionGenerator.captions.length}
                isGenerating={captionGenerator.isGenerating}
              />

              <CaptionGenerationPanel
                srtFile={srtFile}
                isUploadingSrt={isUploadingSrt}
                transcript={transcript}
                onSRTUpload={handleSRTUpload}
                onTranscriptChange={handleTranscriptChange}
                onSetMockTranscript={handleSetMockTranscript}
                onGenerateCaptions={handleGenerateCaptions}
              />

              {showSettings && (
                <SettingsPanel
                  captionStyle={captionStyle}
                  captionPosition={captionPosition}
                  onCaptionStyleChange={handleCaptionStyleChange}
                  onCaptionPositionChange={handleCaptionPositionChange}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
}

export default App;
