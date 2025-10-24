import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Workflow, Zap } from "lucide-react";

interface ModeSelectorProps {
  selectedMode: 'pipeline' | 'single';
  onModeChange: (mode: 'pipeline' | 'single') => void;
}

export const ModeSelector = ({ selectedMode, onModeChange }: ModeSelectorProps) => {
  return (
    <Card className="p-6 animate-slide-up">
      <div className="space-y-4">
        <Label className="text-lg font-semibold flex items-center gap-2">
          <Workflow className="w-5 h-5 text-primary" />
          Processing Mode
        </Label>
        <p className="text-sm text-muted-foreground">
          Choose between full pipeline processing or individual stage processing
        </p>
        
        <RadioGroup
          value={selectedMode}
          onValueChange={(value: 'pipeline' | 'single') => onModeChange(value)}
          className="space-y-4"
        >
          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="pipeline" id="pipeline" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="pipeline" className="cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <Workflow className="w-4 h-4 text-primary" />
                  <span className="font-medium">Full Pipeline</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Complete processing: Upload → Tilt Correction → Layout Detection → OCR → Text Cleaning
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Layout Detection</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">OCR Processing</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Visualization</span>
                </div>
              </Label>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="single" id="single" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="single" className="cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-medium">Single Task</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Process individual stages: Choose specific tasks like Layout Detection only or OCR only
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">Selective Processing</span>
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">Faster Results</span>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>
    </Card>
  );
};
