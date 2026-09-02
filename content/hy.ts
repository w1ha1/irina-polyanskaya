import type { SiteContent } from './types';

// Machine/self-translated draft (RU is the source of truth this was translated
// from — see AGENTS.md / conversation history). Flagged for a native Armenian
// speaker to review before this is trusted in front of Armenian-speaking clients.
export const hy: SiteContent = {
  meta: {
    title: 'Իրինա Պոլյանսկայա — լուսանկարիչ Գյումրիում և Երևանում',
    description:
      'Դիմանկարային և love story նկարահանումներ Գյումրիում և Երևանում։ Դիտեք պորտֆոլիոն և գրանցվեք լուսանկարահանման։',
  },
  nav: {
    about: 'Իմ մասին',
    portfolio: 'Պորտֆոլիո',
    services: 'Ծառայություններ',
    pricing: 'Գներ',
    contacts: 'Կոնտակտներ',
    bookCta: 'Գրանցվել',
  },
  hero: {
    kicker: 'ԼՈՒՍԱՆԿԱՐԻՉ · ԵՐԵՒԱՆ · ԳՅՈՒՄՐԻ',
    name: 'Իրինա Պոլյանսկայա',
    subhead: 'Հեղինակային նկարահանումներ կինոյի ատմոսֆերայով\nLove Story & portraits\nՆկարահանում եմ Երևանում / Գյումրիում',
    ctaPrimary: 'Գրանցվել նկարահանման',
    ctaSecondary: 'Դիտել աշխատանքները',
  },
  about: {
    heading: 'Իմ մասին',
    body: 'Ես Իրինան եմ, պրոֆեսիոնալ լուսանկարիչ՝ մարդկանց հիշարժան պատկերներ ստեղծելու փորձով։ Իմ աշխատանքը կենտրոնացած է դիմանկարային լուսանկարչության վրա, և ես կրքոտ եմ եզակի պահերն ու հույզերը գրավելու հարցում։ Իմ ոճը թույլ է տալիս ստեղծել լուսանկարներ, որոնք արտացոլում են ձեր անհատականությունն ու առանձնահատկությունները։',
  },
  portfolioTeaser: {
    heading: 'Պորտֆոլիո',
    viewAll: 'Դիտել ամբողջ պորտֆոլիոն',
  },
  services: {
    heading: 'Ծառայություններ',
    items: [
      { title: 'Դիմանկարային նկարահանում', description: 'Անհատական՝ շեշտը դնելով բնականության և բնավորության վրա։' },
      { title: 'Love story', description: 'Զույգի նկարահանում' },
      { title: 'Միջոցառումների նկարահանում', description: '?' },
      { title: 'Ընտանեկան նկարահանում', description: '?' },
    ],
  },
  pricing: {
    heading: 'Գներ',
    cityToggle: { gyumri: 'Գյումրի', yerevan: 'Երևան' },
    tiers: [
      {
        name: 'STANDARD',
        priceByCity: { gyumri: '40 000 ֏', yerevan: '50 000 ֏' },
        features: [
          '1–1.5 ժամ նկարահանում',
          '1–2 կերպար',
          '50–70 մշակված լուսանկար',
          'Օգնություն վայրի ընտրության և կերպարի հետ',
          'Օգնություն դիրքավորման հարցում',
        ],
      },
      {
        name: 'EXPRESS',
        priceByCity: { gyumri: '25 000 ֏', yerevan: '35 000 ֏' },
        features: [
          'Մինչև 30 րոպե նկարահանում',
          '1 կերպար / 1 վայր',
          '20–25 մշակված լուսանկար',
          'Օգնություն դիրքավորման հարցում',
        ],
      },
    ],
    footnote: 'Լրացուցիչ մշակված լուսանկար՝ 1500 ֏։ Ստուդիան և դիմահարդարը վճարվում են առանձին։',
  },
  contacts: {
    heading: 'Կոնտակտներ',
    location: 'Երևան, Գյումրի, Հայաստան',
    telegramLabel: 'Telegram',
    instagramLabel: 'Instagram',
    bookingMessage: 'Բարև Ձեզ! Ուզում եմ գրանցվել լուսանկարահանման։',
  },
  gallery: {
    heading: 'Պորտֆոլիո',
  },
  footer: {
    rights: 'Իրինա Պոլյանսկայա',
  },
};
