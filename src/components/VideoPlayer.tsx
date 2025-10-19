import React from "react";
import VideoContainer from "./VideoContainer";
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
    isMuted,
    currentCaption,
    showCaption,
    isFullscreen,
    handleTimeUpdate,
    handleLoadedMetadata,
    togglePlayPause,
    handleSeek,
    toggleMute,
    toggleFullscreen,
    handlePlay,
    handlePause,
    handleEnded,
  } = useVideoPlayer({ captions, onTimeUpdate });

  return (
    <div
      className={`relative w-full mx-auto transition-all duration-300 ${
        isFullscreen ? "max-w-full" : "max-w-[400px] min-w-[300px]"
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
        onEnded={handleEnded}
        onTogglePlayPause={togglePlayPause}
      />

      {/* Mute Button - Top Right Corner */}
      {showControls && !isFullscreen && (
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-[60] bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>
      )}

      {/* Fullscreen Button - Top Left Corner */}
      {showControls && !isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 left-4 z-[60] bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          )}
        </button>
      )}

      {/* Progress Bar - Bottom */}
      {showControls && !isFullscreen && (
        <div
          className={`absolute bottom-0 left-0 right-0 z-50 ${
            isFullscreen ? "max-w-full" : "w-full"
          }`}
        >
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
