import React, { useState, useMemo, useCallback } from 'react';
import {
  Popover, PopoverTrigger, PopoverContent,
  Calendar, Button, Icon, Divider,
} from '@blumnai-studio/blumnai-design-system';
import { ko } from 'date-fns/locale/ko';
import {
  PeriodFilter, PeriodPreset,
  PERIOD_PRESET_OPTIONS,
} from '../../features/search/types';

interface PeriodFilterDropdownProps {
  value: PeriodFilter | null;
  onChange: (value: PeriodFilter | null) => void;
}

type View = 'presets' | 'custom';
type DateTab = 'start' | 'end';

const PeriodFilterDropdown: React.FC<PeriodFilterDropdownProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('presets');
  const [activeTab, setActiveTab] = useState<DateTab>('start');
  const [tempStart, setTempStart] = useState<Date | undefined>();
  const [tempEnd, setTempEnd] = useState<Date | undefined>();

  // Popover 열릴 때 상태 초기화
  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      setView('presets');
      setActiveTab('start');
      // 기존 custom 값이 있으면 복원
      if (value?.custom) {
        setTempStart(new Date(value.custom.start));
        setTempEnd(new Date(value.custom.end));
      } else {
        setTempStart(undefined);
        setTempEnd(undefined);
      }
    }
    setOpen(nextOpen);
  }, [value]);

  // 프리셋 클릭 → 즉시 적용 + 닫기
  const handlePresetClick = useCallback((preset: PeriodPreset) => {
    onChange({ preset, custom: null });
    setOpen(false);
  }, [onChange]);

  // 직접 설정 모드 진입
  const handleCustomClick = useCallback(() => {
    setView('custom');
    setActiveTab('start');
  }, []);

  // 캘린더 날짜 선택
  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (!date) return;
    if (activeTab === 'start') {
      setTempStart(date);
      // 종료일보다 나중이면 종료일 초기화
      if (tempEnd && date > tempEnd) {
        setTempEnd(undefined);
      }
      setActiveTab('end');
    } else {
      // 시작일보다 이전이면 시작일로 설정
      if (tempStart && date < tempStart) {
        setTempStart(date);
        setTempEnd(undefined);
        setActiveTab('end');
      } else {
        setTempEnd(date);
      }
    }
  }, [activeTab, tempStart, tempEnd]);

  // 적용 클릭
  const handleApply = useCallback(() => {
    if (!tempStart) return;
    const from = new Date(tempStart);
    from.setHours(0, 0, 0, 0);
    const to = tempEnd ? new Date(tempEnd) : new Date(from);
    to.setHours(23, 59, 59, 999);
    onChange({
      preset: null,
      custom: { start: from.toISOString(), end: to.toISOString() },
    });
    setOpen(false);
  }, [tempStart, tempEnd, onChange]);

  // 필터 해제 (× 클릭)
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  }, [onChange]);

  // 트리거 라벨 계산
  const triggerLabel = useMemo(() => {
    if (!value) return null;
    if (value.preset) {
      const opt = PERIOD_PRESET_OPTIONS.find(o => o.value === value.preset);
      return opt?.label ?? null;
    }
    if (value.custom) {
      const s = new Date(value.custom.start);
      const e = new Date(value.custom.end);
      const fmt = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
      return `${fmt(s)}~${fmt(e)}`;
    }
    return null;
  }, [value]);

  const isActive = value !== null;

  // 직접 설정 캘린더에서 선택 범위 표시용
  const calendarModifiers = useMemo(() => {
    const modifiers: Record<string, Date | Date[]> = {};
    if (tempStart) modifiers.selectedStart = tempStart;
    if (tempEnd) modifiers.selectedEnd = tempEnd;
    if (tempStart && tempEnd) {
      const range: Date[] = [];
      const d = new Date(tempStart);
      d.setDate(d.getDate() + 1);
      while (d < tempEnd) {
        range.push(new Date(d));
        d.setDate(d.getDate() + 1);
      }
      modifiers.inRange = range;
    }
    return modifiers;
  }, [tempStart, tempEnd]);

  const calendarModifiersClassNames = useMemo(() => ({
    selectedStart: 'bg-primary text-primary-foreground rounded-md',
    selectedEnd: 'bg-primary text-primary-foreground rounded-md',
    inRange: 'bg-primary/10 rounded-none',
  }), []);

  // 캘린더 selected 값 (현재 활성 탭에 따라)
  const calendarSelected = activeTab === 'start' ? tempStart : tempEnd;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          className={`text-xs h-[26px] px-3 py-1 rounded-full border font-medium flex items-center gap-1 transition-colors ${
            isActive
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          기간{triggerLabel ? `: ${triggerLabel}` : ''}
          {isActive ? (
            <span
              role="button"
              onClick={handleClear}
              className="ml-0.5 hover:opacity-70"
            >
              <Icon iconType={['system', 'close']} size={10} color="white-default" />
            </span>
          ) : (
            <Icon iconType={['arrows', 'arrow-down-s']} size={12} />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent width={240} align="start" className="!p-0">
        {view === 'presets' ? (
          <div className="p-3 space-y-2">
            <div className="text-xs font-medium text-muted-foreground px-0.5">빠른 선택</div>
            <div className="grid grid-cols-2 gap-1.5">
              {PERIOD_PRESET_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  onClick={() => handlePresetClick(opt.value)}
                  buttonStyle={value?.preset === opt.value ? 'primary' : 'secondary'}
                  size="xs"
                  className="w-full"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
            <Divider />
            <Button
              onClick={handleCustomClick}
              buttonStyle="ghost"
              size="xs"
              className="w-full justify-start"
              leadIcon={<Icon iconType={['business', 'calendar']} size={14} color="default-subtle" />}
            >
              직접 설정
            </Button>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {/* 시작일/종료일 탭 */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setActiveTab('start')}
                className={`text-xs py-1.5 px-2 rounded-md border text-center transition-colors ${
                  activeTab === 'start'
                    ? 'border-primary bg-primary/5 text-primary font-medium'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {tempStart
                  ? `${tempStart.getFullYear()}.${String(tempStart.getMonth() + 1).padStart(2, '0')}.${String(tempStart.getDate()).padStart(2, '0')}`
                  : '시작일'}
              </button>
              <button
                onClick={() => setActiveTab('end')}
                className={`text-xs py-1.5 px-2 rounded-md border text-center transition-colors ${
                  activeTab === 'end'
                    ? 'border-primary bg-primary/5 text-primary font-medium'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {tempEnd
                  ? `${tempEnd.getFullYear()}.${String(tempEnd.getMonth() + 1).padStart(2, '0')}.${String(tempEnd.getDate()).padStart(2, '0')}`
                  : '종료일'}
              </button>
            </div>

            {/* 단일 캘린더 */}
            <Calendar
              mode="single"
              selected={calendarSelected}
              onSelect={handleDateSelect}
              locale={ko}
              modifiers={calendarModifiers}
              modifiersClassNames={calendarModifiersClassNames}
              className="!p-0"
            />

            {/* 하단 버튼 */}
            <div className="flex justify-end gap-1.5 pt-1">
              <Button
                onClick={() => setView('presets')}
                buttonStyle="ghost"
                size="xs"
              >
                뒤로
              </Button>
              <Button
                onClick={handleApply}
                buttonStyle="primary"
                size="xs"
                disabled={!tempStart}
              >
                적용
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default PeriodFilterDropdown;
