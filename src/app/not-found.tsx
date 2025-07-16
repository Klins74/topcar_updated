// src/app/not-found.tsx
'use client'

import Link from 'next/link'
import { AuthProvider } from '@/components/AuthProvider'

export default function NotFound() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">404 – Страница не найдена</h1>
        <p className="text-lg mb-6">Извините, такой страницы не существует.</p>
        <Link href="/" className="text-blue-500 hover:underline">
          Вернуться на главную
        </Link>
      </div>
    </AuthProvider>
  )
}
export const dynamic = 'force-dynamic'
