
import { useState } from "react";
import { Note } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash, List, Pin, MoreHorizontal, Pencil, Check, X } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onConvertToTask?: (noteContent: string, noteId: string) => void;
  onTogglePin?: (id: string) => void;
  onViewNote?: (note: Note) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const NoteCard = ({ note, onDelete, onUpdate, onConvertToTask, onTogglePin, onViewNote, className, style }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);

  const handleSave = () => {
    if (editContent.trim() !== note.content) {
      onUpdate(note.id, editContent.trim());
    }
    setIsEditing(false);
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
    <div
      className={`group relative glass rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5 border border-white/10 dark:border-white/5 ${note.pinned ? 'ring-1 ring-yellow-400/30 bg-yellow-400/5' : ''} ${className}`}
      style={{
        borderLeft: `3px solid ${note.color}`,
        ...style
      }}
    >
      {/* Pin Icon */}
      {note.pinned && (
        <div className="absolute top-2 right-2">
          <Pin className="h-3 w-3 text-yellow-500 fill-yellow-500" />
        </div>
      )}

      <div className="space-y-3">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[100px] text-sm glass bg-white/5"
              autoFocus
            />
            <div className="flex justify-end space-x-1">
              <Button size="icon" variant="ghost" onClick={handleCancel} className="h-7 w-7 text-muted-foreground">
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleSave} className="h-7 w-7 text-primary">
                <Check className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div 
              className="text-sm leading-relaxed cursor-pointer break-words"
              onClick={() => onViewNote?.(note)}
            >
              <div className="max-h-[150px] overflow-hidden overflow-y-auto scrollbar-thin pr-1">
                {note.evaluatedContent ? (
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: note.evaluatedContent instanceof Array ? note.evaluatedContent[0] : note.evaluatedContent }} 
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{note.content}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">
                {note.createdAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>

              <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {onTogglePin && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onTogglePin(note.id)}
                    className={`h-7 w-7 ${note.pinned ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`}
                  >
                    <Pin className="h-3.5 w-3.5" fill={note.pinned ? "currentColor" : "none"} />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                {onConvertToTask && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onConvertToTask(note.content, note.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-green-500"
                  >
                    <List className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(note.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Mobile menu */}
              <div className="sm:hidden group-hover:hidden">
                 <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground/40" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
