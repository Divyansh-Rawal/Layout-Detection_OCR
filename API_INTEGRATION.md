# API Integration Documentation

## Overview

The Layout-Detection_OCR frontend has been fully integrated with the Reconstruction Backend API, providing real-time document processing capabilities with layout detection and OCR functionality.

## Backend API Structure

The application now connects to a FastAPI-based Reconstruction Backend that provides:

### Available Endpoints

- **`GET /health`** - Health check endpoint
- **`GET /models`** - List available layout and OCR models
- **`POST /infer`** - Process base64 encoded images
- **`POST /infer-file`** - Process uploaded files directly

### Available Models

- **Layout Detection**: `docling_layout_v1` (DocLing layout model)
- **OCR Processing**: `tesseract_default` (Tesseract OCR engine)

### Supported File Formats

- PNG images
- JPG/JPEG images  
- PDF documents

## Frontend Integration

### New Components

1. **API Service Layer** (`src/lib/api.ts`)
   - Handles all backend communication
   - Provides TypeScript interfaces for API responses
   - Includes error handling and connection management

2. **API Settings Component** (`src/components/APISettings.tsx`)
   - Allows configuration of backend URL
   - Tests connection and displays available models
   - Shows real-time connection status

3. **Enhanced Results Display** (`src/components/ResultsDisplay.tsx`)
   - Displays layout detection results with bounding boxes
   - Shows OCR tokens with confidence scores
   - Includes visualization overlay modal
   - Supports full text extraction and copying

### Key Features

#### Real-time Processing Pipeline
- **Upload**: File validation and preparation
- **Tilt Correction**: Automatic document orientation correction
- **Layout Detection**: Uses DocLing model to detect document regions
- **OCR Processing**: Extracts text using Tesseract engine
- **Text Cleaning**: Language-specific post-processing
- **Complete**: Results display with visualization

#### Backend Status Monitoring
- Real-time connection status indicator in header
- Automatic health checks during processing
- Connection testing in API settings panel

#### Visualization Support
- Base64 encoded overlay images showing detected regions
- Modal popup for detailed visualization viewing
- Bounding box coordinates for all detected elements

#### Enhanced Results Display
- **Layout Regions**: Shows detected document structure with confidence scores
- **OCR Tokens**: Displays individual text tokens with bounding boxes
- **Full Text**: Combined extracted text with copy functionality
- **Export**: JSON download of complete results

## API Response Format

```typescript
interface ProcessingResult {
  layout: {
    boxes: Array<{
      x1: number; y1: number; x2: number; y2: number;
      label: string; confidence: number;
    }>;
  };
  ocr: {
    tokens: Array<{
      x1: number; y1: number; x2: number; y2: number;
      text: string; confidence: number;
    }>;
  };
  visualization?: string; // Base64 encoded PNG overlay
  filename?: string;
  content_type?: string;
}
```

## Usage Instructions

### 1. Backend Setup
Ensure the Reconstruction Backend is running on `http://localhost:8000` (or configure custom URL in API Settings).

### 2. Connection Testing
- Open the API Settings panel
- Test connection to verify backend availability
- View available models and their status

### 3. Document Processing
- Upload PNG, JPG, or PDF files via drag-and-drop or file selection
- Select processing language (currently for UI display only)
- Click "Start Processing" to begin real-time processing
- Monitor progress through the processing stages
- View results with layout detection and OCR data

### 4. Results Analysis
- **Layout Regions**: View detected document structure
- **OCR Tokens**: Examine individual text elements
- **Visualization**: Click eye icon to see overlay image
- **Export**: Download complete results as JSON

## Error Handling

The application includes comprehensive error handling:

- **Connection Errors**: Clear messaging when backend is unavailable
- **Processing Errors**: Detailed error messages for failed operations
- **File Validation**: Proper validation for supported file formats
- **Network Timeouts**: Graceful handling of network issues

## Configuration

### Backend URL Configuration
Default: `http://localhost:8000`
Can be changed in the API Settings panel.

### Model Selection
Currently uses:
- Layout Model: `docling_layout_v1`
- OCR Model: `tesseract_default`

## Technical Implementation

### API Service Architecture
- Singleton pattern for API instance
- Promise-based async operations
- TypeScript interfaces for type safety
- Automatic base64 conversion for file uploads

### State Management
- React hooks for local state management
- Real-time connection status tracking
- Processing stage progression
- Results caching and display

### UI/UX Enhancements
- Loading states during processing
- Progress indicators for each stage
- Toast notifications for user feedback
- Modal overlays for detailed views

## Future Enhancements

Potential areas for future development:

1. **Model Selection UI**: Allow users to choose different models
2. **Batch Processing**: Process multiple files simultaneously
3. **Advanced Filtering**: Filter results by confidence scores
4. **Export Formats**: Support for additional export formats
5. **Real-time Streaming**: Stream processing updates
6. **Custom Parameters**: Allow users to configure processing parameters

## Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Verify backend is running on correct port
   - Check network connectivity
   - Ensure CORS is properly configured

2. **Processing Errors**
   - Verify file format is supported
   - Check file size limits
   - Ensure backend models are loaded

3. **Visualization Not Loading**
   - Check if `return_visualization=true` is set
   - Verify base64 image data is valid
   - Check browser console for errors

### Debug Information

Enable browser developer tools to view:
- Network requests to backend
- API response data
- Error messages and stack traces
- Console logs for debugging
