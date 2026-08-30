/**
 * POST /fc/ai/summarize
 * Model: claude-haiku-4-5-20251001 — fast, cheap, short summaries.
 *
 * Body (JSON): { photoUrl?, voiceTranscript?, tags, siteContext?, capturedAt? }
 *          or: { type: 'voice_transcription', audioBase64, audioMimeType, photoId? }
 * Returns: { summary } or { transcription }
 *
 * The voice_transcription branch runs speech-to-text on Workers AI (Claude
 * has no audio input support) and returns the raw transcript — no AI
 * summarization applied, this is meant as a live preview of what was said.
 */

export async function handleAiSummarize(request, env) {
  const body = await request.json();

  if (body.type === 'voice_transcription') {
    return handleVoiceTranscription(request, env, body);
  }

  const { photoUrl, voiceTranscript, tags = [], siteContext, capturedAt } = body;

  if (!voiceTranscript && !photoUrl) {
    return json({ error: 'voiceTranscript or photoUrl required' }, 400);
  }

  const tagLine = tags.length ? `Tags applied: ${tags.join(', ')}.` : '';
  const ctxLine = siteContext ? `Site context: ${siteContext}.` : '';
  const dateLine = capturedAt ? `Captured: ${capturedAt}.` : '';

  const userContent = [];

  if (photoUrl) {
    userContent.push({
      type: 'image',
      source: { type: 'url', url: photoUrl },
    });
  }

  const textParts = [
    'Summarize the compliance observation in this photo for an Ontario construction site safety record.',
    'Be factual, plain-language, under 80 words.',
    'Reference the applicable OHSA section or O.Reg if clearly relevant.',
    tagLine, ctxLine, dateLine,
    voiceTranscript ? `Field note: "${voiceTranscript}"` : '',
  ].filter(Boolean).join(' ');

  userContent.push({ type: 'text', text: textParts });

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: 'You are a field safety documentation assistant for Ontario contractors. Write concise, factual compliance observations. No boilerplate, no disclaimers.',
      messages: [{ role: 'user', content: userContent }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Anthropic error:', err);
    return json({ error: 'AI summary unavailable' }, 502);
  }

  const data = await res.json();
  const summary = data.content?.[0]?.text?.trim() || '';

  return json({ summary });
}

async function handleVoiceTranscription(request, env, body) {
  const { audioBase64 } = body;
  if (!audioBase64) return json({ error: 'audioBase64 required' }, 400);

  let audioBytes;
  try {
    const bin = atob(audioBase64);
    audioBytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) audioBytes[i] = bin.charCodeAt(i);
  } catch {
    return json({ error: 'audioBase64 is not valid base64' }, 400);
  }
  if (audioBytes.length === 0) return json({ transcription: '' });

  try {
    const result = await env.AI.run('@cf/openai/whisper', {
      audio: Array.from(audioBytes),
    });
    return json({ transcription: (result?.text || '').trim() });
  } catch (e) {
    console.error('Whisper transcription error:', e);
    return json({ error: 'Transcription unavailable' }, 502);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
