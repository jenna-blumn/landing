import React from 'react';
import { Button, Icon } from '@blumnai-studio/blumnai-design-system';

interface SideTabEmptyStateProps {
  slotId: number;
  color: string;
  onOpenSettings?: () => void;
}

const SideTabEmptyState: React.FC<SideTabEmptyStateProps> = ({
  slotId: _slotId,
  color,
  onOpenSettings,
}) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="relative inline-block">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon iconType={['business', 'stack']} size={40} color={color} />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            콘텐츠를 연동하세요
          </h3>
          <p className="text-sm text-gray-600">
            레퍼런스 탭 또는 OMS를 이 영역에 연동하여<br />
            효율적으로 작업할 수 있습니다
          </p>
        </div>

        <Button
          onClick={onOpenSettings}
          buttonStyle="primary"
          size="md"
          leadIcon={<Icon iconType={['system', 'settings']} size={16} />}
          className="hover:opacity-90"
          style={{ backgroundColor: color, color: 'white' }}
        >
          설정에서 탭/OMS 연동하기
        </Button>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            또는 헤더의 <Icon iconType={['system', 'settings']} size={12} className="inline mx-0.5" /> 버튼을 클릭하세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideTabEmptyState;
