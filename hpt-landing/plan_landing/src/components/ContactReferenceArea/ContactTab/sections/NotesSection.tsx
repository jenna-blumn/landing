import React, { useState, useEffect } from 'react';
import { Icon, Button, Card, CardContent, ScrollArea, Textarea } from '@blumnai-studio/blumnai-design-system';
import { ConsultationNote } from '../../../../features/contactTab/types';
import { generateNumericId } from '../../../../utils/idUtils';
import { VOICE_MEMO_EVENT, type VoiceMemoEventDetail } from '../../../../features/channelComposer/types';

interface NotesSectionProps {
  consultationNotes: ConsultationNote[];
  setConsultationNotes: React.Dispatch<React.SetStateAction<ConsultationNote[]>>;
}

const NotesSection: React.FC<NotesSectionProps> = ({ consultationNotes, setConsultationNotes }) => {
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<VoiceMemoEventDetail>).detail;
      if (detail.type === 'consultation_note') {
        setNewNote(detail.content);
      }
    };
    window.addEventListener(VOICE_MEMO_EVENT, handler);
    return () => window.removeEventListener(VOICE_MEMO_EVENT, handler);
  }, []);

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: ConsultationNote = {
        id: generateNumericId(),
        content: newNote.trim(),
        author: '현재 상담사',
        createdAt: new Date().toLocaleString('ko-KR'),
      };
      setConsultationNotes((prev) => [note, ...prev]);
      setNewNote('');
    }
  };

  const handleStartEdit = (note: ConsultationNote) => {
    setEditingNoteId(note.id);
    setEditingNoteContent(note.content);
  };

  const handleSaveEdit = () => {
    if (editingNoteId && editingNoteContent.trim()) {
      setConsultationNotes((prev) =>
        prev.map((note) =>
          note.id === editingNoteId ? { ...note, content: editingNoteContent.trim() } : note
        )
      );
      setEditingNoteId(null);
      setEditingNoteContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingNoteContent('');
  };

  const handleDeleteNote = (noteId: number) => {
    setConsultationNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddNote();
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
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="상담 관련 메모 및 특이사항을 작성하세요..."
        onKeyDown={handleKeyPress}
        maxLength={500}
        showCount
        minRows={2}
        resize="none"
        size="sm"
        caption="Ctrl+Enter로 저장"
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-800">메모 목록</h4>
          <span className="text-sm text-gray-500">{consultationNotes.length}개</span>
        </div>

        <div className="space-y-3">
          <ScrollArea maxHeight={256}>
          {consultationNotes.map((note) => (
              <Card key={note.id} variant="outline" className="mb-3">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon iconType={['user', 'user']} size={16} color="default-muted" className="flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-gray-700">{note.author}</span>
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{note.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {editingNoteId !== note.id && (
                        <Button
                          onClick={() => handleStartEdit(note)}
                          variant="iconOnly"
                          buttonStyle="ghost"
                          size="xs"
                          title="메모 수정"
                          leadIcon={<Icon iconType={['design', 'edit']} size={14} />}
                        />
                      )}
                      <Button
                        onClick={() => handleDeleteNote(note.id)}
                        variant="iconOnly"
                        buttonStyle="ghost"
                        size="xs"
                        title="메모 삭제"
                        className="flex-shrink-0"
                        leadIcon={<Icon iconType={['system', 'delete-bin']} size={14} />}
                      />
                    </div>
                  </div>

                  {editingNoteId === note.id ? (
                    <div className="pl-6">
                      <Textarea
                        value={editingNoteContent}
                        onChange={(e) => setEditingNoteContent(e.target.value)}
                        onKeyDown={handleEditKeyPress}
                        maxLength={500}
                        showCount
                        minRows={3}
                        resize="none"
                        size="sm"
                        autoFocus
                        caption="Ctrl+Enter로 저장 · Esc로 취소"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          onClick={handleSaveEdit}
                          disabled={!editingNoteContent.trim()}
                          buttonStyle="primary"
                          size="xs"
                          leadIcon={<Icon iconType={['device', 'save']} size={12} />}
                          shortcut="Ctrl+Enter"
                        >
                          저장
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          buttonStyle="secondary"
                          size="xs"
                          leadIcon={<Icon iconType={['system', 'close']} size={12} />}
                          shortcut="Esc"
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-800 whitespace-pre-wrap pl-6">{note.content}</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
