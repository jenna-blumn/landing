import type { ChatMember } from '../types/common';

export interface AITargetingResult {
  targetedAgentIds: string[];
  isExplicitTarget: boolean;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function parseAITargets(
  content: string,
  participants: ChatMember[],
  currentUserId: string,
): AITargetingResult {
  const aiMembers = participants.filter((member) => member.isAiAgent && member.userId !== currentUserId);
  if (aiMembers.length === 0) {
    return { targetedAgentIds: [], isExplicitTarget: false };
  }

  const contentLower = content.toLowerCase();
  const targeted = aiMembers
    .filter((member) => {
      const mentionPattern = new RegExp(`@${escapeRegex(member.userName)}`, 'i');
      const textPattern = new RegExp(`\\b${escapeRegex(member.userName.toLowerCase())}\\b`, 'i');
      return mentionPattern.test(content) || textPattern.test(contentLower);
    })
    .map((member) => member.userId);

  if (targeted.length > 0) {
    return { targetedAgentIds: targeted, isExplicitTarget: true };
  }

  return {
    targetedAgentIds: aiMembers.map((member) => member.userId),
    isExplicitTarget: false,
  };
}
