
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Zap } from "lucide-react";
import { evaluateNoteContent } from "@/utils/noteEvaluator";

interface QuickAddProps {
  onAddNote: (content: string, color?: string, evaluatedContent?: string | string[]) => void;
  onAddTask: (content: string) => void;
}

const colors = [
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
];

export const QuickAdd = ({ onAddNote, onAddTask }: QuickAddProps) => {
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [mode, setMode] = useState<'Note' | 'Task'>('Note');
  const [evaluateMode, setEvaluateMode] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (mode === 'Note') {
      if (evaluateMode) {
        const evaluatedContent = await evaluateNoteContent(content.trim(), selectedColor);
        onAddNote(content.trim(), selectedColor, evaluatedContent);
      } else {
        onAddNote(content.trim(), selectedColor);
      }
    } else {
      onAddTask(content.trim());
    }

    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }

    if (e.key === 'e' && (e.ctrlKey || e.metaKey)) {
      setEvaluateMode(!evaluateMode);
      e.preventDefault(); // Prevent default backspace behavior
    }
  };

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quick Add</h2>
          <div className="flex rounded-lg bg-muted/20 p-1">
            <Button
              type="button"
              variant={mode === 'Note' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMode('Note')}
              className="text-xs"
            >
              Note
            </Button>
            <Button
              type="button"
              variant={mode === 'Task' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMode('Task')}
              className="text-xs"
            >
              Task
            </Button>
          </div>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={mode === 'Note' ? "What's on your mind?" : "What needs to be done?"}
          className="glass border-white/20 resize-none min-h-[80px] focus:neon-glow transition-all duration-300"
        />

        {mode === 'Note' && (
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full transition-all duration-200 ${selectedColor === color ? 'ring-2 ring-white/50 scale-110' : 'hover:scale-105'
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex flex-row items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEvaluateMode(!evaluateMode)}
                className={`glass text-xs transition-all duration-300 ease-in-out transform ${evaluateMode
                  ? 'evaluate-active'
                  : 'evaluate-inactive'
                  }`}
              >
                <Zap className={`w-3 h-3 mr-1 transition-transform duration-300 ${evaluateMode ? 'animate-pulse' : ''}`} />
                Evaluate
              </Button>

              <Button
                type="submit"
                disabled={!content.trim()}
                className="bg-gradient-to-r from-neon-purple to-neon-blue hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {mode}
              </Button>
            </div>
          </div>
        )}

        {mode === 'Task' && (
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!content.trim()}
              className="bg-gradient-to-r from-neon-purple to-neon-blue hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Press Ctrl+Enter to quickly add
        </p>
      </form>
    </div>
  );
};
