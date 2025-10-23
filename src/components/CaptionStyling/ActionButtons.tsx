import React from "react";

export interface ActionButtonsProps {
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onSaveCustom: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isCustomMode: boolean;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onUndo,
  onRedo,
  onReset,
  onSaveCustom,
  canUndo,
  canRedo,
  isCustomMode,
  className = "",
}) => {
  return (
    <div
      className={`action-buttons flex flex-wrap items-center justify-between gap-4 mt-6 p-4 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle ${className}`}
    >
      {/* Left side - History controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            canUndo
              ? "bg-dark-bg-primary text-dark-text-primary hover:bg-dark-bg-secondary border border-dark-border-subtle"
              : "bg-dark-bg-secondary text-dark-text-muted cursor-not-allowed border border-dark-border-subtle"
          }`}
          title="Undo last change (Ctrl+Z)"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          <span>Undo</span>
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            canRedo
              ? "bg-dark-bg-primary text-dark-text-primary hover:bg-dark-bg-secondary border border-dark-border-subtle"
              : "bg-dark-bg-secondary text-dark-text-muted cursor-not-allowed border border-dark-border-subtle"
          }`}
          title="Redo last change (Ctrl+Y)"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
            />
          </svg>
          <span>Redo</span>
        </button>
      </div>

      {/* Center - Status indicator */}
      <div className="flex items-center space-x-2">
        {isCustomMode ? (
          <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-yellow-400 font-medium">
              Custom Style
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-green-400 font-medium">
              Preset Style
            </span>
          </div>
        )}
      </div>

      {/* Right side - Action controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors duration-200 border border-gray-500"
          title="Reset to default style"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Reset</span>
        </button>

        {isCustomMode && (
          <button
            onClick={onSaveCustom}
            className="flex items-center space-x-2 px-3 py-2 bg-dark-accent-primary text-white rounded-lg text-sm font-medium hover:bg-dark-accent-secondary transition-colors duration-200 border border-dark-accent-primary"
            title="Save as custom preset"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>Save Custom</span>
          </button>
        )}
      </div>

      {/* Keyboard shortcuts info */}
      <div className="w-full mt-2 pt-2 border-t border-dark-border-subtle">
        <div className="flex items-center justify-center space-x-4 text-xs text-dark-text-secondary">
          <span>
            💡 <strong>Shortcuts:</strong>
          </span>
          <span>Ctrl+Z (Undo)</span>
          <span>Ctrl+Y (Redo)</span>
          <span>Ctrl+R (Reset)</span>
          <span>Ctrl+S (Save)</span>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;
