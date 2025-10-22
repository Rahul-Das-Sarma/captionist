import VideoPlayer from "./components/VideoPlayer";
import VideoUploadSection from "./components/VideoUploadSection";
import ActionButtonsPanel from "./components/ActionButtonsPanel";
import CaptionGenerationPanel from "./components/CaptionGenerationPanel";
import SettingsPanel from "./components/SettingsPanel";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import { BackendStatus } from "./components/BackendStatus";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ExportProgressModal from "./components/ExportProgressModal";
import { useAppState } from "./hooks/useAppState";
import { FileSizeDetector } from "./utils/fileSizeDetector";
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
    useBackend,
    isExporting,
    exportJobId,
    showExportModal,
    captionGenerator,
    backendIntegration,
    handleFileUpload,
    handleSRTUpload,
    handleSetMockTranscript,
    handleGenerateCaptions,
    handleDownloadCaptions,
    handleExportVideo,
    handleDownloadExport,
    handleExportComplete,
    handleExportError,
    handleCloseExportModal,
    handleToggleSettings,
    handleCaptionStyleChange,
    handleCaptionPositionChange,
    handleTranscriptChange,
    handleToggleBackend,
    handleTranscribeVideo,
  } = useAppState();

  return (
    <ErrorBoundary>
      <div className="app">
        <AppHeader />

        {/* Backend Status */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <BackendStatus
              onStatusChange={(isConnected) => {
                console.log("Backend status changed:", isConnected);
              }}
            />
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useBackend}
                  onChange={handleToggleBackend}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Use Backend</span>
              </label>
            </div>
          </div>
        </div>

        <main className="app-main">
          {!videoFile ? (
            <VideoUploadSection onFileUpload={handleFileUpload} />
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] overflow-hidden p-5 items-start">
              {/* Video Player - Left Side */}
              <div className="w-full lg:flex-1 lg:min-w-[300px] lg:max-w-[450px] h-full flex flex-col">
                <VideoPlayer
                  videoUrl={videoUrl}
                  captions={captionGenerator.captions}
                  captionStyle={captionStyle}
                  captionPosition={captionPosition}
                  showControls={true}
                />
              </div>

              {/* Controls - Right Side */}
              <div className="flex flex-col lg:flex-row w-full gap-4 h-[500px] overflow-y-auto p-0">
                <ActionButtonsPanel
                  showSettings={showSettings}
                  onToggleSettings={handleToggleSettings}
                  onDownloadCaptions={handleDownloadCaptions}
                  onExportVideo={handleExportVideo}
                  onCreateTestCaptions={() =>
                    captionGenerator.createTestCaptions()
                  }
                  captionsCount={captionGenerator.captions.length}
                  isGenerating={captionGenerator.isGenerating}
                  isExporting={isExporting}
                />

                <CaptionGenerationPanel
                  srtFile={srtFile}
                  isUploadingSrt={isUploadingSrt}
                  transcript={transcript}
                  onSRTUpload={handleSRTUpload}
                  onTranscriptChange={handleTranscriptChange}
                  onSetMockTranscript={handleSetMockTranscript}
                  onGenerateCaptions={handleGenerateCaptions}
                  onTranscribeVideo={handleTranscribeVideo}
                  useBackend={useBackend}
                  backendIntegration={backendIntegration}
                />

                {/* Export Progress Modal */}
                {showExportModal && (
                  <ExportProgressModal
                    jobId={exportJobId}
                    fileSize={(() => {
                      // Try to get file size from video element
                      const videoElement = document.querySelector("video");
                      if (videoElement) {
                        return FileSizeDetector.getFileSizeFromVideo(
                          videoElement
                        );
                      }
                      // Fallback to video file size if available
                      return videoFile?.size || 0;
                    })()}
                    onComplete={handleExportComplete}
                    onError={handleExportError}
                    onDownload={handleDownloadExport}
                    onClose={handleCloseExportModal}
                  />
                )}

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
    </ErrorBoundary>
  );
}

export default App;
