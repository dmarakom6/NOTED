
import { Note } from "@/pages/Index";
import { NoteCard } from "./NoteCard";
import { StickyNote } from "lucide-react";

interface NotesGridProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, content: string, evaluatedContent?: string | string[]) => void;
  onConvertToTask: (noteContent: string, noteId: string) => void;
  onTogglePin: (id: string) => void;
  onViewNote: (note: Note) => void;
  viewMode?: 'grid' | 'list' | 'masonry';
}

export const NotesGrid = ({ notes, onDeleteNote, onUpdateNote, onConvertToTask, onTogglePin, onViewNote, viewMode = 'grid' }: NotesGridProps) => {
  if (notes.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-16 text-center animate-fade-in border border-white/10">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-3xl flex items-center justify-center">
            <StickyNote className="w-10 h-10 text-primary opacity-40" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold">Workspace is empty</h3>
            <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">Your ideas deserve a place. Start by adding a note.</p>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
      return (
        <div className="flex flex-col space-y-4">
          {notes.map((note, index) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={onDeleteNote}
              onUpdate={onUpdateNote}
              onConvertToTask={onConvertToTask}
              onTogglePin={onTogglePin}
              onViewNote={onViewNote}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.03}s` }}
            />
          ))}
        </div>
      );
  }

  if (viewMode === 'masonry') {
      return (
        <div className="columns-1 md:columns-2 gap-4 space-y-4">
          {notes.map((note, index) => (
            <div key={note.id} className="break-inside-avoid mb-4">
                <NoteCard
                    note={note}
                    onDelete={onDeleteNote}
                    onUpdate={onUpdateNote}
                    onConvertToTask={onConvertToTask}
                    onTogglePin={onTogglePin}
                    onViewNote={onViewNote}
                    className="animate-scale-in h-auto"
                    style={{ animationDelay: `${index * 0.03}s` }}
                />
            </div>
          ))}
        </div>
      );
  }

  // Default Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {notes.map((note, index) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDeleteNote}
          onUpdate={onUpdateNote}
          onConvertToTask={onConvertToTask}
          onTogglePin={onTogglePin}
          onViewNote={onViewNote}
          style={{
            animationDelay: `${index * 0.05}s`
          }}
          className="animate-scale-in"
        />
      ))}
    </div>
  );
};
