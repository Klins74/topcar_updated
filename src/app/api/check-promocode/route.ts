// Файл: src/app/api/check-promocode/route.ts

import { getSupabase } from '@/lib/supabase'; // Используем публичный клиент
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Поскольку RLS отключен (видно на вашем скриншоте),
  // мы можем использовать публичный клиент Supabase без авторизации.
  const supabase = getSupabase();

  try {
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ message: 'Промокод не предоставлен' }, { status: 400 });
    }

    const { data: promocode, error } = await supabase
      .from('public_promocodes')
      .select('code, discount_percentage, is_active, usage_limit, times_used, expires_at')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !promocode) {
      return NextResponse.json({ message: 'Промокод не найден' }, { status: 404 });
    }

    if (!promocode.is_active) {
      return NextResponse.json({ message: 'Промокод больше не действителен' }, { status: 410 });
    }
    
    // Проверки на лимиты и дату (можно будет добавить позже)

    return NextResponse.json({
      message: 'Промокод успешно применен!',
      discount: promocode.discount_percentage,
      code: promocode.code
    });

  } catch (err) {
    return NextResponse.json({ message: 'Ошибка на сервере' }, { status: 500 });
  }
}