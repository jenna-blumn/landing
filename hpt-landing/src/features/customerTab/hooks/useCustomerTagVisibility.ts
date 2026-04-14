import { useState, useCallback, useEffect } from 'react';
import { CustomerTagItemId } from '../types';

const ALL_ITEMS: CustomerTagItemId[] = ['customer-tags', 'customer-grade'];

const STORAGE_KEY = 'customer_tag_visibility_v1';

const getDefaultVisibleItems = (): Set<CustomerTagItemId> => new Set(ALL_ITEMS);

export const CUSTOMER_TAG_ITEM_LABELS: Record<CustomerTagItemId, string> = {
  'customer-tags': '고객 태그',
  'customer-grade': '고객 등급',
};

export const useCustomerTagVisibility = (
  externalVisibleItems?: Set<CustomerTagItemId>,
  externalOnToggle?: (itemId: CustomerTagItemId) => void
) => {
  const [visibleItems, setVisibleItems] = useState<Set<CustomerTagItemId>>(() => {
    if (externalVisibleItems) return externalVisibleItems;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CustomerTagItemId[];
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
    (itemId: CustomerTagItemId) => {
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
