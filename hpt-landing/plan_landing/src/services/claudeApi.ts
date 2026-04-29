interface GenerateReplyParams {
  originalMessages: Array<{ sender: string; text: string; time: string }>;
  threadMessages: Array<{ senderName: string; text: string }>;
  customerName: string;
  originalQuery?: string;
}

interface ClaudeApiResponse {
  content: Array<{ type: string; text: string }>;
}

const CONNECTION_ERROR_MESSAGE =
  'AI 어시스턴트에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';

async function callClaudeText(
  model: string,
  systemPrompt: string,
  userContent: string,
  maxTokens = 1024,
): Promise<string> {
  try {
    const response = await fetch('/api/anthropic/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }],
      }),
    });

    if (!response.ok) {
      console.error(`Claude API Error: ${response.status}`, await response.text());
      return CONNECTION_ERROR_MESSAGE;
    }

    const data: ClaudeApiResponse = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Network error calling Claude:', error);
    return CONNECTION_ERROR_MESSAGE;
  }
}

function buildPrompt(params: GenerateReplyParams): string {
  let prompt = `## 고객 대화 맥락\n고객명: ${params.customerName}\n`;
  if (params.originalQuery) {
    prompt += `문의 주제: ${params.originalQuery}\n`;
  }

  prompt += '\n### 고객과의 원본 대화:\n';
  params.originalMessages.forEach((m) => {
    prompt += `[${m.sender === 'customer' ? '고객' : '상담사'}] ${m.text}\n`;
  });

  prompt += '\n### 내부 스레드 상담 내용:\n';
  params.threadMessages.forEach((m) => {
    prompt += `[${m.senderName}] ${m.text}\n`;
  });

  prompt += '\n위 맥락을 바탕으로, 고객에게 보낼 전문적이고 친절한 답변을 생성해주세요.';
  return prompt;
}

/* ── 스레드 내 AI 자동 응답 ── */

export interface ThreadAutoReplyParams {
  originalMessages: Array<{ sender: string; text: string; time: string }>;
  threadMessages: Array<{ senderName: string; text: string; type?: string }>;
  customerName: string;
  originalQuery?: string;
  latestUserMessage: string;
}

function buildThreadAutoReplyPrompt(params: ThreadAutoReplyParams): string {
  let prompt = `## 상담 컨텍스트\n고객명: ${params.customerName}\n`;
  if (params.originalQuery) {
    prompt += `문의 주제: ${params.originalQuery}\n`;
  }

  prompt += '\n### 고객과의 원본 대화:\n';
  params.originalMessages.forEach((m) => {
    prompt += `[${m.sender === 'customer' ? '고객' : '상담사'}] ${m.text}\n`;
  });

  if (params.threadMessages.length > 0) {
    prompt += '\n### 스레드 대화 이력:\n';
    params.threadMessages.forEach((m) => {
      if (m.type !== 'system') {
        prompt += `[${m.senderName}] ${m.text}\n`;
      }
    });
  }

  prompt += `\n### 상담사의 최신 질문/메시지:\n${params.latestUserMessage}\n`;
  prompt += '\n위 맥락을 기반으로 상담사에게 도움이 되는 답변을 해주세요.';
  return prompt;
}

export async function generateThreadAutoReply(params: ThreadAutoReplyParams): Promise<string> {
  return callClaudeText(
    'claude-sonnet-4-6',
    '당신은 컨택센터 내부 스레드에서 상담사를 돕는 AI 어시스턴트입니다. 상담사가 고객 문의를 처리할 수 있도록 전문적인 조언, 답변 초안, 정보를 제공하세요. 간결하고 실용적으로 한국어로 답변하세요.',
    buildThreadAutoReplyPrompt(params),
  );
}

/* ── 고객 답변 생성 ── */

export async function generateCustomerReply(params: GenerateReplyParams): Promise<string> {
  return callClaudeText(
    'claude-sonnet-4-6',
    '당신은 고객센터 상담사를 돕는 AI 어시스턴트입니다. 스레드 대화의 맥락을 분석하여 고객에게 보낼 최적의 답변을 생성해주세요. 한국어로 답변하세요.',
    buildPrompt(params),
  );
}

/* ── 음성 응대 지시 기반 답변 생성 ── */

export type VoiceCommandType = 'customer_message' | 'customer_memo' | 'consultation_note';

export interface VoiceInstructionResult {
  type: VoiceCommandType | null;
  content: string;
  subject?: string;
}

export interface VoiceInstructionParams {
  sttText: string;
  targetLanguage: string;
  activeChannel?: 'chat' | 'sms' | 'email';
}

const VOICE_INSTRUCTION_BASE_PROMPT = `당신은 고객센터 상담사를 돕는 AI 어시스턴트입니다. 상담사의 음성 지시를 분석하여 의도를 분류하고 적절한 내용을 생성합니다.

## 의도 분류 규칙
1. "고객 메모", "메모에 적어", "메모 작성", "고객 정보 기록" 등 고객 메모 작성 의도가 명확한 경우 → type: "customer_memo"
2. "상담 메모", "상담 노트", "노트에 적어", "특이사항 기록", "상담 기록" 등 상담 메모 작성 의도가 명확한 경우 → type: "consultation_note"
3. 고객에게 보낼 메시지 생성 의도가 명확한 경우 → type: "customer_message"
4. 의도가 불분명하거나, 두 가지 이상의 의도가 혼재된 경우 → type: "ambiguous"

## "ambiguous" 판단 기준
- 메모 작성인지 고객 응대 메시지인지 구분이 안 되는 경우
- 고객 메모인지 상담 메모인지 구분이 안 되는 경우
- 단순히 "적어줘", "기록해줘" 등 대상이 불명확한 경우
- 여러 의도가 섞여 있는 경우 (예: "고객한테 안내하고 메모도 남겨줘")

## 생성 규칙
- customer_message: 1~3문장, 정중한 비즈니스 메시지. 마크다운/이모지 금지. 핵심만 전달.
- customer_memo: 사실 기반 간결 정리. 경어체 불필요. 핵심 정보만 기록.
- consultation_note: 사실 기반 간결 정리. 경어체 불필요. 상담 관련 핵심 사항만 기록.
- ambiguous: 핵심 내용을 간결하게 정리. 상담사가 용도를 선택할 수 있도록 중립적으로 작성.

## 출력 형식 (반드시 JSON만 출력)
{"type": "customer_message" | "customer_memo" | "consultation_note" | "ambiguous", "content": "생성된 내용"}`;

function buildVoiceInstructionSystemPrompt(activeChannel?: string): string {
  let prompt = VOICE_INSTRUCTION_BASE_PROMPT;

  if (activeChannel === 'sms') {
    prompt += `\n\n## 채널 제약: SMS
- customer_message 생성 시: 90바이트(한글 약 30자) 이내로 작성
- 인사말 최소화, 핵심만 전달`;
  } else if (activeChannel === 'email') {
    prompt += `\n\n## 채널 제약: 이메일
- customer_message 생성 시: "subject" 필드를 추가하세요 (30자 이내 이메일 제목)
- "content"는 이메일 본문 (3~5문장, 비즈니스 격식체)
- 출력 형식: {"type":"customer_message","subject":"제목","content":"본문"}`;
  }

  return prompt;
}

function buildVoiceInstructionPrompt(params: VoiceInstructionParams): string {
  const langMap: Record<string, string> = {
    'ko-KR': '한국어',
    'en-US': '영어',
    'ja-JP': '일본어',
    'zh-CN': '중국어',
  };
  const lang = langMap[params.targetLanguage] || '한국어';

  let prompt = `상담사 음성 지시: "${params.sttText}"\n\n`;
  prompt += `위 지시의 의도를 분류하고, ${lang}로 내용을 생성하여 JSON 형식으로 출력해주세요.`;

  return prompt;
}

/* ── 말풍선 → 할일 AI 생성 ── */

export interface TaskAIRequest {
  messages: Array<{ sender: string; text: string; time: string }>;
  selectedMessageText: string;
}

export interface TaskAIResponse {
  type: 'sms' | 'callback' | 'followup';
  title: string;
  description: string;
  scheduledDate: string | null;
}

const TASK_AI_SYSTEM_PROMPT = `당신은 컨택센터 상담사의 할일 생성을 돕는 AI 어시스턴트입니다.
대화 컨텍스트를 분석하여 상담사가 수행해야 할 할일(task)을 JSON으로 생성합니다.

## 할일 종류 판단 기준
- "sms": 고객에게 문자/메시지/SMS/안내문자 발송을 약속한 경우
- "callback": 고객에게 전화/연락/콜백/다시 전화를 약속한 경우
- "followup": 위 두 가지에 해당하지 않는 포괄적인 후속 조치 (확인 후 안내, 처리 후 연락 등)

## 날짜 추출 규칙
- 명시적 날짜/시간이 언급된 경우: ISO 형식으로 추출 (YYYY-MM-DD 또는 YYYY-MM-DDTHH:mm)
- 상대 날짜는 "오늘 날짜"를 기준으로 정확히 계산:
  - "오늘" → 오늘 날짜
  - "내일" → 오늘 + 1일
  - "모레" / "내일모레" → 오늘 + 2일
  - "글피" → 오늘 + 3일
  - "다음주 월요일" → 다음 주 월요일 날짜
  - "이번 주 금요일" → 이번 주 금요일 날짜
- 시간이 언급된 경우 YYYY-MM-DDTHH:mm 형식 사용 (예: "오후 7시" → T19:00)
- 날짜 언급이 없으면: null

## 출력 형식 (반드시 JSON만 출력)
{
  "type": "sms" | "callback" | "followup",
  "title": "50자 이내 간결한 할일 제목",
  "description": "200자 이내 할일 상세 내용",
  "scheduledDate": "YYYY-MM-DD" | "YYYY-MM-DDTHH:mm" | null
}`;

function buildTaskAIPrompt(params: TaskAIRequest, todayDate: string): string {
  let prompt = `## 오늘 날짜: ${todayDate}\n\n`;
  prompt += '## 대화 컨텍스트:\n';
  params.messages.forEach((m) => {
    prompt += `[${m.sender === 'customer' ? '고객' : '상담사'}] (${m.time}) ${m.text}\n`;
  });
  prompt += `\n## 선택된 말풍선 (할일 생성 대상):\n"${params.selectedMessageText}"\n`;
  prompt += '\n위 대화에서 선택된 말풍선을 기반으로 할일을 JSON 형식으로 생성해주세요.';
  return prompt;
}

export async function generateTaskFromContext(
  params: TaskAIRequest,
  signal?: AbortSignal,
): Promise<TaskAIResponse> {
  const todayDate = new Date().toISOString().split('T')[0];

  const response = await fetch('/api/anthropic/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: TASK_AI_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildTaskAIPrompt(params, todayDate),
        },
      ],
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Claude API Error: ${response.status}`);
  }

  const data: ClaudeApiResponse = await response.json();
  const text = data.content[0].text;

  // JSON 파싱 (코드블록 래핑 제거)
  const jsonStr = text.replace(/```json?\s*/g, '').replace(/```\s*/g, '').trim();
  const parsed = JSON.parse(jsonStr);

  // 타입 검증
  const validTypes = ['sms', 'callback', 'followup'] as const;
  const type = validTypes.includes(parsed.type) ? parsed.type : 'followup';

  return {
    type,
    title: String(parsed.title || '').slice(0, 50),
    description: String(parsed.description || '').slice(0, 200),
    scheduledDate: parsed.scheduledDate || null,
  };
}

export async function generateVoiceInstructionReply(params: VoiceInstructionParams): Promise<VoiceInstructionResult> {
  const rawText = await callClaudeText(
    'claude-haiku-4-5-20251001',
    buildVoiceInstructionSystemPrompt(params.activeChannel),
    buildVoiceInstructionPrompt(params),
    256,
  );

  try {
    // 코드블록 제거 후, 첫 번째 JSON 객체만 추출 (설명 텍스트 제거)
    const cleaned = rawText.replace(/```json?\s*/g, '').replace(/```\s*/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) return { type: null, content: cleaned };

    const parsed = JSON.parse(jsonMatch[0]);
    const validTypes: VoiceCommandType[] = ['customer_message', 'customer_memo', 'consultation_note'];
    const type = validTypes.includes(parsed.type) ? parsed.type : null;
    return {
      type,
      content: String(parsed.content || rawText),
      subject: parsed.subject ? String(parsed.subject) : undefined,
    };
  } catch {
    return { type: null, content: rawText };
  }
}
