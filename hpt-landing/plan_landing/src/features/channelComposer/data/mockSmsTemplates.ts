import type { Template } from '../types';

export const mockSmsTemplates: Template[] = [
  {
    id: 'sms_tmpl_001',
    name: '주문 확인 안내',
    category: '주문/배송',
    content:
      '[{{brandName}}] {{customerName}}님, 주문이 접수되었습니다. 주문번호: {{orderNumber}} 감사합니다.',
    variables: [
      { key: 'brandName', label: '브랜드명', required: true },
      { key: 'customerName', label: '고객명', required: true },
      { key: 'orderNumber', label: '주문번호', required: true },
    ],
    isFavorite: true,
    channelType: 'sms',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'sms_tmpl_002',
    name: '배송 출발 안내',
    category: '주문/배송',
    content:
      '[{{brandName}}] {{customerName}}님, 주문하신 상품이 배송 출발했습니다. 택배사: {{deliveryCompany}} / 송장번호: {{trackingNumber}}',
    variables: [
      { key: 'brandName', label: '브랜드명', required: true },
      { key: 'customerName', label: '고객명', required: true },
      { key: 'deliveryCompany', label: '택배사', required: true },
      { key: 'trackingNumber', label: '송장번호', required: true },
    ],
    isFavorite: true,
    channelType: 'sms',
    createdAt: Date.now() - 86400000 * 28,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'sms_tmpl_003',
    name: '배송 완료 안내',
    category: '주문/배송',
    content:
      '[{{brandName}}] {{customerName}}님, 배송이 완료되었습니다. 주문번호: {{orderNumber}} 이용해 주셔서 감사합니다.',
    variables: [
      { key: 'brandName', label: '브랜드명', required: true },
      { key: 'customerName', label: '고객명', required: true },
      { key: 'orderNumber', label: '주문번호', required: true },
    ],
    isFavorite: false,
    channelType: 'sms',
    createdAt: Date.now() - 86400000 * 25,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'sms_tmpl_004',
    name: '결제 완료 안내',
    category: '결제',
    content:
      '[{{brandName}}] {{customerName}}님, {{amount}}원 결제가 완료되었습니다. 감사합니다.',
    variables: [
      { key: 'brandName', label: '브랜드명', required: true },
      { key: 'customerName', label: '고객명', required: true },
      { key: 'amount', label: '결제금액', required: true },
    ],
    isFavorite: true,
    channelType: 'sms',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'sms_tmpl_005',
    name: '예약 확인',
    category: '예약',
    content:
      '[{{brandName}}] {{customerName}}님, {{reservationDate}} 예약이 확인되었습니다. 문의: {{contactNumber}}',
    variables: [
      { key: 'brandName', label: '브랜드명', required: true },
      { key: 'customerName', label: '고객명', required: true },
      { key: 'reservationDate', label: '예약일시', required: true },
      { key: 'contactNumber', label: '문의전화', required: false },
    ],
    isFavorite: false,
    channelType: 'sms',
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'sms_tmpl_006',
    name: '상담 콜백 안내',
    category: '상담',
    content:
      '[{{brandName}}] {{customerName}}님, 요청하신 상담 콜백 안내입니다. 상담사 {{consultantName}}이 곧 연락드리겠습니다.',
    variables: [
      { key: 'brandName', label: '브랜드명', required: true },
      { key: 'customerName', label: '고객명', required: true },
      { key: 'consultantName', label: '상담사명', required: true },
    ],
    isFavorite: true,
    channelType: 'sms',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now(),
  },
  {
    id: 'sms_tmpl_007',
    name: '부재중 안내',
    category: '상담',
    content:
      '[{{brandName}}] {{customerName}}님, 전화 연결이 되지 않아 안내드립니다. 콜백 요청은 {{contactNumber}}로 연락 부탁드립니다.',
    variables: [
      { key: 'brandName', label: '브랜드명', required: true },
      { key: 'customerName', label: '고객명', required: true },
      { key: 'contactNumber', label: '콜백번호', required: true },
    ],
    isFavorite: true,
    channelType: 'sms',
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now(),
  },
  {
    id: 'sms_tmpl_008',
    name: '환불 처리 완료',
    category: '결제',
    content:
      '[{{brandName}}] {{customerName}}님, {{refundAmount}}원 환불이 완료되었습니다. 3~7영업일 내 입금됩니다.',
    variables: [
      { key: 'brandName', label: '브랜드명', required: true },
      { key: 'customerName', label: '고객명', required: true },
      { key: 'refundAmount', label: '환불금액', required: true },
    ],
    isFavorite: false,
    channelType: 'sms',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
  },
];
