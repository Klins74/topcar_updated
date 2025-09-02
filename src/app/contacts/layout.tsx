import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты TopCar Club — аренда авто в Алматы 24/7',
  description: 'Адрес: Алматы, ул. Байтурсынова, 179/2. Телефон: +7 (777) 666-02-95. WhatsApp и Telegram. Свяжитесь с нами для бронирования премиум-авто.',
  alternates: { canonical: 'https://topcar.club/contacts' },
  robots: { index: true, follow: true },
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}