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
  // Debug logging
  console.log("🎬 ProgressBar props:", {
    currentTime,
    duration,
    progress: duration > 0 ? (currentTime / duration) * 100 : 0,
  });

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🎬 ProgressBar seek triggered:", e.target.value);
    onSeek(e);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;

      console.log("🎬 ProgressBar clicked:", {
        clickX,
        percentage,
        newTime,
        duration,
      });

      // Create a synthetic event for the seek function
      const syntheticEvent = {
        target: { value: newTime.toString() },
      } as React.ChangeEvent<HTMLInputElement>;

      onSeek(syntheticEvent);
    }
  };

  return (
    <div className="mb-4 py-2">
      <div
        className="relative cursor-pointer hover:opacity-80 transition-opacity z-[60]"
        onClick={handleProgressBarClick}
        onMouseMove={(e) => {
          // Add visual feedback on hover
          e.currentTarget.style.opacity = "0.8";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
        style={{ cursor: "pointer" }}
      >
        {/* Progress bar background */}
        <div className="w-full h-2 bg-white/30 rounded-full hover:bg-white/50 transition-colors"></div>

        {/* Progress bar fill */}
        <div
          className="h-2 bg-blue-500 rounded-full absolute top-0 left-0 transition-all duration-100"
          style={{ width: `${progressPercentage}%` }}
        ></div>

        {/* Range input for dragging - positioned above the visible bar */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeekChange}
          className="w-full h-4 absolute top-[-4px] left-0 opacity-0 cursor-pointer z-[60]"
          style={{
            background: "transparent",
            outline: "none",
            WebkitAppearance: "none",
            appearance: "none",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
