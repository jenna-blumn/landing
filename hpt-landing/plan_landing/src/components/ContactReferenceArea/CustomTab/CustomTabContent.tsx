import React from 'react';
import { Icon } from '@blumnai-studio/blumnai-design-system';

interface CustomTabContentProps {
  tabId: string;
  tabName: string;
}

const CustomTabContent: React.FC<CustomTabContentProps> = ({ tabId: _tabId, tabName }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon iconType={['document', 'file-text']} size={32} color="default-muted" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">{tabName}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        이 탭은 커스텀 탭입니다. 필요한 콘텐츠나 위젯을 추가하여 사용할 수 있습니다.
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Icon iconType={['system', 'settings']} size={14} />
        <span>설정에서 이 탭을 관리할 수 있습니다</span>
      </div>
    </div>
  );
};

export default CustomTabContent;
