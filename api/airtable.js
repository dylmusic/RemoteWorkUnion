const BASE_ID = 'appRMEXhqhENAGzHW';
const TABLE_NAME = 'Newsletter Subscribers';
const AT_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    console.log('[airtable] rejected non-POST method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.AIRTABLE_TOKEN;
  if (!token) {
    console.error('[airtable] AIRTABLE_TOKEN env var is not set');
    return res.status(500).json({ error: 'Configuration error' });
  }

  const body = req.body || {};
  const { action, recordId, fields, email } = body;

  console.log('[airtable] incoming request — action:', action, '| recordId:', recordId || '(none)', '| fields:', JSON.stringify(fields || {}));

  try {
    // ── SEARCH ──────────────────────────────────────────────────────────────
    if (action === 'search') {
      if (!email) {
        console.error('[airtable] search called without email');
        return res.status(400).json({ error: 'Missing email' });
      }
      const sanitized = email.replace(/"/g, '');
      const formula = encodeURIComponent(`({Email}="${sanitized}")`);
      const url = `${AT_URL}?filterByFormula=${formula}&maxRecords=1`;
      console.log('[airtable] search URL:', url);

      const searchRes = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const searchData = await searchRes.json();
      console.log('[airtable] search response status:', searchRes.status, '| body:', JSON.stringify(searchData));

      const record = searchData.records && searchData.records[0];
      if (!record) {
        console.log('[airtable] no record found for email:', sanitized);
        return res.status(200).json({});
      }
      return res.status(200).json({ id: record.id, fields: record.fields });
    }

    // ── CREATE ───────────────────────────────────────────────────────────────
    if (action === 'create') {
      if (!fields || !fields['Email']) {
        console.error('[airtable] create called without Email field');
        return res.status(400).json({ error: 'Missing Email field' });
      }
      console.log('[airtable] creating record at:', AT_URL);

      const createFields = { ...fields, 'Last Activity Date': new Date().toISOString() };
      const atRes = await fetch(AT_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: createFields }),
      });

      const data = await atRes.json();
      console.log('[airtable] create response status:', atRes.status, '| body:', JSON.stringify(data));

      if (!atRes.ok) {
        console.error('[airtable] create failed — Airtable error:', JSON.stringify(data));
      }
      return res.status(atRes.status).json(data);
    }

    // ── PATCH ────────────────────────────────────────────────────────────────
    if (action === 'patch') {
      if (!recordId) {
        console.error('[airtable] patch called without recordId');
        return res.status(400).json({ error: 'Missing recordId' });
      }
      const patchUrl = `${AT_URL}/${recordId}`;
      console.log('[airtable] patching record at:', patchUrl);

      const patchFields = { ...fields, 'Last Activity Date': new Date().toISOString() };
      const atRes = await fetch(patchUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: patchFields }),
      });

      const data = await atRes.json();
      console.log('[airtable] patch response status:', atRes.status, '| body:', JSON.stringify(data));

      if (!atRes.ok) {
        console.error('[airtable] patch failed — Airtable error:', JSON.stringify(data));
      }
      return res.status(atRes.status).json(data);
    }

    // ── APPEND FIELD ─────────────────────────────────────────────────────────
    if (action === 'appendField') {
      if (!recordId || !body.fieldName || body.appendValue == null) {
        console.error('[airtable] appendField called with missing params');
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const counterField = body.counterField || null;
      let getUrl = `${AT_URL}/${recordId}?fields[]=${encodeURIComponent(body.fieldName)}`;
      if (counterField) getUrl += `&fields[]=${encodeURIComponent(counterField)}`;
      const getRes = await fetch(getUrl, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const getData = await getRes.json();
      console.log('[airtable] appendField get status:', getRes.status);

      const existing = (getData.fields && getData.fields[body.fieldName]) || '';
      const newValue = existing ? existing + '\n' + body.appendValue : body.appendValue;

      const patchUrl = `${AT_URL}/${recordId}`;
      const patchFields = {
        [body.fieldName]: newValue,
        'Last Activity Date': new Date().toISOString(),
      };
      if (counterField) {
        const currentCount = (getData.fields && getData.fields[counterField]) || 0;
        patchFields[counterField] = Number(currentCount) + 1;
      }
      const atRes = await fetch(patchUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: patchFields }),
      });
      const data = await atRes.json();
      console.log('[airtable] appendField patch status:', atRes.status);
      if (!atRes.ok) {
        console.error('[airtable] appendField patch failed:', JSON.stringify(data));
      }
      return res.status(atRes.status).json(data);
    }

    console.error('[airtable] unknown action:', action);
    return res.status(400).json({ error: 'Invalid action' });

  } catch (err) {
    console.error('[airtable] unhandled exception:', err.message, err.stack);
    return res.status(500).json({ error: 'Internal error' });
  }
};
