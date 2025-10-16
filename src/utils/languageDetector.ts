/**
 * Language detection utility for audio/video content
 * Uses Web Speech API to detect the most likely language
 */

export interface LanguageDetectionResult {
  language: string;
  confidence: number;
  detectedLanguages: Array<{
    language: string;
    confidence: number;
  }>;
}

export class LanguageDetector {
  private supportedLanguages = [
    "en-US",
    "en-GB",
    "en-AU",
    "en-CA",
    "es-ES",
    "es-MX",
    "es-AR",
    "es-CO",
    "fr-FR",
    "fr-CA",
    "fr-BE",
    "de-DE",
    "de-AT",
    "de-CH",
    "it-IT",
    "it-CH",
    "pt-PT",
    "pt-BR",
    "nl-NL",
    "nl-BE",
    "sv-SE",
    "da-DK",
    "no-NO",
    "fi-FI",
    "pl-PL",
    "cs-CZ",
    "hu-HU",
    "ro-RO",
    "bg-BG",
    "hr-HR",
    "sk-SK",
    "sl-SI",
    "et-EE",
    "lv-LV",
    "lt-LT",
    "ru-RU",
    "uk-UA",
    "be-BY",
    "tr-TR",
    "el-GR",
    "he-IL",
    "ar-SA",
    "ar-EG",
    "ar-AE",
    "hi-IN",
    "bn-IN",
    "ta-IN",
    "te-IN",
    "ml-IN",
    "kn-IN",
    "gu-IN",
    "pa-IN",
    "or-IN",
    "as-IN",
    "ne-NP",
    "si-LK",
    "th-TH",
    "vi-VN",
    "id-ID",
    "ms-MY",
    "tl-PH",
    "ko-KR",
    "ja-JP",
    "zh-CN",
    "zh-TW",
    "zh-HK",
    "yue-HK",
  ];

  /**
   * Detect language from audio sample
   */
  async detectLanguageFromAudio(
    audioBlob: Blob,
    duration: number = 10
  ): Promise<LanguageDetectionResult> {
    return new Promise((resolve, reject) => {
      const audio = document.createElement("audio");
      const audioUrl = URL.createObjectURL(audioBlob);
      audio.src = audioUrl;
      audio.crossOrigin = "anonymous";

      const results: Array<{ language: string; confidence: number }> = [];
      const maxTests = Math.min(5, this.supportedLanguages.length); // Test top 5 languages

      const testLanguages = this.getTopLanguagesForRegion();

      const testLanguage = (language: string) => {
        return new Promise<void>((resolveTest) => {
          const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SpeechRecognition) {
            resolveTest();
            return;
          }

          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = language;
          recognition.maxAlternatives = 1;

          let transcript = "";
          let confidence = 0;
          let resultCount = 0;

          recognition.onresult = (event: any) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const result = event.results[i];
              if (result.isFinal) {
                transcript += result[0].transcript;
                confidence += result[0].confidence || 0;
                resultCount++;
              }
            }
          };

          recognition.onend = () => {
            const avgConfidence =
              resultCount > 0 ? confidence / resultCount : 0;
            results.push({
              language,
              confidence: avgConfidence,
            });
            resolveTest();
          };

          recognition.onerror = () => {
            resolveTest();
          };

          // Start recognition and stop after sample duration
          recognition.start();
          setTimeout(() => {
            recognition.stop();
          }, Math.min(duration * 1000, 5000)); // Max 5 seconds per test
        });
      };

      audio.onloadedmetadata = async () => {
        try {
          // Test multiple languages in parallel
          const testPromises = testLanguages
            .slice(0, maxTests)
            .map((lang) => testLanguage(lang));
          await Promise.all(testPromises);

          // Sort results by confidence
          results.sort((a, b) => b.confidence - a.confidence);

          const bestResult = results[0] || { language: "en-US", confidence: 0 };

          resolve({
            language: bestResult.language,
            confidence: bestResult.confidence,
            detectedLanguages: results,
          });

          // Cleanup
          URL.revokeObjectURL(audioUrl);
        } catch (error) {
          reject(new Error("Language detection failed"));
        }
      };

      audio.onerror = () => {
        reject(new Error("Failed to load audio for language detection"));
      };
    });
  }

  /**
   * Get top languages for the user's region
   */
  private getTopLanguagesForRegion(): string[] {
    const userLanguage = navigator.language || "en-US";
    const region = userLanguage.split("-")[1] || "US";

    // Prioritize languages based on region
    const regionPriorities: { [key: string]: string[] } = {
      US: ["en-US", "es-US", "fr-US", "de-US", "it-US"],
      GB: ["en-GB", "en-US", "fr-FR", "de-DE", "es-ES"],
      CA: ["en-CA", "fr-CA", "en-US", "es-MX", "de-DE"],
      AU: ["en-AU", "en-US", "en-GB", "zh-CN", "hi-IN"],
      DE: ["de-DE", "en-US", "fr-FR", "es-ES", "it-IT"],
      FR: ["fr-FR", "en-US", "es-ES", "de-DE", "it-IT"],
      ES: ["es-ES", "en-US", "fr-FR", "de-DE", "it-IT"],
      IT: ["it-IT", "en-US", "fr-FR", "es-ES", "de-DE"],
      BR: ["pt-BR", "en-US", "es-ES", "fr-FR", "de-DE"],
      MX: ["es-MX", "en-US", "pt-BR", "fr-FR", "de-DE"],
      IN: ["hi-IN", "en-IN", "bn-IN", "ta-IN", "te-IN"],
      CN: ["zh-CN", "en-US", "ja-JP", "ko-KR", "vi-VN"],
      JP: ["ja-JP", "en-US", "zh-CN", "ko-KR", "vi-VN"],
      KR: ["ko-KR", "en-US", "ja-JP", "zh-CN", "vi-VN"],
    };

    return (
      regionPriorities[region] || [
        "en-US",
        "es-ES",
        "fr-FR",
        "de-DE",
        "it-IT",
        "pt-BR",
        "ru-RU",
        "ja-JP",
        "zh-CN",
        "ko-KR",
      ]
    );
  }

  /**
   * Get language name from code
   */
  getLanguageName(languageCode: string): string {
    const languageNames: { [key: string]: string } = {
      "en-US": "English (US)",
      "en-GB": "English (UK)",
      "en-AU": "English (Australia)",
      "en-CA": "English (Canada)",
      "es-ES": "Spanish (Spain)",
      "es-MX": "Spanish (Mexico)",
      "es-AR": "Spanish (Argentina)",
      "fr-FR": "French (France)",
      "fr-CA": "French (Canada)",
      "de-DE": "German (Germany)",
      "it-IT": "Italian (Italy)",
      "pt-BR": "Portuguese (Brazil)",
      "pt-PT": "Portuguese (Portugal)",
      "ru-RU": "Russian (Russia)",
      "ja-JP": "Japanese (Japan)",
      "zh-CN": "Chinese (Simplified)",
      "zh-TW": "Chinese (Traditional)",
      "ko-KR": "Korean (South Korea)",
      "hi-IN": "Hindi (India)",
      "ar-SA": "Arabic (Saudi Arabia)",
      "nl-NL": "Dutch (Netherlands)",
      "sv-SE": "Swedish (Sweden)",
      "da-DK": "Danish (Denmark)",
      "no-NO": "Norwegian (Norway)",
      "fi-FI": "Finnish (Finland)",
      "pl-PL": "Polish (Poland)",
      "tr-TR": "Turkish (Turkey)",
      "th-TH": "Thai (Thailand)",
      "vi-VN": "Vietnamese (Vietnam)",
      "id-ID": "Indonesian (Indonesia)",
      "ms-MY": "Malay (Malaysia)",
      "tl-PH": "Filipino (Philippines)",
    };

    return languageNames[languageCode] || languageCode;
  }
}

export default LanguageDetector;
