# Backend Integration Guide

This guide explains how to connect your Captionist frontend with the backend server.

## 🚀 Quick Setup

### 1. Backend Setup

Follow the instructions in `BACKEND_SETUP_GUIDE.md` to set up your backend server.

### 2. Frontend Configuration

The frontend is already configured to work with the backend. Here's what's been added:

#### New Files Created:

- `src/services/apiService.ts` - API service for backend communication
- `src/hooks/useBackendIntegration.ts` - Hook for backend integration
- `src/components/BackendStatus.tsx` - Backend connection status component
- `src/components/ErrorBoundary.tsx` - Error handling component
- `src/config/environment.ts` - Environment configuration

#### Updated Files:

- `src/hooks/useAppState.ts` - Updated to use backend integration
- `src/App.tsx` - Added backend status and error handling
- `src/components/CaptionGenerationPanel.tsx` - Added backend features

### 3. Environment Variables

Create a `.env.local` file in your frontend root directory:

```env
# Backend API Configuration
VITE_API_URL=http://localhost:3001/api

# Development Configuration
VITE_APP_NAME=Captionist
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_BACKEND=true
VITE_ENABLE_TRANSCRIPTION=true
VITE_ENABLE_CAPTION_GENERATION=true

# Debug Configuration
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info
```

## 🔧 Features Added

### Backend Integration

- **Video Upload**: Automatically uploads videos to backend when backend mode is enabled
- **Transcription**: Uses backend transcription service for automatic video transcription
- **Caption Generation**: Generates captions using backend processing
- **Progress Tracking**: Shows real-time progress for backend operations
- **Error Handling**: Graceful fallback to local processing if backend fails

### UI Enhancements

- **Backend Status**: Shows connection status to backend server
- **Toggle Switch**: Allows switching between backend and local modes
- **Progress Indicators**: Shows upload and processing progress
- **Error Messages**: Displays backend errors with fallback options

## 🎯 How to Use

### 1. Start Backend Server

```bash
cd captionist-backend
npm run dev
```

### 2. Start Frontend

```bash
cd captionist
npm run dev
```

### 3. Using Backend Features

#### Video Upload

1. Upload a video file
2. The video is automatically uploaded to the backend (if backend mode is enabled)
3. You'll see upload progress in the UI

#### Auto Transcription

1. Click the "🎤 Auto Transcribe" button
2. The backend will process the video and generate a transcript
3. Progress is shown in real-time

#### Caption Generation

1. Enter or generate a transcript
2. Click "Generate Captions"
3. The backend will process the captions with your selected style
4. Download the generated SRT file

### 4. Backend vs Local Mode

#### Backend Mode (Recommended)

- ✅ Automatic video transcription
- ✅ Server-side caption processing
- ✅ Better performance for large videos
- ✅ Professional caption generation
- ✅ SRT file download

#### Local Mode (Fallback)

- ✅ Works without backend
- ✅ Client-side processing
- ✅ Basic caption generation
- ✅ Local SRT export

## 🔍 Troubleshooting

### Backend Not Connecting

1. Check if backend server is running on `http://localhost:3001`
2. Verify the `VITE_API_URL` environment variable
3. Check browser console for error messages
4. Try refreshing the page

### Video Upload Failing

1. Ensure video file is under 100MB
2. Check supported video formats (MP4, AVI, MOV, WebM)
3. Try switching to local mode as fallback

### Transcription Not Working

1. Verify backend transcription service is running
2. Check if video file is valid
3. Try using manual transcript as fallback

### Caption Generation Issues

1. Ensure transcript is not empty
2. Check backend processing status
3. Try local caption generation as fallback

## 📊 API Endpoints Used

The frontend communicates with these backend endpoints:

- `GET /api/health` - Health check
- `POST /api/video/upload` - Video upload
- `GET /api/video/:id/metadata` - Video metadata
- `GET /api/video/:id/stream` - Video streaming
- `POST /api/transcription/transcribe` - Video transcription
- `GET /api/transcription/status/:jobId` - Transcription status
- `POST /api/captions/generate` - Caption generation
- `GET /api/captions/status/:jobId` - Caption status
- `GET /api/captions/:jobId/captions` - Get captions
- `GET /api/captions/:jobId/download/srt` - Download SRT

## 🎨 Customization

### Styling

The backend integration components use the same dark theme as your existing UI. You can customize the styling by modifying the CSS classes in the components.

### Configuration

Modify `src/config/environment.ts` to change default settings:

- API URL
- Feature flags
- File upload limits
- Polling intervals

### Error Handling

Customize error handling in `src/components/ErrorBoundary.tsx` and `src/hooks/useBackendIntegration.ts`.

## 🚀 Deployment

### Frontend Deployment

1. Build the frontend: `npm run build`
2. Deploy to your hosting service
3. Update `VITE_API_URL` to point to your production backend

### Backend Deployment

Follow the deployment instructions in `BACKEND_SETUP_GUIDE.md`.

## 📝 Notes

- The frontend gracefully falls back to local processing if the backend is unavailable
- All backend operations are asynchronous and show progress indicators
- Error messages are user-friendly and provide fallback options
- The integration maintains backward compatibility with existing local features
