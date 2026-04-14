import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Template, TemplateVariable } from '../types';
import { getTemplatesByChannel } from '../api/templateApi';
import { renderTemplate, areAllRequiredVariablesFilled, getMissingRequiredVariables } from '../utils/templateParser';

interface UseTemplateManagerProps {
  channelType: 'sms' | 'alimtalk';
  autoFillData?: Record<string, string>;
}

export function useTemplateManager({ channelType, autoFillData }: UseTemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 템플릿 목록 로드
  useEffect(() => {
    setIsLoading(true);
    getTemplatesByChannel(channelType).then((result) => {
      setTemplates(result);
      setIsLoading(false);
    });
  }, [channelType]);

  // 검색 필터링
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templates;
    const query = searchQuery.toLowerCase();
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
    );
  }, [templates, searchQuery]);

  // 선택된 템플릿 객체
  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) || null,
    [templates, selectedTemplateId]
  );

  // 템플릿 선택 시 변수 초기화 + 자동 채움
  const selectTemplate = useCallback(
    (templateId: string) => {
      setSelectedTemplateId(templateId);
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        const initialVars: Record<string, string> = {};
        template.variables.forEach((v: TemplateVariable) => {
          // 자동 채움 데이터가 있으면 사용
          if (autoFillData?.[v.key]) {
            initialVars[v.key] = autoFillData[v.key];
          } else if (v.defaultValue) {
            initialVars[v.key] = v.defaultValue;
          } else {
            initialVars[v.key] = '';
          }
        });
        setVariables(initialVars);
      }
    },
    [templates, autoFillData]
  );

  // 변수 값 변경
  const setVariable = useCallback((key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  }, []);

  // 즐겨찾기 토글
  const toggleFavorite = useCallback((templateId: string) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
      )
    );
  }, []);

  // 선택 초기화
  const clearSelection = useCallback(() => {
    setSelectedTemplateId(null);
    setVariables({});
    setSearchQuery('');
  }, []);

  // 변수 라벨 맵 (미리보기용)
  const variableLabels = useMemo(() => {
    if (!selectedTemplate) return {};
    const labels: Record<string, string> = {};
    selectedTemplate.variables.forEach((v: TemplateVariable) => {
      labels[v.key] = v.label;
    });
    return labels;
  }, [selectedTemplate]);

  // 미리보기 텍스트
  const previewText = useMemo(() => {
    if (!selectedTemplate) return '';
    return renderTemplate(selectedTemplate.content, variables, variableLabels);
  }, [selectedTemplate, variables, variableLabels]);

  // 필수 변수 키 목록
  const requiredKeys = useMemo(
    () =>
      selectedTemplate?.variables
        .filter((v: TemplateVariable) => v.required)
        .map((v: TemplateVariable) => v.key) || [],
    [selectedTemplate]
  );

  // 유효성 검사
  const isValid = useMemo(
    () => selectedTemplate !== null && areAllRequiredVariablesFilled(requiredKeys, variables),
    [selectedTemplate, requiredKeys, variables]
  );

  // 미입력 필수 변수
  const missingVariables = useMemo(
    () => getMissingRequiredVariables(requiredKeys, variables),
    [requiredKeys, variables]
  );

  return {
    templates,
    filteredTemplates,
    selectedTemplate,
    selectedTemplateId,
    searchQuery,
    variables,
    previewText,
    isLoading,
    isValid,
    missingVariables,
    setSearchQuery,
    selectTemplate,
    setVariable,
    toggleFavorite,
    clearSelection,
  };
}
