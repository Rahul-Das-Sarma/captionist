// SRT file parser utility

export interface SRTSubtitle {
  id: number;
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
}

export interface CaptionSegment {
  text: string;
  startTime: number;
  endTime: number;
  id: string;
  confidence: number;
}

export class SRTParser {
  // Parse SRT file content into subtitle objects
  static parseSRTContent(content: string): SRTSubtitle[] {
    console.log("📄 Parsing SRT file content...");

    const subtitles: SRTSubtitle[] = [];
    const blocks = content.trim().split(/\n\s*\n/);

    for (const block of blocks) {
      if (block.trim()) {
        const subtitle = this.parseSRTBlock(block);
        if (subtitle) {
          subtitles.push(subtitle);
        }
      }
    }

    console.log(`✅ Parsed ${subtitles.length} subtitle entries`);
    return subtitles;
  }

  // Parse a single SRT block
  private static parseSRTBlock(block: string): SRTSubtitle | null {
    const lines = block.trim().split("\n");

    if (lines.length < 3) {
      console.warn("⚠️ Invalid SRT block:", block);
      return null;
    }

    // Parse ID
    const id = parseInt(lines[0].trim());
    if (isNaN(id)) {
      console.warn("⚠️ Invalid subtitle ID:", lines[0]);
      return null;
    }

    // Parse time range
    const timeMatch = lines[1].match(
      /(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/
    );
    if (!timeMatch) {
      console.warn("⚠️ Invalid time format:", lines[1]);
      return null;
    }

    const startTime = this.parseSRTTime(timeMatch[1]);
    const endTime = this.parseSRTTime(timeMatch[2]);

    // Parse text (remaining lines)
    const text = lines.slice(2).join("\n").trim();

    return {
      id,
      startTime,
      endTime,
      text,
    };
  }

  // Parse SRT time format (HH:MM:SS,mmm) to seconds
  private static parseSRTTime(timeString: string): number {
    const [time, milliseconds] = timeString.split(",");
    const [hours, minutes, seconds] = time.split(":").map(Number);

    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  }

  // Convert SRT subtitles to caption segments
  static convertToCaptionSegments(subtitles: SRTSubtitle[]): CaptionSegment[] {
    console.log("🔄 Converting SRT subtitles to caption segments...");

    return subtitles.map((subtitle, index) => ({
      id: `srt-caption-${subtitle.id}-${index}`,
      text: subtitle.text,
      startTime: subtitle.startTime,
      endTime: subtitle.endTime,
      confidence: 1.0, // SRT files are considered 100% accurate
    }));
  }

  // Format time for SRT output (seconds to HH:MM:SS,mmm)
  static formatSRTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")},${milliseconds
      .toString()
      .padStart(3, "0")}`;
  }

  // Generate SRT content from caption segments
  static generateSRTContent(captions: CaptionSegment[]): string {
    console.log("📝 Generating SRT content from captions...");

    return captions
      .map((caption, index) => {
        const startTime = this.formatSRTTime(caption.startTime);
        const endTime = this.formatSRTTime(caption.endTime);
        return `${index + 1}\n${startTime} --> ${endTime}\n${caption.text}\n`;
      })
      .join("\n");
  }
}

// File upload utility
export class FileUploader {
  // Upload and parse SRT file
  static async uploadSRTFile(file: File): Promise<SRTSubtitle[]> {
    console.log("📁 Uploading SRT file:", file.name);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const subtitles = SRTParser.parseSRTContent(content);
          console.log(`✅ Successfully parsed ${subtitles.length} subtitles`);
          resolve(subtitles);
        } catch (error) {
          console.error("❌ Failed to parse SRT file:", error);
          reject(new Error(`Failed to parse SRT file: ${error}`));
        }
      };

      reader.onerror = () => {
        console.error("❌ Failed to read SRT file");
        reject(new Error("Failed to read SRT file"));
      };

      reader.readAsText(file, "UTF-8");
    });
  }

  // Validate SRT file
  static validateSRTFile(file: File): boolean {
    const isValidExtension = file.name.toLowerCase().endsWith(".srt");
    const isValidSize = file.size < 10 * 1024 * 1024; // 10MB limit
    const isValidType =
      file.type === "text/plain" || file.type === "application/x-subrip";

    console.log("🔍 Validating SRT file:", {
      name: file.name,
      size: file.size,
      type: file.type,
      isValidExtension,
      isValidSize,
      isValidType,
    });

    return isValidExtension && isValidSize && (isValidType || file.type === "");
  }
}
