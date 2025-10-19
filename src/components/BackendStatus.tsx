import React, { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import { isBackendAvailable } from "../config/environment";

interface BackendStatusProps {
  onStatusChange?: (isConnected: boolean) => void;
}

export const BackendStatus: React.FC<BackendStatusProps> = ({
  onStatusChange,
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkBackendStatus = async () => {
    setIsChecking(true);
    try {
      const available = await isBackendAvailable();
      setIsConnected(available);
      setLastChecked(new Date());
      onStatusChange?.(available);
    } catch (error) {
      console.error("Backend status check failed:", error);
      setIsConnected(false);
      onStatusChange?.(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();

    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isConnected === null) return "text-gray-500";
    return isConnected ? "text-green-500" : "text-red-500";
  };

  const getStatusText = () => {
    if (isChecking) return "Checking...";
    if (isConnected === null) return "Unknown";
    return isConnected ? "Connected" : "Disconnected";
  };

  const getStatusIcon = () => {
    if (isChecking) return "🔄";
    if (isConnected === null) return "❓";
    return isConnected ? "✅" : "❌";
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <span className="text-lg">{getStatusIcon()}</span>
      <span className={`font-medium ${getStatusColor()}`}>
        Backend: {getStatusText()}
      </span>
      {lastChecked && (
        <span className="text-gray-400 text-xs">
          ({lastChecked.toLocaleTimeString()})
        </span>
      )}
      <button
        onClick={checkBackendStatus}
        disabled={isChecking}
        className="ml-2 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
      >
        {isChecking ? "Checking..." : "Refresh"}
      </button>
    </div>
  );
};
