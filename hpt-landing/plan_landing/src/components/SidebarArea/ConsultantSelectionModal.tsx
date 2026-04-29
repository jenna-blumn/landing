import React from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogScrollArea, RadioGroup, Avatar, Badge, Icon } from '@blumnai-studio/blumnai-design-system';

interface Consultant {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'away';
  currentLoad: number;
}

interface ConsultantSelectionModalProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onAssign: (consultantId: string, consultantName: string) => void;
}

const statusColorMap: Record<string, 'green' | 'orange' | 'neutral'> = {
  available: 'green',
  busy: 'orange',
  away: 'neutral',
};

const ConsultantSelectionModal: React.FC<ConsultantSelectionModalProps> = ({
  isOpen,
  selectedCount,
  onClose,
  onAssign,
}) => {
  const [selectedConsultant, setSelectedConsultant] = React.useState<string | null>(null);

  // Reset selected consultant when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedConsultant(null);
    }
  }, [isOpen]);

  const mockConsultants: Consultant[] = [
    { id: '1', name: '김상담', status: 'available', currentLoad: 3 },
    { id: '2', name: '이상담', status: 'available', currentLoad: 5 },
    { id: '3', name: '박상담', status: 'busy', currentLoad: 8 },
    { id: '4', name: '최상담', status: 'available', currentLoad: 2 },
    { id: '5', name: '정상담', status: 'away', currentLoad: 0 },
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return '대기중';
      case 'busy':
        return '응대중';
      case 'away':
        return '자리비움';
      default:
        return '알 수 없음';
    }
  };

  const handleAssign = () => {
    if (selectedConsultant) {
      const consultant = mockConsultants.find(c => c.id === selectedConsultant);
      if (consultant) {
        onAssign(consultant.id, consultant.name);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent width={500} className="flex flex-col max-h-[600px]">
        <DialogHeader className="bg-gray-800">
          <DialogTitle className="text-white flex items-center gap-2">
            상담사 선택
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <span className="font-bold text-blue-600">{selectedCount}개</span>의 상담을 배정할 상담사를 선택하세요.
        </DialogDescription>

        <DialogScrollArea maxHeight={400}>
          <div className="p-4">
            <RadioGroup value={selectedConsultant || ''} onValueChange={setSelectedConsultant}>
              <div className="space-y-2">
                {mockConsultants.map((consultant) => (
                  <div
                    key={consultant.id}
                    onClick={() => setSelectedConsultant(consultant.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedConsultant === consultant.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar variant="initials" initials={consultant.name[0]} size="sm" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{consultant.name}</span>
                            <div className="flex items-center gap-1">
                              <Badge variant="dot" color={statusColorMap[consultant.status]} />
                              <span className="text-xs text-gray-600">{getStatusText(consultant.status)}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            현재 {consultant.currentLoad}건 응대중
                          </p>
                        </div>
                      </div>
                      {selectedConsultant === consultant.id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Icon iconType={['system', 'check']} size={16} color="white-default" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </DialogScrollArea>

        <DialogFooter>
          <Button buttonStyle="secondary" size="sm" onClick={onClose}>
            취소
          </Button>
          <Button buttonStyle="primary" size="sm" onClick={handleAssign} disabled={!selectedConsultant}>
            배정하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultantSelectionModal;
