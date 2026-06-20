import type { APIRoute } from 'astro';
import { getDB, getPosts } from '../../../lib/data';
import { json, readJson } from '../../../lib/api';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const posts = await getPosts(getDB(locals));
  return json(posts);
};

export const POST: APIRoute = async ({ locals, request }) => {
  const body = await readJson<{
    content_es?: string;
    content_en?: string;
    image_urls?: string[];
  }>(request);
  if (!body) return json({ error: 'Invalid JSON' }, 400);

  const content_es = (body.content_es ?? '').trim();
  const content_en = (body.content_en ?? '').trim();
  if (!content_es || !content_en) {
    return json({ error: 'content_es y content_en son obligatorios' }, 400);
  }

  const image_urls = Array.isArray(body.image_urls)
    ? body.image_urls.filter((u) => typeof u === 'string' && u.trim() !== '')
    : [];

  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();

  await getDB(locals)
    .prepare(
      'INSERT INTO posts (id, created_at, content_es, content_en, image_urls) VALUES (?, ?, ?, ?, ?)'
    )
    .bind(id, created_at, content_es, content_en, JSON.stringify(image_urls))
    .run();

  return json({ id }, 201);
};
