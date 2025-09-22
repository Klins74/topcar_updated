// src/app/api/create-amo-lead/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Ленивая инициализация Resend только при наличии ключа
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

const {
  AMOCRM_SUBDOMAIN,
  AMOCRM_CLIENT_ID,
  AMOCRM_CLIENT_SECRET,
  AMOCRM_REDIRECT_URI,
  AMOCRM_AUTH_CODE,
} = process.env;

// Функция получения токена доступа (остается без изменений)
async function getAccessToken() {
  const url = `${AMOCRM_SUBDOMAIN}/oauth2/access_token`;
  const body = {
    client_id: AMOCRM_CLIENT_ID,
    client_secret: AMOCRM_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: AMOCRM_AUTH_CODE,
    redirect_uri: AMOCRM_REDIRECT_URI,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ошибка получения токена: ${JSON.stringify(errorData)}`);
    }
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Не удалось получить access token:', error);
    throw error;
  }
}

// Основной обработчик запроса
export async function POST(req: NextRequest) {
  try {
    const { userName, userPhone, carName, bookingDetails } = await req.json();

    // 1. Отправка данных в amoCRM (без изменений)
    try {
      const accessToken = await getAccessToken();
      const url = `${AMOCRM_SUBDOMAIN}/api/v4/leads/complex`;
      const leadData = [{
        name: `Заявка на ${carName} от ${userName}`,
        price: bookingDetails.price,
        _embedded: {
          contacts: [{
            first_name: userName,
            custom_fields_values: [{
              field_code: 'PHONE',
              values: [{ value: userPhone }],
            }],
          }],
        },
      }];

      await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
    } catch (amoError) {
      console.error('Ошибка при работе с amoCRM:', amoError);
    }

    // 2. Отправка письма через Resend
    try {
      const resend = getResendClient();
      if (!resend) {
        console.warn('RESEND_API_KEY отсутствует — пропускаем отправку email');
      } else {
        await resend.emails.send({
        // ВАЖНО: Используем ваш подтвержденный домен
        from: 'Заявка с сайта <booking@topcar.club>',
        to: 'topcar_club@mail.ru', // Ваша почта для получения заявок
        subject: `Новая заявка: ${carName}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2>Новая заявка с сайта TopCar</h2>
            <p><strong>Имя клиента:</strong> ${userName}</p>
            <p><strong>Телефон:</strong> ${userPhone}</p>
            <p><strong>Автомобиль:</strong> ${carName}</p>
            <p><strong>Детали:</strong> ${bookingDetails.duration}</p>
          </div>
        `,
        });
      }
    } catch (emailError) {
      console.error('Ошибка отправки email:', emailError);
    }

    return NextResponse.json({ message: 'Заявка успешно обработана' }, { status: 200 });

  } catch (error) {
    console.error('Общая ошибка в обработчике:', error);
    return NextResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}