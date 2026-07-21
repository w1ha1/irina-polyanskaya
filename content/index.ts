import { ru } from './ru';
import { en } from './en';
import type { Locale, SiteContent } from './types';

export const content: Record<Locale, SiteContent> = { ru, en };
export type { Locale, SiteContent };
