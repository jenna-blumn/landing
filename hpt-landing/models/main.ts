import { StaticImageData } from 'next/image';

export enum ExperienceTab {
  ADMIN = 'admin',
  MANAGER = 'manager',
  COUNSELOR = 'counselor',
}

export interface ExperienceTabItem {
  id: ExperienceTab;
  label: string;
  image: StaticImageData;
  title: string;
  points: string[];
}

export interface ReviewItem {
  id: string;
  image: StaticImageData;
  logo: StaticImageData;
  company: string;
  review: string;
}

export interface ChatMessage {
  id: string;
  isUser: boolean;
  message: string;
}

export enum HeaderTheme {
  LIGHT = 'light',
  BLUR = 'blur',
}
