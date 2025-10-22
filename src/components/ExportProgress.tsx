import React, { useEffect } from "react";
import { useExportProgress } from "../hooks/useExportProgress";
import type { ExportProgress as ExportProgressType } from "../hooks/useExportProgress";

interface ExportProgressProps {
  jobId: string | null;
  onComplete?: (outputPath?: string) => void;
  onError?: (error: string) => void;
  onDownload?: (jobId: string) => void;
}

const ExportProgress: React.FC<ExportProgressProps> = ({
  jobId,
  onComplete,
  onError,
  onDownload,
}) => {
  const { progress, isPolling, error, startPolling, stopPolling, reset } =
    useExportProgress();

  useEffect(() => {
    console.log("🔄 ExportProgress: jobId changed:", jobId);
    if (jobId) {
      console.log("🚀 Starting polling for jobId:", jobId);
      startPolling(jobId);
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
  console.log("📊 ExportProgress render:", {
    jobId,
    progress,
    error,
    isPolling,
  });

  // Always show the component if we have a jobId, even if no progress yet
  if (!jobId) {
    console.log("❌ No jobId, not rendering");
    return null;
  }

  // Show loading state if no progress data yet
  if (!progress && !error) {
    console.log("⏳ No progress data yet, showing loading state");
    return (
      <div className="bg-dark-bg-secondary rounded-3xl p-6 mb-5 border border-dark-border-subtle shadow-dark-primary">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-dark-text-primary text-shadow-dark-glow">
            Export Progress
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⏳</span>
            <span className="font-medium text-yellow-500">
              Starting export...
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-dark-text-secondary">
          <div className="animate-spin w-4 h-4 border-2 border-dark-accent-primary border-t-transparent rounded-full" />
          <span>Initializing...</span>
        </div>
      </div>
    );
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

  const formatSpeed = (speed?: number) => {
    if (!speed) return "";
    return ` (${speed}x speed)`;
  };

  return (
    <div className="bg-dark-bg-secondary rounded-3xl p-6 mb-5 border border-dark-border-subtle shadow-dark-primary">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-dark-text-primary text-shadow-dark-glow">
          Export Progress
        </h4>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">
            {getStatusIcon(progress?.status || "pending")}
          </span>
          <span
            className={`font-medium ${getStatusColor(
              progress?.status || "pending"
            )}`}
          >
            {getStatusText(progress?.status || "pending")}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-dark-text-secondary">
            {progress?.progress || 0}% complete
          </span>
          {progress?.processingSpeed && (
            <span className="text-sm text-dark-text-secondary">
              {progress.processingSpeed}x speed
            </span>
          )}
        </div>

        <div className="w-full bg-dark-bg-tertiary rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary transition-all duration-500 ease-out"
            style={{
              width: `${progress?.progress || 0}%`,
              transition: "width 0.5s ease-out",
            }}
          />
        </div>
      </div>

      {/* Status Message */}
      {progress?.message && (
        <div className="mb-4">
          <p className="text-sm text-dark-text-secondary">{progress.message}</p>
        </div>
      )}

      {/* Time Remaining */}
      {progress?.estimatedTimeRemaining && progress.status === "processing" && (
        <div className="mb-4">
          <p className="text-sm text-dark-text-secondary">
            {formatTimeRemaining(progress.estimatedTimeRemaining)}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        {progress?.status === "completed" && jobId && (
          <button
            onClick={() => onDownload?.(jobId)}
            className="px-4 py-2 bg-dark-accent-primary text-white rounded-lg hover:bg-dark-accent-secondary transition-colors duration-300 font-medium"
          >
            Download Video
          </button>
        )}

        {progress?.status === "failed" && (
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 font-medium"
          >
            Try Again
          </button>
        )}

        {isPolling && (
          <div className="flex items-center space-x-2 text-sm text-dark-text-secondary">
            <div className="animate-spin w-4 h-4 border-2 border-dark-accent-primary border-t-transparent rounded-full" />
            <span>Updating...</span>
          </div>
        )}
      </div>

      {/* Large File Warning */}
      {progress?.status === "processing" &&
        progress.progress > 0 &&
        progress.progress < 10 && (
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-400">
              ⚠️ Large video detected. Processing may take several minutes.
              Please be patient.
            </p>
          </div>
        )}
    </div>
  );
};

export default ExportProgress;
