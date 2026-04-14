import React from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Icon } from '@blumnai-studio/blumnai-design-system';

interface AssignmentConfirmationModalProps {
  isOpen: boolean;
  assignedCount: number;
  consultantName: string;
  onClose: () => void;
  onStartConsultation: () => void;
}

const AssignmentConfirmationModal: React.FC<AssignmentConfirmationModalProps> = ({
  isOpen,
  assignedCount,
  consultantName,
  onClose,
  onStartConsultation,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent width={384}>
        <DialogHeader className="bg-emerald-500">
          <DialogTitle className="text-white flex items-center gap-2">
            <Icon iconType={['system', 'checkbox-circle']} size={20} />
            배정 완료
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="px-6 py-8">
          <p className="text-center text-gray-700 text-base">
            <span className="font-bold text-emerald-600">{assignedCount}개</span>의 상담이{' '}
            <span className="font-bold text-gray-900">{consultantName}</span>에게 배정되었습니다.
          </p>
        </DialogDescription>

        <DialogFooter>
          <Button
            buttonStyle="secondary"
            size="sm"
            onClick={onClose}
          >
            확인
          </Button>
          <Button
            buttonStyle="primary"
            size="sm"
            onClick={onStartConsultation}
          >
            상담 시작
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentConfirmationModal;
