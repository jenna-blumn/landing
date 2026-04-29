import React, { useState, useEffect, useRef } from 'react';
import { GripVertical, Clock, AlertTriangle, Star, Bell } from 'lucide-react';

const BUTTON_HEIGHT = 44;
const MIN_VISIBLE_WIDTH = 25;

interface Position {
  x: number;
  y: number;
}

interface TaskFloatingButtonProps {
  noticeCount: number;
  pendingCount: number;
  delayedCount: number;
  likedCount: number;
  position: Position;
  onClick: () => void;
  onPositionChange?: (position: Position, rect: DOMRect) => void;
}

const TaskFloatingButton: React.FC<TaskFloatingButtonProps> = ({
  noticeCount,
  pendingCount,
  delayedCount,
  likedCount,
  position: positionProp,
  onClick,
  onPositionChange
}) => {
  const [position, setPosition] = useState<Position>(positionProp);
  const positionRef = useRef<Position>(positionProp);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;

  // Sync internal state with prop when not dragging
  useEffect(() => {
    if (!isDragging) {
      positionRef.current = positionProp;
      setPosition(positionProp);
    }
  }, [positionProp, isDragging]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        hasDraggedRef.current = true;
      }

      const newX = Math.min(
        Math.max(0, positionStartRef.current.x + deltaX),
        window.innerWidth - MIN_VISIBLE_WIDTH
      );
      const newY = Math.min(
        Math.max(0, positionStartRef.current.y + deltaY),
        window.innerHeight - BUTTON_HEIGHT
      );

      const newPos = { x: newX, y: newY };
      positionRef.current = newPos;
      setPosition(newPos);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Notify parent of final position after drag ends
      if (buttonRef.current && onPositionChangeRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        onPositionChangeRef.current(positionRef.current, rect);
      }
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 0);
    };

    const handleWindowBlur = () => {
      if (isDragging) {
        setIsDragging(false);
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 0);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('blur', handleWindowBlur);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('blur', handleWindowBlur);
      };
    }
  }, [isDragging]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    positionStartRef.current = { ...position };
  };

  const handleClick = () => {
    if (!hasDraggedRef.current) {
      onClick();
    }
  };

  return (
    <div
      ref={buttonRef}
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div className="bg-amber-50 rounded-lg border border-gray-500 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center gap-1 p-1.5">
          <div
            className="flex items-center justify-center cursor-grab active:cursor-grabbing flex-shrink-0 px-1"
            onMouseDown={handleDragStart}
            title="드래그하여 이동"
          >
            <GripVertical size={14} className="text-gray-400 hover:text-gray-600 transition-colors" />
          </div>

          <button
            onClick={handleClick}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <div className="bg-violet-500 border border-violet-600 rounded px-2 py-1 flex items-center gap-1">
              <Bell size={12} className="text-white" />
              <span className="text-sm font-bold text-white">{noticeCount}</span>
            </div>

            <div className="bg-blue-500 border border-blue-600 rounded px-2 py-1 flex items-center gap-1">
              <Clock size={12} className="text-white" />
              <span className="text-sm font-bold text-white">{pendingCount}</span>
            </div>

            <div className="bg-orange-500 border border-orange-600 rounded px-2 py-1 flex items-center gap-1">
              <AlertTriangle size={12} className="text-white" />
              <span className="text-sm font-bold text-white">{delayedCount}</span>
            </div>

            <div className="bg-amber-500 border border-amber-600 rounded px-2 py-1 flex items-center gap-1">
              <Star size={12} className="text-white" />
              <span className="text-sm font-bold text-white">{likedCount}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFloatingButton;
