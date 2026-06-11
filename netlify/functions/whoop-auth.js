// netlify/functions/whoop-auth.js
// Handles WHOOP OAuth 2.0 token exchange
// Called by the redirect URI after user authorizes

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Exchange authorization code for tokens
  if (event.httpMethod === 'POST') {
    try {
      const { code, redirect_uri } = JSON.parse(event.body || '{}');
      if (!code) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing code' }) };

      const clientId     = process.env.WHOOP_CLIENT_ID;
      const clientSecret = process.env.WHOOP_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'WHOOP credentials not configured in Netlify env vars' }) };
      }

      const params = new URLSearchParams({
        grant_type:    'authorization_code',
        code,
        redirect_uri,
        client_id:     clientId,
        client_secret: clientSecret,
      });

      const resp = await fetch('https://api.prod.whoop.com/oauth/oauth2/token', {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    params.toString(),
      });

      const data = await resp.json();
      if (!resp.ok) return { statusCode: resp.status, headers, body: JSON.stringify(data) };

      return { statusCode: 200, headers, body: JSON.stringify(data) };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  // Refresh access token
  if (event.httpMethod === 'PUT') {
    try {
      const { refresh_token } = JSON.parse(event.body || '{}');
      if (!refresh_token) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing refresh_token' }) };

      const params = new URLSearchParams({
        grant_type:    'refresh_token',
        refresh_token,
        client_id:     process.env.WHOOP_CLIENT_ID,
        client_secret: process.env.WHOOP_CLIENT_SECRET,
      });

      const resp = await fetch('https://api.prod.whoop.com/oauth/oauth2/token', {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    params.toString(),
      });

      const data = await resp.json();
      return { statusCode: resp.ok ? 200 : resp.status, headers, body: JSON.stringify(data) };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};
