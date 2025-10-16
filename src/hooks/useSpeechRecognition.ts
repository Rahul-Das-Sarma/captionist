import { useState, useEffect, useRef, useCallback } from "react";

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  timestamp: number;
}

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  maxAlternatives?: number;
  onResult?: (result: SpeechRecognitionResult) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
  confidence: number;
  isProcessing: boolean;
}

const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
  const {
    continuous = true,
    interimResults = true,
    language = "en-US",
    maxAlternatives = 1,
    onResult,
    onError,
    onStart,
    onEnd,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef<any | null>(null);
  const finalTranscriptRef = useRef("");

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;
      recognition.maxAlternatives = maxAlternatives;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        if (onStart) {
          onStart();
        }
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = finalTranscriptRef.current;
        let totalConfidence = 0;
        let resultCount = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const resultConfidence = result[0].confidence || 0;

          if (result.isFinal) {
            finalTranscript += transcript;
            finalTranscriptRef.current = finalTranscript;
            setTranscript(finalTranscript);
            totalConfidence += resultConfidence;
            resultCount++;

            if (onResult) {
              onResult({
                text: transcript,
                confidence: resultConfidence,
                timestamp: Date.now(),
              });
            }
          } else {
            interimTranscript += transcript;
            setIsProcessing(true);
          }
        }

        // Update confidence based on final results
        if (resultCount > 0) {
          setConfidence(totalConfidence / resultCount);
        }

        setInterimTranscript(interimTranscript);

        // Reset processing state after a short delay
        if (interimTranscript === "") {
          setTimeout(() => setIsProcessing(false), 500);
        }
      };

      recognition.onerror = (event: any) => {
        const errorMessage = `Speech recognition error: ${event.error}`;
        setError(errorMessage);
        setIsListening(false);
        if (onError) {
          onError(errorMessage);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (onEnd) {
          onEnd();
        }
      };
    }
  }, [continuous, interimResults, language, onResult, onError]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && isSupported && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        const errorMessage = "Failed to start speech recognition";
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
      }
    }
  }, [isSupported, isListening, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    finalTranscriptRef.current = "";
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error,
    confidence,
    isProcessing,
  };
};

export default useSpeechRecognition;
