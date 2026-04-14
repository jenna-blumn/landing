import React, { useMemo } from 'react';
import type { AuthConfig } from '../types/auth';
import type { TaskModuleConfig, TaskModuleCallbacks } from '../types/module';
import type { CreateTaskInput } from '../types/task';
import type { RoomRef } from '../types/room';
import { AuthProvider } from './AuthContext';
import { TaskProvider } from './TaskContext';
import { createTaskApi, createConsultantApi } from '../api/createApiClient';

interface TaskModuleProviderProps {
  auth: AuthConfig;
  config: TaskModuleConfig;
  callbacks?: TaskModuleCallbacks;
  selectedRoom?: RoomRef | null;
  allRooms?: RoomRef[];
  prefillData?: CreateTaskInput | null;
  focusMessageRequest?: { messageId: number; nonce: number } | null;
  children: React.ReactNode;
}

export const TaskModuleProvider: React.FC<TaskModuleProviderProps> = ({
  auth,
  config,
  callbacks = {},
  selectedRoom = null,
  allRooms = [],
  prefillData = null,
  focusMessageRequest = null,
  children,
}) => {
  const api = useMemo(() => createTaskApi(config, auth), [auth, config]);
  const consultantApi = useMemo(() => createConsultantApi(), []);

  return (
    <AuthProvider auth={auth}>
      <TaskProvider
        api={api}
        consultantApi={consultantApi}
        auth={auth}
        config={config}
        callbacks={callbacks}
        selectedRoom={selectedRoom}
        allRooms={allRooms}
        prefillData={prefillData}
        focusMessageRequest={focusMessageRequest}
      >
        {children}
      </TaskProvider>
    </AuthProvider>
  );
};
