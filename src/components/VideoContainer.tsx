import React, { forwardRef } from "react";
import AnimatedCaption from "./AnimatedCaption";

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
  onTimeUpdate: () => void;
  onLoadedMetadata: () => void;
  onPlay: () => void;
  onPause: () => void;
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
      onTimeUpdate,
      onLoadedMetadata,
      onPlay,
      onPause,
    },
    ref
  ) => {
    return (
      <div
        className={`relative overflow-hidden ${
          isFullscreen
            ? "rounded-none shadow-none h-[70vh]"
            : "rounded-xl shadow-dark-primary bg-black/20 p-4 aspect-[9/16] max-h-[600px]"
        }`}
      >
        <video
          ref={ref}
          src={videoUrl}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onPlay={onPlay}
          onPause={onPause}
          autoPlay={autoPlay}
          className={`w-full h-full block rounded-lg object-cover ${
            isFullscreen ? "object-contain" : ""
          }`}
        />

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
