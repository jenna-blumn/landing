import React, { useState, useEffect } from 'react';
import { Icon, Button, Input, Select, Switch, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@blumnai-studio/blumnai-design-system';
import {
  ReferenceTabConfig,
  ReferenceSettings,
  isTabVisible,
  COMPOSITE_TAB_ID,
  DEFAULT_COMPOSITE_TAB,
} from '../../features/referenceSettings/types';
import {
  getReferenceSettings,
  clearCache,
} from '../../features/referenceSettings/api/referenceSettingsApi';
import { SideTabConfig } from '../../types/sideTab';

interface ReferenceSettingsPanelProps {
  onClose: () => void;
  sideTabSlots: SideTabConfig[];
  onSaveSettings?: (settings: ReferenceSettings) => void;
}

const ReferenceSettingsPanel: React.FC<ReferenceSettingsPanelProps> = ({
  onClose,
  sideTabSlots,
  onSaveSettings,
}) => {
  const [originalSettings, setOriginalSettings] = useState<ReferenceSettings | null>(null);
  const [draftSettings, setDraftSettings] = useState<ReferenceSettings | null>(null);
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);
  const [newTabName, setNewTabName] = useState('');
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const maxSlots = 5;

  useEffect(() => {
    const loadSettings = async () => {
      clearCache();
      const loadedSettings = await getReferenceSettings();
      setOriginalSettings(loadedSettings);
      setDraftSettings(JSON.parse(JSON.stringify(loadedSettings)));
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (originalSettings && draftSettings) {
      const changed = JSON.stringify(originalSettings) !== JSON.stringify(draftSettings);
      setHasChanges(changed);
    }
  }, [originalSettings, draftSettings]);

  const handlePositionToggle = (
    tabId: string,
    position: 'left' | 'main' | 'right',
    currentValue: boolean
  ) => {
    if (!draftSettings) return;

    const newEnabled = !currentValue;
    const updates: Partial<ReferenceTabConfig> = {};

    if (position === 'left') {
      updates.leftSecondary = newEnabled;
      if (newEnabled) {
        updates.rightSecondary = false;
        updates.mainReference = false;
        updates.sideTabSlotId = null;
      }
    } else if (position === 'main') {
      updates.mainReference = newEnabled;
      if (newEnabled) {
        updates.leftSecondary = false;
        updates.rightSecondary = false;
        updates.sideTabSlotId = null;
      }
    } else if (position === 'right') {
      updates.rightSecondary = newEnabled;
      if (newEnabled) {
        updates.leftSecondary = false;
        updates.mainReference = false;
        updates.sideTabSlotId = null;
      }
    }

    const updatedTabs = draftSettings.tabs.map(tab => {
      if (tab.id === tabId) {
        return { ...tab, ...updates };
      }
      if ((position === 'left' || position === 'right') && newEnabled) {
        return { ...tab, leftSecondary: false, rightSecondary: false };
      }
      return tab;
    });

    setDraftSettings({ ...draftSettings, tabs: updatedTabs });
  };

  const handleSideTabChange = (tabId: string, slotId: number | null) => {
    if (!draftSettings) return;

    const updates: Partial<ReferenceTabConfig> = { sideTabSlotId: slotId };
    if (slotId !== null) {
      updates.leftSecondary = false;
      updates.mainReference = false;
      updates.rightSecondary = false;
    }

    const updatedTabs = draftSettings.tabs.map(tab => {
      if (tab.sideTabSlotId === slotId && slotId !== null && tab.id !== tabId) {
        return { ...tab, sideTabSlotId: null };
      }
      if (tab.id === tabId) {
        return { ...tab, ...updates };
      }
      return tab;
    });

    const updatedOmsList = draftSettings.omsList.map(oms => {
      if (oms.sideTabSlotId === slotId && slotId !== null) {
        return { ...oms, sideTabSlotId: null };
      }
      return oms;
    });

    setDraftSettings({ ...draftSettings, tabs: updatedTabs, omsList: updatedOmsList });
  };

  const handleOmsSideTabChange = (omsId: string, slotId: number | null) => {
    if (!draftSettings) return;

    const updatedTabs = draftSettings.tabs.map(tab => {
      if (tab.sideTabSlotId === slotId && slotId !== null) {
        return { ...tab, sideTabSlotId: null };
      }
      return tab;
    });

    const updatedOmsList = draftSettings.omsList.map(oms => {
      if (oms.sideTabSlotId === slotId && slotId !== null && oms.id !== omsId) {
        return { ...oms, sideTabSlotId: null };
      }
      if (oms.id === omsId) {
        return { ...oms, sideTabSlotId: slotId };
      }
      return oms;
    });

    setDraftSettings({ ...draftSettings, tabs: updatedTabs, omsList: updatedOmsList });
  };

  const handleRnbVisibilityToggle = () => {
    if (!draftSettings) return;

    const newRnbVisible = !draftSettings.rnbVisible;

    if (!newRnbVisible) {
      const updatedTabs = draftSettings.tabs.map(tab => {
        if (tab.sideTabSlotId !== null) {
          return {
            ...tab,
            sideTabSlotId: null,
            mainReference: true,
          };
        }
        return tab;
      });

      setDraftSettings({
        ...draftSettings,
        rnbVisible: newRnbVisible,
        tabs: updatedTabs,
      });
    } else {
      setDraftSettings({
        ...draftSettings,
        rnbVisible: newRnbVisible,
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    const tab = draftSettings?.tabs.find(t => t.id === tabId);
    if (!tab || !isTabVisible(tab)) {
      e.preventDefault();
      return;
    }
    setDraggingTabId(tabId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetTabId: string) => {
    e.preventDefault();
    const targetTab = draftSettings?.tabs.find(t => t.id === targetTabId);
    if (!targetTab || !isTabVisible(targetTab)) return;

    if (draggingTabId && draggingTabId !== targetTabId) {
      setDragOverTabId(targetTabId);
    }
  };

  const handleDragEnd = () => {
    setDraggingTabId(null);
    setDragOverTabId(null);
  };

  const handleDrop = (e: React.DragEvent, targetTabId: string) => {
    e.preventDefault();
    if (!draggingTabId || !draftSettings || draggingTabId === targetTabId) {
      handleDragEnd();
      return;
    }

    const targetTab = draftSettings.tabs.find(t => t.id === targetTabId);
    if (!targetTab || !isTabVisible(targetTab)) {
      handleDragEnd();
      return;
    }

    const visibleTabs = draftSettings.tabs.filter(t => isTabVisible(t)).sort((a, b) => a.order - b.order);
    const hiddenTabs = draftSettings.tabs.filter(t => !isTabVisible(t));

    const dragIndex = visibleTabs.findIndex(t => t.id === draggingTabId);
    const dropIndex = visibleTabs.findIndex(t => t.id === targetTabId);

    if (dragIndex === -1 || dropIndex === -1) {
      handleDragEnd();
      return;
    }

    const reorderedVisible = [...visibleTabs];
    const [removed] = reorderedVisible.splice(dragIndex, 1);
    reorderedVisible.splice(dropIndex, 0, removed);

    const updatedTabs = [
      ...reorderedVisible.map((tab, index) => ({ ...tab, order: index })),
      ...hiddenTabs.map((tab, index) => ({ ...tab, order: reorderedVisible.length + index })),
    ];

    setDraftSettings({ ...draftSettings, tabs: updatedTabs });
    handleDragEnd();
  };

  const handleAddTab = () => {
    if (!newTabName.trim() || !draftSettings) return;

    const maxOrder = Math.max(...draftSettings.tabs.map(t => t.order), -1);
    const newId = `custom-${Date.now()}`;

    const newTab: ReferenceTabConfig = {
      id: newId,
      name: newTabName.trim(),
      order: maxOrder + 1,
      leftSecondary: false,
      mainReference: true,
      rightSecondary: false,
      sideTabSlotId: null,
      isCustom: true,
    };

    setDraftSettings({
      ...draftSettings,
      tabs: [...draftSettings.tabs, newTab],
    });
    setNewTabName('');
    setIsAddingTab(false);
  };

  const handleRemoveCustomTab = (tabId: string) => {
    if (!draftSettings) return;

    const tab = draftSettings.tabs.find(t => t.id === tabId);
    if (!tab || !tab.isCustom) return;

    const updatedTabs = draftSettings.tabs.filter(t => t.id !== tabId);
    setDraftSettings({ ...draftSettings, tabs: updatedTabs });
  };

  const handleSave = () => {
    if (draftSettings) {
      onSaveSettings?.(draftSettings);
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const getUsedSlots = (): Set<number> => {
    if (!draftSettings) return new Set();

    const usedSlots = new Set<number>();
    draftSettings.tabs.forEach(tab => {
      if (tab.sideTabSlotId !== null) {
        usedSlots.add(tab.sideTabSlotId);
      }
    });
    draftSettings.omsList.forEach(oms => {
      if (oms.sideTabSlotId !== null) {
        usedSlots.add(oms.sideTabSlotId);
      }
    });
    return usedSlots;
  };

  const renderSideTabDropdown = (
    currentSlotId: number | null,
    onChange: (slotId: number | null) => void,
    disabled: boolean = false
  ) => {
    const usedSlots = getUsedSlots();

    const options = [
      { id: 'none', label: '없음' },
      ...Array.from({ length: maxSlots }, (_, i) => i + 1).map(slotId => {
        const isUsed = usedSlots.has(slotId) && currentSlotId !== slotId;
        const slotExists = sideTabSlots.some(s => s.id === slotId);
        return {
          id: String(slotId),
          label: `${slotId}번${!slotExists ? ' (새로 생성)' : ''}${isUsed ? ' (사용 중)' : ''}`,
          disabled: isUsed,
        };
      }),
    ];

    return (
      <Select
        options={options}
        value={currentSlotId === null ? 'none' : String(currentSlotId)}
        onChange={(val) => onChange(val === 'none' ? null : parseInt(val, 10))}
        disabled={disabled}
        size="sm"
      />
    );
  };

  const renderToggleButton = (
    enabled: boolean,
    onClick: () => void
  ) => {
    return (
      <Button
        buttonStyle={enabled ? 'primary' : 'secondary'}
        size="xs"
        onClick={onClick}
      >
        {enabled ? 'ON' : 'OFF'}
      </Button>
    );
  };

  if (!draftSettings) {
    return (
      <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/30">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const sortedTabs = [...draftSettings.tabs]
    .filter(tab => {
      // Hide composite tab from table when disabled
      if (tab.id === COMPOSITE_TAB_ID && !draftSettings.compositeTab?.enabled) return false;
      return true;
    })
    .sort((a, b) => {
      const aVisible = isTabVisible(a);
      const bVisible = isTabVisible(b);
      if (aVisible && !bVisible) return -1;
      if (!aVisible && bVisible) return 1;
      return a.order - b.order;
    });

  return (
    <>
    <div className="fixed inset-0 z-[59]">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 bottom-0 w-[450px] max-w-[90vw] bg-white shadow-2xl flex flex-col z-60 animate-slide-in-right">
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-800">레퍼런스 설정</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCancel}
            buttonStyle="ghost"
            size="xs"
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            buttonStyle="primary"
            size="xs"
            leadIcon={<Icon iconType={['system', 'check']} size={14} />}
          >
            저장
          </Button>
          <Button
            onClick={onClose}
            variant="iconOnly"
            buttonStyle="ghost"
            size="xs"
            leadIcon={<Icon iconType={['system', 'close']} size={18} />}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            RNB 보기 설정
          </h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <div className="flex items-center gap-2">
              {draftSettings.rnbVisible ? (
                <Icon iconType={['system', 'eye']} size={16} color="informative" />
              ) : (
                <Icon iconType={['system', 'eye-off']} size={16} color="default-muted" />
              )}
              <div>
                <div className="text-sm font-medium text-gray-700">RNB 보기</div>
                <div className="text-xs text-gray-500">Right Navigation Bar 표시 여부를 설정합니다</div>
              </div>
            </div>
            <Switch
              checked={draftSettings.rnbVisible}
              onCheckedChange={() => handleRnbVisibilityToggle()}
              color="blue"
            />
          </div>
          {!draftSettings.rnbVisible && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <p className="text-xs text-amber-800 flex items-center gap-1">
                <Icon iconType={['system', 'eye-off']} size={14} />
                RNB가 비활성화되어 있습니다. RNB 설정을 하려면 RNB 보기를 켜세요.
              </p>
            </div>
          )}
        </div>

        {/* Task Button Settings */}
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            태스크 버튼 설정
          </h3>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs text-gray-500 mb-2">태스크 버튼의 표시 위치를 설정합니다</div>
            <div className="flex flex-wrap gap-1">
              <Button
                buttonStyle={(!draftSettings?.taskButton || draftSettings.taskButton.displayMode === 'gnb') ? 'primary' : 'secondary'}
                size="xs"
                onClick={() => {
                  if (!draftSettings) return;
                  setDraftSettings({
                    ...draftSettings,
                    taskButton: {
                      displayMode: 'gnb',
                      fixedDrawerHeight: draftSettings.taskButton?.fixedDrawerHeight || 300,
                    },
                  });
                }}
              >
                GNB
              </Button>
              <Button
                buttonStyle={draftSettings?.taskButton?.displayMode === 'rnb' ? 'primary' : 'secondary'}
                size="xs"
                onClick={() => {
                  if (!draftSettings) return;
                  setDraftSettings({
                    ...draftSettings,
                    taskButton: {
                      displayMode: 'rnb',
                      fixedDrawerHeight: draftSettings.taskButton?.fixedDrawerHeight || 300,
                    },
                  });
                }}
              >
                RNB
              </Button>
              <Button
                buttonStyle={draftSettings?.taskButton?.displayMode === 'floating' ? 'primary' : 'secondary'}
                size="xs"
                onClick={() => {
                  if (!draftSettings) return;
                  setDraftSettings({
                    ...draftSettings,
                    taskButton: {
                      displayMode: 'floating',
                      fixedDrawerHeight: draftSettings.taskButton?.fixedDrawerHeight || 300,
                    },
                  });
                }}
              >
                플로팅
              </Button>
              <Button
                buttonStyle={draftSettings?.taskButton?.displayMode === 'fixed' ? 'primary' : 'secondary'}
                size="xs"
                onClick={() => {
                  if (!draftSettings) return;
                  setDraftSettings({
                    ...draftSettings,
                    taskButton: {
                      displayMode: 'fixed',
                      fixedDrawerHeight: draftSettings.taskButton?.fixedDrawerHeight || 300,
                    },
                  });
                }}
              >
                레퍼런스 하단 고정
              </Button>
              <Button
                buttonStyle={draftSettings?.taskButton?.displayMode === 'sidebar-fixed' ? 'primary' : 'secondary'}
                size="xs"
                onClick={() => {
                  if (!draftSettings) return;
                  setDraftSettings({
                    ...draftSettings,
                    taskButton: {
                      displayMode: 'sidebar-fixed',
                      fixedDrawerHeight: draftSettings.taskButton?.fixedDrawerHeight || 300,
                    },
                  });
                }}
              >
                사이드바 하단 고정
              </Button>
            </div>
          </div>
        </div>

        {/* Composite Tab Settings */}
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            맞춤 탭 보기 설정
          </h3>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {draftSettings.compositeTab?.enabled ? (
                  <Icon iconType={['system', 'eye']} size={16} color="informative" />
                ) : (
                  <Icon iconType={['system', 'eye-off']} size={16} color="default-muted" />
                )}
                <div>
                  <div className="text-sm font-medium text-gray-700">맞춤 탭 보기</div>
                  <div className="text-xs text-gray-500">카드를 조합하여 나만의 탭을 구성합니다</div>
                </div>
              </div>
              <Switch
                checked={draftSettings.compositeTab?.enabled ?? false}
                onCheckedChange={() => {
                  if (!draftSettings) return;
                  const currentComposite = draftSettings.compositeTab || { ...DEFAULT_COMPOSITE_TAB };
                  const newEnabled = !currentComposite.enabled;

                  const updatedTabs = [...draftSettings.tabs];
                  if (newEnabled) {
                    const hasCompositeTab = updatedTabs.some(t => t.id === COMPOSITE_TAB_ID);
                    if (!hasCompositeTab) {
                      const maxOrder = Math.max(...updatedTabs.map(t => t.order), -1);
                      updatedTabs.push({
                        id: COMPOSITE_TAB_ID,
                        name: currentComposite.name || '맞춤',
                        order: maxOrder + 1,
                        leftSecondary: false,
                        mainReference: true,
                        rightSecondary: false,
                        sideTabSlotId: null,
                        isCustom: true,
                        customTabKind: 'composite',
                      });
                    }
                  }

                  setDraftSettings({
                    ...draftSettings,
                    tabs: updatedTabs,
                    compositeTab: {
                      ...currentComposite,
                      enabled: newEnabled,
                    },
                  });
                }}
                color="blue"
              />
            </div>
            {draftSettings.compositeTab?.enabled && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Input
                  label="맞춤 탭 이름"
                  value={draftSettings.compositeTab?.name || '맞춤'}
                  onChange={e => {
                    if (!draftSettings) return;
                    const currentComposite = draftSettings.compositeTab || { ...DEFAULT_COMPOSITE_TAB };
                    const newName = e.target.value;
                    const updatedTabs = draftSettings.tabs.map(t =>
                      t.id === COMPOSITE_TAB_ID ? { ...t, name: newName } : t
                    );
                    setDraftSettings({
                      ...draftSettings,
                      tabs: updatedTabs,
                      compositeTab: { ...currentComposite, name: newName },
                    });
                  }}
                  placeholder="맞춤 탭 이름"
                  size="sm"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            레퍼런스 탭 설정
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            각 탭이 표시될 위치를 선택하세요. 아무 위치도 선택하지 않으면 해당 탭은 숨겨집니다.
          </p>
          <Table bordered className="text-xs">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="px-2 py-2 text-left font-medium text-gray-600 w-8"></TableHead>
                  <TableHead className="px-2 py-2 text-left font-medium text-gray-600">탭명</TableHead>
                  <TableHead className="px-2 py-2 text-center font-medium text-gray-600 w-16">
                    <div className="leading-tight">왼쪽<br />보조</div>
                  </TableHead>
                  <TableHead className="px-2 py-2 text-center font-medium text-gray-600 w-16">
                    <div className="leading-tight">메인<br />레퍼런스</div>
                  </TableHead>
                  <TableHead className="px-2 py-2 text-center font-medium text-gray-600 w-16">
                    <div className="leading-tight">오른쪽<br />보조</div>
                  </TableHead>
                  <TableHead className={`px-2 py-2 text-center font-medium w-24 ${!draftSettings.rnbVisible ? 'text-gray-400' : 'text-gray-600'}`}>RNB</TableHead>
                  {sortedTabs.some(t => t.isCustom) && (
                    <TableHead className="px-2 py-2 text-center font-medium text-gray-600 w-10"></TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTabs.map(tab => {
                  const isDragging = draggingTabId === tab.id;
                  const isDragOver = dragOverTabId === tab.id;
                  const tabIsVisible = isTabVisible(tab);
                  const canDrag = tabIsVisible;

                  return (
                    <TableRow
                      key={tab.id}
                      draggable={canDrag}
                      onDragStart={e => handleDragStart(e, tab.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={e => handleDragOver(e, tab.id)}
                      onDrop={e => handleDrop(e, tab.id)}
                      className={`border-b border-gray-100 last:border-b-0 transition-colors ${
                        isDragging ? 'opacity-50 bg-blue-50' : ''
                      } ${isDragOver ? 'bg-blue-100' : ''} ${
                        !tabIsVisible ? 'bg-gray-50 text-gray-400' : 'hover:bg-gray-50'
                      }`}
                    >
                      <TableCell className="px-2 py-2">
                        <div
                          className={`${
                            canDrag ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed'
                          }`}
                        >
                          <Icon
                            iconType={['editor', 'draggable']}
                            size={14}
                            color={canDrag ? 'default-muted' : 'default-disabled'}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-2 font-medium">
                        {tab.name}
                        {tab.isCustom && tab.customTabKind === 'composite' && (
                          <span className="ml-1 text-[10px] text-purple-500">(맞춤)</span>
                        )}
                        {tab.isCustom && tab.customTabKind !== 'composite' && (
                          <span className="ml-1 text-[10px] text-blue-500">(커스텀)</span>
                        )}
                      </TableCell>
                      <TableCell className="px-2 py-2 text-center">
                        {renderToggleButton(
                          tab.leftSecondary,
                          () => handlePositionToggle(tab.id, 'left', tab.leftSecondary)
                        )}
                      </TableCell>
                      <TableCell className="px-2 py-2 text-center">
                        {renderToggleButton(
                          tab.mainReference,
                          () => handlePositionToggle(tab.id, 'main', tab.mainReference)
                        )}
                      </TableCell>
                      <TableCell className="px-2 py-2 text-center">
                        {renderToggleButton(
                          tab.rightSecondary,
                          () => handlePositionToggle(tab.id, 'right', tab.rightSecondary)
                        )}
                      </TableCell>
                      <TableCell className={`px-2 py-2 ${!draftSettings.rnbVisible ? 'opacity-50' : ''}`}>
                        {renderSideTabDropdown(
                          tab.sideTabSlotId,
                          slotId => handleSideTabChange(tab.id, slotId),
                          !draftSettings.rnbVisible
                        )}
                      </TableCell>
                      {sortedTabs.some(t => t.isCustom) && (
                        <TableCell className="px-2 py-2 text-center">
                          {tab.isCustom && tab.customTabKind !== 'composite' && (
                            <Button
                              onClick={() => handleRemoveCustomTab(tab.id)}
                              variant="iconOnly"
                              buttonStyle="ghost"
                              size="xs"
                              className="text-red-400"
                              leadIcon={<Icon iconType={['system', 'delete-bin']} size={14} />}
                            />
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={sortedTabs.some(t => t.isCustom) ? 7 : 6} className="px-2 py-2">
                    {isAddingTab ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={newTabName}
                          onChange={e => setNewTabName(e.target.value)}
                          placeholder="새 탭 이름"
                          autoFocus
                          size="sm"
                          className="flex-1"
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleAddTab();
                            if (e.key === 'Escape') {
                              setIsAddingTab(false);
                              setNewTabName('');
                            }
                          }}
                        />
                        <Button
                          onClick={handleAddTab}
                          buttonStyle="primary"
                          size="xs"
                        >
                          추가
                        </Button>
                        <Button
                          onClick={() => {
                            setIsAddingTab(false);
                            setNewTabName('');
                          }}
                          buttonStyle="secondary"
                          size="xs"
                        >
                          취소
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setIsAddingTab(true)}
                        buttonStyle="ghost"
                        size="xs"
                        leadIcon={<Icon iconType={['system', 'add']} size={14} />}
                      >
                        추가
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
        </div>

          <div className={!draftSettings.rnbVisible ? 'opacity-50 pointer-events-none' : ''}>
            <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              OMS 설정
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              OMS는 RNB에만 연동할 수 있습니다.
            </p>
            <Table bordered className="text-xs">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="px-2 py-2 text-left font-medium text-gray-600">OMS명</TableHead>
                    <TableHead className="px-2 py-2 text-center font-medium text-gray-600 w-24">RNB</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {draftSettings.omsList.map(oms => (
                    <TableRow key={oms.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                      <TableCell className="px-2 py-2 font-medium">{oms.name}</TableCell>
                      <TableCell className="px-2 py-2">
                        {renderSideTabDropdown(
                          oms.sideTabSlotId,
                          slotId => handleOmsSideTabChange(oms.id, slotId),
                          !draftSettings.rnbVisible
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default ReferenceSettingsPanel;
