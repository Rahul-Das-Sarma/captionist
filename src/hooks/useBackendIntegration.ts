import { useState, useCallback } from "react";
import {
  apiService,
  type CaptionGenerationRequest,
  type CaptionStyle,
  type CaptionSegment,
} from "../services/apiService";

export interface BackendIntegrationState {
  isUploading: boolean;
  isProcessing: boolean;
  uploadProgress: number;
  processingProgress: number;
  currentJobId: string | null;
  error: string | null;
  videoId: string | null;
  captions: CaptionSegment[];
}

export const useBackendIntegration = () => {
  const [state, setState] = useState<BackendIntegrationState>({
    isUploading: false,
    isProcessing: false,
    uploadProgress: 0,
    processingProgress: 0,
    currentJobId: null,
    error: null,
    videoId: null,
    captions: [],
  });

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const uploadVideo = useCallback(async (file: File) => {
    setState((prev) => ({
      ...prev,
      isUploading: true,
      uploadProgress: 0,
      error: null,
    }));

    try {
      console.log("🎬 Uploading video to backend...", file.name);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 10, 90),
        }));
      }, 200);

      const response = await apiService.uploadVideo(file);

      clearInterval(progressInterval);

      if (!response.success) {
        throw new Error(response.error || "Upload failed");
      }

      setState((prev) => ({
        ...prev,
        isUploading: false,
        uploadProgress: 100,
        videoId: response.data?.fileId || null,
      }));

      console.log("✅ Video uploaded successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Video upload failed:", error);
      setState((prev) => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        error: error instanceof Error ? error.message : "Upload failed",
      }));
      throw error;
    }
  }, []);

  const transcribeVideo = useCallback(
    async (file: File, language: string = "en-US") => {
      setState((prev) => ({
        ...prev,
        isProcessing: true,
        processingProgress: 0,
        error: null,
      }));

      try {
        console.log("🎤 Starting video transcription...", file.name);

        const response = await apiService.transcribeVideo(file, language);

        if (!response.success) {
          throw new Error(response.error || "Transcription failed");
        }

        const jobId = response.data?.jobId;
        if (!jobId) {
          throw new Error("No job ID returned from transcription");
        }

        setState((prev) => ({
          ...prev,
          currentJobId: jobId,
        }));

        // Poll for transcription completion
        const result = await apiService.pollJobStatus(
          jobId,
          apiService.getTranscriptionStatus,
          (status) => {
            setState((prev) => ({
              ...prev,
              processingProgress: status.progress || 0,
            }));
          }
        );

        console.log("✅ Transcription completed:", result);

        // Update state to indicate processing is complete
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          processingProgress: 100,
        }));

        return result;
      } catch (error) {
        console.error("❌ Transcription failed:", error);
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          processingProgress: 0,
          error:
            error instanceof Error ? error.message : "Transcription failed",
        }));
        throw error;
      }
    },
    []
  );

  const generateCaptions = useCallback(
    async (
      videoId: string,
      transcript: string,
      style: CaptionStyle,
      options: {
        maxSegmentDuration: number;
        minSegmentDuration: number;
        wordPerMinute: number;
      }
    ) => {
      setState((prev) => ({
        ...prev,
        isProcessing: true,
        processingProgress: 0,
        error: null,
      }));

      try {
        console.log("🎯 Generating captions...", {
          videoId,
          transcript: transcript.substring(0, 50) + "...",
        });

        const request: CaptionGenerationRequest = {
          videoId,
          transcript,
          style,
          options,
        };

        const response = await apiService.generateCaptions(request);

        if (!response.success) {
          throw new Error(response.error || "Caption generation failed");
        }

        const jobId = response.data?.jobId;
        if (!jobId) {
          throw new Error("No job ID returned from caption generation");
        }

        setState((prev) => ({
          ...prev,
          currentJobId: jobId,
        }));

        // Poll for caption generation completion
        const result = await apiService.pollJobStatus(
          jobId,
          apiService.getCaptionStatus,
          (status) => {
            setState((prev) => ({
              ...prev,
              processingProgress: status.progress || 0,
            }));
          }
        );

        const captions = result.captions || [];
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          processingProgress: 100,
          captions,
        }));

        console.log("✅ Captions generated successfully:", captions);
        return captions;
      } catch (error) {
        console.error("❌ Caption generation failed:", error);
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          processingProgress: 0,
          error:
            error instanceof Error
              ? error.message
              : "Caption generation failed",
        }));
        throw error;
      }
    },
    []
  );

  const exportVideo = useCallback(
    async (params: {
      videoId: string;
      captions: CaptionSegment[];
      style: CaptionStyle;
      output?: {
        format?: "mp4" | "mov" | "webm";
        codec?: "h264" | "h265" | "vp9" | "av1";
        quality?: "low" | "medium" | "high";
        resolution?: string;
        fps?: number;
      };
    }) => {
      setState((prev) => ({
        ...prev,
        isProcessing: true,
        processingProgress: 0,
        error: null,
      }));

      try {
        const response = await apiService.exportVideoWithCaptions({
          videoId: params.videoId,
          captions: params.captions,
          style: params.style,
          output: params.output,
        });

        if (!response.success) {
          throw new Error(response.error || "Export request failed");
        }

        const jobId = response.data?.jobId;
        if (!jobId) {
          throw new Error("No job ID returned from export request");
        }

        setState((prev) => ({ ...prev, currentJobId: jobId }));

        const result = await apiService.pollJobStatus(
          jobId,
          apiService.getExportStatus,
          (status) => {
            setState((prev) => ({
              ...prev,
              processingProgress: status.progress || 0,
            }));
          },
          900, // 30 minutes timeout (900 * 2 seconds = 1800 seconds = 30 minutes)
          2000 // 2 second intervals
        );

        setState((prev) => ({
          ...prev,
          isProcessing: false,
          processingProgress: 100,
        }));

        return { jobId, result };
      } catch (error) {
        console.error("❌ Export failed:", error);
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          processingProgress: 0,
          error: error instanceof Error ? error.message : "Export failed",
        }));
        throw error;
      }
    },
    []
  );

  const downloadExportedVideo = useCallback(async (jobId: string) => {
    try {
      // Prefer redirect if backend exposes a public URL; fall back to blob download
      const status = await apiService.getExportStatus(jobId);
      if (status.success && status.data) {
        const publicUrl =
          (status.data as any).publicUrl || (status.data as any).url;
        if (publicUrl) {
          const isAbsolute = /^(https?:)?\/\//i.test(publicUrl);
          const base = apiService.getBaseUrl().replace(/\/$/, "");
          const relative = publicUrl.startsWith("/")
            ? publicUrl
            : `/${publicUrl}`;
          window.location.href = isAbsolute ? publicUrl : `${base}${relative}`;
          return;
        }
      }

      const blob = await apiService.downloadExport(jobId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "video_with_captions.mp4";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Export download failed:", error);
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Export download failed",
      }));
      throw error;
    }
  }, []);

  const downloadCaptionsAsSRT = useCallback(async (jobId: string) => {
    try {
      console.log("📄 Downloading captions as SRT...", jobId);

      const blob = await apiService.downloadCaptionsAsSRT(jobId);

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "captions.srt";
      a.click();
      URL.revokeObjectURL(url);

      console.log("✅ SRT file downloaded successfully");
    } catch (error) {
      console.error("❌ SRT download failed:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "SRT download failed",
      }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isUploading: false,
      isProcessing: false,
      uploadProgress: 0,
      processingProgress: 0,
      currentJobId: null,
      error: null,
      videoId: null,
      captions: [],
    });
  }, []);

  return {
    ...state,
    uploadVideo,
    transcribeVideo,
    generateCaptions,
    exportVideo,
    downloadExportedVideo,
    downloadCaptionsAsSRT,
    setError,
    clearError,
    reset,
  };
};
