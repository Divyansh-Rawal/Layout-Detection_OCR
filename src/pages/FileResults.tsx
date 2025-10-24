import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Eye, FileText } from "lucide-react";
import { reconstructionAPI, ProcessingResult } from "@/lib/api";

const FileResults = () => {
  const { fileIndex } = useParams<{ fileIndex: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch results based on fileIndex
    // For now, we'll simulate loading
    const loadResults = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock results for demonstration
        const mockResults: ProcessingResult = {
          layout: {
            boxes: [
              {
                x1: 100, y1: 100, x2: 500, y2: 150,
                label: "Title", confidence: 0.95
              },
              {
                x1: 100, y1: 200, x2: 600, y2: 400,
                label: "Text", confidence: 0.89
              }
            ]
          },
          ocr: {
            tokens: [
              {
                x1: 100, y1: 100, x2: 500, y2: 150,
                text: "Sample Document Title",
                confidence: 0.95
              },
              {
                x1: 100, y1: 200, x2: 600, y2: 400,
                text: "This is sample extracted text from the document.",
                confidence: 0.89
              }
            ]
          },
          visualization: "mock_base64_data",
          filename: `document_${fileIndex}.pdf`
        };
        
        setResults(mockResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [fileIndex]);

  const handleDownload = () => {
    if (results) {
      const dataStr = JSON.stringify(results, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `results_${results.filename || `file_${fileIndex}`}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading results...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error || 'Results not found'}</p>
              <Button onClick={() => navigate('/')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Upload
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Processing Results</h1>
              <p className="text-sm text-muted-foreground">
                {results.filename || `File ${fileIndex}`}
              </p>
            </div>
            <div className="flex gap-2">
              {results.visualization && (
                <Button
                  onClick={() => setShowVisualization(true)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualization
                </Button>
              )}
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Layout Detection Results */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Layout Detection</h2>
                <Badge variant="secondary">
                  {results.layout.boxes.length} regions
                </Badge>
              </div>
              
              <div className="space-y-3">
                {results.layout.boxes.map((box, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{box.label}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {(box.confidence * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Bbox: ({box.x1}, {box.y1}) → ({box.x2}, {box.y2})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* OCR Results */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">OCR Processing</h2>
                <Badge variant="secondary">
                  {results.ocr.tokens.length} tokens
                </Badge>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {results.ocr.tokens.map((token, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">Token {index + 1}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {(token.confidence * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                    <p className="text-sm mb-2">{token.text}</p>
                    <div className="text-xs text-muted-foreground">
                      Bbox: ({token.x1}, {token.y1}) → ({token.x2}, {token.y2})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Full Text */}
        <Card className="p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4">Full Extracted Text</h2>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {results.ocr.tokens.map(token => token.text).join(' ')}
            </p>
          </div>
        </Card>
      </main>

      {/* Visualization Modal */}
      {showVisualization && results.visualization && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Document Visualization</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVisualization(false)}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <div className="w-full h-64 bg-muted flex items-center justify-center rounded-lg">
                <p className="text-muted-foreground">Visualization placeholder</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileResults;
