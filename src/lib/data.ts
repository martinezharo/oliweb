import type { Database } from '../types/database.types';

export type Post = Database['public']['Tables']['posts']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];

// Raw shapes as stored in D1 (SQLite has no boolean and no array types).
interface PostRow {
  id: string;
  created_at: string;
  content_es: string;
  content_en: string;
  image_urls: string | null;
}

interface ProjectRow {
  id: string;
  created_at: string;
  slug: string;
  name: string;
  is_active: number | null;
  start_date: string | null;
  end_date: string | null;
  url: string | null;
  logo_url: string | null;
  short_description_es: string | null;
  short_description_en: string | null;
  history_es: string | null;
  history_en: string | null;
}

function mapPost(row: PostRow): Post {
  let image_urls: string[] = [];
  if (row.image_urls) {
    try {
      const parsed = JSON.parse(row.image_urls);
      if (Array.isArray(parsed)) image_urls = parsed;
    } catch {
      image_urls = [];
    }
  }
  return {
    id: row.id,
    created_at: row.created_at,
    content_es: row.content_es,
    content_en: row.content_en,
    image_urls,
  };
}

function mapProject(row: ProjectRow): Project {
  return {
    ...row,
    is_active: row.is_active === null ? null : row.is_active === 1,
  };
}

/** Resolve the D1 binding from Astro request locals. */
export function getDB(locals: App.Locals): D1Database {
  const db = locals.runtime?.env?.DB;
  if (!db) {
    throw new Error(
      'D1 binding "DB" is not available. Check wrangler.toml and the platformProxy config.'
    );
  }
  return db;
}

export async function getPosts(db: D1Database): Promise<Post[]> {
  const { results } = await db
    .prepare('SELECT * FROM posts ORDER BY created_at DESC')
    .all<PostRow>();
  return results.map(mapPost);
}

export async function getPostById(db: D1Database, id: string): Promise<Post | null> {
  const row = await db.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first<PostRow>();
  return row ? mapPost(row) : null;
}

export async function getProjects(db: D1Database): Promise<Project[]> {
  const { results } = await db
    .prepare('SELECT * FROM projects ORDER BY created_at DESC')
    .all<ProjectRow>();
  return results.map(mapProject);
}

export async function getProjectBySlug(db: D1Database, slug: string): Promise<Project | null> {
  const row = await db
    .prepare('SELECT * FROM projects WHERE slug = ?')
    .bind(slug)
    .first<ProjectRow>();
  return row ? mapProject(row) : null;
}

export async function getProjectById(db: D1Database, id: string): Promise<Project | null> {
  const row = await db
    .prepare('SELECT * FROM projects WHERE id = ?')
    .bind(id)
    .first<ProjectRow>();
  return row ? mapProject(row) : null;
}
