import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { NotesGrid } from "@/components/NotesGrid";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { TasksList } from "@/components/TasksList";
import { QuickAdd } from "@/components/QuickAdd";
import { FocusMode } from "@/components/FocusMode";
import { NoteViewer } from "@/components/NoteViewer";
import { indexedDBStorage } from "@/utils/indexedDBStorage";

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

  // Load data from IndexedDB on mount
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
        console.error('Error loading data from IndexedDB:', error);
        
        // Fallback to localStorage if IndexedDB fails
        const savedNotes = localStorage.getItem('noted-notes');
        const savedTasks = localStorage.getItem('noted-tasks');
        
        if (savedNotes) {
          try {
            const parsedNotes = JSON.parse(savedNotes).map((note: Note) => ({
              ...note,
              createdAt: new Date(note.createdAt)
            }));
            setNotes(parsedNotes);
          } catch (error) {
            console.error('Error loading notes from localStorage:', error);
          }
        }
        
        if (savedTasks) {
          try {
            const parsedTasks = JSON.parse(savedTasks).map((task: Task) => ({
              ...task,
              completedAt: task.completedAt ? new Date(task.completedAt) : undefined
            }));
            setTasks(parsedTasks);
          } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save notes to IndexedDB when notes change
  useEffect(() => {
    if (!isLoading) {
      indexedDBStorage.saveNotes(notes).catch(error => {
        console.error('Error saving notes to IndexedDB:', error);
        // Fallback to localStorage
        localStorage.setItem('noted-notes', JSON.stringify(notes));
      });
    }
  }, [notes, isLoading]);

  // Save tasks to IndexedDB when tasks change
  useEffect(() => {
    if (!isLoading) {
      indexedDBStorage.saveTasks(tasks).catch(error => {
        console.error('Error saving tasks to IndexedDB:', error);
        // Fallback to localStorage
        localStorage.setItem('noted-tasks', JSON.stringify(tasks));
      });
    }
  }, [tasks, isLoading]);

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
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const updateNote = (id: string, content: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  };

  const addTask = (content: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      content,
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined
          }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
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
      
      // If trying to pin and already have 3 pinned notes, don't allow
      if (!note.pinned && pinnedCount >= 3) {
        return prev;
      }
      
      return prev.map(n => 
        n.id === id ? { ...n, pinned: !n.pinned } : n
      );
    });
  };

  const handleViewNote = async (note: Note) => {
    if (note.evaluatedContent && note.evaluatedContent instanceof Promise) {
      console.log(note.evaluatedContent);
      setIsNoteViewerOpen(true);
    } else {
      setSelectedNote(note);
      setIsNoteViewerOpen(true);
    }
  };

  const completedToday = tasks.filter(task => {
    if (!task.completed || !task.completedAt) return false;
    const today = new Date();
    const completedDate = task.completedAt;
    return (
      today.getDate() === completedDate.getDate() &&
      today.getMonth() === completedDate.getMonth() &&
      today.getFullYear() === completedDate.getFullYear()
    );
  });

  if (focusMode) {
    return <FocusMode onExit={() => setFocusMode(false)} />;
  }

  // Sort notes to show pinned ones first
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-purple mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-900/20">
      {/* Fixed header on mobile, static on larger screens */}
      <Header 
        onFocusMode={() => setFocusMode(true)} 
        notes={notes}
        tasks={tasks}
      />
      
      {/* Main content with top padding only for mobile fixed header */}
      <div className="container mx-auto px-4 pt-20 sm:pt-6 pb-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            <QuickAdd onAddNote={addNote} onAddTask={addTask} />
            <NotesGrid 
              notes={sortedNotes} 
              onDeleteNote={deleteNote}
              onUpdateNote={updateNote}
              onConvertToTask={convertNoteToTask}
              onTogglePin={togglePinNote}
              onViewNote={handleViewNote}
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <PomodoroTimer />
            <TasksList 
              tasks={tasks}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onConvertToNote={convertTaskToNote}
              completedToday={completedToday}
            />
          </div>
        </div>
      </div>

      <NoteViewer
        note={selectedNote}
        isOpen={isNoteViewerOpen}
        onClose={() => setIsNoteViewerOpen(false)}
        onDelete={deleteNote}
        onUpdate={updateNote}
        onConvertToTask={convertNoteToTask}
        onTogglePin={togglePinNote}
      />
    </div>
  );
};

export default Index;
