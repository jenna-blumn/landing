export const getFlagOptions = () => [
  { type: null, label: '플래그 없음', color: '', textColor: 'text-gray-500', iconColor: undefined },
  { type: 'urgent', label: '긴급', color: 'bg-red-500', textColor: 'text-red-500', iconColor: 'destructive' as const },
  { type: 'important', label: '중요', color: 'bg-orange-500', textColor: 'text-orange-500', iconColor: 'warning' as const },
  { type: 'normal', label: '일반', color: 'bg-green-500', textColor: 'text-green-500', iconColor: 'success' as const },
  { type: 'info', label: '정보', color: 'bg-blue-500', textColor: 'text-blue-500', iconColor: 'informative' as const },
  { type: 'completed', label: '완료', color: 'bg-purple-500', textColor: 'text-purple-500', iconColor: '#a855f7' as const },
];

export const flagIconColorMap: Record<string, string> = {
  urgent: 'destructive',
  important: 'warning',
  normal: 'success',
  info: 'informative',
  completed: '#a855f7',
};

export const flagChipColorMap: Record<string, 'red' | 'orange' | 'green' | 'blue' | 'purple'> = {
  urgent: 'red',
  important: 'orange',
  normal: 'green',
  info: 'blue',
  completed: 'purple',
};

export const getPriorityOptions = () => ['낮음', '보통', '높음', '긴급'];
