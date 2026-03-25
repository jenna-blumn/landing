import { MessageSquare, Send, Users, Upload, Zap, Globe, Code, Workflow, UserCog, TrendingUp, FileText, Shield, Server } from "lucide-react";

/* ─────────────────────────────────────────────
   1. BizmsgVisual — Venn diagram (static)
   ───────────────────────────────────────────── */

export const BizmsgVisual = () => (
  <div className="relative w-full h-[320px] flex flex-col items-center justify-center">
    <span className="text-[15px] font-semibold text-zinc-800 mb-4" style={{ letterSpacing: '-0.01em' }}>
      브랜드 메시지 발송 대상
    </span>

    <div className="relative w-[340px] h-[220px]">
      {/* Outer dashed pill */}
      <svg className="absolute pointer-events-none" style={{ left: -1, top: -5, width: 342, height: 230 }}>
        <rect
          x="0.75" y="0.75" width="340.5" height="228.5" rx="114.25"
          fill="none" stroke="rgba(39,39,42,0.25)" strokeWidth="1.5" strokeDasharray="3 3"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="0.8s" repeatCount="indefinite" />
        </rect>
      </svg>

      {/* Left circle */}
      <div
        className="absolute rounded-full flex flex-col items-center justify-center text-center"
        style={{ width: 180, height: 180, top: 20, left: 16, background: 'rgba(191,219,254,0.35)' }}
      >
        <span className="text-[13px] font-semibold text-zinc-700 leading-tight">
          마케팅 수신을<br />동의한 고객
        </span>
        <span className="text-[11px] text-zinc-400 mt-1 leading-tight">
          (카카오톡 수신 동의한 고객)
        </span>
      </div>

      {/* Right circle */}
      <div
        className="absolute rounded-full flex items-center justify-center text-center"
        style={{ width: 180, height: 180, top: 20, right: 16, background: 'rgba(242,255,143,0.7)' }}
      >
        <span className="text-[13px] font-semibold text-zinc-700 leading-tight">
          브랜드의 카카오톡<br />채널 친구
        </span>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   2. SmsVisual — Fallback flow (static)
   ───────────────────────────────────────────── */

export const SmsVisual = () => (
  <div className="relative w-full max-w-[380px] h-[320px] flex flex-col items-center justify-center gap-3">
    {/* Kakao message card */}
    <div
      className="w-full rounded-xl p-4"
      style={{
        background: 'white',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-zinc-500" />
        </div>
        <div className="flex-1">
          <span className="text-[13px] font-semibold text-zinc-800">카카오톡 알림</span>
        </div>
        <span
          className="px-2 py-0.5 text-[13px] font-semibold rounded-full"
          style={{ background: '#fef2f2', color: '#dc2626' }}
        >
          미수신
        </span>
      </div>
      <p className="text-[13px] text-zinc-600 leading-relaxed">[주문완료] 고객님의 주문이 정상 접수되었습니다.</p>
    </div>

    {/* Connection */}
    <div className="relative h-10 w-full flex items-center justify-center">
      <svg width="2" height="40" className="absolute">
        <line x1="1" y1="0" x2="1" y2="40" stroke="#d4d4d8" strokeWidth="1.5" strokeDasharray="3 3">
          <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="0.8s" repeatCount="indefinite" />
        </line>
      </svg>
      <div
        className="relative z-10 px-3 py-1 bg-zinc-100 rounded-full text-[13px] font-semibold text-zinc-600"
        style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04)' }}
      >
        자동 대체 발송
      </div>
    </div>

    {/* SMS fallback card */}
    <div
      className="w-full rounded-xl p-4"
      style={{
        background: 'white',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Send className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex-1">
          <span className="text-[13px] font-semibold text-zinc-800">[문자] 자동발송</span>
        </div>
        <span
          className="px-2 py-0.5 text-[13px] font-semibold rounded-full"
          style={{ background: '#ecfdf5', color: '#059669' }}
        >
          발송완료
        </span>
      </div>
      <p className="text-[13px] text-zinc-600 leading-relaxed">[주문완료] 고객님의 주문이 정상 접수되었습니다.</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   3. CostVisual — Automation dashboard cards (static)
   ───────────────────────────────────────────── */

export const CostVisual = () => (
  <div className="relative w-full max-w-[420px] flex flex-col gap-2.5">
    {/* Segment targeting card */}
    <div
      className="rounded-xl p-4"
      style={{
        background: 'white',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
            <Users className="w-3.5 h-3.5 text-yellow-200" />
          </div>
          <span className="text-[13px] font-semibold text-zinc-800">세그먼트 타겟 발송</span>
        </div>
        <span className="px-2 py-0.5 text-[13px] font-semibold rounded-full" style={{ background: '#ecfdf5', color: '#059669' }}>
          활성
        </span>
      </div>
      <div className="flex gap-1.5">
        {["VIP 고객", "신규 가입", "휴면 회원"].map((seg) => (
          <span
            key={seg}
            className="px-2.5 py-1 text-[13px] font-medium rounded-md"
            style={{ background: '#f4f4f5', color: '#52525b' }}
          >
            {seg}
          </span>
        ))}
      </div>
    </div>

    {/* Bulk upload card */}
    <div
      className="rounded-xl p-4"
      style={{
        background: 'white',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
          <Upload className="w-3.5 h-3.5 text-yellow-200" />
        </div>
        <span className="text-[13px] font-semibold text-zinc-800">엑셀 업로드 대량 발송</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(to right, #3f3f46, #18181b)',
              width: '78%',
            }}
          />
        </div>
        <span className="text-[13px] text-zinc-600 font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
          12,847건
        </span>
      </div>
    </div>

    {/* Trigger card */}
    <div
      className="rounded-xl p-4"
      style={{
        background: 'white',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-yellow-200" />
          </div>
          <span className="text-[13px] font-semibold text-zinc-800">트리거 자동 발송</span>
        </div>
        <div className="flex gap-1">
          {["주문", "결제", "배송"].map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[13px] font-semibold rounded-md"
              style={{
                background: 'linear-gradient(to bottom, #3f3f46, #18181b)',
                color: 'white',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Dashed connector + Avatar group */}
    <div className="relative flex flex-col items-center -mt-1">
      <svg width="332" height="51" viewBox="0 0 332 51" fill="none" className="overflow-visible">
        <path
          d="M0.75 0 V32.25 Q0.75 50.25 18.75 50.25 H313.25 Q331.25 50.25 331.25 32.25 V0"
          stroke="#F2FF8F" strokeWidth="1.5" strokeDasharray="3 3"
          fill="none" strokeLinecap="round"
        />
      </svg>
      <div className="flex items-center -mt-5">
        {[
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces',
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=faces',
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=faces',
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=faces',
        ].map((src, i) => (
          <div
            key={i}
            className="w-9 h-9 rounded-full border-2 border-zinc-900 overflow-hidden"
            style={{
              marginLeft: i > 0 ? -8 : 0,
              zIndex: 4 - i,
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   4. AutoVisual — Triple hub (static)
   ───────────────────────────────────────────── */

const miniCard = {
  background: 'white',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.06)',
};

export const AutoVisual = () => (
  <div className="relative w-full h-full flex flex-col gap-1.5 justify-end pointer-events-none">
    {[
      { icon: Globe, label: "웹 발송", status: "활성" },
      { icon: Code, label: "API 연동", status: "연동됨" },
      { icon: Workflow, label: "에이전트", status: "활성" },
    ].map((item) => (
      <div key={item.label} className="rounded-lg p-2.5" style={miniCard}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center">
              <item.icon className="w-3 h-3 text-yellow-200" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-800">{item.label}</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600">{item.status}</span>
        </div>
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   5. ConsultingVisual — Connected nodes (static)
   ───────────────────────────────────────────── */

export const ConsultingVisual = () => (
  <div className="relative w-full h-full flex flex-col gap-1.5 justify-end pointer-events-none">
    <div className="rounded-lg p-2.5" style={miniCard}>
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center">
          <UserCog className="w-3 h-3 text-yellow-200" />
        </div>
        <span className="text-[11px] font-semibold text-zinc-800">운영 대행</span>
      </div>
      <div className="flex gap-1">
        {["발송 대행", "리포트"].map((t) => (
          <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#f4f4f5', color: '#52525b' }}>{t}</span>
        ))}
      </div>
    </div>
    <div className="rounded-lg p-2.5" style={miniCard}>
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center">
          <TrendingUp className="w-3 h-3 text-yellow-200" />
        </div>
        <span className="text-[11px] font-semibold text-zinc-800">발송 컨설팅</span>
      </div>
      <div className="flex gap-1">
        {["최적화", "성과 분석"].map((t) => (
          <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#f4f4f5', color: '#52525b' }}>{t}</span>
        ))}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   6. TemplateVisual — Variable substitution (static)
   ───────────────────────────────────────────── */

export const TemplateVisual = () => (
  <div className="relative w-full h-full flex flex-col gap-1.5 justify-end pointer-events-none">
    <div className="rounded-lg p-2.5" style={miniCard}>
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center">
          <FileText className="w-3 h-3 text-yellow-200" />
        </div>
        <span className="text-[11px] font-semibold text-zinc-800">알림톡 템플릿</span>
      </div>
      <div className="space-y-1.5 mb-2">
        <div className="flex items-center gap-1">
          <div className="h-[3px] w-6 rounded-full bg-zinc-200" />
          <span className="text-[9px] font-mono font-semibold text-blue-600 bg-blue-50 px-1 rounded">{'{이름}'}</span>
          <div className="h-[3px] w-10 rounded-full bg-zinc-200" />
        </div>
        <div className="flex items-center gap-1">
          <div className="h-[3px] w-10 rounded-full bg-zinc-200" />
          <span className="text-[9px] font-mono font-semibold text-blue-600 bg-blue-50 px-1 rounded">{'{주문번호}'}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-[3px] w-4 rounded-full bg-zinc-200" />
          <span className="text-[9px] font-mono font-semibold text-blue-600 bg-blue-50 px-1 rounded">{'{금액}'}</span>
          <div className="h-[3px] w-6 rounded-full bg-zinc-200" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-emerald-600">등록완료</span>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   6. StatsVisual — Bar chart (static)
   ───────────────────────────────────────────── */

export const StatsVisual = () => {
  const bars = [
    { h: 45, label: "월" },
    { h: 65, label: "화" },
    { h: 55, label: "수" },
    { h: 80, label: "목" },
    { h: 70, label: "금" },
    { h: 40, label: "토" },
    { h: 30, label: "일" },
  ];

  return (
    <div className="relative w-full h-full flex flex-col gap-1.5 justify-end pointer-events-none">
      <div className="rounded-lg p-3" style={miniCard}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-yellow-200" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-800">주간 발송 통계</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600" style={{ fontVariantNumeric: 'tabular-nums' }}>12,847건</span>
        </div>
        <div className="flex items-end justify-between gap-1" style={{ height: 80 }}>
          {bars.map((bar) => (
            <div key={bar.label} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-full rounded-sm"
                style={{ height: bar.h, background: bar.h === 80 ? '#18181b' : '#d4d4d8' }}
              />
              <span className="text-[9px] font-medium text-zinc-400">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   7. InfraVisual — Shield (static)
   ───────────────────────────────────────────── */

export const InfraVisual = () => (
  <div className="relative w-full h-full flex flex-col gap-1.5 justify-end pointer-events-none">
    <div className="rounded-lg p-2.5" style={miniCard}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center">
            <Shield className="w-3 h-3 text-yellow-200" />
          </div>
          <span className="text-[11px] font-semibold text-zinc-800">카카오 공식 정책</span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-600">인증됨</span>
      </div>
    </div>
    <div className="rounded-lg p-2.5" style={miniCard}>
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center">
          <Server className="w-3 h-3 text-yellow-200" />
        </div>
        <span className="text-[11px] font-semibold text-zinc-800">서버 안정성</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: '99.9%' }} />
        </div>
        <span className="text-[10px] font-semibold text-zinc-700" style={{ fontVariantNumeric: 'tabular-nums' }}>99.9%</span>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   8. DeliveryVisual — Route path (static)
   ───────────────────────────────────────────── */

export const DeliveryVisual = () => {
  const trackingCards = [
    { order: "A20250323-001", status: "배송중", step: 2 },
    { order: "A20250322-047", status: "배송완료", step: 3 },
  ];
  const opacities = [1, 0.5];

  return (
    <div className="relative w-full h-full flex flex-col gap-1.5 justify-end pointer-events-none">
      {trackingCards.map((card, idx) => (
        <div key={card.order} className="rounded-lg p-2.5" style={{ ...miniCard, opacity: opacities[idx] }}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center">
                <Zap className="w-3 h-3 text-yellow-200" />
              </div>
              <span className="text-[10px] font-medium text-zinc-500">{card.order}</span>
            </div>
            <span className={`text-[10px] font-semibold ${card.step >= 3 ? 'text-zinc-400' : 'text-emerald-600'}`}>{card.status}</span>
          </div>
          <div className="flex items-center gap-1">
            {["접수", "출고", "배송중", "완료"].map((step, i) => (
              <div key={step} className="flex items-center gap-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${i <= card.step ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
                <span className={`text-[9px] font-medium ${i <= card.step ? 'text-zinc-700' : 'text-zinc-400'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
