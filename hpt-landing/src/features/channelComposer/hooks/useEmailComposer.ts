import { useState, useEffect, useMemo, useCallback } from 'react';
import type { EmailRecipient, EmailSignature } from '../types';
import { getSignatures } from '../api/emailApi';

interface UseEmailComposerProps {
  customerEmail?: string;
  customerName?: string;
}

export function useEmailComposer({ customerEmail, customerName }: UseEmailComposerProps = {}) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [toRecipients, setToRecipients] = useState<EmailRecipient[]>([]);
  const [ccRecipients, setCcRecipients] = useState<EmailRecipient[]>([]);
  const [bccRecipients, setBccRecipients] = useState<EmailRecipient[]>([]);
  const [signatures, setSignatures] = useState<EmailSignature[]>([]);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string | null>(null);

  // 서명 목록 로드
  useEffect(() => {
    getSignatures().then((sigs) => {
      setSignatures(sigs);
      const defaultSig = sigs.find((s) => s.isDefault);
      if (defaultSig) {
        setSelectedSignatureId(defaultSig.id);
      }
    });
  }, []);

  // 고객 이메일 자동 추가 (To)
  useEffect(() => {
    if (customerEmail && toRecipients.length === 0) {
      setToRecipients([
        { email: customerEmail, name: customerName, type: 'to' },
      ]);
    }
  }, [customerEmail, customerName]); // eslint-disable-line react-hooks/exhaustive-deps

  // 수신자 추가
  const addRecipient = useCallback((recipient: EmailRecipient) => {
    if (recipient.type === 'to') {
      setToRecipients((prev) => {
        if (prev.some((r) => r.email === recipient.email)) return prev;
        return [...prev, recipient];
      });
    } else if (recipient.type === 'cc') {
      setCcRecipients((prev) => {
        if (prev.some((r) => r.email === recipient.email)) return prev;
        return [...prev, recipient];
      });
    } else if (recipient.type === 'bcc') {
      setBccRecipients((prev) => {
        if (prev.some((r) => r.email === recipient.email)) return prev;
        return [...prev, recipient];
      });
    }
  }, []);

  // 수신자 제거
  const removeRecipient = useCallback((email: string, type: 'to' | 'cc' | 'bcc') => {
    if (type === 'to') {
      setToRecipients((prev) => prev.filter((r) => r.email !== email));
    } else if (type === 'cc') {
      setCcRecipients((prev) => prev.filter((r) => r.email !== email));
    } else {
      setBccRecipients((prev) => prev.filter((r) => r.email !== email));
    }
  }, []);

  // 선택된 서명 객체
  const selectedSignature = useMemo(
    () => signatures.find((s) => s.id === selectedSignatureId) || null,
    [signatures, selectedSignatureId]
  );

  // 서명 포함된 본문
  const bodyWithSignature = useMemo(() => {
    if (!selectedSignature) return body;
    return body + selectedSignature.content;
  }, [body, selectedSignature]);

  // 유효성 검사
  const isValid = useMemo(
    () =>
      toRecipients.length > 0 &&
      subject.trim() !== '' &&
      body.trim() !== '',
    [toRecipients, subject, body]
  );

  // 초기화
  const reset = useCallback(() => {
    setSubject('');
    setBody('');
    // To 수신자는 고객 이메일로 복원
    if (customerEmail) {
      setToRecipients([{ email: customerEmail, name: customerName, type: 'to' }]);
    } else {
      setToRecipients([]);
    }
    setCcRecipients([]);
    setBccRecipients([]);
  }, [customerEmail, customerName]);

  return {
    subject,
    setSubject,
    body,
    setBody,
    toRecipients,
    ccRecipients,
    bccRecipients,
    signatures,
    selectedSignatureId,
    setSelectedSignatureId,
    selectedSignature,
    bodyWithSignature,
    addRecipient,
    removeRecipient,
    isValid,
    reset,
  };
}
