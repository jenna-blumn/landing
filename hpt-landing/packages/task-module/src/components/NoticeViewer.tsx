import React from 'react';
import { X, Bell, Calendar, User, CheckCircle, Users, Check, TrendingUp } from 'lucide-react';
import { Task } from '../types/task';
import { useAuth } from '../context/AuthContext';
import { useTaskContext } from '../context/TaskContext';

interface NoticeViewerProps {
  task: Task;
  onClose: () => void;
  onTaskUpdated?: () => void;
  onEdit?: () => void;
}

const NoticeViewer: React.FC<NoticeViewerProps> = ({
  task,
  onClose,
  onTaskUpdated,
  onEdit
}) => {
  const { isManager } = useAuth();
  const { api } = useTaskContext();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleMarkAsRead = async () => {
    if (!task.isRead) {
      await api.toggleNoticeRead(task.id);
      onTaskUpdated?.();
    }
  };

  const readStats = api.getNoticeReadStats(task);
  const sortedAudience = task.targetAudience
    ? [...task.targetAudience].sort((a, b) => {
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      return a.consultantName.localeCompare(b.consultantName, 'ko');
    })
    : [];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="h-[49px] flex items-center justify-between px-4 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center">
            <Bell size={14} className="text-violet-600" />
          </div>
          <span className="text-lg font-bold text-gray-900">공지사항</span>
        </div>
        <div className="flex items-center gap-2">
          {isManager && onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors border border-violet-100"
            >
              수정
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Main Content Area - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Notice Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-8 border-r border-gray-100">
          <div className="max-w-3xl">
            {/* Notice Subject Area */}
            <div className="bg-violet-50 rounded-2xl p-8 mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{task.title}</h1>
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full">
                  <User size={14} className="text-violet-500" />
                  <span className="font-semibold text-gray-700">{task.author || '관리자'}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full">
                  <Calendar size={14} className="text-violet-500" />
                  <span>{formatDate(task.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Body Text */}
            <div className="prose prose-sm max-w-none px-2">
              {task.noticeContent ? (
                task.noticeContent.split('\n').map((line, idx) => (
                  <p key={idx} className="text-gray-700 text-base leading-relaxed mb-4">
                    {line || <br />}
                  </p>
                ))
              ) : (
                <p className="text-gray-400 italic text-lg">공지 내용이 없습니다.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Read Status (Sticky/Fixed width) */}
        <div className="w-80 bg-gray-50/50 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-violet-600" />
                <h3 className="text-base font-bold text-gray-900">읽음 현황</h3>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-2xl font-black text-violet-600">
                    {Math.round((readStats.read / readStats.total) * 100)}%
                  </span>
                  <div className="text-sm">
                    <span className="font-bold text-gray-900">{readStats.read}</span>
                    <span className="text-gray-400"> / {readStats.total}명</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(readStats.read / readStats.total) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 text-center font-medium uppercase tracking-wider mt-2">
                  Current Completion Rate
                </p>
              </div>
            </div>

            {/* User List - Manager Only */}
            {isManager && sortedAudience.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2 px-1">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Consultant Status</h4>
                  <Users size={14} className="text-gray-400" />
                </div>
                <div className="flex flex-col gap-2">
                  {sortedAudience.map(status => (
                    <div
                      key={status.consultantId}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all border ${status.isRead
                          ? 'bg-white border-green-100 shadow-sm'
                          : 'bg-white/40 border-gray-100 opacity-60'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status.isRead ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
                          }`}>
                          <User size={14} />
                        </div>
                        <span className={`text-sm font-semibold ${status.isRead ? 'text-gray-900' : 'text-gray-400'}`}>
                          {status.consultantName}
                        </span>
                      </div>
                      {status.isRead ? (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                          <Check size={12} className="text-white" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-dashed border-gray-200 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : !isManager && (
              <div className="mt-8 p-4 bg-violet-50 rounded-xl border border-violet-100">
                <p className="text-xs text-violet-700 leading-relaxed font-medium text-center">
                  현재 동료 상담사들의 <b>{readStats.read}명</b>이 <br />이 공지를 확인했습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-8 py-5 border-t border-gray-200 bg-white flex-shrink-0 z-10 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        {task.isRead ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-green-600 font-bold bg-green-50 px-6 py-3 rounded-2xl flex-1 justify-center border border-green-100">
              <CheckCircle size={22} />
              <span>이 공지사항을 확인했습니다</span>
            </div>
          </div>
        ) : (
          <button
            onClick={handleMarkAsRead}
            className="w-full py-4 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
          >
            <CheckCircle size={22} />
            중요 공지 읽음 확인
          </button>
        )}
      </div>
    </div>
  );
};

export default NoticeViewer;
