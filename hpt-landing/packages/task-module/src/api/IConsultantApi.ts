import type { Consultant, ConsultantGroup } from '../types/consultant';

export interface IConsultantApi {
  getAllConsultants(): Promise<Consultant[]>;
  getAllGroups(): Promise<ConsultantGroup[]>;
  getConsultantById(id: string): Promise<Consultant | undefined>;
  getConsultantsByGroupId(groupId: string): Promise<Consultant[]>;
  getGroupById(id: string): Promise<ConsultantGroup | undefined>;
}
