
import { useState } from "react";
import { Note } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash, List, Pin, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

  const handleConvertToTask = () => {
    if (onConvertToTask) {
      onConvertToTask(note.content, note.id);
    }
  };

  const handleTogglePin = () => {
    if (onTogglePin) {
      onTogglePin(note.id);
    }
  };

  const handleViewNote = () => {
    if (onViewNote && !isEditing) {
      onViewNote(note);
    }
  };

  const handleDoubleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div
      className={`glass-strong rounded-2xl p-4 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden ${className} ${note.pinned ? 'ring-2 ring-yellow-400/50' : ''}`}
      style={{
        borderLeft: `4px solid ${note.color}`,
        ...style
      }}
    >
      {/* Subtle glow effect */}
      <div 
        className="absolute inset-0 opacity-5 rounded-2xl"
        style={{ backgroundColor: note.color }}
      />
      
      {/* Pin indicator */}
      {note.pinned && (
        <div className="absolute top-2 right-2">
          <Pin className="h-4 w-4 text-yellow-400" fill="currentColor" />
        </div>
      )}
      
      <div className="relative z-10">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="glass border-white/20 resize-none min-h-[100px]"
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
          <>
            <div
              className="whitespace-pre-wrap text-sm leading-relaxed cursor-pointer hover:text-foreground/80 transition-colors break-words overflow-hidden"
              style={{ 
                maxHeight: '200px',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                overflowY: 'scroll'
              }}
              onClick={handleViewNote}
              onDoubleClick={handleDoubleClick}
            >
              <div className="pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {note.evaluatedContent ? (
                  <div dangerouslySetInnerHTML={{ __html: note.evaluatedContent }} />
                ) : (
                  note.content
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
              <span className="text-xs text-muted-foreground">
                {note.createdAt.toLocaleDateString()}
              </span>
              
              {/* Desktop buttons - hidden on mobile */}
              <div className="hidden sm:flex space-x-1">
                {onTogglePin && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleTogglePin}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-yellow-500/20 hover:text-yellow-400`}
                    title={note.pinned ? "Unpin note" : "Pin note"}
                  >
                    <Pin className="h-3 w-3" fill={note.pinned ? "currentColor" : "none"} />
                  </Button>
                )}
                {onConvertToTask && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleConvertToTask}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-green-500/20 hover:text-green-400"
                    title="Convert to task"
                  >
                    <List className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>

              {/* Mobile dropdown menu */}
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass">
                    {onTogglePin && (
                      <DropdownMenuItem onClick={handleTogglePin} className="text-yellow-400">
                        <Pin className="h-4 w-4 mr-2" fill={note.pinned ? "currentColor" : "none"} />
                        {note.pinned ? "Unpin note" : "Pin note"}
                      </DropdownMenuItem>
                    )}
                    {onConvertToTask && (
                      <DropdownMenuItem onClick={handleConvertToTask} className="text-green-400">
                        <List className="h-4 w-4 mr-2" />
                        Convert to task
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(note.id)} className="text-destructive">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete note
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
