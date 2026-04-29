import React, { useState, useCallback } from 'react';
import { Button, Switch, Tabs, TabsList, TabsTrigger, Icon, Chip } from '@blumnai-studio/blumnai-design-system';
import { flagChipColorMap } from '../../features/contactTab/utils/flagDefinitions';
import { HistoryContactData, HistoryContactMessage } from '../../features/history/mockHistoryContactData';
import ContactReferenceArea from '../ContactReferenceArea';
import { Room } from '../../data/mockData';
import ChannelComposer from '../../features/channelComposer/components/ChannelComposer';
import type { ComposerMessage } from '../../features/channelComposer/types';

interface ChatWorkspaceWithTabsProps {
  isHistoryWorkspace: boolean;
  contactData: HistoryContactData | Room | null;
  allRooms: Room[];
  onBack?: () => void;
  onSelectHistoricalRoom?: (roomId: number) => void;
  selectedRoomId?: number | null;
  onSendMessage?: (message: ComposerMessage) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onMakeMainChat?: () => void;
  isLiked?: boolean;
  onToggleLike?: () => void;
  /** Custom content for the chat tab (e.g., ContactRoomArea with function bar) */
  chatContent?: React.ReactNode;
}

const ChatWorkspaceWithTabs: React.FC<ChatWorkspaceWithTabsProps> = ({
  isHistoryWorkspace,
  contactData,
  allRooms,
  onBack,
  onSelectHistoricalRoom,
  selectedRoomId: _selectedRoomId,
  onSendMessage,
  isFavorite = false,
  onToggleFavorite,
  onMakeMainChat,
  isLiked = false,
  onToggleLike,
  chatContent,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'reference'>('chat');
  const [isMaskingDisabled, setIsMaskingDisabled] = useState(false);

  const handleSendMessage = useCallback((message: ComposerMessage) => {
    onSendMessage?.(message);
  }, [onSendMessage]);

  const isHistoryContact = (data: HistoryContactData | Room | null): data is HistoryContactData => {
    return data !== null && 'consultantName' in data && 'endTime' in data;
  };

  const getMessages = (): HistoryContactMessage[] => {
    if (!contactData) return [];
    if (isHistoryContact(contactData)) {
      return contactData.messages;
    }
    return (contactData as Room).messages?.map((msg, idx) => ({
      id: msg.id || idx,
      sender: msg.sender,
      text: msg.text,
      time: msg.time,
    })) || [];
  };

  const getTags = (): string[] => {
    if (!contactData) return [];
    if (isHistoryContact(contactData)) {
      return [contactData.channel, contactData.brand];
    }
    return (contactData as Room).tags || [];
  };

  const getFlag = () => {
    if (!contactData) return null;
    if (isHistoryContact(contactData)) {
      return null;
    }
    return (contactData as Room).flag || null;
  };

  const getIsVIP = () => {
    if (!contactData) return false;
    if (isHistoryContact(contactData)) {
      return false;
    }
    return (contactData as Room).isVIP || false;
  };

  const messages = getMessages();
  const tags = getTags();
  const flag = getFlag();
  const isVIP = getIsVIP();
  const hasAnyInfo = tags.length > 0 || (flag && flag.type) || isVIP;

  // ChannelComposer에 필요한 room 속성 추출
  const roomId = contactData?.id ?? 0;
  const roomChannel = contactData
    ? isHistoryContact(contactData) ? contactData.channel : (contactData as Room).channel
    : 'chat';
  const customerName = contactData?.contactName;
  const customerPhone = contactData && !isHistoryContact(contactData) ? (contactData as Room).customerPhone : undefined;
  const customerEmail = contactData && !isHistoryContact(contactData) ? (contactData as Room).customerEmail : undefined;
  const brandId = contactData
    ? isHistoryContact(contactData) ? contactData.brand : (contactData as Room).brand
    : undefined;
  const isCompleted = contactData
    ? isHistoryContact(contactData) ? contactData.status === 'closed' : (contactData as Room).contactStatus === 'closed'
    : false;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-shrink-0 bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          {isHistoryWorkspace && onBack && (
            <Button
              onClick={onBack}
              variant="iconOnly"
              buttonStyle="ghost"
              size="2xs"
              leadIcon={<Icon iconType={['arrows', 'arrow-left-s']} size={20} />}
              className="mr-2"
              title="돌아가기"
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

              {tags.length > 0 && (
                <div className="flex items-center gap-1">
                  {tags.map((tag, index) => (
                    <React.Fragment key={index}>
                      {(index > 0 || (flag && flag.type) || isVIP) && <Icon iconType={['arrows', 'arrow-right-s']} size={14} color="default-muted" />}
                      <span className="font-medium">{tag}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-400">분류 없음</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isHistoryWorkspace && onMakeMainChat && (
            <Button
              onClick={onMakeMainChat}
              variant="iconOnly"
              buttonStyle="ghostMuted"
              size="xs"
              leadIcon={<Icon iconType={['system', 'external-link']} size={18} />}
              title="메인 채팅창으로 열기"
            />
          )}

          {isHistoryWorkspace && onToggleLike && (
            <Button
              onClick={onToggleLike}
              variant="iconOnly"
              buttonStyle={isLiked ? 'ghost' : 'ghostMuted'}
              size="xs"
              className={isLiked ? 'text-yellow-500' : ''}
              title={isLiked ? '좋아요 취소' : '좋아요'}
              leadIcon={<Icon iconType={['system', 'star']} size={18} isFill={isLiked} />}
            />
          )}

          {onToggleFavorite && (
            <Button
              onClick={onToggleFavorite}
              variant="iconOnly"
              buttonStyle={isFavorite ? 'ghost' : 'ghostMuted'}
              size="xs"
              className={isFavorite ? 'text-yellow-500' : ''}
              title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              leadIcon={<Icon iconType={['system', 'star']} size={18} isFill={isFavorite} />}
            />
          )}

          <Switch
            checked={isMaskingDisabled}
            onCheckedChange={(checked) => setIsMaskingDisabled(checked)}
            label="마스킹 해제"
            switchPosition="right"
            color="blue"
          />

          <Button
            onClick={() => console.log('Download')}
            variant="iconOnly"
            buttonStyle="ghost"
            size="xs"
            leadIcon={<Icon iconType={['system', 'download']} size={18} color="default-subtle" />}
            title="다운로드"
          />

          <Button
            onClick={() => console.log('Reload')}
            variant="iconOnly"
            buttonStyle="ghost"
            size="xs"
            leadIcon={<Icon iconType={['system', 'refresh']} size={18} color="default-subtle" />}
            title="새로고침"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'chat' | 'reference')} className="flex-shrink-0 border-b border-gray-200 bg-white">
        <TabsList variant="underline">
          <TabsTrigger value="chat">대화</TabsTrigger>
          <TabsTrigger value="reference">레퍼런스</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'chat' ? (
          chatContent ? (
            <div className="h-full">{chatContent}</div>
          ) : (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === 'agent' ? 'justify-end' : ''
                  }`}
                >
                  {message.sender === 'customer' && (
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex-shrink-0 flex items-center justify-center">
                      <Icon iconType={['communication', 'chat-1']} size={14} color="informative" />
                    </div>
                  )}
                  <div className={`flex-1 ${message.sender === 'agent' ? 'flex justify-end' : ''}`}>
                    <div
                      className={`rounded-lg p-3 max-w-[80%] ${
                        message.sender === 'customer'
                          ? 'bg-gray-200'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${message.sender === 'agent' ? 'text-right' : ''}`}>
                      {message.time}
                    </p>
                  </div>
                  {message.sender === 'agent' && (
                    <div className="w-8 h-8 rounded-full bg-green-200 flex-shrink-0 flex items-center justify-center">
                      <Icon iconType={['communication', 'chat-1']} size={14} color="success" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {contactData && (
              <ChannelComposer
                roomId={roomId}
                roomChannel={roomChannel}
                customerName={customerName}
                customerPhone={customerPhone}
                customerEmail={customerEmail}
                brandId={brandId}
                isCompleted={isCompleted}
                onSendMessage={handleSendMessage}
              />
            )}
          </div>
          )
        ) : (
          <div className="h-full overflow-y-auto">
            <ContactReferenceArea
              allRooms={allRooms}
              onSelectHistoricalRoom={onSelectHistoricalRoom}
              hideTabs={false}
              showAllTabs
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWorkspaceWithTabs;
