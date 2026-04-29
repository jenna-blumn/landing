import React, { useState, useEffect, useCallback } from 'react';
import { Room } from '../../data/mockData';
import { useSideTabManagement } from '../../hooks/useSideTabManagement';
import { cn } from '@blumnai-studio/blumnai-design-system';
import ContactReferenceArea from '../ContactReferenceArea';
import SecondaryReferenceArea from '../SecondaryReferenceArea';
import RightNavigationBar from '../RightNavigationBar';
import SideTabOverlay from '../SideTabOverlay';
import OmsConnectionModal from '../OmsConnectionModal';
import { OMS_LIST, OmsConnectionConfig, OmsInfo } from '../../types/sideTab';
import { ReferenceSettings } from '../../features/referenceSettings/types';
import { getReferenceSettings, saveSettings, updateTabSideTabSlot, updateOmsSideTabSlot } from '../../features/referenceSettings/api/referenceSettingsApi';
import { useTaskStore } from '../../stores/useTaskStore';
import { useFieldVisibility } from '../../features/customerTab/hooks/useFieldVisibility';
import { useClassificationVisibility } from '../../features/contactTab/hooks/useClassificationVisibility';
import { useCustomerTagVisibility } from '../../features/customerTab/hooks/useCustomerTagVisibility';
import { useCustomerGrade } from '../../features/customerTab/hooks/useCustomerInfoState';

const DEFAULT_REFERENCE_WIDTH = 350;
const MIN_REFERENCE_WIDTH = 270;
const MAX_REFERENCE_WIDTH = 600;
const DIVIDER_WIDTH = 4;
const MIN_CONTACT_ROOM_WIDTH = 486;
const BASE_RNB_WIDTH = 36;

interface SharedReferenceAreaProps {
  allRooms: Room[];
  selectedRoomId: number | null;
  setSelectedRoomId: React.Dispatch<React.SetStateAction<number | null>>;
  onSelectHistoricalRoom: (roomId: number) => void;
  isSearchModeActive: boolean;
  mainContentAreaRef: React.RefObject<HTMLDivElement>;
  onNavigateToRoom?: (roomId: number) => void;
  isManagerMode?: boolean;
  selectedRoom?: Room | null;
  onSetAlarm?: (roomId: number, alarmTimestamp: number | null) => void;
  onSetFlag?: (roomId: number, flagType: string | null) => void;
  contactRoomAreaWidth?: number | null;
  setContactRoomAreaWidth?: React.Dispatch<React.SetStateAction<number | null>>;
  onReferenceSettingsChange?: (settings: ReferenceSettings) => void;
}

interface SharedReferenceAreaReturn {
  referenceAreaWidth: number;
  isSecondaryReferenceVisible: boolean;
  secondaryReferenceTabId: string | null;
  secondaryReferencePosition: 'left' | 'right';
  secondaryReferenceAreaWidth: number;
  isDraggingTab: boolean;
  draggingTabId: string | null;
  isResizingSecondary: boolean;
  isResizingMain: boolean;
  sideTabSlots: ReturnType<typeof useSideTabManagement>['sideTabSlots'];
  handleExpandTabToSecondary: (tabId: string) => void;
  handleCloseSecondaryReference: () => void;
  handleReferenceActiveTabChange: (tabId: string) => void;
  handleTabDragStart: (tabId: string) => void;
  handleTabDragEnd: () => void;
  handleSideTabSlotClick: (slotId: number) => void;
  handleSideTabDrop: (slotId: number, tabId: string) => void;
  handleSideTabSelectTab: (slotId: number, tabId: string) => void;
  handleSideTabRemoveTab: (slotId: number) => void;
  handleAddSlot: () => void;
  handleDeleteSlot: (slotId: number) => void;
  canAddSlot: boolean;
  canRemoveSlot: boolean;
  getTabName: (tabId: string) => string;
  getAvailableTabs: (currentSlotTabId?: string | null) => { id: string; name: string }[];
  renderContactReferenceArea: () => React.ReactNode;
  renderSideTabDrawerButtons: () => React.ReactNode;
  renderSideTabOverlays: () => React.ReactNode;
  renderOmsConnectionModal: () => React.ReactNode;
  renderResizableLayout: (chatContent: React.ReactNode) => React.ReactNode;
}

export function useSharedReferenceArea({
  allRooms,
  onSelectHistoricalRoom,
  isSearchModeActive,
  mainContentAreaRef,
  onNavigateToRoom: _onNavigateToRoom,
  isManagerMode: _isManagerModeProp,
  selectedRoom: _selectedRoom,
  onSetAlarm: _onSetAlarm,
  onSetFlag: _onSetFlag,
  contactRoomAreaWidth: _contactRoomAreaWidth,
  setContactRoomAreaWidth: _setContactRoomAreaWidth,
  onReferenceSettingsChange: _onReferenceSettingsChangeProp,
}: SharedReferenceAreaProps): SharedReferenceAreaReturn {
  const [referenceAreaWidth, setReferenceAreaWidth] = useState(DEFAULT_REFERENCE_WIDTH);

  const [isSecondaryReferenceVisible, setIsSecondaryReferenceVisible] = useState(false);
  const [secondaryReferenceTabId, setSecondaryReferenceTabId] = useState<string | null>(null);
  const [secondaryReferenceAreaWidth, setSecondaryReferenceAreaWidth] = useState(DEFAULT_REFERENCE_WIDTH);
  const [isResizingSecondary, setIsResizingSecondary] = useState(false);
  const [isResizingMain, setIsResizingMain] = useState(false);
  const [referenceActiveTab, setReferenceActiveTab] = useState<string>('info');
  const [forcedMainReferenceTabId, setForcedMainReferenceTabId] = useState<string | null>(null);
  const [secondaryReferencePosition, setSecondaryReferencePosition] = useState<'left' | 'right'>(() => {
    const saved = localStorage.getItem('secondaryReferencePosition');
    return (saved === 'left' || saved === 'right') ? saved : 'right';
  });

  const [isDraggingTab, setIsDraggingTab] = useState(false);
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);

  const sideTabManagement = useSideTabManagement();
  const { sideTabSlots, assignTabToSlot, assignOmsToSlot, removeTabFromSlot, removeOmsFromSlot, updateOmsConfig, toggleSlotVisibility, updateSlotDisplayMode, updateSlotWidth, updateSlotColor, getTabLocation, getOmsLocation, closeSlot, addSlot, removeSideTabSlot, canAddSlot, canRemoveSlot, syncWithReferenceSettings } = sideTabManagement;

  const [pendingOmsConnection, setPendingOmsConnection] = useState<{ slotId: number; omsId: string } | null>(null);

  // Shared field visibility state (single source of truth for all panels)
  const fieldVisibility = useFieldVisibility();

  // Shared classification/customer-tag visibility & grade state (single source of truth)
  const classificationVisibility = useClassificationVisibility();
  const customerTagVisibility = useCustomerTagVisibility();
  const customerGradeState = useCustomerGrade('6fa36417-c923-4cee-aa54-cfbb3');

  const [referenceSettings, setReferenceSettings] = useState<ReferenceSettings | null>(null);
  const isRnbVisible = referenceSettings?.rnbVisible !== false;
  const isAnyResizing = isResizingSecondary || isResizingMain;

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getReferenceSettings();
      setReferenceSettings(settings);
    };
    loadSettings();
  }, []);

  const ensureMainReferenceActiveTab = useCallback((settings: ReferenceSettings, nextSecondaryTabId: string | null) => {
    const orderedMainTabIds = settings.tabs
      .filter(tab => tab.mainReference)
      .sort((a, b) => a.order - b.order)
      .map(tab => tab.id);

    if (orderedMainTabIds.length === 0) {
      setForcedMainReferenceTabId(null);
      return;
    }

    const activeTabIsInMain = orderedMainTabIds.includes(referenceActiveTab);
    const activeTabIsSecondary = nextSecondaryTabId !== null && referenceActiveTab === nextSecondaryTabId;

    if (!activeTabIsInMain || activeTabIsSecondary) {
      setForcedMainReferenceTabId(orderedMainTabIds[0]);
      return;
    }

    setForcedMainReferenceTabId(null);
  }, [referenceActiveTab]);

  const hideSecondaryReference = useCallback(() => {
    setIsSecondaryReferenceVisible(false);
    setSecondaryReferenceTabId(null);
  }, []);

  const applyReferenceSettings = useCallback((settings: ReferenceSettings) => {
    const leftTab = settings.tabs.find(tab => tab.leftSecondary);
    const rightTab = settings.tabs.find(tab => tab.rightSecondary);
    const nextSecondaryTabId = leftTab?.id ?? rightTab?.id ?? null;

    if (leftTab) {
      setSecondaryReferenceTabId(leftTab.id);
      setSecondaryReferencePosition('left');
      setIsSecondaryReferenceVisible(true);
    } else if (rightTab) {
      setSecondaryReferenceTabId(rightTab.id);
      setSecondaryReferencePosition('right');
      setIsSecondaryReferenceVisible(true);
    } else {
      hideSecondaryReference();
    }

    ensureMainReferenceActiveTab(settings, nextSecondaryTabId);
  }, [ensureMainReferenceActiveTab, hideSecondaryReference]);

  useEffect(() => {
    if (referenceSettings) {
      applyReferenceSettings(referenceSettings);
    }
  }, [referenceSettings, applyReferenceSettings]);

  const handleReferenceSettingsChange = useCallback((settings: ReferenceSettings) => {
    setReferenceSettings(settings);

    const { pendingOmsConnections } = syncWithReferenceSettings(settings);

    if (pendingOmsConnections.length > 0) {
      setPendingOmsConnection(pendingOmsConnections[0]);
    }

    // Propagate to parent (App.tsx) for taskButton settings
    useTaskStore.getState().handleReferenceSettingsChange(settings);
  }, [syncWithReferenceSettings]);

  const handleExpandTabToSecondary = useCallback((tabId: string) => {
    setSecondaryReferenceTabId(tabId);
    setIsSecondaryReferenceVisible(true);
  }, []);

  const handleCloseSecondaryReference = useCallback(async () => {
    const closingTabId = secondaryReferenceTabId;

    hideSecondaryReference();
    if (!closingTabId) return;

    const settings = referenceSettings ?? await getReferenceSettings();
    const updatedTabs = settings.tabs.map(tab => {
      if (tab.id !== closingTabId) {
        return tab;
      }

      return {
        ...tab,
        leftSecondary: false,
        rightSecondary: false,
        mainReference: true,
        sideTabSlotId: null,
      };
    });

    const updatedSettings = await saveSettings({ ...settings, tabs: updatedTabs });
    setReferenceSettings(updatedSettings);
    useTaskStore.getState().handleReferenceSettingsChange(updatedSettings);
  }, [hideSecondaryReference, referenceSettings, secondaryReferenceTabId]);

  const handleReferenceActiveTabChange = useCallback((tabId: string) => {
    setReferenceActiveTab(tabId);
    setForcedMainReferenceTabId(prev => (prev === tabId ? null : prev));
  }, []);

  const handleToggleSecondaryPosition = useCallback(() => {
    setSecondaryReferencePosition(prev => {
      const newPosition = prev === 'left' ? 'right' : 'left';
      localStorage.setItem('secondaryReferencePosition', newPosition);
      return newPosition;
    });
  }, []);

  const handleTabDragStart = useCallback((tabId: string) => {
    setIsDraggingTab(true);
    setDraggingTabId(tabId);
  }, []);

  const handleTabDragEnd = useCallback(() => {
    setIsDraggingTab(false);
    setDraggingTabId(null);
  }, []);

  const handleSideTabSlotClick = useCallback((slotId: number) => {
    toggleSlotVisibility(slotId);
  }, [toggleSlotVisibility]);

  const handleSideTabDrop = async (slotId: number, tabId: string) => {
    if (secondaryReferenceTabId === tabId) {
      hideSecondaryReference();
    }

    assignTabToSlot(slotId, tabId);
    handleTabDragEnd();

    const updatedSettings = await updateTabSideTabSlot(tabId, slotId);
    setReferenceSettings(updatedSettings);
  };

  const handleSideTabSelectTab = async (slotId: number, tabId: string) => {
    if (secondaryReferenceTabId === tabId) {
      hideSecondaryReference();
    }

    assignTabToSlot(slotId, tabId);

    const updatedSettings = await updateTabSideTabSlot(tabId, slotId);
    setReferenceSettings(updatedSettings);
  };

  const handleSideTabRemoveTab = async (slotId: number) => {
    const slot = sideTabSlots.find(s => s.id === slotId);
    if (slot?.tabId) {
      const updatedSettings = await updateTabSideTabSlot(slot.tabId, null);
      setReferenceSettings(updatedSettings);
    }
    removeTabFromSlot(slotId);
  };

  const handleSideTabOmsConnect = async (slotId: number, omsId: string, config: OmsConnectionConfig) => {
    assignOmsToSlot(slotId, omsId, config);

    const updatedSettings = await updateOmsSideTabSlot(omsId, slotId);
    setReferenceSettings(updatedSettings);
  };

  const handleSideTabRemoveOms = async (slotId: number) => {
    const slot = sideTabSlots.find(s => s.id === slotId);
    if (slot?.linkedOmsId) {
      const updatedSettings = await updateOmsSideTabSlot(slot.linkedOmsId, null);
      setReferenceSettings(updatedSettings);
    }
    removeOmsFromSlot(slotId);
  };

  const handleSideTabUpdateOmsConfig = (slotId: number, config: OmsConnectionConfig) => {
    updateOmsConfig(slotId, config);
  };

  const handleAddSlot = () => {
    addSlot();
  };

  const handleDeleteSlot = (slotId: number) => {
    removeSideTabSlot(slotId);
  };

  const getAvailableOmsList = useCallback((currentSlotOmsId?: string | null): Array<OmsInfo & { disabled?: boolean; disabledReason?: string }> => {
    return OMS_LIST.map(oms => {
      if (oms.id === currentSlotOmsId) return oms;

      const location = getOmsLocation(oms.id);
      if (location.location === 'slot') {
        return { ...oms, disabled: true, disabledReason: '다른 슬롯에서 사용 중' };
      }

      return oms;
    });
  }, [getOmsLocation]);

  const getTabName = useCallback((tabId: string): string => {
    const tabNames: { [key: string]: string } = {
      'info': '고객',
      'contact': 'Contact',
      'task': 'Task',
      'history': 'History',
      'integration': '연동',
      'assistant': 'Assistant',
    };

    if (tabNames[tabId]) {
      return tabNames[tabId];
    }

    // Check referenceSettings for custom/composite tab names
    if (referenceSettings) {
      const customTab = referenceSettings.tabs.find(t => t.id === tabId);
      if (customTab) return customTab.name;
    }

    const omsInfo = OMS_LIST.find(oms => oms.id === tabId);
    if (omsInfo) {
      return omsInfo.name;
    }

    return tabId;
  }, [referenceSettings]);

  const getAvailableTabs = useCallback((currentSlotTabId?: string | null) => {
    const baseTabs = [
      { id: 'info', name: '고객' },
      { id: 'contact', name: 'Contact' },
      { id: 'task', name: 'Task' },
      { id: 'history', name: 'History' },
      { id: 'integration', name: '연동' },
      { id: 'assistant', name: 'Assistant' },
    ];

    // Add composite tab if enabled
    if (referenceSettings?.compositeTab?.enabled) {
      const compositeTab = referenceSettings.tabs.find(t => t.id === 'custom-composite');
      if (compositeTab) {
        baseTabs.push({ id: compositeTab.id, name: compositeTab.name });
      }
    }

    // Add generic custom tabs
    if (referenceSettings) {
      referenceSettings.tabs
        .filter(t => t.isCustom && t.customTabKind !== 'composite')
        .forEach(t => {
          if (!baseTabs.some(b => b.id === t.id)) {
            baseTabs.push({ id: t.id, name: t.name });
          }
        });
    }

    return baseTabs.filter(tab => {
      if (tab.id === currentSlotTabId) return true;

      if (secondaryReferenceTabId === tab.id) return false;

      const location = getTabLocation(tab.id);
      if (location.location === 'slot') return false;

      return true;
    });
  }, [getTabLocation, referenceSettings, secondaryReferenceTabId]);

  const getLayoutInfo = useCallback(() => {
    if (!mainContentAreaRef.current) return null;

    const totalMainContentWidth = mainContentAreaRef.current.getBoundingClientRect().width;
    if (totalMainContentWidth === 0) return null;

    const hasSecondaryReference = isSecondaryReferenceVisible && !!secondaryReferenceTabId;
    const rnbWidth = isRnbVisible ? BASE_RNB_WIDTH : 0;
    const secondaryDividerWidth = hasSecondaryReference ? DIVIDER_WIDTH : 0;
    const availablePanelWidth = totalMainContentWidth
      - DIVIDER_WIDTH
      - rnbWidth
      - secondaryDividerWidth
      - MIN_CONTACT_ROOM_WIDTH;

    return {
      totalMainContentWidth,
      hasSecondaryReference,
      availablePanelWidth,
    };
  }, [mainContentAreaRef, isSecondaryReferenceVisible, secondaryReferenceTabId, isRnbVisible]);

  const clampPanelWidths = useCallback(() => {
    if (isAnyResizing) return;

    const layout = getLayoutInfo();
    if (!layout) return;

    const { hasSecondaryReference, availablePanelWidth } = layout;
    let nextMainWidth = referenceAreaWidth;
    let nextSecondaryWidth = secondaryReferenceAreaWidth;

    if (hasSecondaryReference) {
      nextMainWidth = Math.max(MIN_REFERENCE_WIDTH, Math.min(MAX_REFERENCE_WIDTH, nextMainWidth));
      nextSecondaryWidth = Math.max(MIN_REFERENCE_WIDTH, Math.min(MAX_REFERENCE_WIDTH, nextSecondaryWidth));

      const panelBudget = Math.max(0, availablePanelWidth);
      const overflow = Math.max(0, (nextMainWidth + nextSecondaryWidth) - panelBudget);
      if (overflow > 0) {
        // 메인 패널을 먼저 줄이고, 그 다음 보조 패널을 줄임
        const reduceMain = Math.min(Math.max(0, nextMainWidth - MIN_REFERENCE_WIDTH), overflow);
        nextMainWidth -= reduceMain;

        const remainingOverflow = overflow - reduceMain;
        if (remainingOverflow > 0) {
          // 보조 패널도 MIN 이하로 줄여서라도 overflow 방지
          nextSecondaryWidth = Math.max(0, nextSecondaryWidth - remainingOverflow);
        }
      }
    } else {
      const maxMainWidth = Math.max(MIN_REFERENCE_WIDTH, Math.min(MAX_REFERENCE_WIDTH, availablePanelWidth));
      nextMainWidth = Math.max(MIN_REFERENCE_WIDTH, Math.min(nextMainWidth, maxMainWidth));
    }

    if (nextMainWidth !== referenceAreaWidth) {
      setReferenceAreaWidth(nextMainWidth);
    }

    if (hasSecondaryReference && nextSecondaryWidth !== secondaryReferenceAreaWidth) {
      setSecondaryReferenceAreaWidth(nextSecondaryWidth);
    }
  }, [
    getLayoutInfo,
    isAnyResizing,
    referenceAreaWidth,
    secondaryReferenceAreaWidth,
  ]);

  useEffect(() => {
    clampPanelWidths();
  }, [clampPanelWidths]);

  useEffect(() => {
    if (!mainContentAreaRef.current) return;

    const observer = new ResizeObserver(() => {
      clampPanelWidths();
    });

    observer.observe(mainContentAreaRef.current);
    return () => observer.disconnect();
  }, [mainContentAreaRef, clampPanelWidths]);

  // 컨택룸 최소 폭을 보장하는 최대 패널 폭 계산 헬퍼
  const getMaxPanelWidth = React.useCallback((fixedOtherPanelWidth: number, hasSecondary: boolean) => {
    if (!mainContentAreaRef.current) return MAX_REFERENCE_WIDTH;
    const containerWidth = mainContentAreaRef.current.getBoundingClientRect().width;
    const rnbWidth = isRnbVisible ? BASE_RNB_WIDTH : 0;
    const dividerCount = hasSecondary ? 2 : 1;
    const otherPanelTotal = hasSecondary ? fixedOtherPanelWidth : 0;
    const available = containerWidth - MIN_CONTACT_ROOM_WIDTH - rnbWidth - (dividerCount * DIVIDER_WIDTH) - otherPanelTotal;
    return Math.min(MAX_REFERENCE_WIDTH, available);
  }, [mainContentAreaRef, isRnbVisible]);

  const handleMainResizeStart = React.useCallback((e: React.MouseEvent) => {
    setIsResizingMain(true);
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = referenceAreaWidth;
    const hasSecondary = isSecondaryReferenceVisible && !!secondaryReferenceTabId;
    const fixedSecondaryWidth = secondaryReferenceAreaWidth;
    const maxWidth = getMaxPanelWidth(fixedSecondaryWidth, hasSecondary);
    const effectiveMin = Math.min(MIN_REFERENCE_WIDTH, maxWidth);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const nextWidth = Math.max(
        effectiveMin,
        Math.min(maxWidth, startWidth - deltaX)
      );
      setReferenceAreaWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsResizingMain(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [referenceAreaWidth, secondaryReferenceAreaWidth, isSecondaryReferenceVisible, secondaryReferenceTabId, getMaxPanelWidth]);

  const handleSecondaryResizeStart = React.useCallback((e: React.MouseEvent) => {
    if (!isSecondaryReferenceVisible || !secondaryReferenceTabId) return;

    setIsResizingSecondary(true);
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = secondaryReferenceAreaWidth;
    const fixedMainWidth = referenceAreaWidth;

    const maxWidth = getMaxPanelWidth(fixedMainWidth, true);
    const effectiveMin = Math.min(MIN_REFERENCE_WIDTH, maxWidth);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const nextWidth = Math.max(
        effectiveMin,
        Math.min(maxWidth, startWidth - deltaX)
      );
      setSecondaryReferenceAreaWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsResizingSecondary(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [referenceAreaWidth, secondaryReferenceAreaWidth, isSecondaryReferenceVisible, secondaryReferenceTabId, getMaxPanelWidth]);

  const renderContactReferenceArea = () => {
    const hiddenTabIds = [
      ...new Set([
        ...sideTabSlots.filter(s => s.tabId).map(s => s.tabId!),
        ...(isSecondaryReferenceVisible && secondaryReferenceTabId ? [secondaryReferenceTabId] : []),
      ]),
    ];

    return (
      <div
        className="overflow-hidden h-full min-h-0 relative flex-shrink-0"
        style={{ width: `${referenceAreaWidth}px` }}
      >
        <ContactReferenceArea
          allRooms={allRooms}
          onSelectHistoricalRoom={onSelectHistoricalRoom}
          referenceAreaWidth={referenceAreaWidth}
          onActiveTabChange={handleReferenceActiveTabChange}
          forcedActiveTab={forcedMainReferenceTabId || undefined}
          externalReferenceSettings={referenceSettings}
          onTabDragStart={handleTabDragStart}
          onTabDragEnd={handleTabDragEnd}
          hiddenTabIds={hiddenTabIds}
          sideTabSlots={sideTabSlots}
          onAssignTabToSlot={assignTabToSlot}
          onRemoveTabFromSlot={removeTabFromSlot}
          onAddSlot={addSlot}
          onReferenceSettingsChange={handleReferenceSettingsChange}
          visibleFields={fieldVisibility.visibleFields}
          onToggleFieldVisibility={fieldVisibility.toggleFieldVisibility}
          columnSettings={fieldVisibility.columnSettings}
          onToggleColumnSetting={fieldVisibility.toggleColumnSetting}
          fieldOrder={fieldVisibility.fieldOrder}
          onUpdateFieldOrder={fieldVisibility.updateFieldOrder}
        />
      </div>
    );
  };

  const renderSideTabDrawerButtons = () => {
    if (isSearchModeActive) return null;

    const drawerSlots = sideTabSlots.filter(s => s.displayMode === 'drawer');

    if (drawerSlots.length === 0 && !canAddSlot) return null;

    return (
      <RightNavigationBar
        slots={drawerSlots}
        onSlotClick={handleSideTabSlotClick}
        onTabDrop={handleSideTabDrop}
        isDraggingTab={isDraggingTab}
        getTabName={getTabName}
        onAddSlot={handleAddSlot}
        canAddSlot={canAddSlot}
      />
    );
  };

  const renderSideTabOverlays = () => {
    if (!isRnbVisible) return null;

    return sideTabSlots.map((slot) => {
      if (!slot.isVisible) return null;

      const availableTabs = getAvailableTabs(slot.tabId);
      const availableOmsList = getAvailableOmsList(slot.linkedOmsId);

      return (
        <SideTabOverlay
          key={slot.id}
          slotId={slot.id}
          tabId={slot.tabId}
          linkedOmsId={slot.linkedOmsId}
          omsConfig={slot.omsConfig}
          color={slot.color}
          width={slot.width}
          displayMode={slot.displayMode}
          allRooms={allRooms}
          availableTabs={availableTabs}
          availableOmsList={availableOmsList}
          onClose={() => {
            closeSlot(slot.id);
          }}
          onSelectHistoricalRoom={onSelectHistoricalRoom}
          onWidthChange={(width) => updateSlotWidth(slot.id, width)}
          onSelectTab={(tabId) => handleSideTabSelectTab(slot.id, tabId)}
          onSelectOms={() => { }}
          onOmsConnect={(omsId, config) => handleSideTabOmsConnect(slot.id, omsId, config)}
          onChangeDisplayMode={(mode) => updateSlotDisplayMode(slot.id, mode)}
          onChangeColor={(color) => updateSlotColor(slot.id, color)}
          onRemoveTab={() => handleSideTabRemoveTab(slot.id)}
          onRemoveOms={() => handleSideTabRemoveOms(slot.id)}
          onUpdateOmsConfig={(config) => handleSideTabUpdateOmsConfig(slot.id, config)}
          canDeleteSlot={canRemoveSlot}
          onDeleteSlot={() => handleDeleteSlot(slot.id)}
        />
      );
    });
  };

  const handlePendingOmsConnect = useCallback((config: OmsConnectionConfig) => {
    if (pendingOmsConnection) {
      assignOmsToSlot(pendingOmsConnection.slotId, pendingOmsConnection.omsId, config);
      setPendingOmsConnection(null);
    }
  }, [pendingOmsConnection, assignOmsToSlot]);

  const handlePendingOmsCancel = useCallback(() => {
    setPendingOmsConnection(null);
  }, []);

  const renderOmsConnectionModal = () => {
    if (!pendingOmsConnection) return null;

    const oms = OMS_LIST.find(o => o.id === pendingOmsConnection.omsId);
    if (!oms) return null;

    return (
      <OmsConnectionModal
        oms={oms}
        existingConfig={null}
        onSave={handlePendingOmsConnect}
        onCancel={handlePendingOmsCancel}
      />
    );
  };

  const renderResizeDivider = (onMouseDown: (e: React.MouseEvent) => void, isResizing: boolean) => (
    <div
      className={cn(
        'group/handle relative flex items-center justify-center flex-shrink-0 cursor-col-resize',
        'w-[4px]',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] after:-translate-x-1/2',
        'after:transition-colors after:duration-150',
        isResizing
          ? 'after:bg-border-strong'
          : 'after:bg-muted hover:after:bg-border-darker active:after:bg-border-strong'
      )}
      onMouseDown={onMouseDown}
    >
      <div className={cn(
        'z-10 flex items-center justify-center',
        'w-4 h-6 rounded-sm',
        'bg-card border border-border-darker',
        'text-hint group-hover/handle:text-muted',
        'transition-colors duration-150'
      )}>
        <svg width="6" height="14" viewBox="0 0 6 14" fill="currentColor" aria-hidden="true">
          <circle cx="1.5" cy="1.5" r="1.5" />
          <circle cx="1.5" cy="7" r="1.5" />
          <circle cx="1.5" cy="12.5" r="1.5" />
          <circle cx="4.5" cy="1.5" r="1.5" />
          <circle cx="4.5" cy="7" r="1.5" />
          <circle cx="4.5" cy="12.5" r="1.5" />
        </svg>
      </div>
    </div>
  );

  const renderResizableLayout = (chatContent: React.ReactNode) => {
    const drawerSlots = sideTabSlots.filter(s => s.displayMode === 'drawer');
    const hasOpenOverlay = sideTabSlots.some(s => s.isVisible && s.displayMode === 'drawer');
    const hasSecondaryReference = isSecondaryReferenceVisible && !!secondaryReferenceTabId;

    const hiddenTabIds = [
      ...new Set([
        ...sideTabSlots.filter(s => s.tabId).map(s => s.tabId!),
        ...(hasSecondaryReference && secondaryReferenceTabId ? [secondaryReferenceTabId] : []),
      ]),
    ];

    const mainReferenceArea = (
      <div
        className="overflow-hidden h-full min-h-0 relative flex-shrink-0"
        style={{ width: `${referenceAreaWidth}px` }}
      >
        <ContactReferenceArea
          allRooms={allRooms}
          onSelectHistoricalRoom={onSelectHistoricalRoom}
          referenceAreaWidth={referenceAreaWidth}
          onActiveTabChange={handleReferenceActiveTabChange}
          forcedActiveTab={forcedMainReferenceTabId || undefined}
          externalReferenceSettings={referenceSettings}
          onTabDragStart={handleTabDragStart}
          onTabDragEnd={handleTabDragEnd}
          hiddenTabIds={hiddenTabIds}
          sideTabSlots={sideTabSlots}
          onAssignTabToSlot={assignTabToSlot}
          onRemoveTabFromSlot={removeTabFromSlot}
          onAddSlot={addSlot}
          onReferenceSettingsChange={handleReferenceSettingsChange}
          visibleFields={fieldVisibility.visibleFields}
          onToggleFieldVisibility={fieldVisibility.toggleFieldVisibility}
          columnSettings={fieldVisibility.columnSettings}
          onToggleColumnSetting={fieldVisibility.toggleColumnSetting}
          fieldOrder={fieldVisibility.fieldOrder}
          onUpdateFieldOrder={fieldVisibility.updateFieldOrder}
          classificationVisibility={classificationVisibility.visibleItems}
          onToggleClassificationVisibility={classificationVisibility.toggleItem}
          classificationAllItems={classificationVisibility.allItems}
          customerTagVisibility={customerTagVisibility.visibleItems}
          onToggleCustomerTagVisibility={customerTagVisibility.toggleItem}
          customerTagAllItems={customerTagVisibility.allItems}
          customerGrade={customerGradeState.grade}
          onChangeCustomerGrade={customerGradeState.changeGrade}
          gradeOptions={customerGradeState.gradeOptions}
        />
      </div>
    );

    const secondaryReferenceArea = hasSecondaryReference && secondaryReferenceTabId ? (
      <div
        className="overflow-hidden h-full min-h-0 relative flex-shrink-0"
        style={{ width: `${secondaryReferenceAreaWidth}px` }}
      >
        <SecondaryReferenceArea
          tabId={secondaryReferenceTabId}
          onClose={handleCloseSecondaryReference}
          allRooms={allRooms}
          onSelectHistoricalRoom={onSelectHistoricalRoom}
          position={secondaryReferencePosition}
          onTogglePosition={handleToggleSecondaryPosition}
          referenceSettings={referenceSettings}
          onReferenceSettingsChange={handleReferenceSettingsChange}
          visibleFields={fieldVisibility.visibleFields}
          onToggleFieldVisibility={fieldVisibility.toggleFieldVisibility}
          columnSettings={fieldVisibility.columnSettings}
          onToggleColumnSetting={fieldVisibility.toggleColumnSetting}
          fieldOrder={fieldVisibility.fieldOrder}
          onUpdateFieldOrder={fieldVisibility.updateFieldOrder}
          classificationVisibility={classificationVisibility.visibleItems}
          onToggleClassificationVisibility={classificationVisibility.toggleItem}
          classificationAllItems={classificationVisibility.allItems}
          customerTagVisibility={customerTagVisibility.visibleItems}
          onToggleCustomerTagVisibility={customerTagVisibility.toggleItem}
          customerTagAllItems={customerTagVisibility.allItems}
          customerGrade={customerGradeState.grade}
          onChangeCustomerGrade={customerGradeState.changeGrade}
          gradeOptions={customerGradeState.gradeOptions}
        />
      </div>
    ) : null;

    return (
      <div className="flex h-full w-full bg-white">
        {/* Chat area: takes remaining space */}
        <div className="h-full min-h-0 overflow-hidden" style={{ flex: 1, minWidth: `${MIN_CONTACT_ROOM_WIDTH}px` }}>
          {chatContent}
        </div>

        {/* Secondary on LEFT */}
        {hasSecondaryReference && secondaryReferencePosition === 'left' && renderResizeDivider(handleSecondaryResizeStart, isResizingSecondary)}
        {hasSecondaryReference && secondaryReferencePosition === 'left' && secondaryReferenceArea}

        {/* Main reference divider (always present) */}
        {renderResizeDivider(handleMainResizeStart, isResizingMain)}

        {/* Main reference panel */}
        {mainReferenceArea}

        {/* Secondary on RIGHT */}
        {hasSecondaryReference && secondaryReferencePosition === 'right' && renderResizeDivider(handleSecondaryResizeStart, isResizingSecondary)}
        {hasSecondaryReference && secondaryReferencePosition === 'right' && secondaryReferenceArea}

        {/* Right Navigation Bar */}
        {isRnbVisible && !isSearchModeActive && (drawerSlots.length > 0 || canAddSlot) && (
          <RightNavigationBar
            slots={drawerSlots}
            onSlotClick={handleSideTabSlotClick}
            onTabDrop={handleSideTabDrop}
            isDraggingTab={isDraggingTab}
            getTabName={getTabName}
            onAddSlot={handleAddSlot}
            canAddSlot={canAddSlot}
            hasOpenOverlay={hasOpenOverlay}
          />
        )}
      </div>
    );
  };

  return {
    referenceAreaWidth,
    isSecondaryReferenceVisible,
    secondaryReferenceTabId,
    secondaryReferencePosition,
    secondaryReferenceAreaWidth,
    isDraggingTab,
    draggingTabId,
    isResizingSecondary,
    isResizingMain,
    sideTabSlots,
    handleExpandTabToSecondary,
    handleCloseSecondaryReference,
    handleReferenceActiveTabChange,
    handleTabDragStart,
    handleTabDragEnd,
    handleSideTabSlotClick,
    handleSideTabDrop,
    handleSideTabSelectTab,
    handleSideTabRemoveTab,
    handleAddSlot,
    handleDeleteSlot,
    canAddSlot,
    canRemoveSlot,
    getTabName,
    getAvailableTabs,
    renderContactReferenceArea,
    renderSideTabDrawerButtons,
    renderSideTabOverlays,
    renderOmsConnectionModal,
    renderResizableLayout,
  };
}
