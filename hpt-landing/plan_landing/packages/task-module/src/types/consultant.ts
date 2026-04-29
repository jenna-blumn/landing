export interface Consultant {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'away';
  currentLoad: number;
  groupId?: string;
}

export interface ConsultantGroup {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
}
