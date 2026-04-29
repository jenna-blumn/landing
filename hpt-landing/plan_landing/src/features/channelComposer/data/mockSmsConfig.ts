import type { SmsSenderNumber } from '../types';

export const mockSenderNumbers: SmsSenderNumber[] = [
  { id: 'sender_1', number: '1588-1818', label: '대표번호', isDefault: true },
  { id: 'sender_2', number: '070-2345-4567', label: 'Banana 고객센터', brandId: 'banana', isDefault: false },
  { id: 'sender_3', number: '02-357-9876', label: 'Cherry 고객센터', brandId: 'cherry', isDefault: false },
  { id: 'sender_4', number: '1577-9999', label: 'Dragon Fruit 대표', brandId: 'dragon', isDefault: false },
  { id: 'sender_5', number: '031-123-4567', label: 'Elderberry 상담', brandId: 'elderberry', isDefault: false },
  { id: 'sender_6', number: '010-6407-0396', label: 'Apple 고객센터', brandId: 'apple', isDefault: false },
];
