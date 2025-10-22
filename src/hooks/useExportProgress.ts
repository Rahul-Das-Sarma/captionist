import { useState, useCallback, useEffect, useRef } from "react";
import { apiService } from "../services/apiService";

export interface ExportProgress {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number; // 0-100
  message?: string;
  outputPath?: string;
  error?: string;
  estimatedTimeRemaining?: number; // in seconds
  processingSpeed?: number; // e.g., 2.5x
}

export interface UseExportProgressReturn {
  progress: ExportProgress | null;
  isPolling: boolean;
  error: string | null;
  startPolling: (jobId: string, fileSize?: number) => void;
  stopPolling: () => void;
  reset: () => void;
  checkProgress: () => Promise<void>;
}

// Smart polling intervals based on progress and file size
const POLLING_INTERVALS = {
  fast: 5000, // 5 seconds - for quick initial feedback (increased from 2s)
  normal: 10000, // 10 seconds - standard polling (increased from 5s)
  slow: 15000, // 15 seconds - for large files (increased from 10s)
  final: 20000, // 20 seconds - when almost done (increased from 15s)
};

export const useExportProgress = (): UseExportProgressReturn => {
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const jobIdRef = useRef<string | null>(null);
  const fileSizeRef = useRef<number>(0);
  const retryCountRef = useRef<number>(0);
  const isPollingRef = useRef<boolean>(false);
  const maxRetries = 3;

  // Calculate smart polling interval based on progress and file size
  const getPollingInterval = useCallback(
    (currentProgress: number, fileSize: number) => {
      // Minimum interval to prevent rate limiting
      const MIN_INTERVAL = 5000; // 5 seconds minimum

      let interval;

      // Initial fast polling for quick feedback
      if (currentProgress < 5) {
        interval = POLLING_INTERVALS.fast;
      }
      // Normal polling for most of the process
      else if (currentProgress < 50) {
        interval = POLLING_INTERVALS.normal;
      }
      // Slower polling for large files
      else if (fileSize > 100 * 1024 * 1024) {
        // 100MB+
        interval = POLLING_INTERVALS.slow;
      }
      // Final slow polling when almost done
      else {
        interval = POLLING_INTERVALS.final;
      }

      // Ensure minimum interval
      return Math.max(interval, MIN_INTERVAL);
    },
    []
  );

  const stopPolling = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isPollingRef.current = false;
    setIsPolling(false);
  }, []);

  // Check progress with retry logic
  const checkProgress = useCallback(async () => {
    if (!jobIdRef.current) return;

    try {
      console.log("🔍 Polling export status for jobId:", jobIdRef.current);
      const response = await apiService.getExportStatus(jobIdRef.current);
      console.log("📡 Export status response:", response);

      if (!response.success) {
        throw new Error(response.error || "Failed to get export status");
      }

      const data = response.data;
      if (!data) {
        throw new Error("No progress data received");
      }

      console.log("📈 Progress data received:", data);
      setProgress(data);
      setError(null);
      retryCountRef.current = 0; // Reset retry count on success

      // Stop polling if completed or failed
      if (data.status === "completed" || data.status === "failed") {
        console.log("🏁 Export finished with status:", data.status);
        stopPolling();

        if (data.status === "failed") {
          setError(data.error || "Export failed");
        }
      }
    } catch (err) {
      console.error("❌ Progress check failed:", err);
      retryCountRef.current++;

      if (retryCountRef.current >= maxRetries) {
        setError(
          `Failed to check progress after ${maxRetries} attempts: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        stopPolling();
      }
    }
  }, [stopPolling]);

  const startPolling = useCallback(
    (jobId: string, fileSize: number = 0) => {
      if (!jobId) return;

      // Stop any existing polling
      stopPolling();

      jobIdRef.current = jobId;
      fileSizeRef.current = fileSize;
      isPollingRef.current = true;
      setIsPolling(true);
      setError(null);
      retryCountRef.current = 0;

      // Initial progress state
      setProgress({
        jobId,
        status: "pending",
        progress: 0,
        message: "Starting export...",
      });

      const poll = () => {
        if (!isPollingRef.current) return; // Stop if polling was stopped

        checkProgress().then(() => {
          if (!isPollingRef.current) return; // Double check

          // Get current progress from state
          setProgress((currentProgress) => {
            if (!currentProgress) return null;

            const currentStatus = currentProgress.status;
            const currentProgressValue = currentProgress.progress;

            if (currentStatus !== "completed" && currentStatus !== "failed") {
              const interval = getPollingInterval(
                currentProgressValue,
                fileSizeRef.current
              );
              console.log(
                `🔄 Next poll in ${interval}ms (progress: ${currentProgressValue}%, fileSize: ${fileSizeRef.current} bytes)`
              );
              timeoutRef.current = setTimeout(poll, interval);
            }

            return currentProgress;
          });
        });
      };

      // Start immediately
      poll();
    },
    [stopPolling, checkProgress, getPollingInterval]
  );

  const reset = useCallback(() => {
    stopPolling();
    setProgress(null);
    setError(null);
    jobIdRef.current = null;
    fileSizeRef.current = 0;
    retryCountRef.current = 0;
    isPollingRef.current = false;
  }, [stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    progress,
    isPolling,
    error,
    startPolling,
    stopPolling,
    reset,
    checkProgress,
  };
};
