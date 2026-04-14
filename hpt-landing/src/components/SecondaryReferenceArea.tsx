import React, { useState, useCallback, useEffect } from 'react';
import { Icon, Button, ScrollArea } from '@blumnai-studio/blumnai-design-system';
import type { IconType } from '@blumnai-studio/blumnai-design-system';
import { Room } from '../data/mockData';
import InfoTabContent from './ContactReferenceArea/InfoTab/InfoTabContent';
import ContactTabContent from './ContactReferenceArea/ContactTab/ContactTabContent';
import HistoryTabContainer from './ContactReferenceArea/HistoryTab/HistoryTabContainer';
import IntegrationTabContent from './ContactReferenceArea/IntegrationTab/IntegrationTabContent';
import AssistantTabContent from './ContactReferenceArea/AssistantTab/AssistantTabContent';
import CustomTabContent from './ContactReferenceArea/CustomTab/CustomTabContent';
import CompositeCustomTabContent from './ContactReferenceArea/CustomTab/CompositeCustomTabContent';
import { COMPOSITE_TAB_ID, CompositeCardId, ReferenceSettings } from '../features/referenceSettings/types';
import type { ConsultationDetails, ConsultationTag } from '../features/contactTab/types';
import { saveSettings } from '../features/referenceSettings/api/referenceSettingsApi';
import { getActivityLog, getConsultationHistory } from '../features/history/api/historyApi';
import { ConsultationHistoryItem, HistoryItem } from '../features/history/types';
import { Memo, Tag, CustomerTagItemId, CustomerGradeOption } from '../features/customerTab/types';
import { ClassificationItemId } from '../features/contactTab/hooks/useClassificationVisibility';
import CustomerInfoOverlay from '../features/customerTab/components/overlay/CustomerInfoOverlay';
import { getDefaultVisibleFields } from '../features/customerTab/utils/fieldDefinitions';
import { REFERENCE_AREA_CONTENT_PADDING } from '../features/layout/panelSpacing';

interface SecondaryReferenceAreaProps {
  tabId: string;
  onClose: () => void;
  allRooms?: Room[];
  onSelectHistoricalRoom?: (roomId: number) => void;
  position: 'left' | 'right';
  onTogglePosition: () => void;
  onTabDrop?: (tabId: string) => void;
  draggedTabId?: string | null;
  referenceSettings?: ReferenceSettings | null;
  onReferenceSettingsChange?: (settings: ReferenceSettings) => void;
  visibleFields?: Set<string>;
  onToggleFieldVisibility?: (fieldId: string) => void;
  columnSettings?: Set<string>;
  onToggleColumnSetting?: (fieldId: string) => void;
  fieldOrder?: Record<string, string[]>;
  onUpdateFieldOrder?: (category: string, newOrder: string[]) => void;
  classificationVisibility?: Set<ClassificationItemId>;
  onToggleClassificationVisibility?: (itemId: ClassificationItemId) => void;
  classificationAllItems?: ClassificationItemId[];
  customerTagVisibility?: Set<CustomerTagItemId>;
  onToggleCustomerTagVisibility?: (itemId: CustomerTagItemId) => void;
  customerTagAllItems?: CustomerTagItemId[];
  customerGrade?: string;
  onChangeCustomerGrade?: (grade: string) => void;
  gradeOptions?: CustomerGradeOption[];
}

const SecondaryReferenceArea: React.FC<SecondaryReferenceAreaProps> = ({
  tabId,
  onClose,
  allRooms = [],
  onSelectHistoricalRoom,
  position: _position,
  onTogglePosition: _onTogglePosition,
  onTabDrop,
  draggedTabId,
  referenceSettings,
  onReferenceSettingsChange,
  visibleFields,
  onToggleFieldVisibility,
  columnSettings,
  onToggleColumnSetting,
  fieldOrder,
  onUpdateFieldOrder,
  classificationVisibility,
  onToggleClassificationVisibility,
  classificationAllItems,
  customerTagVisibility,
  onToggleCustomerTagVisibility,
  customerTagAllItems,
  customerGrade,
  onChangeCustomerGrade,
  gradeOptions,
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isCustomerInfoOverlayOpen, setIsCustomerInfoOverlayOpen] = useState(false);

  // --- Composite tab local state ---
  const isCompositeTab = tabId === COMPOSITE_TAB_ID;
  const compositeSettings = referenceSettings?.compositeTab;

  const [memos, setMemos] = useState<Memo[]>([
    { id: 1, content: '고객이 배송 지연에 대해 문의함. 택배사에 확인 후 답변 예정', author: '상담사 김철수', createdAt: '2024-01-20 14:30' },
  ]);
  const [tags, setTags] = useState<Tag[]>([
    { id: 1, name: 'VIP고객', color: 'bg-red-300', createdBy: '시스템', createdAt: '2024-01-15' },
    { id: 2, name: '우선처리', color: 'bg-orange-300', createdBy: '상담사 김철수', createdAt: '2024-01-20' },
  ]);
  const [consultationDetails, setConsultationDetails] = useState<ConsultationDetails>({
    title: '', roomId: '68885a28ef477ynuTlSali8yDVV', channel: '채팅',
    consultant: '김상담', consultationCount: 3, brand: 'apple',
    startTime: '2024-01-20 14:25', isOngoing: true, endTime: null,
  });
  const [consultationTags, setConsultationTags] = useState<ConsultationTag[]>([]);
  const [majorCategory, setMajorCategory] = useState('문의');
  const [middleCategory, setMiddleCategory] = useState('');
  const [minorCategory, setMinorCategory] = useState('');
  const [priority, setPriority] = useState('보통');
  const [consultationSummary, setConsultationSummary] = useState('');
  const [consultationNotes, setConsultationNotes] = useState<{ id: number; content: string; author: string; createdAt: string; isSpecial?: boolean }[]>([]);
  const [flag, setFlag] = useState<{ type: string | null; label: string; color: string } | null>(null);
  const [isTitleAIGenerated, setIsTitleAIGenerated] = useState(false);
  const [isSummaryAIGenerated, setIsSummaryAIGenerated] = useState(false);
  const [consultationHistory, setConsultationHistory] = useState<ConsultationHistoryItem[]>([]);
  const [activityLog, setActivityLog] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!isCompositeTab) return;
    const loadHistoryData = async () => {
      try {
        const [log, history] = await Promise.all([getActivityLog(), getConsultationHistory(allRooms)]);
        setActivityLog(log);
        setConsultationHistory(history);
      } catch { /* ignore */ }
    };
    loadHistoryData();
  }, [allRooms, isCompositeTab]);

  const handleAddMemo = useCallback((content: string) => {
    setMemos(prev => [...prev, { id: Date.now(), content, author: '상담사', createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ') }]);
  }, []);
  const handleEditMemo = useCallback((id: number, content: string) => {
    setMemos(prev => prev.map(m => m.id === id ? { ...m, content } : m));
  }, []);
  const handleDeleteMemo = useCallback((id: number) => {
    setMemos(prev => prev.filter(m => m.id !== id));
  }, []);
  const handleAddTag = useCallback((tag: Omit<Tag, 'id'>) => {
    setTags(prev => [...prev, { ...tag, id: Date.now() }]);
  }, []);
  const handleDeleteTag = useCallback((id: number) => {
    setTags(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleCompositeCardOrderChange = useCallback((newOrder: CompositeCardId[]) => {
    if (!referenceSettings) return;
    const updated: ReferenceSettings = {
      ...referenceSettings,
      compositeTab: { ...referenceSettings.compositeTab, cardOrder: newOrder },
    };
    saveSettings(updated);
    onReferenceSettingsChange?.(updated);
  }, [referenceSettings, onReferenceSettingsChange]);

  const getTabInfo = (id: string): { label: string; icon: IconType } => {
    const tabs: Record<string, { label: string; icon: IconType }> = {
      info: { label: '고객정보', icon: ['system', 'information'] },
      contact: { label: 'Contact', icon: ['user', 'user'] },
      history: { label: 'History', icon: ['system', 'time'] },
      integration: { label: '연동', icon: ['business', 'links'] },
      assistant: { label: 'Assistant', icon: ['weather', 'flashlight'] },
    };
    if (tabs[id]) return tabs[id];
    if (id === COMPOSITE_TAB_ID) {
      const compositeName = referenceSettings?.compositeTab?.name
        || referenceSettings?.tabs?.find(t => t.id === COMPOSITE_TAB_ID)?.name
        || '맞춤';
      return { label: compositeName, icon: ['business', 'stack'] as IconType };
    }
    if (id.startsWith('custom-')) {
      const customTab = referenceSettings?.tabs?.find(t => t.id === id);
      return { label: customTab?.name || '커스텀', icon: ['document', 'file-text'] };
    }
    return { label: 'Unknown', icon: ['system', 'information'] };
  };

  const tabInfo = getTabInfo(tabId);

  const getDraggedTabLabel = () => {
    if (!draggedTabId) return '';
    return getTabInfo(draggedTabId).label;
  };

  const getTabBackgroundColor = (tabId: string) => {
    const colors = {
      info: 'bg-blue-50',
      contact: 'bg-green-50',
      history: 'bg-purple-50',
      integration: 'bg-teal-50',
      assistant: 'bg-white',
    };
    return colors[tabId as keyof typeof colors] || 'bg-gray-50';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (_e: React.DragEvent) => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const draggedTabId = e.dataTransfer.getData('text/plain');
    if (draggedTabId && onTabDrop) {
      onTabDrop(draggedTabId);
    }
  };

  return (
    <div
      className="h-full relative min-w-[270px] max-w-full flex flex-col bg-white"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Over Overlay */}
      {isDragOver && draggedTabId && (
        <div className="absolute inset-0 z-50 bg-gray-800/30 backdrop-blur-sm border-4 border-gray-500 border-dashed flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-gray-900 pointer-events-none">
            <Icon iconType={['arrows', 'arrow-down']} size={48} className="animate-bounce" />
            <div className="text-center">
              <div className="text-xl font-semibold">{getDraggedTabLabel()} 탭으로 변경합니다.</div>
            </div>
          </div>
        </div>
      )}

      {isCustomerInfoOverlayOpen ? (
        <CustomerInfoOverlay
          isOpen={true}
          onClose={() => setIsCustomerInfoOverlayOpen(false)}
          customerData={{
            name: '김고객', phone: '+1 (555) 123-4567', email: 'customer@example.com',
            birthDate: '1990-01-15', address: '서울시 강남구', customerId: '6fa36417-c923-4cee-aa54-cfbb3',
            company: '삼성전자', gender: '남성', status: '일반', lastConsultation: '2024-01-20 14:30',
          }}
          visibleFields={visibleFields ?? getDefaultVisibleFields()}
          onToggleFieldVisibility={onToggleFieldVisibility ?? (() => {})}
          columnSettings={columnSettings ?? new Set<string>()}
          onToggleColumnSetting={onToggleColumnSetting ?? (() => {})}
          fieldOrder={fieldOrder}
          onUpdateFieldOrder={onUpdateFieldOrder}
        />
      ) : (
      <>
      <div className="h-12 flex-shrink-0 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <Icon iconType={tabInfo.icon} size={18} color="default-subtle" />
          <h3 className="font-medium text-gray-700">{tabInfo.label}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            onClick={onClose}
            variant="iconOnly"
            buttonStyle="ghost"
            size="xs"
            title="Close secondary panel"
            leadIcon={<Icon iconType={['system', 'close']} size={18} color="default-subtle" />}
          />
        </div>
      </div>
      <div className={`flex-1 min-h-0 ${(tabId === 'assistant' || tabId === COMPOSITE_TAB_ID) ? 'p-0' : REFERENCE_AREA_CONTENT_PADDING} ${tabId === COMPOSITE_TAB_ID ? 'overflow-hidden flex flex-col' : ''} ${getTabBackgroundColor(tabId)}`}>
        {tabId !== COMPOSITE_TAB_ID ? (
        <ScrollArea orientation="vertical" className="h-full">
        {tabId === 'info' && (
          <InfoTabContent
            customerData={{
              name: '김고객',
              phone: '+1 (555) 123-4567',
              email: 'customer@example.com',
              birthDate: '1990-01-15',
              address: '서울시 강남구',
              customerId: '6fa36417-c923-4cee-aa54-cfbb3',
              company: '삼성전자',
              gender: '남성',
              status: '일반',
              lastConsultation: '2024-01-20 14:30',
            }}
            visibleFields={visibleFields}
            onToggleFieldVisibility={onToggleFieldVisibility}
            columnSettings={columnSettings}
            onToggleColumnSetting={onToggleColumnSetting}
            isCustomerInfoOverlayOpen={isCustomerInfoOverlayOpen}
            onToggleCustomerInfoOverlay={setIsCustomerInfoOverlayOpen}
          />
        )}

        {tabId === 'contact' && (
          <ContactTabContent
            customerData={{
              name: '김고객',
              phone: '+1 (555) 123-4567',
              email: 'customer@example.com',
              birthDate: '1990-01-15',
              address: '서울시 강남구',
              customerId: '6fa36417-c923-4cee-aa54-cfbb3',
              company: '삼성전자',
              gender: '남성',
              status: '일반',
              lastConsultation: '2024-01-20 14:30',
            }}
            consultationDetails={{
              title: '',
              roomId: '68885a28ef477ynuTlSali8yDVV',
              channel: '채팅',
              consultant: '김상담',
              consultationCount: 3,
              brand: 'apple',
              startTime: '2024-01-20 14:25',
              isOngoing: true,
              endTime: null,
            }}
            setConsultationDetails={() => {}}
            consultationTags={[]}
            setConsultationTags={() => {}}
            majorCategory="문의"
            setMajorCategory={() => {}}
            middleCategory=""
            setMiddleCategory={() => {}}
            minorCategory=""
            setMinorCategory={() => {}}
            priority="보통"
            setPriority={() => {}}
            consultationSummary=""
            setConsultationSummary={() => {}}
            consultationNotes={[]}
            setConsultationNotes={() => {}}
          />
        )}

        {tabId === 'history' && (
          <HistoryTabContainer
            allRooms={allRooms}
            sectionStates={{
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
            }}
            setSectionStates={() => {}}
            onSelectHistoricalRoom={onSelectHistoricalRoom}
          />
        )}

        {tabId === 'integration' && (
          <IntegrationTabContent
            onSelectIntegration={() => {}}
            panelWidthSetting="reference-only"
            onPanelWidthSettingChange={() => {}}
          />
        )}

        {tabId === 'assistant' && (
          <AssistantTabContent />
        )}

        {tabId.startsWith('custom-') && tabId !== COMPOSITE_TAB_ID && (
          <CustomTabContent
            tabId={tabId}
            tabName={getTabInfo(tabId).label}
          />
        )}
        </ScrollArea>
        ) : (
          <>
          {tabId === COMPOSITE_TAB_ID && compositeSettings?.enabled && (
            <CompositeCustomTabContent
              compositeSettings={compositeSettings}
              onOpenCustomerInfoOverlay={() => setIsCustomerInfoOverlayOpen(true)}
              sharedState={{
                customerData: {
                  name: '김고객', phone: '+1 (555) 123-4567', email: 'customer@example.com',
                  birthDate: '1990-01-15', address: '서울시 강남구', customerId: '6fa36417-c923-4cee-aa54-cfbb3',
                  company: '삼성전자', gender: '남성', status: '일반', lastConsultation: '2024-01-20 14:30',
                },
                visibleFields, onToggleFieldVisibility, columnSettings, onToggleColumnSetting,
                memos, onAddMemo: handleAddMemo, onEditMemo: handleEditMemo, onDeleteMemo: handleDeleteMemo,
                tags, onAddTag: handleAddTag, onDeleteTag: handleDeleteTag,
                consultationDetails, setConsultationDetails,
                consultationTags, setConsultationTags,
                majorCategory, setMajorCategory,
                middleCategory, setMiddleCategory,
                minorCategory, setMinorCategory,
                priority, setPriority,
                consultationSummary, setConsultationSummary,
                consultationNotes, setConsultationNotes,
                flag, setFlag,
                isTitleAIGenerated, setIsTitleAIGenerated,
                isSummaryAIGenerated, setIsSummaryAIGenerated,
                consultationHistory, activityLog,
                onSelectHistoricalRoom,
                classificationVisibility,
                onToggleClassificationVisibility,
                classificationAllItems,
                customerTagVisibility,
                onToggleCustomerTagVisibility,
                customerTagAllItems,
                customerGrade,
                onChangeCustomerGrade,
                gradeOptions,
              }}
              onCardOrderChange={handleCompositeCardOrderChange}
            />
          )}
          </>
        )}
      </div>
      </>
      )}
    </div>
  );
};

export default SecondaryReferenceArea;
