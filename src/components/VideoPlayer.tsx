import React from "react";
import VideoContainer from "./VideoContainer";
import VideoControls from "./VideoControls";
import ProgressBar from "./ProgressBar";
import { useVideoPlayer } from "../hooks/useVideoPlayer";

interface CaptionData {
  text: string;
  startTime: number;
  endTime: number;
  id: string;
}

interface VideoPlayerProps {
  videoUrl: string;
  captions: CaptionData[];
  onTimeUpdate?: (currentTime: number) => void;
  autoPlay?: boolean;
  showControls?: boolean;
  captionStyle?: "reel" | "classic" | "bounce" | "slide";
  captionPosition?: "bottom" | "center" | "top";
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  captions,
  onTimeUpdate,
  autoPlay = false,
  showControls = true,
  captionStyle = "reel",
  captionPosition = "bottom",
}) => {
  const {
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
  } = useVideoPlayer({ captions, onTimeUpdate });

  return (
    <div
      className={`relative w-full mx-auto transition-all duration-300 ${
        isFullscreen ? "max-w-full" : "max-w-[400px]"
      }`}
    >
      <VideoContainer
        ref={videoRef}
        videoUrl={videoUrl}
        isFullscreen={isFullscreen}
        autoPlay={autoPlay}
        currentCaption={currentCaption}
        showCaption={showCaption}
        captionStyle={captionStyle}
        captionPosition={captionPosition}
        isPlaying={isPlaying}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onTogglePlayPause={togglePlayPause}
      />

      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />

          <VideoControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            isFullscreen={isFullscreen}
            currentTime={currentTime}
            duration={duration}
            onTogglePlayPause={togglePlayPause}
            onToggleMute={toggleMute}
            onVolumeChange={handleVolumeChange}
            onToggleFullscreen={toggleFullscreen}
            formatTime={formatTime}
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
