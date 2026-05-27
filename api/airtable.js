const BASE_ID = 'appRMEXhqhENAGzHW';
const TABLE_ID = 'tblm2Fgijgdqr68sq';
const AT_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.AIRTABLE_TOKEN;
  if (!token) return res.status(500).json({ error: 'Configuration error' });

  const { action, recordId, fields } = req.body || {};

  console.log('[airtable] action:', action, '| recordId:', recordId, '| fields:', JSON.stringify(fields));

  try {
    let url = AT_URL;
    let method = 'POST';

    if (action === 'patch') {
      if (!recordId) return res.status(400).json({ error: 'Missing recordId' });
      url = `${AT_URL}/${recordId}`;
      method = 'PATCH';
    } else if (action !== 'create') {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const atRes = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    const data = await atRes.json();
    console.log('[airtable] response status:', atRes.status, '| body:', JSON.stringify(data));

    return res.status(atRes.status).json(data);
  } catch (err) {
    console.error('[airtable] error:', err.message);
    return res.status(500).json({ error: 'Internal error' });
  }
};
