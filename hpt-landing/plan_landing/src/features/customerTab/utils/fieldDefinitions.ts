import { CustomerInfo, FieldDefinition } from '../types';

export const getAllFieldDefinitions = (customerData: CustomerInfo): FieldDefinition[] => {
  return [
    // === 기본 정보 ===
    { id: 'name', label: '이름', value: customerData.name, category: 'basic' },
    { id: 'company', label: '회사', value: customerData.company || '—', category: 'basic' },
    { id: 'type', label: '유형', value: '사용자', category: 'basic' },
    { id: 'status', label: '고객 분류', value: customerData.status || '일반', category: 'basic' },
    { id: 'accountId', label: '계정 ID', value: 'user_sample_12345', category: 'basic' },
    { id: 'additionalInfo', label: '추가 정보', value: '—', category: 'basic' },
    { id: 'birthDate', label: '생년월일', value: customerData.birthDate || '—', category: 'basic' },
    { id: 'age', label: '연령', value: calculateAge(customerData.birthDate), category: 'basic' },
    { id: 'gender', label: '성별', value: customerData.gender || '—', category: 'basic' },
    { id: 'authentication', label: '인증', value: 'SMS, 프로필봇, 카카오톡', category: 'basic' },

    // === 연락처 정보 ===
    { id: 'email', label: '이메일', value: customerData.email, color: 'text-blue-600', category: 'contact' },
    { id: 'phone', label: '전화번호', value: customerData.phone || '—', category: 'contact' },
    { id: 'businessPhone', label: '업무용 전화번호', value: '—', category: 'contact' },
    { id: 'businessEmail', label: '업무용 이메일 주소', value: '—', category: 'contact' },
    { id: 'kakaoId', label: '카카오톡 ID', value: '—', category: 'contact' },
    { id: 'naverTalkId', label: '네이버톡톡 ID', value: '—', category: 'contact' },
    { id: 'instagramId', label: '인스타그램 ID', value: '—', category: 'contact' },
    { id: 'whatsappId', label: 'WhatsApp ID', value: '—', category: 'contact' },
    { id: 'zaloId', label: 'Zalo ID', value: '—', category: 'contact' },

    // === 주소 정보 ===
    { id: 'address', label: '주소', value: customerData.address || '—', category: 'address' },
    { id: 'deliveryAddress', label: '배송지 주소', value: '—', category: 'address' },

    // === 시스템 정보 ===
    { id: 'customerId', label: '사용자 ID', value: customerData.customerId, category: 'system' },
    { id: 'emailDomain', label: '이메일 도메인', value: customerData.email ? customerData.email.split('@')[1] : '—', category: 'system' },
    { id: 'os', label: 'OS', value: '—', category: 'system' },
    { id: 'browser', label: '브라우저', value: '—', category: 'system' },
    { id: 'browserLanguage', label: '브라우저 언어', value: '—', category: 'system' },

    // === 활동 기록 ===
    { id: 'firstSeen', label: '첫 방문', value: '한 달 전', category: 'activity' },
    { id: 'signedUp', label: '가입일', value: '한 달 전', category: 'activity' },
    { id: 'lastSeen', label: '마지막 방문', value: '한 달 전', category: 'activity' },
    { id: 'lastContacted', label: '마지막 연락', value: '12일 전', category: 'activity' },
    { id: 'lastHeardFrom', label: '마지막 응답', value: '한 달 전', category: 'activity' },
    { id: 'lastOpenedEmail', label: '마지막 열람 이메일', value: '—', category: 'activity' },
    { id: 'lastClickedOnLink', label: '마지막 클릭 링크', value: '—', category: 'activity' },
    { id: 'lastConsultation', label: '마지막 상담', value: customerData.lastConsultation || '—', category: 'activity' },

    // === 기타 ===
    { id: 'conversationRating', label: '상담 평점', value: '—', category: 'other' },
    { id: 'customAttribute1', label: '기타 추가 속성 1', value: '—', category: 'other' },
    { id: 'customAttribute2', label: '기타 추가 속성 2', value: '—', category: 'other' },
    { id: 'customAttribute3', label: '기타 추가 속성 3', value: '—', category: 'other' },
    { id: 'customAttribute4', label: '기타 추가 속성 4', value: '—', category: 'other' },
    { id: 'customAttribute5', label: '기타 추가 속성 5', value: '—', category: 'other' },
    { id: 'customAttribute6', label: '기타 추가 속성 6', value: '—', category: 'other' },
    { id: 'customAttribute7', label: '기타 추가 속성 7', value: '—', category: 'other' },
    { id: 'customAttribute8', label: '기타 추가 속성 8', value: '—', category: 'other' },
    { id: 'customAttribute9', label: '기타 추가 속성 9', value: '—', category: 'other' },
    { id: 'customAttribute10', label: '기타 추가 속성 10', value: '—', category: 'other' },
  ];
};

export const getDefaultVisibleFields = (): Set<string> => {
  return new Set([
    'name',
    'email',
    'phone',
    'company',
    'status',
    'birthDate',
    'address',
    'customerId',
    'lastConsultation',
  ]);
};

export const getFieldsByCategory = (category: FieldDefinition['category'], customerData: CustomerInfo): FieldDefinition[] => {
  return getAllFieldDefinitions(customerData).filter(field => field.category === category);
};

const calculateAge = (birthDate?: string): string => {
  if (!birthDate) return '—';

  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return `${age}세`;
  } catch {
    return '—';
  }
};
