import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Админ-панель — TopCar',
  description: 'Внутренняя панель управления автопарком, услугами и контентом. Доступ только для авторизованных сотрудников.',
  alternates: { canonical: 'https://topcar.club/admin' },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}