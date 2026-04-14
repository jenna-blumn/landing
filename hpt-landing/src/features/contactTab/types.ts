export interface ConsultationDetails {
  title: string;
  roomId: string;
  channel: string;
  consultant: string;
  consultationCount: number;
  brand: string;
  startTime: string;
  isOngoing: boolean;
  endTime?: string | null;
}

export interface ConsultationTag {
  id: number;
  name: string;
  color: string;
  createdBy: string;
  createdAt: string;
}

export interface ConsultationNote {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

export interface Flag {
  type: 'urgent' | 'important' | 'normal' | 'info' | 'completed' | null;
  color: string;
  label: string;
}

export interface CategoryStructure {
  [major: string]: {
    [middle: string]: string[];
  };
}

export interface ContactSection {
  id: string;
  name: string;
  order: number;
  isCollapsed: boolean;
}

export const DEFAULT_CONTACT_SECTIONS: ContactSection[] = [
  { id: 'classification-tags', name: '분류 및 태그', order: 0, isCollapsed: false },
  { id: 'consultation-info', name: '상담 정보', order: 1, isCollapsed: false },
  { id: 'notes-special', name: '메모 및 특이사항', order: 2, isCollapsed: false },
];
