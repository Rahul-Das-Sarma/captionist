// Test utility to verify backend connection
import { apiService } from "../services/apiService";
import { isBackendAvailable } from "../config/environment";

export const testBackendConnection = async (): Promise<{
  isConnected: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log("🔍 Testing backend connection...");

    // Test 1: Basic health check
    const healthCheck = await apiService.healthCheck();
    console.log("Health check result:", healthCheck);

    if (!healthCheck.success) {
      return {
        isConnected: false,
        message: "Backend health check failed",
        details: healthCheck.error,
      };
    }

    // Test 2: Environment check
    const isAvailable = await isBackendAvailable();
    console.log("Backend availability:", isAvailable);

    if (!isAvailable) {
      return {
        isConnected: false,
        message: "Backend is not available",
        details: "Backend server may not be running",
      };
    }

    return {
      isConnected: true,
      message: "Backend connection successful",
      details: {
        healthCheck,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Backend connection test failed:", error);
    return {
      isConnected: false,
      message: "Backend connection test failed",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Helper function to run connection test from console
export const runBackendTest = async () => {
  const result = await testBackendConnection();
  console.log("Backend Test Result:", result);
  return result;
};

// Make it available globally for debugging
if (typeof window !== "undefined") {
  (window as any).testBackend = runBackendTest;
}
