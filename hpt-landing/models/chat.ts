import { AI_MESSAGE_TYPE } from "@/models/aiAgent";

export type ChannelInfo = {
  shr_uuid: string;
  shr_type: string;
  api_key: string | null;
  sender_key: string;
};

export type CustomerInfo = {
  id: number;
  uuid: string;
};

export type RoomInfo = {
  chatListId: string;
  firstStatus: number; // -2: 상담 대기, -1: 글 입력 막기
};

export type MessageStatus = "PENDING" | "SUCCESS" | "FAILURE" | undefined;

export type FaqTemplate = {
  template_id: number;
  question: string;
  reg_date: string;
};

export type Faq = {
  category_id: number;
  category_name: string;
  templates: FaqTemplate[];
};

export type ImageList = {
  id: number;
  src: string;
  alt: string;
};

export type CheckModal = {
  isOpen: boolean;
  content: string;
  isWarning: boolean;
};

export type Language = "KOR" | "ENG" | "JPN";

export type PriorityChatInfo = {
  roomId: string;
  customerId: number;
  userId: string;
  uuid: string;
};

export type ChatData = {
  [key: string]: any;
  id: number;
  chat_list_id: string;
  socket_room_id: string;
  from_id: number;
  to_id: number;
  type: string;
  user_type: string;
  contents: string;
  contents_type: string;
  status: string;
  counterpart_status: string;
  send_date: string;
  receive_date: string;
  read_date: string;
  fail_date: string;
  msg_id: string;
  seq: null;
  is_today_first_counsel: number;
  date: string;
  msg: string;
  msgId: string;
  result: boolean;
  roomid: string;
  userid: string;
  messageStatus?: MessageStatus;
  imageFile?: File[] | FileList;
};

export interface ChatState {
  isAIReady: boolean;
  isInitRoomInfo: boolean;
  isConnectedSocket: boolean;
  isLoading: boolean;
  customer: CustomerInfo;
  room: RoomInfo;
  isSocketConnReady: boolean;
  chatData: ChatData[];
  isLoadedChatData: boolean;
  pendingMessage: string | null;
  aiRequests: Record<string, string>;
}

export interface ChatActions {
  setConnectSocket: (isConnectedSocket: boolean) => void;
  setSocketConnectReady: (isSocketConnReady: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  getCustomerInfo: (customer: CustomerInfo) => void;
  getRoomInfo: (room: RoomInfo) => void;
  updateChatData: (chatData: ChatData) => void;
  setInitRoomInfo: (isInitRoomInfo: boolean) => void;
  _getChatData: (chatData: ChatData[]) => void;
  resetChatData: () => void;
  setPendingMessage: (message: string | null) => void;
  resetAIRequests: () => void;
  setAIRequests: (requestId: string, messageType: AI_MESSAGE_TYPE) => void;
}

export type ChatStore = ChatState & ChatActions;

export enum ChatMode {
  HERO = "hero",
  CHAT = "chat",
}
