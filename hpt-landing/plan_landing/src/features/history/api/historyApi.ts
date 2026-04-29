import {
  HistorySettings,
  HistorySection,
  HistorySectionState,
  HistoryItem,
  ConsultationHistoryItem,
} from '../types';

const SETTINGS_STORAGE_KEY = 'historyTabSettings';
const ACTIVITY_LOG_STORAGE_KEY = 'activityLog';

const DEFAULT_SECTIONS: HistorySection[] = [
  { id: 'consultation-history', name: '상담 이력', order: 0 },
  { id: 'activity-log', name: '활동 로그', order: 1 },
];

const DEFAULT_SECTION_STATES: { [key: string]: HistorySectionState } = {
  'consultation-history': {
    contentHeight: 250,
    isCollapsed: false,
    lastExpandedHeight: 250,
    wasManuallyResized: false,
  },
  'activity-log': {
    contentHeight: 250,
    isCollapsed: false,
    lastExpandedHeight: 250,
    wasManuallyResized: false,
  },
};

const DEFAULT_ACTIVITY_LOG: HistoryItem[] = [
  {
    id: 1,
    type: 'consultant-change',
    action: '상담사 변경',
    details: '김상담 → 이상담',
    user: '시스템',
    timestamp: '2024-01-20 16:50'
  },
  {
    id: 2,
    type: 'manager-review',
    action: '매니저 검토 요청',
    details: '고객 클레임 관련 상급자 검토 요청',
    user: '상담사 김철수',
    timestamp: '2024-01-20 16:48'
  },
  {
    id: 3,
    type: 'task',
    action: 'Task 진행 단계를 3단계로 변경',
    user: '상담사 김철수',
    timestamp: '2024-01-20 16:45'
  },
  {
    id: 4,
    type: 'note',
    action: '새 메모 추가',
    details: '고객이 배송 지연에 대해 문의함...',
    user: '상담사 김철수',
    timestamp: '2024-01-20 16:30'
  },
  {
    id: 5,
    type: 'todo',
    action: '할일 완료',
    details: '문제 상황 파악',
    user: '상담사 김철수',
    timestamp: '2024-01-20 16:15'
  },
  {
    id: 6,
    type: 'material',
    action: '자료 업로드',
    details: '상품 사용 설명서.pdf',
    user: '상담사 이영희',
    timestamp: '2024-01-20 15:50'
  },
  {
    id: 7,
    type: 'todo',
    action: '새 할일 그룹 생성',
    details: '기본 할일',
    user: '상담사 김철수',
    timestamp: '2024-01-20 15:30'
  },
  {
    id: 8,
    type: 'system',
    action: 'Task 시작',
    details: 'TK-F32-A0002',
    user: '시스템',
    timestamp: '2024-01-20 15:00'
  }
];

let cachedSettings: HistorySettings | null = null;
let cachedActivityLog: HistoryItem[] | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === SETTINGS_STORAGE_KEY) cachedSettings = null;
    if (e.key === ACTIVITY_LOG_STORAGE_KEY) cachedActivityLog = null;
  });
}

const loadSettingsFromStorage = (): HistorySettings => {
  if (cachedSettings) return cachedSettings;

  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      cachedSettings = {
        sections: parsed.sections || DEFAULT_SECTIONS,
        sectionStates: parsed.sectionStates || DEFAULT_SECTION_STATES,
      };
      return cachedSettings;
    }
  } catch (error) {
    console.error('Failed to load history settings:', error);
  }

  cachedSettings = {
    sections: [...DEFAULT_SECTIONS],
    sectionStates: { ...DEFAULT_SECTION_STATES },
  };
  return cachedSettings;
};

const saveSettingsToStorage = (settings: HistorySettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    cachedSettings = settings;
  } catch (error) {
    console.error('Failed to save history settings:', error);
  }
};

const loadActivityLogFromStorage = (): HistoryItem[] => {
  if (cachedActivityLog) return cachedActivityLog;

  try {
    const saved = localStorage.getItem(ACTIVITY_LOG_STORAGE_KEY);
    if (saved) {
      cachedActivityLog = JSON.parse(saved);
      return cachedActivityLog!;
    }
  } catch (error) {
    console.error('Failed to load activity log:', error);
  }

  cachedActivityLog = [...DEFAULT_ACTIVITY_LOG];
  saveActivityLogToStorage(cachedActivityLog);
  return cachedActivityLog;
};

const saveActivityLogToStorage = (log: HistoryItem[]): void => {
  try {
    localStorage.setItem(ACTIVITY_LOG_STORAGE_KEY, JSON.stringify(log));
    cachedActivityLog = log;
  } catch (error) {
    console.error('Failed to save activity log:', error);
  }
};

export const getHistorySettings = async (): Promise<HistorySettings> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(loadSettingsFromStorage());
    }, 50);
  });
};

export const saveHistorySettings = async (settings: HistorySettings): Promise<HistorySettings> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      saveSettingsToStorage(settings);
      resolve(settings);
    }, 50);
  });
};

export const getActivityLog = async (): Promise<HistoryItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(loadActivityLogFromStorage());
    }, 50);
  });
};

export const getConsultationHistory = async (
  allRooms: Array<{
    id: number;
    channel: string;
    mainCategory: string;
    startTime: string;
    subject?: string;
    conversationTopic: string;
    consultantName: string;
    duration?: string | null;
  }>
): Promise<ConsultationHistoryItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockHistoryItems: ConsultationHistoryItem[] = [
        {
          id: 101,
          channel: 'chat',
          mainCategory: 'closed',
          startTime: '2024-01-15 09:30',
          subject: '배송 지연 문의',
          conversationTopic: '배송 지연 문의',
          consultantName: '이상담',
          duration: '45분',
        },
        {
          id: 102,
          channel: 'chat',
          mainCategory: 'closed',
          startTime: '2024-01-10 14:00',
          subject: '환불 요청',
          conversationTopic: '환불 요청',
          consultantName: '박상담',
          duration: '45분',
        },
        {
          id: 103,
          channel: 'phone',
          mainCategory: 'closed',
          startTime: '2024-01-05 11:00',
          subject: '제품 사용법 문의',
          conversationTopic: '제품 사용법 문의',
          consultantName: '최상담',
          duration: '30분',
        },
        {
          id: 104,
          channel: 'chat',
          mainCategory: 'ongoing',
          startTime: '2024-01-02 16:30',
          subject: '결제 오류 문의',
          conversationTopic: '결제 오류 문의',
          consultantName: '김상담',
          duration: null,
        },
      ];

      const closedRooms = allRooms.filter(room => room.mainCategory === 'closed');
      const roomItems = closedRooms.map(room => ({
        id: room.id,
        channel: room.channel,
        mainCategory: room.mainCategory,
        startTime: room.startTime,
        subject: room.subject,
        conversationTopic: room.conversationTopic,
        consultantName: room.consultantName,
        duration: room.duration,
      }));

      resolve([...mockHistoryItems, ...roomItems]);
    }, 50);
  });
};

