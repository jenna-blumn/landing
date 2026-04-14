import { ReactNode } from 'react';

export interface HistorySection {
  id: string;
  name: string;
  order: number;
}

export interface HistorySectionState {
  contentHeight: number;
  isCollapsed: boolean;
  lastExpandedHeight: number;
  wasManuallyResized: boolean;
}

export interface HistoryItem {
  id: number;
  type: 'note' | 'todo' | 'material' | 'task' | 'system' | 'consultant-change' | 'manager-review' | string;
  action: string;
  details?: string;
  user: string;
  timestamp: string;
}

export interface ConsultationHistoryItem {
  id: number;
  channel: string;
  mainCategory: string;
  startTime: string;
  subject?: string;
  conversationTopic: string;
  consultantName: string;
  duration?: string | null;
}

export interface ResizableSectionWrapperProps {
  sectionId: string;
  title: string;
  badge?: string;
  isTopSection: boolean;
  isCollapsed: boolean;
  height: number;
  minHeight: number;
  maxHeight: number;
  onHeightChange: (sectionId: string, newHeight: number) => void;
  onToggleCollapse: (sectionId: string) => void;
  onDragStart: (e: React.DragEvent, sectionId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetSectionId: string) => void;
  onResizingChange: (isResizing: boolean) => void;
  children: ReactNode;
}

export interface LayoutConstants {
  HEADER_HEIGHT: number;
  RESIZE_HANDLE_HEIGHT: number;
  SECTION_MARGIN: number;
  MIN_CONTENT_HEIGHT: number;
  MAX_CONTENT_HEIGHT: number;
}

export interface HistorySettings {
  sections: HistorySection[];
  sectionStates: { [key: string]: HistorySectionState };
}
