
import { useState } from "react";
import { Note } from "@/pages/Index";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Pin, List, Trash, Pencil, Clipboard, ClipboardCheck } from "lucide-react";
import { set } from "date-fns";
import { evaluateNoteContent } from "@/utils/noteEvaluator";
import { toast } from "@/hooks/use-toast";
import { indexedDBStorage } from "@/utils/indexedDBStorage";

interface NoteViewerProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onConvertToTask?: (noteContent: string, noteId: string) => void;
  onTogglePin?: (id: string) => void;
}

export const NoteViewer = ({ note, isOpen, onClose, onDelete, onUpdate, onConvertToTask, onTogglePin }: NoteViewerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  if (!note) return null;

  const handleDelete = () => {
    onDelete(note.id);
    onClose();
  };

  const handleConvertToTask = () => {
    if (onConvertToTask) {
      onConvertToTask(note.content, note.id);
      onClose();
    }
  };

  const handleTogglePin = () => {
    if (onTogglePin) {
      onTogglePin(note.id);
    }
  };

  const handleCopy = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(note.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000); // Reset after a sec
    }
  }

  const handleEdit = () => {
    setEditContent(note.content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!note.evaluatedContent) {
    const trimmedContent = editContent.trim();
    if (trimmedContent !== note.content) {
      onUpdate(note.id, trimmedContent);
    }
  } else {
    // save it as a new note, evaluate it and remove the old one
    const trimmedContent = editContent.trim();
    evaluateNoteContent(trimmedContent, note.color).then((evaluatedContent) => {
      if (evaluatedContent !== note.evaluatedContent) {
        indexedDBStorage.saveNote({
          ...note,
          content: trimmedContent,
          evaluatedContent: evaluatedContent,
          createdAt: new Date(), // Update createdAt to current time
          pinned: note.pinned // Preserve pinned state
        });
        toast({
          title: "Note updated",
          description: "Your evaluated note has been updated successfully.",
          variant: "evaluation",
        });
        setTimeout(() => window.location.reload(), 2000);
      }
    }).catch((error) => {
      console.error("Error evaluating note content:", error);
      toast({
        title: "Error",
        description: "Failed to evaluate note content. Please try again.",
        variant: "destructive",
      });
    });
  }
    onClose();
  };

  const handleCancel = () => {
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 overflow-hidden glass-strong">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: note.color }}
            />
            <span className="text-sm text-muted-foreground">
              {note.createdAt.toLocaleDateString()}
            </span>
            {note.pinned && (
              <Pin className="h-4 w-4 text-yellow-400" fill="currentColor" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* COPY TO CLIPBOARD */}
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCopy}
                className="h-8 w-8 hover:bg-blue-500/20 hover:text-blue-400"
                title="Edit note"
              >
                {isCopied ? <ClipboardCheck className="h-4 w-4 text-lime-500" /> : <Clipboard className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleEdit}
              className="h-8 w-8 hover:bg-blue-500/20 hover:text-blue-400"
              title="Edit note"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            {onTogglePin && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleTogglePin}
                className={`h-8 w-8 hover:bg-yellow-500/20 hover:text-yellow-400 ${note.pinned ? 'text-yellow-400' : ''}`}
                title={note.pinned ? "Unpin note" : "Pin note"}
              >
                <Pin className="h-4 w-4" fill={note.pinned ? "currentColor" : "none"} />
              </Button>
            )}
            {onConvertToTask && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleConvertToTask}
                className="h-8 w-8 hover:bg-blue-500/20 hover:text-blue-400"
                title="Convert to task"
              >
                <List className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
              title="Delete note"
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6" style={{ maxHeight: '60vh', overflowY: 'scroll' }}>
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="glass border-white/20 resize-none min-h-[200px]"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="glass"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-gradient-to-r from-neon-purple to-neon-blue"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              {note.evaluatedContent ? (
                <div
                  dangerouslySetInnerHTML={{ __html: (note.evaluatedContent instanceof Array ? note.evaluatedContent[1] : note.evaluatedContent) }}
                  className="whitespace-pre-wrap break-words text-sm leading-relaxed"
                />
              ) : (
                <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {note.content}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
