import React from 'react';
import { CustomerInfoTabContainer } from '../../../features/customerTab';
import type { CustomerInfo, Memo, Tag, CustomerTagItemId, CustomerGradeOption } from '../../../features/customerTab/types';

interface InfoTabContentProps {
  visibleFields?: Set<string>;
  onToggleFieldVisibility?: (fieldId: string) => void;
  columnSettings?: Set<string>;
  onToggleColumnSetting?: (fieldId: string) => void;
  customerData: CustomerInfo;
  onNavigateToHistory?: () => void;
  isManagerMode?: boolean;

  // Shared memo/tag state for bidirectional sync with composite tab
  memos?: Memo[];
  onAddMemo?: (content: string) => void;
  onEditMemo?: (id: number, content: string) => void;
  onDeleteMemo?: (id: number) => void;
  tags?: Tag[];
  onAddTag?: (tag: Omit<Tag, 'id'>) => void;
  onDeleteTag?: (id: number) => void;

  isCustomerInfoOverlayOpen?: boolean;
  onToggleCustomerInfoOverlay?: (open: boolean) => void;

  // Customer tag visibility & grade (shared for composite tab sync)
  customerTagVisibility?: Set<CustomerTagItemId>;
  onToggleCustomerTagVisibility?: (itemId: CustomerTagItemId) => void;
  customerTagAllItems?: CustomerTagItemId[];
  customerGrade?: string;
  onChangeCustomerGrade?: (gradeId: string) => void;
  gradeOptions?: CustomerGradeOption[];
}

const InfoTabContent: React.FC<InfoTabContentProps> = ({
  customerData,
  visibleFields,
  onToggleFieldVisibility,
  columnSettings,
  onToggleColumnSetting,
  isManagerMode,
  memos,
  onAddMemo,
  onEditMemo,
  onDeleteMemo,
  tags,
  onAddTag,
  onDeleteTag,
  isCustomerInfoOverlayOpen,
  onToggleCustomerInfoOverlay,
  customerTagVisibility,
  onToggleCustomerTagVisibility,
  customerTagAllItems,
  customerGrade,
  onChangeCustomerGrade,
  gradeOptions,
}) => {
  return (
    <CustomerInfoTabContainer
      customerData={customerData}
      visibleFields={visibleFields}
      onToggleFieldVisibility={onToggleFieldVisibility}
      columnSettings={columnSettings}
      onToggleColumnSetting={onToggleColumnSetting}
      isManagerMode={isManagerMode}
      memos={memos}
      onAddMemo={onAddMemo}
      onEditMemo={onEditMemo}
      onDeleteMemo={onDeleteMemo}
      tags={tags}
      onAddTag={onAddTag ? (name: string, color: string) => onAddTag({ name, color, createdBy: '현재 상담사', createdAt: new Date().toLocaleString('ko-KR') }) : undefined}
      onDeleteTag={onDeleteTag}
      isCustomerInfoOverlayOpen={isCustomerInfoOverlayOpen}
      onToggleCustomerInfoOverlay={onToggleCustomerInfoOverlay}
      customerTagVisibility={customerTagVisibility}
      onToggleCustomerTagVisibility={onToggleCustomerTagVisibility}
      customerTagAllItems={customerTagAllItems}
      customerGrade={customerGrade}
      onChangeCustomerGrade={onChangeCustomerGrade}
      gradeOptions={gradeOptions}
    />
  );
};

export default InfoTabContent;
