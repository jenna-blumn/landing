import { useState, useCallback, useEffect } from 'react';
import { SectionConfig, Memo, Tag, CustomerGradeOption } from '../types';
import { generateNumericId } from '../../../utils/idUtils';
import { getCustomerGradeOptions, getCustomerGrade, updateCustomerGrade } from '../api/customerGradeApi';

export const useCustomerInfoState = (initialSections: SectionConfig[]) => {
  const [sections, setSections] = useState<SectionConfig[]>(initialSections);

  const handleReorder = useCallback((reorderedSections: SectionConfig[]) => {
    setSections(reorderedSections.map((section, index) => ({
      ...section,
      order: index,
    })));
  }, []);

  const updateSectionSettings = useCallback((sectionId: string, settings: Partial<SectionConfig>) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, ...settings }
          : section
      )
    );
  }, []);

  return {
    sections,
    setSections,
    handleReorder,
    updateSectionSettings,
  };
};

export const useMemoManagement = (initialMemos: Memo[] = []) => {
  const [memos, setMemos] = useState<Memo[]>(initialMemos);

  const addMemo = useCallback((content: string) => {
    const newMemo: Memo = {
      id: generateNumericId(),
      content: content.trim(),
      author: '현재 상담사',
      createdAt: new Date().toLocaleString('ko-KR'),
    };
    setMemos(prev => [newMemo, ...prev]);
    return newMemo;
  }, []);

  const editMemo = useCallback((memoId: number, newContent: string) => {
    setMemos(prev =>
      prev.map(memo =>
        memo.id === memoId
          ? { ...memo, content: newContent }
          : memo
      )
    );
  }, []);

  const deleteMemo = useCallback((memoId: number) => {
    setMemos(prev => prev.filter(memo => memo.id !== memoId));
  }, []);

  return {
    memos,
    setMemos,
    addMemo,
    editMemo,
    deleteMemo,
  };
};

export const useTagManagement = (initialTags: Tag[] = []) => {
  const [tags, setTags] = useState<Tag[]>(initialTags);

  const addTag = useCallback((name: string, color: string) => {
    const newTag: Tag = {
      id: generateNumericId(),
      name,
      color,
      createdBy: '현재 상담사',
      createdAt: new Date().toLocaleString('ko-KR'),
    };
    setTags(prev => [...prev, newTag]);
    return newTag;
  }, []);

  const editTag = useCallback((tagId: number, newName: string, newColor: string) => {
    setTags(prev =>
      prev.map(tag =>
        tag.id === tagId
          ? { ...tag, name: newName, color: newColor }
          : tag
      )
    );
  }, []);

  const deleteTag = useCallback((tagId: number) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  }, []);

  return {
    tags,
    setTags,
    addTag,
    editTag,
    deleteTag,
  };
};

export const useCustomerGrade = (customerId?: string) => {
  const [grade, setGrade] = useState<string>('normal');
  const [gradeOptions, setGradeOptions] = useState<CustomerGradeOption[]>([]);

  useEffect(() => {
    getCustomerGradeOptions().then(setGradeOptions);
  }, []);

  useEffect(() => {
    if (customerId) {
      getCustomerGrade(customerId).then(setGrade);
    }
  }, [customerId]);

  const changeGrade = useCallback((newGrade: string) => {
    setGrade(newGrade);
    if (customerId) {
      updateCustomerGrade(customerId, newGrade);
    }
  }, [customerId]);

  return { grade, changeGrade, gradeOptions };
};
