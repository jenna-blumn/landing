import React, { useState } from 'react';
import { ScrollArea, Sortable, SortableItem, DragOverlay, Icon } from '@blumnai-studio/blumnai-design-system';
import { ConsultationDetails, ConsultationTag, ConsultationNote, DEFAULT_CONTACT_SECTIONS } from '../../../features/contactTab/types';
import { useContactTabState } from '../../../features/contactTab/hooks/useContactTabState';
import { generateMockAISummary } from '../../../features/contactTab/utils/aiSummaryGenerator';
import { ClassificationItemId } from '../../../features/contactTab/hooks/useClassificationVisibility';
import SectionWrapper from './SectionWrapper';
import ConsultationInfoSection from './sections/ConsultationInfoSection';
import ClassificationTagsSection from './sections/ClassificationTagsSection';
import ClassificationVisibilityDropdown from './sections/ClassificationVisibilityDropdown';
import NotesSection from './sections/NotesSection';

interface ContactTabContentProps {
  customerData: Record<string, unknown>;
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
  onAIGenerate?: () => Promise<{ title: string; summary: string }>;
  onSetFlag?: (flagType: string | null) => void;
  classificationVisibility?: Set<ClassificationItemId>;
  onToggleClassificationVisibility?: (itemId: ClassificationItemId) => void;
  classificationAllItems?: ClassificationItemId[];
}

const ContactTabContent: React.FC<ContactTabContentProps> = ({
  consultationDetails,
  setConsultationDetails,
  consultationTags,
  setConsultationTags,
  majorCategory,
  setMajorCategory,
  middleCategory,
  setMiddleCategory,
  minorCategory,
  setMinorCategory,
  priority,
  setPriority,
  consultationSummary,
  setConsultationSummary,
  consultationNotes,
  setConsultationNotes,
  onAIGenerate,
  onSetFlag,
  classificationVisibility,
  onToggleClassificationVisibility,
  classificationAllItems,
}) => {
  const { sections, handleReorder } = useContactTabState(DEFAULT_CONTACT_SECTIONS);
  const [flag, setFlag] = useState<{ type: string | null; label: string; color: string } | null>(null);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [isTitleAIGenerated, setIsTitleAIGenerated] = useState(false);
  const [isSummaryAIGenerated, setIsSummaryAIGenerated] = useState(false);

  const handleAIGenerate = async () => {
    setIsAIGenerating(true);
    try {
      const result = onAIGenerate ? await onAIGenerate() : generateMockAISummary();
      setConsultationDetails((prev) => ({ ...prev, title: result.title }));
      setConsultationSummary(result.summary);
      setIsTitleAIGenerated(true);
      setIsSummaryAIGenerated(true);
    } finally {
      setIsAIGenerating(false);
    }
  };

  const renderSectionContent = (section: typeof sections[0]) => {
    switch (section.id) {
      case 'consultation-info':
        return (
          <ConsultationInfoSection
            consultationDetails={consultationDetails}
            setConsultationDetails={setConsultationDetails}
            consultationSummary={consultationSummary}
            setConsultationSummary={setConsultationSummary}
            isTitleAIGenerated={isTitleAIGenerated}
            setIsTitleAIGenerated={setIsTitleAIGenerated}
            isSummaryAIGenerated={isSummaryAIGenerated}
            setIsSummaryAIGenerated={setIsSummaryAIGenerated}
          />
        );

      case 'classification-tags':
        return (
          <ClassificationTagsSection
            consultationTags={consultationTags}
            setConsultationTags={setConsultationTags}
            majorCategory={majorCategory}
            setMajorCategory={setMajorCategory}
            middleCategory={middleCategory}
            setMiddleCategory={setMiddleCategory}
            minorCategory={minorCategory}
            setMinorCategory={setMinorCategory}
            priority={priority}
            setPriority={setPriority}
            flag={flag}
            setFlag={setFlag}
            onSetFlag={onSetFlag}
            visibleItems={classificationVisibility}
          />
        );

      case 'notes-special':
        return (
          <NotesSection
            consultationNotes={consultationNotes}
            setConsultationNotes={setConsultationNotes}
          />
        );

      default:
        return <div className="text-gray-500 text-center py-4">Unknown section</div>;
    }
  };

  const getSettingsContent = (sectionId: string) => {
    if (sectionId === 'classification-tags' && classificationVisibility && onToggleClassificationVisibility && classificationAllItems) {
      return (
        <ClassificationVisibilityDropdown
          visibleItems={classificationVisibility}
          onToggle={onToggleClassificationVisibility}
          allItems={classificationAllItems}
        />
      );
    }
    return undefined;
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <ScrollArea orientation="vertical" maxHeight="100%" className="flex-1 min-h-0 min-w-0">
      <Sortable items={sortedSections} onReorder={handleReorder} strategy="vertical">
        {sortedSections.map((section) => {
          const settingsContent = getSettingsContent(section.id);
          return (
            <SortableItem key={section.id} id={section.id} handle>
              <SectionWrapper
                sectionId={section.id}
                title={section.name}
                initialCollapsed={section.isCollapsed}
                onAIGenerate={section.id === 'consultation-info' ? handleAIGenerate : undefined}
                isAIGenerating={section.id === 'consultation-info' ? isAIGenerating : undefined}
                showSettings={!!settingsContent}
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
    </ScrollArea>
  );
};

export default ContactTabContent;
