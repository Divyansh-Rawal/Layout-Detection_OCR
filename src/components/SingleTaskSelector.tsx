import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Search, Sparkles } from "lucide-react";

interface SingleTaskSelectorProps {
  selectedTasks: string[];
  onTaskChange: (tasks: string[]) => void;
}

const availableTasks = [
  {
    id: 'layout',
    name: 'Layout Detection',
    description: 'Detect document structure and regions',
    icon: Eye,
    model: 'docling_layout_v1',
    color: 'bg-blue-500/10 text-blue-600'
  },
  {
    id: 'ocr',
    name: 'OCR Processing',
    description: 'Extract text from document regions',
    icon: FileText,
    model: 'tesseract_default',
    color: 'bg-green-500/10 text-green-600'
  },
  {
    id: 'visualization',
    name: 'Visualization',
    description: 'Generate overlay images with detected regions',
    icon: Search,
    model: 'built-in',
    color: 'bg-purple-500/10 text-purple-600'
  }
];

export const SingleTaskSelector = ({ selectedTasks, onTaskChange }: SingleTaskSelectorProps) => {
  const handleTaskToggle = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      onTaskChange(selectedTasks.filter(id => id !== taskId));
    } else {
      onTaskChange([...selectedTasks, taskId]);
    }
  };

  return (
    <Card className="p-6 animate-slide-up">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <Label className="text-lg font-semibold">Select Processing Tasks</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose which tasks to perform on your documents
        </p>
        
        <div className="grid gap-3">
          {availableTasks.map((task) => {
            const Icon = task.icon;
            const isSelected = selectedTasks.includes(task.id);
            
            return (
              <div 
                key={task.id}
                className={`flex items-start space-x-3 p-4 border rounded-lg transition-all duration-200 ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <Checkbox
                  id={task.id}
                  checked={isSelected}
                  onCheckedChange={() => handleTaskToggle(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor={task.id} className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{task.name}</span>
                      <Badge variant="secondary" className={`text-xs ${task.color}`}>
                        {task.model}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  </Label>
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedTasks.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Select at least one task to proceed
          </div>
        )}
      </div>
    </Card>
  );
};
