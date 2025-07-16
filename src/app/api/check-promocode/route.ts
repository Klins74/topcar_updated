// src/app/api/check-promocode/route.ts
import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type PromoCode } from '@/types';

export async function POST(request: Request) {
    const { code } = await request.json();
    if (!code) {
        return NextResponse.json({ message: 'Промокод не предоставлен' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    try {
        const { data, error } = await supabase
            .from('promocodes')
            .select('*')
            .eq('code', code.toUpperCase())
            .single();

        if (error || !data) {
            return NextResponse.json({ message: 'Неверный или истекший промокод' }, { status: 404 });
        }

        const promoCode: PromoCode = data;
        
        // Теперь этот код будет работать, так как тип PromoCode содержит нужные поля
        const now = new Date();
        const expiryDate = new Date(promoCode.expiry_date);
        if (now > expiryDate) {
             return NextResponse.json({ message: 'Срок действия промокода истек' }, { status: 400 });
        }

        if (promoCode.usage_limit !== null && promoCode.usage_count >= promoCode.usage_limit) {
            return NextResponse.json({ message: 'Лимит использований промокода исчерпан' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Промокод действителен', promocode: promoCode });

    } catch (err: unknown) { 
        return NextResponse.json({ message: (err as Error).message || 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}