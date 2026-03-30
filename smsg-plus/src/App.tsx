/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform, useInView, animate } from 'motion/react';
import statisticsImg from './statistics.png';
import consultingImg from './img_consulting.png';
import partnersImg from './partners.png';
import iso27001Img from './iso27001.png';
import Aurora from './Aurora';
import {
  Users,
  TrendingUp,
  LayoutDashboard,
  Target,
  ArrowRight,
  ArrowDown,
  MousePointer2,
  ShoppingBag,
  ShoppingCart,
  UserPlus,
  Menu,
  X,
} from 'lucide-react';

/* ─── Shared transition presets ─── */
const ease = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* ─── CountUp ─── */
const CountUp = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = React.useState('0');

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setDisplay(v.toFixed(1)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
};

/* ─── Navbar ─── */
const CTA_URL = 'https://mbisolution.recatch.cc/workflows/ggrsfqcawm';

const Navbar = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 32));

  return (
    <nav className="fixed top-0 w-full z-50">
      {/* Progressive blur layers (Twitter-style) */}
      <div className="absolute inset-0 -z-10">
        {[0, 2, 4, 6, 8].map((blur, i) => (
          <div
            key={i}
            className="absolute inset-0 pointer-events-none"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: 'linear-gradient(to top, transparent 0%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 100%)',
              opacity: 1 - i * 0.025,
              zIndex: i,
            }}
          />
        ))}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: scrolled
              ? 'rgba(255,255,255,0.92)'
              : 'linear-gradient(to top, transparent 0%, rgba(255,255,255,0.85) 100%)',
            zIndex: 5,
          }}
        />
      </div>
      <div
        className="transition-all duration-300"
        style={{ borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent' }}
      >
        <div className="flex justify-between items-center h-16 px-6 max-w-[1280px] mx-auto">
          <a href="#" className="flex items-center">
            <span className="font-semibold text-lg text-on-surface font-manrope" style={{ letterSpacing: '-0.02em' }}>
              스마트메시지 <span className="text-primary">플러스</span>
            </span>
          </a>

          <div className="hidden md:flex items-center">
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold px-4 py-[7px] rounded-[8px] bg-primary-container text-on-primary shadow-sm hover:opacity-90 transition-all duration-150 active:scale-[0.97]">
              도입 문의
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-on-surface/[0.04] transition-colors"
            aria-label="메뉴 열기"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl"
            style={{
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            <div className="px-6 py-5">
              <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="block text-center text-[13px] font-semibold px-4 py-2.5 rounded-[8px] bg-primary-container text-on-primary" onClick={() => setMenuOpen(false)}>
                도입 문의
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

/* ─── Hero ─── */
const Hero = () => (
  <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32 px-6">
    <div className="max-w-[1280px] mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold mb-8 tracking-wide"
      >
        카카오 커넥트 공식 파트너
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
        className="heading-1 text-on-surface mb-6"
      >
        고객 맞춤형 올인원 마케팅 CRM,<br />답은 <span className="text-primary">스마트메시지 플러스</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease }}
        className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        데이터 분석부터 개인화 메시지 발송까지,
        <br className="hidden md:block" /> 복잡한 마케팅 여정을 하나의 플랫폼에서 완성하세요.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45, ease }}
        className="flex flex-col sm:flex-row justify-center gap-3"
      >
        <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="btn-hero-primary bg-on-surface text-surface shadow-xl hover:shadow-2xl hover:opacity-90 transition-all">
          서비스 신청하기 <ArrowRight size={18} />
        </a>
      </motion.div>
    </div>

    {/* Aurora background */}
    <div className="absolute inset-0 -z-10 pointer-events-none opacity-60" aria-hidden>
      <Aurora colors={['#3b82f6', '#7cf994', '#60a5fa']} speed="8s" blur="100px" />
    </div>
  </section>
);

/* ─── Problem Section — 말풍선 + 이모지 ─── */
const painBubbles = [
  { emoji: '🎯', text: '어떻게 등급별로 메시지를 발송하지?' },
  { emoji: '💻', text: '데이터 가공이 어려워' },
  { emoji: '👷', text: '인력이 부족해' },
  { emoji: '✉️', text: '메시지 발송은 했는데, 효율은 어떻게 확인하지?' },
  { emoji: '😰', text: '고객 피로도가 걱정이야..' },
  { emoji: '🤝', text: '누수 비용을 막을 순 없을까?' },
  { emoji: '🛒', text: '회원 가입 후 미구매자가 몇 명이지?' },
  { emoji: '🏠', text: '홈페이지 팝업도 띄우고 싶어' },
];

const ProblemSection = () => (
  <section className="bg-surface-container-lowest py-24 md:py-32 px-6" id="features">
    <div className="max-w-[1280px] mx-auto">
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
        {/* Left — Title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 variants={fadeUp} transition={{ duration: 0.5, ease }} className="heading-2">
            요즘 대세<br />
            카카오톡 메시지 발송<br />
            우리도 잘하고 싶은데...
          </motion.h2>
        </motion.div>

        {/* Right — Emoji bubble grid + Solution */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="flex flex-col gap-3"
        >
          <div className="grid grid-cols-2 gap-3">
            {painBubbles.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.35, ease }}
                className="flex items-center gap-3 px-5 py-4 bg-zinc-100 rounded-2xl"
              >
                <span className="text-xl shrink-0" role="img">{item.emoji}</span>
                <p className="text-on-surface font-semibold text-[14px] leading-snug">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Arrow + Solution bubble */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4, ease }} className="flex flex-col items-center mt-2">
            <ArrowDown size={28} strokeWidth={2.5} className="text-primary mb-3" />
            <div className="bg-white border border-primary text-primary font-semibold text-[15px] px-6 py-3.5 rounded-2xl w-full text-center">
              스마트메시지 플러스로 한방에 해결!
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ─── Value Prop ─── */
const ValueProp = () => (
  <section className="py-24 md:py-32 px-6 bg-surface-container-lowest">
    <div className="max-w-[1280px] mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
        <motion.h2 variants={fadeUp} transition={{ duration: 0.5, ease }} className="heading-2 mb-4">
          복잡하고 어려운 마케팅,
          <br />
          고객관리도 한 번에 관리할 수 있습니다.
        </motion.h2>
        <motion.p variants={fadeUp} transition={{ duration: 0.5, ease }} className="text-base text-on-surface-variant">
          내 쇼핑몰에 꼭 맞는 솔루션, 스마트메시지 플러스
        </motion.p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6 max-w-[1080px] mx-auto">
        {[
          { icon: <Target size={22} />, title: '개인화 타겟팅 메시지', desc: '데이터를 기반으로 고객 한 명 한 명에게 최적화된 메시지를 전달합니다.' },
          { icon: <LayoutDashboard size={22} />, title: '고객관리(CRM)', desc: '방문부터 구매까지 전 과정을 추적하여 고객 생애 가치를 극대화합니다.' },
          { icon: <Users size={22} />, title: '운영대행', desc: '전문 마케터가 직접 최적의 캠페인을 설계하고 운영해 드립니다.' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: i * 0.1, ease }}
            className="group p-8 rounded-2xl bg-surface-container-low hover:bg-primary-container/80 transition-all duration-300 hover:shadow-lg"
          >
            <div className="w-11 h-11 bg-primary rounded-[10px] flex items-center justify-center mb-6 group-hover:bg-on-primary transition-colors duration-300">
              <div className="text-on-primary group-hover:text-primary transition-colors duration-300">{item.icon}</div>
            </div>
            <h3 className="text-lg font-bold mb-3 group-hover:text-on-primary transition-colors duration-300">{item.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed group-hover:text-on-primary/70 transition-colors duration-300">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Feature Grid ─── */
const FeatureGrid = () => (
  <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-6" style={{ background: 'rgb(245, 248, 255)' }} id="analytics">
    <div className="max-w-[1280px] mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-14">
        <motion.span variants={fadeUp} transition={{ duration: 0.4, ease }} className="text-primary font-bold tracking-wide text-xs block mb-4">
          데이터 분석
        </motion.span>
        <motion.h3 variants={fadeUp} transition={{ duration: 0.5, ease }} className="heading-2 mb-4">
          원하는 정보만 쏙, 쏙!
          <br />
          자동으로 보여주는 특별한 기능
        </motion.h3>
        <motion.p variants={fadeUp} transition={{ duration: 0.5, ease }} className="text-base text-on-surface-variant leading-relaxed max-w-3xl">
          고객 행동 패턴을 분석하여 정확한 통계를 바탕으로 효율적인 마케팅 관리가 가능합니다.
        </motion.p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: <MousePointer2 size={20} />, label: '방문 분석', desc: '내 고객, 몇일만에 재방문할까?' },
          { icon: <ShoppingBag size={20} />, label: '구매 분석', desc: '1년간 미구매자들은 몇 명일까?' },
          { icon: <ShoppingCart size={20} />, label: '장바구니 분석', desc: '장바구니 결제까지는 몇 일정도 소요될까?' },
          { icon: <UserPlus size={20} />, label: '회원 등급 분석', desc: '충성 고객 그룹을 어떻게 더 만들 수 있을까?' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.4, delay: i * 0.08, ease }}
            className="p-6 bg-surface-container-lowest rounded-2xl ghost-border hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-primary/8 rounded-[10px] flex items-center justify-center mb-4 text-primary group-hover:bg-primary/12 transition-colors">
              {item.icon}
            </div>
            <h4 className="font-bold text-on-surface mb-2 text-[15px]">{item.label}</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Stats Dashboard ─── */
const StatsDashboard = () => {
  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  });
  const bgScaleY = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const bgRadius = useTransform(scrollYProgress, [0, 0.8], ['2rem', '0rem']);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Parallax dark background */}
      <motion.div
        className="absolute inset-0 bg-zinc-800 origin-bottom"
        style={{ scaleY: bgScaleY, borderRadius: bgRadius }}
      />
      <div className="relative pt-24 md:pt-32">
        <div className="max-w-[1280px] mx-auto text-center px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5, ease }}
            className="heading-2 mb-10 max-w-3xl mx-auto text-white"
          >
            항상 궁금했던 데이터들,<br />
            통계에서 확인하고<br />
            새로운 매출의 길을 만들어보세요.
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-wrap justify-center gap-2.5 mb-14"
          >
            {['#VIP재방문주기', '#마지막 로그인 주기', '#월 별 구매자 수', '#1년간 미구매자 수', '#장바구니 담기 후 미구매', '#이탈 발생 카테고리'].map((tag, i) => (
              <motion.span
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.3, ease }}
                className="px-3.5 py-1.5 bg-white/10 text-zinc-300 text-[13px] font-semibold rounded-full border border-white/10"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="max-w-5xl mx-auto mb-[-24px]"
        >
          <img className="w-full block" src={statisticsImg} alt="스마트메시지 플러스 통계 대시보드" />
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Success Metrics ─── */
const SuccessMetrics = () => (
  <section className="py-24 md:py-32 px-6 bg-black" id="cases">
    <div className="max-w-[1280px] mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-8">
        <div>
          <motion.span variants={fadeUp} transition={{ duration: 0.4, ease }} className="text-secondary-container font-bold tracking-wide text-xs block mb-4">
            성공 사례
          </motion.span>
          <motion.h2 variants={fadeUp} transition={{ duration: 0.5, ease }} className="heading-2 !text-white">
            카카오톡 메시지 활용 사례
          </motion.h2>
        </div>
        <motion.div variants={fadeUp} transition={{ duration: 0.5, ease }} className="flex gap-10">
          {[
            { value: 14.1, label: '평균 구매율' },
            { value: 28.9, label: '평균 클릭률' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-secondary-container text-3xl md:text-4xl font-bold mb-1 tabular-nums"><CountUp value={stat.value} suffix="%" /></div>
              <div className="!text-white/75 text-sm font-semibold">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5">
        {[
          { title: '장바구니 리마인드', desc: '구매 고민 중인 고객에게 타이밍에 맞춘 혜택 메시지를 자동 발송하여 이탈을 방지합니다.', metric: 'ROAS 4,371% 달성' },
          { title: '적립금 사용 유도', desc: '잠자고 있는 적립금 소멸 예정을 안내하여 고객의 재방문과 추가 구매를 자연스럽게 이끌어냅니다.', metric: '재방문율 3.5배 상승' },
          { title: '충성고객 구매 유도', desc: 'VIP 고객만을 위한 시크릿 프로모션과 전용 쿠폰 메시지로 브랜드 로열티를 강화합니다.', metric: '구매 객단가 22% 증가' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.4, delay: i * 0.1, ease }}
            className="p-7 rounded-2xl border border-white/10 hover:border-secondary-container/60 bg-white/[0.04] transition-all duration-300 group"
          >
            <h4 className="text-lg font-bold mb-3 !text-white">{item.title}</h4>
            <p className="!text-white/75 text-sm mb-5 leading-relaxed">{item.desc}</p>
            <div className="text-secondary-container font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
              {item.metric} <TrendingUp size={15} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Consulting ─── */
const ConsultingSection = () => (
  <section className="py-24 md:py-32 px-6" style={{ backgroundColor: '#F5F8FF' }}>
    <div className="max-w-[800px] mx-auto text-center">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-10">
        <motion.h2 variants={fadeUp} transition={{ duration: 0.5, ease }} className="heading-2 mb-4">
          스마트메시지 플러스는<br />별도 비용 없이 컨설팅을 도와 드립니다.
        </motion.h2>
        <motion.p variants={fadeUp} transition={{ duration: 0.5, ease }} className="text-base text-on-surface-variant leading-relaxed max-w-xl mx-auto">
          단발성 메시지 발송도, 효율체크도 스마트메시지 플러스와 함께라면 문제 없습니다.
        </motion.p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <img
          className="w-full"
          src={consultingImg}
          alt="무료 컨설팅"
        />
      </motion.div>
    </div>
  </section>
);

/* ─── Onsite Banner ─── */
const OnsiteBanner = () => (
  <section className="pt-24 md:pt-32 px-6 overflow-hidden" style={{ backgroundColor: '#E5F0FF' }}>
    <div className="max-w-[1280px] mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-6">
        <motion.h2 variants={fadeUp} transition={{ duration: 0.5, ease }} className="heading-2 mb-4">
          스마트메시지 플러스는
          <br />
          <span className="text-primary">온사이트 배너</span>와 함께 사용하면 더욱 좋아요.
        </motion.h2>
        <motion.p variants={fadeUp} transition={{ duration: 0.5, ease }} className="text-base text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
          고객의 특정행동을 기반으로 개인화된 맞춤 배너를 노출하여
          <br className="hidden md:block" />
          구매를 망설이거나, 쇼핑몰을 떠나는 고객의 마음을 사로 잡을 수 있습니다.
        </motion.p>
        <motion.p variants={fadeUp} transition={{ duration: 0.4, ease }} className="text-sm text-on-surface-variant/60 mt-3">
          온사이트 배너는 부가서비스로, 별도 신청 바랍니다.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-6 items-end">
        {[
          { title: '간단알림', src: 'https://lunasoft.co.kr/images/homepage/smartmsgPlus/@2x/simple_noti.png', alt: '온사이트 배너 간단알림', scale: '60%', mb: -24 },
          { title: '워딩알림', src: 'https://lunasoft.co.kr/images/homepage/smartmsgPlus/@2x/wording_noti.png', alt: '온사이트 배너 워딩알림', scale: '100%', mb: 24 },
          { title: '이미지형', src: 'https://lunasoft.co.kr/images/homepage/smartmsgPlus/@2x/img_noti.png', alt: '온사이트 배너 이미지형', scale: '60%' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.4, delay: i * 0.1, ease }}
            className="text-center flex flex-col items-center"
          >
            <h3 className="text-lg font-bold mb-4">{item.title}</h3>
            <img className="w-full" style={{ maxWidth: item.scale, marginBottom: item.mb ?? 0 }} src={item.src} alt={item.alt} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Final CTA ─── */
const FinalCTA = () => (
  <>
    <section className="py-24 px-6 bg-surface-container-lowest" id="contact">
      <div className="max-w-[1280px] mx-auto text-center">
        {/* Trust strip */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} transition={{ duration: 0.5, ease }} className="heading-2 mb-10">
            스마트메시지 플러스를 도입한
            <br />
            대표 파트너사
          </motion.h2>
          <motion.div variants={fadeUp} transition={{ duration: 0.5, ease }}>
            <img className="w-full max-w-3xl mx-auto" src={partnersImg} alt="대표 파트너사" />
          </motion.div>
        </motion.div>

      </div>
    </section>

    <section className="py-24 md:py-32 px-6 relative overflow-hidden">
      <div className="relative z-10 max-w-[1280px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <h2 className="heading-2 mb-4">스마트메시지 플러스 지금 바로 시작하세요!</h2>
          <p className="text-on-surface-variant mb-8 text-base">더 효과적인 메시지 마케팅으로 성과를 만들어보세요.</p>
          <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="btn-hero-primary bg-on-surface text-surface shadow-xl hover:shadow-2xl hover:opacity-90 transition-all">
            서비스 신청하기 <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-60" aria-hidden>
        <Aurora colors={['#3b82f6', '#7cf994', '#60a5fa']} speed="8s" blur="100px" />
      </div>
    </section>
  </>
);

/* ─── Footer ─── */
const footerLinks = [
  {
    title: '약관 및 정책',
    links: [
      { label: '서비스 이용약관', href: 'https://blumnai.notion.site/2c5c0b1104dd802a83e4dcd94a5a6e14' },
      { label: '개인정보 처리방침', href: 'https://blumnai.notion.site/2c5c0b1104dd800bb205c2ceb3c40ff7' },
    ],
  },
  {
    title: '리소스',
    links: [
      { label: '블로그', href: 'https://blog.happytalk.io/' },
      { label: '서비스 소개서', href: 'https://sclu.io/share/bulk/file/bfKGJEdhn8Es' },
    ],
  },
  {
    title: '블룸에이아이',
    links: [
      { label: '회사소개', href: 'https://blumn.ai/' },
      { label: '콜브릿지', href: 'https://callbridge.ai/' },
      { label: '헤이데어', href: 'https://hey-there.io/' },
      { label: '해피싱크', href: 'https://www.happysync.io/' },
      { label: '해피톡', href: 'https://www.happytalk.io/' },
      { label: '루나M', href: 'https://luna-m.ai/' },
    ],
  },
];

const Footer = () => {
  const [ismsOpen, setIsmsOpen] = React.useState(false);

  return (
    <>
      <footer className="w-full bg-white border-t border-outline-variant/10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          {/* Upper: Contact + Links */}
          <div className="py-12 md:py-16 flex flex-col lg:flex-row gap-10 lg:gap-16">
            <div className="shrink-0 lg:w-[240px]">
              <div className="text-lg font-bold text-on-surface mb-4" style={{ letterSpacing: '-0.02em' }}>
                스마트메시지 <span className="text-primary">플러스</span>
              </div>
              <div>
                <p className="text-on-surface-variant/60 text-[13px] leading-relaxed">
                  <span>csm@blumn.ai</span>
                </p>
                <p className="text-on-surface text-2xl font-bold tracking-tight mt-1 mb-4">1644-4998</p>
              </div>
              <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-lg bg-on-surface text-surface hover:opacity-90 transition-colors">
                도입 문의하기 <ArrowRight size={14} />
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-[30%_30%_40%] gap-8 md:gap-6 flex-1">
              {footerLinks.map((section) => (
                <div key={section.title}>
                  <p className="text-on-surface-variant/40 text-[13px] font-medium mb-4">{section.title}</p>
                  {section.title === '블룸에이아이' ? (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
                      {section.links.map((link) => (
                        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-[13px] text-on-surface-variant/70 hover:text-on-surface transition-colors">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {section.links.map((link) => (
                        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-[13px] text-on-surface-variant/70 hover:text-on-surface transition-colors">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Company Info + Copyright */}
          <div className="py-8 border-t border-outline-variant/10">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <p className="font-bold text-on-surface-variant text-[13px] mb-1.5">(주)블룸에이아이</p>
                <div className="space-y-0.5 text-on-surface-variant/40 text-[12px] leading-relaxed">
                  <p>서울 중구 서소문로 89, 순화빌딩 6층, 대표이사: 김범수, 박진영</p>
                  <p>사업자등록번호: 773-87-00356 통신판매업 신고번호: 제 2024-서울중구-1646호</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsmsOpen(true)} className="cursor-pointer">
                    <img src="https://shoplic.kr/wp-content/uploads/2025/06/ISMS.png" alt="ISMS 인증" className="w-[36px] h-[36px] rounded-full object-cover" />
                  </button>
                  <img src={iso27001Img} alt="ISO 27001 인증" className="w-[36px] h-[36px] rounded-full object-cover" />
                </div>
                <p className="text-on-surface-variant/40 text-[12px]">© Blumn AI Corp. All rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ISMS Modal */}
      {ismsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setIsmsOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsmsOpen(false)} className="absolute top-4 right-4 text-on-surface-variant/40 hover:text-on-surface transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-on-surface mb-6">블룸에이아이 정보보호 관리체계 인증 획득</h2>
            <div className="space-y-4 text-[14px] text-on-surface-variant leading-relaxed">
              <div>
                <p className="font-semibold text-on-surface mb-1">🔒 인증범위</p>
                <p>채팅상담, ARS 콜센터 솔루션 및 고객관리 솔루션 운영<br />(정보통신방법 제47조의7에 따른 인증의 특례)</p>
              </div>
              <div>
                <p className="font-semibold text-on-surface mb-1">🔒 유효기간</p>
                <p>2025.11.19 ~ 2028.11.18</p>
              </div>
            </div>
            <img src="https://landing.happytalk.io/_next/static/media/isms_certificate.6cdb089a.png" alt="ISMS 인증서" className="w-full rounded-lg mt-6" />
          </div>
        </div>
      )}
    </>
  );
};

/* ─── App ─── */
export default function App() {
  return (
    <div className="min-h-screen selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <ValueProp />
        <FeatureGrid />
        <StatsDashboard />
        <SuccessMetrics />
        <ConsultingSection />
        <OnsiteBanner />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
