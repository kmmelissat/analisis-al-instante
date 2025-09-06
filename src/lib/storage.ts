import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FileData {
  file_id: string;
  filename: string;
  columns: string[];
  data_types: Record<string, string>;
  shape: [number, number];
  summary_stats: Record<string, any>;
  sample_data: Record<string, any[]>;
  message: string;
}

interface FileStore {
  files: Record<string, FileData>;
  storeFile: (fileId: string, data: FileData) => void;
  getFile: (fileId: string) => FileData | null;
  hasFile: (fileId: string) => boolean;
  deleteFile: (fileId: string) => void;
  clearFiles: () => void;
  getFileIds: () => string[];
}

export const useFileStore = create<FileStore>()(
  persist(
    (set, get) => ({
      files: {},

      storeFile: (fileId: string, data: FileData) => {
        console.log(`[Zustand] Storing data for file ID: ${fileId}`);
        set((state) => ({
          files: {
            ...state.files,
            [fileId]: data,
          },
        }));
        console.log(
          `[Zustand] Total files stored: ${Object.keys(get().files).length}`
        );
      },

      getFile: (fileId: string) => {
        const file = get().files[fileId] || null;
        console.log(
          `[Zustand] Retrieving data for file ID: ${fileId}, found: ${!!file}`
        );
        if (!file) {
          console.log(
            `[Zustand] Available file IDs:`,
            Object.keys(get().files)
          );
        }
        return file;
      },

      hasFile: (fileId: string) => {
        return fileId in get().files;
      },

      deleteFile: (fileId: string) => {
        console.log(`[Zustand] Deleting data for file ID: ${fileId}`);
        set((state) => {
          const newFiles = { ...state.files };
          delete newFiles[fileId];
          return { files: newFiles };
        });
      },

      clearFiles: () => {
        console.log(`[Zustand] Clearing all stored data`);
        set({ files: {} });
      },

      getFileIds: () => {
        return Object.keys(get().files);
      },
    }),
    {
      name: "file-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
      partialize: (state) => ({ files: state.files }), // only persist the files
    }
  )
);

// Server-side storage for API routes (since Zustand with localStorage won't work on server)
class ServerFileStorage {
  private static instance: ServerFileStorage;
  private storage: Map<string, FileData>;

  private constructor() {
    this.storage = new Map();
  }

  public static getInstance(): ServerFileStorage {
    if (!ServerFileStorage.instance) {
      ServerFileStorage.instance = new ServerFileStorage();
    }
    return ServerFileStorage.instance;
  }

  public set(fileId: string, data: FileData): void {
    console.log(`[Server Storage] Storing data for file ID: ${fileId}`);
    this.storage.set(fileId, data);
    console.log(`[Server Storage] Total files stored: ${this.storage.size}`);
  }

  public get(fileId: string): FileData | null {
    const data = this.storage.get(fileId) || null;
    console.log(
      `[Server Storage] Retrieving data for file ID: ${fileId}, found: ${!!data}`
    );
    if (!data) {
      console.log(
        `[Server Storage] Available file IDs:`,
        Array.from(this.storage.keys())
      );
    }
    return data;
  }

  public has(fileId: string): boolean {
    return this.storage.has(fileId);
  }

  public delete(fileId: string): boolean {
    console.log(`[Server Storage] Deleting data for file ID: ${fileId}`);
    return this.storage.delete(fileId);
  }

  public keys(): string[] {
    return Array.from(this.storage.keys());
  }
}

// Export server storage instance for API routes
export const serverFileStorage = ServerFileStorage.getInstance();

// Helper functions for API routes
export function storeFileData(fileId: string, data: FileData): void {
  console.log(`[Storage Helper] Storing file ${fileId}`);
  serverFileStorage.set(fileId, data);
  console.log(
    `[Storage Helper] Storage now has ${serverFileStorage.keys().length} files`
  );
  console.log(`[Storage Helper] Available IDs:`, serverFileStorage.keys());
}

export function getFileData(fileId: string): FileData | null {
  return serverFileStorage.get(fileId);
}

export function hasFileData(fileId: string): boolean {
  return serverFileStorage.has(fileId);
}

export function deleteFileData(fileId: string): boolean {
  return serverFileStorage.delete(fileId);
}
