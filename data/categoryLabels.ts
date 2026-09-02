/**
 * Single source of truth for a category's display text, in both languages.
 * Order here is the preferred display order for filter pills. A category id
 * not listed here (a brand new folder under assets/source-photos/) still
 * works everywhere — it just falls back to showing its raw id as the label
 * until a nicer translation is added here.
 */
export const categoryLabels: Record<string, { ru: string; en: string; hy: string }> = {
  portrait: { ru: 'Портрет', en: 'Portrait', hy: 'Դիմանկար' },
  'love-story': { ru: 'Love story', en: 'Love story', hy: 'Love story' },
  'fashion-night': { ru: 'Фэшн/Ночная съёмка', en: 'Fashion/Night', hy: 'Ֆեշն/գիշերային նկարահանում' },
};
