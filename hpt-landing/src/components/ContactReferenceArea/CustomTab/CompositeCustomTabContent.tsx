import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Plus, ChevronDown, Layers } from 'lucide-react';
import { Button, Icon } from '@blumnai-studio/blumnai-design-system';
import { generateMockAISummary } from '../../../features/contactTab/utils/aiSummaryGenerator';
import {
  CompositeCardId,
  COMPOSITE_CARD_CATALOG,
  CompositeTabSettings,
} from '../../../features/referenceSettings/types';

// Info card components
import { getDefaultVisibleFields } from '../../../features/customerTab/utils/fieldDefinitions';
import CustomerInfoSection from '../../../features/customerTab/components/sections/CustomerInfoSection';
import CustomerMemoSection from '../../../features/customerTab/components/sections/CustomerMemoSection';
import CustomerTagSection from '../../../features/customerTab/components/sections/CustomerTagSection';

// Contact card components
import ConsultationInfoSection from '../ContactTab/sections/ConsultationInfoSection';
import ClassificationTagsSection from '../ContactTab/sections/ClassificationTagsSection';
import ClassificationVisibilityDropdown from '../ContactTab/sections/ClassificationVisibilityDropdown';
import NotesSection from '../ContactTab/sections/NotesSection';

import { ClassificationItemId } from '../../../features/contactTab/hooks/useClassificationVisibility';

// History card components
import ConsultationHistorySection from '../HistoryTab/ConsultationHistorySection';
import ActivityLogSection from '../HistoryTab/ActivityLogSection';

import { ConsultationDetails, ConsultationTag, ConsultationNote } from '../../../features/contactTab/types';
import { Memo, Tag, BlockStatus, CustomerTagItemId, CustomerGradeOption, CustomerInfo } from '../../../features/customerTab/types';
import CustomerTagVisibilityDropdown from '../../../features/customerTab/components/sections/CustomerTagVisibilityDropdown';
import { ConsultationHistoryItem, HistoryItem } from '../../../features/history/types';
import { blockCustomer, unblockCustomer, getBlockStatus } from '../../../features/customerTab/api/blockApi';
import BlockCustomerDialog from '../../../features/customerTab/components/modals/BlockCustomerDialog';
import ApiSettingsModal from '../../../features/customerTab/components/modals/ApiSettingsModal';

export interface CompositeTabSharedState {
  // Info (customer) state
  customerData: CustomerInfo;
  visibleFields?: Set<string>;
  columnSettings?: Set<string>;
  isManagerMode?: boolean;
  onToggleFieldVisibility?: (fieldId: string) => void;
  onToggleColumnSetting?: (fieldId: string) => void;
  memos: Memo[];
  onAddMemo: (content: string) => void;
  onEditMemo: (id: number, content: string) => void;
  onDeleteMemo: (id: number) => void;
  tags: Tag[];
  onAddTag: (tag: Omit<Tag, 'id'>) => void;
  onDeleteTag: (id: number) => void;

  // Contact state
  consultationDetails: ConsultationDetails;
  setConsultationDetails: React.Dispatch<React.SetStateAction<ConsultationDetails>>;
  consultationTags: ConsultationTag[];
  setConsultationTags: React.Dispatch<React.SetStateAction<ConsultationTag[]>>;
  majorCategory: string;
  setMajorCategory: React.Dispatch<React.SetStateAction<string>>;
  middleCategory: string;
  setMiddleCategory: React.Dispatch<React.SetStateAction<string>>;
  minorCategory: string;
  setMinorCategory: React.Dispatch<React.SetStateAction<string>>;
  priority: string;
  setPriority: React.Dispatch<React.SetStateAction<string>>;
  consultationSummary: string;
  setConsultationSummary: React.Dispatch<React.SetStateAction<string>>;
  consultationNotes: ConsultationNote[];
  setConsultationNotes: React.Dispatch<React.SetStateAction<ConsultationNote[]>>;
  flag?: { type: string | null; label: string; color: string } | null;
  setFlag?: React.Dispatch<React.SetStateAction<{ type: string | null; label: string; color: string } | null>>;
  isTitleAIGenerated?: boolean;
  setIsTitleAIGenerated?: React.Dispatch<React.SetStateAction<boolean>>;
  isSummaryAIGenerated?: boolean;
  setIsSummaryAIGenerated?: React.Dispatch<React.SetStateAction<boolean>>;

  // History state
  consultationHistory: ConsultationHistoryItem[];
  activityLog: HistoryItem[];
  onSelectHistoricalRoom?: (roomId: number) => void;

  // Classification visibility (shared with contact tab)
  classificationVisibility?: Set<ClassificationItemId>;
  onToggleClassificationVisibility?: (itemId: ClassificationItemId) => void;
  classificationAllItems?: ClassificationItemId[];

  // Customer tag visibility & grade (shared with info tab)
  customerTagVisibility?: Set<CustomerTagItemId>;
  onToggleCustomerTagVisibility?: (itemId: CustomerTagItemId) => void;
  customerTagAllItems?: CustomerTagItemId[];
  customerGrade?: string;
  onChangeCustomerGrade?: (gradeId: string) => void;
  gradeOptions?: CustomerGradeOption[];
}

interface CompositeCustomTabContentProps {
  compositeSettings: CompositeTabSettings;
  sharedState: CompositeTabSharedState;
  onCardOrderChange: (newOrder: CompositeCardId[]) => void;
  onOpenCustomerInfoOverlay?: () => void;
}

const CompositeCustomTabContent: React.FC<CompositeCustomTabContentProps> = ({
  compositeSettings,
  sharedState,
  onCardOrderChange,
  onOpenCustomerInfoOverlay,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [draggingCardId, setDraggingCardId] = useState<CompositeCardId | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<CompositeCardId | null>(null);
  const [collapsedCards, setCollapsedCards] = useState<Set<CompositeCardId>>(new Set());

  // AI generation state (for contact.consultation-info card)
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  // Customer block state
  const [blockStatus, setBlockStatus] = useState<BlockStatus | null>(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);

  // Settings dropdown state (for info.customer-info card)
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // API Settings Modal state
  const [apiModalOpen, setApiModalOpen] = useState(false);

  // Classification settings dropdown state
  const [isClassificationSettingsOpen, setIsClassificationSettingsOpen] = useState(false);
  const classificationSettingsRef = useRef<HTMLDivElement>(null);

  // Customer tag settings dropdown state
  const [isCustomerTagSettingsOpen, setIsCustomerTagSettingsOpen] = useState(false);
  const customerTagSettingsRef = useRef<HTMLDivElement>(null);

  const cardOrder = compositeSettings.cardOrder;
  const hasCustomerInfoCard = cardOrder.includes('info.customer-info');
  const customerId = sharedState.customerData?.customerId;

  // Load block status when customer info card is present
  useEffect(() => {
    if (hasCustomerInfoCard && customerId) {
      setBlockStatus(getBlockStatus(customerId as string));
    }
  }, [hasCustomerInfoCard, customerId]);

  const handleBlock = useCallback((reason: string) => {
    if (!customerId) return;
    const status = blockCustomer(customerId as string, reason, '현재 상담사');
    setBlockStatus(status);
  }, [customerId]);

  const handleUnblock = useCallback(() => {
    if (!customerId) return;
    unblockCustomer(customerId as string);
    setBlockStatus(null);
  }, [customerId]);

  const handleAIGenerate = useCallback(async () => {
    setIsAIGenerating(true);
    try {
      const result = generateMockAISummary();
      sharedState.setConsultationDetails((prev) => ({ ...prev, title: result.title }));
      sharedState.setConsultationSummary(result.summary);
      sharedState.setIsTitleAIGenerated?.(true);
      sharedState.setIsSummaryAIGenerated?.(true);
    } finally {
      setIsAIGenerating(false);
    }
  }, [sharedState]);

  // Close settings dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsDropdownOpen(false);
      }
      if (classificationSettingsRef.current && !classificationSettingsRef.current.contains(event.target as Node)) {
        setIsClassificationSettingsOpen(false);
      }
      if (customerTagSettingsRef.current && !customerTagSettingsRef.current.contains(event.target as Node)) {
        setIsCustomerTagSettingsOpen(false);
      }
    };
    if (isSettingsDropdownOpen || isClassificationSettingsOpen || isCustomerTagSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSettingsDropdownOpen, isClassificationSettingsOpen, isCustomerTagSettingsOpen]);

  const availableCards = COMPOSITE_CARD_CATALOG.filter(
    card => !cardOrder.includes(card.id)
  );
  const canAddCards = availableCards.length > 0;
  const addCardMenuId = 'composite-add-card-menu';

  const handleAddCard = (cardId: CompositeCardId) => {
    onCardOrderChange([...cardOrder, cardId]);
    setIsDropdownOpen(false);
  };

  const handleRemoveCard = (cardId: CompositeCardId) => {
    onCardOrderChange(cardOrder.filter(id => id !== cardId));
  };

  const toggleCardCollapse = (cardId: CompositeCardId) => {
    setCollapsedCards(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  // DnD handlers
  const handleDragStart = (e: React.DragEvent, cardId: CompositeCardId) => {
    setDraggingCardId(cardId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('composite-card', cardId);
  };

  const handleDragOver = (e: React.DragEvent, targetId: CompositeCardId) => {
    e.preventDefault();
    if (draggingCardId && draggingCardId !== targetId) {
      setDragOverCardId(targetId);
    }
  };

  const handleDragEnd = () => {
    setDraggingCardId(null);
    setDragOverCardId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: CompositeCardId) => {
    e.preventDefault();
    if (!draggingCardId || draggingCardId === targetId) {
      handleDragEnd();
      return;
    }

    const newOrder = [...cardOrder];
    const dragIndex = newOrder.indexOf(draggingCardId);
    const dropIndex = newOrder.indexOf(targetId);
    if (dragIndex === -1 || dropIndex === -1) {
      handleDragEnd();
      return;
    }

    newOrder.splice(dragIndex, 1);
    newOrder.splice(dropIndex, 0, draggingCardId);
    onCardOrderChange(newOrder);
    handleDragEnd();
  };

  const renderCardContent = (cardId: CompositeCardId) => {
    switch (cardId) {
      case 'info.customer-info':
        return (
          <CustomerInfoSection
            data={sharedState.customerData}
            visibleFields={sharedState.visibleFields ?? getDefaultVisibleFields()}
            columnSettings={sharedState.columnSettings ?? new Set<string>()}
          />
        );
      case 'info.customer-memo':
        return (
          <CustomerMemoSection
            memos={sharedState.memos}
            onAddMemo={sharedState.onAddMemo}
            onEditMemo={sharedState.onEditMemo}
            onDeleteMemo={sharedState.onDeleteMemo}
          />
        );
      case 'info.customer-tag':
        return (
          <CustomerTagSection
            tags={sharedState.tags}
            onAddTag={(name: string, color: string) => sharedState.onAddTag({ name, color, createdBy: '현재 상담사', createdAt: new Date().toLocaleString('ko-KR') })}
            onDeleteTag={sharedState.onDeleteTag}
            visibleItems={sharedState.customerTagVisibility}
            customerGrade={sharedState.customerGrade}
            onChangeCustomerGrade={sharedState.onChangeCustomerGrade}
            gradeOptions={sharedState.gradeOptions}
          />
        );
      case 'contact.consultation-info':
        return (
          <ConsultationInfoSection
            consultationDetails={sharedState.consultationDetails}
            setConsultationDetails={sharedState.setConsultationDetails}
            consultationSummary={sharedState.consultationSummary}
            setConsultationSummary={sharedState.setConsultationSummary}
            isTitleAIGenerated={sharedState.isTitleAIGenerated ?? false}
            setIsTitleAIGenerated={sharedState.setIsTitleAIGenerated ?? (() => {})}
            isSummaryAIGenerated={sharedState.isSummaryAIGenerated ?? false}
            setIsSummaryAIGenerated={sharedState.setIsSummaryAIGenerated ?? (() => {})}
          />
        );
      case 'contact.classification-tags':
        return (
          <ClassificationTagsSection
            consultationTags={sharedState.consultationTags}
            setConsultationTags={sharedState.setConsultationTags}
            majorCategory={sharedState.majorCategory}
            setMajorCategory={sharedState.setMajorCategory}
            middleCategory={sharedState.middleCategory}
            setMiddleCategory={sharedState.setMiddleCategory}
            minorCategory={sharedState.minorCategory}
            setMinorCategory={sharedState.setMinorCategory}
            priority={sharedState.priority}
            setPriority={sharedState.setPriority}
            flag={sharedState.flag ?? null}
            setFlag={sharedState.setFlag ?? (() => {})}
            visibleItems={sharedState.classificationVisibility}
          />
        );
      case 'contact.notes-special':
        return (
          <NotesSection
            consultationNotes={sharedState.consultationNotes}
            setConsultationNotes={sharedState.setConsultationNotes}
          />
        );
      case 'history.consultation-history':
        return (
          <ConsultationHistorySection
            consultationHistory={sharedState.consultationHistory}
            onSelectHistoricalItem={sharedState.onSelectHistoricalRoom}
          />
        );
      case 'history.activity-log':
        return (
          <ActivityLogSection activityLog={sharedState.activityLog} />
        );
      default:
        return <div className="text-gray-500 text-center py-4">알 수 없는 카드</div>;
    }
  };

  const getCardMeta = (cardId: CompositeCardId) => {
    return COMPOSITE_CARD_CATALOG.find(c => c.id === cardId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Card list */}
      <div className="flex-1 overflow-y-auto p-4 relative">
        <div className="min-h-full flex flex-col">
          {cardOrder.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Layers size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">맞춤 탭</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                하단의 '카드 추가' 버튼으로 원하는 카드를 추가하세요.
                고객, Contact, History 카드를 자유롭게 조합할 수 있습니다.
              </p>
            </div>
          ) : (
            <div>
        {cardOrder.map((cardId) => {
          const meta = getCardMeta(cardId);
          if (!meta) return null;
          const isDragging = draggingCardId === cardId;
          const isDragOver = dragOverCardId === cardId;
          const isCollapsed = collapsedCards.has(cardId);

          return (
            <div
              key={cardId}
              onDragOver={(e) => handleDragOver(e, cardId)}
              onDrop={(e) => handleDrop(e, cardId)}
              className={`border rounded-lg bg-white mb-2 transition-all duration-200 ${
                isDragging ? 'opacity-50' : ''
              } ${isDragOver ? 'border-blue-400 bg-blue-50 shadow-md' : 'border-gray-200'}`}
            >
              {/* Block status banner for info.customer-info card */}
              {cardId === 'info.customer-info' && blockStatus && (
                <div className="bg-red-50 border-b border-red-200 px-3 py-2 flex items-center gap-2 rounded-t-lg">
                  <Icon iconType={['system', 'shield-cross']} size={14} color="destructive" className="flex-shrink-0" />
                  <span className="text-xs text-red-700 flex-1 truncate">
                    차단된 고객 · {blockStatus.reason}
                  </span>
                  <button
                    onClick={() => setBlockDialogOpen(true)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium flex-shrink-0"
                  >
                    상세
                  </button>
                </div>
              )}
              {/* Card header - matches History tab pattern */}
              <div className="h-12 px-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="cursor-move text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    draggable
                    onDragStart={(e) => handleDragStart(e, cardId)}
                    onDragEnd={handleDragEnd}
                    title="드래그하여 순서 변경"
                  >
                    <Icon iconType={['editor', 'draggable']} size={16} color="default-muted" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 truncate">{meta.label}</h3>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!isCollapsed && (
                    <>
                      {/* AI generate button for contact.consultation-info card */}
                      {cardId === 'contact.consultation-info' && (
                        <Button
                          onClick={handleAIGenerate}
                          disabled={isAIGenerating}
                          buttonStyle="primary"
                          size="xs"
                          title="AI 상담 요약 생성"
                          className="whitespace-nowrap"
                        >
                          {isAIGenerating ? 'AI생성 중...' : 'AI생성'}
                        </Button>
                      )}
                      {/* Customer block button for info.customer-info card */}
                      {cardId === 'info.customer-info' && (
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
                      )}
                      {/* Settings dropdown for info.customer-info card */}
                      {cardId === 'info.customer-info' && (
                        <div className="relative" ref={settingsRef}>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
                            }}
                            variant="iconOnly"
                            buttonStyle="ghost"
                            size="2xs"
                            title="섹션 설정"
                            leadIcon={<Icon iconType={['system', 'settings']} size={16} />}
                            className="text-gray-400 hover:text-blue-600"
                          />
                          {isSettingsDropdownOpen && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    setIsSettingsDropdownOpen(false);
                                    onOpenCustomerInfoOverlay?.();
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Icon iconType={['system', 'eye']} size={14} />
                                  모든 정보 보기
                                </button>
                                <button
                                  onClick={() => {
                                    setIsSettingsDropdownOpen(false);
                                    setApiModalOpen(true);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Icon iconType={['editor', 'link']} size={14} />
                                  고객정보 연동
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Settings dropdown for contact.classification-tags card */}
                      {cardId === 'contact.classification-tags' && sharedState.classificationVisibility && sharedState.onToggleClassificationVisibility && sharedState.classificationAllItems && (
                        <div className="relative" ref={classificationSettingsRef}>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsClassificationSettingsOpen(!isClassificationSettingsOpen);
                            }}
                            variant="iconOnly"
                            buttonStyle="ghost"
                            size="2xs"
                            title="항목 설정"
                            leadIcon={<Icon iconType={['system', 'settings']} size={16} />}
                            className="text-gray-400 hover:text-blue-600"
                          />
                          {isClassificationSettingsOpen && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                              <ClassificationVisibilityDropdown
                                visibleItems={sharedState.classificationVisibility}
                                onToggle={sharedState.onToggleClassificationVisibility}
                                allItems={sharedState.classificationAllItems}
                              />
                            </div>
                          )}
                        </div>
                      )}
                      {/* Settings dropdown for info.customer-tag card */}
                      {cardId === 'info.customer-tag' && sharedState.customerTagVisibility && sharedState.onToggleCustomerTagVisibility && sharedState.customerTagAllItems && (
                        <div className="relative" ref={customerTagSettingsRef}>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsCustomerTagSettingsOpen(!isCustomerTagSettingsOpen);
                            }}
                            variant="iconOnly"
                            buttonStyle="ghost"
                            size="2xs"
                            title="항목 설정"
                            leadIcon={<Icon iconType={['system', 'settings']} size={16} />}
                            className="text-gray-400 hover:text-blue-600"
                          />
                          {isCustomerTagSettingsOpen && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                              <CustomerTagVisibilityDropdown
                                visibleItems={sharedState.customerTagVisibility}
                                onToggle={sharedState.onToggleCustomerTagVisibility}
                                allItems={sharedState.customerTagAllItems}
                              />
                            </div>
                          )}
                        </div>
                      )}
                      <Button
                        onClick={() => handleRemoveCard(cardId)}
                        variant="iconOnly"
                        buttonStyle="ghost"
                        size="2xs"
                        title="카드 제거"
                        leadIcon={<Icon iconType={['system', 'close']} size={14} />}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                      />
                    </>
                  )}

                  <Button
                    variant="iconOnly"
                    buttonStyle="ghost"
                    size="2xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCardCollapse(cardId);
                    }}
                    leadIcon={isCollapsed ? (
                      <Icon iconType={['arrows', 'arrow-down-s']} size={16} color="default-subtle" />
                    ) : (
                      <Icon iconType={['arrows', 'arrow-up-s']} size={16} color="default-subtle" />
                    )}
                  />
                </div>
              </div>
              {/* Settings dropdown backdrop */}
              {cardId === 'info.customer-info' && isSettingsDropdownOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsSettingsDropdownOpen(false)} />
              )}
              {cardId === 'contact.classification-tags' && isClassificationSettingsOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsClassificationSettingsOpen(false)} />
              )}
              {cardId === 'info.customer-tag' && isCustomerTagSettingsOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsCustomerTagSettingsOpen(false)} />
              )}
              {/* Card content */}
              {!isCollapsed && (
                <div className="p-3">
                  {renderCardContent(cardId)}
                </div>
              )}
            </div>
          );
        })}
            </div>
          )}

          {canAddCards && (
            <div className={`relative ${cardOrder.length === 0 ? 'mt-4' : 'mt-2'}`}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-controls={addCardMenuId}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
              >
                <span className="flex items-center gap-2">
                  <Plus size={16} />
                  카드 추가 ({availableCards.length}개 가능)
                </span>
                <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <DropdownMenu
                  availableCards={availableCards}
                  onSelect={handleAddCard}
                  onClose={() => setIsDropdownOpen(false)}
                  menuId={addCardMenuId}
                  openDirection="up"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals/Dialogs for info.customer-info card */}
      {hasCustomerInfoCard && (
        <>
          <BlockCustomerDialog
            isOpen={blockDialogOpen}
            onClose={() => setBlockDialogOpen(false)}
            onBlock={handleBlock}
            onUnblock={handleUnblock}
            isManagerMode={sharedState.isManagerMode ?? false}
            blockStatus={blockStatus}
            customerName={sharedState.customerData?.name as string}
          />
          <ApiSettingsModal
            isOpen={apiModalOpen}
            onClose={() => setApiModalOpen(false)}
            onSave={() => {}}
            sectionName="고객 정보"
          />
        </>
      )}
    </div>
  );
};

// Dropdown menu for adding cards
const DropdownMenu: React.FC<{
  availableCards: typeof COMPOSITE_CARD_CATALOG;
  onSelect: (cardId: CompositeCardId) => void;
  onClose: () => void;
  menuId?: string;
  openDirection?: 'up' | 'down';
}> = ({ availableCards, onSelect, onClose, menuId, openDirection = 'down' }) => {
  const grouped = availableCards.reduce((acc, card) => {
    if (!acc[card.group]) acc[card.group] = [];
    acc[card.group].push(card);
    return acc;
  }, {} as Record<string, typeof COMPOSITE_CARD_CATALOG>);

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div
        id={menuId}
        className={`absolute left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto ${
          openDirection === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'
        }`}
      >
        {Object.entries(grouped).map(([group, cards]) => (
          <div key={group}>
            <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
              {group}
            </div>
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => onSelect(card.id)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50 last:border-b-0"
              >
                {card.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default CompositeCustomTabContent;
