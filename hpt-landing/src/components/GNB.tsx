import React from 'react';
import { Avatar, Button, Switch, ConfirmDialog, Icon } from '@blumnai-studio/blumnai-design-system';
import { mockBrands, Room } from '../data/mockData';
import { LocalStorageTaskApi } from '../../packages/task-module/src/api/LocalStorageTaskApi';
import TaskNavButton from '../../packages/task-module/src/components/TaskNavButton';
import { useTaskContext } from '../../packages/task-module/src/context/TaskContext';

const taskApi = new LocalStorageTaskApi('default-user');

/** Task button for GNB - self-determines visibility from TaskContext */
const GNBTaskButton: React.FC = () => {
  const { stats, isDrawerOpen, openDrawer, buttonDisplayMode } = useTaskContext();
  if (buttonDisplayMode !== 'gnb') return null;
  return (
    <div className="pb-4 pt-2 flex-shrink-0 border-t border-teal-300 flex justify-center">
      <TaskNavButton
        placement="gnb"
        stats={stats}
        unseenChanges={{ notice: true, pending: true, delayed: true, total: 8 }}
        isDrawerOpen={isDrawerOpen}
        onClick={() => openDrawer()}
      />
    </div>
  );
};

interface GNBProps {
  onModeChange: (mode: 'grid' | '2x1' | 'single' | 'focus' | 'kanban' | 'phone') => void;
  currentMode: 'grid' | '2x1' | 'single' | 'focus' | 'kanban' | 'phone';
  onWorkspaceMove: (targetWorkspace: number) => void;
  currentWorkspace: number;
  totalWorkspaces: number;
  isAutoAssignment: boolean;
  onToggleAssignment: (isAuto: boolean) => void;
  isPhoneModeActive: boolean;
  isPhoneButtonVisible: boolean;
  onTogglePhoneButtonVisibility: () => void;
  isChannelSectionVisible: boolean;
  onToggleChannelSection: (visible: boolean) => void;
  isBrandsInGNB: boolean;
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  allRooms: Room[];
  onToggleBrandsInGNB?: (inGNB: boolean) => void;
  isBrandSectionVisible: boolean;
  onToggleBrandSectionVisible: (visible: boolean) => void;
  isManagerMode: boolean;
  onToggleManagerMode: (isManager: boolean) => void;
  isPhoneIncoming: boolean;
  onTogglePhoneIncoming: (isIncoming: boolean) => void;
  onOpenTaskDetail?: () => void;
  isTaskDetailViewActive?: boolean;
}

const GNB: React.FC<GNBProps> = ({
  isAutoAssignment,
  onToggleAssignment,
  isChannelSectionVisible,
  onToggleChannelSection,
  isBrandsInGNB,
  selectedBrands,
  onBrandChange,
  allRooms,
  onToggleBrandsInGNB,
  isBrandSectionVisible,
  onToggleBrandSectionVisible,
  isManagerMode,
  onToggleManagerMode,
  isPhoneIncoming,
  onTogglePhoneIncoming,
  onOpenTaskDetail,
  isTaskDetailViewActive = false,
}) => {
  const brandColorMap: Record<string, string> = {
    'bg-red-500': '#ef4444',
    'bg-yellow-500': '#eab308',
    'bg-red-600': '#dc2626',
    'bg-pink-500': '#ec4899',
    'bg-blue-600': '#2563eb',
  };

  const getBrandRoomCount = (brandId: string) => {
    return allRooms.filter(room => room.brand === brandId).length;
  };

  const handleBrandToggle = (brandId: string) => {
    if (selectedBrands.length === 0) {
      const allBrandsExceptClicked = mockBrands
        .map(b => b.id)
        .filter(id => id !== brandId);
      onBrandChange(allBrandsExceptClicked);
    } else if (selectedBrands.includes(brandId)) {
      const newBrands = selectedBrands.filter(id => id !== brandId);
      if (newBrands.length === mockBrands.length - 1) {
        onBrandChange([]);
      } else {
        onBrandChange(newBrands);
      }
    } else {
      const newBrands = [...selectedBrands, brandId];
      if (newBrands.length === mockBrands.length) {
        onBrandChange([]);
      } else {
        onBrandChange(newBrands);
      }
    }
  };

  const isBrandActive = (brandId: string) => {
    return selectedBrands.length === 0 || selectedBrands.includes(brandId);
  };

  const [isResetConfirmOpen, setIsResetConfirmOpen] = React.useState(false);

  const handleDataReset = async () => {
    await taskApi.resetTasksToInitial();
    window.location.reload();
  };

  return (
    <div className="h-full bg-teal-400 flex flex-col relative">
      {/* Main content area - flex-1 so task button docks to very bottom */}
      <div className="flex-1 flex flex-col py-4 min-h-0">
        {/* GNB Label at top */}
        <div className="px-2 pb-4">
          <div className="text-white font-bold text-sm text-center">
            GNB
          </div>
        </div>

        {/* Task Detail Button */}
        {onOpenTaskDetail && (
          <div className="px-2 pb-4 flex justify-center">
            <Button
              variant="iconOnly"
              buttonStyle="ghost"
              size="sm"
              onClick={onOpenTaskDetail}
              leadIcon={isTaskDetailViewActive ? <Icon iconType={['design', 'layout-grid']} size={18} color="#0d9488" /> : <Icon iconType={['business', 'calendar']} size={18} color="#0d9488" />}
              title={isTaskDetailViewActive ? "데스크 화면" : "데스크잇 상세보기"}
              className="w-9 h-9 bg-white rounded-lg shadow-lg hover:bg-gray-100"
            />
          </div>
        )}

        {/* Brand icons in middle */}
        {isBrandsInGNB && isBrandSectionVisible && (
          <div className="flex-1 flex flex-col items-center gap-2 overflow-y-auto px-2 pt-[10px]">
            {mockBrands.map((brand) => {
              const isActive = isBrandActive(brand.id);
              const colorHex = brandColorMap[brand.color] || '#6b7280';
              const roomCount = getBrandRoomCount(brand.id);
              return (
                <div
                  key={brand.id}
                  className={`relative cursor-pointer transition-transform hover:scale-110 ${!isActive ? 'opacity-40 grayscale' : ''}`}
                  title={brand.name}
                  onClick={() => handleBrandToggle(brand.id)}
                >
                  <Avatar
                    variant="initials"
                    initials={brand.icon}
                    color={colorHex}
                    size="sm"
                  />
                  {roomCount > 0 && (
                    <span className="absolute -top-1 -right-1 z-10 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold leading-none ring-2 ring-white">
                      {roomCount > 99 ? '99+' : roomCount}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Move to sidebar button */}
            {onToggleBrandsInGNB && (
              <Button
                variant="iconOnly"
                buttonStyle="ghost"
                size="2xs"
                onClick={() => onToggleBrandsInGNB(false)}
                leadIcon={<Icon iconType={['arrows', 'arrow-right-s']} size={16} color="#2dd4bf" />}
                className="bg-white shadow-lg hover:bg-gray-100 mt-2"
                shape="pill"
                title="브랜드를 사이드바로 이동"
              />
            )}
          </div>
        )}

        {/* Toggles and Reset at bottom */}
        <div className="px-2 pb-2 space-y-4 auto-mt">
          {/* Channel Toggle */}
          <div className="flex justify-center" title="채널">
            <Switch
              checked={isChannelSectionVisible}
              onCheckedChange={(checked) => onToggleChannelSection(checked)}
              color="orange"
            />
          </div>

          {/* Brand Section Toggle */}
          <div className="flex justify-center" title="브랜드 영역">
            <Switch
              checked={isBrandSectionVisible}
              onCheckedChange={(checked) => onToggleBrandSectionVisible(checked)}
              color="blue"
            />
          </div>

          {/* Assignment Toggle */}
          <div className="flex justify-center" title={isAutoAssignment ? '자동 배정' : '수동 배정'}>
            <Switch
              checked={isAutoAssignment}
              onCheckedChange={(checked) => onToggleAssignment(checked)}
              color="pink"
            />
          </div>

          {/* Phone Incoming Toggle */}
          <div className="flex justify-center" title="전화 인입">
            <Switch
              checked={isPhoneIncoming}
              onCheckedChange={(checked) => onTogglePhoneIncoming(checked)}
              color="green"
            />
          </div>

          {/* Manager/Consultant Toggle */}
          <div className="flex justify-center" title={isManagerMode ? '매니저' : '상담사'}>
            <Switch
              checked={isManagerMode}
              onCheckedChange={(checked) => onToggleManagerMode(checked)}
              color="violet"
            />
          </div>

          {/* Data Reset Button */}
          <div className="pt-2 border-t border-teal-300">
            <Button
              variant="iconOnly"
              buttonStyle="primary"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              leadIcon={<Icon iconType={['system', 'refresh']} size={18} />}
              className="bg-teal-500 hover:bg-teal-600 text-white shadow-lg"
              fullWidth
              title="데이터 초기화"
            />
          </div>

        </div>
      </div>

      {/* Task Nav Button at very bottom (self-determines visibility) */}
      <GNBTaskButton />

      <ConfirmDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        title="모든 데이터를 초기 목업 상태로 리셋하시겠습니까?"
        description="로컬 저장소가 초기화됩니다."
        variant="destructive"
        confirmLabel="확인"
        cancelLabel="취소"
        onConfirm={handleDataReset}
      />
    </div>
  );
};

export default React.memo(GNB);
