import React, { useState, useMemo } from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Input, Icon } from '@blumnai-studio/blumnai-design-system';

interface AcwSettingsModalProps {
  isOpen: boolean;
  currentDuration: number;
  onApply: (seconds: number) => void;
  onClose: () => void;
}

const PRESETS = [
  { label: '1분', seconds: 60 },
  { label: '3분', seconds: 180 },
  { label: '5분', seconds: 300 },
  { label: '7분', seconds: 420 },
  { label: '10분', seconds: 600 },
];

const AcwSettingsModal: React.FC<AcwSettingsModalProps> = ({
  isOpen,
  currentDuration,
  onApply,
  onClose,
}) => {
  const matchingPreset = useMemo(
    () => PRESETS.find(p => p.seconds === currentDuration)?.seconds ?? null,
    [currentDuration]
  );

  const [selectedPreset, setSelectedPreset] = useState<number | null>(matchingPreset);
  const [isCustomMode, setIsCustomMode] = useState(matchingPreset === null);
  const [customMinutes, setCustomMinutes] = useState(Math.floor(currentDuration / 60));
  const [customSeconds, setCustomSeconds] = useState(currentDuration % 60);

  const handlePresetClick = (seconds: number) => {
    setSelectedPreset(seconds);
    setIsCustomMode(false);
  };

  const handleCustomMode = () => {
    setIsCustomMode(true);
    setSelectedPreset(null);
  };

  const canApply = isCustomMode
    ? (customMinutes * 60 + customSeconds) > 0
    : selectedPreset !== null;

  const handleApply = () => {
    if (isCustomMode) {
      const total = customMinutes * 60 + customSeconds;
      if (total > 0) onApply(total);
    } else if (selectedPreset) {
      onApply(selectedPreset);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent width={288} className="p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <Icon iconType={['system', 'time']} size={16} color="warning" />
            후처리 시간 설정
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {PRESETS.map(preset => (
            <Button
              key={preset.seconds}
              onClick={() => handlePresetClick(preset.seconds)}
              buttonStyle={selectedPreset === preset.seconds && !isCustomMode ? 'primary' : 'secondary'}
              size="sm"
            >
              {preset.label}
            </Button>
          ))}
          <Button
            onClick={handleCustomMode}
            buttonStyle={isCustomMode ? 'primary' : 'secondary'}
            size="sm"
          >
            직접 설정
          </Button>
        </div>

        {isCustomMode && (
          <div className="flex items-center justify-center gap-3 mb-3 p-2.5 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-1">
              <Input
                variant="quantity"
                value={customMinutes}
                onChange={(value: number) => setCustomMinutes(Math.max(0, Math.min(59, value)))}
                min={0}
                max={59}
                step={1}
                size="sm"
                width={56}
              />
              <span className="text-xs text-gray-600">분</span>
            </div>
            <div className="flex items-center gap-1">
              <Input
                variant="quantity"
                value={customSeconds}
                onChange={(value: number) => setCustomSeconds(Math.max(0, Math.min(59, value)))}
                min={0}
                max={59}
                step={1}
                size="sm"
                width={56}
              />
              <span className="text-xs text-gray-600">초</span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            buttonStyle="primary"
            size="sm"
            fullWidth
            onClick={handleApply}
            disabled={!canApply}
          >
            적용
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AcwSettingsModal;
