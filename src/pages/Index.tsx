import { useState } from "react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { ModeSelector } from "@/components/ModeSelector";
import { SingleTaskSelector } from "@/components/SingleTaskSelector";
import { FileProcessingCard } from "@/components/FileProcessingCard";
import { APISettings } from "@/components/APISettings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { reconstructionAPI, ProcessingResult } from "@/lib/api";

const Index = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processingMode, setProcessingMode] = useState<'pipeline' | 'single'>('pipeline');
  const [selectedTasks, setSelectedTasks] = useState<string[]>(['layout', 'ocr']);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleProcessFile = async (file: File, tasks: string[]) => {
    try {
      // Process file with backend API based on selected tasks
      const layoutModel = tasks.includes('layout') ? 'docling_layout_v1' : '';
      const ocrModel = tasks.includes('ocr') ? 'tesseract_default' : '';
      const returnVisualization = tasks.includes('visualization');

      const result = await reconstructionAPI.processFile(
        file,
        layoutModel,
        ocrModel,
        returnVisualization
      );

      // Store results (in a real app, you'd save to state or localStorage)
      console.log('Processing result:', result);
      
      toast({
        title: "Processing complete!",
        description: `Successfully processed ${file.name}`,
      });

    } catch (error) {
      console.error('Processing error:', error);
      throw error;
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Document OCR Pipeline
              </h1>
              <p className="text-sm text-muted-foreground">
                Multi-language layout detection and text extraction
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isBackendConnected === null && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span>Backend status unknown</span>
                </div>
              )}
              {isBackendConnected === true && (
                <div className="flex items-center gap-2 text-sm text-success">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <span>Backend connected</span>
                </div>
              )}
              {isBackendConnected === false && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <div className="w-2 h-2 rounded-full bg-destructive"></div>
                  <span>Backend disconnected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Mode Selection */}
          <ModeSelector
            selectedMode={processingMode}
            onModeChange={setProcessingMode}
          />

          {/* Single Task Selection (only show in single mode) */}
          {processingMode === 'single' && (
            <SingleTaskSelector
              selectedTasks={selectedTasks}
              onTaskChange={setSelectedTasks}
            />
          )}

          {/* API Settings */}
          <APISettings onConnectionChange={setIsBackendConnected} />

          {/* Document Upload */}
          <DocumentUpload 
            onFilesSelected={handleFilesSelected} 
          />

          {/* File Processing Cards */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Uploaded Files</h2>
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                  size="sm"
                >
                  Clear All
                </Button>
              </div>
              
              <div className="grid gap-4">
                {selectedFiles.map((file, index) => (
                  <FileProcessingCard
                    key={index}
                    file={file}
                    index={index}
                    onProcess={handleProcessFile}
                    processingMode={processingMode}
                    selectedTasks={selectedTasks}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <Card className="mt-8 p-6 bg-muted/30">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>Technical Implementation Notes</span>
            <div className="h-0.5 w-24 bg-primary rounded-full" />
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong className="text-primary">Layout Detection:</strong> Uses DocLing layout model (docling_layout_v1) for detecting document regions</li>
            <li>• <strong className="text-primary">OCR Engine:</strong> Tesseract OCR (tesseract_default) for multi-language text extraction</li>
            <li>• <strong className="text-primary">API Endpoints:</strong> /infer-file for file uploads, /infer for base64 processing</li>
            <li>• <strong className="text-primary">Visualization:</strong> Returns base64 encoded overlay images with detected regions</li>
            <li>• <strong className="text-primary">Backend:</strong> FastAPI-based Reconstruction Backend with pluggable models</li>
            <li>• <strong className="text-primary">Supported Formats:</strong> PNG, JPG, PDF files with real-time processing</li>
          </ul>
        </Card>
      </main>
    </div>
  );
};

export default Index;
