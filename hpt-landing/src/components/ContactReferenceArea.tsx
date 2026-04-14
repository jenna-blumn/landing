import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Icon, Button, Tabs, TabsList, TabsTrigger } from '@blumnai-studio/blumnai-design-system';
import type { IconType } from '@blumnai-studio/blumnai-design-system';
import InfoTabContent from './ContactReferenceArea/InfoTab/InfoTabContent';
import ContactTabContent from './ContactReferenceArea/ContactTab/ContactTabContent';
import HistoryTabContainer from './ContactReferenceArea/HistoryTab/HistoryTabContainer';
import IntegrationTabContent from './ContactReferenceArea/IntegrationTab/IntegrationTabContent';
import IntegrationDetailOverlay from './ContactReferenceArea/IntegrationTab/IntegrationDetailOverlay';
import AssistantTabContent from './ContactReferenceArea/AssistantTab/AssistantTabContent';
import ReferenceSettingsPanel from './ContactReferenceArea/ReferenceSettingsPanel';
import CustomTabContent from './ContactReferenceArea/CustomTab/CustomTabContent';
import CompositeCustomTabContent from './ContactReferenceArea/CustomTab/CompositeCustomTabContent';
import { OMSIntegration, PanelWidthSetting } from '../features/integrations/types';
import type { ConsultationDetails } from '../features/contactTab/types';
import { Room } from '../data/mockData';
import { ReferenceSettings, isTabInMainReference, COMPOSITE_TAB_ID, CompositeCardId } from '../features/referenceSettings/types';
import { getReferenceSettings, saveSettings } from '../features/referenceSettings/api/referenceSettingsApi';
import { SideTabConfig } from '../types/sideTab';
import { Memo, Tag } from '../features/customerTab/types';
import { ConsultationHistoryItem, HistoryItem } from '../features/history/types';
import { getActivityLog, getConsultationHistory } from '../features/history/api/historyApi';
import { useTaskContext, useAuth, TaskDrawer } from '@deskit/task-module';
import { useClassificationVisibility, ClassificationItemId } from '../features/contactTab/hooks/useClassificationVisibility';
import { useCustomerTagVisibility } from '../features/customerTab/hooks/useCustomerTagVisibility';
import { useCustomerGrade } from '../features/customerTab/hooks/useCustomerInfoState';
import { CustomerTagItemId, CustomerGradeOption } from '../features/customerTab/types';
import CustomerInfoOverlay from '../features/customerTab/components/overlay/CustomerInfoOverlay';
import { REFERENCE_AREA_CONTENT_PADDING } from '../features/layout/panelSpacing';


interface ContactReferenceAreaProps {
  allRooms?: Room[];
  onSelectHistoricalRoom?: (roomId: number) => void;
  referenceAreaWidth?: number;
  onActiveTabChange?: (tabId: string) => void;
  onTabDragStart?: (tabId: string) => void;
  onTabDragEnd?: () => void;
  forcedActiveTab?: string;
  hideTabs?: boolean;
  showAllTabs?: boolean;
  hiddenTabIds?: string[];
  onReferenceSettingsChange?: (settings: ReferenceSettings) => void;
  externalReferenceSettings?: ReferenceSettings | null;
  sideTabSlots?: SideTabConfig[];
  onAssignTabToSlot?: (slotId: number, tabId: string) => void;
  onRemoveTabFromSlot?: (slotId: number) => void;
  onAddSlot?: () => void;
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
  hideSettingsButton?: boolean;
}

const ContactReferenceArea: React.FC<ContactReferenceAreaProps> = ({
  allRooms = [],
  onSelectHistoricalRoom,
  referenceAreaWidth = 350,
  onActiveTabChange,
  onTabDragStart,
  onTabDragEnd,
  forcedActiveTab,
  hideTabs = false,
  showAllTabs = false,
  hiddenTabIds = [],
  onReferenceSettingsChange,
  externalReferenceSettings,
  sideTabSlots = [],
  onAssignTabToSlot: _onAssignTabToSlot,
  onRemoveTabFromSlot: _onRemoveTabFromSlot,
  onAddSlot: _onAddSlot,
  visibleFields,
  onToggleFieldVisibility,
  columnSettings,
  onToggleColumnSetting,
  fieldOrder,
  onUpdateFieldOrder,
  classificationVisibility: externalClassificationVisibility,
  onToggleClassificationVisibility: externalOnToggleClassification,
  classificationAllItems: _externalClassificationAllItems,
  customerTagVisibility: externalCustomerTagVisibility,
  onToggleCustomerTagVisibility: externalOnToggleCustomerTag,
  customerTagAllItems: _externalCustomerTagAllItems,
  customerGrade: externalCustomerGrade,
  onChangeCustomerGrade: externalOnChangeCustomerGrade,
  gradeOptions: externalGradeOptions,
  hideSettingsButton = false,
}) => {
  const taskCtx = useTaskContext();
  const { isManager } = useAuth();

  const [activeTab, setActiveTab] = useState('info');
  const [isSettingsMode, setIsSettingsMode] = useState(false);
  const [isCustomerInfoOverlayOpen, setIsCustomerInfoOverlayOpen] = useState(false);
  const [referenceSettings, setReferenceSettings] = useState<ReferenceSettings | null>(null);

  const effectiveActiveTab = forcedActiveTab || activeTab;

  React.useEffect(() => {
    if (forcedActiveTab) {
      setActiveTab(forcedActiveTab);
    }
  }, [forcedActiveTab]);

  // Use ref to avoid infinite loop: parent's onActiveTabChange callback may not be
  // memoized, causing this effect to re-trigger on every render.
  const onActiveTabChangeRef = useRef(onActiveTabChange);
  onActiveTabChangeRef.current = onActiveTabChange;

  React.useEffect(() => {
    onActiveTabChangeRef.current?.(effectiveActiveTab);
  }, [effectiveActiveTab]);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getReferenceSettings();
      setReferenceSettings(settings);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (!externalReferenceSettings) return;
    setReferenceSettings(externalReferenceSettings);
  }, [externalReferenceSettings]);

  // Sync taskButton display mode from reference settings to task context
  useEffect(() => {
    if (!referenceSettings) return;
    const tb = referenceSettings.taskButton;
    if (tb) {
      taskCtx.setButtonDisplayMode(tb.displayMode);
      taskCtx.setButtonFixedHeight(tb.fixedDrawerHeight);
    }
  }, [referenceSettings, taskCtx]);

  const onReferenceSettingsChangeRef = useRef(onReferenceSettingsChange);
  onReferenceSettingsChangeRef.current = onReferenceSettingsChange;

  const handleSaveSettings = useCallback(async (settings: ReferenceSettings) => {
    await saveSettings(settings);
    setReferenceSettings(settings);
    onReferenceSettingsChangeRef.current?.(settings);
  }, []);

  // Contact tab persistent states
  const [consultationDetails, setConsultationDetails] = useState<ConsultationDetails>({
    title: '',
    roomId: '68885a28ef477ynuTlSali8yDVV',
    channel: '채팅',
    consultant: '김상담',
    consultationCount: 3,
    brand: 'apple',
    startTime: '2024-01-20 14:25',
    isOngoing: true,
    endTime: null,
  });

  const [consultationTags, setConsultationTags] = useState<Array<{
    id: number;
    name: string;
    color: string;
    createdBy: string;
    createdAt: string;
  }>>([]);

  const [majorCategory, setMajorCategory] = useState('문의');
  const [middleCategory, setMiddleCategory] = useState('');
  const [minorCategory, setMinorCategory] = useState('');
  const [priority, setPriority] = useState('보통');
  const [consultationSummary, setConsultationSummary] = useState('');

  // Consultation notes state (separate from customer memos)
  const [consultationNotes, setConsultationNotes] = useState<Array<{
    id: number;
    content: string;
    author: string;
    createdAt: string;
  }>>([
    {
      id: 1,
      content: '고객이 배송 지연에 대해 강한 불만을 표현함. 신중한 대응 필요',
      author: '상담사 김철수',
      createdAt: '2024-01-20 14:30'
    },
    {
      id: 2,
      content: '결제 취소 후 재결제 진행. 카드사 승인 대기 중',
      author: '상담사 이영희',
      createdAt: '2024-01-20 15:45'
    }
  ]);

  // Shared customer info state (for composite tab bidirectional sync)
  const [sharedMemos, setSharedMemos] = useState<Memo[]>([
    {
      id: 1,
      content: '고객이 배송 지연에 대해 문의함. 택배사에 확인 후 답변 예정',
      author: '상담사 김철수',
      createdAt: '2024-01-20 14:30',
    },
  ]);
  const [sharedTags, setSharedTags] = useState<Tag[]>([
    { id: 1, name: 'VIP고객', color: 'bg-red-300', createdBy: '시스템', createdAt: '2024-01-15' },
    { id: 2, name: '우선처리', color: 'bg-orange-300', createdBy: '상담사 김철수', createdAt: '2024-01-20' },
    { id: 3, name: '단골고객', color: 'bg-blue-300', createdBy: '시스템', createdAt: '2024-01-10' },
  ]);

  const handleAddMemo = useCallback((content: string) => {
    setSharedMemos(prev => [...prev, {
      id: Date.now(),
      content,
      author: '상담사 김철수',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    }]);
  }, []);

  const handleEditMemo = useCallback((id: number, content: string) => {
    setSharedMemos(prev => prev.map(m => m.id === id ? { ...m, content } : m));
  }, []);

  const handleDeleteMemo = useCallback((id: number) => {
    setSharedMemos(prev => prev.filter(m => m.id !== id));
  }, []);

  const handleAddTag = useCallback((tag: Omit<Tag, 'id'>) => {
    setSharedTags(prev => [...prev, { ...tag, id: Date.now() }]);
  }, []);

  const handleDeleteTag = useCallback((id: number) => {
    setSharedTags(prev => prev.filter(t => t.id !== id));
  }, []);

  // Contact tab AI state (shared for composite)
  const [flag, setFlag] = useState<{ type: string | null; label: string; color: string } | null>(null);
  const [isTitleAIGenerated, setIsTitleAIGenerated] = useState(false);
  const [isSummaryAIGenerated, setIsSummaryAIGenerated] = useState(false);

  // Classification visibility state (shared for composite tab sync)
  const classificationVisibility = useClassificationVisibility(
    externalClassificationVisibility,
    externalOnToggleClassification
  );

  // Customer tag visibility & grade state (shared for composite tab sync)
  const customerTagVisibility = useCustomerTagVisibility(
    externalCustomerTagVisibility,
    externalOnToggleCustomerTag
  );
  const localCustomerGradeState = useCustomerGrade('6fa36417-c923-4cee-aa54-cfbb3');
  const customerGradeState = externalCustomerGrade !== undefined ? {
    grade: externalCustomerGrade,
    changeGrade: externalOnChangeCustomerGrade || localCustomerGradeState.changeGrade,
    gradeOptions: externalGradeOptions || localCustomerGradeState.gradeOptions,
  } : localCustomerGradeState;

  // Shared history state for composite tab
  const [sharedConsultationHistory, setSharedConsultationHistory] = useState<ConsultationHistoryItem[]>([]);
  const [sharedActivityLog, setSharedActivityLog] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const loadHistoryData = async () => {
      try {
        const [log, history] = await Promise.all([
          getActivityLog(),
          getConsultationHistory(allRooms),
        ]);
        setSharedActivityLog(log);
        setSharedConsultationHistory(history);
      } catch (error) {
        console.error('Failed to load shared history data:', error);
      }
    };
    loadHistoryData();
  }, [allRooms]);

  // Composite tab card order change handler
  const handleCompositeCardOrderChange = useCallback((newOrder: CompositeCardId[]) => {
    setReferenceSettings(current => {
      if (!current) return current;
      const updated = {
        ...current,
        compositeTab: { ...current.compositeTab, cardOrder: newOrder },
      };
      saveSettings(updated);
      onReferenceSettingsChangeRef.current?.(updated);
      return updated;
    });
  }, []);

  // Integration tab states
  const [selectedIntegration, setSelectedIntegration] = useState<OMSIntegration | null>(null);
  const [isIntegrationDetailOpen, setIsIntegrationDetailOpen] = useState(false);
  const [panelWidthSetting, setPanelWidthSetting] = useState<PanelWidthSetting>('assist-and-reference');

  const handleNavigateToHistory = useCallback(() => {
    setActiveTab('history');
  }, []);

  const handleSelectIntegration = useCallback((integration: OMSIntegration) => {
    setSelectedIntegration(integration);
    setIsIntegrationDetailOpen(true);
  }, []);

  const handleCloseIntegrationDetail = useCallback(() => {
    setIsIntegrationDetailOpen(false);
  }, []);

  const handlePanelWidthSettingChange = useCallback((setting: PanelWidthSetting) => {
    setPanelWidthSetting(setting);
  }, []);

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

  // Mock customer data - this should come from props or context in real implementation
  const customerData = useMemo(() => ({
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
  }), []);

  const defaultTabDefinitions: { id: string; label: string; icon: IconType }[] = useMemo(() => [
    { id: 'info', label: '고객', icon: ['system', 'information'] },
    { id: 'contact', label: 'Contact', icon: ['user', 'user'] },
    { id: 'history', label: 'History', icon: ['system', 'time'] },
    { id: 'integration', label: '연동', icon: ['business', 'links'] },
    { id: 'assistant', label: 'Assistant', icon: ['weather', 'flashlight'] },
  ], []);

  const tabDefinitions = React.useMemo(() => {
    const baseTabs = [...defaultTabDefinitions];
    if (referenceSettings) {
      const customTabs = referenceSettings.tabs.filter(t => {
        if (!t.isCustom) return false;
        // Hide composite tab if disabled
        if (t.id === COMPOSITE_TAB_ID && !referenceSettings.compositeTab?.enabled) return false;
        return true;
      });
      customTabs.forEach(customTab => {
        baseTabs.push({
          id: customTab.id,
          label: customTab.name,
          icon: customTab.customTabKind === 'composite' ? ['document', 'file-list-2'] as IconType : ['document', 'file-text'] as IconType,
        });
      });
    }
    return baseTabs;
  }, [defaultTabDefinitions, referenceSettings]);

  const [tabOrder, setTabOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('reference-tab-order');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultTabDefinitions.map(t => t.id);
      }
    }
    return defaultTabDefinitions.map(t => t.id);
  });

  useEffect(() => {
    if (referenceSettings) {
      const mainReferenceTabs = referenceSettings.tabs
        .filter(t => showAllTabs ? t.sideTabSlotId === null : isTabInMainReference(t))
        .sort((a, b) => a.order - b.order)
        .map(t => t.id);
      setTabOrder(prev => {
        // Only update if the tab order actually changed
        if (prev.length === mainReferenceTabs.length && prev.every((id, i) => id === mainReferenceTabs[i])) {
          return prev;
        }
        return mainReferenceTabs;
      });
    }
  }, [referenceSettings, showAllTabs]);

  // Drag state
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);

  // Save tab order to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('reference-tab-order', JSON.stringify(tabOrder));
  }, [tabOrder]);

  // Get ordered tabs based on tabOrder
  const tabs = tabOrder
    .map(id => tabDefinitions.find(t => t.id === id))
    .filter((tab): tab is typeof tabDefinitions[0] => tab !== undefined);

  // Use refs for parent drag callbacks to avoid re-creating handlers
  const onTabDragStartRef = useRef(onTabDragStart);
  onTabDragStartRef.current = onTabDragStart;
  const onTabDragEndRef = useRef(onTabDragEnd);
  onTabDragEndRef.current = onTabDragEnd;

  // Drag handlers for tab reordering
  const handleTabDragStart = useCallback((e: React.DragEvent, tabId: string) => {
    setDraggingTabId(tabId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tabId);
    onTabDragStartRef.current?.(tabId);
  }, []);

  const handleTabDragEnd = useCallback(() => {
    setDraggingTabId(null);
    setDragOverTabId(null);
    onTabDragEndRef.current?.();
  }, []);

  const handleTabDragOver = useCallback((e: React.DragEvent, targetTabId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    setDraggingTabId(prev => {
      if (prev && prev !== targetTabId) {
        setDragOverTabId(targetTabId);
      }
      return prev;
    });
  }, []);

  const handleTabDragLeave = useCallback(() => {
    setDragOverTabId(null);
  }, []);

  const handleTabDrop = useCallback((e: React.DragEvent, targetTabId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setDraggingTabId(prev => {
      if (!prev || prev === targetTabId) {
        setDragOverTabId(null);
        return prev;
      }

      setTabOrder(currentOrder => {
        const dragIndex = currentOrder.indexOf(prev);
        const dropIndex = currentOrder.indexOf(targetTabId);

        if (dragIndex === -1 || dropIndex === -1) {
          return currentOrder;
        }

        const newTabOrder = [...currentOrder];
        newTabOrder.splice(dragIndex, 1);
        newTabOrder.splice(dropIndex, 0, prev);

        // 설정에 탭 순서 반영 및 저장
        setReferenceSettings(currentSettings => {
          if (currentSettings) {
            const updatedTabs = currentSettings.tabs.map(tab => {
              const newIndex = newTabOrder.indexOf(tab.id);
              return newIndex !== -1 ? { ...tab, order: newIndex } : tab;
            });
            const updatedSettings = { ...currentSettings, tabs: updatedTabs };
            onReferenceSettingsChangeRef.current?.(updatedSettings);
            saveSettings(updatedSettings);
            return updatedSettings;
          }
          return currentSettings;
        });

        return newTabOrder;
      });

      setDragOverTabId(null);
      return prev;
    });
  }, []);

  return (
    <div
      className="h-full bg-white relative min-w-0 max-w-full overflow-hidden"
    >
      <div className="h-full flex flex-col min-w-0">
        {!hideTabs && !isSettingsMode && !isCustomerInfoOverlayOpen && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-shrink-0">
            <div className="flex h-12 items-center gap-1 px-1 bg-white border-b border-gray-200">
              <TabsList variant="pill" className="flex h-full flex-1 min-w-0 overflow-x-auto scrollbar-thin !gap-1">
                {tabs.filter(tab => !hiddenTabIds.includes(tab.id)).map((tab) => {
                  const isDragging = draggingTabId === tab.id;
                  const isDragOver = dragOverTabId === tab.id;
                  return (
                    <div key={tab.id} className="relative flex-shrink-0">
                      {isDragOver && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 z-10" />
                      )}
                      <TabsTrigger
                        value={tab.id}
                        draggable
                        onDragStart={(e) => handleTabDragStart(e, tab.id)}
                        onDragEnd={handleTabDragEnd}
                        onDragOver={(e) => handleTabDragOver(e, tab.id)}
                        onDragLeave={handleTabDragLeave}
                        onDrop={(e) => handleTabDrop(e, tab.id)}
                        className={isDragging ? 'opacity-50' : ''}
                        leadIcon={
                          <>
                            <Icon iconType={['editor', 'draggable']} size={12} className="opacity-40 cursor-grab active:cursor-grabbing" />
                            <Icon iconType={tab.icon} size={13} />
                          </>
                        }
                      >
                        {tab.label}
                      </TabsTrigger>
                    </div>
                  );
                })}
              </TabsList>
              {!hideSettingsButton && (
                <Button
                  onClick={() => setIsSettingsMode(true)}
                  variant="iconOnly"
                  buttonStyle="ghost"
                  size="2xs"
                  title="레퍼런스 설정"
                  className="flex-shrink-0"
                  leadIcon={<Icon iconType={['system', 'settings']} size={16} />}
                />
              )}
            </div>
          </Tabs>
        )}

        {isSettingsMode ? (
          <ReferenceSettingsPanel
            onClose={() => setIsSettingsMode(false)}
            sideTabSlots={sideTabSlots}
            onSaveSettings={handleSaveSettings}
          />
        ) : isCustomerInfoOverlayOpen ? (
          <CustomerInfoOverlay
            isOpen={true}
            onClose={() => setIsCustomerInfoOverlayOpen(false)}
            customerData={customerData}
            visibleFields={visibleFields!}
            onToggleFieldVisibility={onToggleFieldVisibility!}
            columnSettings={columnSettings!}
            onToggleColumnSetting={onToggleColumnSetting!}
            fieldOrder={fieldOrder}
            onUpdateFieldOrder={onUpdateFieldOrder}
          />
        ) : (
          <div className={`flex-1 min-w-0 ${['history', 'info', 'contact'].includes(effectiveActiveTab) || effectiveActiveTab === COMPOSITE_TAB_ID ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'} ${getTabBackgroundColor(effectiveActiveTab)} ${effectiveActiveTab === 'assistant' || effectiveActiveTab === COMPOSITE_TAB_ID ? 'p-0' : REFERENCE_AREA_CONTENT_PADDING}`}>
            {effectiveActiveTab === 'info' && (
              <InfoTabContent
                customerData={customerData}
                onNavigateToHistory={handleNavigateToHistory}
                isManagerMode={isManager}
                visibleFields={visibleFields}
                onToggleFieldVisibility={onToggleFieldVisibility}
                columnSettings={columnSettings}
                onToggleColumnSetting={onToggleColumnSetting}
                memos={sharedMemos}
                onAddMemo={handleAddMemo}
                onEditMemo={handleEditMemo}
                onDeleteMemo={handleDeleteMemo}
                tags={sharedTags}
                onAddTag={handleAddTag}
                onDeleteTag={handleDeleteTag}
                isCustomerInfoOverlayOpen={isCustomerInfoOverlayOpen}
                onToggleCustomerInfoOverlay={setIsCustomerInfoOverlayOpen}
                customerTagVisibility={customerTagVisibility.visibleItems}
                onToggleCustomerTagVisibility={customerTagVisibility.toggleItem}
                customerTagAllItems={customerTagVisibility.allItems}
                customerGrade={customerGradeState.grade}
                onChangeCustomerGrade={customerGradeState.changeGrade}
                gradeOptions={customerGradeState.gradeOptions}
              />
            )}

            {effectiveActiveTab === 'contact' && (
              <ContactTabContent
                customerData={customerData}
                consultationDetails={consultationDetails}
                setConsultationDetails={setConsultationDetails}
                consultationTags={consultationTags}
                setConsultationTags={setConsultationTags}
                majorCategory={majorCategory}
                setMajorCategory={setMajorCategory}
                middleCategory={middleCategory}
                setMiddleCategory={setMiddleCategory}
                minorCategory={minorCategory}
                setMinorCategory={setMinorCategory}
                priority={priority}
                setPriority={setPriority}
                consultationSummary={consultationSummary}
                setConsultationSummary={setConsultationSummary}
                consultationNotes={consultationNotes}
                setConsultationNotes={setConsultationNotes}
                classificationVisibility={classificationVisibility.visibleItems}
                onToggleClassificationVisibility={classificationVisibility.toggleItem}
                classificationAllItems={classificationVisibility.allItems}
              />
            )}

            {effectiveActiveTab === 'history' && (
              <HistoryTabContainer
                allRooms={allRooms}
                onSelectHistoricalRoom={onSelectHistoricalRoom}
              />
            )}

            {effectiveActiveTab === 'integration' && (
              <IntegrationTabContent
                onSelectIntegration={handleSelectIntegration}
                panelWidthSetting={panelWidthSetting}
                onPanelWidthSettingChange={handlePanelWidthSettingChange}
              />
            )}

            {effectiveActiveTab === 'assistant' && (
              <AssistantTabContent />
            )}

            {effectiveActiveTab === COMPOSITE_TAB_ID && referenceSettings?.compositeTab?.enabled && (
              <CompositeCustomTabContent
                compositeSettings={referenceSettings.compositeTab}
                onOpenCustomerInfoOverlay={() => setIsCustomerInfoOverlayOpen(true)}
                sharedState={{
                  customerData,
                  isManagerMode: isManager,
                  visibleFields,
                  onToggleFieldVisibility,
                  columnSettings,
                  onToggleColumnSetting,
                  memos: sharedMemos,
                  onAddMemo: handleAddMemo,
                  onEditMemo: handleEditMemo,
                  onDeleteMemo: handleDeleteMemo,
                  tags: sharedTags,
                  onAddTag: handleAddTag,
                  onDeleteTag: handleDeleteTag,
                  consultationDetails,
                  setConsultationDetails,
                  consultationTags,
                  setConsultationTags,
                  majorCategory,
                  setMajorCategory,
                  middleCategory,
                  setMiddleCategory,
                  minorCategory,
                  setMinorCategory,
                  priority,
                  setPriority,
                  consultationSummary,
                  setConsultationSummary,
                  consultationNotes,
                  setConsultationNotes,
                  flag,
                  setFlag,
                  isTitleAIGenerated,
                  setIsTitleAIGenerated,
                  isSummaryAIGenerated,
                  setIsSummaryAIGenerated,
                  consultationHistory: sharedConsultationHistory,
                  activityLog: sharedActivityLog,
                  onSelectHistoricalRoom,
                  classificationVisibility: classificationVisibility.visibleItems,
                  onToggleClassificationVisibility: classificationVisibility.toggleItem,
                  classificationAllItems: classificationVisibility.allItems,
                  customerTagVisibility: customerTagVisibility.visibleItems,
                  onToggleCustomerTagVisibility: customerTagVisibility.toggleItem,
                  customerTagAllItems: customerTagVisibility.allItems,
                  customerGrade: customerGradeState.grade,
                  onChangeCustomerGrade: customerGradeState.changeGrade,
                  gradeOptions: customerGradeState.gradeOptions,
                }}
                onCardOrderChange={handleCompositeCardOrderChange}
              />
            )}

            {effectiveActiveTab.startsWith('custom-') && effectiveActiveTab !== COMPOSITE_TAB_ID && (
              <CustomTabContent
                tabId={effectiveActiveTab}
                tabName={tabDefinitions.find(t => t.id === effectiveActiveTab)?.label || '커스텀 탭'}
              />
            )}
          </div>
        )}

        {/* Fixed Task Button - shown at bottom of reference area when taskButtonDisplayMode is 'fixed' */}
        {taskCtx.buttonDisplayMode === 'fixed' && !isSettingsMode && !isCustomerInfoOverlayOpen && (
          <div className="flex-shrink-0 border-t border-gray-300">
            <Button
              onClick={() => taskCtx.openDrawer()}
              buttonStyle="ghost"
              size="md"
              fullWidth
              className="bg-amber-50 hover:bg-amber-100"
            >
              <div className="bg-violet-500 border border-violet-600 rounded px-2 py-1 flex items-center gap-1">
                <Icon iconType={['media', 'notification']} size={12} color="white-default" />
                <span className="text-sm font-bold text-white">{taskCtx.stats.notice}</span>
              </div>
              <div className="bg-blue-500 border border-blue-600 rounded px-2 py-1 flex items-center gap-1">
                <Icon iconType={['system', 'time']} size={12} color="white-default" />
                <span className="text-sm font-bold text-white">{taskCtx.stats.pending}</span>
              </div>
              <div className="bg-orange-500 border border-orange-600 rounded px-2 py-1 flex items-center gap-1">
                <Icon iconType={['system', 'alert']} size={12} color="white-default" />
                <span className="text-sm font-bold text-white">{taskCtx.stats.delayed}</span>
              </div>
              <div className="bg-amber-500 border border-amber-600 rounded px-2 py-1 flex items-center gap-1">
                <Icon iconType={['system', 'star']} size={12} color="white-default" />
                <span className="text-sm font-bold text-white">{taskCtx.stats.liked}</span>
              </div>
            </Button>
          </div>
        )}
      </div>

      {/* Embedded Task Drawer - shown as overlay in fixed mode */}
      {taskCtx.buttonDisplayMode === 'fixed' && taskCtx.isDrawerOpen && (
        <TaskDrawer
          mode="embedded"
          isOpen={true}
          onClose={() => { }}
          onCloseSimple={() => taskCtx.closeDrawer()}
          selectedRoom={taskCtx.selectedRoom}
          onNavigateToRoom={taskCtx.callbacks.onNavigateToRoom as ((roomId: number, messageId?: number | null) => void) | undefined}
          allRooms={allRooms}
          buttonPosition={null}
          onOpenDetail={(task) => taskCtx.openDetailView(task)}
          onNoticeClick={(task) => taskCtx.handleNoticeClick(task)}
          onAddNotice={() => taskCtx.openNoticeCreation()}
          initialIsAddingTask={taskCtx.drawerInitialIsAddingTask}
          initialLinked={taskCtx.drawerInitialLinked}
        />
      )}

      {/* Integration Detail Overlay */}
      <IntegrationDetailOverlay
        isOpen={isIntegrationDetailOpen}
        onClose={handleCloseIntegrationDetail}
        integration={selectedIntegration}
        customerName={customerData.name}
        referenceAreaWidth={referenceAreaWidth}
      />
    </div>
  );
};

export default ContactReferenceArea;
