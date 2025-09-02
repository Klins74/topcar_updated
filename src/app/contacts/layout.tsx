import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты TopCar Club — аренда элитных авто в Алматы 24/7',
  description: 'Контакты TopCar Club для аренды элитных авто и электрокаров в Алматы. Адрес: ул. Байтурсынова, 179/2. Телефон: +7 (777) 666-02-95. WhatsApp, Telegram. Premium car rental contacts, elite vehicles for tourists in Almaty.',
  keywords: 'контакты TopCar, аренда элитных авто Алматы, телефон бронирования, электрокары для туристов, premium car rental contacts, elite car booking Almaty',
  alternates: { canonical: 'https://topcar.club/contacts' },
  robots: { index: true, follow: true },
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}