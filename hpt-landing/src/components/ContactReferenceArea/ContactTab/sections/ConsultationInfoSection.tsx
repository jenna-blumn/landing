import React, { useState } from 'react';
import { Icon, Button, Input, Textarea } from '@blumnai-studio/blumnai-design-system';
import { ConsultationDetails } from '../../../../features/contactTab/types';

interface ConsultationInfoSectionProps {
  consultationDetails: ConsultationDetails;
  setConsultationDetails: React.Dispatch<React.SetStateAction<ConsultationDetails>>;
  consultationSummary: string;
  setConsultationSummary: React.Dispatch<React.SetStateAction<string>>;
  isTitleAIGenerated?: boolean;
  setIsTitleAIGenerated?: (value: boolean) => void;
  isSummaryAIGenerated?: boolean;
  setIsSummaryAIGenerated?: (value: boolean) => void;
}

const ConsultationInfoSection: React.FC<ConsultationInfoSectionProps> = ({
  consultationDetails,
  setConsultationDetails,
  consultationSummary,
  setConsultationSummary,
  isTitleAIGenerated = false,
  setIsTitleAIGenerated,
  isSummaryAIGenerated = false,
  setIsSummaryAIGenerated,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopyToClipboard = async (value: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        value={consultationDetails.title}
        onChange={(e) => {
          if (e.target.value.length <= 30) {
            setConsultationDetails((prev) => ({ ...prev, title: e.target.value }));
            if (isTitleAIGenerated && setIsTitleAIGenerated) setIsTitleAIGenerated(false);
          }
        }}
        maxLength={30}
        showCount
        placeholder="상담 제목을 입력하거나 AI 생성 버튼을 클릭하세요..."
        leadIcon={isTitleAIGenerated ? ['weather', 'sparkling'] : undefined}
        size="sm"
      />

      <div className="relative flex flex-col border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
        {isSummaryAIGenerated && (
          <Icon iconType={['weather', 'sparkling']} size={16} color="informative" className="absolute left-3 top-3 z-10" />
        )}
        <Textarea
          value={consultationSummary}
          onChange={(e) => {
            setConsultationSummary(e.target.value);
            if (isSummaryAIGenerated && setIsSummaryAIGenerated) setIsSummaryAIGenerated(false);
          }}
          maxLength={200}
          showCount
          minRows={3}
          resize="none"
          size="sm"
          placeholder="상담 내용을 요약하거나 AI 생성 버튼을 클릭하세요..."
          className={isSummaryAIGenerated ? 'pl-10' : ''}
        />
      </div>

      <div className="@container space-y-3">
        <div className="grid grid-cols-1 @xs:grid-cols-2 gap-x-8 gap-y-3">
          <div className="flex items-center gap-4">
            <span className="font-body size-sm line-height-leading-5 letter-spacing-tracking-tight font-medium text-default min-w-[60px]">채널</span>
            <span className="text-sm text-gray-800">{consultationDetails.channel}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-body size-sm line-height-leading-5 letter-spacing-tracking-tight font-medium text-default min-w-[60px]">브랜드</span>
            <span className="text-sm text-gray-800">{consultationDetails.brand}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-body size-sm line-height-leading-5 letter-spacing-tracking-tight font-medium text-default min-w-[60px]">담당자</span>
            <span className="text-sm text-gray-800">{consultationDetails.consultant}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-body size-sm line-height-leading-5 letter-spacing-tracking-tight font-medium text-default min-w-[60px]">상담횟수</span>
            <span className="text-sm text-gray-800">{consultationDetails.consultationCount}회</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-body size-sm line-height-leading-5 letter-spacing-tracking-tight font-medium text-default min-w-[60px]">상담 시간</span>
          <span className="text-sm text-gray-800">
            {consultationDetails.startTime} -{' '}
            {consultationDetails.isOngoing ? (
              <span className="text-green-600 font-medium">진행 중</span>
            ) : (
              <span className="text-gray-600">{consultationDetails.endTime}</span>
            )}
          </span>
        </div>

        <div
          className="flex items-center gap-4 relative"
          onMouseEnter={() => setHoveredItem('consultationId')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <span className="font-body size-sm line-height-leading-5 letter-spacing-tracking-tight font-medium text-default min-w-[60px]">상담 ID</span>
          <div className="flex items-center gap-2 min-w-0">
            <Button
              onClick={() => handleCopyToClipboard(consultationDetails.roomId, 'consultationId')}
              buttonStyle="secondary"
              size="xs"
              className="text-xs font-mono truncate min-w-0"
              title="클릭하여 복사"
            >
              {consultationDetails.roomId}
            </Button>

            {hoveredItem === 'consultationId' && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyToClipboard(consultationDetails.roomId, 'consultationId');
                }}
                variant="iconOnly"
                buttonStyle="ghost"
                size="xs"
                className="flex-shrink-0"
                title="상담 ID 복사"
                leadIcon={
                  copiedItem === 'consultationId' ? (
                    <Icon iconType={['system', 'check']} size={12} color="success" />
                  ) : (
                    <Icon iconType={['document', 'file-copy']} size={12} color="default-muted" />
                  )
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationInfoSection;
