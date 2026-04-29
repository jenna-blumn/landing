import React, { useState, useRef, useEffect } from 'react';
import { Badge, Button, Icon, Checkbox, Dialog, DialogContent, DialogHeader, DialogScrollArea, DialogTitle, Input, Popover, PopoverTrigger, PopoverContent } from '@blumnai-studio/blumnai-design-system';
import type { BadgeColor } from '@blumnai-studio/blumnai-design-system';
import { Tag } from '../../types';

interface TagSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTag: (name: string, color: string) => void;
  onRemoveTag: (tagId: number) => void;
  existingTags: Tag[];
  availableTags?: Tag[];
  title?: string;
}

const PREDEFINED_TAGS: { name: string; color: BadgeColor }[] = [
  { name: 'VIP고객', color: 'red' },
  { name: '우선처리', color: 'orange' },
  { name: '단골고객', color: 'blue' },
  { name: '신규고객', color: 'green' },
  { name: '문제고객', color: 'orange' },
];

const TagSelectionModal: React.FC<TagSelectionModalProps> = ({
  isOpen,
  onClose,
  onAddTag,
  onRemoveTag,
  existingTags,
  availableTags,
  title = '고객에게 태그 추가',
}) => {
  const [filterText, setFilterText] = useState('');
  const [newTagColor, setNewTagColor] = useState<BadgeColor>('neutral');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const availableColors: { value: BadgeColor; label: string }[] = [
    { value: 'blue', label: '파란색' },
    { value: 'green', label: '초록색' },
    { value: 'red', label: '빨간색' },
    { value: 'orange', label: '주황색' },
    { value: 'violet', label: '보라색' },
    { value: 'pink', label: '분홍색' },
    { value: 'neutral', label: '회색' },
    { value: 'cyan', label: '청록색' },
  ];

  const existingTagNames = new Set(existingTags.map(tag => tag.name));

  const allTags = [
    ...existingTags.map(tag => ({ ...tag, isExisting: true })),
    ...(availableTags
      ? availableTags.filter(tag => !existingTagNames.has(tag.name)).map(tag => ({ ...tag, isExisting: false }))
      : PREDEFINED_TAGS
          .filter(tag => !existingTagNames.has(tag.name))
          .map(tag => ({
            id: -1,
            name: tag.name,
            color: tag.color,
            createdBy: '시스템',
            createdAt: '',
            isExisting: false,
          }))),
  ];

  const filteredTags = allTags.filter(tag =>
    tag.name.toLowerCase().includes(filterText.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setFilterText('');
      setNewTagColor('neutral');
      setShowColorPicker(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);


  const handleTagToggle = (tag: typeof allTags[0]) => {
    if (tag.isExisting) {
      onRemoveTag(tag.id);
    } else {
      onAddTag(tag.name, tag.color);
    }
  };

  const handleAddNewTag = () => {
    const trimmedName = filterText.trim();
    if (trimmedName && !existingTagNames.has(trimmedName)) {
      onAddTag(trimmedName, newTagColor);
      setFilterText('');
      setNewTagColor('neutral');
      setShowColorPicker(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filterText.trim()) {
      e.preventDefault();
      handleAddNewTag();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const isCreatingNew =
    filterText.trim().length > 0 && !allTags.some(tag => tag.name === filterText.trim());

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent width={400}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div>
          <Input
            ref={inputRef}
            value={filterText}
            onChange={(e) => {
              if (e.target.value.length <= 20) setFilterText(e.target.value);
            }}
            onKeyDown={handleKeyPress}
            placeholder="태그 검색 또는 새 태그 입력..."
            maxLength={20}
            showCount={isCreatingNew}
            size="sm"
          />
          {isCreatingNew && (
            <div className="flex items-center justify-between mt-1">
              <div >
              <Badge label={`#${filterText.trim()}`} color={newTagColor} size="lg" shape="pill" />
                {existingTagNames.has(filterText.trim()) && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    이미 존재하는 태그입니다.
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-500">Enter 키를 눌러 태그를 추가하세요</div>
              </div>
              <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="iconOnly"
                    buttonStyle="ghost"
                    size="2xs"
                    leadIcon={<Badge variant="dot" color={newTagColor} label="" />}
                    title="색상 선택"
                  />
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={4} width="fit-content">
                  <div className="grid grid-cols-4 gap-2">
                    {availableColors.map((color) => (
                      <Button
                        key={color.value}
                        onClick={() => {
                          setNewTagColor(color.value);
                          setShowColorPicker(false);
                        }}
                        variant="iconOnly"
                        buttonStyle="ghost"
                        size="2xs"
                        leadIcon={<Badge variant="dot" color={color.value} label="" />}
                        className={newTagColor === color.value ? 'ring-2 ring-gray-600 rounded' : ''}
                        title={color.label}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <DialogScrollArea maxHeight={250}>
          {!isCreatingNew && filteredTags.length > 0 && (
            <div className="space-y-1">
              {filteredTags.map((tag, index) => (
                <div
                  key={tag.isExisting ? tag.id : `predefined-${index}`}
                  onClick={() => handleTagToggle(tag)}
                  className={`w-full flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
                    tag.isExisting
                      ? 'bg-blue-50 border-blue-200'
                      : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <Checkbox
                    checked={tag.isExisting}
                  />
                  <Badge label={`#${tag.name}`} color={tag.color as BadgeColor} size="lg" shape="pill" />
                </div>
              ))}
            </div>
          )}
          {!isCreatingNew && filteredTags.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              <Icon iconType={['editor', 'hashtag']} size={32} className="mx-auto mb-2 opacity-50" />
              <p>검색 결과가 없습니다.</p>
              <p className="text-xs mt-1">새로운 태그를 입력하여 생성하세요.</p>
            </div>
          )}
        </DialogScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TagSelectionModal;
