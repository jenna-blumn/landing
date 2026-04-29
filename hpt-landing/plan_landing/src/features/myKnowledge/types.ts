export interface KnowledgeFolder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  isBookmarked: boolean;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface CreateKnowledgeFolderInput {
  name: string;
  parentId: string | null;
}

export interface CreateKnowledgeItemInput {
  title: string;
  content: string;
  folderId: string | null;
  tags?: string[];
}

export interface UpdateKnowledgeItemInput {
  id: string;
  title?: string;
  content?: string;
  folderId?: string | null;
  isBookmarked?: boolean;
  tags?: string[];
}
