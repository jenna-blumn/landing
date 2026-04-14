// Providers
export { TeamChatModuleProvider } from './context/TeamChatProvider';
export type { TeamChatModuleProviderProps } from './context/TeamChatProvider';
export { useTeamChatContext } from './context/TeamChatContext';

// Thread components
export { default as ThreadEntryButton } from './thread/components/ThreadEntryButton';
export { default as ThreadPanel } from './thread/components/ThreadPanel';
export { default as ThreadMessageList } from './thread/components/ThreadMessageList';
export { default as ThreadComposer } from './thread/components/ThreadComposer';
export { default as ThreadList } from './thread/components/ThreadList';
export { default as ThreadInviteModal } from './thread/components/ThreadInviteModal';
export { default as ThreadSplitView } from './thread/components/ThreadSplitView';

// Group chat components
export { default as GroupChatRoomList } from './groupChat/components/GroupChatRoomList';
export { default as GroupChatRoom } from './groupChat/components/GroupChatRoom';
export { default as GroupChatMessageList } from './groupChat/components/GroupChatMessageList';
export { default as GroupChatComposer } from './groupChat/components/GroupChatComposer';
export { default as MemberList } from './groupChat/components/MemberList';

// Hooks
export { useThread } from './thread/hooks/useThread';
export type { UseThreadResult } from './thread/hooks/useThread';
export { useThreadMessages } from './thread/hooks/useThreadMessages';
export type { UseThreadMessagesResult } from './thread/hooks/useThreadMessages';
export { useGroupChat } from './groupChat/hooks/useGroupChat';
export type { UseGroupChatResult } from './groupChat/hooks/useGroupChat';
export { useGroupChatMessages } from './groupChat/hooks/useGroupChatMessages';
export type { UseGroupChatMessagesResult } from './groupChat/hooks/useGroupChatMessages';

// Types
export type { AuthConfig, UserRole } from './types/auth';
export type { RoomRef } from './types/room';
export type {
  ChatMessage,
  ChatMember,
  Reaction,
  MentionRef,
  MentionGroupRef,
  ThreadReplyPreview,
} from './types/common';
export type { ThreadRoom, CreateThreadInput } from './types/thread';
export type { GroupChatRoom as GroupChatRoomType, CreateGroupChatInput } from './types/groupChat';
export type {
  TeamChatModuleConfig,
  TeamChatCallbacks,
  DisplayMode,
  ApiType,
  MessageSentPayload,
} from './types/module';

// APIs
export type { ITeamChatApi, SendMessageInput, CreateMentionInput } from './api/ITeamChatApi';
export { LocalStorageTeamChatApi } from './api/LocalStorageTeamChatApi';
export { createTeamChatApi } from './api/createTeamChatApi';

// Utils
export { extractMentions, extractMentionGroups } from './utils/mentionUtils';
export { parseAITargets } from './utils/aiTargetingUtils';
