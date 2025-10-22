// Utility to detect file size for smart polling
export class FileSizeDetector {
  // Get file size from video element
  static getFileSizeFromVideo(videoElement: HTMLVideoElement | null): number {
    if (!videoElement?.duration) return 0;

    // Rough estimate: 1MB per 10 seconds of video
    // This is a conservative estimate for typical video compression
    return Math.round(videoElement.duration * 100000); // bytes
  }

  // Get file size from File object
  static getFileSizeFromFile(file: File | null): number {
    if (!file) return 0;
    return file.size;
  }

  // Get file size from video URL (if it's a blob URL)
  static async getFileSizeFromUrl(url: string): Promise<number> {
    if (!url.startsWith("blob:")) return 0;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return blob.size;
    } catch (error) {
      console.warn("Could not determine file size from URL:", error);
      return 0;
    }
  }

  // Get file size category for UI display
  static getFileSizeCategory(sizeInBytes: number): {
    category: "small" | "medium" | "large" | "very-large";
    label: string;
    estimatedTime: string;
  } {
    const sizeInMB = sizeInBytes / (1024 * 1024);

    if (sizeInMB < 10) {
      return {
        category: "small",
        label: "Small file",
        estimatedTime: "1-2 minutes",
      };
    } else if (sizeInMB < 50) {
      return {
        category: "medium",
        label: "Medium file",
        estimatedTime: "2-5 minutes",
      };
    } else if (sizeInMB < 100) {
      return {
        category: "large",
        label: "Large file",
        estimatedTime: "5-10 minutes",
      };
    } else {
      return {
        category: "very-large",
        label: "Very large file",
        estimatedTime: "10+ minutes",
      };
    }
  }

  // Format file size for display
  static formatFileSize(sizeInBytes: number): string {
    if (sizeInBytes === 0) return "Unknown size";

    const sizeInMB = sizeInBytes / (1024 * 1024);
    if (sizeInMB < 1) {
      return `${Math.round(sizeInBytes / 1024)} KB`;
    } else if (sizeInMB < 1024) {
      return `${Math.round(sizeInMB)} MB`;
    } else {
      return `${Math.round(sizeInMB / 1024)} GB`;
    }
  }
}
