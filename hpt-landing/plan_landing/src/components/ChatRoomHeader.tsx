import React from 'react';
import { Button, Switch, Icon, Chip } from '@blumnai-studio/blumnai-design-system';
import { flagChipColorMap } from '../features/contactTab/utils/flagDefinitions';

interface ChatRoomHeaderProps {
  title?: string;
  tags?: string[];
  flag?: {
    type: 'urgent' | 'important' | 'normal' | 'info' | 'completed' | null;
    color: string;
    label: string;
  } | null;
  isVIP?: boolean;
  isMaskingDisabled: boolean;
  onToggleMasking: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onDownload?: () => void;
  onReload: () => void;
  onOpenInNewWindow?: () => void;
  onAddTask?: () => void;
  onClose?: () => void;
  // 스레드 관련
  isThreadModeActive?: boolean;
  onToggleThreadMode?: () => void;
  isThreadButtonDisabled?: boolean;
}

const ChatRoomHeader: React.FC<ChatRoomHeaderProps> = ({
  title,
  tags = [],
  flag = null,
  isVIP = false,
  isMaskingDisabled,
  onToggleMasking,
  isFavorite = false,
  onToggleFavorite,
  onDownload,
  onReload,
  onOpenInNewWindow,
  onAddTask,
  onClose,
  isThreadModeActive = false,
  onToggleThreadMode,
  isThreadButtonDisabled = false,
}) => {
  const hasAnyInfo = title || tags.length > 0 || (flag && flag.type) || isVIP;

  return (
    <div className="h-12 bg-gray-100 border-b border-gray-300 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        {onClose && (
          <Button
            variant="iconOnly"
            buttonStyle="ghost"
            size="xs"
            onClick={onClose}
            title="Close"
            aria-label="Close"
            leadIcon={<Icon iconType={['arrows', 'arrow-left-s']} size={18} color="default" />}
          />
        )}
        {hasAnyInfo ? (
          <div className="flex items-center gap-2">

            {flag && flag.type && (
              <Chip
                style="soft"
                color={flagChipColorMap[flag.type]}
                icon={['business', 'flag', true]}
                label={flag.label}
                size="sm"
              />
            )}

            {isVIP && (
              <Chip
                style="soft"
                color="amber"
                icon={['finance', 'vip-crown']}
                label="VIP"
                size="sm"
              />
            )}

            {title ? (
              <span className="font-bold text-gray-900">{title}</span>
            ) : (
              tags.length > 0 && (
                <div className="flex items-center gap-1">
                  {tags.map((tag, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <Icon iconType={['arrows', 'arrow-right-s']} size={14} color="default-muted" />}
                      <span className="font-medium">{tag}</span>
                    </React.Fragment>
                  ))}
                </div>
              )
            )}
          </div>
        ) : (
          <span className="text-gray-400">제목 없음</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onToggleThreadMode && (
          <Button
            buttonStyle={isThreadModeActive ? 'primary' : 'soft'}
            size="xs"
            onClick={onToggleThreadMode}
            disabled={isThreadButtonDisabled && !isThreadModeActive}
            title={isThreadModeActive ? '스레드 닫기' : '스레드 열기'}
            leadIcon={<Icon iconType={['communication', 'chat-1']} size={14} />}
          >
            {isThreadModeActive ? '스레드 닫기' : '스레드 열기'}
          </Button>
        )}
        {onAddTask && (
          <Button
            buttonStyle="soft"
            size="xs"
            onClick={onAddTask}
            title="할 일 생성"
            leadIcon={<Icon iconType={['editor', 'list-check']} size={14} />}
          >
            할 일+
          </Button>
        )}
        {onToggleFavorite && (
          <Button
            variant="iconOnly"
            buttonStyle="ghost"
            size="sm"
            onClick={onToggleFavorite}
            className={isFavorite ? 'text-yellow-500' : 'text-gray-400'}
            title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            leadIcon={<Icon iconType={['system', 'star']} size={18} isFill={isFavorite} />}
          />
        )}

        <Switch
          checked={isMaskingDisabled}
          onCheckedChange={() => onToggleMasking()}
          label="마스킹 해제"
          switchPosition="right"
          color="blue"
        />

        {onDownload && (
          <Button
            variant="iconOnly"
            buttonStyle="ghost"
            size="sm"
            onClick={onDownload}
            title="다운로드"
            leadIcon={<Icon iconType={['system', 'download']} size={18} color="default-subtle" />}
          />
        )}

        <Button
          variant="iconOnly"
          buttonStyle="ghost"
          size="sm"
          onClick={onReload}
          title="새로고침"
          leadIcon={<Icon iconType={['system', 'refresh']} size={18} color="default-subtle" />}
        />

        {onOpenInNewWindow && (
          <Button
            variant="iconOnly"
            buttonStyle="ghost"
            size="sm"
            onClick={onOpenInNewWindow}
            title="새 창으로 열기"
            leadIcon={<Icon iconType={['system', 'external-link']} size={18} color="default-subtle" />}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(ChatRoomHeader);
