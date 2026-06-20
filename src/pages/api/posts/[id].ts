import type { APIRoute } from 'astro';
import { getDB, getPostById } from '../../../lib/data';
import { json, readJson } from '../../../lib/api';

export const prerender = false;

export const PUT: APIRoute = async ({ locals, params, request }) => {
  const id = params.id!;
  const db = getDB(locals);
  const existing = await getPostById(db, id);
  if (!existing) return json({ error: 'Not found' }, 404);

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

  await db
    .prepare('UPDATE posts SET content_es = ?, content_en = ?, image_urls = ? WHERE id = ?')
    .bind(content_es, content_en, JSON.stringify(image_urls), id)
    .run();

  return json({ id });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  const id = params.id!;
  await getDB(locals).prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
  return json({ id });
};
