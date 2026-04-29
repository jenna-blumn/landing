import React, { useState, useEffect } from 'react';
import { Button, Icon, ScrollArea, Textarea } from '@blumnai-studio/blumnai-design-system';
import { Memo } from '../../types';
import { VOICE_MEMO_EVENT, type VoiceMemoEventDetail } from '../../../channelComposer/types';

interface CustomerMemoSectionProps {
  memos: Memo[];
  onAddMemo: (content: string) => void;
  onEditMemo: (memoId: number, newContent: string) => void;
  onDeleteMemo: (memoId: number) => void;
}

const CustomerMemoSection: React.FC<CustomerMemoSectionProps> = ({
  memos,
  onAddMemo,
  onEditMemo,
  onDeleteMemo,
}) => {
  const [newMemo, setNewMemo] = useState('');
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<VoiceMemoEventDetail>).detail;
      if (detail.type === 'customer_memo') {
        setNewMemo(detail.content);
      }
    };
    window.addEventListener(VOICE_MEMO_EVENT, handler);
    return () => window.removeEventListener(VOICE_MEMO_EVENT, handler);
  }, []);

  const handleAddMemo = () => {
    if (newMemo.trim()) {
      onAddMemo(newMemo);
      setNewMemo('');
    }
  };

  const handleStartEdit = (memo: Memo) => {
    setEditingMemoId(memo.id);
    setEditingContent(memo.content);
  };

  const handleSaveEdit = () => {
    if (editingMemoId && editingContent.trim()) {
      onEditMemo(editingMemoId, editingContent.trim());
      setEditingMemoId(null);
      setEditingContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMemoId(null);
    setEditingContent('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddMemo();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={newMemo}
        onChange={(e) => setNewMemo(e.target.value)}
        placeholder="새 고객 메모를 작성하세요"
        onKeyDown={handleKeyPress}
        maxLength={500}
        showCount
        caption="Ctrl+Enter로 저장"
        resize="none"
        minRows={2}
        size="sm"
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-800">메모 목록</h4>
          <span className="text-sm text-gray-500">{memos.length}개</span>
        </div>

        <div className="space-y-3">
          <ScrollArea maxHeight={256}>
          {memos.map((memo) => (
            <div key={memo.id} className="border rounded-lg p-3 bg-white shadow-sm mb-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon iconType={['user', 'user']} size={16} color="default-muted" className="flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-gray-700">
                      {memo.author}
                    </span>
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                      {memo.createdAt}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {editingMemoId !== memo.id && (
                    <Button
                      variant="iconOnly"
                      buttonStyle="ghost"
                      size="2xs"
                      onClick={() => handleStartEdit(memo)}
                      title="메모 수정"
                      leadIcon={<Icon iconType={['design', 'edit']} size={14} />}
                    />
                  )}
                  <Button
                    variant="iconOnly"
                    buttonStyle="ghost"
                    size="2xs"
                    onClick={() => onDeleteMemo(memo.id)}
                    title="메모 삭제"
                    leadIcon={<Icon iconType={['system', 'delete-bin']} size={14} />}
                  />
                </div>
              </div>

              {editingMemoId === memo.id ? (
                <div className="pl-6">
                  <Textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    onKeyDown={handleEditKeyPress}
                    maxLength={500}
                    showCount
                    caption="Ctrl+Enter 저장 · Esc 취소"
                    resize="none"
                    minRows={3}
                    size="sm"
                    autoFocus
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      buttonStyle="primary"
                      size="xs"
                      onClick={handleSaveEdit}
                      disabled={!editingContent.trim()}
                      leadIcon={<Icon iconType={['device', 'save']} size={12} />}
                      shortcut="Ctrl+Enter"
                    >
                      저장
                    </Button>
                    <Button
                      buttonStyle="secondary"
                      size="xs"
                      onClick={handleCancelEdit}
                      leadIcon={<Icon iconType={['system', 'close']} size={12} />}
                      shortcut="Esc"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-800 whitespace-pre-wrap pl-6">
                  {memo.content}
                </div>
              )}
            </div>
          ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default CustomerMemoSection;
