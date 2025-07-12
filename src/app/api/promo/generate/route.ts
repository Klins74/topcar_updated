// /app/api/promo/generate/route.ts
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function generatePromoCode(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    // Пытаемся получить userId из тела запроса. Если его нет, userId будет undefined.
    const { userId } = (await request.json().catch(() => ({}))) as { userId?: number };

    const newCode = generatePromoCode(10);
    const discount = 15;

    const { data, error } = await supabase
      .from('promo_codes')
      .insert({
        code: newCode,
        discount_percent: discount,
        is_active: true,
        user_id: userId, // Безопасно присваиваем userId, даже если он undefined
      })
      .select()
      .single();

    if (error) {
      // Эта ошибка может возникнуть, если код неуникален (почти невозможно)
      // или если user_id не существует в таблице users.
      console.error('Supabase insert error:', error);
      throw new Error('Не удалось создать промокод в базе данных.');
    }

    return NextResponse.json({
      message: 'Промокод успешно сгенерирован!',
      promoCode: data,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Ошибка генерации промокода:', error);
    return NextResponse.json({ message: `Внутренняя ошибка сервера: ${error.message}` }, { status: 500 });
  }
}