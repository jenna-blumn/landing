import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  ScrollArea,
} from '@blumnai-studio/blumnai-design-system';
import { useTeamChatContext } from '../../context/TeamChatContext';
import type { ChatMember } from '../../types/common';

interface ThreadInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (agentIds: string[]) => Promise<void> | void;
}

export default function ThreadInviteModal({ isOpen, onClose, onInvite }: ThreadInviteModalProps): JSX.Element | null {
  const { api, auth } = useTeamChatContext();
  const [members, setMembers] = useState<ChatMember[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const load = async (): Promise<void> => {
      setLoading(true);
      try {
        const agents = await api.getAgents();
        setMembers(agents.filter((agent) => agent.userId !== auth.userId));
        setSelectedIds([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [api, auth.userId, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>참여자 추가</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-72">
          <div className="space-y-2 p-1">
            {loading && <div className="text-sm text-muted-foreground">로딩 중...</div>}
            {!loading && members.map((member) => (
              <label key={member.userId} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted rounded-md px-2 py-1.5">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(member.userId)}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelectedIds((prev) => [...prev, member.userId]);
                    } else {
                      setSelectedIds((prev) => prev.filter((id) => id !== member.userId));
                    }
                  }}
                  className="rounded border-input"
                />
                <span className="text-foreground">{member.userName}</span>
              </label>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button buttonStyle="soft" onClick={onClose}>취소</Button>
          <Button
            disabled={selectedIds.length === 0}
            onClick={async () => {
              await onInvite(selectedIds);
              onClose();
            }}
          >
            추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
