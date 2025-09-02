import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — TopCar Club',
  description: 'Как мы собираем, используем и защищаем ваши данные при бронировании и использовании сайта TopCar Club.',
  alternates: { canonical: 'https://topcar.club/privacy-policy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}