import { content, type Locale } from '@/content';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function SiteFooter({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <footer id="contacts" className="border-t border-ink/10 px-6 py-16">
      <h2 className="font-display text-3xl">{c.contacts.heading}</h2>
      <p className="mt-2 font-mono text-sm uppercase tracking-wider text-ink/70">{c.contacts.location}</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <MagneticButton href={`https://t.me/polka977?text=${encodeURIComponent(c.contacts.bookingMessage)}`}>
          {c.contacts.telegramLabel}
        </MagneticButton>
        <MagneticButton href="https://instagram.com/polyanskaya_photo7">{c.contacts.instagramLabel}</MagneticButton>
      </div>
      <p className="mt-12 font-mono text-[11px] uppercase tracking-wider text-ink/50">
        © {new Date().getFullYear()} {c.footer.rights}
      </p>
    </footer>
  );
}
