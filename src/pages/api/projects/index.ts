import type { APIRoute } from 'astro';
import { getDB, getProjects } from '../../../lib/data';
import { json, readJson, nullableStr } from '../../../lib/api';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const projects = await getProjects(getDB(locals));
  return json(projects);
};

export const POST: APIRoute = async ({ locals, request }) => {
  const body = await readJson<Record<string, unknown>>(request);
  if (!body) return json({ error: 'Invalid JSON' }, 400);

  const name = nullableStr(body.name);
  const slug = nullableStr(body.slug);
  if (!name || !slug) return json({ error: 'name y slug son obligatorios' }, 400);
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return json({ error: 'slug solo admite minúsculas, números y guiones' }, 400);
  }

  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();

  try {
    await getDB(locals)
      .prepare(
        `INSERT INTO projects
          (id, created_at, slug, name, is_active, start_date, end_date, url, logo_url,
           short_description_es, short_description_en, history_es, history_en)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        created_at,
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
        nullableStr(body.history_en)
      )
      .run();
  } catch (err) {
    if (String(err).includes('UNIQUE')) return json({ error: 'Ese slug ya existe' }, 409);
    throw err;
  }

  return json({ id }, 201);
};
