import type { IMessageScheduleApi } from './IMessageScheduleApi';
import { LocalStorageMessageScheduleApi } from './LocalStorageMessageScheduleApi';
import { HttpMessageScheduleApi } from './HttpMessageScheduleApi';

export interface MessageScheduleApiConfig {
  apiType: 'localStorage' | 'http';
  httpBaseUrl?: string;
  token?: string;
}

export function createMessageScheduleApi(config: MessageScheduleApiConfig): IMessageScheduleApi {
  if (config.apiType === 'http') {
    if (!config.httpBaseUrl) {
      throw new Error('httpBaseUrl is required when apiType is "http"');
    }

    return new HttpMessageScheduleApi(config.httpBaseUrl, config.token ?? '');
  }

  return new LocalStorageMessageScheduleApi();
}
