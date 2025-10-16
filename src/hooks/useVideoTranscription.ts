import { useState, useCallback, useRef } from "react";
import useSpeechRecognition from "./useSpeechRecognition";
import { TranscriptionService } from "../utils/transcriptionService";

interface UseVideoTranscriptionOptions {
  onTranscriptionComplete?: (transcript: string) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
  onLanguageDetected?: (language: string, confidence: number) => void;
}

interface UseVideoTranscriptionReturn {
  isTranscribing: boolean;
  isExtracting: boolean;
  isDetectingLanguage: boolean;
  progress: number;
  transcript: string;
  detectedLanguage: string | null;
  languageConfidence: number;
  error: string | null;
  transcribeVideo: (videoFile: File | string) => Promise<void>;
  stopTranscription: () => void;
  resetTranscription: () => void;
}

const useVideoTranscription = (
  options: UseVideoTranscriptionOptions = {}
): UseVideoTranscriptionReturn => {
  const { onTranscriptionComplete, onError, onProgress, onLanguageDetected } =
    options;

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDetectingLanguage, setIsDetectingLanguage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [languageConfidence, setLanguageConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isProcessingRef = useRef(false);

  // Initialize speech recognition for video transcription
  const speechRecognition = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    language: detectedLanguage || "en-US",
    onResult: (result) => {
      setTranscript((prev) => prev + result.text + " ");
      if (onTranscriptionComplete) {
        onTranscriptionComplete(result.text);
      }
    },
    onError: (error) => {
      console.error("Speech recognition error:", error);

      // Handle specific error types
      if (error.includes("no-speech")) {
        console.log("🔄 No speech detected, trying alternative approach...");

        // Try a different approach - use microphone input instead
        setTimeout(() => {
          try {
            // Reset and try again with different settings
            speechRecognition.resetTranscript();
            speechRecognition.startListening();
            console.log("🎤 Retrying with alternative approach...");
          } catch (retryError) {
            console.error("Retry failed:", retryError);
            setError(
              "No speech detected in the audio. Please ensure the video contains clear speech and try using the manual recording feature instead."
            );
            setIsTranscribing(false);
            isProcessingRef.current = false;

            if (onError) {
              onError(error);
            }
          }
        }, 2000); // Wait 2 seconds before retry
      } else if (error.includes("audio-capture")) {
        setError(
          "Audio capture failed. Please check your microphone permissions."
        );
        setIsTranscribing(false);
        isProcessingRef.current = false;
      } else if (error.includes("not-allowed")) {
        setError(
          "Speech recognition not allowed. Please check your browser permissions."
        );
        setIsTranscribing(false);
        isProcessingRef.current = false;
      } else {
        setError(`Speech recognition error: ${error}`);
        setIsTranscribing(false);
        isProcessingRef.current = false;
      }

      if (onError && !error.includes("no-speech")) {
        onError(error);
      }
    },
    onStart: () => {
      console.log("🎤 Video transcription started");
    },
    onEnd: () => {
      console.log("🎤 Video transcription completed");
      setIsTranscribing(false);
    },
  });

  const transcribeVideo = useCallback(
    async (videoFile: File | string) => {
      if (isProcessingRef.current) {
        console.log("Transcription already in progress");
        return;
      }

      isProcessingRef.current = true;
      setError(null);
      setTranscript("");
      setProgress(0);

      try {
        console.log("🎬 Starting automatic video transcription...");

        setIsExtracting(false);
        setIsDetectingLanguage(false);
        setProgress(10);

        // Set default language to English for now
        const detectedLang = "en-US";
        setDetectedLanguage(detectedLang);
        setLanguageConfidence(0.8);

        if (onLanguageDetected) {
          onLanguageDetected(detectedLang, 0.8);
        }

        console.log(`🌍 Using English (US) for transcription`);
        setProgress(20);
        setIsTranscribing(true);

        // Use the new transcription service
        const file = typeof videoFile === "string" ? null : videoFile;
        if (!file) {
          throw new Error("File is required for transcription");
        }

        const transcript = await TranscriptionService.mockTranscription({
          videoFile: file,
          language: "en-US",
          onProgress: (progress) => {
            setProgress(20 + progress * 0.8); // 20-100% range
            if (onProgress) {
              onProgress(20 + progress * 0.8);
            }
          },
          onResult: (result) => {
            setTranscript(result);
            if (onTranscriptionComplete) {
              onTranscriptionComplete(result);
            }
          },
          onError: (error) => {
            setError(error);
            if (onError) {
              onError(error);
            }
          },
        });

        console.log("✅ Transcription completed:", transcript);
        setTranscript(transcript);
        setProgress(100);
        setIsTranscribing(false);
        isProcessingRef.current = false;

        if (onTranscriptionComplete) {
          onTranscriptionComplete(transcript);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setError(`Transcription failed: ${errorMessage}`);
        setIsTranscribing(false);
        setIsExtracting(false);
        isProcessingRef.current = false;

        if (onError) {
          onError(errorMessage);
        }
      }
    },
    [onTranscriptionComplete, onError, onProgress, onLanguageDetected]
  );

  const stopTranscription = useCallback(() => {
    if (speechRecognition.isListening) {
      speechRecognition.stopListening();
    }
    setIsTranscribing(false);
    setIsExtracting(false);
    isProcessingRef.current = false;

    // Clean up any video elements that might be displayed
    const videoElements = document.querySelectorAll(
      'video[style*="position: fixed"]'
    );
    videoElements.forEach((video) => {
      if (document.body.contains(video)) {
        document.body.removeChild(video);
      }
    });
  }, [speechRecognition]);

  const resetTranscription = useCallback(() => {
    setTranscript("");
    setProgress(0);
    setError(null);
    setIsTranscribing(false);
    setIsExtracting(false);
    isProcessingRef.current = false;
  }, []);

  return {
    isTranscribing,
    isExtracting,
    isDetectingLanguage,
    progress,
    transcript,
    detectedLanguage,
    languageConfidence,
    error,
    transcribeVideo,
    stopTranscription,
    resetTranscription,
  };
};

export default useVideoTranscription;
