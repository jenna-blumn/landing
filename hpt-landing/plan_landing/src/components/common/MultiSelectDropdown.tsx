import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  Icon,
} from '@blumnai-studio/blumnai-design-system';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
  allLabel?: string;
  disabled?: boolean;
  /** 그룹 헤더 (섹션 구분용) */
  groupHeader?: string;
  /** 최소 너비 */
  minWidth?: number;
}

// eslint-disable-next-line react-refresh/only-export-components
export const getChipText = (
  label: string,
  selected: string[],
  options: MultiSelectOption[],
  allLabel?: string
): string => {
  if (selected.length === 0) {
    return allLabel ? `${label}: ${allLabel}` : label;
  }
  if (selected.length === options.length) {
    return allLabel ? `${label}: ${allLabel}` : label;
  }
  const firstName = options.find(o => o.value === selected[0])?.label || selected[0];
  if (selected.length === 1) {
    return `${label}: ${firstName}`;
  }
  return `${label}: ${firstName} 외 ${selected.length - 1}건`;
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selected,
  onChange,
  label,
  allLabel = '전체',
  disabled = false,
  groupHeader,
  minWidth = 120,
}) => {
  const [tempSelected, setTempSelected] = useState<string[]>(selected);

  const toggleItem = (value: string) => {
    setTempSelected(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleAll = () => {
    if (tempSelected.length === options.length) {
      setTempSelected([]);
    } else {
      setTempSelected(options.map(o => o.value));
    }
  };

  const applySelection = () => {
    onChange(tempSelected);
  };

  const isActive = selected.length > 0 && selected.length < options.length;
  const chipText = getChipText(label, selected, options, allLabel);

  return (
    <DropdownMenu onOpenChange={(open) => { if (open) setTempSelected(selected); }}>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={disabled}
          buttonStyle={isActive ? 'primary' : 'secondary'}
          size="xs"
          shape="pill"
          tailIcon={<Icon iconType={['arrows', 'arrow-down-s']} size={12} className="flex-shrink-0" />}
          className="max-w-[200px]"
        >
          <span className="truncate">{chipText}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent width={minWidth}>
        <div className="p-2">
          {groupHeader && (
            <div className="text-xs font-semibold text-gray-500 px-2 py-1 mb-1">
              {groupHeader}
            </div>
          )}
          <div className="border-b border-gray-100 mb-1 px-2 py-1.5 hover:bg-gray-50 rounded">
            <Checkbox
              checked={tempSelected.length === options.length}
              onCheckedChange={toggleAll}
              label={<span className="text-xs text-gray-700 font-semibold">{allLabel}</span>}
            />
          </div>
          <div className="max-h-[240px] overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className="px-2 py-1.5 hover:bg-gray-50 rounded"
              >
                <Checkbox
                  checked={tempSelected.includes(option.value)}
                  onCheckedChange={() => toggleItem(option.value)}
                  label={<span className="text-xs text-gray-700">{option.label}</span>}
                />
              </div>
            ))}
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="p-2 flex items-center justify-center">
          <Button
            onClick={applySelection}
            buttonStyle="primary"
            size="xs"
          >
            적용
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MultiSelectDropdown;
