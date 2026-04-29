import axios from 'axios';

const timeout = 10000;
const headers = {
  'content-type': 'application/json',
};

export const publicHttp = axios.create({
  timeout,
  headers,
});

export const privateHttp = axios.create({
  timeout,
  headers: {
    ...headers,
  },
});

let _webhookApiUrl = '';

export function initializeHttp(config: {
  webChatUrl: string;
  webhookApiUrl: string;
}) {
  publicHttp.defaults.baseURL = config.webChatUrl;
  privateHttp.defaults.baseURL = config.webChatUrl;
  _webhookApiUrl = config.webhookApiUrl;
}

export function getWebhookApiUrl() {
  return _webhookApiUrl;
}

privateHttp.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
