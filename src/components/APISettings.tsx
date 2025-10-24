import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { reconstructionAPI } from "@/lib/api";

interface APISettingsProps {
  onConnectionChange: (connected: boolean | null) => void;
}

export const APISettings = ({ onConnectionChange }: APISettingsProps) => {
  const [baseURL, setBaseURL] = useState("http://localhost:8000");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [availableModels, setAvailableModels] = useState<{
    layout_models: string[];
    ocr_models: string[];
  } | null>(null);
  const { toast } = useToast();

  const testConnection = async () => {
    setIsTestingConnection(true);
    onConnectionChange(null);

    try {
      // Update API base URL
      (reconstructionAPI as unknown as { baseURL: string }).baseURL = baseURL;
      
      // Test health endpoint
      await reconstructionAPI.healthCheck();
      
      // Get available models
      const models = await reconstructionAPI.getModels();
      setAvailableModels(models);
      
      onConnectionChange(true);
      toast({
        title: "Connection successful!",
        description: `Connected to ${baseURL}`,
      });
    } catch (error) {
      console.error('Connection test failed:', error);
      onConnectionChange(false);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Could not connect to backend",
        variant: "destructive"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  useEffect(() => {
    // Test connection on component mount
    testConnection();
  }, []);

  return (
    <Card className="p-6 animate-slide-up">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">API Configuration</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="base-url" className="text-sm font-medium">
              Backend URL
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="base-url"
                value={baseURL}
                onChange={(e) => setBaseURL(e.target.value)}
                placeholder="http://localhost:8000"
                className="flex-1"
              />
              <Button
                onClick={testConnection}
                disabled={isTestingConnection}
                variant="outline"
                size="sm"
              >
                {isTestingConnection ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Test"
                )}
              </Button>
            </div>
          </div>

          {availableModels && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Available Models</Label>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">Layout Models:</span>
                    <Badge variant="secondary" className="text-xs">
                      {availableModels.layout_models.length} available
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {availableModels.layout_models.map((model) => (
                      <Badge key={model} variant="outline" className="text-xs">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">OCR Models:</span>
                    <Badge variant="secondary" className="text-xs">
                      {availableModels.ocr_models.length} available
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {availableModels.ocr_models.map((model) => (
                      <Badge key={model} variant="outline" className="text-xs">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
