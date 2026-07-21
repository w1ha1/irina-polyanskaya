import { ImageResponse } from 'next/og';
import { content, type Locale } from '@/content';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }];
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const c = content[locale];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F6F1E9',
          color: '#1B1714',
        }}
      >
        <div style={{ fontSize: 20, letterSpacing: 4, color: '#7A2331', textTransform: 'uppercase' }}>
          {c.hero.kicker}
        </div>
        <div style={{ fontSize: 72, marginTop: 20 }}>{c.hero.name}</div>
        <div style={{ fontSize: 28, marginTop: 20, maxWidth: 800, textAlign: 'center', color: '#1B171499' }}>
          {c.hero.subhead}
        </div>
      </div>
    ),
    { ...size }
  );
}
