// /app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ message: 'Пожалуйста, заполните все поля.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // 1. Проверяем, не занят ли email
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();
    
    // Игнорируем ошибку "не найдено строк", это нормальная ситуация
    if (findError && findError.code !== 'PGRST116') { 
        throw findError;
    }

    if (existingUser) {
      return NextResponse.json({ message: 'Пользователь с таким email уже существует.' }, { status: 409 });
    }

    // 2. Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Сохраняем нового пользователя в базу
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ name, email, phone, password: hashedPassword }])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Не возвращаем пароль на клиент
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ message: 'Регистрация прошла успешно!', user: userWithoutPassword }, { status: 201 });

  } catch (error: any) {
    console.error('Ошибка регистрации:', error);
    return NextResponse.json({ message: `Внутренняя ошибка сервера: ${error.message}` }, { status: 500 });
  }
}