import React, { useState } from 'react';
import { Button, Select, Icon } from '@blumnai-studio/blumnai-design-system';
import { SIDE_TAB_COLORS, OmsInfo } from '../types/sideTab';

interface SideTabSettingsProps {
  slotId: number;
  currentTabId: string | null;
  currentOmsId: string | null;
  availableTabs: Array<{ id: string; name: string }>;
  availableOmsList: Array<OmsInfo & { disabled?: boolean; disabledReason?: string }>;
  displayMode: 'drawer';
  color: string;
  onSelectTab: (tabId: string) => void;
  onSelectOms: (omsId: string) => void;
  onChangeDisplayMode: (mode: 'drawer') => void;
  onChangeColor: (color: string) => void;
  onRemoveTab: () => void;
  onRemoveOms: () => void;
  onClose: () => void;
  canDeleteSlot: boolean;
  onDeleteSlot: () => void;
  getOmsName: (omsId: string) => string;
  onEditOmsConfig?: () => void;
}

const SideTabSettings: React.FC<SideTabSettingsProps> = ({
  slotId: _slotId,
  currentTabId,
  currentOmsId,
  availableTabs,
  availableOmsList,
  displayMode: _displayMode,
  color,
  onSelectTab,
  onSelectOms,
  onChangeDisplayMode: _onChangeDisplayMode,
  onChangeColor,
  onRemoveTab,
  onRemoveOms,
  onClose,
  canDeleteSlot,
  onDeleteSlot,
  getOmsName,
  onEditOmsConfig,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const hasLinkedContent = currentTabId || currentOmsId;
  const linkedContentName = currentTabId
    ? availableTabs.find(t => t.id === currentTabId)?.name || currentTabId
    : currentOmsId
      ? getOmsName(currentOmsId)
      : '';

  return (
    <div
      className="absolute top-12 right-4 w-80 rounded-lg shadow-2xl border z-[58]"
      style={{
        backgroundColor: hasLinkedContent ? '#dbeafe' : '#ffffff',
        borderColor: hasLinkedContent ? '#93c5fd' : '#e5e7eb'
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">사이드탭 설정</h3>
          <Button variant="iconOnly" buttonStyle="ghost" size="2xs" onClick={onClose} leadIcon={<Icon iconType={['system', 'close']} size={16} color="default-muted" />} />
        </div>

        <div className="space-y-4">
          <div>
            <Select
              label="표시할 탭 선택"
              placeholder="탭 선택..."
              options={availableTabs.map((t) => ({ id: t.id, label: t.name }))}
              value={currentTabId || undefined}
              onChange={(val) => {
                if (val) {
                  onSelectTab(val);
                  onClose();
                }
              }}
              disabled={!!currentOmsId}
              size="sm"
            />
            {currentOmsId && (
              <p className="text-xs text-gray-500 mt-1">OMS가 연동되어 있어 탭을 선택할 수 없습니다</p>
            )}
          </div>

          <div>
            <Select
              label="OMS 연동"
              placeholder="OMS 선택..."
              options={availableOmsList.map((o) => ({ id: o.id, label: o.name + (o.disabled ? ' (연동 중)' : ''), disabled: o.disabled }))}
              value={currentOmsId || undefined}
              onChange={(val) => {
                if (val) {
                  onSelectOms(val);
                  onClose();
                }
              }}
              disabled={!!currentTabId}
              size="sm"
            />
            {currentTabId && (
              <p className="text-xs text-gray-500 mt-1">탭이 연동되어 있어 OMS를 선택할 수 없습니다</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              버튼 색상
            </label>
            <div className="relative">
              <Button
                onClick={() => setShowColorPicker(!showColorPicker)}
                buttonStyle="secondary"
                size="sm"
                fullWidth
                className={`justify-between ${
                  hasLinkedContent ? 'border-blue-400' : ''
                }`}
                tailIcon={<Icon iconType={['design', 'palette']} size={16} color="default-muted" />}
                leadIcon={<div className="w-5 h-5 rounded border border-gray-300" style={{ backgroundColor: color }} />}
              >
                색상 선택
              </Button>

              {showColorPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10">
                  <div className="grid grid-cols-5 gap-2">
                    {SIDE_TAB_COLORS.map((colorOption) => (
                      <Button
                        key={colorOption.value}
                        onClick={() => {
                          onChangeColor(colorOption.value);
                          setShowColorPicker(false);
                        }}
                        variant="iconOnly"
                        buttonStyle="ghost"
                        size="sm"
                        className={`w-10 h-10 rounded-lg transition-all hover:scale-110 ${
                          color === colorOption.value ? 'ring-2 ring-gray-900 ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: colorOption.value }}
                        title={colorOption.name}
                        leadIcon={<span />}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              폭 조정
            </label>
            <p className="text-xs text-gray-600">
              사이드탭 왼쪽의 리사이저를 드래그하여 폭을 조절할 수 있습니다.
            </p>
          </div>

          {hasLinkedContent && (
            <div className="space-y-2 pt-2 border-t border-gray-200">
              {onEditOmsConfig && currentOmsId && (
                <Button buttonStyle="secondary" size="sm" fullWidth onClick={onEditOmsConfig}>
                  OMS 연결 설정
                </Button>
              )}
              <Button
                buttonStyle="soft"
                size="sm"
                fullWidth
                onClick={currentTabId ? onRemoveTab : onRemoveOms}
                className="text-red-600 bg-red-50 hover:bg-red-100"
              >
                연동된 {linkedContentName} 해제
              </Button>
            </div>
          )}

          <div className="pt-3 mt-3 border-t border-gray-200">
            <Button
              buttonStyle="destructive"
              size="sm"
              fullWidth
              onClick={onDeleteSlot}
              disabled={!canDeleteSlot}
              leadIcon={<Icon iconType={['system', 'delete-bin']} size={16} />}
              title={!canDeleteSlot ? '최소 1개의 사이드탭이 필요합니다' : ''}
            >
              사이드탭 삭제
            </Button>
            {!canDeleteSlot && (
              <p className="text-xs text-gray-400 mt-1 text-center">
                최소 1개의 사이드탭이 필요합니다
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideTabSettings;
