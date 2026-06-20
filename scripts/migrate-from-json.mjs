// Generates seed.sql from src/data.json so the current content can be
// loaded into Cloudflare D1.
//
//   node scripts/migrate-from-json.mjs
//
// Then apply it:
//   wrangler d1 execute oliweb --local  --file=./seed.sql   (local dev)
//   wrangler d1 execute oliweb --remote --file=./seed.sql   (production)

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'src/data.json'), 'utf8'));

/** SQL-quote a value: string -> 'escaped', null/undefined -> NULL. */
const q = (v) => {
  if (v === null || v === undefined) return 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
};

const lines = [
  '-- Auto-generated from src/data.json by scripts/migrate-from-json.mjs',
  '-- Safe to re-run: rows are replaced by primary key.',
  '',
];

for (const p of data.posts) {
  lines.push(
    'INSERT OR REPLACE INTO posts (id, created_at, content_es, content_en, image_urls) VALUES (' +
      [
        q(p.id),
        q(p.created_at),
        q(p.content_es),
        q(p.content_en),
        q(JSON.stringify(p.image_urls ?? [])),
      ].join(', ') +
      ');'
  );
}

lines.push('');

for (const p of data.projects) {
  lines.push(
    'INSERT OR REPLACE INTO projects (id, created_at, slug, name, is_active, start_date, end_date, url, logo_url, short_description_es, short_description_en, history_es, history_en) VALUES (' +
      [
        q(p.id),
        q(p.created_at),
        q(p.slug),
        q(p.name),
        p.is_active ? '1' : '0',
        q(p.start_date),
        q(p.end_date),
        q(p.url),
        q(p.logo_url),
        q(p.short_description_es),
        q(p.short_description_en),
        q(p.history_es),
        q(p.history_en),
      ].join(', ') +
      ');'
  );
}

lines.push('');
writeFileSync(join(root, 'seed.sql'), lines.join('\n'));
console.log(`Wrote seed.sql: ${data.posts.length} posts, ${data.projects.length} projects.`);
