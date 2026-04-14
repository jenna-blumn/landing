import { useState, useEffect, useMemo, useCallback } from 'react';
import type { SmsSenderNumber, SmsInputMode, SmsType } from '../types';
import { getSenderNumbers } from '../api/smsApi';
import { calculateByteLength, getSmsType, getMaxBytes, isOverByteLimit, formatByteInfo, getSmsTypeByCharCount, formatCharCountInfo, isOverCharLimit } from '../utils/byteCounter';

interface UseSmsComposerProps {
  brandId?: string;
}

export function useSmsComposer({ brandId }: UseSmsComposerProps = {}) {
  const [text, setText] = useState('');
  const [inputMode, setInputMode] = useState<SmsInputMode>('template');
  const [senderNumbers, setSenderNumbers] = useState<SmsSenderNumber[]>([]);
  const [selectedSenderId, setSelectedSenderId] = useState<string | null>(null);

  // 발신번호 목록 로드
  useEffect(() => {
    getSenderNumbers().then((numbers) => {
      setSenderNumbers(numbers);
      // 브랜드에 연결된 발신번호 우선, 없으면 기본 발신번호
      const brandSender = brandId
        ? numbers.find((n) => n.brandId === brandId)
        : null;
      const defaultSender = numbers.find((n) => n.isDefault);
      setSelectedSenderId(brandSender?.id || defaultSender?.id || numbers[0]?.id || null);
    });
  }, [brandId]);

  // 바이트 계산
  const byteLength = useMemo(() => calculateByteLength(text), [text]);
  const smsType: SmsType = useMemo(() => getSmsType(byteLength), [byteLength]);
  const maxBytes = useMemo(() => getMaxBytes(smsType), [smsType]);
  const isOver = useMemo(() => isOverByteLimit(byteLength), [byteLength]);
  const byteInfo = useMemo(() => formatByteInfo(byteLength), [byteLength]);

  // 글자 수 기반 계산 (SMS: 80글자 초과 시 LMS)
  const charCount = useMemo(() => text.length, [text]);
  const smsTypeByChar: SmsType = useMemo(() => getSmsTypeByCharCount(charCount), [charCount]);
  const charCountInfo = useMemo(() => formatCharCountInfo(text), [text]);
  const isOverCharLimitValue = useMemo(() => isOverCharLimit(charCount), [charCount]);

  // 선택된 발신번호 객체
  const selectedSenderNumber = useMemo(
    () => senderNumbers.find((n) => n.id === selectedSenderId) || null,
    [senderNumbers, selectedSenderId]
  );

  // 초기화
  const reset = useCallback(() => {
    setText('');
    setInputMode('template');
  }, []);

  return {
    text,
    setText,
    inputMode,
    setInputMode,
    byteLength,
    smsType,
    maxBytes,
    isOverLimit: isOver,
    byteInfo,
    // 글자 수 기반
    charCount,
    smsTypeByChar,
    charCountInfo,
    isOverCharLimit: isOverCharLimitValue,
    senderNumbers,
    selectedSenderId,
    setSelectedSenderId,
    selectedSenderNumber,
    reset,
  };
}
