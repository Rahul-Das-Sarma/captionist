// API Service for connecting frontend with backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  fileId: string;
  filename: string;
  size: number;
  url: string;
}

export interface VideoMetadata {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  duration: number;
  width: number;
  height: number;
  fps: number;
  bitrate: number;
  format: string;
  uploadedAt: string;
  processedAt?: string;
}

export interface CaptionSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface CaptionStyle {
  type: "reel" | "classic" | "bounce" | "slide";
  position: "bottom" | "center" | "top";
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  padding: number;
  borderRadius: number;
}

export interface CaptionGenerationRequest {
  videoId: string;
  transcript: string;
  style: CaptionStyle;
  options: {
    maxSegmentDuration: number;
    minSegmentDuration: number;
    wordPerMinute: number;
  };
}

export interface CaptionGenerationResponse {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  captions?: CaptionSegment[];
  error?: string;
}

export interface ProcessingStatus {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  estimatedTimeRemaining?: number;
  error?: string;
}

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.makeRequest("/health");
  }

  // Video upload
  async uploadVideo(file: File): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch(`${this.baseUrl}/video/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Video upload failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  // Get video metadata
  async getVideoMetadata(videoId: string): Promise<ApiResponse<VideoMetadata>> {
    return this.makeRequest(`/video/${videoId}/metadata`);
  }

  // Stream video
  getVideoStreamUrl(videoId: string): string {
    return `${this.baseUrl}/video/${videoId}/stream`;
  }

  // Generate captions
  async generateCaptions(
    request: CaptionGenerationRequest
  ): Promise<ApiResponse<CaptionGenerationResponse>> {
    return this.makeRequest("/captions/generate", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // Get caption generation status
  getCaptionStatus = async (
    jobId: string
  ): Promise<ApiResponse<CaptionGenerationResponse>> => {
    return this.makeRequest(`/captions/status/${jobId}`);
  };

  // Get generated captions
  async getCaptions(jobId: string): Promise<ApiResponse<CaptionSegment[]>> {
    return this.makeRequest(`/captions/${jobId}/captions`);
  }

  // Download captions as SRT
  async downloadCaptionsAsSRT(jobId: string): Promise<Blob> {
    const response = await fetch(
      `${this.baseUrl}/captions/${jobId}/download/srt`
    );
    if (!response.ok) {
      throw new Error(`Failed to download SRT: ${response.status}`);
    }
    return response.blob();
  }

  // Transcribe video
  async transcribeVideo(
    file: File,
    language: string = "en-US"
  ): Promise<ApiResponse<{ jobId: string; status: string }>> {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("language", language);

    try {
      const response = await fetch(`${this.baseUrl}/transcription/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Transcription failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Transcription failed",
      };
    }
  }

  // Get transcription status
  getTranscriptionStatus = async (
    jobId: string
  ): Promise<ApiResponse<ProcessingStatus>> => {
    return this.makeRequest(`/transcription/status/${jobId}`);
  };

  // Poll for job completion
  async pollJobStatus<T>(
    jobId: string,
    getStatusFn: (jobId: string) => Promise<ApiResponse<T>>,
    onProgress?: (status: T) => void,
    maxAttempts: number = 60,
    intervalMs: number = 2000
  ): Promise<T> {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const response = await getStatusFn(jobId);

          if (!response.success) {
            reject(new Error(response.error || "Failed to get job status"));
            return;
          }

          const status = response.data as T;
          onProgress?.(status);

          if ((status as { status: string }).status === "completed") {
            resolve(status);
            return;
          }

          if ((status as { status: string }).status === "failed") {
            reject(
              new Error((status as { error?: string }).error || "Job failed")
            );
            return;
          }

          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error("Job polling timeout"));
            return;
          }

          setTimeout(poll, intervalMs);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }
}

// Create singleton instance
export const apiService = new ApiService();
