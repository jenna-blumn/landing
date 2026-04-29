import React from 'react';
import type { MessageChannel, TemplateButton } from '../types';

interface TemplatePreviewProps {
  previewText: string;
  channelType: MessageChannel;
  buttons?: TemplateButton[];
}

const PREVIEW_STYLES: Record<
  string,
  { border: string; background: string; bubble: string; button: string; label: string }
> = {
  sms: {
    border: 'border-green-200',
    background: 'bg-gray-50',
    bubble: 'text-gray-800',
    button: 'border-green-100 bg-white text-green-700',
    label: 'SMS 미리보기',
  },
  alimtalk: {
    border: 'border-yellow-200',
    background: 'bg-yellow-50',
    bubble: 'text-gray-800',
    button: 'border-yellow-100 bg-white text-yellow-700',
    label: '알림톡 미리보기',
  },
};

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  previewText,
  channelType,
  buttons,
}) => {
  const style = PREVIEW_STYLES[channelType] || PREVIEW_STYLES.sms;

  return (
    <div
      className={`flex h-full min-h-0 flex-col rounded-2xl border ${style.border} ${style.background} p-3.5`}
    >
      <div className="mb-2 text-sm font-semibold text-gray-900">{style.label}</div>

      {previewText ? (
        <div className="min-h-0 flex-1">
          <div className={`whitespace-pre-wrap text-sm leading-relaxed ${style.bubble}`}>
            {previewText}
          </div>

          {buttons && buttons.length > 0 && (
            <div className="mt-3 space-y-2">
              {buttons.map((button, index) => (
                <div
                  key={`${button.name}-${index}`}
                  className={`rounded-xl border px-3 py-2 text-center text-sm font-medium ${style.button}`}
                >
                  {button.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-gray-500">
          선택한 템플릿 미리보기가 여기에 표시됩니다.
        </div>
      )}
    </div>
  );
};

export default TemplatePreview;
