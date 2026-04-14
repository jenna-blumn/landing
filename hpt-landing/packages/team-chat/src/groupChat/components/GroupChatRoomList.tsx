import { ScrollArea } from '@blumnai-studio/blumnai-design-system';
import type { GroupChatRoom } from '../../types/groupChat';

interface GroupChatRoomListProps {
  rooms: GroupChatRoom[];
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

export default function GroupChatRoomList({
  rooms,
  activeRoomId,
  onSelectRoom,
}: GroupChatRoomListProps): JSX.Element {
  return (
    <div className="bg-card">
      <div className="px-3 py-2 border-b border-border text-sm font-semibold text-foreground">팀 대화방</div>
      <ScrollArea className="max-h-[420px]">
        {rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            className={`w-full text-left px-3 py-2 border-b border-border/30 hover:bg-muted transition-colors ${
              activeRoomId === room.id ? 'bg-primary/10' : ''
            }`}
            onClick={() => onSelectRoom(room.id)}
          >
            <div className="text-sm font-medium text-foreground">{room.name}</div>
            <div className="text-xs text-muted-foreground">{room.members.map((member) => member.userName).join(', ')}</div>
          </button>
        ))}
      </ScrollArea>
    </div>
  );
}
