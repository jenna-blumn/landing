import React, { useState } from 'react';
import {
  Button,
  Icon,
  DragHandle,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@blumnai-studio/blumnai-design-system';

interface SectionWrapperProps {
  sectionId: string;
  title: string;
  children: React.ReactNode;
  initialCollapsed?: boolean;
  onSectionSettingsClick?: (sectionId: string) => void;
  onOpenOverlay?: () => void;
  showSettings?: boolean;
  showOverlay?: boolean;
  headerAction?: React.ReactNode;
  settingsContent?: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  sectionId,
  title,
  children,
  initialCollapsed = false,
  onSectionSettingsClick,
  onOpenOverlay,
  showSettings = true,
  showOverlay = false,
  headerAction,
  settingsContent,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

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
              {headerAction}
              {settingsContent ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="iconOnly"
                      buttonStyle="ghost"
                      size="2xs"
                      title="항목 설정"
                      leadIcon={<Icon iconType={['system', 'settings']} size={16} />}
                      className="text-gray-400 hover:text-blue-600"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent width={200}>
                    {settingsContent}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (showSettings || showOverlay) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="iconOnly"
                      buttonStyle="ghost"
                      size="2xs"
                      title="섹션 설정"
                      leadIcon={<Icon iconType={['system', 'settings']} size={16} />}
                      className="text-gray-400 hover:text-blue-600"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent width={180}>
                    {showOverlay && onOpenOverlay && (
                      <DropdownMenuItem
                        leadIcon={['system', 'eye']}
                        onClick={() => onOpenOverlay()}
                      >
                        모든 정보 보기
                      </DropdownMenuItem>
                    )}
                    {showSettings && onSectionSettingsClick && (
                      <DropdownMenuItem
                        leadIcon={['editor', 'link']}
                        onClick={() => onSectionSettingsClick(sectionId)}
                      >
                        고객정보 연동
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
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

      {!isCollapsed && <div className="p-3">{children}</div>}
    </div>
  );
};

export default SectionWrapper;
