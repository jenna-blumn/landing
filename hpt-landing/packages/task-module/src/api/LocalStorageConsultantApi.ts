import type { Consultant, ConsultantGroup } from '../types/consultant';
import type { IConsultantApi } from './IConsultantApi';

const mockConsultants: Consultant[] = [
  { id: 'c1', name: '\uAE40\uC0C1\uB2F4', status: 'available', currentLoad: 3, groupId: 'g1' },
  { id: 'c2', name: '\uC774\uC0C1\uB2F4', status: 'available', currentLoad: 5, groupId: 'g1' },
  { id: 'c3', name: '\uBC15\uC0C1\uB2F4', status: 'busy', currentLoad: 8, groupId: 'g1' },
  { id: 'c4', name: '\uCD5C\uC0C1\uB2F4', status: 'available', currentLoad: 2, groupId: 'g2' },
  { id: 'c5', name: '\uC815\uC0C1\uB2F4', status: 'away', currentLoad: 0, groupId: 'g2' },
  { id: 'c6', name: '\uAC15\uC0C1\uB2F4', status: 'available', currentLoad: 4, groupId: 'g2' },
  { id: 'c7', name: '\uC870\uC0C1\uB2F4', status: 'busy', currentLoad: 6, groupId: 'g3' },
  { id: 'c8', name: '\uC724\uC0C1\uB2F4', status: 'available', currentLoad: 1, groupId: 'g3' },
  { id: 'c9', name: '\uC7A5\uC0C1\uB2F4', status: 'available', currentLoad: 3, groupId: 'g3' },
  { id: 'c10', name: '\uD55C\uC0C1\uB2F4', status: 'away', currentLoad: 0, groupId: 'g1' },
];

const mockConsultantGroups: ConsultantGroup[] = [
  {
    id: 'g1',
    name: '\uC77C\uBC18\uC0C1\uB2F4\uD300',
    description: '\uC77C\uBC18 \uACE0\uAC1D \uBB38\uC758 \uBC0F \uAE30\uBCF8 \uC0C1\uB2F4 \uCC98\uB9AC',
    memberIds: ['c1', 'c2', 'c3', 'c10'],
  },
  {
    id: 'g2',
    name: '\uAE30\uC220\uC9C0\uC6D0\uD300',
    description: '\uAE30\uC220\uC801 \uBB38\uC81C \uD574\uACB0 \uBC0F \uC81C\uD488 \uC9C0\uC6D0',
    memberIds: ['c4', 'c5', 'c6'],
  },
  {
    id: 'g3',
    name: 'VIP\uC804\uB2F4\uD300',
    description: 'VIP \uACE0\uAC1D \uC804\uB2F4 \uC0C1\uB2F4 \uBC0F \uD504\uB9AC\uBBF8\uC5C4 \uC11C\uBE44\uC2A4',
    memberIds: ['c7', 'c8', 'c9'],
  },
];

export class LocalStorageConsultantApi implements IConsultantApi {
  async getAllConsultants(): Promise<Consultant[]> {
    return mockConsultants;
  }

  async getAllGroups(): Promise<ConsultantGroup[]> {
    return mockConsultantGroups;
  }

  async getConsultantById(id: string): Promise<Consultant | undefined> {
    return mockConsultants.find(c => c.id === id);
  }

  async getConsultantsByGroupId(groupId: string): Promise<Consultant[]> {
    return mockConsultants.filter(c => c.groupId === groupId);
  }

  async getGroupById(id: string): Promise<ConsultantGroup | undefined> {
    return mockConsultantGroups.find(g => g.id === id);
  }
}
