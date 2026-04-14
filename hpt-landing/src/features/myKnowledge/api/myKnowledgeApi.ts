import {
  KnowledgeFolder,
  KnowledgeItem,
  CreateKnowledgeFolderInput,
  CreateKnowledgeItemInput,
  UpdateKnowledgeItemInput,
} from '../types';
import { mockFolders, mockKnowledgeItems } from '../mockData';

const FOLDERS_KEY = 'myKnowledge_folders';
const ITEMS_KEY = 'myKnowledge_items';

const loadFolders = (): KnowledgeFolder[] => {
  try {
    const saved = localStorage.getItem(FOLDERS_KEY);
    return saved ? JSON.parse(saved) : [...mockFolders];
  } catch {
    return [...mockFolders];
  }
};

const loadItems = (): KnowledgeItem[] => {
  try {
    const saved = localStorage.getItem(ITEMS_KEY);
    return saved ? JSON.parse(saved) : [...mockKnowledgeItems];
  } catch {
    return [...mockKnowledgeItems];
  }
};

const saveFolders = (data: KnowledgeFolder[]): void => {
  try {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(data));
  } catch {
    // storage full — ignore
  }
};

const saveItems = (data: KnowledgeItem[]): void => {
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(data));
  } catch {
    // storage full — ignore
  }
};

let folders: KnowledgeFolder[] = loadFolders();
let items: KnowledgeItem[] = loadItems();

export const getFolders = async (): Promise<KnowledgeFolder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...folders]), 100);
  });
};

export const getItems = async (): Promise<KnowledgeItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...items]), 100);
  });
};

export const getItemsByFolderId = async (folderId: string | null): Promise<KnowledgeItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = items.filter(item => item.folderId === folderId);
      resolve(filtered);
    }, 100);
  });
};

export const getBookmarkedItems = async (): Promise<KnowledgeItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bookmarked = items.filter(item => item.isBookmarked);
      resolve(bookmarked);
    }, 100);
  });
};

export const searchItems = async (query: string): Promise<KnowledgeItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const results = items.filter(
        item =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.content.toLowerCase().includes(lowerQuery) ||
          item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
      resolve(results);
    }, 150);
  });
};

export const createFolder = async (input: CreateKnowledgeFolderInput): Promise<KnowledgeFolder> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFolder: KnowledgeFolder = {
        id: `folder-${Date.now()}`,
        name: input.name,
        parentId: input.parentId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      folders.push(newFolder);
      saveFolders(folders);
      resolve(newFolder);
    }, 100);
  });
};

export const createItem = async (input: CreateKnowledgeItemInput): Promise<KnowledgeItem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem: KnowledgeItem = {
        id: `item-${Date.now()}`,
        title: input.title,
        content: input.content,
        folderId: input.folderId,
        isBookmarked: false,
        tags: input.tags || [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      items.push(newItem);
      saveItems(items);
      resolve(newItem);
    }, 100);
  });
};

export const updateItem = async (input: UpdateKnowledgeItemInput): Promise<KnowledgeItem> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = items.findIndex(item => item.id === input.id);
      if (index === -1) {
        reject(new Error('Item not found'));
        return;
      }

      items[index] = {
        ...items[index],
        ...input,
        updatedAt: Date.now(),
      };

      saveItems(items);
      resolve(items[index]);
    }, 100);
  });
};

export const deleteItem = async (itemId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      items = items.filter(item => item.id !== itemId);
      saveItems(items);
      resolve();
    }, 100);
  });
};

export const deleteFolder = async (folderId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idsToDelete = new Set<string>([folderId]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const folder of folders) {
          if (folder.parentId && idsToDelete.has(folder.parentId) && !idsToDelete.has(folder.id)) {
            idsToDelete.add(folder.id);
            changed = true;
          }
        }
      }
      folders = folders.filter(f => !idsToDelete.has(f.id));
      items = items.filter(item => !item.folderId || !idsToDelete.has(item.folderId));
      saveFolders(folders);
      saveItems(items);
      resolve();
    }, 100);
  });
};

export const toggleBookmark = async (itemId: string): Promise<KnowledgeItem> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = items.findIndex(item => item.id === itemId);
      if (index === -1) {
        reject(new Error('Item not found'));
        return;
      }

      items[index] = {
        ...items[index],
        isBookmarked: !items[index].isBookmarked,
        updatedAt: Date.now(),
      };

      saveItems(items);
      resolve(items[index]);
    }, 100);
  });
};
