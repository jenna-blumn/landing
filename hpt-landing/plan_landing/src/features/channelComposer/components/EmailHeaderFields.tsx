import React, { useState } from 'react';
import { Button, Input } from '@blumnai-studio/blumnai-design-system';
import type { EmailRecipient } from '../types';

interface EmailHeaderFieldsProps {
  emailState: {
    subject: string;
    setSubject: (subject: string) => void;
    toRecipients: EmailRecipient[];
    ccRecipients: EmailRecipient[];
    addRecipient: (recipient: EmailRecipient) => void;
    removeRecipient: (email: string, type: 'to' | 'cc') => void;
  };
}

const EmailHeaderFields: React.FC<EmailHeaderFieldsProps> = ({ emailState }) => {
  const [showCc, setShowCc] = useState(emailState.ccRecipients.length > 0);
  const [toInput, setToInput] = useState('');
  const [ccInput, setCcInput] = useState('');

  return (
    <div className="px-3 py-2 space-y-2 flex-shrink-0">
      {/* 받는 사람 */}
      <div className="flex items-start gap-2">
        <span className="text-[11px] text-gray-500 w-14 flex-shrink-0 pt-1.5">받는 사람</span>
        <Input
          variant="tags"
          tags={emailState.toRecipients.map((r) => r.name ? `${r.name} <${r.email}>` : r.email)}
          value={toInput}
          onInputChange={setToInput}
          onTagAdd={(tag: string) => {
            const email = tag.trim();
            if (email && email.includes('@')) {
              emailState.addRecipient({ email, type: 'to' });
              setToInput('');
            } else {
              setToInput(tag);
            }
          }}
          onTagRemove={(tag: string) => {
            const recipient = emailState.toRecipients.find(
              (r) => tag === (r.name ? `${r.name} <${r.email}>` : r.email)
            );
            if (recipient) emailState.removeRecipient(recipient.email, 'to');
          }}
          onBlur={() => {
            const email = toInput.trim();
            if (email && email.includes('@')) {
              emailState.addRecipient({ email, type: 'to' });
              setToInput('');
            }
          }}
          placeholder={emailState.toRecipients.length === 0 ? '이메일 입력 후 Enter' : ''}
          size="sm"
          allowDuplicates={false}
          className="flex-1"
        />
        {!showCc && (
          <Button
            buttonStyle="ghost"
            colorOverride="blue"
            size="2xs"
            onClick={() => setShowCc(true)}
            className="flex-shrink-0 mt-0.5"
          >
            CC
          </Button>
        )}
      </div>

      {/* 참조 (CC) */}
      {showCc && (
        <div className="flex items-start gap-2">
          <span className="text-[11px] text-gray-500 w-14 flex-shrink-0 pt-1.5">참조</span>
          <Input
            variant="tags"
            tags={emailState.ccRecipients.map((r) => r.name ? `${r.name} <${r.email}>` : r.email)}
            value={ccInput}
            onInputChange={setCcInput}
            onTagAdd={(tag: string) => {
              const email = tag.trim();
              if (email && email.includes('@')) {
                emailState.addRecipient({ email, type: 'cc' });
                setCcInput('');
              } else {
                setCcInput(tag);
              }
            }}
            onTagRemove={(tag: string) => {
              const recipient = emailState.ccRecipients.find(
                (r) => tag === (r.name ? `${r.name} <${r.email}>` : r.email)
              );
              if (recipient) emailState.removeRecipient(recipient.email, 'cc');
            }}
            onBlur={() => {
              const email = ccInput.trim();
              if (email && email.includes('@')) {
                emailState.addRecipient({ email, type: 'cc' });
                setCcInput('');
              }
            }}
            placeholder="이메일 입력 후 Enter"
            size="sm"
            allowDuplicates={false}
            className="flex-1"
          />
        </div>
      )}

      {/* 제목 */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-500 w-14 flex-shrink-0">제목</span>
        <Input
          value={emailState.subject}
          onChange={(e) => emailState.setSubject(e.target.value)}
          placeholder="이메일 제목을 입력하세요"
          size="sm"
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default EmailHeaderFields;
