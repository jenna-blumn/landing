export type UserRole = 'consultant' | 'manager';

export interface AuthConfig {
  userId: string;
  userName: string;
  role: UserRole;
  token: string;
  avatar?: string;
  groupId?: string;
}
