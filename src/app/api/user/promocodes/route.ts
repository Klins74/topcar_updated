// Файл: src/app/api/user/promocodes/route.ts (Финальная версия)

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Пользователь не авторизован' }, { status: 401 });
    }

    const { data: promocodes, error } = await supabase
      .from('promocodes')
      .select('*')
      .eq('user_id', user.id) // Ищем промокоды, привязанные к ID текущего пользователя
      .order('created_at', { ascending: false }); // Новые сверху

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(promocodes);

  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}