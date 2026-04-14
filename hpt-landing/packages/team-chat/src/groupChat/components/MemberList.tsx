import { ScrollArea } from '@blumnai-studio/blumnai-design-system';
import type { ChatMember } from '../../types/common';

interface MemberListProps {
  members: ChatMember[];
}

export default function MemberList({ members }: MemberListProps): JSX.Element {
  return (
    <aside className="w-48 border-l border-border bg-card p-3">
      <div className="text-xs font-semibold text-muted-foreground mb-2">참여자</div>
      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {members.map((member) => (
            <div key={member.userId} className="text-sm text-foreground">
              {member.userName}
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
