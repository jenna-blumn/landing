import React, { useCallback, useState } from 'react';
import { Button, ScrollArea, Icon, Sortable, SortableItem, DragOverlay } from '@blumnai-studio/blumnai-design-system';
import { CustomerInfoTabProps, DEFAULT_SECTIONS, SECTION_TYPES, SectionConfig, Memo, Tag, BlockStatus } from '../types';
import { useCustomerInfoState, useMemoManagement, useTagManagement, useCustomerGrade } from '../hooks/useCustomerInfoState';
import { useFieldVisibility } from '../hooks/useFieldVisibility';
import { useCustomerTagVisibility } from '../hooks/useCustomerTagVisibility';
import { blockCustomer, unblockCustomer, getBlockStatus } from '../api/blockApi';
import SectionWrapper from './SectionWrapper';
import CustomerInfoSection from './sections/CustomerInfoSection';
import CustomerMemoSection from './sections/CustomerMemoSection';
import CustomerTagSection from './sections/CustomerTagSection';
import CustomerTagVisibilityDropdown from './sections/CustomerTagVisibilityDropdown';
import ApiSettingsModal from './modals/ApiSettingsModal';
import BlockCustomerDialog from './modals/BlockCustomerDialog';

const CustomerInfoTabContainer: React.FC<CustomerInfoTabProps> = ({
  customerData,
  sections: propSections,
  customSections = [],
  isManagerMode = false,
  visibleFields: propVisibleFields,
  onToggleFieldVisibility: _propOnToggleFieldVisibility,
  columnSettings: propColumnSettings,
  onToggleColumnSetting: _propOnToggleColumnSetting,
  memos: propMemos,
  onAddMemo: propOnAddMemo,
  onEditMemo: propOnEditMemo,
  onDeleteMemo: propOnDeleteMemo,
  tags: propTags,
  onAddTag: propOnAddTag,
  onEditTag: _propOnEditTag,
  onDeleteTag: propOnDeleteTag,
  customerTagVisibility: propCustomerTagVisibility,
  onToggleCustomerTagVisibility: propOnToggleCustomerTagVisibility,
  customerTagAllItems: propCustomerTagAllItems,
  customerGrade: propCustomerGrade,
  onChangeCustomerGrade: propOnChangeCustomerGrade,
  gradeOptions: propGradeOptions,
  customerInfoRenderer,
  customerMemoRenderer,
  customerTagRenderer,
  isCustomerInfoOverlayOpen: _propOverlayOpen,
  onToggleCustomerInfoOverlay: propOnToggleOverlay,
  onSectionReorder,
  className = '',
}) => {
  const initialSections = propSections || DEFAULT_SECTIONS;

  const { sections, handleReorder, updateSectionSettings } = useCustomerInfoState(initialSections);

  const DEFAULT_MEMOS: Memo[] = [
    {
      id: 1,
      content: '고객이 배송 지연에 대해 문의함. 택배사에 확인 후 답변 예정',
      author: '상담사 김철수',
      createdAt: '2024-01-20 14:30',
    },
  ];

  const DEFAULT_TAGS: Tag[] = [
    { id: 1, name: 'VIP고객', color: 'red', createdBy: '시스템', createdAt: '2024-01-15' },
    { id: 2, name: '우선처리', color: 'orange', createdBy: '상담사 김철수', createdAt: '2024-01-20' },
    { id: 3, name: '단골고객', color: 'blue', createdBy: '시스템', createdAt: '2024-01-10' },
  ];

  const internalFieldVisibility = useFieldVisibility(propVisibleFields);
  const internalMemoManagement = useMemoManagement(propMemos || DEFAULT_MEMOS);
  const internalTagManagement = useTagManagement(propTags || DEFAULT_TAGS);

  const visibleFields = propVisibleFields || internalFieldVisibility.visibleFields;
  const columnSettings = propColumnSettings || internalFieldVisibility.columnSettings;

  const memos = propMemos || internalMemoManagement.memos;
  const addMemo = propOnAddMemo || internalMemoManagement.addMemo;
  const editMemo = propOnEditMemo || internalMemoManagement.editMemo;
  const deleteMemo = propOnDeleteMemo || internalMemoManagement.deleteMemo;

  const tags = propTags || internalTagManagement.tags;
  const addTag = propOnAddTag || internalTagManagement.addTag;
  const deleteTag = propOnDeleteTag || internalTagManagement.deleteTag;

  // Customer tag visibility
  const internalTagVisibility = useCustomerTagVisibility(propCustomerTagVisibility, propOnToggleCustomerTagVisibility);
  const customerTagVisibility = propCustomerTagVisibility || internalTagVisibility.visibleItems;
  const toggleCustomerTagVisibility = propOnToggleCustomerTagVisibility || internalTagVisibility.toggleItem;
  const customerTagAllItems = propCustomerTagAllItems || internalTagVisibility.allItems;

  // Customer grade
  const internalGrade = useCustomerGrade(customerData?.customerId);
  const customerGrade = propCustomerGrade ?? internalGrade.grade;
  const changeCustomerGrade = propOnChangeCustomerGrade || internalGrade.changeGrade;
  const gradeOptions = propGradeOptions || internalGrade.gradeOptions;

  // Overlay state
  const [, setInternalOverlayOpen] = useState(false);
  const toggleOverlay = propOnToggleOverlay || setInternalOverlayOpen;

  // API Settings Modal state
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [apiModalSectionId, setApiModalSectionId] = useState<string | null>(null);

  // Block Customer state
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockStatus, setBlockStatus] = useState<BlockStatus | null>(null);

  const defaultCustomerData = {
    name: '김고객',
    email: 'customer@example.com',
    phone: '+1 (555) 123-4567',
    customerId: '6fa36417-c923-4cee-aa54-cfbb3',
  };

  const data = customerData || defaultCustomerData;

  // Load block status on mount and when customerId changes
  React.useEffect(() => {
    if (data.customerId) {
      setBlockStatus(getBlockStatus(data.customerId));
    }
  }, [data.customerId]);

  const handleBlock = useCallback((reason: string) => {
    const status = blockCustomer(data.customerId, reason, '현재 상담사');
    setBlockStatus(status);
  }, [data.customerId]);

  const handleUnblock = useCallback(() => {
    unblockCustomer(data.customerId);
    setBlockStatus(null);
  }, [data.customerId]);

  const handleReorderWrapper = useCallback(
    (reorderedSections: SectionConfig[]) => {
      handleReorder(reorderedSections);
      if (onSectionReorder) {
        onSectionReorder(reorderedSections.map((s, i) => ({ ...s, order: i })));
      }
    },
    [handleReorder, onSectionReorder]
  );

  const handleSectionSettingsClick = useCallback((sectionId: string) => {
    setApiModalSectionId(sectionId);
    setApiModalOpen(true);
  }, []);

  const handleApiSettingsSave = useCallback((settings: SectionConfig['apiSettings']) => {
    if (apiModalSectionId && settings) {
      updateSectionSettings(apiModalSectionId, { apiSettings: settings });
    }
  }, [apiModalSectionId, updateSectionSettings]);

  const currentApiSection = sections.find(s => s.id === apiModalSectionId);

  const renderSectionContent = (section: typeof sections[0]) => {
    const customSection = customSections.find(cs => cs.section.id === section.id);
    if (customSection) {
      return customSection.renderContent(data);
    }

    switch (section.type) {
      case SECTION_TYPES.CUSTOMER_INFO:
        if (customerInfoRenderer) {
          return customerInfoRenderer(data, { visibleFields, columnSettings });
        }
        return (
          <CustomerInfoSection
            data={data}
            visibleFields={visibleFields}
            columnSettings={columnSettings}
            onOpenOverlay={() => toggleOverlay(true)}
          />
        );

      case SECTION_TYPES.CUSTOMER_MEMO:
        if (customerMemoRenderer) {
          return customerMemoRenderer(memos, { addMemo, editMemo, deleteMemo });
        }
        return (
          <CustomerMemoSection
            memos={memos}
            onAddMemo={addMemo}
            onEditMemo={editMemo}
            onDeleteMemo={deleteMemo}
          />
        );

      case SECTION_TYPES.CUSTOMER_TAG:
        if (customerTagRenderer) {
          return customerTagRenderer(tags, { addTag, deleteTag });
        }
        return (
          <CustomerTagSection
            tags={tags}
            onAddTag={addTag}
            onDeleteTag={deleteTag}
            visibleItems={customerTagVisibility}
            customerGrade={customerGrade}
            onChangeCustomerGrade={changeCustomerGrade}
            gradeOptions={gradeOptions}
          />
        );

      default:
        return <div className="text-gray-500 text-center py-4">Unknown section type</div>;
    }
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const getSettingsContent = (section: SectionConfig) => {
    if (section.type === SECTION_TYPES.CUSTOMER_TAG) {
      return (
        <CustomerTagVisibilityDropdown
          visibleItems={customerTagVisibility}
          onToggle={toggleCustomerTagVisibility}
          allItems={customerTagAllItems}
        />
      );
    }
    return undefined;
  };

  const blockHeaderAction = (
    <Button
      onClick={() => setBlockDialogOpen(true)}
      variant="iconOnly"
      buttonStyle="ghost"
      size="2xs"
      leadIcon={<Icon iconType={['system', 'shield-cross']} size={16} />}
      className={blockStatus
        ? 'text-red-500 hover:bg-red-50'
        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}
      title={blockStatus ? '차단된 고객' : '고객 차단'}
    />
  );

  return (
    <div className={`flex-1 min-h-0 flex flex-col relative ${className}`}>
      {/* 차단 상태 배너 */}
      {blockStatus && (
        <div className="bg-red-50 border-b border-red-200 px-3 py-2 flex items-center gap-2">
          <Icon iconType={['system', 'shield-cross']} size={14} color="destructive" className="flex-shrink-0" />
          <span className="text-xs text-red-700 flex-1 truncate">
            차단된 고객 — {blockStatus.reason}
          </span>
          <Button
            onClick={() => setBlockDialogOpen(true)}
            buttonStyle="ghost"
            size="xs"
            className="text-red-600 hover:text-red-800 flex-shrink-0"
          >
            상세
          </Button>
        </div>
      )}

      <ScrollArea orientation="vertical" maxHeight="100%" className="flex-1 min-h-0">
        <Sortable items={sortedSections} onReorder={handleReorderWrapper} strategy="vertical">
          {sortedSections.map((section) => {
            const settingsContent = getSettingsContent(section);
            return (
              <SortableItem key={section.id} id={section.id} handle>
                <SectionWrapper
                  sectionId={section.id}
                  title={section.name}
                  initialCollapsed={section.isCollapsed}
                  showSettings={section.type !== SECTION_TYPES.CUSTOMER_MEMO}
                  showOverlay={section.type === SECTION_TYPES.CUSTOMER_INFO}
                  onSectionSettingsClick={handleSectionSettingsClick}
                  onOpenOverlay={() => toggleOverlay(true)}
                  headerAction={section.type === SECTION_TYPES.CUSTOMER_INFO ? blockHeaderAction : undefined}
                  settingsContent={settingsContent}
                >
                  {renderSectionContent(section)}
                </SectionWrapper>
              </SortableItem>
            );
          })}
          <DragOverlay>
            {(activeItem) => {
              if (!activeItem) return null;
              const section = sortedSections.find(s => s.id === activeItem.id);
              if (!section) return null;
              return (
                <div className="border rounded-lg bg-white border-gray-200">
                  <div className="h-12 px-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                    <Icon iconType={['editor', 'draggable']} size={16} color="default-muted" />
                    <h3 className="text-sm font-semibold text-gray-700">{section.name}</h3>
                  </div>
                </div>
              );
            }}
          </DragOverlay>
        </Sortable>

        {customSections
          .filter(cs => !sections.find(s => s.id === cs.section.id))
          .map(({ section, renderContent }) => (
            <SectionWrapper
              key={section.id}
              sectionId={section.id}
              title={section.name}
              initialCollapsed={section.isCollapsed}
              showSettings={false}
            >
              {renderContent(data)}
            </SectionWrapper>
          ))}
      </ScrollArea>

      {/* API Settings Modal */}
      <ApiSettingsModal
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
        onSave={handleApiSettingsSave}
        sectionName={currentApiSection?.name || '고객 정보'}
        currentSettings={currentApiSection?.apiSettings}
      />

      {/* Block Customer Dialog */}
      <BlockCustomerDialog
        isOpen={blockDialogOpen}
        onClose={() => setBlockDialogOpen(false)}
        onBlock={handleBlock}
        onUnblock={handleUnblock}
        isManagerMode={isManagerMode}
        blockStatus={blockStatus}
        customerName={data.name}
      />
    </div>
  );
};

export default CustomerInfoTabContainer;
