import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Скачать приложение TopCar — установите PWA на главный экран',
  description: 'Установите прогрессивное веб‑приложение TopCar на главный экран: быстрый доступ к автопарку, бронированию и эксклюзивным предложениям.',
  alternates: { canonical: 'https://topcar.club/download' },
  robots: { index: true, follow: true },
};

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}