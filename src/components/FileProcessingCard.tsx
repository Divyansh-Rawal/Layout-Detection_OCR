import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Play, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProcessingStage } from "./ProcessingStages";

interface FileProcessingCardProps {
  file: File;
  index: number;
  onProcess: (file: File, tasks: string[]) => Promise<void>;
  processingMode: 'pipeline' | 'single';
  selectedTasks: string[];
}

export const FileProcessingCard = ({ 
  file, 
  index, 
  onProcess, 
  processingMode, 
  selectedTasks 
}: FileProcessingCardProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<ProcessingStage>("upload");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleProcess = async () => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    try {
      await onProcess(file, processingMode === 'pipeline' ? ['layout', 'ocr', 'visualization'] : selectedTasks);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewResults = () => {
    navigate(`/results/${index}`);
  };

  const getFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-5 h-5 text-destructive" />;
    if (progress === 100) return <CheckCircle2 className="w-5 h-5 text-success" />;
    if (isProcessing) return <Clock className="w-5 h-5 text-primary animate-spin" />;
    return <FileText className="w-5 h-5 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (error) return "Failed";
    if (progress === 100) return "Complete";
    if (isProcessing) return `Processing (${currentStage})`;
    return "Ready";
  };

  const getStatusColor = () => {
    if (error) return "text-destructive";
    if (progress === 100) return "text-success";
    if (isProcessing) return "text-primary";
    return "text-muted-foreground";
  };

  return (
    <Card className="p-4 transition-all duration-200 hover:shadow-md">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {getStatusIcon()}
            <div className="min-w-0 flex-1">
              <h4 className="font-medium truncate">{file.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {getFileSize(file.size)}
                </span>
                <Badge variant="outline" className="text-xs">
                  {file.type.split('/')[1].toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground capitalize">
              {currentStage.replace('-', ' ')}
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          {!isProcessing && progress !== 100 && (
            <Button
              onClick={handleProcess}
              disabled={processingMode === 'single' && selectedTasks.length === 0}
              size="sm"
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Process
            </Button>
          )}
          
          {progress === 100 && (
            <Button
              onClick={handleViewResults}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              View Results
            </Button>
          )}
          
          {error && (
            <Button
              onClick={handleProcess}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
