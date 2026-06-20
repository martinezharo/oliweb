import type { APIRoute } from 'astro';
import { getDB, getProjectById } from '../../../lib/data';
import { json, readJson, nullableStr } from '../../../lib/api';

export const prerender = false;

export const PUT: APIRoute = async ({ locals, params, request }) => {
  const id = params.id!;
  const db = getDB(locals);
  const existing = await getProjectById(db, id);
  if (!existing) return json({ error: 'Not found' }, 404);

  const body = await readJson<Record<string, unknown>>(request);
  if (!body) return json({ error: 'Invalid JSON' }, 400);

  const name = nullableStr(body.name);
  const slug = nullableStr(body.slug);
  if (!name || !slug) return json({ error: 'name y slug son obligatorios' }, 400);
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return json({ error: 'slug solo admite minúsculas, números y guiones' }, 400);
  }

  try {
    await db
      .prepare(
        `UPDATE projects SET
          slug = ?, name = ?, is_active = ?, start_date = ?, end_date = ?, url = ?, logo_url = ?,
          short_description_es = ?, short_description_en = ?, history_es = ?, history_en = ?
         WHERE id = ?`
      )
      .bind(
        slug,
        name,
        body.is_active ? 1 : 0,
        nullableStr(body.start_date),
        nullableStr(body.end_date),
        nullableStr(body.url),
        nullableStr(body.logo_url),
        nullableStr(body.short_description_es),
        nullableStr(body.short_description_en),
        nullableStr(body.history_es),
        nullableStr(body.history_en),
        id
      )
      .run();
  } catch (err) {
    if (String(err).includes('UNIQUE')) return json({ error: 'Ese slug ya existe' }, 409);
    throw err;
  }

  return json({ id });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  const id = params.id!;
  await getDB(locals).prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
  return json({ id });
};
