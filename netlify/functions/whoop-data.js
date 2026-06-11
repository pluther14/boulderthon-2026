// netlify/functions/whoop-data.js
// Proxies WHOOP v2 API requests — keeps tokens out of browser
// Reads access_token from Authorization header sent by the client

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  const authHeader = event.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return { statusCode: 401, headers, body: JSON.stringify({ error: 'No token' }) };

  const endpoint = (event.queryStringParameters || {}).endpoint || 'recovery';
  const BASE = 'https://api.prod.whoop.com/developer/v1';

  const urlMap = {
    recovery: `${BASE}/recovery?limit=7`,
    sleep:    `${BASE}/activity/sleep?limit=7`,
    cycle:    `${BASE}/cycle?limit=7`,
    profile:  `${BASE}/user/profile/basic`,
  };

  const url = urlMap[endpoint];
  if (!url) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown endpoint' }) };

  try {
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await resp.json();
    return { statusCode: resp.status, headers, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
