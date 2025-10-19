import React, { useRef } from "react";

interface CaptionGenerationPanelProps {
  srtFile: File | null;
  isUploadingSrt: boolean;
  transcript: string;
  onSRTUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTranscriptChange: (value: string) => void;
  onSetMockTranscript: () => void;
  onGenerateCaptions: () => void;
  onTranscribeVideo?: () => void;
  useBackend?: boolean;
  backendIntegration?: any;
}

const CaptionGenerationPanel: React.FC<CaptionGenerationPanelProps> = ({
  srtFile,
  isUploadingSrt,
  transcript,
  onSRTUpload,
  onTranscriptChange,
  onSetMockTranscript,
  onGenerateCaptions,
  onTranscribeVideo,
  useBackend = false,
  backendIntegration,
}) => {
  const srtInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-dark-bg-secondary rounded-3xl p-6 mb-5 border border-dark-border-subtle shadow-dark-primary">
      <h3 className="mb-5 text-xl font-bold text-dark-text-primary text-shadow-dark-glow">
        Caption Generation
      </h3>

      {/* SRT Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-dark-text-secondary">
          Upload SRT File
        </label>
        <div
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 ${
            srtFile
              ? "bg-green-900/20 border-green-400"
              : "bg-dark-bg-tertiary border-dark-border-subtle hover:border-dark-accent-primary"
          }`}
          onClick={() => srtInputRef.current?.click()}
        >
          <input
            ref={srtInputRef}
            type="file"
            accept=".srt"
            onChange={onSRTUpload}
            className="hidden"
          />
          {srtFile ? (
            <div>
              <div className="text-2xl mb-2">📄</div>
              <p className="text-sm font-medium text-green-400">
                {srtFile.name}
              </p>
            </div>
          ) : (
            <div>
              <div className="text-2xl mb-2">📄</div>
              <p className="text-sm text-dark-text-muted">
                Click to upload .srt file
              </p>
            </div>
          )}
        </div>
        {isUploadingSrt && (
          <div className="mt-2 text-sm text-dark-accent-primary text-center">
            Processing SRT file...
          </div>
        )}
      </div>

      {/* Transcript Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-dark-text-secondary">
          Manual Transcript
        </label>
        <textarea
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder="Paste your transcript here to generate captions..."
          className="w-full h-20 p-3 border border-dark-border-subtle rounded-xl text-sm resize-none bg-dark-bg-tertiary text-dark-text-primary placeholder-dark-text-muted focus:border-dark-accent-primary focus:outline-none transition-colors duration-300"
        />

        {/* Backend Status */}
        {useBackend && backendIntegration && (
          <div className="mt-2 text-xs text-gray-500">
            {backendIntegration.isUploading && (
              <span className="text-blue-500">📤 Uploading video...</span>
            )}
            {backendIntegration.isProcessing && (
              <span className="text-yellow-500">⚙️ Processing...</span>
            )}
            {backendIntegration.error && (
              <span className="text-red-500">
                ❌ {backendIntegration.error}
              </span>
            )}
          </div>
        )}

        <div className="mt-3 flex gap-2 flex-wrap">
          <button
            onClick={onSetMockTranscript}
            className="px-4 py-2 bg-dark-bg-tertiary text-dark-text-primary border border-dark-border-subtle rounded-lg text-sm font-medium hover:bg-dark-bg-primary hover:border-dark-accent-primary transition-all duration-300"
          >
            Use Sample
          </button>

          {useBackend && onTranscribeVideo && (
            <button
              onClick={onTranscribeVideo}
              disabled={backendIntegration?.isProcessing}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                !backendIntegration?.isProcessing
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-dark-bg-tertiary text-dark-text-muted cursor-not-allowed"
              }`}
            >
              {backendIntegration?.isProcessing
                ? "Transcribing..."
                : "🎤 Auto Transcribe"}
            </button>
          )}

          <button
            onClick={onGenerateCaptions}
            disabled={
              !transcript.trim() ||
              (useBackend && backendIntegration?.isProcessing)
            }
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              transcript.trim() &&
              !(useBackend && backendIntegration?.isProcessing)
                ? "bg-dark-accent-primary text-white hover:bg-dark-accent-secondary shadow-dark-glow"
                : "bg-dark-bg-tertiary text-dark-text-muted cursor-not-allowed"
            }`}
          >
            {useBackend && backendIntegration?.isProcessing
              ? "Processing..."
              : "Generate Captions"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptionGenerationPanel;
