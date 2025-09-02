import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Условия аренды автомобилей в Алматы — TopCar Club',
  description: 'Требования к арендатору, оплата, депозит, ограничения, территория эксплуатации, страхование и ответственность. Прозрачные правила аренды.',
  alternates: { canonical: 'https://topcar.club/terms' },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}