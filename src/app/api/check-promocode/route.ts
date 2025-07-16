// src/app/api/check-promocode/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type PromoCode } from '@/types'; // Убедитесь, что PromoCode обновлен в types/index.ts

export async function POST(request: Request) {
    const { code } = await request.json();
    if (!code) {
        return NextResponse.json({ message: 'Промокод не предоставлен' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
        const { data, error } = await supabase
            .from('public_promocodes') // Убедитесь, что имя таблицы корректно
            .select('*')
            .eq('code', code.toUpperCase())
            .single();

        if (error || !data) {
            return NextResponse.json({ message: 'Неверный или истекший промокод' }, { status: 404 });
        }

        const promoCode: PromoCode = data; // Проверяем, что это наш тип PromoCode
        
        if (!promoCode.is_active) {
            return NextResponse.json({ message: 'Промокод неактивен' }, { status: 400 });
        }

        // Проверка срока действия
        // Добавлена проверка на существование promoCode.expires_at
        if (promoCode.expires_at) { 
            const now = new Date();
            const expiryDate = new Date(promoCode.expires_at);
            if (now > expiryDate) {
                return NextResponse.json({ message: 'Срок действия промокода истек' }, { status: 400 });
            }
        }
        
        // Проверка лимита использования
        // Добавлены проверки на существование usage_limit и times_used
        if (promoCode.usage_limit !== undefined && promoCode.usage_limit !== null &&
            promoCode.times_used !== undefined && promoCode.times_used !== null &&
            promoCode.times_used >= promoCode.usage_limit) {
            return NextResponse.json({ message: 'Лимит использований промокода исчерпан' }, { status: 400 });
        }

        return NextResponse.json({ 
            message: 'Промокод действителен', 
            discount: promoCode.discount_percent, // ИСПРАВЛЕНО: с discount_perc на discount_percent
            code: promoCode.code
        }, { status: 200 });

    } catch (error: unknown) { // Типизация ошибки
        console.error('Ошибка проверки промокода:', error);
        const errorMessage = error instanceof Error ? error.message : 'Внутренняя ошибка сервера';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}