import React from 'react';
import { Icon, Badge, Card, CardContent } from '@blumnai-studio/blumnai-design-system';
import { ConsultationHistoryItem } from '../../../features/history/types';

interface ConsultationHistorySectionProps {
  consultationHistory: ConsultationHistoryItem[];
  onSelectHistoricalItem?: (itemId: number) => void;
}

const ConsultationHistorySection: React.FC<ConsultationHistorySectionProps> = ({
  consultationHistory,
  onSelectHistoricalItem,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <Icon iconType={['communication', 'chat-1']} size={14} color="informative" />;
      case 'phone':
        return <Icon iconType={['device', 'phone']} size={14} color="success" />;
      case 'email':
        return <Icon iconType={['business', 'mail']} size={14} color="warning" />;
      default:
        return <Icon iconType={['communication', 'chat-1']} size={14} color="default-muted" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'chat':
        return '채팅';
      case 'phone':
        return '전화';
      case 'email':
        return '이메일';
      case 'kakao':
        return '카카오';
      case 'naver':
        return '네이버';
      case 'instagram':
        return '인스타그램';
      default:
        return '기타';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'closed':
        return 'green' as const;
      case 'ongoing':
        return 'blue' as const;
      case 'pending':
        return 'orange' as const;
      default:
        return 'neutral' as const;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'closed':
        return '완료';
      case 'ongoing':
        return '진행중';
      case 'pending':
        return '대기';
      default:
        return '기타';
    }
  };

  if (consultationHistory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Icon iconType={['system', 'time']} size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">상담 이력이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {consultationHistory.map((historyItem) => (
        <Card
          key={historyItem.id}
          variant="outline"
          onClick={() => onSelectHistoricalItem?.(historyItem.id)}
          className="hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <CardContent className="!p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {getTypeIcon(historyItem.channel)}
                <span className="text-xs font-medium text-gray-600">
                  {getTypeLabel(historyItem.channel)}
                </span>
                <Badge label={getStatusLabel(historyItem.mainCategory)} color={getStatusBadgeColor(historyItem.mainCategory)} size="sm" shape="pill" />
              </div>
              <span className="text-[11px] text-gray-400 flex-shrink-0 whitespace-nowrap">{historyItem.startTime}</span>
            </div>

            <p className="text-sm text-gray-700 mb-2">{historyItem.subject || historyItem.conversationTopic}</p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="truncate">상담사: {historyItem.consultantName}</span>
              <span className="flex-shrink-0">소요시간: {historyItem.duration || '—'}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConsultationHistorySection;
