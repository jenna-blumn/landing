import React from 'react';
import { Icon, Button, Checkbox, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Divider, Badge } from '@blumnai-studio/blumnai-design-system';
import { mockBrands } from '../../data/mockData';
import { Channel, ChannelSettings, CHANNEL_SETTINGS_STORAGE_KEY } from '../../types/channel';
import { SIDEBAR_BODY_TEXT, SIDEBAR_CARD_PADDING, SIDEBAR_META_TEXT } from '../../features/layout/panelSpacing';

interface ChannelBrandAreaProps {
  isCollapsed: boolean;
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  selectedChannel: Channel;
  onChannelChange: (channel: Channel) => void;
  allRooms: Array<{
    id: number;
    brand: string;
  }>;
  isPhoneModeActive: boolean;
  isPhoneButtonVisible: boolean;
  isChannelSectionVisible: boolean;
  isBrandSectionVisible: boolean;
  isBrandsInGNB: boolean;
  onToggleBrandsInGNB: (inGNB: boolean) => void;
}

const ChannelBrandArea: React.FC<ChannelBrandAreaProps> = ({
  isCollapsed,
  selectedBrands,
  onBrandChange,
  selectedChannel,
  onChannelChange,
  allRooms,
  isPhoneModeActive,
  isPhoneButtonVisible,
  isChannelSectionVisible,
  isBrandSectionVisible,
  isBrandsInGNB,
  onToggleBrandsInGNB,
}) => {
  const [isBrandsExpanded, setIsBrandsExpanded] = React.useState(false);
  const [isChannelSettingsModalOpen, setIsChannelSettingsModalOpen] = React.useState(false);
  const [mockChannelSettings, setMockChannelSettings] = React.useState<ChannelSettings>({
    all: true,
    chat: true,
    phone: true,
    board: true,
    email: true,
  });
  const [displayChannelSettings, setDisplayChannelSettings] = React.useState<ChannelSettings>({
    all: true,
    chat: true,
    phone: true,
    board: true,
    email: true,
  });

  const brands = mockBrands;

  const isAllSelected = selectedBrands.length === 0;

  const getDefaultMockChannelSettings = React.useCallback((): ChannelSettings => ({
    all: true,
    chat: true,
    phone: isPhoneButtonVisible,
    board: true,
    email: true,
  }), [isPhoneButtonVisible]);

  const readMockChannelSettings = React.useCallback((): ChannelSettings => {
    const defaults = getDefaultMockChannelSettings();

    if (typeof window === 'undefined') {
      return defaults;
    }

    try {
      const stored = window.localStorage.getItem(CHANNEL_SETTINGS_STORAGE_KEY);
      if (!stored) {
        return defaults;
      }

      const parsed = JSON.parse(stored) as Partial<ChannelSettings>;
      return {
        all: typeof parsed.all === 'boolean' ? parsed.all : defaults.all,
        chat: typeof parsed.chat === 'boolean' ? parsed.chat : defaults.chat,
        phone: typeof parsed.phone === 'boolean' ? parsed.phone : defaults.phone,
        board: typeof parsed.board === 'boolean' ? parsed.board : defaults.board,
        email: typeof parsed.email === 'boolean' ? parsed.email : defaults.email,
      };
    } catch {
      return defaults;
    }
  }, [getDefaultMockChannelSettings]);

  // 컴포넌트 마운트 시 채널 설정 로드
  React.useEffect(() => {
    const loadedSettings = readMockChannelSettings();
    setDisplayChannelSettings(loadedSettings);
  }, [readMockChannelSettings]);

  const openChannelSettingsModal = () => {
    setMockChannelSettings(readMockChannelSettings());
    setIsChannelSettingsModalOpen(true);
  };

  const saveMockChannelSettings = (saveAction: 'confirm' | 'cancel') => {
    if (saveAction === 'confirm') {
      // 유효성 검증: 채팅 또는 전화 중 하나는 필수
      if (!mockChannelSettings.chat && !mockChannelSettings.phone) {
        alert('최소 1개의 채널(채팅 또는 전화)이 필요합니다.');
        return;
      }

      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            CHANNEL_SETTINGS_STORAGE_KEY,
            JSON.stringify(mockChannelSettings)
          );
        }

        // 표시 설정 업데이트
        setDisplayChannelSettings(mockChannelSettings);

        // 현재 선택된 채널이 숨겨지면 자동 전환
        if (selectedChannel === 'phone' && !mockChannelSettings.phone) {
          onChannelChange('chat');
          setTimeout(() => {
            alert('전화 채널이 숨겨져 채팅 채널로 전환되었습니다.');
          }, 100);
        } else if (selectedChannel === 'chat' && !mockChannelSettings.chat) {
          onChannelChange('phone');
          setTimeout(() => {
            alert('채팅 채널이 숨겨져 전화 채널로 전환되었습니다.');
          }, 100);
        } else if (selectedChannel === 'board' && !mockChannelSettings.board) {
          onChannelChange('chat');
          setTimeout(() => {
            alert('게시판 채널이 숨겨져 채팅 채널로 전환되었습니다.');
          }, 100);
        } else if (selectedChannel === 'email' && !mockChannelSettings.email) {
          onChannelChange('chat');
          setTimeout(() => {
            alert('이메일 채널이 숨겨져 채팅 채널로 전환되었습니다.');
          }, 100);
        }
      } catch {
        alert('설정을 저장할 수 없습니다.');
        return;
      }
    }

    setIsChannelSettingsModalOpen(false);
  };

  const handleMockChannelSettingToggle = (key: keyof ChannelSettings) => {
    setMockChannelSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAllBrands = () => {
    onBrandChange([]);
  };

  const handleBrandToggle = (brandId: string) => {
    if (selectedBrands.includes(brandId)) {
      onBrandChange(selectedBrands.filter(id => id !== brandId));
    } else {
      onBrandChange([...selectedBrands, brandId]);
    }
  };

  const getBrandRoomCount = (brandId: string) => {
    return allRooms.filter(room => room.brand === brandId).length;
  };

  const getSelectedBrandObjects = () => {
    return brands.filter(brand => selectedBrands.includes(brand.id));
  };

  const renderCountBadge = (count: number) => (
    <Badge label={String(count)} color="orange" size="sm" shape="pill"
      className="absolute -top-2 -right-2" />
  );

  const renderBrandDisplay = () => {
    if (isAllSelected) {
      return (
        <div className="flex items-center gap-1.5">
          <Button
            variant="iconOnly"
            buttonStyle="ghost"
            size="2xs"
            onClick={() => onToggleBrandsInGNB(true)}
            leadIcon={<Icon iconType={['arrows', 'arrow-left-s']} size={14} color="default" />}
            className="group h-5 w-5 rounded-full bg-gray-300 hover:bg-teal-400"
            title="브랜드를 GNB로 이동"
          />
          <span className="text-sm font-medium">전체 브랜드</span>
        </div>
      );
    }

    const selectedBrandObjects = getSelectedBrandObjects();

    return (
      <div className="flex w-full flex-col gap-1.5">
        {selectedBrandObjects.map((brand, index) => (
          <div key={brand.id} className="flex items-center gap-2">
            {index === 0 ? (
              <Button
                variant="iconOnly"
                buttonStyle="ghost"
                size="2xs"
                onClick={() => onToggleBrandsInGNB(true)}
                leadIcon={<Icon iconType={['arrows', 'arrow-left-s']} size={14} color="default" />}
                className="group h-5 w-5 flex-shrink-0 rounded-full bg-gray-300 hover:bg-teal-400"
                title="브랜드를 GNB로 이동"
              />
            ) : (
              <div className="h-5 w-5 flex-shrink-0" />
            )}
            <div
              className={`h-5 w-5 flex-shrink-0 rounded-full ${brand.color} flex items-center justify-center text-xs font-bold text-white`}
              title={brand.name}
            >
              {brand.icon}
            </div>
            <span className={`${SIDEBAR_BODY_TEXT} text-gray-700`}>{brand.name}</span>
            <span className={`${SIDEBAR_META_TEXT} text-gray-600`}>{brand.phoneNumber}</span>
            <span className={`ml-auto ${SIDEBAR_META_TEXT} text-gray-500`}>({getBrandRoomCount(brand.id)})</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-2.5">
      {isChannelSectionVisible && (
        <div className={`rounded-lg border border-gray-300 bg-gray-200 ${SIDEBAR_CARD_PADDING}`}>
          {isCollapsed ? (
            <div className="flex justify-center">
              {selectedChannel === 'all' ? (
                <div className="text-xs font-bold text-gray-700">All</div>
              ) : selectedChannel === 'chat' ? (
                <Icon iconType={['communication', 'chat-1']} size={16} color="default" />
              ) : (
                <Icon iconType={['device', 'phone']} size={16} color="default" />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                {displayChannelSettings.all && (
                  <Button
                    buttonStyle="ghost"
                    size="2xs"
                    onClick={() => onChannelChange('all')}
                    className={
                      selectedChannel === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                    }
                  >
                    전체
                  </Button>
                )}
                {displayChannelSettings.chat && (
                  <Button
                    variant="iconOnly"
                    buttonStyle="ghost"
                    size="2xs"
                    onClick={() => onChannelChange('chat')}
                    leadIcon={<Icon iconType={['communication', 'chat-1']} size={16} color="default" />}
                    className={`relative ${
                      selectedChannel === 'chat' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
                    }`}
                  >
                    {renderCountBadge(3)}
                  </Button>
                )}
                {isPhoneButtonVisible && displayChannelSettings.phone && (
                  <Button
                    variant="iconOnly"
                    buttonStyle="ghost"
                    size="2xs"
                    onClick={() => onChannelChange('phone')}
                    leadIcon={<Icon iconType={['device', 'phone']} size={16} color={selectedChannel === 'phone' ? 'informative' : 'default'} />}
                    className={`relative ${
                      selectedChannel === 'phone' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
                    }`}
                    title={isPhoneModeActive ? '전화 상담 모드 활성화됨' : '전화 채널로 전환'}
                  >
                    {renderCountBadge(2)}
                    {isPhoneModeActive && (
                      <span
                        className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-blue-600"
                        aria-label="phone-mode-active"
                      />
                    )}
                  </Button>
                )}
                {displayChannelSettings.board && (
                  <Button
                    variant="iconOnly"
                    buttonStyle="ghost"
                    size="2xs"
                    onClick={() => onChannelChange('board')}
                    leadIcon={<Icon iconType={['document', 'clipboard']} size={16} color="default" />}
                    className={`relative ${
                      selectedChannel === 'board' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
                    }`}
                    title="게시판"
                  >
                    {renderCountBadge(4)}
                  </Button>
                )}
                {displayChannelSettings.email && (
                  <Button
                    variant="iconOnly"
                    buttonStyle="ghost"
                    size="2xs"
                    onClick={() => onChannelChange('email')}
                    leadIcon={<Icon iconType={['business', 'mail']} size={16} color="default" />}
                    className={`relative ${
                      selectedChannel === 'email' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
                    }`}
                    title="이메일"
                  >
                    {renderCountBadge(3)}
                  </Button>
                )}
              </div>

              <Button
                variant="iconOnly"
                buttonStyle="ghost"
                size="2xs"
                onClick={openChannelSettingsModal}
                leadIcon={<Icon iconType={['system', 'settings']} size={16} />}
                className="text-gray-700"
                title="채널 설정"
              />
            </div>
          )}
        </div>
      )}

      {!isBrandsInGNB && isBrandSectionVisible && (
        <div
          className={`rounded-lg ${SIDEBAR_CARD_PADDING} ${
            isPhoneModeActive ? 'border border-blue-200 bg-blue-100' : 'border border-gray-300 bg-gray-200'
          }`}
        >
          {isCollapsed ? (
            <div className="flex justify-center">
              {isAllSelected ? (
                <div className="text-xs font-bold text-gray-700">All</div>
              ) : (
                <div className="text-xs font-bold text-gray-700">{selectedBrands.length}</div>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">{renderBrandDisplay()}</div>
                  <Button
                    variant="iconOnly"
                    buttonStyle="ghost"
                    size="2xs"
                    onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
                    leadIcon={isBrandsExpanded ? <Icon iconType={['arrows', 'arrow-up-s']} size={12} /> : <Icon iconType={['arrows', 'arrow-down-s']} size={12} />}
                    className="self-start rounded p-1 text-gray-600 hover:bg-gray-100"
                    title="브랜드 펼치기/접기"
                  />
                </div>
              </div>

              {isBrandsExpanded && (
                <div className="mt-2.5 space-y-2">
                  <Button
                    buttonStyle="ghost"
                    size="2xs"
                    fullWidth
                    onClick={handleAllBrands}
                    className={`justify-start ${
                      isAllSelected ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                      All
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <span>전체 브랜드</span>
                      <span className={`${SIDEBAR_META_TEXT} text-gray-500`}>({allRooms.length})</span>
                    </div>
                  </Button>

                  {brands.map((brand) => (
                    <Button
                      key={brand.id}
                      buttonStyle="ghost"
                      size="2xs"
                      fullWidth
                      onClick={() => handleBrandToggle(brand.id)}
                      className={`justify-start ${
                        selectedBrands.includes(brand.id) ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full ${brand.color} text-xs font-bold text-white`}>
                        {brand.icon}
                      </div>
                      <div className="flex flex-1 items-center justify-between">
                        <span>{brand.name.length > 6 ? `${brand.name.substring(0, 6)}...` : brand.name} ({brand.phoneNumber})</span>
                        <span className={`${SIDEBAR_META_TEXT} text-gray-500`}>({getBrandRoomCount(brand.id)})</span>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <Dialog open={isChannelSettingsModalOpen} onOpenChange={(open) => { if (!open) saveMockChannelSettings('cancel'); }}>
        <DialogContent width={425}>
            <DialogHeader>
              <DialogTitle>채널 설정</DialogTitle>
              <DialogDescription>
                표시할 채널을 선택하세요. (채팅 또는 전화 중 하나는 필수)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 px-4 py-4">
              {/* 채팅 채널 표시 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">채팅 채널 표시</label>
                <div className="grid grid-cols-3 gap-2">
                  {/* 채팅 */}
                  {(() => {
                    const isChatOnlyActive = mockChannelSettings.chat && !mockChannelSettings.phone;
                    return (
                      <div className="group relative">
                        <div
                          className={`flex flex-col items-center gap-2 rounded-md border p-3 text-sm ${
                            isChatOnlyActive
                              ? 'cursor-not-allowed bg-gray-50 opacity-60'
                              : 'cursor-pointer hover:bg-gray-50'
                          }`}
                          onClick={() => !isChatOnlyActive && handleMockChannelSettingToggle('chat')}
                        >
                          <div className="flex items-center gap-1">
                            <Icon iconType={['communication', 'chat-1']} size={14} />
                            {isChatOnlyActive && <Icon iconType={['system', 'lock']} size={12} color="default-muted" />}
                          </div>
                          <span className="text-xs">채팅</span>
                          <Checkbox
                            checked={mockChannelSettings.chat}
                            onCheckedChange={() => handleMockChannelSettingToggle('chat')}
                            disabled={isChatOnlyActive}
                          />
                        </div>
                        {isChatOnlyActive && (
                          <div className="pointer-events-none absolute -top-2 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                            최소 1개의 채널(채팅 또는 전화)이 필요합니다.
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* 게시판 */}
                  <div
                    className="flex flex-col items-center gap-2 rounded-md border p-3 text-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => handleMockChannelSettingToggle('board')}
                  >
                    <Icon iconType={['document', 'clipboard']} size={14} />
                    <span className="text-xs">게시판</span>
                    <Checkbox
                      checked={mockChannelSettings.board}
                      onCheckedChange={() => handleMockChannelSettingToggle('board')}
                    />
                  </div>

                  {/* 이메일 */}
                  <div
                    className="flex flex-col items-center gap-2 rounded-md border p-3 text-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => handleMockChannelSettingToggle('email')}
                  >
                    <Icon iconType={['business', 'mail']} size={14} />
                    <span className="text-xs">이메일</span>
                    <Checkbox
                      checked={mockChannelSettings.email}
                      onCheckedChange={() => handleMockChannelSettingToggle('email')}
                    />
                  </div>
                </div>
              </div>

              <Divider />

              {/* 전화 채널 표시 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">전화 채널 표시</label>
                {(() => {
                  const isPhoneOnlyActive = mockChannelSettings.phone && !mockChannelSettings.chat;
                  return (
                    <div className="group relative">
                      <div
                        className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                          isPhoneOnlyActive
                            ? 'cursor-not-allowed bg-gray-50 opacity-60'
                            : 'cursor-pointer hover:bg-gray-50'
                        }`}
                        onClick={() => !isPhoneOnlyActive && handleMockChannelSettingToggle('phone')}
                      >
                        <div className="flex items-center gap-2">
                          <Icon iconType={['device', 'phone']} size={14} />
                          <span>전화</span>
                          {isPhoneOnlyActive && <Icon iconType={['system', 'lock']} size={12} color="default-muted" />}
                        </div>
                        <Checkbox
                          checked={mockChannelSettings.phone}
                          onCheckedChange={() => handleMockChannelSettingToggle('phone')}
                          disabled={isPhoneOnlyActive}
                        />
                      </div>
                      {isPhoneOnlyActive && (
                        <div className="pointer-events-none absolute -top-2 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                          최소 1개의 채널(채팅 또는 전화)이 필요합니다.
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <Divider />

              {/* 기타 옵션 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">기타</label>
                <div
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                  onClick={() => handleMockChannelSettingToggle('all')}
                >
                  <span>전체 채널 표시</span>
                  <Checkbox
                    checked={mockChannelSettings.all}
                    onCheckedChange={() => handleMockChannelSettingToggle('all')}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                buttonStyle="ghost"
                size="sm"
                onClick={() => saveMockChannelSettings('cancel')}
              >
                취소
              </Button>
              <Button
                buttonStyle="primary"
                size="sm"
                onClick={() => saveMockChannelSettings('confirm')}
              >
                확인
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(ChannelBrandArea);
