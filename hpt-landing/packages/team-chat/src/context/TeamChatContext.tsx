import { createContext, useContext } from 'react';
import type { AuthConfig } from '../types/auth';
import type { TeamChatCallbacks, TeamChatModuleConfig } from '../types/module';
import type { RoomRef } from '../types/room';
import type { ITeamChatApi } from '../api/ITeamChatApi';

export interface TeamChatContextValue {
  api: ITeamChatApi;
  auth: AuthConfig;
  config: TeamChatModuleConfig;
  callbacks: TeamChatCallbacks;
  selectedRoom: RoomRef | null;
  allRooms: RoomRef[];
}

const TeamChatContext = createContext<TeamChatContextValue | null>(null);

export function TeamChatContextProvider({
  value,
  children,
}: {
  value: TeamChatContextValue;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <TeamChatContext.Provider value={value}>
      {children}
    </TeamChatContext.Provider>
  );
}

export function useTeamChatContext(): TeamChatContextValue {
  const context = useContext(TeamChatContext);
  if (!context) {
    throw new Error('useTeamChatContext must be used within TeamChatModuleProvider');
  }
  return context;
}
