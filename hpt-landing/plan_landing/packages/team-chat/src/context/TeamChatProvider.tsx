import { useMemo } from 'react';
import { createTeamChatApi } from '../api/createTeamChatApi';
import type { AuthConfig } from '../types/auth';
import type { TeamChatCallbacks, TeamChatModuleConfig } from '../types/module';
import type { RoomRef } from '../types/room';
import { TeamChatContextProvider } from './TeamChatContext';

export interface TeamChatModuleProviderProps {
  auth: AuthConfig;
  config: TeamChatModuleConfig;
  callbacks?: TeamChatCallbacks;
  selectedRoom?: RoomRef | null;
  allRooms?: RoomRef[];
  children: React.ReactNode;
}

export function TeamChatModuleProvider({
  auth,
  config,
  callbacks = {},
  selectedRoom = null,
  allRooms = [],
  children,
}: TeamChatModuleProviderProps): JSX.Element {
  const api = useMemo(
    () => createTeamChatApi(config, auth),
    [auth, config],
  );

  return (
    <TeamChatContextProvider
      value={{
        api,
        auth,
        config,
        callbacks,
        selectedRoom,
        allRooms,
      }}
    >
      {children}
    </TeamChatContextProvider>
  );
}
