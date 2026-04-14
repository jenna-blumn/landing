import { useState, useRef, useCallback, useEffect } from 'react';

const BASE_MIN_HEIGHT = 180;
const MAX_HEIGHT = 600;
const DEFAULT_HEIGHT = 220;
const TEMPLATE_DEFAULT_HEIGHT = 500;

interface UseComposerResizeProps {
  hasTemplateArea: boolean;
  minHeight?: number;
  defaultHeight?: number;
}

export function useComposerResize({
  hasTemplateArea,
  minHeight = BASE_MIN_HEIGHT,
  defaultHeight = DEFAULT_HEIGHT,
}: UseComposerResizeProps) {
  const [composerHeight, setComposerHeight] = useState(() =>
    hasTemplateArea ? Math.max(defaultHeight, TEMPLATE_DEFAULT_HEIGHT) : defaultHeight
  );
  const [isResizing, setIsResizing] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const clampHeight = useCallback(
    (height: number) => Math.max(minHeight, Math.min(MAX_HEIGHT, height)),
    [minHeight]
  );

  // 템플릿 영역 표시/해제 시 높이 자동 조정
  useEffect(() => {
    setComposerHeight((prev) => {
      if (hasTemplateArea) {
        return clampHeight(Math.max(prev, defaultHeight, TEMPLATE_DEFAULT_HEIGHT));
      }
      return clampHeight(Math.min(prev, defaultHeight));
    });
  }, [hasTemplateArea, clampHeight, defaultHeight]);

  // 최소 높이 변경 시 현재 높이 보정
  useEffect(() => {
    setComposerHeight((prev) => clampHeight(prev));
  }, [clampHeight]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const delta = startYRef.current - e.clientY;
    const newHeight = clampHeight(startHeightRef.current + delta);
    setComposerHeight(newHeight);
  }, [clampHeight]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startYRef.current = e.clientY;
      startHeightRef.current = composerHeight;
      setIsResizing(true);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    },
    [composerHeight, handleMouseMove, handleMouseUp]
  );

  return {
    composerHeight,
    isResizing,
    resizeHandleProps: {
      onMouseDown: handleMouseDown,
    },
  };
}
