import React from 'react';
import { Button } from '@blumnai-studio/blumnai-design-system';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex h-full min-h-[120px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
      {actionLabel && onAction && (
        <Button
          buttonStyle="primary"
          size="xs"
          onClick={onAction}
          className="mt-3"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
