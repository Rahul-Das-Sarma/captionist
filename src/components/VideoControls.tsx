import React from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "./ui/button";

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;
  currentTime: number;
  duration: number;
  onTogglePlayPause: () => void;
  onToggleMute: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleFullscreen: () => void;
  formatTime: (time: number) => string;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  isMuted,
  volume,
  isFullscreen,
  currentTime,
  duration,
  onTogglePlayPause,
  onToggleMute,
  onVolumeChange,
  onToggleFullscreen,
  formatTime,
}) => {
  return (
    <div
      className="p-5 rounded-b-xl"
      style={{
        background: "linear-gradient(transparent, rgba(0, 0, 0, 0.8))",
      }}
    >
      {/* Control Buttons */}
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <Button
            onClick={onTogglePlayPause}
            variant="default"
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={onToggleMute}
              variant="default"
              size="icon"
              className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg"
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={20} />
              ) : (
                <Volume2 size={20} />
              )}
            </Button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              className="w-20 h-1 bg-white/30 rounded-full outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="text-sm font-medium text-white">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <Button
          onClick={onToggleFullscreen}
          variant="default"
          size="icon"
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;
