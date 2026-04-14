import React, { useState, useRef, useEffect } from 'react';
import { Icon, Button, DragHandle } from '@blumnai-studio/blumnai-design-system';

interface SectionWrapperProps {
  sectionId: string;
  title: string;
  children: React.ReactNode;
  initialCollapsed?: boolean;
  onAIGenerate?: () => void;
  isAIGenerating?: boolean;
  additionalHeaderButtons?: React.ReactNode;
  showSettings?: boolean;
  settingsContent?: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  title,
  children,
  initialCollapsed = false,
  onAIGenerate,
  isAIGenerating,
  additionalHeaderButtons,
  showSettings = false,
  settingsContent,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSettingsOpen]);

  return (
    <div className="border rounded-lg bg-white mb-2 transition-all duration-200 border-gray-200">
      <div className="h-12 px-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-move hover:bg-gray-100 transition-colors flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <DragHandle />
          <h3 className="text-sm font-semibold text-gray-700 truncate">{title}</h3>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {!isCollapsed && (
            <>
              {additionalHeaderButtons}

              {showSettings && settingsContent && (
                <div className="relative" ref={settingsRef}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSettingsOpen(!isSettingsOpen);
                    }}
                    variant="iconOnly"
                    buttonStyle="ghost"
                    size="2xs"
                    title="항목 설정"
                    leadIcon={<Icon iconType={['system', 'settings']} size={16} />}
                  />
                  {isSettingsOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                      {settingsContent}
                    </div>
                  )}
                </div>
              )}

              {onAIGenerate && (
                <Button
                  onClick={onAIGenerate}
                  disabled={isAIGenerating}
                  buttonStyle="primary"
                  size="xs"
                  title="AI 상담 요약 생성"
                  className="whitespace-nowrap"
                >
                  {isAIGenerating ? 'AI생성 중...' : 'AI생성'}
                </Button>
              )}
            </>
          )}

          <Button
            variant="iconOnly"
            buttonStyle="ghost"
            size="2xs"
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
            leadIcon={isCollapsed ? (
              <Icon iconType={['arrows', 'arrow-down-s']} size={16} color="default-subtle" />
            ) : (
              <Icon iconType={['arrows', 'arrow-up-s']} size={16} color="default-subtle" />
            )}
          />
        </div>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsSettingsOpen(false)} />
      )}

      {!isCollapsed && <div className="p-3 min-w-0 overflow-hidden">{children}</div>}
    </div>
  );
};

export default SectionWrapper;
