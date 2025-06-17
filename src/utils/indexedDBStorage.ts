
import { Note, Task } from "@/pages/Index";

const DB_NAME = 'NotedApp';
const DB_VERSION = 1;
const NOTES_STORE = 'notes';
const TASKS_STORE = 'tasks';

class IndexedDBStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create notes store
        if (!db.objectStoreNames.contains(NOTES_STORE)) {
          const notesStore = db.createObjectStore(NOTES_STORE, { keyPath: 'id' });
          notesStore.createIndex('createdAt', 'createdAt', { unique: false });
          notesStore.createIndex('pinned', 'pinned', { unique: false });
        }

        // Create tasks store
        if (!db.objectStoreNames.contains(TASKS_STORE)) {
          const tasksStore = db.createObjectStore(TASKS_STORE, { keyPath: 'id' });
          tasksStore.createIndex('completed', 'completed', { unique: false });
          tasksStore.createIndex('completedAt', 'completedAt', { unique: false });
        }
      };
    });
  }

  async saveNotes(notes: Note[]): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([NOTES_STORE], 'readwrite');
      const store = transaction.objectStore(NOTES_STORE);
      
      // Clear existing notes
      store.clear();
      
      // Add all notes
      notes.forEach(note => {
        store.add({
          ...note,
          // createdAt: note.createdAt.toISOString()
        });
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async saveNote(note: Note): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([NOTES_STORE], 'readwrite');
      const store = transaction.objectStore(NOTES_STORE);
      const request = store.put({
        ...note,
        createdAt: note.createdAt.toISOString()
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async loadNotes(): Promise<Note[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([NOTES_STORE], 'readonly');
      const store = transaction.objectStore(NOTES_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const notes = request.result.map((note: Note) => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
        resolve(notes);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TASKS_STORE], 'readwrite');
      const store = transaction.objectStore(TASKS_STORE);
      
      // Clear existing tasks
      store.clear();
      
      // Add all tasks
      tasks.forEach(task => {
        store.add({
          ...task,
          // completedAt: task.completedAt ? task.completedAt.toISOString() : undefined
        });
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async loadTasks(): Promise<Task[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TASKS_STORE], 'readonly');
      const store = transaction.objectStore(TASKS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const tasks = request.result.map((task: Task) => ({
          ...task,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        }));
        resolve(tasks);
      };

      request.onerror = () => reject(request.error);
    });
  }



  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([NOTES_STORE, TASKS_STORE], 'readwrite');
      const notesStore = transaction.objectStore(NOTES_STORE);
      const tasksStore = transaction.objectStore(TASKS_STORE);

      const notesClearRequest = notesStore.clear();
      const tasksClearRequest = tasksStore.clear();

      notesClearRequest.onsuccess = () => {
        tasksClearRequest.onsuccess = () => resolve();
      };

      notesClearRequest.onerror = () => reject(notesClearRequest.error);
      tasksClearRequest.onerror = () => reject(tasksClearRequest.error);
    });
  }

  async importData(notes: Note[], tasks: Task[]): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([NOTES_STORE, TASKS_STORE], 'readwrite');
      const notesStore = transaction.objectStore(NOTES_STORE);
      const tasksStore = transaction.objectStore(TASKS_STORE);

      // Add new notes
      notes.forEach(note => {
        notesStore.add({
          ...note,
          createdAt: note.createdAt.toISOString()
        });
      });

      // Add new tasks
      tasks.forEach(task => {
        tasksStore.add({
          ...task,
          completedAt: task.completedAt ? task.completedAt.toISOString() : undefined
        });
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }


}

export const indexedDBStorage = new IndexedDBStorage();
