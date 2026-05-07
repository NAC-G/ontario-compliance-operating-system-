/**
 * GET /fc/photo/:id/audio  — stream voice recording from R2
 * GET /fc/photo/:id/image  — stream photo from R2
 */

import { makeClient } from '../notion.js';
import { getLicenseMapping } from '../db.js';

export async function handlePhotoAudio(request, env, license, photoId) {
  const mapping = await getLicenseMapping(env.DB, license.key);
  if (!mapping) return err('Workspace not provisioned', 409);

  const notion = makeClient(env.NOTION_TOKEN);
  const page = await notion.get(`/pages/${photoId}`);
  const voiceKey = page.properties?.['Voice Key']?.rich_text?.[0]?.plain_text;
  if (!voiceKey) return err('No audio for this photo', 404);

  const obj = await env.FC_VOICE.get(voiceKey);
  if (!obj) return err('Audio not found in storage', 404);

  return new Response(obj.body, {
    headers: {
      'Content-Type': 'audio/mp4',
      'Cache-Control': 'private, max-age=3600',
    },
  });
}

export async function handlePhotoImage(request, env, license, photoId) {
  const mapping = await getLicenseMapping(env.DB, license.key);
  if (!mapping) return err('Workspace not provisioned', 409);

  const notion = makeClient(env.NOTION_TOKEN);
  const page = await notion.get(`/pages/${photoId}`);
  const photoKey = page.properties?.['Photo Key']?.rich_text?.[0]?.plain_text;
  if (!photoKey) return err('No image for this photo', 404);

  const obj = await env.FC_PHOTOS.get(photoKey);
  if (!obj) return err('Image not found in storage', 404);

  const ct = photoKey.endsWith('.png') ? 'image/png' : 'image/jpeg';
  return new Response(obj.body, {
    headers: {
      'Content-Type': ct,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}

function err(msg, status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
