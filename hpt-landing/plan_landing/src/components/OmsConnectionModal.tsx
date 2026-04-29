import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Select, Icon, Input } from '@blumnai-studio/blumnai-design-system';
import { OmsConnectionConfig, OmsInfo, SYNC_INTERVAL_OPTIONS } from '../types/sideTab';

interface OmsConnectionModalProps {
  oms: OmsInfo;
  existingConfig?: OmsConnectionConfig | null;
  onSave: (config: OmsConnectionConfig) => void;
  onCancel: () => void;
}

const OmsConnectionModal: React.FC<OmsConnectionModalProps> = ({
  oms,
  existingConfig,
  onSave,
  onCancel,
}) => {
  const [apiKey, setApiKey] = useState(existingConfig?.apiKey || '');
  const [apiSecret, setApiSecret] = useState(existingConfig?.apiSecret || '');
  const [storeId, setStoreId] = useState(existingConfig?.storeId || '');
  const [apiEndpoint, setApiEndpoint] = useState(existingConfig?.apiEndpoint || oms.defaultEndpoint);
  const [syncInterval, setSyncInterval] = useState(existingConfig?.syncInterval || 15);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsTesting(false);
    setTestResult('success');

    setTimeout(() => setTestResult(null), 3000);
  };

  const handleSave = () => {
    const finalApiKey = apiKey || `mock-api-key-${Date.now()}`;
    const finalStoreId = storeId || `store-${Math.random().toString(36).substring(7)}`;

    const config: OmsConnectionConfig = {
      apiKey: finalApiKey,
      apiSecret: apiSecret || '',
      storeId: finalStoreId,
      apiEndpoint: apiEndpoint || oms.defaultEndpoint,
      syncInterval,
    };

    onSave(config);
  };

  const isFormValid = apiKey.trim().length > 0 || storeId.trim().length > 0;

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent width={512}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Icon iconType={['business', 'links']} size={20} color="informative" />
            </div>
            <div>
              <DialogTitle>{oms.name} 연결 설정</DialogTitle>
              <DialogDescription>OMS와의 연동을 위한 API 설정을 입력하세요</DialogDescription>
            </div>
          </div>
        </DialogHeader>

          <div className="space-y-5">
            <Input
              label="API 키"
              required
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API 키를 입력하세요"
              size="sm"
            />

            <Input
              label="API Secret"
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="API Secret을 입력하세요 (선택사항)"
              size="sm"
            />

            <Input
              label="스토어 ID"
              required
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              placeholder="스토어 ID를 입력하세요"
              size="sm"
            />

            <Input
              label="API 엔드포인트"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="https://api.example.com/v1"
              size="sm"
            />

            <Select
              label="동기화 간격 (분)"
              options={SYNC_INTERVAL_OPTIONS.map((o) => ({ id: String(o.value), label: o.label }))}
              value={String(syncInterval)}
              onChange={(val) => setSyncInterval(Number(val))}
              size="sm"
            />
          </div>

          {testResult === 'success' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                연결 테스트가 성공했습니다.
              </p>
            </div>
          )}

          {testResult === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                연결 테스트가 실패했습니다. 설정을 확인해주세요.
              </p>
            </div>
          )}

        <DialogFooter>
          <Button
            buttonStyle="secondary"
            size="sm"
            onClick={handleTestConnection}
            disabled={isTesting}
            loading={isTesting}
          >
            {isTesting ? '테스트 중...' : '연결 테스트'}
          </Button>
          <Button buttonStyle="secondary" size="sm" onClick={onCancel}>
            취소
          </Button>
          <Button buttonStyle="primary" size="sm" onClick={handleSave} disabled={!isFormValid}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OmsConnectionModal;
