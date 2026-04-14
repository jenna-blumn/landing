import React from 'react';
import MultiSelectDropdown from '../common/MultiSelectDropdown';
import { CategoryFilter } from '../../features/search/types';
import { getDefaultCategories } from '../../features/contactTab/utils/categoryDefinitions';

interface CategoryFilterDropdownsProps {
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
}

const categoryStructure = getDefaultCategories();

// 대분류 옵션
const majorOptions = Object.keys(categoryStructure).map(key => ({
  value: key,
  label: key,
}));

// 선택된 대분류에 따른 중분류 옵션 (종속적)
const getMiddleOptions = (selectedMajors: string[]) => {
  const options: Array<{ value: string; label: string }> = [];
  const seen = new Set<string>();

  const majors = selectedMajors.length === 0 ? Object.keys(categoryStructure) : selectedMajors;

  for (const major of majors) {
    const middles = categoryStructure[major];
    if (middles) {
      for (const middle of Object.keys(middles)) {
        if (!seen.has(middle)) {
          seen.add(middle);
          options.push({ value: middle, label: middle });
        }
      }
    }
  }
  return options;
};

// 선택된 대/중분류에 따른 소분류 옵션 (종속적)
const getMinorOptions = (selectedMajors: string[], selectedMiddles: string[]) => {
  const options: Array<{ value: string; label: string }> = [];
  const seen = new Set<string>();

  const majors = selectedMajors.length === 0 ? Object.keys(categoryStructure) : selectedMajors;

  for (const major of majors) {
    const middles = categoryStructure[major];
    if (!middles) continue;

    const middleKeys = selectedMiddles.length === 0 ? Object.keys(middles) : selectedMiddles;

    for (const middle of middleKeys) {
      const minors = middles[middle];
      if (!minors) continue;
      for (const minor of minors) {
        if (!seen.has(minor)) {
          seen.add(minor);
          options.push({ value: minor, label: minor });
        }
      }
    }
  }
  return options;
};

const CategoryFilterDropdowns: React.FC<CategoryFilterDropdownsProps> = ({ value, onChange }) => {
  const middleOptions = getMiddleOptions(value.major);
  const minorOptions = getMinorOptions(value.major, value.middle);

  const handleMajorChange = (selected: string[]) => {
    // 대분류 변경 시 중/소분류 중 유효하지 않은 항목 제거
    const newMiddleOptions = getMiddleOptions(selected);
    const validMiddles = value.middle.filter(m => newMiddleOptions.some(o => o.value === m));

    const newMinorOptions = getMinorOptions(selected, validMiddles);
    const validMinors = value.minor.filter(m => newMinorOptions.some(o => o.value === m));

    onChange({
      major: selected,
      middle: validMiddles,
      minor: validMinors,
    });
  };

  const handleMiddleChange = (selected: string[]) => {
    // 중분류 변경 시 소분류 중 유효하지 않은 항목 제거
    const newMinorOptions = getMinorOptions(value.major, selected);
    const validMinors = value.minor.filter(m => newMinorOptions.some(o => o.value === m));

    onChange({
      ...value,
      middle: selected,
      minor: validMinors,
    });
  };

  const handleMinorChange = (selected: string[]) => {
    onChange({
      ...value,
      minor: selected,
    });
  };

  return (
    <>
      <MultiSelectDropdown
        options={majorOptions}
        selected={value.major}
        onChange={handleMajorChange}
        label="대분류"
        allLabel="전체 대분류"
        minWidth={140}
      />
      <MultiSelectDropdown
        options={middleOptions}
        selected={value.middle}
        onChange={handleMiddleChange}
        label="중분류"
        allLabel="전체 중분류"
        minWidth={140}
      />
      <MultiSelectDropdown
        options={minorOptions}
        selected={value.minor}
        onChange={handleMinorChange}
        label="소분류"
        allLabel="전체 소분류"
        minWidth={140}
      />
    </>
  );
};

export default CategoryFilterDropdowns;
