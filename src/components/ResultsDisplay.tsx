import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Copy, CheckCircle2, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProcessingResult } from "@/lib/api";

interface ResultsDisplayProps {
  results: ProcessingResult[];
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [showVisualization, setShowVisualization] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleShowVisualization = (visualization: string | undefined) => {
    if (visualization) {
      setShowVisualization(visualization);
    }
  };

  const getFullText = (result: ProcessingResult): string => {
    return result.ocr.tokens.map(token => token.text).join(' ');
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ocr-results-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>Processing Results</span>
          <CheckCircle2 className="w-5 h-5 text-success" />
        </h3>
        <Button onClick={handleDownloadJSON} variant="outline" size="sm" className="transition-all duration-200">
          <Download className="w-4 h-4 mr-2" />
          Download JSON
        </Button>
      </div>

      <div className="space-y-6">
        {results.map((result, index) => (
          <Card 
            key={index} 
            className="p-4 bg-muted/50 transition-all duration-200 hover:bg-muted/70 group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm mb-2">{result.filename || `Document ${index + 1}`}</h4>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Layout Detection</Badge>
                    <Badge variant="secondary">OCR Processing</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {result.visualization && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShowVisualization(result.visualization)}
                      className="transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyText(getFullText(result))}
                    className="transition-all duration-200"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Layout Detection Results */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2">
                  <span>Layout Regions ({result.layout.boxes.length})</span>
                  <div className="h-0.5 flex-1 bg-primary/30 rounded-full" />
                </h5>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {result.layout.boxes.map((box, boxIndex) => (
                    <div 
                      key={boxIndex} 
                      className="p-3 bg-background rounded-md text-sm border border-border hover:border-primary/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {box.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
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

              {/* OCR Results */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2">
                  <span>OCR Tokens ({result.ocr.tokens.length})</span>
                  <div className="h-0.5 flex-1 bg-primary/5 rounded-full" />
                </h5>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {result.ocr.tokens.slice(0, 20).map((token, tokenIndex) => (
                    <div 
                      key={tokenIndex} 
                      className="p-3 bg-background rounded-md text-sm border border-border hover:border-primary/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          Token {tokenIndex + 1}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {(token.confidence * 100).toFixed(1)}% confidence
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mb-2">{token.text}</p>
                      <div className="text-xs text-muted-foreground">
                        Bbox: ({token.x1}, {token.y1}) → ({token.x2}, {token.y2})
                      </div>
                    </div>
                  ))}
                  {result.ocr.tokens.length > 20 && (
                    <div className="text-center text-sm text-muted-foreground py-2">
                      ... and {result.ocr.tokens.length - 20} more tokens
                    </div>
                  )}
                </div>
              </div>

              {/* Full Extracted Text */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2">
                  <span>Full Extracted Text</span>
                  <div className="h-0.5 flex-1 bg-primary/5 rounded-full" />
                </h5>
                <div className="p-4 bg-background rounded-md border border-border">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {getFullText(result)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Visualization Modal */}
      {showVisualization && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Document Visualization</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVisualization(null)}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <img 
                src={`data:image/png;base64,${showVisualization}`} 
                alt="Document with detected regions" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
