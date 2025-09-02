import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Услуги аренды авто — TopCar Club Алматы',
  description: 'Аренда с водителем, трансфер в аэропорт, автомобили на мероприятия и другие премиум-услуги TopCar Club в Алматы. Подберём решение под ваши задачи.',
  alternates: { canonical: 'https://topcar.club/services' },
  robots: { index: true, follow: true },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}