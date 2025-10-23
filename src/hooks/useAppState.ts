import { useState, useRef, useCallback } from "react";
import useCaptionGenerator from "./useCaptionGenerator";
import { useBackendIntegration } from "./useBackendIntegration";
import { FileUploader, SRTParser } from "../utils/srtParser";

// Import the new caption styling types
import type { CaptionStyle } from "../components/CaptionStyling/types";

export const useAppState = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [captionStyle, setCaptionStyle] = useState<
    "reel" | "classic" | "bounce" | "slide"
  >("reel");
  const [captionPosition, setCaptionPosition] = useState<
    "bottom" | "center" | "top"
  >("bottom");

  // New comprehensive caption styling state
  const [captionStyling, setCaptionStyling] = useState<CaptionStyle>({
    typography: {
      fontFamily: "Arial",
      fontSize: 24,
      fontWeight: "normal",
      fontColor: "#ffffff",
      textAlign: "center",
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    position: {
      type: "bottom",
      customX: 0.5,
      customY: 0.9,
      margin: 20,
    },
    background: {
      enabled: true,
      color: "#000000",
      opacity: 0.8,
      padding: {
        top: 12,
        right: 16,
        bottom: 12,
        left: 16,
      },
      borderRadius: 25,
      backdropBlur: 10,
    },
    border: {
      enabled: true,
      color: "rgba(255, 255, 255, 0.1)",
      width: 1,
      style: "solid",
      radius: 25,
    },
    shadow: {
      enabled: true,
      color: "#000000",
      blur: 8,
      offsetX: 0,
      offsetY: 8,
      textShadow: {
        enabled: true,
        color: "#000000",
        blur: 4,
        offsetX: 0,
        offsetY: 2,
      },
    },
    animation: {
      type: "fade",
      duration: 500,
      delay: 0,
      easing: "ease-out",
      scale: 1,
      rotation: 0,
    },
    effects: {
      opacity: 0.95,
      scale: 1,
      rotation: 0,
    },
  });

  const [showSettings, setShowSettings] = useState(false);
  const [srtFile, setSrtFile] = useState<File | null>(null);
  const [isUploadingSrt, setIsUploadingSrt] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [useBackend, setUseBackend] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportJobId, setExportJobId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const srtInputRef = useRef<HTMLInputElement>(null);

  const captionGenerator = useCaptionGenerator({
    maxSegmentDuration: 5,
    minSegmentDuration: 1,
    wordPerMinute: 150,
  });

  const backendIntegration = useBackendIntegration();

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("video/")) {
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        console.log("🎬 Video uploaded successfully");

        // If using backend, upload to server
        if (useBackend) {
          try {
            console.log("🚀 Uploading video to backend...");
            await backendIntegration.uploadVideo(file);
            console.log("✅ Video uploaded to backend successfully");
          } catch (error) {
            console.error("❌ Backend upload failed:", error);
            // Continue with local processing as fallback
          }
        }
      }
    },
    [useBackend, backendIntegration]
  );

  const handleSRTUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      console.log("📄 SRT file selected:", file.name);

      if (!FileUploader.validateSRTFile(file)) {
        console.error("❌ Invalid SRT file");
        alert("Please select a valid SRT file (.srt extension, under 10MB)");
        return;
      }

      setIsUploadingSrt(true);
      setSrtFile(file);

      try {
        console.log("📄 Uploading and parsing SRT file...");
        const subtitles = await FileUploader.uploadSRTFile(file);

        console.log("✅ SRT file parsed successfully:", subtitles);

        const captionSegments = SRTParser.convertToCaptionSegments(subtitles);
        console.log("🎯 Converted to caption segments:", captionSegments);

        captionGenerator.setCaptionsFromSRT(captionSegments);
        console.log("✅ SRT captions loaded successfully!");
      } catch (error) {
        console.error("❌ Failed to upload SRT file:", error);
        alert("Failed to upload SRT file. Please try again.");
        setSrtFile(null);
      } finally {
        setIsUploadingSrt(false);
      }
    },
    [captionGenerator]
  );

  const handleSetMockTranscript = useCallback(() => {
    const mockTranscript =
      "This is a sample transcript for testing caption generation. You can replace this with your own text or upload an SRT file for more accurate captions.";
    setTranscript(mockTranscript);
  }, []);

  const generateLocalCaptions = useCallback(() => {
    if (!videoFile || !transcript.trim()) return;

    const video = document.createElement("video");
    video.src = videoUrl;
    video.onloadedmetadata = () => {
      const duration = video.duration;
      console.log("📹 Video duration:", duration);
      const captions = captionGenerator.generateCaptions(transcript, duration);
      console.log("🎯 Local captions generated:", captions);
      console.log("🎯 Current captions state:", captionGenerator.captions);
    };

    setTimeout(() => {
      if (!video.duration) {
        console.log("⚠️ Video metadata not loaded, using default duration");
        const captions = captionGenerator.generateCaptions(transcript, 30);
        console.log(
          "🎯 Local captions generated with default duration:",
          captions
        );
      }
    }, 2000);
  }, [videoFile, videoUrl, transcript, captionGenerator]);

  const handleGenerateCaptions = useCallback(async () => {
    console.log("🎬 Generate captions clicked", {
      hasVideoFile: !!videoFile,
      transcript: transcript.trim(),
      transcriptLength: transcript.trim().length,
      useBackend,
    });

    if (videoFile && transcript.trim()) {
      if (useBackend && backendIntegration.videoId) {
        try {
          console.log("🚀 Generating captions using backend...");
          const style = {
            type: captionStyle,
            position: captionPosition,
            fontSize: 24,
            fontFamily: "Arial",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: 10,
            borderRadius: 5,
          };

          const options = {
            maxSegmentDuration: 5,
            minSegmentDuration: 1,
            wordPerMinute: 150,
          };

          const captions = await backendIntegration.generateCaptions(
            backendIntegration.videoId,
            transcript,
            style,
            options
          );

          console.log("✅ Backend captions generated:", captions);
        } catch (error) {
          console.error("❌ Backend caption generation failed:", error);
          // Fallback to local generation
          console.log("🔄 Falling back to local caption generation...");
          generateLocalCaptions();
        }
      } else {
        // Use local caption generation
        generateLocalCaptions();
      }
    } else {
      console.log(
        "❌ Cannot generate captions - missing video file or transcript"
      );
    }
  }, [
    videoFile,
    transcript,
    useBackend,
    backendIntegration,
    captionStyle,
    captionPosition,
    generateLocalCaptions,
  ]);

  const downloadLocalCaptions = useCallback(() => {
    if (captionGenerator.captions.length > 0) {
      const srtContent = captionGenerator.captions
        .map((caption, index) => {
          const startTime = formatSRTTime(caption.startTime);
          const endTime = formatSRTTime(caption.endTime);
          return `${index + 1}\n${startTime} --> ${endTime}\n${caption.text}\n`;
        })
        .join("\n");

      const blob = new Blob([srtContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "captions.srt";
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [captionGenerator.captions]);

  const handleDownloadCaptions = useCallback(async () => {
    if (useBackend && backendIntegration.currentJobId) {
      try {
        console.log("📄 Downloading captions from backend...");
        await backendIntegration.downloadCaptionsAsSRT(
          backendIntegration.currentJobId
        );
        console.log("✅ Backend SRT downloaded successfully");
      } catch (error) {
        console.error("❌ Backend SRT download failed:", error);
        // Fallback to local download
        downloadLocalCaptions();
      }
    } else {
      // Use local caption download
      downloadLocalCaptions();
    }
  }, [useBackend, backendIntegration, downloadLocalCaptions]);

  const handleDownloadExport = useCallback(
    async (jobId: string) => {
      try {
        await backendIntegration.downloadExportedVideo(jobId);
        setExportJobId(null); // Clear job ID after download
      } catch (error) {
        console.error("❌ Download failed:", error);
        alert("Download failed. Please try again.");
      }
    },
    [backendIntegration]
  );

  const handleExportComplete = useCallback((outputPath?: string) => {
    console.log("✅ Export completed:", outputPath);
    // Export is complete, user can download via the progress component
  }, []);

  const handleExportError = useCallback((error: string) => {
    console.error("❌ Export error:", error);
    setExportJobId(null); // Clear job ID on error
    alert(`Export failed: ${error}`);
  }, []);

  const handleCloseExportModal = useCallback(() => {
    console.log("🔄 Closing export modal");
    setExportJobId(null);
    setShowExportModal(false);
  }, []);

  const handleExportVideo = useCallback(async () => {
    if (!videoFile) return;

    // Show modal immediately when export starts
    setShowExportModal(true);
    setIsExporting(true);

    // Prefer backend export when enabled and we have a videoId
    if (useBackend && backendIntegration.videoId) {
      try {
        // Match the React app's AnimatedCaption styling exactly
        const style = {
          type: captionStyle,
          position: captionPosition,
          fontSize: 19, // 1.2rem = 19.2px, rounded to 19
          fontFamily: "Arial",
          color: "#ffffff",
          backgroundColor: "rgba(0, 0, 0, 0.8)", // Match React app's semi-transparent background
          padding: 12, // Match React app's vertical padding
          borderRadius: 25, // Match React app's border radius
          // Animation properties
          animationDuration: 500, // Match React app's 0.5s duration
          animationDelay: 0,
          animationEasing: "ease-out",
          // Visual effects to match React app
          shadowColor: "#000000",
          shadowBlur: 8, // Match boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
          shadowOffsetX: 0,
          shadowOffsetY: 8,
          // Additional styling
          opacity: 0.95, // Match semi-transparent background
          rotation: 0,
          // Text shadow to match React app
          textShadowColor: "#000000",
          textShadowBlur: 4, // Match textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)"
          textShadowOffsetX: 0,
          textShadowOffsetY: 2,
          // Border to match React app
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          // Backdrop filter effect
          backdropBlur: 10, // Match backdropFilter: "blur(10px)"
          fontWeight: 600, // Match React app's fontWeight: "600"
        } as const;

        const { jobId } = await backendIntegration.exportVideo({
          videoId: backendIntegration.videoId,
          captions: captionGenerator.captions,
          style,
          output: {
            format: "mp4",
            codec: "h264",
            quality: "high",
          },
        });

        // Set the job ID for progress tracking
        console.log("🎬 Export started, setting jobId:", jobId);
        setExportJobId(jobId);

        // Don't wait for completion - let the progress component handle it
        // The progress component will handle the download when ready
      } catch (error) {
        console.error("❌ Backend export failed:", error);
        const details =
          (error instanceof Error && error.message) ||
          backendIntegration.error ||
          "Unknown error";
        const isTimeoutError =
          details.includes("timeout") || details.includes("polling");
        const errorMessage = isTimeoutError
          ? `Export is taking longer than 30 minutes. This is unusual.\n\nTry:\n- Check your backend logs for processing status\n- Try with a smaller video file\n- Contact support if the issue persists`
          : `Export failed: ${details}.\n\nQuick checks:\n- Is the backend running at VITE_API_URL?\n- Does it expose /api/export/burn-in, /api/export/status/:jobId, /api/export/:jobId/download?`;

        alert(errorMessage);
        setShowExportModal(false); // Hide modal on error
      } finally {
        setIsExporting(false);
      }
    } else {
      // No backend path implemented for local burn-in
      alert(
        "Export requires backend. Enable 'Use Backend' and upload the video."
      );
      setShowExportModal(false); // Hide modal on error
    }
  }, [
    videoFile,
    useBackend,
    backendIntegration,
    captionStyle,
    captionPosition,
    captionGenerator.captions,
  ]);

  const formatSRTTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")},${milliseconds
      .toString()
      .padStart(3, "0")}`;
  };

  const handleToggleSettings = useCallback(() => {
    setShowSettings(!showSettings);
  }, [showSettings]);

  const handleCaptionStyleChange = useCallback(
    (style: "reel" | "classic" | "bounce" | "slide") => {
      setCaptionStyle(style);
    },
    []
  );

  const handleCaptionPositionChange = useCallback(
    (position: "bottom" | "center" | "top") => {
      setCaptionPosition(position);
    },
    []
  );

  // New comprehensive caption styling handlers
  const handleCaptionStylingChange = useCallback((newStyling: CaptionStyle) => {
    setCaptionStyling(newStyling);
    console.log("🎨 Caption styling updated:", newStyling);
  }, []);

  const handlePresetSelect = useCallback((presetName: string) => {
    console.log("🎨 Preset selected:", presetName);
    // This will be handled by the CaptionStylingContainer component
  }, []);

  const handleTranscriptChange = useCallback((value: string) => {
    setTranscript(value);
  }, []);

  const handleToggleBackend = useCallback(() => {
    setUseBackend(!useBackend);
    console.log("🔄 Backend mode toggled:", !useBackend);
  }, [useBackend]);

  const handleTranscribeVideo = useCallback(async () => {
    if (!videoFile) {
      console.log("❌ No video file to transcribe");
      return;
    }

    if (useBackend) {
      try {
        console.log("🎤 Starting video transcription with backend...");
        const result = await backendIntegration.transcribeVideo(videoFile);
        console.log("✅ Backend transcription completed:", result);

        // Extract the transcription result from the response
        const transcriptText =
          (result as { result?: string; transcript?: string }).result ||
          (result as { result?: string; transcript?: string }).transcript ||
          "";
        console.log("📝 Extracted transcript:", transcriptText);
        setTranscript(transcriptText);

        // Generate captions from the transcription result
        if (transcriptText) {
          console.log("🎯 Generating captions from transcription...");
          // Get video duration for caption timing
          const video = document.createElement("video");
          video.src = videoUrl;
          video.onloadedmetadata = () => {
            const duration = video.duration;
            console.log("📹 Video duration for captions:", duration);
            const captions = captionGenerator.generateCaptions(
              transcriptText,
              duration
            );
            console.log("✅ Captions generated from transcription:", captions);
          };

          // Fallback if video metadata doesn't load
          setTimeout(() => {
            if (!video.duration) {
              console.log("⚠️ Using default duration for captions");
              const captions = captionGenerator.generateCaptions(
                transcriptText,
                30
              );
              console.log(
                "✅ Captions generated with default duration:",
                captions
              );
            }
          }, 2000);
        }
      } catch (error) {
        console.error("❌ Backend transcription failed:", error);
        // Fallback to mock transcription
        handleSetMockTranscript();
      }
    } else {
      // Use mock transcription for local mode
      handleSetMockTranscript();
    }
  }, [
    videoFile,
    useBackend,
    backendIntegration,
    handleSetMockTranscript,
    captionGenerator,
    videoUrl,
  ]);

  return {
    // State
    videoFile,
    videoUrl,
    captionStyle,
    captionPosition,
    captionStyling, // New comprehensive styling state
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

    // Refs
    fileInputRef,
    srtInputRef,

    // Handlers
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
    handleCaptionStylingChange, // New comprehensive styling handler
    handlePresetSelect, // New preset selection handler
    handleTranscriptChange,
    handleToggleBackend,
    handleTranscribeVideo,
  };
};
