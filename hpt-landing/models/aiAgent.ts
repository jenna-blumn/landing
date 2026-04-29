export const enum UserType {
  "B" = "B", // 봇
  "C" = "C", // 고객
  "H" = "H", // 상담사
}

export const enum AI_ROLE {
  SYSTEM = "system",
  ASSISTANT = "assistant",
  USER = "user",
}

export const enum AI_MESSAGE_TYPE {
  MESSAGE = "message",
  USE_TOOL = "useTool",
  TOOL_RESULT = "toolResult",
  THOUGHT = "thought",
  REQUEST = "request",
  RESPONSE = "response",
  SESSION_START = "session_start",
  SESSION_END = "session_end",
}

export interface AIAgentMessage {
  roomid: string;
  user_type: UserType; // 'C', 'B', 'H' 로 추정
  contents_type: "ai_agent";
  msg: string | llmUseTool | llmToolResult;
  role: AI_ROLE; // system - 시스템, assistant - LLM AGENT 응답, user - 고객입력
  request_id: string;
  seq: number;
  message_type: AI_MESSAGE_TYPE;
}

export interface llmUseTool {
  id: string; // "interior_tool_6922bbdd036a0ad61789e733"
  name: string; // "interior_tool_6922bbdd036a0ad61789e733"
  toolName: string; // "날씨조회 API"
  arguments: Record<string, any>; // {reason: "사용자가 대화 종료를 요청했습니다."}
}

export interface llmToolResult {
  name: string; // interior_tool_6922bbdd036a0ad61789e733;
  toolName: string; // "날씨조회 API"
  response: Record<string, any>; // { status: "success", data: { city: "undefined", condition: "천둥번개", temperature: "-2°C", humidity: "85%", windSpeed: "20m/s", timestamp: "2025-12-15T12:42:34.569Z" }}
}

export interface AIAgentEvent {
  requestId: string;
  seq: number;
  role: AI_ROLE; // system - 시스템, assistant - LLM AGENT 응답, user - 고객입력
  content: string | llmUseTool | llmToolResult;
  messageType: AI_MESSAGE_TYPE;
}

export interface AIAgentEventChunk {
  requestId: string;
  eventList: AIAgentEvent[];
}

export interface AIAgentSession {
  activation: boolean;
}

export interface AiAgentResponse {
  aiSession: AIAgentSession;
  eventChunk: AIAgentEventChunk[];
}
