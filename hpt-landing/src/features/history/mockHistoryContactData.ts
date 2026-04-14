export interface HistoryContactMessage {
  id: number;
  sender: 'customer' | 'agent';
  text: string;
  time: string;
}

export interface HistoryContactData {
  id: number;
  contactName: string;
  conversationTopic: string;
  channel: string;
  brand: string;
  consultantName: string;
  startTime: string;
  endTime: string;
  status: 'closed' | 'ongoing';
  messages: HistoryContactMessage[];
}

export const mockHistoryContacts: HistoryContactData[] = [
  {
    id: 101,
    contactName: '김고객',
    conversationTopic: '배송 지연 문의',
    channel: 'chat',
    brand: 'apple',
    consultantName: '이상담',
    startTime: '2024-01-15 09:30',
    endTime: '2024-01-15 10:15',
    status: 'closed',
    messages: [
      { id: 1, sender: 'customer', text: '안녕하세요, 주문한 상품이 아직 도착하지 않았습니다.', time: '09:30' },
      { id: 2, sender: 'agent', text: '안녕하세요 고객님, 불편을 드려 죄송합니다. 주문번호를 알려주시겠어요?', time: '09:31' },
      { id: 3, sender: 'customer', text: '주문번호는 ORD-2024-12345 입니다.', time: '09:32' },
      { id: 4, sender: 'agent', text: '확인해보겠습니다. 잠시만 기다려주세요.', time: '09:33' },
      { id: 5, sender: 'agent', text: '확인 결과, 물류센터에서 출고가 지연되고 있습니다. 오늘 중으로 발송될 예정입니다.', time: '09:38' },
      { id: 6, sender: 'customer', text: '알겠습니다. 감사합니다.', time: '09:39' },
      { id: 7, sender: 'agent', text: '추가 문의사항이 있으시면 말씀해주세요. 좋은 하루 되세요!', time: '09:40' },
    ],
  },
  {
    id: 102,
    contactName: '김고객',
    conversationTopic: '환불 요청',
    channel: 'chat',
    brand: 'apple',
    consultantName: '박상담',
    startTime: '2024-01-10 14:00',
    endTime: '2024-01-10 14:45',
    status: 'closed',
    messages: [
      { id: 1, sender: 'customer', text: '구매한 상품을 환불받고 싶습니다.', time: '14:00' },
      { id: 2, sender: 'agent', text: '안녕하세요 고객님, 환불 사유를 말씀해주시겠어요?', time: '14:01' },
      { id: 3, sender: 'customer', text: '사이즈가 맞지 않아서요.', time: '14:02' },
      { id: 4, sender: 'agent', text: '네, 교환 또는 환불 중 어떤 것을 원하시나요?', time: '14:03' },
      { id: 5, sender: 'customer', text: '환불로 진행해주세요.', time: '14:04' },
      { id: 6, sender: 'agent', text: '알겠습니다. 반품 접수 도와드리겠습니다. 상품 상태는 어떤가요?', time: '14:05' },
      { id: 7, sender: 'customer', text: '개봉만 하고 착용은 안했습니다.', time: '14:06' },
      { id: 8, sender: 'agent', text: '반품 접수 완료되었습니다. 택배사에서 내일 수거 예정입니다.', time: '14:15' },
      { id: 9, sender: 'customer', text: '감사합니다!', time: '14:16' },
    ],
  },
  {
    id: 103,
    contactName: '김고객',
    conversationTopic: '제품 사용법 문의',
    channel: 'phone',
    brand: 'banana',
    consultantName: '최상담',
    startTime: '2024-01-05 11:00',
    endTime: '2024-01-05 11:30',
    status: 'closed',
    messages: [
      { id: 1, sender: 'customer', text: '제품 설정 방법을 모르겠어요.', time: '11:00' },
      { id: 2, sender: 'agent', text: '어떤 제품을 사용하고 계신가요?', time: '11:01' },
      { id: 3, sender: 'customer', text: '무선 이어폰 BT-500 모델입니다.', time: '11:02' },
      { id: 4, sender: 'agent', text: '블루투스 연결 방법을 안내해드리겠습니다.', time: '11:03' },
      { id: 5, sender: 'agent', text: '먼저 이어폰 케이스를 열고, 양쪽 이어폰의 버튼을 3초간 눌러주세요.', time: '11:04' },
      { id: 6, sender: 'customer', text: '네, 했습니다. LED가 깜빡이네요.', time: '11:06' },
      { id: 7, sender: 'agent', text: '이제 스마트폰의 블루투스 설정에서 BT-500을 찾아 연결해주세요.', time: '11:07' },
      { id: 8, sender: 'customer', text: '연결됐습니다! 감사합니다.', time: '11:10' },
    ],
  },
  {
    id: 104,
    contactName: '김고객',
    conversationTopic: '결제 오류 문의',
    channel: 'chat',
    brand: 'cherry',
    consultantName: '김상담',
    startTime: '2024-01-02 16:30',
    endTime: '',
    status: 'ongoing',
    messages: [
      { id: 1, sender: 'customer', text: '결제가 계속 실패해요.', time: '16:30' },
      { id: 2, sender: 'agent', text: '어떤 결제 수단을 사용하고 계신가요?', time: '16:31' },
      { id: 3, sender: 'customer', text: '신용카드로 결제하려고 합니다.', time: '16:32' },
      { id: 4, sender: 'agent', text: '카드사를 확인해볼게요. 어느 카드사인가요?', time: '16:33' },
      { id: 5, sender: 'customer', text: 'KB국민카드입니다.', time: '16:34' },
    ],
  },
];

export const getHistoryContactById = (id: number): HistoryContactData | undefined => {
  return mockHistoryContacts.find(contact => contact.id === id);
};
