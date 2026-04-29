import type { ChatData, CustomerInfo, RoomInfo } from '@/models/chat';

export const isDemoMode = (): boolean =>
  process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const DEMO_ROOM: RoomInfo = {
  chatListId: 'demo-room',
  firstStatus: 0,
};

export const DEMO_CUSTOMER: CustomerInfo = {
  id: 1,
  uuid: 'demo-customer',
};

const baseChatField = {
  socket_room_id: DEMO_ROOM.chatListId,
  from_id: 0,
  to_id: 0,
  type: 'message',
  contents_type: 'text',
  status: 'SUCCESS',
  counterpart_status: 'SUCCESS',
  send_date: '',
  receive_date: '',
  read_date: '',
  fail_date: '',
  seq: null,
  is_today_first_counsel: 0,
  date: '',
  result: true,
  roomid: DEMO_ROOM.chatListId,
  userid: 'demo-user',
};

export const createDemoChatData = (): ChatData[] => [
  {
    ...baseChatField,
    id: 1,
    chat_list_id: DEMO_ROOM.chatListId,
    user_type: 'A',
    contents: '데모 모드입니다. 서버 없이 로컬에서만 동작합니다.',
    msg: '데모 모드입니다. 서버 없이 로컬에서만 동작합니다.',
    msg_id: 'demo-msg-1',
    msgId: 'demo-msg-1',
  },
];

export const buildDemoUserMessage = (text: string): ChatData => ({
  ...baseChatField,
  id: Date.now(),
  chat_list_id: DEMO_ROOM.chatListId,
  user_type: 'C',
  contents: text,
  msg: text,
  msg_id: `demo-user-${Date.now()}`,
  msgId: `demo-user-${Date.now()}`,
});
