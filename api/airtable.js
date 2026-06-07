const BASE_ID = 'appRMEXhqhENAGzHW';
const TABLE_NAME = 'Newsletter Subscribers';
const AT_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-rwu-secret');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const secret = req.headers['x-rwu-secret'];
  if (!secret || secret !== process.env.RWU_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = process.env.AIRTABLE_TOKEN;
  if (!token) {
    console.error('[airtable] AIRTABLE_TOKEN env var is not set');
    return res.status(500).json({ error: 'Configuration error' });
  }

  // ── GET: fetch record by ?email= query param, or count all with ?count=true ─
  if (req.method === 'GET') {
    const emailParam = (req.query && req.query.email) || '';
    const isCount = req.query && req.query.count === 'true';

    if (isCount) {
      try {
        const todayParam = (req.query && req.query.today) || '';
        const totalPromise = (async () => {
          let total = 0;
          let offset = null;
          do {
            let url = `${AT_URL}?pageSize=100&fields[]=Email`;
            if (offset) url += `&offset=${encodeURIComponent(offset)}`;
            const r = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!r.ok) throw new Error(`Airtable status ${r.status}`);
            const d = await r.json();
            total += (d.records || []).length;
            offset = d.offset || null;
          } while (offset);
          return total;
        })();
        let todayPromise = Promise.resolve(null);
        if (todayParam) {
          todayPromise = (async () => {
            const formula = encodeURIComponent(`IS_AFTER({Last Activity Date}, DATEADD(NOW(), -24, 'hours'))`);
            let todayTotal = 0;
            let offset = null;
            do {
              let url = `${AT_URL}?filterByFormula=${formula}&fields[]=Email&pageSize=100`;
              if (offset) url += `&offset=${encodeURIComponent(offset)}`;
              const r = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
              if (!r.ok) throw new Error(`Airtable today status ${r.status}`);
              const d = await r.json();
              todayTotal += (d.records || []).length;
              offset = d.offset || null;
            } while (offset);
            console.log('[airtable] today count (paginated):', todayTotal);
            return todayTotal;
          })().catch(err => { console.error('[airtable] today fetch error:', err.message); return 0; });
        }
        const [total, todayCount] = await Promise.all([totalPromise, todayPromise]);
        console.log('[airtable] count:', total, '| today:', todayCount);
        const result = { count: total };
        if (todayCount !== null) result.todayCount = todayCount;
        return res.status(200).json(result);
      } catch (err) {
        console.error('[airtable] count error:', err.message);
        return res.status(500).json({ error: 'Count error' });
      }
    }

    if (!emailParam) {
      console.error('[airtable] GET called without email param');
      return res.status(400).json({ error: 'Missing email' });
    }
    const sanitized = emailParam.replace(/"/g, '');
    const formula = encodeURIComponent(`({Email}="${sanitized}")`);
    const url = `${AT_URL}?filterByFormula=${formula}&maxRecords=1`;
    console.log('[airtable] GET search URL:', url);
    try {
      const searchRes = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      const searchData = await searchRes.json();
      console.log('[airtable] GET search status:', searchRes.status, '| records found:', (searchData.records || []).length);
      const record = searchData.records && searchData.records[0];
      if (!record) return res.status(200).json({});
      return res.status(200).json({ id: record.id, fields: record.fields });
    } catch (err) {
      console.error('[airtable] GET unhandled exception:', err.message);
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  if (req.method !== 'POST') {
    console.log('[airtable] rejected method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
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
      if (!createFields['Country']) createFields['Country'] = 'Unknown';
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

    // ── INCREMENT REFERRAL ──────────────────────────────────────────────────
    if (action === 'incrementReferral') {
      const { referralCode } = body;
      if (!referralCode) {
        console.error('[airtable] incrementReferral called without referralCode');
        return res.status(400).json({ error: 'Missing referralCode' });
      }
      const sanitized = referralCode.replace(/"/g, '');
      const formula = encodeURIComponent(`({Referral Code}="${sanitized}")`);
      const searchUrl = `${AT_URL}?filterByFormula=${formula}&maxRecords=1`;
      const searchRes = await fetch(searchUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      const searchData = await searchRes.json();
      console.log('[airtable] incrementReferral search status:', searchRes.status, '| records:', (searchData.records || []).length);
      const record = searchData.records && searchData.records[0];
      if (!record) {
        console.log('[airtable] incrementReferral: no record found for code:', sanitized);
        return res.status(200).json({ ok: false, reason: 'not_found' });
      }
      const currentCount = (record.fields && record.fields['Referral Count']) || 0;
      const patchUrl = `${AT_URL}/${record.id}`;
      const atRes = await fetch(patchUrl, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: { 'Referral Count': Number(currentCount) + 1 } }),
      });
      const data = await atRes.json();
      console.log('[airtable] incrementReferral patch status:', atRes.status);
      if (!atRes.ok) console.error('[airtable] incrementReferral patch failed:', JSON.stringify(data));
      return res.status(atRes.status).json(data);
    }

    console.error('[airtable] unknown action:', action);
    return res.status(400).json({ error: 'Invalid action' });

  } catch (err) {
    console.error('[airtable] unhandled exception:', err.message, err.stack);
    return res.status(500).json({ error: 'Internal error' });
  }
};
