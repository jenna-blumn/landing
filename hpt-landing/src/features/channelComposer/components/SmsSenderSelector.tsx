import React from 'react';
import { Select, Radio, RadioGroup } from '@blumnai-studio/blumnai-design-system';
import type { SmsSenderNumber, SmsInputMode } from '../types';

interface SmsSenderSelectorProps {
  senderNumbers: SmsSenderNumber[];
  selectedSenderId: string | null;
  onSenderChange: (id: string) => void;
  inputMode: SmsInputMode;
  onModeChange: (mode: SmsInputMode) => void;
}

const SmsSenderSelector: React.FC<SmsSenderSelectorProps> = ({
  senderNumbers,
  selectedSenderId,
  onSenderChange,
  inputMode,
  onModeChange,
}) => {
  return (
    <div className="flex items-center gap-3 px-3 py-1.5 flex-shrink-0">
      {/* 발신번호 */}
      <span className="text-[11px] text-gray-500 flex-shrink-0">발신번호</span>
      <Select
        variant="default"
        options={senderNumbers.map((num) => ({
          id: num.id,
          label: `${num.number} (${num.label})`,
        }))}
        value={selectedSenderId || undefined}
        onChange={(val) => onSenderChange(val)}
        size="sm"
      />

      {/* 직접 입력 / 템플릿 사용 라디오 */}
      <RadioGroup
        value={inputMode}
        onValueChange={(val) => onModeChange(val as SmsInputMode)}
        className="flex items-center gap-4 ml-auto flex-shrink-0"
      >
        <Radio value="direct" label="직접 입력" />
        <Radio value="template" label="템플릿 사용" />
      </RadioGroup>
    </div>
  );
};

export default SmsSenderSelector;
