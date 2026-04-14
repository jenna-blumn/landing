import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon, Button } from '@blumnai-studio/blumnai-design-system';
import type { IconType } from '@blumnai-studio/blumnai-design-system';
import { SideTabConfig } from '../types/sideTab';
import TaskNavButton from '../../packages/task-module/src/components/TaskNavButton';
import { useTaskContext } from '../../packages/task-module/src/context/TaskContext';

interface RightNavigationBarProps {
  slots: SideTabConfig[];
  onSlotClick: (slotId: number) => void;
  onTabDrop: (slotId: number, tabId: string) => void;
  isDraggingTab: boolean;
  getTabName: (tabId: string) => string;
  onAddSlot: () => void;
  canAddSlot: boolean;
  hasOpenOverlay?: boolean;
}

const TAB_ICONS: Record<string, IconType> = {
  'info': ['user', 'user'],
  'contact': ['communication', 'chat-2'],
  'task': ['editor', 'list-check'],
  'history': ['system', 'history'],
  'integration': ['business', 'links'],
  'assistant': ['user', 'robot'],
  'custom-composite': ['business', 'stack'],
  'cafe24': ['finance', 'shopping-bag'],
  'naver-smartstore': ['buildings', 'store'],
  'ezadmin': ['others', 'box-1'],
  'sellmate': ['others', 'box-3'],
};

const DEFAULT_ICON: IconType = ['system', 'add'];
const FALLBACK_ICON: IconType = ['others', 'box-1'];

const getIconForContent = (contentId: string | null): IconType => {
  if (!contentId) return DEFAULT_ICON;
  return TAB_ICONS[contentId] || FALLBACK_ICON;
};

/** Task button for RNB - self-determines visibility from TaskContext */
const RNBTaskButton: React.FC = () => {
  const { stats, isDrawerOpen, openDrawer, buttonDisplayMode } = useTaskContext();
  if (buttonDisplayMode !== 'rnb') return null;
  return (
    <div className="pb-4 pt-2 flex-shrink-0 border-t border-gray-200 flex justify-center">
      <TaskNavButton
        placement="rnb"
        stats={stats}
        unseenChanges={{ notice: true, pending: true, delayed: true, total: 8 }}
        isDrawerOpen={isDrawerOpen}
        onClick={() => openDrawer()}
      />
    </div>
  );
};

const BASE_WIDTH = 36;
const EXPANDED_WIDTH = 48;

const RightNavigationBar: React.FC<RightNavigationBarProps> = ({
  slots,
  onSlotClick,
  onTabDrop,
  isDraggingTab,
  getTabName,
  onAddSlot,
  canAddSlot,
  hasOpenOverlay = false,
}) => {
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [isNearBar, setIsNearBar] = useState(false);
  const [isAddButtonHovered, setIsAddButtonHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const handleDragOver = (e: React.DragEvent, slotId: number) => {
    e.preventDefault();
    setDragOverSlot(slotId);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, slotId: number) => {
    e.preventDefault();
    const tabId = e.dataTransfer.getData('text/plain');
    if (tabId) {
      onTabDrop(slotId, tabId);
    }
    setDragOverSlot(null);
  };

  const setButtonRef = useCallback((slotId: number, el: HTMLButtonElement | null) => {
    if (el) {
      buttonRefs.current.set(slotId, el);
    } else {
      buttonRefs.current.delete(slotId);
    }
  }, []);

  useEffect(() => {
    const validSlotIds = new Set(slots.map(s => s.id));
    buttonRefs.current.forEach((_, slotId) => {
      if (!validSlotIds.has(slotId)) {
        buttonRefs.current.delete(slotId);
      }
    });
  }, [slots]);

  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const windowWidth = window.innerWidth;

        const isNear = mouseX >= windowWidth - EXPANDED_WIDTH - 10;
        setIsNearBar(isNear);

        if (!isNear) {
          setHoveredSlot(null);
          return;
        }

        let foundSlot: number | null = null;
        const validSlotIds = new Set(slots.map(s => s.id));

        buttonRefs.current.forEach((button, slotId) => {
          if (!validSlotIds.has(slotId)) return;

          const buttonRect = button.getBoundingClientRect();
          const isOverButton =
            mouseX >= buttonRect.left - 15 &&
            mouseX <= buttonRect.right &&
            mouseY >= buttonRect.top &&
            mouseY <= buttonRect.bottom;

          if (isOverButton) {
            foundSlot = slotId;
          }
        });

        setHoveredSlot(foundSlot);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [slots]);

  const isExpanded = isNearBar || isDraggingTab || hasOpenOverlay;
  const currentWidth = isExpanded ? EXPANDED_WIDTH : BASE_WIDTH;
  const buttonSize = 32;

  return (
    <div
      ref={containerRef}
      className="h-full flex flex-col items-center bg-white border-l border-gray-200 shadow-sm flex-shrink-0 relative z-50"
      style={{
        width: `${currentWidth}px`,
        transition: 'width 200ms ease-out',
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-2 py-4">
        {slots.map((slot) => {
          const contentId = slot.linkedOmsId || slot.tabId;
          const hasContent = !!contentId;
          const isHovered = hoveredSlot === slot.id || dragOverSlot === slot.id;
          const isPulsing = isDraggingTab && !hasContent;
          const iconType = getIconForContent(contentId);

          return (
            <Button
              key={slot.id}
              ref={(el) => setButtonRef(slot.id, el)}
              onClick={() => onSlotClick(slot.id)}
              onDragOver={(e) => handleDragOver(e, slot.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, slot.id)}
              variant="iconOnly"
              buttonStyle="ghost"
              size="sm"
              className={`
                relative rounded-lg transition-all duration-200
                focus:outline-none
                ${hasContent
                  ? 'hover:bg-gray-100'
                  : 'hover:bg-gray-50 border border-dashed border-gray-300'
                }
                ${isHovered ? 'scale-110 shadow-md' : ''}
                ${isPulsing ? 'animate-pulse-custom border-blue-400 bg-blue-50' : ''}
              `}
              style={{
                width: `${buttonSize}px`,
                height: `${buttonSize}px`,
                backgroundColor: hasContent && isHovered ? `${slot.color}15` : undefined,
              }}
              title={hasContent ? getTabName(contentId) : `Add to slot ${slot.id}`}
              leadIcon={
                <>
                  <Icon
                    iconType={iconType}
                    size={18}
                    color={hasContent ? slot.color : 'default-muted'}
                  />
                  {slot.isVisible && (
                    <div
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white"
                      style={{ backgroundColor: slot.color }}
                    />
                  )}
                  {hasContent && (
                    <div
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-200"
                      style={{
                        backgroundColor: slot.color,
                        width: isHovered ? '60%' : '40%',
                      }}
                    />
                  )}
                </>
              }
            />
          );
        })}

        {canAddSlot && (
          <>
            <div className="w-4 h-px bg-gray-200 my-1" />
            <Button
              onClick={onAddSlot}
              onMouseEnter={() => setIsAddButtonHovered(true)}
              onMouseLeave={() => setIsAddButtonHovered(false)}
              variant="iconOnly"
              buttonStyle="ghost"
              size="sm"
              className={`
                rounded-lg transition-all duration-200
                border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50
                focus:outline-none
                ${isAddButtonHovered ? 'scale-105' : ''}
              `}
              style={{
                width: `${buttonSize}px`,
                height: `${buttonSize}px`,
              }}
              title="Add new slot"
              leadIcon={<Icon iconType={['system', 'add']} size={16} color="default-muted" />}
            />
          </>
        )}
      </div>

      {/* Task Nav Button at bottom (self-determines visibility) */}
      <RNBTaskButton />
    </div>
  );
};

export default RightNavigationBar;
