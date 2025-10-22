import React, { useEffect } from "react";
import { useExportProgress } from "../hooks/useExportProgress";
import type { ExportProgress as ExportProgressType } from "../hooks/useExportProgress";
import { FileSizeDetector } from "../utils/fileSizeDetector";

interface ExportProgressModalProps {
  jobId: string | null;
  fileSize?: number;
  onComplete?: (outputPath?: string) => void;
  onError?: (error: string) => void;
  onDownload?: (jobId: string) => void;
  onClose?: () => void;
}

const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
  jobId,
  fileSize = 0,
  onComplete,
  onError,
  onDownload,
  onClose,
}) => {
  const { progress, isPolling, error, startPolling, stopPolling, reset } =
    useExportProgress();

  useEffect(() => {
    console.log("🔄 ExportProgressModal: jobId changed:", jobId);
    if (jobId) {
      console.log(
        "🚀 Starting smart polling for jobId:",
        jobId,
        "fileSize:",
        fileSize
      );
      startPolling(jobId, fileSize);
    } else {
      console.log("🛑 Resetting progress");
      reset();
    }

    return () => {
      stopPolling();
    };
  }, [jobId, startPolling, stopPolling, reset]);

  // Handle completion
  useEffect(() => {
    if (progress?.status === "completed") {
      onComplete?.(progress.outputPath);
    }
  }, [progress?.status, progress?.outputPath, onComplete]);

  // Handle errors
  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  // Debug logging
  console.log("📊 ExportProgressModal render:", {
    jobId,
    progress,
    error,
    isPolling,
  });

  // Don't render if modal is not shown
  if (!jobId && !isPolling) {
    return null;
  }

  const getStatusColor = (status: ExportProgressType["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "processing":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: ExportProgressType["status"]) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "processing":
        return "⚙️";
      case "completed":
        return "✅";
      case "failed":
        return "❌";
      default:
        return "❓";
    }
  };

  const getStatusText = (status: ExportProgressType["status"]) => {
    switch (status) {
      case "pending":
        return "Starting export...";
      case "processing":
        return "Processing video...";
      case "completed":
        return "Export complete!";
      case "failed":
        return "Export failed";
      default:
        return "Unknown status";
    }
  };

  const formatTimeRemaining = (seconds?: number) => {
    if (!seconds) return "";
    if (seconds < 60) return `${Math.round(seconds)}s remaining`;
    const minutes = Math.round(seconds / 60);
    return `${minutes}m remaining`;
  };

  const canClose =
    progress?.status === "completed" || progress?.status === "failed" || !jobId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-dark-bg-secondary rounded-3xl p-8 mx-4 max-w-md w-full border border-dark-border-subtle shadow-dark-primary">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-dark-text-primary text-shadow-dark-glow">
            Exporting Video
          </h3>
          {canClose && (
            <button
              onClick={onClose}
              className="text-dark-text-secondary hover:text-dark-text-primary transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-3xl">
            {!jobId ? "⏳" : getStatusIcon(progress?.status || "pending")}
          </span>
          <div>
            <span
              className={`text-lg font-medium ${
                !jobId
                  ? "text-yellow-500"
                  : getStatusColor(progress?.status || "pending")
              }`}
            >
              {!jobId
                ? "Preparing export..."
                : getStatusText(progress?.status || "pending")}
            </span>
            {(!jobId || isPolling) && (
              <div className="flex items-center space-x-2 mt-1">
                <div className="animate-spin w-4 h-4 border-2 border-dark-accent-primary border-t-transparent rounded-full" />
                <span className="text-sm text-dark-text-secondary">
                  {!jobId ? "Initializing..." : "Updating..."}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-dark-text-secondary">
              {!jobId ? "0% complete" : `${progress?.progress || 0}% complete`}
            </span>
            {progress?.processingSpeed && (
              <span className="text-sm text-dark-text-secondary">
                {progress.processingSpeed}x speed
              </span>
            )}
          </div>

          <div className="w-full bg-dark-bg-tertiary rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary transition-all duration-500 ease-out"
              style={{
                width: `${!jobId ? 0 : progress?.progress || 0}%`,
                transition: "width 0.5s ease-out",
              }}
            />
          </div>
        </div>

        {/* Status Message */}
        {progress?.message && (
          <div className="mb-4">
            <p className="text-sm text-dark-text-secondary text-center">
              {progress.message}
            </p>
          </div>
        )}

        {/* Time Remaining */}
        {progress?.estimatedTimeRemaining &&
          progress.status === "processing" && (
            <div className="mb-4">
              <p className="text-sm text-dark-text-secondary text-center">
                {formatTimeRemaining(progress.estimatedTimeRemaining)}
              </p>
            </div>
          )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* File Size Information */}
        {fileSize > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center text-sm text-dark-text-secondary">
              <span>
                File size: {FileSizeDetector.formatFileSize(fileSize)}
              </span>
              {(() => {
                const category = FileSizeDetector.getFileSizeCategory(fileSize);
                return (
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      category.category === "very-large"
                        ? "bg-red-900/20 text-red-400"
                        : category.category === "large"
                        ? "bg-yellow-900/20 text-yellow-400"
                        : "bg-blue-900/20 text-blue-400"
                    }`}
                  >
                    {category.label} • {category.estimatedTime}
                  </span>
                );
              })()}
            </div>
          </div>
        )}

        {/* Large File Warning */}
        {fileSize > 100 * 1024 * 1024 && progress?.status === "processing" && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-400 text-center">
              ⚠️ Large video detected (
              {FileSizeDetector.formatFileSize(fileSize)}). Processing may take
              several minutes. Please be patient.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          {progress?.status === "completed" && jobId && (
            <button
              onClick={() => onDownload?.(jobId)}
              className="w-full px-6 py-3 bg-dark-accent-primary text-white rounded-lg hover:bg-dark-accent-secondary transition-colors duration-300 font-medium"
            >
              Download Video
            </button>
          )}

          {progress?.status === "failed" && (
            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 font-medium"
            >
              Try Again
            </button>
          )}

          {!canClose && (
            <div className="text-center">
              <p className="text-xs text-dark-text-secondary">
                {!jobId
                  ? "Preparing your video for export..."
                  : "Please wait while your video is being processed..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportProgressModal;
