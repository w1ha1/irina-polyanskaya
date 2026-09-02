import { ru } from './ru';
import { en } from './en';
import { hy } from './hy';
import type { Locale, SiteContent } from './types';

export const content: Record<Locale, SiteContent> = { ru, en, hy };
export type { Locale, SiteContent };
