import React from "react";

export interface ValidationPanelProps {
  errors: string[];
  className?: string;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({
  errors,
  className = "",
}) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div
      className={`validation-panel bg-red-900/20 border border-red-500/30 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-400 mb-2">
            Style Validation Errors
          </h3>
          <ul className="text-sm text-red-300 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-red-400 mt-0.5">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;
