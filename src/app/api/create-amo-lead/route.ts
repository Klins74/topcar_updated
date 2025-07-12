import { NextResponse } from 'next/server';
import axios from 'axios';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

// ——— VERIFY ENV VARS ———
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[setup error] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set!');
}

// Supabase client is created lazily to avoid requiring env vars during build

// ——— Types ———
interface BookingDetails {
  price: number;
  [key: string]: unknown;
}

// === Get / Save Tokens ====================================
async function getTokens() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('tokens')
    .select('access_token, refresh_token')
    .eq('id', 'amocrm')
    .single();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  if (!data) throw new Error('Token row id="amocrm" not found');
  return { accessToken: data.access_token, refreshToken: data.refresh_token };
}

async function saveTokens(access: string, refresh: string) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('tokens')
    .update({ access_token: access, refresh_token: refresh, updated_at: new Date().toISOString() })
    .eq('id', 'amocrm');
  if (error) throw new Error(`Supabase update error: ${error.message}`);
}

// === OAuth Refresh ========================================
async function refreshAccessToken(refreshToken: string): Promise<string> {
  const { data } = await axios.post(
    `${process.env.AMOCRM_SUBDOMAIN}/oauth2/access_token`,
    {
      grant_type: 'refresh_token',
      client_id:   process.env.AMOCRM_CLIENT_ID,
      client_secret: process.env.AMOCRM_CLIENT_SECRET,
      refresh_token:  refreshToken,
      redirect_uri:   process.env.AMOCRM_REDIRECT_URI
    }
  );
  await saveTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

// === Lead / Contact =======================================
async function sendLeadRequest(
  token: string,
  apiUrl: string,
  carName: string,
  userName: string,
  userPhone: string,
  booking: BookingDetails
) {
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  let contactId: number | null = null;
  try {
    const { data } = await axios.get(`${apiUrl}/contacts`, { headers, params: { query: userPhone }});
    if (data?._embedded?.contacts?.[0]) {
      contactId = data._embedded.contacts[0].id;
    } else {
      const createRes = await axios.post(
        `${apiUrl}/contacts`,
        [{ name: userName, custom_fields_values: [{ field_code: 'PHONE', values: [{ value: userPhone, enum_code: 'WORK' }] }] }],
        { headers }
      );
      contactId = createRes.data._embedded.contacts[0].id;
    }
  } catch (err) {
    console.warn('[sendLead] contact error:', err);
  }

  const lead = [{
    name: `Заявка с сайта: ${carName} - ${userName}`,
    price: booking.price,
    _embedded: { contacts: contactId ? [{ id: contactId }] : [] }
  }];

  return axios.post(`${apiUrl}/leads`, lead, { headers });
}

// === POST handler =========================================
export async function POST(request: Request) {
  try {
    const { carName, userName, userPhone, bookingDetails } = await request.json();

    if (!carName || !userName || !userPhone || !bookingDetails) {
      return NextResponse.json({ message: 'Отсутствуют обязательные поля' }, { status: 400 });
    }

    const apiUrl = `${process.env.AMOCRM_SUBDOMAIN}/api/v4`;
    const { accessToken: initialToken, refreshToken } = await getTokens();
    let accessToken = initialToken;

    try {
      const res = await sendLeadRequest(accessToken, apiUrl, carName, userName, userPhone, bookingDetails);
      return NextResponse.json({ message: 'Сделка успешно создана!', leadId: res.data?._embedded?.leads?.[0]?.id }, { status: 200 });

    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        accessToken = await refreshAccessToken(refreshToken);
        const retry = await sendLeadRequest(accessToken, apiUrl, carName, userName, userPhone, bookingDetails);
        return NextResponse.json({ message: 'Сделка создана после обновления токена!', leadId: retry.data?._embedded?.leads?.[0]?.id }, { status: 200 });
      }
      throw err;
    }

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('🔥 REAL SERVER ERROR:', msg);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

