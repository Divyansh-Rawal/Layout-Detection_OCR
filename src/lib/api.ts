// API service for Reconstruction Backend
export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  confidence: number;
}

export interface OCRToken {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  text: string;
  confidence: number;
}

export interface LayoutResult {
  boxes: BoundingBox[];
}

export interface OCRResult {
  tokens: OCRToken[];
}

export interface ProcessingResult {
  layout: LayoutResult;
  ocr: OCRResult;
  visualization?: string; // Base64 encoded PNG overlay
  filename?: string;
  content_type?: string;
}

export interface APIResponse {
  results?: ProcessingResult[];
  layout?: LayoutResult;
  ocr?: OCRResult;
  visualization?: string;
  filename?: string;
  content_type?: string;
}

export interface ModelsResponse {
  layout_models: string[];
  ocr_models: string[];
}

class ReconstructionAPI {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${this.baseURL}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  }

  // Get available models
  async getModels(): Promise<ModelsResponse> {
    const response = await fetch(`${this.baseURL}/models`);
    if (!response.ok) {
      throw new Error(`Failed to get models: ${response.statusText}`);
    }
    return response.json();
  }

  // Process file with both layout detection and OCR
  async processFile(
    file: File,
    layoutModel: string = 'docling_layout_v1',
    ocrModel: string = 'tesseract_default',
    returnVisualization: boolean = true
  ): Promise<ProcessingResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('layout_model', layoutModel);
    formData.append('ocr_model', ocrModel);
    formData.append('return_visualization', returnVisualization.toString());

    const response = await fetch(`${this.baseURL}/infer-file`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`File processing failed: ${response.statusText}`);
    }

    const result: APIResponse = await response.json();
    
    // Handle both single result and results array formats
    if (result.results && result.results.length > 0) {
      return result.results[0];
    } else {
      return {
        layout: result.layout || { boxes: [] },
        ocr: result.ocr || { tokens: [] },
        visualization: result.visualization,
        filename: result.filename,
        content_type: result.content_type,
      };
    }
  }

  // Process base64 encoded image
  async processBase64(
    imageB64: string,
    imageId: string = 'page1',
    layoutModel: string = 'docling_layout_v1',
    ocrModel: string = 'tesseract_default',
    returnVisualization: boolean = true
  ): Promise<ProcessingResult> {
    const payload = {
      inputs: [
        {
          image_id: imageId,
          image_b64: imageB64,
        },
      ],
      layout_model: layoutModel,
      ocr_model: ocrModel,
      params: {
        layout: {},
        ocr: {},
      },
      return_visualization: returnVisualization,
    };

    const response = await fetch(`${this.baseURL}/infer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Base64 processing failed: ${response.statusText}`);
    }

    const result: APIResponse = await response.json();
    
    if (result.results && result.results.length > 0) {
      return result.results[0];
    } else {
      throw new Error('No results returned from API');
    }
  }

  // Convert file to base64
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

export const reconstructionAPI = new ReconstructionAPI();
