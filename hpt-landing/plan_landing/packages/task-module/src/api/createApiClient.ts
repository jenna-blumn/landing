import type { TaskModuleConfig } from '../types/module';
import type { AuthConfig } from '../types/auth';
import type { ITaskApi } from './ITaskApi';
import type { IConsultantApi } from './IConsultantApi';
import { LocalStorageTaskApi } from './LocalStorageTaskApi';
import { HttpTaskApi } from './HttpTaskApi';
import { LocalStorageConsultantApi } from './LocalStorageConsultantApi';

export function createTaskApi(config: TaskModuleConfig, auth: AuthConfig): ITaskApi {
  if (config.apiType === 'http') {
    if (!config.httpBaseUrl) {
      throw new Error('httpBaseUrl is required when apiType is "http"');
    }
    return new HttpTaskApi(config.httpBaseUrl, auth.token, auth.userId);
  }
  return new LocalStorageTaskApi(auth.userId);
}

export function createConsultantApi(): IConsultantApi {
  return new LocalStorageConsultantApi();
}
