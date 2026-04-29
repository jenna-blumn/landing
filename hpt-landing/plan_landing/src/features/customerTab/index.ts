export { default as CustomerInfoTabContainer } from './components/CustomerInfoTabContainer';
export { default as SectionWrapper } from './components/SectionWrapper';
export { default as CustomerInfoSection } from './components/sections/CustomerInfoSection';
export { default as CustomerMemoSection } from './components/sections/CustomerMemoSection';
export { default as CustomerTagSection } from './components/sections/CustomerTagSection';
export { default as TagSelectionModal } from './components/modals/TagSelectionModal';
export { default as ApiSettingsModal } from './components/modals/ApiSettingsModal';
export { default as CustomerInfoOverlay } from './components/overlay/CustomerInfoOverlay';

export type {
  SectionConfig,
  CustomerInfo,
  BlockStatus,
  Memo,
  Tag,
  CustomSection,
  FieldDefinition,
  CustomerInfoTabProps,
} from './types';
export { SECTION_TYPES, DEFAULT_SECTIONS } from './types';

export { useCustomerInfoState, useMemoManagement, useTagManagement } from './hooks/useCustomerInfoState';
export { useFieldVisibility } from './hooks/useFieldVisibility';
export { getAllFieldDefinitions, getDefaultVisibleFields, getFieldsByCategory } from './utils/fieldDefinitions';
export { copyToClipboard } from './utils/copyToClipboard';
