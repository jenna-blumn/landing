import React, { useState } from 'react';
import { Button, Icon } from '@blumnai-studio/blumnai-design-system';
import { CustomerInfo, FieldDefinition } from '../../types';
import { getAllFieldDefinitions } from '../../utils/fieldDefinitions';
import { copyToClipboard } from '../../utils/copyToClipboard';

interface CustomerInfoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: CustomerInfo;
  visibleFields: Set<string>;
  onToggleFieldVisibility: (fieldId: string) => void;
  columnSettings: Set<string>;
  onToggleColumnSetting: (fieldId: string) => void;
  fieldOrder?: Record<string, string[]>;
  onUpdateFieldOrder?: (category: string, newOrder: string[]) => void;
}

const CATEGORY_LABELS: Record<FieldDefinition['category'], string> = {
  basic: '기본 정보',
  contact: '연락처 정보',
  address: '주소 정보',
  system: '시스템 정보',
  activity: '활동 기록',
  other: '기타',
};

const CATEGORY_ORDER: FieldDefinition['category'][] = [
  'basic', 'contact', 'address', 'system', 'activity', 'other',
];

const CustomerInfoOverlay: React.FC<CustomerInfoOverlayProps> = ({
  isOpen,
  onClose,
  customerData,
  visibleFields,
  onToggleFieldVisibility,
  columnSettings,
  onToggleColumnSetting,
  fieldOrder: externalFieldOrder,
  onUpdateFieldOrder,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [internalFieldOrder, setInternalFieldOrder] = useState<Record<string, string[]>>({});
  const fieldOrder = externalFieldOrder ?? internalFieldOrder;
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [dragOverFieldId, setDragOverFieldId] = useState<string | null>(null);

  if (!isOpen) return null;

  const allFields = getAllFieldDefinitions(customerData);

  const fieldsByCategory = CATEGORY_ORDER.reduce((acc, category) => {
    const categoryFields = allFields.filter(f => f.category === category);
    // Apply custom order if exists
    if (fieldOrder[category]) {
      const ordered: FieldDefinition[] = [];
      fieldOrder[category].forEach(id => {
        const field = categoryFields.find(f => f.id === id);
        if (field) ordered.push(field);
      });
      // Add any new fields not in the order
      categoryFields.forEach(f => {
        if (!fieldOrder[category].includes(f.id)) ordered.push(f);
      });
      acc[category] = ordered;
    } else {
      acc[category] = categoryFields;
    }
    return acc;
  }, {} as Record<string, FieldDefinition[]>);

  const handleCopy = async (value: string, fieldId: string) => {
    const success = await copyToClipboard(String(value));
    if (success) {
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Drag handlers for field reordering
  const handleFieldDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedFieldId(fieldId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', fieldId);
  };

  const handleFieldDragOver = (e: React.DragEvent, fieldId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedFieldId && draggedFieldId !== fieldId) {
      setDragOverFieldId(fieldId);
    }
  };

  const handleFieldDragLeave = () => {
    setDragOverFieldId(null);
  };

  const handleFieldDrop = (e: React.DragEvent, targetFieldId: string, category: string) => {
    e.preventDefault();
    if (!draggedFieldId || draggedFieldId === targetFieldId) {
      setDragOverFieldId(null);
      setDraggedFieldId(null);
      return;
    }

    const fields = fieldsByCategory[category];
    if (!fields) return;

    const currentOrder = fields.map(f => f.id);
    const dragIndex = currentOrder.indexOf(draggedFieldId);
    const dropIndex = currentOrder.indexOf(targetFieldId);

    if (dragIndex === -1 || dropIndex === -1) {
      setDragOverFieldId(null);
      setDraggedFieldId(null);
      return;
    }

    const newOrder = [...currentOrder];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(dropIndex, 0, draggedFieldId);

    if (onUpdateFieldOrder) {
      onUpdateFieldOrder(category, newOrder);
    } else {
      setInternalFieldOrder(prev => ({ ...prev, [category]: newOrder }));
    }
    setDragOverFieldId(null);
    setDraggedFieldId(null);
  };

  const handleFieldDragEnd = () => {
    setDraggedFieldId(null);
    setDragOverFieldId(null);
  };

  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        <Button
          onClick={onClose}
          variant="iconOnly"
          buttonStyle="ghost"
          size="2xs"
          leadIcon={<Icon iconType={['arrows', 'arrow-left']} size={18} color="default" />}
          title="뒤로가기"
        />
        <h3 className="text-base font-semibold text-gray-900">정보 보기 설정</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {CATEGORY_ORDER.map(category => {
          const fields = fieldsByCategory[category];
          if (!fields || fields.length === 0) return null;

          const isCollapsed = collapsedCategories.has(category);
          const visibleCount = fields.filter(f => visibleFields.has(f.id)).length;

          return (
            <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Category Header */}
              <Button
                onClick={() => toggleCategory(category)}
                buttonStyle="ghost"
                size="sm"
                fullWidth
                tailIcon={isCollapsed ? (
                  <Icon iconType={['arrows', 'arrow-down-s']} size={16} color="default-muted" />
                ) : (
                  <Icon iconType={['arrows', 'arrow-up-s']} size={16} color="default-muted" />
                )}
                className="bg-gray-50 hover:bg-gray-100 rounded-none"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {CATEGORY_LABELS[category]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {visibleCount}/{fields.length}
                  </span>
                </div>
              </Button>

              {/* Fields */}
              {!isCollapsed && (
                <div className="divide-y divide-gray-100">
                  {fields.map(field => {
                    const isVisible = visibleFields.has(field.id);
                    const isFullWidth = columnSettings.has(field.id);
                    const isDragging = draggedFieldId === field.id;
                    const isDragOver = dragOverFieldId === field.id;

                    return (
                      <div
                        key={field.id}
                        className={`flex items-center px-2 py-2 gap-2 group relative ${
                          isVisible ? 'bg-white' : 'bg-gray-50 opacity-60'
                        } ${isDragging ? 'opacity-40' : ''}`}
                        onDragOver={(e) => handleFieldDragOver(e, field.id)}
                        onDragLeave={handleFieldDragLeave}
                        onDrop={(e) => handleFieldDrop(e, field.id, field.category)}
                      >
                        {/* Drag over indicator */}
                        {isDragOver && (
                          <div className="absolute left-0 right-0 top-0 h-0.5 bg-blue-500 z-10" />
                        )}

                        {/* Drag handle */}
                        <div
                          className="cursor-move p-0.5 text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0"
                          draggable
                          onDragStart={(e) => handleFieldDragStart(e, field.id)}
                          onDragEnd={handleFieldDragEnd}
                          title="드래그하여 순서 변경"
                        >
                          <Icon iconType={['editor', 'draggable']} size={14} />
                        </div>

                        {/* Field label */}
                        <span className="text-sm text-gray-600 font-medium min-w-[90px] flex-shrink-0">
                          {field.label}
                        </span>

                        {/* Field value */}
                        <span
                          className={`text-sm flex-1 truncate ${field.color || 'text-gray-800'}`}
                          title={String(field.value)}
                        >
                          {field.value || '—'}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {/* Copy - visible on hover */}
                          <Button
                            onClick={() => handleCopy(String(field.value), field.id)}
                            variant="iconOnly"
                            buttonStyle="ghost"
                            size="2xs"
                            leadIcon={
                              copiedField === field.id ? (
                                <Icon iconType={['system', 'check']} size={14} color="success" />
                              ) : (
                                <Icon iconType={['document', 'file-copy']} size={14} />
                              )
                            }
                            className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100"
                            title="복사"
                          />

                          {/* Column setting toggle */}
                          <Button
                            onClick={() => onToggleColumnSetting(field.id)}
                            variant="iconOnly"
                            buttonStyle="ghost"
                            colorOverride={isFullWidth ? 'blue' : undefined}
                            size="2xs"
                            leadIcon={isFullWidth ? <Icon iconType={['design', 'square']} size={14} /> : <Icon iconType={['design', 'layout-column']} size={14} />}
                            title={isFullWidth ? '2열로 변경' : '1열(전체 너비)로 변경'}
                          />

                          {/* Visibility toggle */}
                          <Button
                            onClick={() => onToggleFieldVisibility(field.id)}
                            variant="iconOnly"
                            buttonStyle="ghost"
                            colorOverride={isVisible ? 'blue' : undefined}
                            size="2xs"
                            leadIcon={isVisible ? <Icon iconType={['system', 'eye']} size={14} /> : <Icon iconType={['system', 'eye-off']} size={14} />}
                            title={isVisible ? '숨기기' : '표시하기'}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CustomerInfoOverlay;
