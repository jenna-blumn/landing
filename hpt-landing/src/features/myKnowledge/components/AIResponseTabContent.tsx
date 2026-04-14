import React from 'react';
import { Icon } from '@blumnai-studio/blumnai-design-system';

const AIResponseTabContent: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center px-5 py-8">
      <div className="text-center">
        <Icon iconType={['weather', 'sparkling']} size={48} color="#d1d5db" className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">AI 응답</h3>
        <p className="text-sm text-gray-500">
          AI 기반 자동 응답 기능이 곧 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
};

export default AIResponseTabContent;
