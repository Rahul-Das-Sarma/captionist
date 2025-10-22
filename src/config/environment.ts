// Environment configuration for the application
export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3001/api",

  // Application Configuration
  appName: import.meta.env.VITE_APP_NAME || "Captionist",
  appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",

  // Feature Flags
  enableBackend: import.meta.env.VITE_ENABLE_BACKEND !== "false",
  enableTranscription: import.meta.env.VITE_ENABLE_TRANSCRIPTION !== "false",
  enableCaptionGeneration:
    import.meta.env.VITE_ENABLE_CAPTION_GENERATION !== "false",

  // Debug Configuration
  debugMode: import.meta.env.VITE_DEBUG_MODE === "true",
  logLevel: import.meta.env.VITE_LOG_LEVEL || "info",

  // Default Settings
  defaultCaptionStyle: "reel" as const,
  defaultCaptionPosition: "bottom" as const,
  defaultMaxSegmentDuration: 5,
  defaultMinSegmentDuration: 1,
  defaultWordPerMinute: 150,

  // File Upload Limits
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedVideoTypes: [
    "video/mp4",
    "video/avi",
    "video/mov",
    "video/webm",
    "video/quicktime",
  ],
  allowedSRTTypes: ["text/plain", "application/x-subrip"],

  // Polling Configuration
  defaultPollingInterval: 2000, // 2 seconds
  maxPollingAttempts: 900, // 30 minutes total (900 * 2 seconds = 1800 seconds = 30 minutes)
};

// Helper function to check if backend is available
export const isBackendAvailable = async (): Promise<boolean> => {
  if (!config.enableBackend) {
    return false;
  }

  try {
    const response = await fetch(`${config.apiUrl}/health`);
    return response.ok;
  } catch (error) {
    console.warn("Backend not available:", error);
    return false;
  }
};

// Helper function to get API base URL
export const getApiUrl = (): string => {
  return config.apiUrl;
};

// Helper function to check if feature is enabled
export const isFeatureEnabled = (feature: keyof typeof config): boolean => {
  return config[feature] as boolean;
};
