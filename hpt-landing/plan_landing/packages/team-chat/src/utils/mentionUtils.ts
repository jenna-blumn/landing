export interface ParsedMentionGroup {
  mentions: string[];
  isGroup: boolean;
}

export function extractMentions(content: string): string[] {
  const mentionRegex = /@([\w가-힣]+)/g;
  const mentions: string[] = [];
  let match: RegExpExecArray | null = null;

  while (true) {
    match = mentionRegex.exec(content);
    if (!match) {
      break;
    }
    mentions.push(match[1]);
  }

  return mentions;
}

export function extractMentionGroups(content: string): ParsedMentionGroup[] {
  const groupRegex = /@([\w가-힣]+(?:\+@[\w가-힣]+)+)/g;
  const singleMentionRegex = /@([\w가-힣]+)/g;
  const groups: ParsedMentionGroup[] = [];
  const coveredPositions = new Set<number>();
  let match: RegExpExecArray | null = null;

  while (true) {
    match = groupRegex.exec(content);
    if (!match) {
      break;
    }
    const mentionNames = match[1]
      .split('+')
      .map((name) => name.replace('@', '').trim())
      .filter(Boolean);

    if (mentionNames.length > 1) {
      groups.push({ mentions: mentionNames, isGroup: true });
      for (let i = match.index; i < match.index + match[0].length; i += 1) {
        coveredPositions.add(i);
      }
    }
  }

  while (true) {
    match = singleMentionRegex.exec(content);
    if (!match) {
      break;
    }
    if (!coveredPositions.has(match.index)) {
      groups.push({ mentions: [match[1]], isGroup: false });
    }
  }

  return groups;
}
