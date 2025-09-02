import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Безопасность и документы — лицензии, сертификаты | TopCar',
  description:
    'Официальные документы TopCar: лицензия на деятельность, сертификат соответствия и политика страхования. Прозрачность и надежность сервиса.',
  alternates: { canonical: 'https://topcar.club/security' },
  robots: { index: true, follow: true },
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}