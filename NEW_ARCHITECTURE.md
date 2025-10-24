# New Application Architecture

## Overview

The application has been restructured to support two distinct processing modes with individual file processing and separate results pages for each stage.

## 🏗️ **New Architecture**

### **Processing Modes**

1. **Full Pipeline Mode**
   - Complete processing: Upload → Tilt Correction → Layout Detection → OCR → Text Cleaning
   - Uses both layout detection and OCR models
   - Includes visualization generation
   - Single comprehensive result per file

2. **Single Task Mode**
   - Selective processing: Choose specific tasks
   - Available tasks:
     - **Layout Detection**: Detect document structure and regions
     - **OCR Processing**: Extract text from document regions  
     - **Visualization**: Generate overlay images with detected regions
   - Faster processing for specific needs

### **Component Structure**

#### **New Components**

1. **ModeSelector** (`src/components/ModeSelector.tsx`)
   - Radio button selection between Pipeline and Single Task modes
   - Clear descriptions and feature highlights for each mode
   - Visual indicators for available features

2. **SingleTaskSelector** (`src/components/SingleTaskSelector.tsx`)
   - Checkbox selection for individual tasks
   - Shows available models for each task
   - Only visible in Single Task mode

3. **FileProcessingCard** (`src/components/FileProcessingCard.tsx`)
   - Individual card for each uploaded file
   - Shows file details (name, size, type)
   - Individual process button per file
   - Progress tracking and status indicators
   - Error handling and retry functionality
   - Navigation to individual results page

4. **FileResults** (`src/pages/FileResults.tsx`)
   - Dedicated results page for each file
   - Separate sections for Layout Detection and OCR results
   - Visualization modal support
   - Download functionality
   - Back navigation to main page

#### **Updated Components**

1. **Index** (`src/pages/Index.tsx`)
   - Simplified main page focused on mode selection and file upload
   - Removed old processing pipeline UI
   - Added file processing cards grid
   - Mode-based conditional rendering

2. **App** (`src/App.tsx`)
   - Added new route for individual file results
   - Route: `/results/:fileIndex`

### **User Flow**

#### **Pipeline Mode Flow**
1. Select "Full Pipeline" mode
2. Upload documents
3. Each file gets its own processing card
4. Click "Process" on individual files
5. View results on dedicated page per file

#### **Single Task Mode Flow**
1. Select "Single Task" mode
2. Choose specific tasks (Layout, OCR, Visualization)
3. Upload documents
4. Each file gets its own processing card
5. Click "Process" on individual files
6. View results on dedicated page per file

### **File Processing**

Each file is processed independently with:
- **Individual status tracking**: Ready, Processing, Complete, Failed
- **Progress indicators**: Shows current processing stage
- **Error handling**: Individual error messages and retry options
- **Results storage**: Each file's results stored separately
- **Navigation**: Direct links to individual result pages

### **Results Display**

#### **Individual File Results Page**
- **Route**: `/results/:fileIndex`
- **Layout Detection Section**: Shows detected regions with bounding boxes
- **OCR Processing Section**: Shows extracted text tokens
- **Full Text Section**: Combined extracted text
- **Visualization Modal**: Overlay image with detected regions
- **Download Options**: JSON export of complete results

### **Technical Implementation**

#### **State Management**
- **Mode Selection**: Pipeline vs Single Task
- **Task Selection**: Individual task checkboxes
- **File Management**: Array of uploaded files
- **Processing Status**: Per-file processing state
- **Results Storage**: Individual file results

#### **API Integration**
- **Dynamic Model Selection**: Based on selected tasks
- **Conditional Processing**: Only runs selected models
- **Individual File Processing**: Each file processed separately
- **Results Storage**: Per-file result management

#### **Routing**
- **Main Page**: `/` - File upload and processing
- **Results Page**: `/results/:fileIndex` - Individual file results
- **Navigation**: Seamless navigation between pages

### **Benefits of New Architecture**

1. **Flexibility**: Users can choose between full pipeline or specific tasks
2. **Performance**: Single task mode allows faster processing
3. **Scalability**: Individual file processing supports batch operations
4. **User Experience**: Clear separation of concerns and results
5. **Maintainability**: Modular component structure
6. **Debugging**: Individual file processing makes debugging easier

### **Future Enhancements**

1. **Batch Processing**: Process multiple files simultaneously
2. **Progress Tracking**: Real-time progress updates across files
3. **Results Comparison**: Compare results between files
4. **Export Options**: Multiple export formats
5. **Processing History**: Track processing history per file
6. **Custom Parameters**: Per-file processing parameters

## 🚀 **Usage Instructions**

### **Getting Started**
1. Choose processing mode (Pipeline or Single Task)
2. If Single Task, select specific tasks
3. Upload documents via drag-and-drop or file selection
4. Click "Process" on individual files
5. View results on dedicated pages

### **Processing Modes**
- **Full Pipeline**: Complete document analysis
- **Single Task**: Selective processing for specific needs

### **Results Navigation**
- Click "View Results" on completed files
- Navigate between individual result pages
- Use back button to return to main page

This new architecture provides a more flexible, scalable, and user-friendly approach to document processing with clear separation of concerns and individual file management.
