import React, { useMemo, useState } from 'react';
import { Icon, Button, Select, Input, ScrollArea } from '@blumnai-studio/blumnai-design-system';
import type { Template, SmsSenderNumber } from '../types';

const ALIMTALK_BRANDS = [
  { id: 'apple', name: 'Apple 스토어' },
  { id: 'banana', name: 'Banana 마켓' },
  { id: 'cherry', name: 'Cherry 몰' },
  { id: 'dragon', name: 'Dragon Fruit 샵' },
  { id: 'elderberry', name: 'Elderberry 플러스' },
];

interface TemplateSelectorProps {
  templates: Template[];
  filteredTemplates: Template[];
  selectedTemplateId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (templateId: string) => void;
  onToggleFavorite?: (templateId: string) => void;
  channelType?: 'sms' | 'alimtalk';
  senderNumbers?: SmsSenderNumber[];
  selectedSenderId?: string | null;
  onSenderChange?: (id: string) => void;
  brandId?: string;
}

const CHANNEL_COPY = {
  sms: {
    controlLabel: '발신 번호',
    searchPlaceholder: '템플릿 검색',
    emptySearch: '검색 결과가 없습니다.',
    emptyDefault: '등록된 템플릿이 없습니다.',
    pendingLabel: '대기',
    favoriteTitle: '즐겨찾기',
    favoriteRemoveTitle: '즐겨찾기 해제',
  },
  alimtalk: {
    controlLabel: '발신 브랜드',
    searchPlaceholder: '템플릿 검색',
    emptySearch: '검색 결과가 없습니다.',
    emptyDefault: '등록된 템플릿이 없습니다.',
    pendingLabel: '대기',
    favoriteTitle: '즐겨찾기',
    favoriteRemoveTitle: '즐겨찾기 해제',
  },
} as const;

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  filteredTemplates,
  selectedTemplateId,
  searchQuery,
  onSearchChange,
  onSelect,
  onToggleFavorite,
  channelType = 'sms',
  senderNumbers = [],
  selectedSenderId,
  onSenderChange,
  brandId,
}) => {
  const [selectedBrandId, setSelectedBrandId] = useState(brandId || ALIMTALK_BRANDS[0]?.id || '');
  const copy = CHANNEL_COPY[channelType];

  const groupedTemplates = useMemo(() => {
    const sorted = [...filteredTemplates].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });

    const groups: Record<string, Template[]> = {};
    sorted.forEach((template) => {
      if (!groups[template.category]) {
        groups[template.category] = [];
      }
      groups[template.category].push(template);
    });
    return groups;
  }, [filteredTemplates]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
        <div className="flex items-center gap-2">
          <span className="flex-shrink-0 text-sm font-medium text-gray-600">{copy.controlLabel}</span>
          <div className="min-w-0 flex-1">
            {channelType === 'sms' ? (
              <Select
                variant="default"
                options={senderNumbers.map((number) => ({
                  id: number.id,
                  label: `${number.number} (${number.label})`,
                }))}
                value={selectedSenderId || undefined}
                onChange={(nextValue) => onSenderChange?.(nextValue)}
                size="sm"
              />
            ) : (
              <Select
                variant="default"
                options={ALIMTALK_BRANDS.map((brand) => ({
                  id: brand.id,
                  label: brand.name,
                }))}
                value={selectedBrandId}
                onChange={(nextValue) => setSelectedBrandId(nextValue)}
                size="sm"
              />
            )}
          </div>
        </div>
      </div>

      <div className="py-2.5">
        <Input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={copy.searchPlaceholder}
          leadIcon={['system', 'search']}
          size="sm"
        />
      </div>

      <ScrollArea orientation="vertical" className="min-h-0 flex-1 overflow-hidden pr-1">
        <div className="space-y-3 pr-2 pb-1">
          {Object.entries(groupedTemplates).map(([category, templates]) => (
            <div key={category}>
              <div className="mb-1.5 flex items-center justify-between gap-2 px-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                  {category}
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                  {templates.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {templates.map((template) => {
                  const isSelected = selectedTemplateId === template.id;

                  return (
                    <div
                      key={template.id}
                      onClick={() => onSelect(template.id)}
                      className={`w-full overflow-hidden rounded-xl border px-3 py-2 text-left transition-colors ${
                        isSelected
                          ? 'border-blue-200 bg-blue-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onSelect(template.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <Button
                          type="button"
                          variant="iconOnly"
                          buttonStyle="ghost"
                          size="2xs"
                          onClick={(event) => {
                            event.stopPropagation();
                            onToggleFavorite?.(template.id);
                          }}
                          className="mt-0.5 flex-shrink-0 hover:scale-110 transition-transform"
                          title={template.isFavorite ? copy.favoriteRemoveTitle : copy.favoriteTitle}
                          leadIcon={
                            <Icon
                              iconType={['system', 'star']}
                              size={11}
                              isFill={template.isFavorite}
                              color={template.isFavorite ? 'warning' : 'default-disabled'}
                              className={!template.isFavorite ? 'hover:text-yellow-400' : ''}
                            />
                          }
                        />
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span
                              className={`block truncate text-sm font-medium ${
                                isSelected ? 'text-blue-700' : 'text-gray-800'
                              }`}
                            >
                              {template.name}
                            </span>
                            {template.status === 'pending' && (
                              <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-600">
                                {copy.pendingLabel}
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5 overflow-hidden text-[11px] leading-4 text-gray-500">
                            <div className="truncate">{template.content.replace(/\s+/g, ' ').trim()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
              <div className="text-sm font-medium text-gray-500">
                {searchQuery ? copy.emptySearch : copy.emptyDefault}
              </div>
              <p className="mt-1 text-xs text-gray-400">
                검색어를 조정하거나 다른 카테고리를 확인해 주세요.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TemplateSelector;
