import type { AuthConfig } from '../types/auth';
import type { TeamChatModuleConfig } from '../types/module';
import type { ITeamChatApi } from './ITeamChatApi';
import { LocalStorageTeamChatApi } from './LocalStorageTeamChatApi';

export function createTeamChatApi(config: TeamChatModuleConfig, _auth: AuthConfig): ITeamChatApi {
  if (config.apiType === 'localStorage') {
    return new LocalStorageTeamChatApi();
  }

  throw new Error(`Unsupported apiType: ${config.apiType}. Use 'localStorage'.`);
}
