import React from 'react';
import type { OMSIntegration, PanelWidthSetting } from '../../../features/integrations/types';

interface IntegrationTabContentProps {
  onSelectIntegration: (integration: OMSIntegration) => void;
  panelWidthSetting: PanelWidthSetting;
  onPanelWidthSettingChange: (setting: PanelWidthSetting) => void;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg p-3 space-y-2 border border-purple-200 mb-3">
    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const IntegrationTabContent: React.FC<IntegrationTabContentProps> = () => {
  return (
    <div className="space-y-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
};

export default IntegrationTabContent;
