import React, { useState, useEffect } from 'react';
import { Button, Icon, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Select, Checkbox, Input } from '@blumnai-studio/blumnai-design-system';
import { SectionConfig } from '../../types';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: SectionConfig['apiSettings']) => void;
  sectionName: string;
  currentSettings?: SectionConfig['apiSettings'];
}

const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  sectionName,
  currentSettings,
}) => {
  const [endpoint, setEndpoint] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [useDefault, setUseDefault] = useState(false);

  useEffect(() => {
    if (isOpen && currentSettings) {
      setEndpoint(currentSettings.endpoint || '');
      setMethod(currentSettings.method || 'GET');
      setRefreshInterval(currentSettings.refreshInterval || 5);
      setIsAutoRefresh(currentSettings.isAutoRefresh || false);
      setUseDefault(currentSettings.useDefault || false);
    } else if (isOpen) {
      setEndpoint('');
      setMethod('GET');
      setRefreshInterval(5);
      setIsAutoRefresh(false);
      setUseDefault(false);
    }
  }, [isOpen, currentSettings]);

  const handleSave = () => {
    onSave({
      endpoint,
      method,
      isAutoRefresh,
      refreshInterval,
      useDefault,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent width={480}>
        <DialogHeader>
          <div>
            <DialogTitle>고객 정보 연동</DialogTitle>
            <DialogDescription>{sectionName} 섹션 API 설정</DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Endpoint */}
          <Input
            label="엔드포인트"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="https://api.example.com/customer"
            size="sm"
          />

          {/* Method + Refresh Interval */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Select
                label="메서드"
                options={[{ id: 'GET', label: 'GET' }, { id: 'POST', label: 'POST' }]}
                value={method}
                onChange={(val) => setMethod(val as 'GET' | 'POST')}
                size="sm"
              />
            </div>
            <div className="flex-1">
              <Input
                variant="quantity"
                label="자동 새로고침 (분)"
                value={refreshInterval}
                onChange={(value: number) => setRefreshInterval(Math.max(1, value))}
                min={1}
                size="sm"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6">
            <Checkbox
              label="자동 새로고침 사용"
              checked={isAutoRefresh}
              onCheckedChange={(checked) => setIsAutoRefresh(!!checked)}
            />
            <Checkbox
              label="기본값 사용"
              checked={useDefault}
              onCheckedChange={(checked) => setUseDefault(!!checked)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button buttonStyle="secondary" size="sm" onClick={onClose}>
            취소
          </Button>
          <Button buttonStyle="primary" size="sm" onClick={handleSave} leadIcon={<Icon iconType={['device', 'save']} size={14} />}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiSettingsModal;
