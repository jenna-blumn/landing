import { CustomerGradeOption } from '../types';

const GRADE_OPTIONS_KEY = 'customer_grade_options';
const CUSTOMER_GRADES_KEY = 'customer_grades';

const DEFAULT_GRADE_OPTIONS: CustomerGradeOption[] = [
  { id: 'vip', label: 'VIP', color: 'bg-red-100', textColor: 'text-red-700', order: 0 },
  { id: 'gold', label: 'Gold', color: 'bg-yellow-100', textColor: 'text-yellow-700', order: 1 },
  { id: 'silver', label: 'Silver', color: 'bg-gray-200', textColor: 'text-gray-700', order: 2 },
  { id: 'bronze', label: 'Bronze', color: 'bg-orange-100', textColor: 'text-orange-700', order: 3 },
  { id: 'normal', label: '일반', color: 'bg-blue-50', textColor: 'text-blue-700', order: 4 },
];

export const getCustomerGradeOptions = async (): Promise<CustomerGradeOption[]> => {
  try {
    const saved = localStorage.getItem(GRADE_OPTIONS_KEY);
    if (saved) {
      return JSON.parse(saved) as CustomerGradeOption[];
    }
  } catch {
    // ignore
  }
  localStorage.setItem(GRADE_OPTIONS_KEY, JSON.stringify(DEFAULT_GRADE_OPTIONS));
  return DEFAULT_GRADE_OPTIONS;
};

export const getCustomerGrade = async (customerId: string): Promise<string> => {
  try {
    const saved = localStorage.getItem(CUSTOMER_GRADES_KEY);
    if (saved) {
      const grades = JSON.parse(saved) as Record<string, string>;
      return grades[customerId] || 'normal';
    }
  } catch {
    // ignore
  }
  return 'normal';
};

export const updateCustomerGrade = async (customerId: string, gradeId: string): Promise<void> => {
  try {
    const saved = localStorage.getItem(CUSTOMER_GRADES_KEY);
    const grades = saved ? (JSON.parse(saved) as Record<string, string>) : {};
    grades[customerId] = gradeId;
    localStorage.setItem(CUSTOMER_GRADES_KEY, JSON.stringify(grades));
  } catch {
    // ignore
  }
};
