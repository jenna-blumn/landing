import React from 'react';
import {
  ClassificationItemId,
  CLASSIFICATION_ITEM_LABELS,
} from '../../../../features/contactTab/hooks/useClassificationVisibility';

interface ClassificationVisibilityDropdownProps {
  visibleItems: Set<ClassificationItemId>;
  onToggle: (itemId: ClassificationItemId) => void;
  allItems: ClassificationItemId[];
}

const ClassificationVisibilityDropdown: React.FC<ClassificationVisibilityDropdownProps> = ({
  visibleItems,
  onToggle,
  allItems,
}) => {
  return (
    <div className="py-1">
      <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
        항목 표시 설정
      </div>
      {allItems.map((itemId) => {
        const isVisible = visibleItems.has(itemId);
        return (
          <button
            key={itemId}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(itemId);
            }}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between gap-2"
          >
            <span>{CLASSIFICATION_ITEM_LABELS[itemId]}</span>
            <div
              className={`relative w-8 h-[18px] rounded-full transition-colors ${
                isVisible ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform ${
                  isVisible ? 'left-[16px]' : 'left-[2px]'
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ClassificationVisibilityDropdown;
