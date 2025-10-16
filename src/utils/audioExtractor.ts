/**
 * Audio extraction utility for video files
 * Extracts audio from video and provides it to speech recognition
 */

export interface AudioExtractionResult {
  audioBlob: Blob;
  duration: number;
  sampleRate: number;
  channels: number;
}

export class AudioExtractor {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize AudioContext
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }

  /**
   * Extract audio from video file
   */
  async extractAudioFromVideo(videoFile: File): Promise<AudioExtractionResult> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const audioContext = this.audioContext!;

      video.src = URL.createObjectURL(videoFile);
      video.crossOrigin = "anonymous";

      video.onloadedmetadata = () => {
        const duration = video.duration;

        // Set up audio processing
        const source = audioContext.createMediaElementSource(video);
        const analyser = audioContext.createAnalyser();
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        source.connect(analyser);
        analyser.connect(processor);
        processor.connect(audioContext.destination);

        const audioChunks: Float32Array[] = [];

        processor.onaudioprocess = (event) => {
          const inputBuffer = event.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);
          audioChunks.push(new Float32Array(inputData));
        };

        video.onended = () => {
          // Combine all audio chunks
          const totalLength = audioChunks.reduce(
            (sum, chunk) => sum + chunk.length,
            0
          );
          const combinedAudio = new Float32Array(totalLength);
          let offset = 0;

          for (const chunk of audioChunks) {
            combinedAudio.set(chunk, offset);
            offset += chunk.length;
          }

          // Convert to WAV format
          const wavBlob = this.float32ArrayToWav(
            combinedAudio,
            audioContext.sampleRate
          );

          resolve({
            audioBlob: wavBlob,
            duration,
            sampleRate: audioContext.sampleRate,
            channels: 1,
          });

          // Cleanup
          URL.revokeObjectURL(video.src);
          processor.disconnect();
          source.disconnect();
          analyser.disconnect();
        };

        // Start playing the video to extract audio
        video.play().catch(reject);
      };

      video.onerror = () => {
        reject(new Error("Failed to load video file"));
      };
    });
  }

  /**
   * Extract audio from video URL
   */
  async extractAudioFromUrl(videoUrl: string): Promise<AudioExtractionResult> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const audioContext = this.audioContext!;

      video.src = videoUrl;
      video.crossOrigin = "anonymous";

      video.onloadedmetadata = () => {
        const duration = video.duration;

        // Set up audio processing
        const source = audioContext.createMediaElementSource(video);
        const analyser = audioContext.createAnalyser();
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        source.connect(analyser);
        analyser.connect(processor);
        processor.connect(audioContext.destination);

        const audioChunks: Float32Array[] = [];

        processor.onaudioprocess = (event) => {
          const inputBuffer = event.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);
          audioChunks.push(new Float32Array(inputData));
        };

        video.onended = () => {
          // Combine all audio chunks
          const totalLength = audioChunks.reduce(
            (sum, chunk) => sum + chunk.length,
            0
          );
          const combinedAudio = new Float32Array(totalLength);
          let offset = 0;

          for (const chunk of audioChunks) {
            combinedAudio.set(chunk, offset);
            offset += chunk.length;
          }

          // Convert to WAV format
          const wavBlob = this.float32ArrayToWav(
            combinedAudio,
            audioContext.sampleRate
          );

          resolve({
            audioBlob: wavBlob,
            duration,
            sampleRate: audioContext.sampleRate,
            channels: 1,
          });

          // Cleanup
          processor.disconnect();
          source.disconnect();
          analyser.disconnect();
        };

        // Start playing the video to extract audio
        video.play().catch(reject);
      };

      video.onerror = () => {
        reject(new Error("Failed to load video from URL"));
      };
    });
  }

  /**
   * Convert Float32Array to WAV Blob with improved audio quality
   */
  private float32ArrayToWav(
    float32Array: Float32Array,
    sampleRate: number
  ): Blob {
    const length = float32Array.length;
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // Byte rate
    view.setUint16(32, 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample
    writeString(36, "data");
    view.setUint32(40, length * 2, true);

    // Convert float32 to int16 with normalization and amplification
    let offset = 44;
    let maxAmplitude = 0;

    // Find maximum amplitude for normalization
    for (let i = 0; i < length; i++) {
      maxAmplitude = Math.max(maxAmplitude, Math.abs(float32Array[i]));
    }

    // Normalize and amplify audio (but not too much to avoid clipping)
    const amplificationFactor =
      maxAmplitude > 0 ? Math.min(2.0, 0.8 / maxAmplitude) : 1.0;

    for (let i = 0; i < length; i++) {
      let sample = float32Array[i] * amplificationFactor;
      sample = Math.max(-1, Math.min(1, sample)); // Clamp to prevent overflow

      // Convert to 16-bit PCM
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, Math.round(intSample), true);
      offset += 2;
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
  }
}

export default AudioExtractor;
