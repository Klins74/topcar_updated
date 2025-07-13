// Файл: src/app/api/admin/generate-promocode/route.ts (Улучшенная версия)

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Функция для генерации случайного кода
function generatePromoCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(request: Request) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            return NextResponse.json({ message: 'Доступ запрещен: требуется авторизация администратора.' }, { status: 403 });
        }

        const { target_user_id, discount } = await request.json();
        if (!target_user_id || !discount) {
            return NextResponse.json({ message: 'Неверный запрос: не указан ID пользователя или размер скидки.' }, { status: 400 });
        }

        const newCode = {
            user_id: target_user_id,
            code: generatePromoCode(),
            discount_percentage: discount,
            is_active: true,
        };

        const { data, error } = await supabase
            .from('promocodes')
            .insert(newCode)
            .select()
            .single();

        // --- УЛУЧШЕНИЕ ЗДЕСЬ ---
        // Если есть ошибка от Supabase, мы ее пробрасываем дальше
        if (error) {
            throw error;
        }

        return NextResponse.json(data);

    } catch (error: any) {
        // Теперь мы возвращаем КОНКРЕТНОЕ сообщение об ошибке от Supabase
        console.error('API Error generating promocode:', error); // Логируем полную ошибку на сервере
        return NextResponse.json(
            { 
                message: 'Ошибка базы данных.',
                details: error.message // Добавляем детали для отладки
            }, 
            { status: 500 }
        );
    }
}