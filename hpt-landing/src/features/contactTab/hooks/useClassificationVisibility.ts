import { useState, useCallback, useEffect } from 'react';

export type ClassificationItemId = 'tags' | 'priority' | 'flag' | 'category';

const ALL_ITEMS: ClassificationItemId[] = ['tags', 'priority', 'flag', 'category'];

const STORAGE_KEY = 'classification_visibility_v1';

const getDefaultVisibleItems = (): Set<ClassificationItemId> => new Set(ALL_ITEMS);

export const CLASSIFICATION_ITEM_LABELS: Record<ClassificationItemId, string> = {
  tags: '상담 태그',
  priority: '우선순위',
  flag: '플래그',
  category: '상담 분류',
};

export const useClassificationVisibility = (
  externalVisibleItems?: Set<ClassificationItemId>,
  externalOnToggle?: (itemId: ClassificationItemId) => void
) => {
  const [visibleItems, setVisibleItems] = useState<Set<ClassificationItemId>>(() => {
    if (externalVisibleItems) return externalVisibleItems;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ClassificationItemId[];
        return new Set(parsed);
      }
    } catch {
      // ignore
    }
    return getDefaultVisibleItems();
  });

  // Sync with external state
  useEffect(() => {
    if (externalVisibleItems) {
      setVisibleItems(externalVisibleItems);
    }
  }, [externalVisibleItems]);

  // Persist to localStorage
  useEffect(() => {
    if (!externalVisibleItems) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...visibleItems]));
      } catch {
        // ignore
      }
    }
  }, [visibleItems, externalVisibleItems]);

  const toggleItem = useCallback(
    (itemId: ClassificationItemId) => {
      if (externalOnToggle) {
        externalOnToggle(itemId);
        return;
      }
      setVisibleItems((prev) => {
        const next = new Set(prev);
        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        return next;
      });
    },
    [externalOnToggle]
  );

  return {
    visibleItems: externalVisibleItems ?? visibleItems,
    toggleItem,
    allItems: ALL_ITEMS,
  };
};
