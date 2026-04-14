import React, { useState, useEffect } from 'react';
import { X, Bell, Save, Eye, User, Check, Users } from 'lucide-react';
import { Task, NoticeReadStatus, CreateNoticeInput } from '../types/task';
import { useTaskContext } from '../context/TaskContext';
import TargetAudienceSelector from './TargetAudienceSelector';

interface NoticeEditorProps {
  onClose: () => void;
  onSave: (task: Task) => void;
  onTitleChange?: (title: string) => void;
  existingNotice?: Task | null;
  authorName?: string;
}

const NoticeEditor: React.FC<NoticeEditorProps> = ({
  onClose,
  onSave,
  onTitleChange,
  existingNotice,
  authorName = '매니저',
}) => {
  const { api } = useTaskContext();

  const [title, setTitle] = useState(existingNotice?.title || '');
  const [content, setContent] = useState(existingNotice?.noticeContent || '');
  const [requireReadConfirmation, setRequireReadConfirmation] = useState(
    existingNotice?.requireReadConfirmation ?? true
  );
  const [targetAudience, setTargetAudience] = useState<NoticeReadStatus[]>(
    existingNotice?.targetAudience || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const isEditMode = !!existingNotice;
  const readStats = existingNotice ? api.getNoticeReadStats(existingNotice) : null;

  useEffect(() => {
    onTitleChange?.(title);
  }, [title, onTitleChange]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    if (targetAudience.length === 0) {
      alert('읽기 대상 상담사를 선택해주세요.');
      return;
    }

    setIsSaving(true);

    try {
      let savedTask: Task | null = null;

      if (isEditMode && existingNotice) {
        savedTask = await api.updateNotice(existingNotice.id, {
          title,
          noticeContent: content,
          targetAudience,
          requireReadConfirmation,
        });
      } else {
        const input: CreateNoticeInput = {
          title,
          noticeContent: content,
          author: authorName,
          targetAudience,
          requireReadConfirmation,
        };
        savedTask = await api.createNotice(input);
      }

      if (savedTask) {
        onSave(savedTask);
      }
    } catch (error) {
      console.error('Failed to save notice:', error);
      alert('공지 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const sortedAudience = [...targetAudience].sort((a, b) => {
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return a.consultantName.localeCompare(b.consultantName, 'ko');
  });

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-[49px] flex items-center justify-between px-4 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center">
            <Bell size={14} className="text-violet-600" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">
              {isEditMode ? '공지 수정' : '새 공지 작성'}
            </span>
            {isEditMode && readStats && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">
                  {readStats.read}/{readStats.total}명 읽음
                </span>
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${(readStats.read / readStats.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded-lg transition-colors ${
              showPreview ? 'bg-violet-100 text-violet-600' : 'hover:bg-gray-100 text-gray-500'
            }`}
            title="미리보기"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-violet-50 rounded-lg p-6 mb-4">
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {title || '(제목 없음)'}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {authorName}
                </span>
                <span>|</span>
                <span>{new Date().toLocaleDateString('ko-KR')}</span>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              {content ? (
                content.split('\n').map((line, idx) => (
                  <p key={idx} className="text-gray-700 leading-relaxed mb-2">
                    {line || <br />}
                  </p>
                ))
              ) : (
                <p className="text-gray-400 italic">(내용 없음)</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                공지 제목
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="공지 제목을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                공지 내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="공지 내용을 입력하세요"
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent text-sm resize-none"
              />
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <button
                type="button"
                onClick={() => setRequireReadConfirmation(!requireReadConfirmation)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  requireReadConfirmation ? 'bg-violet-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    requireReadConfirmation ? 'translate-x-5' : ''
                  }`}
                />
              </button>
              <div>
                <span className="text-sm font-medium text-gray-700">읽기 확인 필요</span>
                <p className="text-xs text-gray-500">상담사가 공지를 읽었는지 확인합니다</p>
              </div>
            </div>

            <TargetAudienceSelector
              selectedAudience={targetAudience}
              onAudienceChange={setTargetAudience}
            />

            {isEditMode && targetAudience.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users size={16} />
                    읽음 현황
                  </h3>
                  {readStats && (
                    <span className="text-xs text-gray-500">
                      {readStats.read}/{readStats.total}명 완료
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sortedAudience.map(status => (
                    <span
                      key={status.consultantId}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        status.isRead
                          ? 'bg-green-100 text-green-700 ring-1 ring-green-300'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <User size={12} />
                      {status.consultantName}
                      {status.isRead && <Check size={10} className="text-green-600" />}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {targetAudience.length > 0 && (
            <span>{targetAudience.length}명의 상담사에게 전달됩니다</span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !content.trim() || targetAudience.length === 0}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2 transition-colors ${
              isSaving || !title.trim() || !content.trim() || targetAudience.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-700'
            }`}
          >
            <Save size={16} />
            {isSaving ? '저장 중...' : isEditMode ? '수정하기' : '공지 저장'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeEditor;
