import React, { useRef, useState } from 'react';
import { Icon, Badge, Button, ScrollArea } from '@blumnai-studio/blumnai-design-system';
import { ResizableSectionWrapperProps } from '../../../features/history/types';

const ResizableSectionWrapper: React.FC<ResizableSectionWrapperProps> = ({
  sectionId,
  title,
  badge,
  isTopSection,
  isCollapsed,
  height,
  minHeight,
  maxHeight,
  onHeightChange,
  onToggleCollapse,
  onDragStart,
  onDragOver,
  onDrop,
  onResizingChange,
  children,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(0);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    onResizingChange(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startYRef.current;
      const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeightRef.current + deltaY));
      onHeightChange(sectionId, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      onResizingChange(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleToggle = () => {
    onToggleCollapse(sectionId);
  };

  return (
    <div
      className={`flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 ${isTopSection ? 'mb-4' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, sectionId)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, sectionId)}
    >
      <div
        className="h-12 px-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-move hover:bg-gray-100 transition-colors flex-shrink-0"
      >
        <div className="flex items-center gap-2 flex-1">
          <Icon iconType={['editor', 'draggable']} size={16} color="default-muted" />
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          {badge && (
            <Badge label={String(badge)} color="blue" size="sm" shape="pill" />
          )}
        </div>
        <Button
          variant="iconOnly"
          buttonStyle="ghost"
          size="2xs"
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          leadIcon={isCollapsed ? (
            <Icon iconType={['arrows', 'arrow-down-s']} size={16} color="default-subtle" />
          ) : (
            <Icon iconType={['arrows', 'arrow-up-s']} size={16} color="default-subtle" />
          )}
        />
      </div>

      {!isCollapsed && (
        <>
          <ScrollArea
            orientation="vertical"
            maxHeight={height}
            className="flex-shrink-0"
          >
            <div className="p-4">
              {children}
            </div>
          </ScrollArea>

          <div
            className={`h-2 bg-gray-100 hover:bg-gray-200 cursor-row-resize border-t border-gray-200 flex-shrink-0 transition-colors ${isResizing ? 'bg-blue-200' : ''}`}
            onMouseDown={handleResizeStart}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className={`w-8 h-0.5 rounded ${isResizing ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResizableSectionWrapper;
