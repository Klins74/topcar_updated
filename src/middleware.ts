// Файл: src/middleware.ts

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Создаем серверный клиент Supabase, используя куки из запроса
  const supabase = createMiddlewareClient({ req, res });

  // Получаем информацию о текущем пользователе
  const { data: { user } } = await supabase.auth.getUser();

  // Проверяем, является ли пользователь администратором
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  // Если пользователь пытается зайти в /admin, но он не админ,
  // перенаправляем его на главную страницу.
  if (!isAdmin && req.nextUrl.pathname.startsWith('/admin')) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Если все в порядке, разрешаем доступ к странице
  return res;
}

// Указываем, что этот middleware должен работать для всех маршрутов,
// начинающихся с /admin/
export const config = {
  matcher: '/admin/:path*',
};