import { BlockStatus } from '../types';

const STORAGE_KEY = 'customer_block_status';
const CHIPS_STORAGE_KEY = 'blockReasons_chips';

const DEFAULT_BLOCK_REASON_CHIPS = [
  '욕설/폭언',
  '성희롱',
  '반복 민원',
  '사기 의심',
  '기타',
];

function getAllBlockStatuses(): Record<string, BlockStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllBlockStatuses(statuses: Record<string, BlockStatus>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
}

export function blockCustomer(customerId: string, reason: string, blockedBy: string): BlockStatus {
  const statuses = getAllBlockStatuses();
  const status: BlockStatus = {
    customerId,
    isBlocked: true,
    reason,
    blockedAt: new Date().toISOString(),
    blockedBy,
  };
  statuses[customerId] = status;
  saveAllBlockStatuses(statuses);
  return status;
}

export function unblockCustomer(customerId: string): void {
  const statuses = getAllBlockStatuses();
  delete statuses[customerId];
  saveAllBlockStatuses(statuses);
}

export function getBlockStatus(customerId: string): BlockStatus | null {
  const statuses = getAllBlockStatuses();
  return statuses[customerId] || null;
}

export function getBlockReasonChips(): string[] {
  try {
    const raw = localStorage.getItem(CHIPS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_BLOCK_REASON_CHIPS;
  } catch {
    return DEFAULT_BLOCK_REASON_CHIPS;
  }
}

export function saveBlockReasonChips(chips: string[]): void {
  localStorage.setItem(CHIPS_STORAGE_KEY, JSON.stringify(chips));
}
