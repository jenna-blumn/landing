import { useState, useRef, useEffect, useCallback } from 'react';
import { generateVoiceInstructionReply, type VoiceCommandType } from '../../../services/claudeApi';
import { VOICE_MEMO_EVENT, type VoiceMemoEventDetail } from '../types';

export type VoiceLanguage = 'ko-KR' | 'en-US' | 'ja-JP' | 'zh-CN';

export interface UseVoiceInstructionReturn {
  isListening: boolean;
  isGenerating: boolean;
  targetLanguage: VoiceLanguage;
  sttText: string;
  showFallbackModal: boolean;
  pendingContent: string;
  setTargetLanguage: (lang: VoiceLanguage) => void;
  startListening: () => void;
  stopListening: () => void;
  finishListeningAndGenerate: () => void;
  toggleListening: () => void;
  resolveFallback: (choice: VoiceCommandType) => void;
  cancelFallback: () => void;
}

function dispatchVoiceMemo(type: 'customer_memo' | 'consultation_note', content: string) {
  const detail: VoiceMemoEventDetail = { type, content };
  window.dispatchEvent(new CustomEvent(VOICE_MEMO_EVENT, { detail }));
}

export interface VoiceInstructionOptions {
  activeChannel?: 'chat' | 'sms' | 'email';
  onEmailSubjectGenerated?: (subject: string) => void;
}

export function useVoiceInstruction(
  onGenerated: (text: string) => void,
  options?: VoiceInstructionOptions,
): UseVoiceInstructionReturn {
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sttText, setSttText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState<VoiceLanguage>('ko-KR');
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [pendingContent, setPendingContent] = useState('');

  const recognitionRef = useRef<any>(null);
  const onGeneratedRef = useRef(onGenerated);
  const optionsRef = useRef(options);
  const targetLanguageRef = useRef(targetLanguage);
  const sttTextRef = useRef(sttText);

  // 최신 값을 ref에 동기화
  onGeneratedRef.current = onGenerated;
  optionsRef.current = options;
  targetLanguageRef.current = targetLanguage;
  sttTextRef.current = sttText;

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      if (currentTranscript) {
        setSttText(currentTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      // recognition.stop() 후 자동 발생 — 상태는 호출부에서 이미 처리하므로 무시
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch { /* noop */ }
      recognitionRef.current = null;
    };
  }, []); // SpeechRecognition은 한 번만 초기화

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && !isGenerating) {
      setSttText('');
      recognitionRef.current.lang = targetLanguageRef.current;

      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (_e) {
        console.error("SpeechRecognition error:", _e);
      }
    }
  }, [isListening, isGenerating]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setSttText('');
    }
  }, [isListening]);

  const finishListeningAndGenerate = useCallback(async () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);

      const currentSttText = sttTextRef.current;
      if (!currentSttText.trim()) {
        return;
      }

      setIsGenerating(true);
      try {
        const result = await generateVoiceInstructionReply({
          sttText: currentSttText,
          targetLanguage: targetLanguageRef.current,
          activeChannel: optionsRef.current?.activeChannel,
        });

        if (result.type === 'customer_message') {
          onGeneratedRef.current(result.content);
          if (result.subject && optionsRef.current?.onEmailSubjectGenerated) {
            optionsRef.current.onEmailSubjectGenerated(result.subject);
          }
        } else if (result.type === 'customer_memo' || result.type === 'consultation_note') {
          dispatchVoiceMemo(result.type, result.content);
        } else {
          // JSON 파싱 실패 — fallback 모달로 사용자에게 선택 요청
          setPendingContent(result.content);
          setShowFallbackModal(true);
        }
      } catch (error) {
        console.error('Failed to generate voice instruction reply:', error);
        onGeneratedRef.current('AI 어시스턴트에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsGenerating(false);
        setSttText('');
      }
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resolveFallback = useCallback((choice: VoiceCommandType) => {
    if (!pendingContent) return;
    if (choice === 'customer_message') {
      onGeneratedRef.current(pendingContent);
    } else {
      dispatchVoiceMemo(choice, pendingContent);
    }
    setPendingContent('');
    setShowFallbackModal(false);
  }, [pendingContent]);

  const cancelFallback = useCallback(() => {
    setPendingContent('');
    setShowFallbackModal(false);
  }, []);

  return {
    isListening,
    isGenerating,
    targetLanguage,
    sttText,
    showFallbackModal,
    pendingContent,
    setTargetLanguage,
    startListening,
    stopListening,
    finishListeningAndGenerate,
    toggleListening,
    resolveFallback,
    cancelFallback,
  };
}
