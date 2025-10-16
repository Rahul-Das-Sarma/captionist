import { useState, useRef, useCallback } from "react";
import useCaptionGenerator from "./useCaptionGenerator";
import { FileUploader, SRTParser } from "../utils/srtParser";

export const useAppState = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [captionStyle, setCaptionStyle] = useState<
    "reel" | "classic" | "bounce" | "slide"
  >("reel");
  const [captionPosition, setCaptionPosition] = useState<
    "bottom" | "center" | "top"
  >("bottom");
  const [showSettings, setShowSettings] = useState(false);
  const [srtFile, setSrtFile] = useState<File | null>(null);
  const [isUploadingSrt, setIsUploadingSrt] = useState(false);
  const [transcript, setTranscript] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const srtInputRef = useRef<HTMLInputElement>(null);

  const captionGenerator = useCaptionGenerator({
    maxSegmentDuration: 5,
    minSegmentDuration: 1,
    wordPerMinute: 150,
  });

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("video/")) {
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        console.log("🎬 Video uploaded successfully");
      }
    },
    []
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

  const handleGenerateCaptions = useCallback(() => {
    console.log("🎬 Generate captions clicked", {
      hasVideoFile: !!videoFile,
      transcript: transcript.trim(),
      transcriptLength: transcript.trim().length,
    });

    if (videoFile && transcript.trim()) {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.onloadedmetadata = () => {
        const duration = video.duration;
        console.log("📹 Video duration:", duration);
        const captions = captionGenerator.generateCaptions(
          transcript,
          duration
        );
        console.log("🎯 Captions generated:", captions);
        console.log("🎯 Current captions state:", captionGenerator.captions);
      };

      setTimeout(() => {
        if (!video.duration) {
          console.log("⚠️ Video metadata not loaded, using default duration");
          const captions = captionGenerator.generateCaptions(transcript, 30);
          console.log("🎯 Captions generated with default duration:", captions);
        }
      }, 2000);
    } else {
      console.log(
        "❌ Cannot generate captions - missing video file or transcript"
      );
    }
  }, [videoFile, videoUrl, transcript, captionGenerator]);

  const handleDownloadCaptions = useCallback(() => {
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

  const handleTranscriptChange = useCallback((value: string) => {
    setTranscript(value);
  }, []);

  return {
    // State
    videoFile,
    videoUrl,
    captionStyle,
    captionPosition,
    showSettings,
    srtFile,
    isUploadingSrt,
    transcript,
    captionGenerator,

    // Refs
    fileInputRef,
    srtInputRef,

    // Handlers
    handleFileUpload,
    handleSRTUpload,
    handleSetMockTranscript,
    handleGenerateCaptions,
    handleDownloadCaptions,
    handleToggleSettings,
    handleCaptionStyleChange,
    handleCaptionPositionChange,
    handleTranscriptChange,
  };
};
