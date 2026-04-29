import { useMemo } from 'react';
import { Badge, ScrollArea } from '@blumnai-studio/blumnai-design-system';
import { useGroupChatMessages } from '../hooks/useGroupChatMessages';
import GroupChatComposer from './GroupChatComposer';
import GroupChatMessageList from './GroupChatMessageList';
import MemberList from './MemberList';
import type { GroupChatRoom } from '../../types/groupChat';

interface GroupChatRoomProps {
  room: GroupChatRoom | null;
}

export default function GroupChatRoomView({ room }: GroupChatRoomProps): JSX.Element {
  const { messages, sendMessage } = useGroupChatMessages(room?.id ?? null);

  const members = useMemo(() => room?.members ?? [], [room]);

  if (!room) {
    return (
      <div className="flex-1 bg-muted flex items-center justify-center text-sm text-muted-foreground">
        대화방을 선택하세요.
      </div>
    );
  }

  return (
    <section className="flex-1 flex min-h-0">
      <div className="flex-1 flex flex-col min-h-0">
        <header className="h-12 border-b border-border px-3 flex items-center gap-2 text-sm font-semibold bg-info/5">
          <span className="text-foreground">{room.name}</span>
          <Badge label="팀 대화" color="blue" size="sm" shape="pill" />
        </header>
        <ScrollArea className="flex-1">
          <GroupChatMessageList messages={messages} />
        </ScrollArea>
        <GroupChatComposer onSend={async (text) => { await sendMessage(text); }} />
      </div>
      <MemberList members={members} />
    </section>
  );
}
