import { forwardRef } from "react";
import AnimatedCaption from "./AnimatedCaption";
import { Play, Pause } from "lucide-react";

interface CaptionData {
  text: string;
  startTime: number;
  endTime: number;
  id: string;
}

interface VideoContainerProps {
  videoUrl: string;
  isFullscreen: boolean;
  autoPlay: boolean;
  currentCaption: CaptionData | null;
  showCaption: boolean;
  captionStyle: "reel" | "classic" | "bounce" | "slide";
  captionPosition: "bottom" | "center" | "top";
  isPlaying: boolean;
  onTimeUpdate: () => void;
  onLoadedMetadata: () => void;
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  onTogglePlayPause: () => void;
}

const VideoContainer = forwardRef<HTMLVideoElement, VideoContainerProps>(
  (
    {
      videoUrl,
      isFullscreen,
      autoPlay,
      currentCaption,
      showCaption,
      captionStyle,
      captionPosition,
      isPlaying,
      onTimeUpdate,
      onLoadedMetadata,
      onPlay,
      onPause,
      onEnded,
      onTogglePlayPause,
    },
    ref
  ) => {
    return (
      <div
        className={`relative overflow-hidden ${
          isFullscreen
            ? "rounded-none shadow-none w-full h-full flex items-center justify-center bg-black"
            : "rounded-xl shadow-dark-primary bg-black/20 p-2 aspect-[9/16] max-h-[80vh] w-full max-w-[400px] mx-auto"
        }`}
      >
        <video
          ref={ref}
          src={videoUrl}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onEnded}
          autoPlay={autoPlay}
          className={`block rounded-lg ${
            isFullscreen
              ? "max-w-full max-h-full object-contain"
              : "w-full h-full object-cover"
          }`}
        />

        {/* Large Play/Pause Button Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center z-30 transition-opacity duration-300 group ${
            isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
          }`}
          onClick={onTogglePlayPause}
        >
          <button
            className="bg-black/70 hover:bg-black/80 text-white rounded-full p-6 transition-all duration-300 hover:scale-110 shadow-2xl"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <Pause size={48} className="text-white" />
            ) : (
              <Play size={48} className="text-white ml-1" />
            )}
          </button>
        </div>

        {/* Caption Overlay */}
        <AnimatedCaption
          text={currentCaption?.text || ""}
          isVisible={showCaption && !!currentCaption}
          style={captionStyle}
          position={captionPosition}
        />
      </div>
    );
  }
);

VideoContainer.displayName = "VideoContainer";

export default VideoContainer;
