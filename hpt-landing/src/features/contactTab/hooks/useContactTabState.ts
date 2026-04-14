import { useState, useCallback, useEffect } from 'react';
import { ContactSection } from '../types';

const STORAGE_KEY = 'contact_tab_sections_v1';

export const useContactTabState = (initialSections: ContactSection[]) => {
  const [sections, setSections] = useState<ContactSection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load contact sections from local storage:', error);
    }
    return initialSections;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
    } catch (error) {
      console.error('Failed to save contact sections to local storage:', error);
    }
  }, [sections]);

  const handleReorder = useCallback((reorderedSections: ContactSection[]) => {
    setSections(reorderedSections.map((section, index) => ({
      ...section,
      order: index,
    })));
  }, []);

  return {
    sections,
    setSections,
    handleReorder,
  };
};
