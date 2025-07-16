// src/app/api/create-amo-lead/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import nodemailer from 'nodemailer'; // <--- ДОБАВЛЕНО: Импорт Nodemailer

// ——— VERIFY ENV VARS ———
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[setup error] SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не установлен!');
}

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
  if (!data) throw new Error('Строка токена id="amocrm" не найдена');
  return { accessToken: data.access_token, refreshToken: data.refresh_token };
}

async function saveTokens(access: string, refresh: string) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('tokens')
    .update({ access_token: access, refresh_token: refresh, updated_at: new Date().toISOString() })
    .eq('id', 'amocrm');
  if (error) throw new Error(`Ошибка обновления Supabase: ${error.message}`);
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
    console.warn('[sendLead] Ошибка контакта:', err);
  }

  const lead = [{
    name: `Заявка с сайта: ${carName} - ${userName}`,
    price: booking.price,
    _embedded: { contacts: contactId ? [{ id: contactId }] : [] }
  }];

  return axios.post(`${apiUrl}/leads`, lead, { headers });
}

// <--- ДОБАВЛЕНО: Новая асинхронная функция для отправки Email
async function sendEmail(carName: string, userName: string, userPhone: string, bookingDetails: BookingDetails) {
  // Проверка наличия всех необходимых переменных окружения для email
  if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_PORT ||
      !process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD ||
      !process.env.EMAIL_FROM || !process.env.EMAIL_TO) {
    console.error('Email-переменные окружения не настроены полностью. Email не будет отправлен.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT, 10), // Порт должен быть числом
    secure: process.env.EMAIL_SERVER_PORT === '465', // Установите true, если порт 465 (SSL), иначе false (TLS)
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `Новая заявка с сайта TopCar: ${carName}`, // Тема письма
    html: `
      <p>Привет!</p>
      <p>Получена новая заявка с сайта TopCar:</p>
      <ul>
        <li>**Автомобиль**: <strong>${carName}</strong></li>
        <li>**Имя клиента**: <strong>${userName}</strong></li>
        <li>**Телефон клиента**: <strong>${userPhone}</strong></li>
        <li>**Детали бронирования**:
          <ul>
            <li>Цена: ${bookingDetails.price}</li>
            ${Object.entries(bookingDetails).map(([key, value]) => {
              if (key !== 'price') { // Исключаем поле 'price', так как оно уже выведено
                return `<li>${key}: ${JSON.stringify(value)}</li>`; // Используйте JSON.stringify для сложных объектов/массивов
              }
              return '';
            }).join('')}
          </ul>
        </li>
      </ul>
      <p>Эта заявка также была автоматически отправлена в AmoCRM.</p>
      <p>С наилучшими пожеланиями,</p>
      <p>Ваш сайт TopCar.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email с заявкой успешно отправлен.');
  } catch (emailError) {
    console.error('Ошибка при отправке email:', emailError);
  }
}
// ДОБАВЛЕННЫЙ КОД ЗАКОНЧИЛСЯ ^^^

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
      console.log('Сделка успешно создана в AmoCRM:', res.data?._embedded?.leads?.[0]?.id);

      // <--- ВЫЗОВ ФУНКЦИИ ОТПРАВКИ EMAIL ПОСЛЕ УСПЕШНОЙ ОТПРАВКИ В AMOCRM
      await sendEmail(carName, userName, userPhone, bookingDetails);

      return NextResponse.json({ message: 'Сделка успешно создана и email отправлен!', leadId: res.data?._embedded?.leads?.[0]?.id }, { status: 200 });

    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        accessToken = await refreshAccessToken(refreshToken);
        const retry = await sendLeadRequest(accessToken, apiUrl, carName, userName, userPhone, bookingDetails);
        console.log('Сделка создана после обновления токена в AmoCRM:', retry.data?._embedded?.leads?.[0]?.id);
        // <--- ВЫЗОВ ФУНКЦИИ ОТПРАВКИ EMAIL ПОСЛЕ УСПЕШНОЙ ОТПРАВКИ В AMOCRM (ПОВТОРНАЯ ПОПЫТКА)
        await sendEmail(carName, userName, userPhone, bookingDetails);
        return NextResponse.json({ message: 'Сделка создана после обновления токена и email отправлен!', leadId: retry.data?._embedded?.leads?.[0]?.id }, { status: 200 });
      }
      throw err;
    }

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('🔥 РЕАЛЬНАЯ ОШИБКА СЕРВЕРА:', msg);
      return NextResponse.json({ message: msg }, { status: 500 });
    }
  }