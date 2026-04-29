import React, { useState } from 'react';
import { Icon, Badge, Button, Select, type BadgeColor, type IconTypeWithFill } from '@blumnai-studio/blumnai-design-system';
import { ConsultationTag, CategoryStructure } from '../../../../features/contactTab/types';
import { getDefaultCategories } from '../../../../features/contactTab/utils/categoryDefinitions';
import { getFlagOptions, getPriorityOptions } from '../../../../features/contactTab/utils/flagDefinitions';
import TagSelectionModal from '../../../../features/customerTab/components/modals/TagSelectionModal';
import { generateNumericId } from '../../../../utils/idUtils';
import { ClassificationItemId } from '../../../../features/contactTab/hooks/useClassificationVisibility';

interface ClassificationTagsSectionProps {
  consultationTags: ConsultationTag[];
  setConsultationTags: React.Dispatch<React.SetStateAction<ConsultationTag[]>>;
  majorCategory: string;
  setMajorCategory: React.Dispatch<React.SetStateAction<string>>;
  middleCategory: string;
  setMiddleCategory: React.Dispatch<React.SetStateAction<string>>;
  minorCategory: string;
  setMinorCategory: React.Dispatch<React.SetStateAction<string>>;
  priority: string;
  setPriority: React.Dispatch<React.SetStateAction<string>>;
  flag: { type: string | null; label: string; color: string } | null;
  setFlag: React.Dispatch<React.SetStateAction<{ type: string | null; label: string; color: string } | null>>;
  categoryOptions?: CategoryStructure;
  onSetFlag?: (flagType: string | null) => void;
  visibleItems?: Set<ClassificationItemId>;
}

const ClassificationTagsSection: React.FC<ClassificationTagsSectionProps> = ({
  consultationTags,
  setConsultationTags,
  majorCategory,
  setMajorCategory,
  middleCategory,
  setMiddleCategory,
  minorCategory,
  setMinorCategory,
  priority,
  setPriority,
  flag,
  setFlag,
  categoryOptions,
  onSetFlag,
  visibleItems,
}) => {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const categories = categoryOptions || getDefaultCategories();
  const flagOptions = getFlagOptions();
  const priorityOptions = getPriorityOptions();

  const prioritySelectOptions = priorityOptions.map((p) => ({ id: p, label: p }));
  const flagSelectOptions = flagOptions.map((f) => ({
    id: f.type || 'none',
    label: f.label,
    leadIcon: f.type ? (['business', 'flag', true] as IconTypeWithFill) : undefined,
    iconColor: f.iconColor,
  }));

  const isVisible = (itemId: ClassificationItemId): boolean => {
    if (!visibleItems) return true;
    return visibleItems.has(itemId);
  };

  const showTags = isVisible('tags');
  const showPriority = isVisible('priority');
  const showFlag = isVisible('flag');
  const showCategory = isVisible('category');
  const hasAnyVisible = showTags || showPriority || showFlag || showCategory;

  const handleMajorCategoryChange = (newMajorCategory: string) => {
    setMajorCategory(newMajorCategory);
    setMiddleCategory('');
    setMinorCategory('');
  };

  const handleMiddleCategoryChange = (newMiddleCategory: string) => {
    setMiddleCategory(newMiddleCategory);
    setMinorCategory('');
  };

  const handleDeleteTag = (tagId: number) => {
    setConsultationTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const handleModalAddTag = (name: string, color: string) => {
    const newTag: ConsultationTag = {
      id: generateNumericId(),
      name,
      color,
      createdBy: '현재 상담사',
      createdAt: new Date().toLocaleString('ko-KR'),
    };
    setConsultationTags((prev) => [...prev, newTag]);
  };

  const handleFlagChange = (value: string) => {
    if (value === 'none') {
      setFlag(null);
      onSetFlag?.(null);
    } else {
      const option = flagOptions.find((f) => f.type === value);
      if (option) {
        setFlag({ type: option.type, label: option.label, color: option.color });
        onSetFlag?.(option.type);
      }
    }
  };

  if (!hasAnyVisible) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Icon iconType={['system', 'settings']} size={24} color="default-disabled" className="mb-2" />
        <p className="text-sm text-gray-400">
          표시할 항목이 없습니다
        </p>
        <p className="text-xs text-gray-400 mt-1">
          헤더의 설정 버튼에서 항목을 활성화하세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showTags && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <label className="font-body size-sm line-height-leading-5 letter-spacing-tracking-tight font-medium text-default">상담 태그</label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {consultationTags.map((tag) => (
              <Badge
                key={tag.id}
                label={`#${tag.name}`}
                color={tag.color as BadgeColor}
                size="lg"
                shape="pill"
                closeIcon
                onClose={() => handleDeleteTag(tag.id)}
              />
            ))}

            <Button
              onClick={() => setIsTagModalOpen(true)}
              disabled={consultationTags.length >= 20}
              buttonStyle="dashed"
              size="xs"
              shape="pill"
              leadIcon={<Icon iconType={['system', 'add']} size={12} />}
              title={consultationTags.length >= 20 ? '최대 태그 개수에 도달했습니다' : '태그 추가'}
            >
              태그 추가 ({consultationTags.length}/20)
            </Button>

            <TagSelectionModal
              isOpen={isTagModalOpen}
              onClose={() => setIsTagModalOpen(false)}
              onAddTag={handleModalAddTag}
              onRemoveTag={handleDeleteTag}
              existingTags={consultationTags}
              title="상담 태그 추가"
            />
          </div>
        </div>
      )}

      {(showPriority || showFlag) && (
        <div className="grid grid-cols-2 gap-4">
          {showPriority && (
            <div>
              <Select
                label="우선순위"
                options={prioritySelectOptions}
                value={priority}
                onChange={(val) => setPriority(val)}
                size="sm"
              />
            </div>
          )}

          {showFlag && (
            <div>
              <Select
                label="플래그"
                options={flagSelectOptions}
                value={flag?.type || 'none'}
                onChange={handleFlagChange}
                size="sm"
              />
            </div>
          )}
        </div>
      )}

      {showCategory && (
        <div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Select
                label="대분류"
                options={Object.keys(categories).map((k) => ({ id: k, label: k }))}
                value={majorCategory}
                onChange={(val) => handleMajorCategoryChange(val)}
                size="sm"
              />
            </div>

            <div>
              <Select
                label="중분류"
                placeholder="선택하세요"
                options={
                  majorCategory
                    ? Object.keys(categories[majorCategory]).map((k) => ({ id: k, label: k }))
                    : []
                }
                value={middleCategory || undefined}
                onChange={(val) => handleMiddleCategoryChange(val)}
                disabled={!majorCategory}
                size="sm"
              />
            </div>

            <div>
              <Select
                label="소분류"
                placeholder="선택하세요"
                options={
                  middleCategory && majorCategory
                    ? [
                        { id: '__none__', label: '선택 안 함' },
                        ...(categories[majorCategory][middleCategory] || []).map((k) => ({ id: k, label: k })),
                      ]
                    : []
                }
                value={minorCategory || '__none__'}
                onChange={(val) => setMinorCategory(val === '__none__' ? '' : val)}
                disabled={!middleCategory}
                size="sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassificationTagsSection;
