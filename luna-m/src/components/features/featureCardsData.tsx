import { MessageSquare, MessageSquareMore, Coins, Zap, Headphones, FileText, BarChart3, Shield, Truck } from "lucide-react";
import { ReactNode } from "react";
import {
  BizmsgVisual,
  SmsVisual,
  CostVisual,
  AutoVisual,
  ConsultingVisual,
  TemplateVisual,
  StatsVisual,
  InfraVisual,
  DeliveryVisual,
} from "./FeatureCardVisuals";

export interface FeatureCard {
  id: string;
  icon: React.ElementType;
  iconBg: string;
  title: string;
  subtitle?: string;
  description: string;
  visual: ReactNode;
  tags?: string[];
  badge?: string;
  dark: boolean;
  compact?: boolean;
  visualFull?: boolean;
  bgColor?: string;
  height?: number;
}

const bizmsgTags = ["알림톡", "친구톡", "문자", "이미지형", "와이드형", "캐러셀형", "커머스형"];

export const featureCards: FeatureCard[] = [
  {
    id: "bizmsg",
    icon: MessageSquare,
    iconBg: "bg-zinc-900",
    title: "발송 대상 확대로 높은 도달률 제공",
    description: "카카오톡 채널 친구이거나 마케팅 수신 동의 고객에게 광고성 메시지 발송\n메시지의 투명성과 안정성 강화로 고객 신뢰 기반의 메시지 제공",
    visual: <BizmsgVisual />,
    tags: bizmsgTags,
    dark: false,
    height: 420,
  },
  {
    id: "sms",
    icon: MessageSquareMore,
    iconBg: "bg-zinc-700",
    title: "미수신 걱정 없는 문자 연동",
    description: "카카오톡 미수신 시 문자 자동 대체 발송\n중요 메시지 누락 방지와 도달률 저하 없이 안정적인 발송 운영",
    visual: <SmsVisual />,
    dark: false,
    height: 420,
  },
  {
    id: "cost",
    icon: Coins,
    iconBg: "bg-zinc-700",
    title: "쉽고 빠른 메시지 발송 자동화",
    description: "카카오 메시지(알림톡·브랜드메시지)와 문자 메시지 대량 발송 자동화 제공\n\n세그먼트 설정을 통한 타겟 발송\n 엑셀 업로드 기반 대량 발송으로 효율적인 메시지 운영\n\n주문·결제·배송·회원 이벤트 등 트리거 기반 자동 발송\n쇼핑몰·CRM·ERP 등 시스템 연동을 위한 API 제공",
    visual: <CostVisual />,
    tags: ["세그먼트 설정", "타겟 발송", "엑셀 업로드", "대량 발송", "효율적인 메시지 운영"],
    dark: true,
    height: 420,
  },
];

export const gridCards: FeatureCard[] = [
  {
    id: "auto",
    icon: Zap,
    iconBg: "bg-zinc-800",
    title: "다양한 발송 방식을 지원",
    description: "웹 발송부터 API 연동, 에이전트 발송까지 모든 발송 방식을 유연하게 지원",
    visual: <AutoVisual />,
    dark: false,
    compact: true,
    height: 320,
  },
  {
    id: "consulting",
    icon: Headphones,
    iconBg: "bg-zinc-800",
    title: "발송 운영까지 함께하는 컨설팅",
    description: "단순한 솔루션 제공을 넘어 메시지 발송 운영 대행 및 컨설팅으로 안정적인 운영을 지원",
    visual: <ConsultingVisual />,
    dark: false,
    compact: true,
    height: 320,
  },
  {
    id: "extras-template",
    icon: FileText,
    iconBg: "bg-zinc-900",
    title: "누구나 쉬운 템플릿 관리",
    description: "변수 치환 지원(이름, 주문번호, 금액 등)\n비개발자도 쉽게 등록·수정·관리 가능",
    visual: <TemplateVisual />,
    dark: true,
    compact: true,
    bgColor: "#2563eb",
    height: 320,
  },
  {
    id: "extras-stats",
    icon: BarChart3,
    iconBg: "bg-zinc-700",
    title: "발송부터 성과까지 통계 데이터 제공",
    description: "기간·메시지 유형별 통계 리포트 제공\n실패 사유·발송 로그까지 한 번에 확인",
    visual: <StatsVisual />,
    dark: false,
    compact: true,
    height: 320,
  },
  {
    id: "extras-infra",
    icon: Shield,
    iconBg: "bg-zinc-600",
    title: "카카오 공식, 안정적인 인프라",
    description: "카카오 공식 정책 100% 준수\n대량 발송에도 안정적인 인프라 제공",
    visual: <InfraVisual />,
    dark: false,
    compact: true,
    bgColor: "#fef08a",
    height: 320,
  },
  {
    id: "extras-delivery",
    icon: Truck,
    iconBg: "bg-zinc-500",
    title: "배송조회",
    description: "추가 비용 없는 실시간 배송조회 서비스 제공",
    visual: <DeliveryVisual />,
    dark: false,
    compact: true,
    badge: "FREE",
    height: 320,
  },
];
