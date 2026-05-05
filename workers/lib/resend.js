/**
 * Resend email helpers.
 * sendEmail: single recipient (mirrors nacosapp pattern).
 * sendEmailMulti: array of {email, role} recipients — loops + tracks each.
 */

const RESEND_API = 'https://api.resend.com/emails';
const FROM = 'OCOS Field <field@naturalalternatives.ca>';

export async function sendEmail(env, { to, subject, html, text, replyTo }) {
  if (!env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — email skipped');
    return { skipped: true };
  }
  const payload = { from: FROM, to: [to], subject, html };
  if (text) payload.text = text;
  if (replyTo) payload.reply_to = replyTo;

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Resend error: ${JSON.stringify(data)}`);
  return data;
}

export async function sendEmailMulti(env, recipients, { subject, html, text }) {
  const results = [];
  const sentAt = new Date().toISOString();
  for (const { email, role } of recipients) {
    try {
      const data = await sendEmail(env, { to: email, subject, html, text });
      results.push({ email, role, sent_at: sentAt, resend_id: data.id, error: null });
    } catch (e) {
      results.push({ email, role, sent_at: sentAt, resend_id: null, error: e.message });
    }
  }
  return results;
}

export function buildSendHistoryEntry(results, channel = 'Resend Email') {
  return {
    sent_at: new Date().toISOString(),
    channel,
    recipients: results.map(r => ({
      email: r.email,
      role: r.role,
      sent_at: r.sent_at,
      resend_id: r.resend_id,
      error: r.error,
    })),
  };
}
