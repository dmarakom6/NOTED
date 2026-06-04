
import { Note, Task } from "@/pages/Index";

const DB_NAME = 'NotedApp';
const DB_VERSION = 1;
const NOTES_STORE = 'notes';
const TASKS_STORE = 'tasks';

class IndexedDBStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(NOTES_STORE)) {
          const notesStore = db.createObjectStore(NOTES_STORE, { keyPath: 'id' });
          notesStore.createIndex('createdAt', 'createdAt', { unique: false });
          notesStore.createIndex('pinned', 'pinned', { unique: false });
        }

        if (!db.objectStoreNames.contains(TASKS_STORE)) {
          const tasksStore = db.createObjectStore(TASKS_STORE, { keyPath: 'id' });
          tasksStore.createIndex('completed', 'completed', { unique: false });
          tasksStore.createIndex('completedAt', 'completedAt', { unique: false });
        }
      };
    });
  }

  private async ensureDb(): Promise<IDBDatabase> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error("Could not initialize database");
    return this.db;
  }

  async saveNotes(notes: Note[]): Promise<void> {
    const db = await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([NOTES_STORE], 'readwrite');
      const store = transaction.objectStore(NOTES_STORE);
      store.clear();
      notes.forEach(note => {
        store.add({
          ...note,
          createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : note.createdAt
        });
      });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async saveNote(note: Note): Promise<void> {
    const db = await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([NOTES_STORE], 'readwrite');
      const store = transaction.objectStore(NOTES_STORE);
      const request = store.put({
        ...note,
        createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : note.createdAt
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteNote(id: string): Promise<void> {
    const db = await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([NOTES_STORE], 'readwrite');
      const store = transaction.objectStore(NOTES_STORE);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async loadNotes(): Promise<Note[]> {
    const db = await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([NOTES_STORE], 'readonly');
      const store = transaction.objectStore(NOTES_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const notes = request.result.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
        resolve(notes);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    const db = await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TASKS_STORE], 'readwrite');
      const store = transaction.objectStore(TASKS_STORE);
      store.clear();
      tasks.forEach(task => {
        store.add({
          ...task,
          completedAt: task.completedAt instanceof Date ? task.completedAt.toISOString() : task.completedAt
        });
      });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async saveTask(task: Task): Promise<void> {
    const db = await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TASKS_STORE], 'readwrite');
      const store = transaction.objectStore(TASKS_STORE);
      const request = store.put({
        ...task,
        completedAt: task.completedAt instanceof Date ? task.completedAt.toISOString() : task.completedAt
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTask(id: string): Promise<void> {
    const db = await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TASKS_STORE], 'readwrite');
      const store = transaction.objectStore(TASKS_STORE);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async loadTasks(): Promise<Task[]> {
    const db = await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TASKS_STORE], 'readonly');
      const store = transaction.objectStore(TASKS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const tasks = request.result.map((task: any) => ({
          ...task,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        }));
        resolve(tasks);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData(): Promise<void> {
    const db = await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([NOTES_STORE, TASKS_STORE], 'readwrite');
      transaction.objectStore(NOTES_STORE).clear();
      transaction.objectStore(TASKS_STORE).clear();
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const indexedDBStorage = new IndexedDBStorage();
