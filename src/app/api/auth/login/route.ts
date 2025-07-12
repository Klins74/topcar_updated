// /app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email и пароль обязательны.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // 1. Находим пользователя по email
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError || !user) {
      return NextResponse.json({ message: 'Неверный email или пароль.' }, { status: 401 });
    }

    // 2. Сравниваем введенный пароль с хэшем в базе
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Неверный email или пароль.' }, { status: 401 });
    }

    // 3. Не возвращаем хэш пароля на клиент
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ message: 'Вход выполнен успешно!', user: userWithoutPassword }, { status: 200 });

  } catch (error: any) {
    console.error('Ошибка входа:', error);
    return NextResponse.json({ message: `Внутренняя ошибка сервера: ${error.message}` }, { status: 500 });
  }
}