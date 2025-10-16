import React, { useRef } from "react";
import { Upload } from "lucide-react";

interface VideoUploadSectionProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const VideoUploadSection: React.FC<VideoUploadSectionProps> = ({
  onFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="upload-section">
      <div className="text-center max-w-2xl mx-auto px-5 py-10">
        <h2 className="text-3xl font-bold text-dark-text-primary mb-4 tracking-tight">
          Video Caption Generator
        </h2>
        <p className="text-lg text-dark-text-secondary mb-10 leading-relaxed max-w-lg mx-auto">
          Transform your videos with professional, animated captions. Upload
          your video to get started.
        </p>
        <div
          className="upload-area border-3 border-dashed border-gray-300 rounded-2xl p-16 bg-gray-50 transition-all duration-300 cursor-pointer relative overflow-hidden hover:border-blue-500 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-lg"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={onFileUpload}
            className="hidden"
          />
          <div className="text-6xl mb-6 drop-shadow-sm">🎬</div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-3">
            Choose Your Video
          </h3>
          <p className="text-base text-gray-500 mb-5 leading-relaxed">
            Click to browse or drag and drop your video file
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-700">
            <Upload size={20} />
            Browse Files
          </div>
          <div className="mt-4 text-xs text-gray-400">
            Supported formats: MP4, MOV, AVI, WebM
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadSection;
