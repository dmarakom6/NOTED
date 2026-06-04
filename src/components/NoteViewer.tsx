
import { useState, useEffect } from "react";
import { Note } from "@/pages/Index";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Pin, List, Trash2, Pencil, Clipboard, Check, Sparkles } from "lucide-react";
import { evaluateNoteContent } from "@/utils/noteEvaluator";
import { toast } from "@/hooks/use-toast";

interface NoteViewerProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string, evaluatedContent?: string | string[]) => void;
  onConvertToTask?: (noteContent: string, noteId: string) => void;
  onTogglePin?: (id: string) => void;
}

export const NoteViewer = ({ note, isOpen, onClose, onDelete, onUpdate, onConvertToTask, onTogglePin }: NoteViewerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (note) {
      setEditContent(note.content);
    }
    setIsEditing(false);
  }, [note, isOpen]);

  if (!note) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content);
    setIsCopied(true);
    toast({ description: "Copied to clipboard" });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = async () => {
    const trimmed = editContent.trim();
    if (trimmed === note.content) {
      setIsEditing(false);
      return;
    }

    try {
      if (note.evaluatedContent) {
        const evaluated = await evaluateNoteContent(trimmed, note.color);
        onUpdate(note.id, trimmed, evaluated);
        toast({ title: "Note Updated", description: "Smart content re-evaluated." });
      } else {
        onUpdate(note.id, trimmed);
      }
      setIsEditing(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update note", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] p-0 overflow-hidden glass-strong border-white/20 shadow-2xl animate-scale-in">
        <DialogHeader className="p-4 sm:p-6 border-b border-white/10 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: note.color }} />
            <DialogTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {note.createdAt.toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </DialogTitle>
          </div>
          <div className="flex items-center space-x-1">
            <Button size="icon" variant="ghost" onClick={handleCopy} className="h-8 w-8">
              {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setIsEditing(!isEditing)} className={`h-8 w-8 ${isEditing ? 'text-primary' : ''}`}>
              <Pencil className="h-4 w-4" />
            </Button>
            {onTogglePin && (
              <Button size="icon" variant="ghost" onClick={() => onTogglePin(note.id)} className={`h-8 w-8 ${note.pinned ? 'text-yellow-500' : ''}`}>
                <Pin className="h-4 w-4" fill={note.pinned ? "currentColor" : "none"} />
              </Button>
            )}
            <Button size="icon" variant="ghost" onClick={() => onDelete(note.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[60vh] scrollbar-thin">
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[300px] glass bg-white/5 border-white/10 resize-none focus-visible:ring-primary/30"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave} className="font-bold">Save Changes</Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {note.evaluatedContent ? (
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-primary/20 rounded-full" />
                  <div 
                    dangerouslySetInnerHTML={{ __html: note.evaluatedContent instanceof Array ? note.evaluatedContent[0] : note.evaluatedContent }} 
                    className="whitespace-pre-wrap break-words leading-relaxed"
                  />
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-[10px] text-primary/40 font-bold uppercase tracking-tighter">
                    <Sparkles className="w-3 h-3 mr-1" /> Smart Note
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{note.content}</p>
              )}
            </div>
          )}
        </div>

        {!isEditing && onConvertToTask && (
          <div className="p-4 bg-primary/5 border-t border-white/5 flex justify-center">
            <Button variant="ghost" size="sm" onClick={() => { onConvertToTask(note.content, note.id); onClose(); }} className="text-xs font-bold text-primary hover:bg-primary/10">
              <List className="w-3.5 h-3.5 mr-2" />
              Convert to Task
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
