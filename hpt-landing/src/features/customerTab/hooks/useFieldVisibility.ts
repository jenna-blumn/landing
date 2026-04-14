import { useState, useCallback } from 'react';
import { getDefaultVisibleFields } from '../utils/fieldDefinitions';

const MINIMUM_VISIBLE_FIELDS = new Set(['name', 'email']);

const FIELD_ORDER_STORAGE_KEY = 'customerInfo_fieldOrder';

const loadFieldOrder = (): Record<string, string[]> => {
  try {
    const stored = localStorage.getItem(FIELD_ORDER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveFieldOrder = (order: Record<string, string[]>) => {
  try {
    localStorage.setItem(FIELD_ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    // ignore storage errors
  }
};

export const useFieldVisibility = (initialVisibleFields?: Set<string>) => {
  const [visibleFields, setVisibleFields] = useState<Set<string>>(
    initialVisibleFields || getDefaultVisibleFields()
  );
  const [columnSettings, setColumnSettings] = useState<Set<string>>(new Set());
  const [fieldOrder, setFieldOrder] = useState<Record<string, string[]>>(loadFieldOrder);

  const toggleFieldVisibility = useCallback((fieldId: string) => {
    setVisibleFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  }, []);

  const toggleColumnSetting = useCallback((fieldId: string) => {
    setColumnSettings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  }, []);

  const updateFieldOrder = useCallback((category: string, newOrder: string[]) => {
    setFieldOrder(prev => {
      const updated = { ...prev, [category]: newOrder };
      saveFieldOrder(updated);
      return updated;
    });
  }, []);

  const showAllFields = useCallback(() => {
    setVisibleFields(getDefaultVisibleFields());
  }, []);

  const hideAllFields = useCallback(() => {
    setVisibleFields(new Set(MINIMUM_VISIBLE_FIELDS));
  }, []);

  return {
    visibleFields,
    columnSettings,
    fieldOrder,
    toggleFieldVisibility,
    toggleColumnSetting,
    updateFieldOrder,
    showAllFields,
    hideAllFields,
    setVisibleFields,
    setColumnSettings,
  };
};
