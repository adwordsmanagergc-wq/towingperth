// Vercel serverless function: receives the quote form (plain HTML POST, no JS
// needed) and emails it via Resend. Configure in Vercel project settings:
//   RESEND_API_KEY   - TODO: Resend API key (https://resend.com)
//   QUOTE_TO_EMAIL   - TODO: where quote requests should be sent
//   QUOTE_FROM_EMAIL - TODO: verified sender, e.g. "Quik Tow website <quotes@towingperth.com>"
const MAX = { name: 100, phone: 30, pickup: 100, dropoff: 100, vehicle: 50, service: 50, notes: 2000 };

function redirect(res, location) {
  res.statusCode = 303;
  res.setHeader('Location', location);
  res.setHeader('Cache-Control', 'no-store');
  res.end();
}

async function readForm(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Object.fromEntries(new URLSearchParams(Buffer.concat(chunks).toString('utf8')));
}

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export default async function handler(req, res) {
  if (req.method !== 'POST') return redirect(res, '/contact#quote');

  let form;
  try {
    form = await readForm(req);
  } catch {
    return redirect(res, '/contact#quote-error');
  }

  // Honeypot filled in: almost certainly a bot. Pretend it worked.
  if (form.company) return redirect(res, '/quote-sent');

  const data = {};
  for (const [k, max] of Object.entries(MAX)) data[k] = String(form[k] ?? '').trim().slice(0, max);
  const digits = data.phone.replace(/\D/g, '');
  if (!data.name || digits.length < 8 || !data.pickup) return redirect(res, '/contact#quote-error');

  const { RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !QUOTE_TO_EMAIL || !QUOTE_FROM_EMAIL) {
    console.error('Quote form is not configured: set RESEND_API_KEY, QUOTE_TO_EMAIL and QUOTE_FROM_EMAIL');
    return redirect(res, '/contact#quote-error');
  }

  const rows = [
    ['Name', data.name],
    ['Phone', data.phone],
    ['Pickup', data.pickup],
    ['Drop-off', data.dropoff || '-'],
    ['Vehicle', data.vehicle],
    ['Service', data.service],
    ['Notes', data.notes || '-'],
  ];
  const html = `<h2>New quote request</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><th align="left">${k}</th><td>${escape(v).replace(/\n/g, '<br>')}</td></tr>`)
    .join('')}</table><p><a href="tel:${digits}">Call ${escape(data.phone)}</a></p>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: QUOTE_FROM_EMAIL,
        to: QUOTE_TO_EMAIL.split(',').map((s) => s.trim()),
        subject: `Quote: ${data.service} from ${data.pickup} (${data.name})`,
        html,
        text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
      }),
    });
    if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
  } catch (err) {
    console.error(err);
    return redirect(res, '/contact#quote-error');
  }
  return redirect(res, '/quote-sent');
}
