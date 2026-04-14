import React from 'react';
import { Button, Icon, TooltipTrigger, Popover, PopoverTrigger, PopoverContent } from '@blumnai-studio/blumnai-design-system';
import type { MessageChannel, AiToggleState, RoomLinkToggleState } from '../types';
import ChannelSelector from './ChannelSelector';
import { Mic, Globe } from 'lucide-react';
import type { VoiceLanguage } from '../hooks/useVoiceInstruction';
import type { VoiceCommandType } from '../../../services/claudeApi';

interface ComposerTopBarProps {
  activeChannel: MessageChannel;
  defaultChannel: MessageChannel;
  availableChannels: MessageChannel[];
  onChannelChange: (channel: MessageChannel) => void;
  aiToggles: AiToggleState;
  roomLinkToggle?: RoomLinkToggleState;
  scheduledMessagesControl?: React.ReactNode;

  // Voice Instruction Props
  isListening?: boolean;
  isGenerating?: boolean;
  sttText?: string;
  onVoiceInstructionToggle?: () => void;
  onVoiceInstructionFinish?: () => void;
  voiceLanguage?: VoiceLanguage;
  onVoiceLanguageChange?: (lang: VoiceLanguage) => void;

  // Voice Fallback Modal Props
  showFallbackModal?: boolean;
  pendingContent?: string;
  onResolveFallback?: (choice: VoiceCommandType) => void;
  onCancelFallback?: () => void;
}

const ComposerTopBar: React.FC<ComposerTopBarProps> = ({
  activeChannel,
  defaultChannel,
  availableChannels,
  onChannelChange,
  aiToggles,
  roomLinkToggle,
  scheduledMessagesControl,
  isListening = false,
  isGenerating = false,
  sttText = '',
  onVoiceInstructionToggle,
  onVoiceInstructionFinish,
  voiceLanguage = 'ko-KR',
  onVoiceLanguageChange,
  showFallbackModal = false,
  pendingContent = '',
  onResolveFallback,
  onCancelFallback,
}) => {
  return (
    <div className="flex flex-shrink-0 items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        <ChannelSelector
          activeChannel={activeChannel}
          defaultChannel={defaultChannel}
          availableChannels={availableChannels}
          onChannelChange={onChannelChange}
        />
        {scheduledMessagesControl}
      </div>

      <div className="flex items-center gap-2">
        {onVoiceInstructionToggle && (
          <Popover open={isListening || isGenerating || showFallbackModal}>
            <PopoverTrigger asChild>
              <Button
                onClick={onVoiceInstructionToggle}
                buttonStyle={isListening || isGenerating ? 'soft' : 'secondary'}
                colorOverride={isListening ? 'red' : isGenerating ? 'blue' : undefined}
                size="xs"
                shape="pill"
                disabled={isGenerating || showFallbackModal}
                leadIcon={
                  <Mic size={13} className={isListening ? 'animate-pulse text-red-500' : ''} />
                }
              >
                <span>음성 응대 지시</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="center" sideOffset={10} width={300} className="p-3 hide-when-empty shadow-lg border border-gray-200">
              {showFallbackModal ? (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-gray-800">
                    이 내용을 어디에서 사용하시겠습니까?
                  </span>
                  <div className="text-sm text-gray-700 bg-gray-50 rounded p-2 min-h-[40px] break-words line-clamp-3">
                    {pendingContent}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="xs" buttonStyle="soft" onClick={() => onResolveFallback?.('customer_message')}>
                      고객 응대
                    </Button>
                    <Button size="xs" buttonStyle="soft" colorOverride="green" onClick={() => onResolveFallback?.('customer_memo')}>
                      고객 메모
                    </Button>
                    <Button size="xs" buttonStyle="soft" colorOverride="blue" onClick={() => onResolveFallback?.('consultation_note')}>
                      상담 메모
                    </Button>
                  </div>
                  <div className="flex justify-end">
                    <Button size="xs" buttonStyle="ghost" onClick={onCancelFallback}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                     {isGenerating ? (
                       <Icon iconType={['system', 'loader']} className="animate-spin text-blue-500" size={16} />
                     ) : (
                       <Mic size={16} className="animate-pulse text-red-500" />
                     )}
                     <span className="text-xs font-semibold text-gray-800">
                       {isGenerating ? '응대 메시지 생성 중...' : '듣고 있습니다...'}
                     </span>
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-50 rounded p-2 min-h-[40px] break-words">
                    {sttText || (isGenerating ? 'AI가 문장을 다듬고 있습니다.' : '마이크에 대고 말씀해 보세요.')}
                  </div>
                  {!isGenerating && onVoiceInstructionFinish && (
                    <div className="flex justify-end gap-2 mt-1">
                      <Button
                        onClick={onVoiceInstructionToggle}
                        size="xs"
                        buttonStyle="ghost"
                      >
                        취소
                      </Button>
                      <Button
                        onClick={onVoiceInstructionFinish}
                        size="xs"
                        buttonStyle="primary"
                        disabled={!sttText.trim()}
                      >
                        완료 (AI 생성)
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}

        <Button
          onClick={aiToggles.toggleKind}
          buttonStyle={aiToggles.isKindActive ? 'soft' : 'secondary'}
          colorOverride={aiToggles.isKindActive ? 'pink' : undefined}
          size="xs"
          shape="pill"
          leadIcon={<Icon iconType={['health', 'heart']} size={13} isFill={aiToggles.isKindActive} />}
        >
          <span>친절하게</span>
        </Button>

        <Button
          onClick={aiToggles.toggleSpellCheck}
          buttonStyle={aiToggles.isSpellCheckActive ? 'soft' : 'secondary'}
          colorOverride={aiToggles.isSpellCheckActive ? 'green' : undefined}
          size="xs"
          shape="pill"
          leadIcon={<Icon iconType={['system', 'checkbox-circle']} size={13} />}
        >
          <span>맞춤법</span>
        </Button>

        {roomLinkToggle && (
          <TooltipTrigger
            content="메시지 발송 시 대화방 연결 링크가 포함됩니다. 상담방이 닫혀있으면 새 상담방이 자동 생성됩니다."
            placement="bottom"
            maxWidth={260}
            disabled={!roomLinkToggle.isRoomLinkEnabled}
          >
            <Button
              onClick={roomLinkToggle.toggleRoomLink}
              buttonStyle={roomLinkToggle.isRoomLinkEnabled ? 'soft' : 'secondary'}
              colorOverride={roomLinkToggle.isRoomLinkEnabled ? 'blue' : undefined}
              size="xs"
              shape="pill"
              leadIcon={<Icon iconType={['editor', 'link']} size={13} />}
            >
              <span>대화방 연결</span>
            </Button>
          </TooltipTrigger>
        )}

        {onVoiceLanguageChange && (
          <div className="ml-1 pl-2 border-l border-gray-200 flex items-center">
            <Button
              variant="iconOnly"
              buttonStyle="ghost"
              size="xs"
              leadIcon={<Globe size={14} className="text-gray-500" />}
              title="음성 지시 언어 설정"
              onClick={() => {
                // cycle languages 
                const langs: VoiceLanguage[] = ['ko-KR', 'en-US', 'ja-JP', 'zh-CN'];
                const currentIndex = langs.indexOf(voiceLanguage);
                const nextLang = langs[(currentIndex + 1) % langs.length];
                onVoiceLanguageChange(nextLang);
              }}
            />
            <span className="text-[10px] text-gray-500 ml-1 font-medium w-5">
              {voiceLanguage === 'ko-KR' ? 'KO' : voiceLanguage === 'en-US' ? 'EN' : voiceLanguage === 'ja-JP' ? 'JA' : 'ZH'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComposerTopBar;
