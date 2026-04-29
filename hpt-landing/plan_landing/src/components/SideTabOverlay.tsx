import React, { useState, useEffect } from 'react';
import { Button, Icon } from '@blumnai-studio/blumnai-design-system';
import ContactReferenceArea from './ContactReferenceArea';
import SideTabSettings from './SideTabSettings';
import SideTabEmptyState from './SideTabEmptyState';
import OmsContentPlaceholder from './OmsContentPlaceholder';
import OmsConnectionModal from './OmsConnectionModal';
import { Room } from '../data/mockData';
import { OmsInfo, OmsConnectionConfig, OMS_LIST } from '../types/sideTab';

interface SideTabOverlayProps {
  slotId: number;
  tabId: string | null;
  linkedOmsId: string | null;
  omsConfig: OmsConnectionConfig | null;
  color: string;
  width: number;
  displayMode: 'drawer';
  allRooms: Room[];
  availableTabs: Array<{ id: string; name: string }>;
  availableOmsList: Array<OmsInfo & { disabled?: boolean; disabledReason?: string }>;
  onClose: () => void;
  onSelectHistoricalRoom: (roomId: number) => void;
  onWidthChange: (width: number) => void;
  onSelectTab: (tabId: string) => void;
  onSelectOms: (omsId: string) => void;
  onOmsConnect: (omsId: string, config: OmsConnectionConfig) => void;
  onChangeDisplayMode: (mode: 'drawer') => void;
  onChangeColor: (color: string) => void;
  onRemoveTab: () => void;
  onRemoveOms: () => void;
  onUpdateOmsConfig: (config: OmsConnectionConfig) => void;
  canDeleteSlot: boolean;
  onDeleteSlot: () => void;
}

const SideTabOverlay: React.FC<SideTabOverlayProps> = ({
  slotId,
  tabId,
  linkedOmsId,
  omsConfig,
  color,
  width,
  displayMode,
  allRooms,
  availableTabs,
  availableOmsList,
  onClose,
  onSelectHistoricalRoom,
  onWidthChange,
  onSelectTab,
  onSelectOms: _onSelectOms,
  onOmsConnect,
  onChangeDisplayMode,
  onChangeColor,
  onRemoveTab,
  onRemoveOms,
  onUpdateOmsConfig: _onUpdateOmsConfig,
  canDeleteSlot,
  onDeleteSlot,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOmsModal, setShowOmsModal] = useState(false);
  const [pendingOmsId, setPendingOmsId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDeleteSlot = () => {
    if (tabId || linkedOmsId) {
      alert('연동된 콘텐츠가 있습니다.\n\n먼저 연동을 해제한 후 사이드탭을 삭제해주세요.');
      return;
    }

    const confirmed = window.confirm('이 사이드탭을 삭제하시겠습니까?');
    if (confirmed) {
      setShowSettings(false);
      onDeleteSlot();
    }
  };

  const handleSelectOms = (omsId: string) => {
    setPendingOmsId(omsId);
    setShowOmsModal(true);
  };

  const handleOmsModalSave = (config: OmsConnectionConfig) => {
    if (pendingOmsId) {
      onOmsConnect(pendingOmsId, config);
    }
    setShowOmsModal(false);
    setPendingOmsId(null);
  };

  const handleOmsModalCancel = () => {
    setShowOmsModal(false);
    setPendingOmsId(null);
  };

  const handleEditOmsConfig = () => {
    if (linkedOmsId) {
      setPendingOmsId(linkedOmsId);
      setShowOmsModal(true);
      setShowSettings(false);
    }
  };

  const handleRefresh = async () => {
    if (!linkedOmsId) return;

    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getOmsName = (omsId: string): string => {
    return OMS_LIST.find(o => o.id === omsId)?.name || omsId;
  };

  const currentOms = linkedOmsId ? OMS_LIST.find(o => o.id === linkedOmsId) : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const newWidth = Math.min(Math.max(startWidth + deltaX, 270), 800);
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const tabName = tabId
    ? (availableTabs.find(t => t.id === tabId)?.name || '레퍼런스')
    : linkedOmsId
      ? getOmsName(linkedOmsId)
      : '사이드탭';

  const pendingOms = pendingOmsId ? OMS_LIST.find(o => o.id === pendingOmsId) : null;

  const RNB_WIDTH = 48;
  const ACKNOWLEDGEMENT_HEIGHT = 36;

  return (
    <div
      className="fixed bottom-0 bg-white z-40 flex flex-col animate-slide-in-right overlay-shadow"
      style={{ width: `${width}px`, right: `${RNB_WIDTH}px`, top: `${ACKNOWLEDGEMENT_HEIGHT}px` }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize transition-colors z-10"
        style={{
          backgroundColor: isResizing ? color : undefined,
        }}
        onMouseDown={handleResizeStart}
        title="드래그하여 폭 조절"
      />

      <div className="h-12 flex-shrink-0 px-4 border-b border-gray-200 flex items-center justify-between"
        style={{
          backgroundColor: (tabId || linkedOmsId) ? '#dbeafe' : `${color}10`,
          borderBottomColor: (tabId || linkedOmsId) ? '#93c5fd' : undefined
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="text-sm font-semibold text-gray-900">{tabName}</h3>
          {linkedOmsId && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-green-600 font-medium">연결됨</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {linkedOmsId && (
            <Button
              variant="iconOnly"
              buttonStyle="ghost"
              size="2xs"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="새로고침"
              leadIcon={<Icon
                iconType={['system', 'refresh']}
                size={16}
                color="default-subtle"
                className={isRefreshing ? 'animate-spin' : ''}
              />}
            />
          )}
          <Button
            variant="iconOnly"
            buttonStyle="ghost"
            size="2xs"
            onClick={() => setShowSettings(!showSettings)}
            title="설정"
            leadIcon={<Icon iconType={['system', 'settings']} size={16} color="default-subtle" />}
          />
          <Button
            variant="iconOnly"
            buttonStyle="ghost"
            size="2xs"
            onClick={onClose}
            title="닫기"
            leadIcon={<Icon iconType={['system', 'close']} size={16} color="default-subtle" />}
          />
        </div>

        {showSettings && (
          <SideTabSettings
            slotId={slotId}
            currentTabId={tabId}
            currentOmsId={linkedOmsId}
            availableTabs={availableTabs}
            availableOmsList={availableOmsList}
            displayMode={displayMode}
            color={color}
            onSelectTab={onSelectTab}
            onSelectOms={handleSelectOms}
            onChangeDisplayMode={onChangeDisplayMode}
            onChangeColor={onChangeColor}
            onRemoveTab={onRemoveTab}
            onRemoveOms={onRemoveOms}
            onClose={() => setShowSettings(false)}
            canDeleteSlot={canDeleteSlot}
            onDeleteSlot={handleDeleteSlot}
            getOmsName={getOmsName}
            onEditOmsConfig={linkedOmsId ? handleEditOmsConfig : undefined}
          />
        )}

      </div>

      <div className="flex-1 overflow-hidden">
        {tabId ? (
          <ContactReferenceArea
            allRooms={allRooms}
            onSelectHistoricalRoom={onSelectHistoricalRoom}
            referenceAreaWidth={width}
            forcedActiveTab={tabId}
            hideTabs={true}
          />
        ) : linkedOmsId && omsConfig && currentOms ? (
          <OmsContentPlaceholder
            oms={currentOms}
            config={omsConfig}
            color={color}
            onEditConfig={handleEditOmsConfig}
          />
        ) : (
          <SideTabEmptyState
            slotId={slotId}
            color={color}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}
      </div>

      {showOmsModal && pendingOms && (
        <OmsConnectionModal
          oms={pendingOms}
          existingConfig={linkedOmsId === pendingOmsId ? omsConfig : null}
          onSave={handleOmsModalSave}
          onCancel={handleOmsModalCancel}
        />
      )}

    </div>
  );
};

export default SideTabOverlay;
