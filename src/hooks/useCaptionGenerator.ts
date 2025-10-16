import { useState, useCallback, useRef, useEffect } from "react";

interface CaptionSegment {
  text: string;
  startTime: number;
  endTime: number;
  id: string;
  confidence: number;
}

interface UseCaptionGeneratorOptions {
  maxSegmentDuration?: number; // Maximum duration for a single caption segment
  minSegmentDuration?: number; // Minimum duration for a single caption segment
  wordPerMinute?: number; // Average words per minute for timing calculation
}

export interface UseCaptionGeneratorReturn {
  captions: CaptionSegment[];
  isGenerating: boolean;
  addTranscript: (text: string, timestamp: number, confidence?: number) => void;
  generateCaptions: (transcript: string, duration: number) => CaptionSegment[];
  clearCaptions: () => void;
  updateCaptionTiming: (id: string, startTime: number, endTime: number) => void;
  createTestCaptions: () => void;
  setCaptionsFromSRT: (srtCaptions: CaptionSegment[]) => void;
}

const useCaptionGenerator = (
  options: UseCaptionGeneratorOptions = {}
): UseCaptionGeneratorReturn => {
  const {
    maxSegmentDuration = 5, // 5 seconds max per segment
    minSegmentDuration = 1, // 1 second min per segment
    wordPerMinute = 150, // Average speaking rate
  } = options;

  const [captions, setCaptions] = useState<CaptionSegment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const transcriptBufferRef = useRef<
    { text: string; timestamp: number; confidence: number }[]
  >([]);

  // Debug: Monitor captions state changes
  useEffect(() => {
    console.log("🔄 Captions state changed:", captions);
  }, [captions]);

  // Calculate reading time for text
  const calculateReadingTime = (text: string): number => {
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = wordCount / wordPerMinute;
    return Math.max(minutes * 60, minSegmentDuration);
  };

  // Split text into optimal segments
  const splitTextIntoSegments = (
    text: string,
    totalDuration: number
  ): string[] => {
    console.log("📝 Splitting text:", {
      text,
      totalDuration,
      maxSegmentDuration,
    });

    const words = text.trim().split(/\s+/);
    const totalWords = words.length;
    const targetSegments = Math.ceil(totalDuration / maxSegmentDuration);
    const wordsPerSegment = Math.ceil(totalWords / targetSegments);

    console.log("📊 Segmentation params:", {
      totalWords,
      targetSegments,
      wordsPerSegment,
    });

    const segments: string[] = [];
    for (let i = 0; i < words.length; i += wordsPerSegment) {
      const segment = words.slice(i, i + wordsPerSegment).join(" ");
      if (segment.trim()) {
        segments.push(segment.trim());
      }
    }

    console.log("📝 Final segments:", segments);
    return segments;
  };

  // Generate captions from transcript
  const generateCaptions = useCallback(
    (transcript: string, duration: number): CaptionSegment[] => {
      console.log("🎬 Generating captions with:", { transcript, duration });

      if (!transcript.trim()) {
        console.log("❌ No transcript provided");
        return [];
      }

      setIsGenerating(true);

      try {
        const segments = splitTextIntoSegments(transcript, duration);
        console.log("📝 Text segments:", segments);

        const generatedCaptions: CaptionSegment[] = [];

        let currentTime = 0;

        segments.forEach((segment, index) => {
          const segmentDuration = Math.min(
            calculateReadingTime(segment),
            maxSegmentDuration
          );

          // Ensure we don't exceed video duration
          const endTime = Math.min(currentTime + segmentDuration, duration);

          if (endTime > currentTime) {
            const caption = {
              id: `caption-${Date.now()}-${index}`,
              text: segment,
              startTime: currentTime,
              endTime: endTime,
              confidence: 0.9, // Default confidence for generated captions
            };
            generatedCaptions.push(caption);
            console.log("✅ Created caption:", caption);
          }

          currentTime = endTime;
        });

        console.log("🎯 Generated captions:", generatedCaptions);

        // Update state immediately
        setCaptions(generatedCaptions);
        console.log("✅ Captions state updated");

        return generatedCaptions;
      } finally {
        setIsGenerating(false);
      }
    },
    [maxSegmentDuration, minSegmentDuration, wordPerMinute]
  );

  // Add transcript with real-time processing
  const addTranscript = useCallback(
    (text: string, timestamp: number, confidence: number = 0.8) => {
      transcriptBufferRef.current.push({ text, timestamp, confidence });

      // Process buffer if we have enough content or time has passed
      const buffer = transcriptBufferRef.current;
      const lastEntry = buffer[buffer.length - 1];
      const firstEntry = buffer[0];

      // Create caption if we have enough content or time gap
      if (
        buffer.length >= 3 ||
        lastEntry.timestamp - firstEntry.timestamp > 3000
      ) {
        const combinedText = buffer.map((entry) => entry.text).join(" ");
        const avgConfidence =
          buffer.reduce((sum, entry) => sum + entry.confidence, 0) /
          buffer.length;

        const newCaption: CaptionSegment = {
          id: `caption-${timestamp}`,
          text: combinedText,
          startTime: firstEntry.timestamp / 1000, // Convert to seconds
          endTime: lastEntry.timestamp / 1000,
          confidence: avgConfidence,
        };

        setCaptions((prev) => [...prev, newCaption]);
        transcriptBufferRef.current = [];
      }
    },
    []
  );

  // Clear all captions
  const clearCaptions = useCallback(() => {
    setCaptions([]);
    transcriptBufferRef.current = [];
  }, []);

  // Test function to manually create captions
  const createTestCaptions = useCallback(() => {
    const testCaptions: CaptionSegment[] = [
      {
        id: "test-1",
        text: "This is a test caption",
        startTime: 0,
        endTime: 3,
        confidence: 0.9,
      },
      {
        id: "test-2",
        text: "Another test caption",
        startTime: 3,
        endTime: 6,
        confidence: 0.9,
      },
    ];
    console.log("🧪 Creating test captions:", testCaptions);
    setCaptions(testCaptions);
  }, []);

  // Set captions directly from SRT data
  const setCaptionsFromSRT = useCallback((srtCaptions: CaptionSegment[]) => {
    console.log("📄 Setting captions from SRT data:", srtCaptions);
    setCaptions(srtCaptions);
  }, []);

  // Update caption timing
  const updateCaptionTiming = useCallback(
    (id: string, startTime: number, endTime: number) => {
      setCaptions((prev) =>
        prev.map((caption) =>
          caption.id === id ? { ...caption, startTime, endTime } : caption
        )
      );
    },
    []
  );

  return {
    captions,
    isGenerating,
    addTranscript,
    generateCaptions,
    clearCaptions,
    updateCaptionTiming,
    createTestCaptions,
    setCaptionsFromSRT,
  };
};

export default useCaptionGenerator;
