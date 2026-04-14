import type { ReactNode } from 'react';
import type { Task, CreateTaskInput } from './task';

export type DisplayMode = 'floating' | 'embedded';

export interface TaskModuleConfig {
  displayMode: DisplayMode;
  apiType: 'localStorage' | 'http';
  httpBaseUrl?: string;
  statsRefreshIntervalMs?: number;
  portalContainerId?: string;
  buttonDisplayMode?: 'floating' | 'fixed' | 'gnb' | 'rnb' | 'sidebar-fixed';
  buttonFixedHeight?: number;
}

export interface TaskModuleCallbacks {
  onNavigateToRoom?: (roomId: number, messageId?: number | null) => void;
  renderContactPreview?: (roomId: number, onClose: () => void) => ReactNode;
  onDrawerOpenChange?: (isOpen: boolean) => void;
  onDetailViewOpenChange?: (isActive: boolean) => void;
  onTaskCreated?: (task: Task) => void;
  onTaskDeleted?: (task: Task) => void;
  onPrefillCleared?: () => void;
}

export interface TaskModulePrefillData extends CreateTaskInput {
  messageId?: number | null;
}
