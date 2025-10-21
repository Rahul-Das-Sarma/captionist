import { useRef, useState, useEffect } from "react";

interface CaptionData {
  text: string;
  startTime: number;
  endTime: number;
  id: string;
}

interface UseVideoPlayerProps {
  captions: CaptionData[];
  onTimeUpdate?: (currentTime: number) => void;
}

export const useVideoPlayer = ({
  captions,
  onTimeUpdate,
}: UseVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentCaption, setCurrentCaption] = useState<CaptionData | null>(
    null
  );
  const [showCaption, setShowCaption] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Debug: Monitor captions prop changes
  useEffect(() => {
    console.log("🎬 VideoPlayer received captions:", captions);
  }, [captions]);

  // Update current caption based on video time
  useEffect(() => {
    console.log("🎬 VideoPlayer caption check:", {
      currentTime,
      captionsCount: captions.length,
      captions: captions,
    });

    if (captions.length === 0) {
      console.log("❌ No captions available");
      return;
    }

    const activeCaption = captions.find(
      (caption) =>
        currentTime >= caption.startTime && currentTime <= caption.endTime
    );

    console.log("🔍 Looking for active caption:", {
      currentTime,
      activeCaption,
      allCaptions: captions.map((c) => ({
        text: c.text,
        start: c.startTime,
        end: c.endTime,
      })),
    });

    if (activeCaption && activeCaption.id !== currentCaption?.id) {
      console.log("✅ Active caption found:", activeCaption);
      setCurrentCaption(activeCaption);
      setShowCaption(true);
    } else if (!activeCaption && currentCaption) {
      console.log("❌ No active caption, hiding current");
      setShowCaption(false);
      // Delay hiding caption for smooth transition
      setTimeout(() => {
        setCurrentCaption(null);
      }, 500);
    }
  }, [currentTime, captions, currentCaption]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const progress = duration > 0 ? (time / duration) * 100 : 0;

      // Debug when we're close to the end
      if (progress > 95) {
        console.log("🎬 Near end of video:", { time, duration, progress });
      }

      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  // Add event listeners to video element for better synchronization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdateEvent = () => {
      const time = video.currentTime;
      const duration = video.duration;
      const progress = duration > 0 ? (time / duration) * 100 : 0;

      // Debug when we're very close to the end
      if (progress > 99) {
        console.log("🎬 Video almost ended:", { time, duration, progress });
      }

      setCurrentTime(time);
      onTimeUpdate?.(time);
    };

    const handleSeekedEvent = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    };

    const handleLoadedDataEvent = () => {
      setDuration(video.duration);
    };

    // Add event listeners
    video.addEventListener("timeupdate", handleTimeUpdateEvent);
    video.addEventListener("seeked", handleSeekedEvent);
    video.addEventListener("loadeddata", handleLoadedDataEvent);

    // Cleanup
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdateEvent);
      video.removeEventListener("seeked", handleSeekedEvent);
      video.removeEventListener("loadeddata", handleLoadedDataEvent);
    };
  }, [onTimeUpdate]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    console.log("🎬 Video ended - updating state");
    console.log("🎬 Video ended - current state:", {
      isPlaying,
      currentTime,
      duration,
    });
    setIsPlaying(false);
    // Ensure currentTime is set to duration when video ends
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      console.log("🎬 Setting currentTime to duration:", duration);
      setCurrentTime(duration);
      onTimeUpdate?.(duration);
      console.log("🎬 Video ended - state updated");
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("🎬 handleSeek called with value:", e.target.value);
    if (videoRef.current) {
      const time = parseFloat(e.target.value);
      console.log(
        "🎬 Seeking to time:",
        time,
        "Video readyState:",
        videoRef.current.readyState
      );

      // Check if video is ready
      if (videoRef.current.readyState >= 2) {
        // HAVE_CURRENT_DATA or higher
        // Update video currentTime
        videoRef.current.currentTime = time;
        // Immediately update state for responsive UI
        setCurrentTime(time);
        // Call onTimeUpdate callback if provided
        onTimeUpdate?.(time);
        console.log(
          "🎬 Seek completed, new currentTime:",
          videoRef.current.currentTime
        );
      } else {
        console.log(
          "❌ Video not ready for seeking, readyState:",
          videoRef.current.readyState
        );
      }
    } else {
      console.log("❌ videoRef.current is null");
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      const container = videoRef.current.parentElement as HTMLElement | null;
      if (!document.fullscreenElement) {
        // Enter fullscreen on the container so overlays (captions/controls) remain visible
        (container ?? videoRef.current)
          .requestFullscreen()
          .then(() => {
            setIsFullscreen(true);
          })
          .catch((err) => {
            console.error("Error attempting to enable fullscreen:", err);
          });
      } else {
        // Exit fullscreen
        document
          .exitFullscreen()
          .then(() => {
            setIsFullscreen(false);
          })
          .catch((err) => {
            console.error("Error attempting to exit fullscreen:", err);
          });
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    currentCaption,
    showCaption,
    isFullscreen,
    handleTimeUpdate,
    handleLoadedMetadata,
    togglePlayPause,
    handleSeek,
    toggleMute,
    handleVolumeChange,
    toggleFullscreen,
    formatTime,
    handlePlay,
    handlePause,
    handleEnded,
  };
};
