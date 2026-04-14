import { useState, useRef, useEffect, useCallback } from 'react';
import { HistorySectionState, HistorySection } from '../types';
import { calculateDistributedHeights, calculateMaxHeight, LAYOUT_CONSTANTS } from '../utils/calculations';
import { saveHistorySettings } from '../api/historyApi';

interface UseHistoryTabStateProps {
  sections: HistorySection[];
  initialSectionStates?: { [key: string]: HistorySectionState };
  autoSave?: boolean;
}

export const useHistoryTabState = ({
  sections: initialSections,
  initialSectionStates,
  autoSave = true,
}: UseHistoryTabStateProps) => {
  const [sections, setSections] = useState<HistorySection[]>(initialSections);
  const [sectionStates, setSectionStates] = useState<{ [key: string]: HistorySectionState }>(
    initialSectionStates || {}
  );
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [isAnySectionResizing, setIsAnySectionResizing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSave = useCallback((states: { [key: string]: HistorySectionState }, secs: HistorySection[]) => {
    if (!autoSave) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveHistorySettings({ sections: secs, sectionStates: states });
    }, 500);
  }, [autoSave]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleHeightChange = useCallback((sectionId: string, newHeight: number) => {
    if (!containerRef.current) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRect.height;
    const sectionsCount = sections.length;

    setSectionStates(prevStates => {
      const newStates = { ...prevStates };
      const currentDraggedSectionState = newStates[sectionId];

      newStates[sectionId] = {
        ...currentDraggedSectionState,
        contentHeight: Math.max(LAYOUT_CONSTANTS.MIN_CONTENT_HEIGHT, newHeight),
        lastExpandedHeight: Math.max(LAYOUT_CONSTANTS.MIN_CONTENT_HEIGHT, newHeight),
        wasManuallyResized: true,
      };

      const currentExpandedSectionIds = Object.keys(newStates).filter(
        id => !newStates[id].isCollapsed
      );
      const currentExpandedCount = currentExpandedSectionIds.length;

      const totalHeaderHeight = sectionsCount * LAYOUT_CONSTANTS.HEADER_HEIGHT;
      const totalResizeHandleHeight = currentExpandedCount > 0 ? LAYOUT_CONSTANTS.RESIZE_HANDLE_HEIGHT : 0;
      const totalMargin = sectionsCount > 1 ? (sectionsCount - 1) * LAYOUT_CONSTANTS.SECTION_MARGIN : 0;
      const totalOverhead = totalHeaderHeight + totalResizeHandleHeight + totalMargin;
      const availableContentHeight = Math.max(0, containerHeight - totalOverhead);

      if (currentExpandedCount === 1) {
        const expandedSectionId = currentExpandedSectionIds[0];
        const constrainedHeight = Math.max(LAYOUT_CONSTANTS.MIN_CONTENT_HEIGHT, availableContentHeight);
        newStates[expandedSectionId] = {
          ...newStates[expandedSectionId],
          contentHeight: constrainedHeight,
          lastExpandedHeight: constrainedHeight,
        };
      } else if (currentExpandedCount === 2) {
        const otherSectionId = currentExpandedSectionIds.find(id => id !== sectionId);
        if (otherSectionId) {
          const remainingHeight = Math.max(LAYOUT_CONSTANTS.MIN_CONTENT_HEIGHT, availableContentHeight - newStates[sectionId].contentHeight);
          newStates[otherSectionId] = {
            ...newStates[otherSectionId],
            contentHeight: remainingHeight,
            lastExpandedHeight: remainingHeight,
          };
        }
      }

      debouncedSave(newStates, sections);
      return newStates;
    });
  }, [sections, debouncedSave]);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRect.height;

    if (containerHeight > 0) {
      setSectionStates(prevStates =>
        calculateDistributedHeights(prevStates, sections, containerHeight)
      );
    }
  }, [sections]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (isAnySectionResizing) return;

    const resizeObserver = new ResizeObserver(() => {
      if (isAnySectionResizing) return;
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRect.height;

      if (containerHeight > 0) {
        setSectionStates(prevStates =>
          calculateDistributedHeights(prevStates, sections, containerHeight)
        );
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [sections, isAnySectionResizing]);

  const applyDistributedHeights = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRect.height;

    if (containerHeight > 0) {
      setSectionStates(prevStates =>
        calculateDistributedHeights(prevStates, sections, containerHeight)
      );
    }
  }, [sections]);

  const handleToggleCollapse = useCallback((sectionId: string) => {
    setSectionStates(prevStates => {
      const newStates = { ...prevStates };
      const currentState = newStates[sectionId];

      if (currentState.isCollapsed) {
        const otherSectionIds = Object.keys(newStates).filter(id => id !== sectionId);
        const willBothBeExpanded = otherSectionIds.some(id => !newStates[id].isCollapsed);

        if (willBothBeExpanded && sections.length === 2) {
          const otherSectionId = otherSectionIds.find(id => !newStates[id].isCollapsed);
          const bothNotManuallyResized = !currentState.wasManuallyResized &&
            otherSectionId && !newStates[otherSectionId].wasManuallyResized;

          if (bothNotManuallyResized && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const availableHeight = containerRect.height;
            const totalOverhead =
              sections.length * LAYOUT_CONSTANTS.HEADER_HEIGHT +
              LAYOUT_CONSTANTS.RESIZE_HANDLE_HEIGHT +
              (sections.length > 1 ? (sections.length - 1) * LAYOUT_CONSTANTS.SECTION_MARGIN : 0);
            const availableContentHeight = availableHeight - totalOverhead;
            const equalHeight = Math.floor(availableContentHeight / 2);

            newStates[sectionId] = {
              ...currentState,
              isCollapsed: false,
              contentHeight: equalHeight,
              lastExpandedHeight: equalHeight,
              wasManuallyResized: false,
            };

            if (otherSectionId) {
              newStates[otherSectionId] = {
                ...newStates[otherSectionId],
                contentHeight: equalHeight,
                lastExpandedHeight: equalHeight,
                wasManuallyResized: false,
              };
            }
          } else {
            newStates[sectionId] = {
              ...currentState,
              isCollapsed: false,
              contentHeight: currentState.lastExpandedHeight,
              wasManuallyResized: false,
            };
          }
        } else {
          newStates[sectionId] = {
            ...currentState,
            isCollapsed: false,
            contentHeight: currentState.lastExpandedHeight,
            wasManuallyResized: false,
          };
        }

        setTimeout(() => {
          applyDistributedHeights();
        }, 0);
      } else {
        newStates[sectionId] = {
          ...currentState,
          isCollapsed: true,
          contentHeight: 0,
        };

        setTimeout(() => {
          applyDistributedHeights();
        }, 0);
      }

      debouncedSave(newStates, sections);
      return newStates;
    });
  }, [sections, applyDistributedHeights, debouncedSave]);

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    e.dataTransfer.setData('text/plain', sectionId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedSectionId(sectionId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData('text/plain');

    if (!draggedId || draggedId === targetSectionId) {
      return;
    }

    setSections(prevSections => {
      const newSections = [...prevSections];
      const draggedIndex = newSections.findIndex(s => s.id === draggedId);
      const targetIndex = newSections.findIndex(s => s.id === targetSectionId);

      if (draggedIndex === -1 || targetIndex === -1) {
        return prevSections;
      }

      const [draggedSection] = newSections.splice(draggedIndex, 1);
      newSections.splice(targetIndex, 0, draggedSection);

      const reorderedSections = newSections.map((section, index) => ({
        ...section,
        order: index,
      }));

      debouncedSave(sectionStates, reorderedSections);
      return reorderedSections;
    });

    setDraggedSectionId(null);
  };

  const getCurrentMaxHeight = (_sectionId: string) => {
    if (!containerRef.current) {
      return LAYOUT_CONSTANTS.MAX_CONTENT_HEIGHT;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const availableHeight = containerRect.height;

    const expandedSectionIds = Object.keys(sectionStates).filter(
      id => !sectionStates[id].isCollapsed
    );

    return calculateMaxHeight(availableHeight, sections.length, expandedSectionIds.length);
  };

  return {
    sectionStates,
    sections,
    draggedSectionId,
    isAnySectionResizing,
    containerRef,
    handleHeightChange,
    handleToggleCollapse,
    handleDragStart,
    handleDragOver,
    handleDrop,
    setIsAnySectionResizing,
    getCurrentMaxHeight,
    setSectionStates,
  };
};
