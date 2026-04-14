import { HistorySectionState, HistorySection, LayoutConstants } from '../types';

export const LAYOUT_CONSTANTS: LayoutConstants = {
  HEADER_HEIGHT: 48,
  RESIZE_HANDLE_HEIGHT: 8,
  SECTION_MARGIN: 16,
  MIN_CONTENT_HEIGHT: 2,
  MAX_CONTENT_HEIGHT: 2000,
};

export const calculateDistributedHeights = (
  prevStates: { [key: string]: HistorySectionState },
  sections: HistorySection[],
  containerHeight: number
): { [key: string]: HistorySectionState } => {
  const hasManuallyResizedSections = Object.values(prevStates).some(
    state => state.wasManuallyResized && !state.isCollapsed
  );

  if (hasManuallyResizedSections) {
    return prevStates;
  }

  const sectionsCount = sections.length;
  const expandedSectionIds = Object.keys(prevStates).filter(
    id => !prevStates[id].isCollapsed
  );
  const expandedCount = expandedSectionIds.length;

  if (expandedCount === 0) return prevStates;

  const totalHeaderHeight = sectionsCount * LAYOUT_CONSTANTS.HEADER_HEIGHT;
  const totalResizeHandleHeight = expandedCount > 0 ? LAYOUT_CONSTANTS.RESIZE_HANDLE_HEIGHT : 0;
  const totalMargin = sectionsCount > 1 ? (sectionsCount - 1) * LAYOUT_CONSTANTS.SECTION_MARGIN : 0;
  const totalOverhead = totalHeaderHeight + totalResizeHandleHeight + totalMargin;
  const availableContentHeight = Math.max(0, containerHeight - totalOverhead);

  if (availableContentHeight <= 0) return prevStates;

  const newStates = { ...prevStates };

  if (expandedCount === 1) {
    const expandedSectionId = expandedSectionIds[0];
    const constrainedHeight = Math.max(0, availableContentHeight);
    newStates[expandedSectionId] = {
      ...newStates[expandedSectionId],
      contentHeight: constrainedHeight,
      lastExpandedHeight: constrainedHeight,
    };
  } else if (expandedCount === 2) {
    const manuallyResizedSections = expandedSectionIds.filter(
      id => newStates[id].wasManuallyResized
    );

    if (manuallyResizedSections.length === 0) {
      const equalHeight = Math.max(0, Math.floor(availableContentHeight / 2));
      expandedSectionIds.forEach(sectionId => {
        newStates[sectionId] = {
          ...newStates[sectionId],
          contentHeight: equalHeight,
          lastExpandedHeight: equalHeight,
        };
      });
    } else {
      const totalCurrentHeight = expandedSectionIds.reduce(
        (sum, id) => sum + newStates[id].contentHeight, 0
      );

      if (totalCurrentHeight > 0) {
        expandedSectionIds.forEach(sectionId => {
          const proportion = newStates[sectionId].contentHeight / totalCurrentHeight;
          const newHeight = availableContentHeight * proportion;
          const constrainedHeight = Math.max(LAYOUT_CONSTANTS.MIN_CONTENT_HEIGHT, newHeight);

          newStates[sectionId] = {
            ...newStates[sectionId],
            contentHeight: constrainedHeight,
            lastExpandedHeight: constrainedHeight,
          };
        });
      }
    }
  }

  return newStates;
};

export const calculateMaxHeight = (
  containerHeight: number,
  sectionsCount: number,
  expandedSectionsCount: number
): number => {
  const totalOverhead =
    sectionsCount * LAYOUT_CONSTANTS.HEADER_HEIGHT +
    (expandedSectionsCount > 0 ? LAYOUT_CONSTANTS.RESIZE_HANDLE_HEIGHT : 0) +
    (sectionsCount - 1) * LAYOUT_CONSTANTS.SECTION_MARGIN;

  const availableContentHeight = containerHeight - totalOverhead;

  return Math.max(LAYOUT_CONSTANTS.MIN_CONTENT_HEIGHT, availableContentHeight);
};
