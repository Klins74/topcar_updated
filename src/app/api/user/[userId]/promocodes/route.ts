// /app/api/user/[userId]/promocodes/route.ts
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json({ message: 'Valid User ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('promo_codes')
      .select('id, code, discount_percent, is_active')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching promo codes for user:', userId, error);
      throw new Error('Database query failed.');
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error(`API Error for user ${params.userId}:`, error);
    return NextResponse.json({ message: `Server error: ${error.message}` }, { status: 500 });
  }
}