import { ChatMode } from '../modes/types';

export const getMaxRoomsForMode = (mode: ChatMode) => {
  switch (mode) {
    case '2x1': return 2;
    case 'single': return 1;
    case 'focus': return 10;
    case 'kanban': return 20;
    case 'grid':
    default: return 4;
  }
};
