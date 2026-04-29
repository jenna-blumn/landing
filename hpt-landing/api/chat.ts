import { privateHttp, publicHttp, getWebhookApiUrl } from '@/lib/http';
import { getMicroTime } from '@/lib/util';

export const openChatRoom$ = ({
  siteId,
  userId,
  categoryId,
  divisionId,
}: {
  siteId: string;
  userId: string;
  categoryId: string;
  divisionId: string;
}) => {
  return publicHttp.post(
    getWebhookApiUrl() +
      `/api-hook/ht2/happytalk/receive/${siteId}/open`,
    {
      uid: userId,
      site_id: siteId,
      category_id: categoryId,
      division_id: divisionId,
      usergb: 'W',
    },
    {
      headers: {
        'cache-control': 'no-cache',
        CHANNELSERVICEID: siteId,
        CHANNELCUSTOMERID: userId,
        'content-type': 'application/json',
      },
    },
  );
};

export const sendMessage$ = ({
  siteId,
  userId,
  message,
}: {
  siteId: string;
  userId: string;
  message: string;
}) => {
  const params = {
    contents_type: 'text',
    msg: message,
  };

  const data = JSON.stringify(params);

  return publicHttp.post(
    getWebhookApiUrl() +
      `/api-hook/ht2/happytalk/receive/${siteId}/message`,
    data,
    {
      headers: {
        CHANNELSERVICEID: siteId,
        CHANNELCUSTOMERID: userId,
        'content-type': 'application/json',
        'Chat-Ver': 2,
        'Chat-Time': getMicroTime(),
      },
    },
  );
};

export const closeChatRoom$ = ({
  siteId,
  customerId,
  chatListId,
}: {
  siteId: string;
  customerId: number;
  chatListId: string;
}) => {
  return privateHttp.post(
    '/chats/v1/happytalk/close',
    {
      channelCustomerId: customerId,
      channelServiceId: siteId,
      openPayload: {
        site: {
          siteId: siteId,
        },
        room: {
          chatListId: chatListId,
        },
      },
    },
    {
      headers: {
        'Channel-Customer-Id': customerId,
      },
    },
  );
};
