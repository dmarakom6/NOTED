
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Zap, StickyNote, CheckSquare } from "lucide-react";
import { evaluateNoteContent } from "@/utils/noteEvaluator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuickAddProps {
  onAddNote: (content: string, color?: string, evaluatedContent?: string | string[]) => void;
  onAddTask: (content: string) => void;
  activeColor: string;
  onColorChange: (color: string) => void;
}

const colors = [
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
];

export const QuickAdd = ({ onAddNote, onAddTask, activeColor, onColorChange }: QuickAddProps) => {
  const [content, setContent] = useState("");
  const [mode, setMode] = useState<'Note' | 'Task'>('Note');
  const [evaluateMode, setEvaluateMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (mode === 'Note') {
      if (evaluateMode) {
        const evaluatedContent = await evaluateNoteContent(content.trim(), activeColor);
        onAddNote(content.trim(), activeColor, evaluatedContent);
      } else {
        onAddNote(content.trim(), activeColor);
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
      e.preventDefault();
    }
  };

  return (
    <div className="glass-strong rounded-2xl p-5 border border-white/20 shadow-xl animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'Note' | 'Task')} className="w-auto">
            <TabsList className="bg-muted/50 p-1 h-9">
              <TabsTrigger value="Note" className="text-xs px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <StickyNote className="w-3.5 h-3.5 mr-1.5" />
                Note
              </TabsTrigger>
              <TabsTrigger value="Task" className="text-xs px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <CheckSquare className="w-3.5 h-3.5 mr-1.5" />
                Task
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === 'Note' && (
            <div className="flex items-center space-x-1.5">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onColorChange(color)}
                  className={`w-5 h-5 rounded-full transition-all duration-200 border border-black/5 dark:border-white/10 ${
                    activeColor === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'Note' ? "What's on your mind?" : "What needs to be done?"}
            className="glass bg-white/5 dark:bg-black/5 border-white/10 resize-none min-h-[100px] text-sm focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {mode === 'Note' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEvaluateMode(!evaluateMode)}
                className={`text-xs h-9 px-3 transition-colors ${
                  evaluateMode ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'text-muted-foreground'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 mr-1.5 ${evaluateMode ? 'fill-primary' : ''}`} />
                Evaluate
              </Button>
            )}
            <span className="hidden sm:inline text-[10px] uppercase tracking-wide text-muted-foreground/60 font-bold">
              Ctrl+Enter to save
            </span>
          </div>

          <Button
            type="submit"
            disabled={!content.trim()}
            className="h-9 px-5 text-xs font-bold shadow-lg shadow-primary/20"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Create {mode}
          </Button>
        </div>
      </form>
    </div>
  );
};
