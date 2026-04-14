import React, { useState } from 'react';
import { Badge, Button, Icon } from '@blumnai-studio/blumnai-design-system';
import type { BadgeColor } from '@blumnai-studio/blumnai-design-system';
import { Tag, CustomerTagItemId, CustomerGradeOption } from '../../types';
import TagSelectionModal from '../modals/TagSelectionModal';

interface CustomerTagSectionProps {
  tags: Tag[];
  onAddTag: (name: string, color: string) => void;
  onDeleteTag: (tagId: number) => void;
  maxTags?: number;
  visibleItems?: Set<CustomerTagItemId>;
  customerGrade?: string;
  onChangeCustomerGrade?: (gradeId: string) => void;
  gradeOptions?: CustomerGradeOption[];
}

const CustomerTagSection: React.FC<CustomerTagSectionProps> = ({
  tags,
  onAddTag,
  onDeleteTag,
  maxTags = 20,
  visibleItems,
  customerGrade,
  onChangeCustomerGrade,
  gradeOptions = [],
}) => {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);

  const showTags = !visibleItems || visibleItems.has('customer-tags');
  const showGrade = !visibleItems || visibleItems.has('customer-grade');
  const hasAnyVisible = showTags || showGrade;

  const handleModalAddTag = (name: string, color: string) => {
    onAddTag(name, color);
  };

  const currentGradeOption = gradeOptions.find(opt => opt.id === customerGrade);

  if (!hasAnyVisible) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Icon iconType={['system', 'settings']} size={24} className="text-gray-300 mb-2" />
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
    <div className="space-y-3">
      {showGrade && (
        <div>
          <label className="block font-body size-sm line-height-leading-5 letter-spacing-tracking-tight font-medium text-default mb-1.5">고객 등급</label>
          <div className="relative">
            <button
              onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm hover:border-gray-300 transition-colors bg-white"
            >
              <span className="flex items-center gap-2">
                {currentGradeOption ? (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${currentGradeOption.color} ${currentGradeOption.textColor}`}>
                    {currentGradeOption.label}
                  </span>
                ) : (
                  <span className="text-gray-400">등급 선택</span>
                )}
              </span>
              <Icon iconType={['arrows', 'arrow-down-s']} size={14} className={`text-gray-400 transition-transform ${isGradeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isGradeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsGradeDropdownOpen(false)} />
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {gradeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onChangeCustomerGrade?.(option.id);
                        setIsGradeDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${
                        customerGrade === option.id ? 'bg-purple-50' : ''
                      }`}
                    >
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${option.color} ${option.textColor}`}>
                        {option.label}
                      </span>
                      {customerGrade === option.id && (
                        <span className="ml-auto text-purple-500 text-xs">&#10003;</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showTags && (
        <div>
          {showGrade && <label className="block font-body size-sm line-height-leading-5 letter-spacing-tracking-tight font-medium text-default mb-1.5">고객 태그</label>}
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                label={`#${tag.name}`}
                color={tag.color as BadgeColor}
                size="lg"
                shape="pill"
                closeIcon
                onClose={() => onDeleteTag(tag.id)}
              />
            ))}

            <Button
              buttonStyle="dashed"
              size="xs"
              shape="pill"
              onClick={() => setIsTagModalOpen(true)}
              disabled={tags.length >= maxTags}
              leadIcon={<Icon iconType={['system', 'add']} size={12} />}
              title={tags.length >= maxTags ? `최대 태그 개수에 도달했습니다` : '태그 추가'}
            >
              태그 추가 ({tags.length}/{maxTags})
            </Button>

            <TagSelectionModal
              isOpen={isTagModalOpen}
              onClose={() => setIsTagModalOpen(false)}
              onAddTag={handleModalAddTag}
              onRemoveTag={onDeleteTag}
              existingTags={tags}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTagSection;
