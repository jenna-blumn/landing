import type { Template } from '../types';

export const mockAlimtalkTemplates: Template[] = [
  {
    id: 'alim_001',
    name: '주문 접수 확인',
    category: '주문/배송',
    content:
      '{{customerName}}님 주문이 접수되었습니다.\n\n주문번호: {{orderNumber}}\n상품명: {{productName}}\n결제금액: {{amount}}원\n\n배송 시작 시 다시 안내드리겠습니다.',
    variables: [
      { key: 'customerName', label: '고객명', required: true },
      { key: 'orderNumber', label: '주문번호', required: true },
      { key: 'productName', label: '상품명', required: true },
      { key: 'amount', label: '결제금액', required: true },
    ],
    buttons: [
      { type: 'web_link', name: '주문 조회', url: 'https://example.com/orders/{{orderNumber}}' },
    ],
    isFavorite: true,
    channelType: 'alimtalk',
    status: 'approved',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'alim_002',
    name: '배송 출발 안내',
    category: '주문/배송',
    content:
      '{{customerName}}님 주문하신 상품이 배송 출발되었습니다.\n\n주문번호: {{orderNumber}}\n택배사: {{deliveryCompany}}\n송장번호: {{trackingNumber}}\n\n배송 조회는 아래 버튼을 눌러 주세요.',
    variables: [
      { key: 'customerName', label: '고객명', required: true },
      { key: 'orderNumber', label: '주문번호', required: true },
      { key: 'deliveryCompany', label: '택배사', required: true },
      { key: 'trackingNumber', label: '송장번호', required: true },
    ],
    buttons: [
      { type: 'delivery_tracking', name: '배송 조회' },
    ],
    isFavorite: true,
    channelType: 'alimtalk',
    status: 'approved',
    createdAt: Date.now() - 86400000 * 28,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'alim_003',
    name: '배송 완료 안내',
    category: '주문/배송',
    content:
      '{{customerName}}님 주문하신 상품의 배송이 완료되었습니다.\n\n주문번호: {{orderNumber}}\n\n상품을 잘 받으셨다면 이용 후기를 남겨주시면 감사하겠습니다.',
    variables: [
      { key: 'customerName', label: '고객명', required: true },
      { key: 'orderNumber', label: '주문번호', required: true },
    ],
    buttons: [
      { type: 'web_link', name: '리뷰 작성', url: 'https://example.com/review/{{orderNumber}}' },
    ],
    isFavorite: false,
    channelType: 'alimtalk',
    status: 'approved',
    createdAt: Date.now() - 86400000 * 25,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'alim_004',
    name: '예약 확인 안내',
    category: '예약',
    content:
      '{{customerName}}님, 예약이 확인되었습니다.\n\n예약일시: {{reservationDate}}\n예약내용: {{reservationDetail}}\n장소: {{location}}\n\n변경 및 취소는 아래 버튼을 눌러주세요.',
    variables: [
      { key: 'customerName', label: '고객명', required: true },
      { key: 'reservationDate', label: '예약일시', required: true },
      { key: 'reservationDetail', label: '예약내용', required: true },
      { key: 'location', label: '장소', required: false },
    ],
    buttons: [
      { type: 'web_link', name: '예약 변경/취소', url: 'https://example.com/reservation' },
    ],
    isFavorite: true,
    channelType: 'alimtalk',
    status: 'approved',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'alim_005',
    name: '결제 완료 안내',
    category: '결제',
    content:
      '{{customerName}}님 결제가 완료되었습니다.\n\n결제금액: {{amount}}원\n결제수단: {{paymentMethod}}\n결제일시: {{paymentDate}}\n\n영수증은 아래 버튼에서 확인해 주세요.',
    variables: [
      { key: 'customerName', label: '고객명', required: true },
      { key: 'amount', label: '결제금액', required: true },
      { key: 'paymentMethod', label: '결제수단', required: true },
      { key: 'paymentDate', label: '결제일시', required: true },
    ],
    buttons: [
      { type: 'web_link', name: '영수증 확인', url: 'https://example.com/receipt' },
    ],
    isFavorite: false,
    channelType: 'alimtalk',
    status: 'approved',
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'alim_006',
    name: '환불 처리 안내',
    category: '결제',
    content:
      '{{customerName}}님 환불 처리가 완료되었습니다.\n\n환불금액: {{refundAmount}}원\n환불수단: {{refundMethod}}\n\n환불은 결제수단에 따라 3~7영업일 내 처리됩니다.',
    variables: [
      { key: 'customerName', label: '고객명', required: true },
      { key: 'refundAmount', label: '환불금액', required: true },
      { key: 'refundMethod', label: '환불수단', required: true },
    ],
    isFavorite: false,
    channelType: 'alimtalk',
    status: 'approved',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'alim_007',
    name: '비밀번호 재설정 안내',
    category: '회원',
    content:
      '{{customerName}}님 비밀번호 재설정을 요청하셨습니다.\n\n아래 버튼을 클릭하여 새 비밀번호를 설정해 주세요.\n\n본인이 요청하지 않았다면 고객센터로 연락해 주세요.',
    variables: [
      { key: 'customerName', label: '고객명', required: true },
    ],
    buttons: [
      { type: 'web_link', name: '비밀번호 재설정', url: 'https://example.com/reset-password' },
    ],
    isFavorite: false,
    channelType: 'alimtalk',
    status: 'approved',
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'alim_008',
    name: '상담 만족도 조사',
    category: '상담',
    content:
      '{{customerName}}님 상담은 만족스러우셨나요?\n\n상담사: {{consultantName}}\n상담일시: {{consultDate}}\n\n평가를 남겨주시면 서비스 개선에 큰 도움이 됩니다.',
    variables: [
      { key: 'customerName', label: '고객명', required: true },
      { key: 'consultantName', label: '상담사명', required: true },
      { key: 'consultDate', label: '상담일시', required: true },
    ],
    buttons: [
      { type: 'web_link', name: '만족도 평가', url: 'https://example.com/survey' },
    ],
    isFavorite: true,
    channelType: 'alimtalk',
    status: 'approved',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
  },
  {
    id: 'alim_009',
    name: '서비스 점검 안내',
    category: '공지',
    content:
      '안녕하세요, {{customerName}}님.\n\n서비스 점검이 예정되어 있습니다.\n\n점검일시: {{maintenanceDate}}\n점검시간: {{maintenanceTime}}\n점검내용: {{maintenanceDetail}}\n\n이용에 불편을 드려 죄송합니다.',
    variables: [
      { key: 'customerName', label: '고객명', required: true },
      { key: 'maintenanceDate', label: '점검일시', required: true },
      { key: 'maintenanceTime', label: '점검시간', required: true },
      { key: 'maintenanceDetail', label: '점검내용', required: false },
    ],
    isFavorite: false,
    channelType: 'alimtalk',
    status: 'approved',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now(),
  },
];
