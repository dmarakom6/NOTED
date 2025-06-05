
import { Note } from "@/pages/Index";
import { NoteCard } from "./NoteCard";

interface NotesGridProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, content: string) => void;
  onConvertToTask: (noteContent: string, noteId: string) => void;
  onTogglePin: (id: string) => void;
  onViewNote: (note: Note) => void;
}

export const NotesGrid = ({ notes, onDeleteNote, onUpdateNote, onConvertToTask, onTogglePin, onViewNote }: NotesGridProps) => {
  if (notes.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center animate-fade-in">
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 rounded-2xl flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-blue rounded-xl opacity-50"></div>
          </div>
          <h3 className="text-xl font-semibold text-muted-foreground">No notes yet</h3>
          <p className="text-muted-foreground">Create your first note to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
            animationDelay: `${index * 0.1}s`
          }}
          className="animate-scale-in"
        />
      ))}
    </div>
  );
};
