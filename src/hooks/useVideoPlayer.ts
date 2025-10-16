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
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
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
    setIsFullscreen(!isFullscreen);
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
  };
};
