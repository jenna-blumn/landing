import React, { useState } from 'react';
import { Button, Icon, TooltipTrigger } from '@blumnai-studio/blumnai-design-system';
import { CustomerInfo } from '../../types';
import { getAllFieldDefinitions } from '../../utils/fieldDefinitions';
import { copyToClipboard } from '../../utils/copyToClipboard';

interface CustomerInfoSectionProps {
  data: CustomerInfo;
  visibleFields: Set<string>;
  columnSettings: Set<string>;
  onFieldCopy?: (fieldId: string, value: string) => void;
  onOpenOverlay?: () => void;
}

const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  data,
  visibleFields,
  columnSettings,
  onFieldCopy,
  onOpenOverlay,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const allItems = getAllFieldDefinitions(data);
  const visibleItems = allItems.filter(item => visibleFields.has(item.id));

  const handleCopyToClipboard = async (value: string, itemId: string) => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(null), 2000);
      if (onFieldCopy) {
        onFieldCopy(itemId, value);
      }
    }
  };

  if (visibleItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Icon iconType={['system', 'eye']} size={24} className="text-gray-300 mb-2" />
        <p className="text-sm text-gray-400 mb-3">표시할 필드가 없습니다</p>
        {onOpenOverlay && (
          <button
            onClick={onOpenOverlay}
            className="text-xs text-blue-500 hover:text-blue-700 hover:underline transition-colors"
          >
            정보 보기 설정에서 표시할 필드를 선택하세요
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="@container space-y-3">
      <div className="grid grid-cols-1 @xs:grid-cols-2 gap-x-2 gap-y-2">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center py-1 relative ${
              columnSettings.has(item.id) ? '@xs:col-span-2' : ''
            }`}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className="font-body size-sm line-height-leading-5 letter-spacing-tracking-tight font-medium text-default min-w-[80px]">
              {item.label}:
            </span>
            <div className="flex items-center flex-1 ml-2 min-w-0">
              <TooltipTrigger
                content={String(item.value)}
                placement="bottom-start"
                disabled={!item.value || String(item.value).length <= 20}
              >
                <span
                  className={`text-sm ${
                    item.color || 'text-gray-800'
                  } text-left truncate min-w-0 block`}
                >
                  {item.value || '미확인'}
                </span>
              </TooltipTrigger>

              <div className="w-6 h-5 flex-shrink-0 ml-1">
                {hoveredItem === item.id && (
                  <Button
                    onClick={() => handleCopyToClipboard(String(item.value) || '', item.id)}
                    variant="iconOnly"
                    buttonStyle="ghost"
                    size="2xs"
                    leadIcon={
                      copiedItem === item.id ? (
                        <Icon iconType={['system', 'check']} size={12} color="success" />
                      ) : (
                        <Icon iconType={['document', 'file-copy']} size={12} color="default-muted" />
                      )
                    }
                    title="복사"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerInfoSection;
