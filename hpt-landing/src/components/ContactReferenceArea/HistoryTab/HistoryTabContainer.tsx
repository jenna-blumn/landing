import React, { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@blumnai-studio/blumnai-design-system';
import { Room } from '../../../data/mockData';
import {
  HistorySection,
  HistorySectionState,
  HistoryItem,
  ConsultationHistoryItem,
} from '../../../features/history/types';
import { useHistoryTabState } from '../../../features/history/hooks/useHistoryTabState';
import {
  getHistorySettings,
  getActivityLog,
  getConsultationHistory,
} from '../../../features/history/api/historyApi';
import ResizableSectionWrapper from './ResizableSectionWrapper';
import ConsultationHistorySection from './ConsultationHistorySection';
import ActivityLogSection from './ActivityLogSection';

const DEFAULT_HISTORY_SECTIONS: HistorySection[] = [
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

interface HistoryTabContainerProps {
  allRooms: Room[];
  sectionStates?: { [key: string]: HistorySectionState };
  setSectionStates?: (states: { [key: string]: HistorySectionState }) => void;
  onSelectHistoricalRoom?: (roomId: number) => void;
}

const HistoryTabContainer: React.FC<HistoryTabContainerProps> = ({
  allRooms,
  onSelectHistoricalRoom,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialSections, setInitialSections] = useState<HistorySection[]>(DEFAULT_HISTORY_SECTIONS);
  const [initialStates, setInitialStates] = useState<{ [key: string]: HistorySectionState }>(DEFAULT_SECTION_STATES);
  const [consultationHistory, setConsultationHistory] = useState<ConsultationHistoryItem[]>([]);
  const [activityLog, setActivityLog] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settings, log, history] = await Promise.all([
          getHistorySettings(),
          getActivityLog(),
          getConsultationHistory(allRooms),
        ]);

        setInitialSections(settings.sections);
        setInitialStates(settings.sectionStates);
        setActivityLog(log);
        setConsultationHistory(history);
      } catch (error) {
        console.error('Failed to load history data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [allRooms]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col p-1">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <HistoryTabContent
      initialSections={initialSections}
      initialStates={initialStates}
      consultationHistory={consultationHistory}
      activityLog={activityLog}
      onSelectHistoricalRoom={onSelectHistoricalRoom}
    />
  );
};

interface HistoryTabContentProps {
  initialSections: HistorySection[];
  initialStates: { [key: string]: HistorySectionState };
  consultationHistory: ConsultationHistoryItem[];
  activityLog: HistoryItem[];
  onSelectHistoricalRoom?: (roomId: number) => void;
}

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({
  initialSections,
  initialStates,
  consultationHistory,
  activityLog,
  onSelectHistoricalRoom,
}) => {
  const {
    sectionStates,
    sections,
    containerRef,
    handleHeightChange,
    handleToggleCollapse,
    handleDragStart,
    handleDragOver,
    handleDrop,
    setIsAnySectionResizing,
    getCurrentMaxHeight,
  } = useHistoryTabState({
    sections: initialSections,
    initialSectionStates: initialStates,
    autoSave: true,
  });

  const renderSectionContent = (section: HistorySection) => {
    switch (section.id) {
      case 'consultation-history':
        return (
          <ConsultationHistorySection
            consultationHistory={consultationHistory}
            onSelectHistoricalItem={onSelectHistoricalRoom}
          />
        );
      case 'activity-log':
        return <ActivityLogSection activityLog={activityLog} />;
      default:
        return (
          <div className="text-center py-4 text-gray-500">
            <p>알 수 없는 섹션입니다.</p>
          </div>
        );
    }
  };

  const sortedSections = useMemo(() => [...sections].sort((a, b) => a.order - b.order), [sections]);

  const getBadgeText = (sectionId: string) => {
    switch (sectionId) {
      case 'consultation-history':
        return consultationHistory.length > 0 ? `${consultationHistory.length}건` : undefined;
      case 'activity-log':
        return activityLog.length > 0 ? `${activityLog.length}개` : undefined;
      default:
        return undefined;
    }
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col flex-1">
      <div className="flex-1">
        {sortedSections.map((section, index) => (
          <ResizableSectionWrapper
            key={section.id}
            sectionId={section.id}
            title={section.name}
            badge={getBadgeText(section.id)}
            isTopSection={index === 0}
            isCollapsed={sectionStates[section.id]?.isCollapsed || false}
            height={sectionStates[section.id]?.contentHeight || 250}
            minHeight={0}
            maxHeight={getCurrentMaxHeight(section.id)}
            onHeightChange={handleHeightChange}
            onToggleCollapse={handleToggleCollapse}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onResizingChange={setIsAnySectionResizing}
          >
            {renderSectionContent(section)}
          </ResizableSectionWrapper>
        ))}
      </div>
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="h-12 bg-gray-50 border-b border-gray-200 px-4 flex items-center">
        <Skeleton variant="text" width="6rem" height="1rem" />
      </div>
      <div className="p-4 space-y-3">
        <div className="bg-gray-100 rounded-lg p-3 space-y-2">
          <Skeleton variant="text" width="75%" height="0.75rem" />
          <Skeleton variant="text" width="50%" height="0.75rem" />
        </div>
        <div className="bg-gray-100 rounded-lg p-3 space-y-2">
          <Skeleton variant="text" width="66%" height="0.75rem" />
          <Skeleton variant="text" width="33%" height="0.75rem" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="h-12 bg-gray-50 border-b border-gray-200 px-4 flex items-center">
        <Skeleton variant="text" width="5rem" height="1rem" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex gap-3">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="100%" height="0.75rem" />
            <Skeleton variant="text" width="66%" height="0.75rem" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="100%" height="0.75rem" />
            <Skeleton variant="text" width="50%" height="0.75rem" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HistoryTabContainer;
