import React from 'react';
import { Icon, Button } from '@blumnai-studio/blumnai-design-system';

interface ContactActionModalProps {
  selectedCount: number;
  isManagerMode: boolean;
  isAutoAssignment: boolean;
  selectedQueueType: 'ai-response' | 'queue-waiting' | null;
  onClose: () => void;
  onCategoryChange: () => void;
  onConsultantChangeRequest: () => void;
  onConsultantChange: () => void;
  onEndConsultation: () => void;
  onPendingEnd: () => void;
  onAssignToSelf?: () => void;
  onSetFlag?: () => void;
  onBlockCustomer?: () => void;
}

const ContactActionModal: React.FC<ContactActionModalProps> = ({
  selectedCount,
  isManagerMode,
  isAutoAssignment,
  selectedQueueType,
  onClose,
  onCategoryChange,
  onConsultantChangeRequest,
  onConsultantChange,
  onEndConsultation,
  onPendingEnd,
  onAssignToSelf,
  onSetFlag,
  onBlockCustomer,
}) => {
  const isUnassignedQueue = selectedQueueType === 'queue-waiting';
  const isManualMode = !isAutoAssignment;

  return (
    <div style={{ minWidth: '160px' }}>
      <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
        <span className="text-xs font-medium text-emerald-600">
          {selectedCount}건 선택됨
        </span>
        <Button
          variant="iconOnly"
          buttonStyle="ghost"
          size="2xs"
          onClick={onClose}
          leadIcon={<Icon iconType={['system', 'close']} size={14} color="default-muted" />}
        />
      </div>

      <div className="py-1 flex flex-col items-start">
        {isUnassignedQueue && isManualMode ? (
          <>
            <Button
              buttonStyle="ghost"
              size="xs"
              onClick={onAssignToSelf}
              leadIcon={<Icon iconType={['user', 'user-add']} size={14} color="#34d399" />}
            >
              나에게 배정
            </Button>

            {isManagerMode && (
              <Button
                buttonStyle="ghost"
                size="xs"
                onClick={onConsultantChange}
                leadIcon={<Icon iconType={['user', 'user-settings']} size={14} color="default-muted" />}
              >
                상담사에게 배정
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              buttonStyle="ghost"
              size="xs"
              onClick={onCategoryChange}
              leadIcon={<Icon iconType={['system', 'more']} size={14} color="default-muted" />}
            >
              상담 분류 변경
            </Button>

            {!isManagerMode ? (
              <Button
                buttonStyle="ghost"
                size="xs"
                onClick={onConsultantChangeRequest}
                leadIcon={<Icon iconType={['user', 'user']} size={14} color="default-muted" />}
              >
                상담사 변경 요청
              </Button>
            ) : (
              <>
                <Button
                  buttonStyle="ghost"
                  size="xs"
                  onClick={onConsultantChange}
                  leadIcon={<Icon iconType={['user', 'user-settings']} size={14} color="default-muted" />}
                >
                  상담사 변경
                </Button>

                <Button
                  buttonStyle="ghost"
                  size="xs"
                  onClick={onSetFlag}
                  leadIcon={<Icon iconType={['business', 'flag']} size={14} color="default-muted" />}
                >
                  플래그 설정
                </Button>

                <Button
                  buttonStyle="destructive"
                  size="xs"
                  onClick={onBlockCustomer}
                  leadIcon={<Icon iconType={['system', 'forbid']} size={14} color="destructive" />}
                >
                  고객 차단
                </Button>
              </>
            )}

            <Button
              buttonStyle="ghost"
              size="xs"
              onClick={onEndConsultation}
              leadIcon={<Icon iconType={['system', 'close-circle']} size={14} color="default-muted" />}
            >
              상담 종료
            </Button>

            <Button
              buttonStyle="ghost"
              size="xs"
              onClick={onPendingEnd}
              leadIcon={<Icon iconType={['system', 'time']} size={14} color="default-muted" />}
            >
              종료 보류
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactActionModal;
