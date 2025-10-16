import React from "react";
import { Settings, Download } from "lucide-react";

interface ActionButtonsPanelProps {
  showSettings: boolean;
  onToggleSettings: () => void;
  onDownloadCaptions: () => void;
  onCreateTestCaptions: () => void;
  captionsCount: number;
  isGenerating: boolean;
}

const ActionButtonsPanel: React.FC<ActionButtonsPanelProps> = ({
  showSettings,
  onToggleSettings,
  onDownloadCaptions,
  onCreateTestCaptions,
  captionsCount,
  isGenerating,
}) => {
  return (
    <div className="bg-dark-bg-secondary rounded-3xl p-6 mb-5 border border-dark-border-subtle shadow-dark-primary">
      <h4 className="mb-4 text-lg font-bold text-dark-text-primary text-shadow-dark-glow">
        Actions
      </h4>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onToggleSettings}
          className="flex items-center gap-2 px-4 py-2 bg-dark-bg-tertiary text-dark-text-primary border border-dark-border-subtle rounded-lg text-sm font-medium hover:bg-dark-bg-primary hover:border-dark-accent-primary transition-all duration-300"
        >
          <Settings size={16} />
          Settings
        </button>

        <button
          onClick={onDownloadCaptions}
          disabled={captionsCount === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            captionsCount > 0
              ? "bg-green-600 text-white hover:bg-green-700 shadow-dark-glow"
              : "bg-dark-bg-tertiary text-dark-text-muted cursor-not-allowed"
          }`}
        >
          <Download size={16} />
          Download SRT
        </button>

        <button
          onClick={onCreateTestCaptions}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all duration-300 shadow-dark-glow"
        >
          🧪 Test Captions
        </button>
      </div>

      {/* Status Information */}
      <div className="mt-4 p-3 bg-dark-bg-tertiary rounded-lg border border-dark-border-subtle">
        <div className="flex justify-between items-center text-sm">
          <span className="text-dark-text-secondary">
            <strong>Captions:</strong> {captionsCount}
          </span>
          <span
            className={`font-medium ${
              isGenerating ? "text-dark-accent-primary" : "text-green-400"
            }`}
          >
            {isGenerating ? "Generating..." : "Ready"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActionButtonsPanel;
