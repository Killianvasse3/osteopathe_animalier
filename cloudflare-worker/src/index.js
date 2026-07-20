const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...corsHeaders(origin) }
  });
}

function cleanText(value, maxLength = 100) {
  return typeof value === 'string'
    ? value.replace(/[\r\n\t]+/g, ' ').trim().slice(0, maxLength)
    : '';
}

async function verifyFirebaseUser(request, env) {
  const authorization = request.headers.get('Authorization') || '';
  if (!authorization.startsWith('Bearer ')) return null;

  const idToken = authorization.slice(7);
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.FIREBASE_API_KEY)}`,
    {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ idToken })
    }
  );

  if (!response.ok) return null;
  const result = await response.json();
  return result.users && result.users[0] ? result.users[0] : null;
}

function buildNotification(payload, env) {
  if (payload.type === 'contact_message') {
    const senderName = cleanText(payload.senderName) || 'un visiteur';
    return {
      title: '📧 Nouveau message de contact',
      message: `Nouveau message de ${senderName}`,
      data: {
        type: 'contact_message',
        messageId: cleanText(payload.messageId, 200)
      }
    };
  }

  if (payload.type === 'new_appointment') {
    const animalName = cleanText(payload.animalName) || 'un animal';
    const date = cleanText(payload.date, 30) || 'date à confirmer';
    const time = cleanText(payload.time, 10) || 'heure à confirmer';
    return {
      title: '📅 Nouveau rendez-vous',
      message: `${animalName} — ${date} à ${time}`,
      data: {
        type: 'new_appointment',
        appointmentId: cleanText(payload.appointmentId, 200)
      }
    };
  }

  return null;
}

async function sendOneSignalNotification(notification, env) {
  const response = await fetch('https://api.onesignal.com/notifications', {
    method: 'POST',
    headers: {
      ...JSON_HEADERS,
      'Authorization': `Key ${env.ONESIGNAL_REST_API_KEY}`
    },
    body: JSON.stringify({
      app_id: env.ONESIGNAL_APP_ID,
      target_channel: 'push',
      headings: { en: notification.title, fr: notification.title },
      contents: { en: notification.message, fr: notification.message },
      url: `${env.PUBLIC_SITE_URL}/#admin`,
      filters: [
        { field: 'tag', key: 'role', relation: '=', value: 'admin' }
      ],
      data: notification.data,
      idempotency_key: crypto.randomUUID()
    })
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`OneSignal ${response.status}: ${responseText}`);
  }
  return responseText ? JSON.parse(responseText) : {};
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'GET') {
      return new Response('Emmy Vasse notification worker: OK', { status: 200 });
    }

    if (origin !== env.ALLOWED_ORIGIN) {
      return jsonResponse({ error: 'Origine refusée' }, 403, env.ALLOWED_ORIGIN);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Méthode refusée' }, 405, origin);
    }

    const clientKey = request.headers.get('CF-Connecting-IP') || 'anonymous';
    const rateLimit = await env.NOTIFICATION_RATE_LIMITER.limit({ key: clientKey });
    if (!rateLimit.success) {
      return jsonResponse({ error: 'Trop de tentatives' }, 429, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: 'Corps JSON invalide' }, 400, origin);
    }

    const notification = buildNotification(payload, env);
    if (!notification) {
      return jsonResponse({ error: 'Type de notification invalide' }, 400, origin);
    }

    if (!notification.data[`${payload.type === 'contact_message' ? 'message' : 'appointment'}Id`]) {
      return jsonResponse({ error: 'Identifiant manquant' }, 400, origin);
    }

    if (payload.type === 'new_appointment') {
      const firebaseUser = await verifyFirebaseUser(request, env);
      if (!firebaseUser) {
        return jsonResponse({ error: 'Authentification Firebase invalide' }, 401, origin);
      }
    }

    try {
      const oneSignalResult = await sendOneSignalNotification(notification, env);
      return jsonResponse({ success: true, notificationId: oneSignalResult.id || null }, 200, origin);
    } catch (error) {
      console.error('Notification failure:', error.message);
      return jsonResponse({ error: 'Échec de la notification' }, 502, origin);
    }
  }
};
