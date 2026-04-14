import React from 'react';
import { Icon, Badge, Card, CardContent } from '@blumnai-studio/blumnai-design-system';
import type { IconType } from '@blumnai-studio/blumnai-design-system';
import { HistoryItem } from '../../../features/history/types';

interface ActivityLogSectionProps {
  activityLog: HistoryItem[];
}

const ActivityLogSection: React.FC<ActivityLogSectionProps> = ({ activityLog }) => {
  const getActionIcon = (type: string): IconType => {
    switch (type) {
      case 'note': return ['communication', 'chat-1'];
      case 'todo': return ['system', 'checkbox'];
      case 'material': return ['document', 'file-text'];
      case 'task': return ['system', 'settings'];
      case 'consultant-change': return ['user', 'user'];
      case 'manager-review': return ['system', 'settings'];
      default: return ['system', 'time'];
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'note': return 'text-blue-600 bg-blue-100';
      case 'todo': return 'text-green-600 bg-green-100';
      case 'material': return 'text-green-600 bg-green-100';
      case 'task': return 'text-orange-600 bg-orange-100';
      case 'consultant-change': return 'text-cyan-600 bg-cyan-100';
      case 'manager-review': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionBadgeColor = (type: string) => {
    switch (type) {
      case 'note': return 'blue' as const;
      case 'todo': return 'green' as const;
      case 'material': return 'green' as const;
      case 'task': return 'orange' as const;
      case 'consultant-change': return 'cyan' as const;
      case 'manager-review': return 'red' as const;
      default: return 'neutral' as const;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'note': return '메모';
      case 'todo': return '할일';
      case 'material': return '자료';
      case 'task': return '작업';
      case 'consultant-change': return '상담사 변경';
      case 'manager-review': return '매니저 검토';
      case 'system': return '시스템';
      default: return '기타';
    }
  };

  if (activityLog.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Icon iconType={['system', 'time']} size={32} className="mx-auto mb-2 opacity-50" />
        <p>활동 기록이 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {activityLog.map((item, index) => {
          const actionIconType = getActionIcon(item.type);

          return (
            <div key={item.id} className="relative">
              {index !== activityLog.length - 1 && (
                <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200"></div>
              )}

              <div className="flex gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getActionColor(item.type)}`}>
                  <Icon iconType={actionIconType} size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <Card variant="outline">
                    <CardContent className="!p-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <Badge label={getTypeLabel(item.type)} color={getActionBadgeColor(item.type)} size="sm" shape="pill" />
                        <span className="text-[11px] text-gray-400 flex-shrink-0 whitespace-nowrap">{item.timestamp}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-800 mb-1">
                        {item.action}
                      </div>

                      {item.details && (
                        <p className="text-sm text-gray-600 mb-2">
                          {item.details}
                        </p>
                      )}

                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Icon iconType={['user', 'user']} size={12} className="flex-shrink-0" />
                        <span className="truncate">{item.user}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityLogSection;
