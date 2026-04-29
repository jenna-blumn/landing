import React, { useState, useEffect, useRef } from 'react';
import { Button, Icon, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Input, Textarea } from '@blumnai-studio/blumnai-design-system';
import { BlockStatus } from '../../types';
import { getBlockReasonChips, saveBlockReasonChips } from '../../api/blockApi';

interface BlockCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBlock: (reason: string) => void;
  onUnblock: () => void;
  isManagerMode?: boolean;
  blockStatus: BlockStatus | null;
  customerName?: string;
}

const MAX_CHIPS = 10;
const MAX_CHIP_LENGTH = 20;

const BlockCustomerDialog: React.FC<BlockCustomerDialogProps> = ({
  isOpen,
  onClose,
  onBlock,
  onUnblock,
  isManagerMode = false,
  blockStatus,
  customerName = '고객',
}) => {
  const [blockReason, setBlockReason] = useState('');
  const [chips, setChips] = useState<string[]>([]);
  const [isEditingChips, setIsEditingChips] = useState(false);
  const [newChipText, setNewChipText] = useState('');
  const [showUnblockConfirm, setShowUnblockConfirm] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const newChipInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setChips(getBlockReasonChips());
      setBlockReason('');
      setIsEditingChips(false);
      setNewChipText('');
      setShowUnblockConfirm(false);
      setShowBlockConfirm(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isEditingChips) {
      newChipInputRef.current?.focus();
    }
  }, [isEditingChips]);

  const isBlocked = !!blockStatus;

  const handleChipClick = (chip: string) => {
    if (isEditingChips) return;
    const currentText = blockReason.trim();
    if (currentText) {
      setBlockReason(currentText + ', ' + chip);
    } else {
      setBlockReason(chip);
    }
    textareaRef.current?.focus();
  };

  const handleAddChip = () => {
    const trimmed = newChipText.trim();
    if (!trimmed) return;
    if (chips.includes(trimmed)) return;
    if (chips.length >= MAX_CHIPS) return;

    const updated = [...chips, trimmed];
    setChips(updated);
    saveBlockReasonChips(updated);
    setNewChipText('');
    newChipInputRef.current?.focus();
  };

  const handleDeleteChip = (index: number) => {
    const updated = chips.filter((_, i) => i !== index);
    setChips(updated);
    saveBlockReasonChips(updated);
  };

  const handleNewChipKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddChip();
    } else if (e.key === 'Escape') {
      setIsEditingChips(false);
      setNewChipText('');
    }
  };

  const handleBlockClick = () => {
    if (!blockReason.trim()) return;
    setShowBlockConfirm(true);
  };

  const handleConfirmBlock = () => {
    onBlock(blockReason.trim());
    setShowBlockConfirm(false);
    onClose();
  };

  const handleUnblockClick = () => {
    setShowUnblockConfirm(true);
  };

  const handleConfirmUnblock = () => {
    onUnblock();
    setShowUnblockConfirm(false);
    onClose();
  };

  const handleCancelEdit = () => {
    setIsEditingChips(false);
    setNewChipText('');
  };

  const handleCompleteEdit = () => {
    setIsEditingChips(false);
    setNewChipText('');
  };

  // 차단 해제 확인 뷰
  if (isBlocked && showUnblockConfirm) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent width={400}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Icon iconType={['system', 'shield-check']} size={20} color="success" />
              </div>
              <div>
                <DialogTitle>차단 해제 확인</DialogTitle>
                <DialogDescription>{customerName}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            이 고객의 차단을 해제하시겠습니까? 해제 후 고객은 다시 정상적으로 상담을 받을 수 있습니다.
          </p>
          <DialogFooter>
            <Button buttonStyle="ghost" size="sm" onClick={() => setShowUnblockConfirm(false)}>
              취소
            </Button>
            <Button buttonStyle="primary" size="sm" onClick={handleConfirmUnblock}>
              차단 해제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // 차단 확인 뷰
  if (!isBlocked && showBlockConfirm) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent width={400}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Icon iconType={['system', 'alert']} size={20} color="destructive" />
              </div>
              <div>
                <DialogTitle>차단 확인</DialogTitle>
                <DialogDescription>{customerName}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">차단 사유</p>
            <p className="text-sm text-gray-800">{blockReason}</p>
          </div>
          <p className="text-sm text-red-600">
            차단된 고객은 상담 인입 시 차단 상태로 표시됩니다. 계속하시겠습니까?
          </p>
          <DialogFooter>
            <Button buttonStyle="ghost" size="sm" onClick={() => setShowBlockConfirm(false)}>
              취소
            </Button>
            <Button buttonStyle="destructive" size="sm" onClick={handleConfirmBlock}>
              차단하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // 이미 차단된 고객 — 차단 상태 상세 보기
  if (isBlocked) {
    const blockedDate = blockStatus.blockedAt
      ? new Date(blockStatus.blockedAt).toLocaleString('ko-KR')
      : '-';

    return (
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent width={400}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Icon iconType={['system', 'shield-cross']} size={20} color="destructive" />
              </div>
              <div>
                <DialogTitle>차단된 고객</DialogTitle>
                <DialogDescription>{customerName}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-500 mb-1">차단 사유</p>
              <p className="text-sm text-red-800">{blockStatus.reason}</p>
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <div>
                <span className="text-gray-400">차단 일시: </span>
                {blockedDate}
              </div>
              <div>
                <span className="text-gray-400">처리자: </span>
                {blockStatus.blockedBy}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button buttonStyle="ghost" size="sm" onClick={onClose}>
              닫기
            </Button>
            <Button buttonStyle="primary" size="sm" onClick={handleUnblockClick}>
              차단 해제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // 차단하기 다이얼로그 (기본 뷰)
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent width={400} className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Icon iconType={['system', 'shield-cross']} size={20} color="destructive" />
            </div>
            <div>
              <DialogTitle>고객 차단</DialogTitle>
              <DialogDescription>{customerName}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* 빠른 선택 칩 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 font-medium">빠른 선택</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {chips.map((chip, index) => (
              <Button
                key={index}
                onClick={() => !isEditingChips && handleChipClick(chip)}
                buttonStyle="soft"
                colorOverride={isEditingChips ? 'gray' : 'red'}
                size="2xs"
                shape="pill"
                className={isEditingChips ? 'cursor-default' : ''}
              >
                {chip}
                {isEditingChips && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChip(index);
                    }}
                    variant="iconOnly"
                    buttonStyle="ghost"
                    colorOverride="red"
                    size="2xs"
                    shape="pill"
                    leadIcon={<Icon iconType={['system', 'close']} size={10} color="destructive" />}
                    className="ml-1"
                  />
                )}
              </Button>
            ))}
            {chips.length === 0 && (
              <p className="text-xs text-gray-400">등록된 사유가 없습니다.</p>
            )}
          </div>

          {/* 매니저 칩 추가 입력 */}
          {isEditingChips && chips.length < MAX_CHIPS && (
            <div className="flex items-center gap-2 mt-2">
              <Input
                ref={newChipInputRef}
                value={newChipText}
                onChange={(e) => setNewChipText(e.target.value.slice(0, MAX_CHIP_LENGTH))}
                onKeyDown={handleNewChipKeyDown}
                placeholder="새 사유 추가..."
                maxLength={MAX_CHIP_LENGTH}
                size="sm"
                className="flex-1"
              />
              <Button
                onClick={handleAddChip}
                disabled={!newChipText.trim() || chips.includes(newChipText.trim())}
                variant="iconOnly"
                buttonStyle="ghost"
                colorOverride="blue"
                size="2xs"
                leadIcon={<Icon iconType={['system', 'add']} size={14} />}
              />
            </div>
          )}
          {isEditingChips && (
            <p className="text-xs text-gray-400 mt-1">
              {chips.length}/{MAX_CHIPS}개 · 최대 {MAX_CHIP_LENGTH}자
            </p>
          )}
        </div>

        {/* 차단 사유 텍스트 영역 */}
        <div>
          <Textarea
            ref={textareaRef}
            label="차단 사유"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="차단 사유를 입력하세요..."
            minRows={3}
            resize="none"
            size="sm"
          />
        </div>

        <DialogFooter>
          {isManagerMode && !isEditingChips && (
            <Button buttonStyle="ghost" size="sm" onClick={() => setIsEditingChips(true)}>
              편집
            </Button>
          )}

          {isEditingChips ? (
            <>
              <Button buttonStyle="ghost" size="sm" onClick={handleCancelEdit}>
                취소
              </Button>
              <Button buttonStyle="primary" size="sm" onClick={handleCompleteEdit}>
                완료
              </Button>
            </>
          ) : (
            <>
              <Button buttonStyle="ghost" size="sm" onClick={onClose}>
                취소
              </Button>
              <Button buttonStyle="destructive" size="sm" onClick={handleBlockClick} disabled={!blockReason.trim()}>
                차단하기
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockCustomerDialog;
