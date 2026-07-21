import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cormorant, manrope, jetbrainsMono } from '../fonts';
import { content, type Locale } from '@/content';
import { SmoothScrollProvider } from '@/components/ui/SmoothScrollProvider';
import { CustomCursor } from '@/components/ui/CustomCursor';
import '../globals.css';

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = content[locale];
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { canonical: locale === 'ru' ? '/' : '/en' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  // Next.js 16 generates a strict `LayoutProps<'/[locale]'>` type for the default
  // export (params: Promise<{ locale: string }>) and checks the layout component
  // against it at build time. Page components get a `& any` escape hatch in the
  // generated type, but layout components do not, so narrowing to `Locale` here
  // (as the brief originally specified) fails `next build`'s typecheck. Widening
  // to `string` matches Next's generated contract; `generateStaticParams` still
  // guarantees only 'ru' | 'en' are ever produced.
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} className={`${cormorant.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-paper text-ink antialiased">
        <SmoothScrollProvider>
          <CustomCursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
