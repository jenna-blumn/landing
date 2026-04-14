import React from 'react';
import { Button, Input, ScrollArea } from '@blumnai-studio/blumnai-design-system';
import type { MessageChannel, SmsSenderNumber, Template } from '../types';
import { TEMPLATE_AREA_OUTER_PADDING } from '../../layout/panelSpacing';
import TemplateSelector from './TemplateSelector';
import TemplatePreview from './TemplatePreview';
import ComposerInput from './ComposerInput';

interface TemplateAreaProps {
  templateState: {
    templates: Template[];
    filteredTemplates: Template[];
    selectedTemplate: Template | null;
    selectedTemplateId: string | null;
    searchQuery: string;
    variables: Record<string, string>;
    previewText: string;
    isValid: boolean;
    missingVariables: string[];
    setSearchQuery: (query: string) => void;
    selectTemplate: (templateId: string) => void;
    setVariable: (key: string, value: string) => void;
    toggleFavorite: (templateId: string) => void;
  };
  channelType: 'sms' | 'alimtalk';
  customerName?: string;
  customerPhone?: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  canSend: boolean;
  isSending?: boolean;
  isInputReadOnly?: boolean;
  activeChannel: MessageChannel;
  charCountInfo?: string;
  isOverCharLimit?: boolean;
  byteInfo?: string;
  isOverLimit?: boolean;
  senderNumbers?: SmsSenderNumber[];
  selectedSenderId?: string | null;
  onSenderChange?: (id: string) => void;
  brandId?: string;
  onCancel?: () => void;
  scheduleControl?: React.ReactNode;
  scheduleHeader?: React.ReactNode;
}

const CARD_STYLES =
  'flex min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm';
const HEADER_STYLES = 'flex min-h-[44px] items-center border-b border-gray-100 px-4 py-2';

const CHANNEL_META = {
  sms: {
    title: 'SMS 템플릿',
    previewTitle: '전송 전 확인',
    placeholder: '리스트에서 사용할 템플릿을 선택하거나 직접 입력해 주세요.',
  },
  alimtalk: {
    title: '알림톡 템플릿',
    previewTitle: '미리보기',
    placeholder: '리스트에서 사용할 템플릿을 선택해 주세요.',
  },
} as const;

const TemplateArea: React.FC<TemplateAreaProps> = ({
  templateState,
  channelType,
  customerName,
  customerPhone,
  inputValue,
  onInputChange,
  onSend,
  canSend,
  isSending = false,
  isInputReadOnly = false,
  activeChannel,
  charCountInfo,
  isOverCharLimit,
  byteInfo,
  isOverLimit,
  senderNumbers,
  selectedSenderId,
  onSenderChange,
  brandId,
  onCancel,
  scheduleControl,
  scheduleHeader,
}) => {
  const selectedTemplate = templateState.selectedTemplate;
  const hasVariables = Boolean(selectedTemplate && selectedTemplate.variables.length > 0);
  const isSingleVariableTemplate = Boolean(selectedTemplate && selectedTemplate.variables.length === 1);
  const meta = CHANNEL_META[channelType];

  const recipientSummary =
    customerName && customerPhone
      ? `${customerName} · ${customerPhone}`
      : customerName || customerPhone || '고객 정보 없음';

  return (
    <div className={`flex min-h-0 flex-1 overflow-hidden border-t border-gray-200 bg-gray-50 ${TEMPLATE_AREA_OUTER_PADDING}`}>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 overflow-hidden xl:grid-cols-[252px_minmax(0,1.2fr)_minmax(272px,0.88fr)]">
        <section className={`${CARD_STYLES} h-full`}>
          <div className={HEADER_STYLES}>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900">{meta.title}</div>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden p-2.5">
            <TemplateSelector
              templates={templateState.templates}
              filteredTemplates={templateState.filteredTemplates}
              selectedTemplateId={templateState.selectedTemplateId}
              searchQuery={templateState.searchQuery}
              onSearchChange={templateState.setSearchQuery}
              onSelect={templateState.selectTemplate}
              onToggleFavorite={templateState.toggleFavorite}
              channelType={channelType}
              senderNumbers={senderNumbers}
              selectedSenderId={selectedSenderId}
              onSenderChange={onSenderChange}
              brandId={brandId}
            />
          </div>
        </section>

        <section className={`${CARD_STYLES} h-full`}>
          <div className={HEADER_STYLES}>
            <div className="flex w-full items-center justify-between gap-3">
              <div className="text-sm font-semibold text-gray-900">메시지 작성</div>
              {selectedTemplate && onCancel && (
                <Button
                  type="button"
                  buttonStyle="ghost"
                  size="xs"
                  onClick={onCancel}
                  className="text-gray-500"
                >
                  템플릿 닫기
                </Button>
              )}
            </div>
          </div>

          {hasVariables && selectedTemplate && (
            <div className="flex-shrink-0 border-b border-gray-100 bg-gray-50/70 px-3 py-2.5">
              <div className="rounded-xl border border-gray-200 bg-white px-3 py-3">
                <ScrollArea orientation="vertical" maxHeight="144px" className="pr-1">
                  <div
                    className={`pr-2 ${
                      isSingleVariableTemplate ? 'flex flex-wrap items-center gap-2.5' : 'grid grid-cols-1 gap-3 md:grid-cols-2'
                    }`}
                  >
                    {selectedTemplate.variables.map((variable) => {
                      const isMissing = templateState.missingVariables.includes(variable.key);
                      return (
                        <div
                          key={variable.key}
                          className={isSingleVariableTemplate ? 'flex min-w-0 flex-1 flex-wrap items-center gap-2.5' : ''}
                        >
                          <label
                            className={`text-sm font-medium text-gray-700 ${
                              isSingleVariableTemplate ? 'flex-shrink-0' : 'mb-1 block'
                            }`}
                          >
                            {variable.label}
                            {variable.required && <span className="ml-0.5 text-red-400">*</span>}
                          </label>
                          <div className={isSingleVariableTemplate ? 'min-w-[220px] flex-1' : ''}>
                            <Input
                              value={templateState.variables[variable.key] || ''}
                              onChange={(event) => templateState.setVariable(variable.key, event.target.value)}
                              placeholder={variable.defaultValue || variable.label}
                              size="sm"
                              error={isMissing}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          <div className="flex min-h-0 flex-1 overflow-hidden p-2.5">
            <ComposerInput
              value={inputValue}
              onChange={onInputChange}
              onSend={onSend}
              canSend={canSend}
              disabled={isSending}
              readOnly={isInputReadOnly}
              activeChannel={activeChannel}
              charCountInfo={charCountInfo}
              isOverCharLimit={isOverCharLimit}
              byteInfo={byteInfo}
              isOverLimit={isOverLimit}
              hideSendButton={false}
              compact
              placeholder={meta.placeholder}
              scheduleControl={scheduleControl}
              scheduleHeader={scheduleHeader}
            />
          </div>
        </section>

        <section className={`${CARD_STYLES} h-full`}>
          <div className={HEADER_STYLES}>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900">{meta.previewTitle}</div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2.5">
            <div className="flex-shrink-0 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
              <p className="truncate text-sm text-gray-600">{recipientSummary}</p>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden pt-2">
              <TemplatePreview
                previewText={templateState.previewText || inputValue}
                channelType={channelType}
                buttons={templateState.selectedTemplate?.buttons}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TemplateArea;
