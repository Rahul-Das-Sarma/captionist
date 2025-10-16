import React from "react";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
}) => {
  return (
    <div className="mb-4">
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={onSeek}
        className="w-full h-1.5 bg-white/30 rounded-full outline-none cursor-pointer"
      />
    </div>
  );
};

export default ProgressBar;
