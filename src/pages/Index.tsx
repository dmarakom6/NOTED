
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { NotesGrid } from "@/components/NotesGrid";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { TasksList } from "@/components/TasksList";
import { QuickAdd } from "@/components/QuickAdd";
import { FocusMode } from "@/components/FocusMode";
import { NoteViewer } from "@/components/NoteViewer";
import { indexedDBStorage } from "@/utils/indexedDBStorage";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Columns } from "lucide-react";

export interface Note {
  id: string;
  content: string;
  evaluatedContent?: string | string[];
  createdAt: Date;
  color: string;
  pinned?: boolean;
}

export interface Task {
  id: string;
  content: string;
  completed: boolean;
  completedAt?: Date;
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusMode, setFocusMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isNoteViewerOpen, setIsNoteViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [focusTime, setFocusTime] = useState(0);
  const [activeColor, setActiveColor] = useState("#8B5CF6");
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'masonry'>('masonry');

  // Dynamic accent color effect
  useEffect(() => {
    const colorToApply = selectedNote ? selectedNote.color : activeColor;
    document.documentElement.style.setProperty('--primary', colorToApply);
    document.documentElement.style.setProperty('--ring', colorToApply);
  }, [selectedNote, activeColor]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (focusMode) {
      timer = setInterval(() => {
        setFocusTime((prev) => prev + 1);
      }, 1000);
    } else {
      setFocusTime(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [focusMode]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await indexedDBStorage.init();
        const [loadedNotes, loadedTasks] = await Promise.all([
          indexedDBStorage.loadNotes(),
          indexedDBStorage.loadTasks()
        ]);
        setNotes(loadedNotes);
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addNote = (content: string, color: string = '#8B5CF6', evaluatedContent?: string | string[]) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      evaluatedContent,
      createdAt: new Date(),
      color,
      pinned: false
    };
    setNotes(prev => [newNote, ...prev]);
    indexedDBStorage.saveNote(newNote).catch(console.error);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    indexedDBStorage.deleteNote(id).catch(console.error);
  };

  const updateNote = (id: string, content: string, evaluatedContent?: string | string[]) => {
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        const updated = { ...note, content, evaluatedContent };
        indexedDBStorage.saveNote(updated).catch(console.error);
        if (selectedNote?.id === id) setSelectedNote(updated);
        return updated;
      }
      return note;
    }));
  };

  const addTask = (content: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      content,
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
    indexedDBStorage.saveTask(newTask).catch(console.error);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updated = {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date() : undefined
        };
        indexedDBStorage.saveTask(updated).catch(console.error);
        return updated;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    indexedDBStorage.deleteTask(id).catch(console.error);
  };

  const convertNoteToTask = (noteContent: string, noteId: string) => {
    addTask(noteContent);
    deleteNote(noteId);
  };

  const convertTaskToNote = (taskContent: string, taskId: string) => {
    addNote(taskContent);
    deleteTask(taskId);
  };

  const togglePinNote = (id: string) => {
    setNotes(prev => {
      const note = prev.find(n => n.id === id);
      if (!note) return prev;
      const pinnedCount = prev.filter(n => n.pinned).length;
      if (!note.pinned && pinnedCount >= 6) {
        toast({ title: "Limit reached", description: "You can pin up to 6 notes.", variant: "destructive" });
        return prev;
      }
      return prev.map(n => {
        if (n.id === id) {
          const updated = { ...n, pinned: !n.pinned };
          indexedDBStorage.saveNote(updated).catch(console.error);
          return updated;
        }
        return n;
      });
    });
  };

  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setIsNoteViewerOpen(true);
  };

  if (focusMode) {
    return (
      <FocusMode 
        onExit={() => {
          const sessionTime = focusTime;
          setFocusMode(false);
          if (sessionTime / 60 >= 5) {
            toast({
              title: "Session Complete",
              description: `You focused for ${Math.floor(sessionTime / 60)} minutes. Great work!`,
            });
          } else {
            toast({
              title: "Session Ended Early",
              description: "Every minute counts. Try aiming for 25 minutes next time!",
              variant: "destructive",
            });
          }
        }} 
      />
    );
  }

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const completedToday = tasks.filter(task => {
    if (!task.completed || !task.completedAt) return false;
    const today = new Date();
    const completedDate = new Date(task.completedAt);
    return today.toDateString() === completedDate.toDateString();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Loading Noted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onFocusMode={() => setFocusMode(true)}
        notes={notes}
        tasks={tasks}
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Left - Stats/Timer */}
          <div className="lg:col-span-3 space-y-6 hidden lg:block">
            <PomodoroTimer />
          </div>

          {/* Center Content - Notes */}
          <div className="lg:col-span-6 space-y-8">
            <QuickAdd 
              onAddNote={addNote} 
              onAddTask={addTask} 
              activeColor={activeColor}
              onColorChange={setActiveColor}
            />
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-3">
                   <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Your Workspace</h2>
                   <div className="flex bg-muted/50 p-1 rounded-lg border border-white/5">
                      <Button 
                        variant="ghost"
                        size="icon" 
                        className={`h-6 w-6 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                      >
                        <LayoutGrid className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost"
                        size="icon" 
                        className={`h-6 w-6 rounded-md transition-all ${viewMode === 'masonry' ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setViewMode('masonry')}
                        title="Masonry View"
                      >
                        <Columns className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost"
                        size="icon" 
                        className={`h-6 w-6 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setViewMode('list')}
                        title="List View"
                      >
                        <List className="w-3 h-3" />
                      </Button>
                   </div>
                </div>
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{notes.length} Notes</span>
              </div>
              <NotesGrid
                notes={sortedNotes}
                onDeleteNote={deleteNote}
                onUpdateNote={updateNote}
                onConvertToTask={convertNoteToTask}
                onTogglePin={togglePinNote}
                onViewNote={handleViewNote}
                viewMode={viewMode}
              />
            </div>
          </div>

          {/* Sidebar Right - Tasks & Mobile Timer */}
          <div className="lg:col-span-3 space-y-6">
            <div className="lg:hidden">
              <PomodoroTimer />
            </div>
            <TasksList
              tasks={tasks}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onConvertToNote={convertTaskToNote}
              completedToday={completedToday}
            />
          </div>
        </div>
      </main>

      <NoteViewer
        note={selectedNote}
        isOpen={isNoteViewerOpen}
        onClose={() => {setIsNoteViewerOpen(false); setSelectedNote(null); }}
        onDelete={deleteNote}
        onUpdate={updateNote}
        onConvertToTask={convertNoteToTask}
        onTogglePin={togglePinNote}
      />
    </div>
  );
};

export default Index;
