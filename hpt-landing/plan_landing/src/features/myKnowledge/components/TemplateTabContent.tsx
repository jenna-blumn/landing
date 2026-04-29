import React from 'react';
import { Icon } from '@blumnai-studio/blumnai-design-system';

const TemplateTabContent: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center px-5 py-8">
      <div className="text-center">
        <Icon iconType={['document', 'file-text']} size={48} color="#d1d5db" className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">템플릿</h3>
        <p className="text-sm text-gray-500">
          자주 사용하는 응답 템플릿 기능이 곧 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
};

export default TemplateTabContent;
