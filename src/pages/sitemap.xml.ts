import type { APIRoute } from 'astro';
import { getDB, getProjects } from '../lib/data';

export const prerender = false;

const SITE = 'https://olivermartinezharo.com';

// Static pages and their priorities (mirrors the previous hand-made sitemap).
const STATIC: Array<[string, string]> = [
  ['/', '1.0'],
  ['/en', '1.0'],
  ['/posts', '0.8'],
  ['/en/posts', '0.8'],
  ['/legal', '0.3'],
  ['/privacy', '0.3'],
  ['/cookies', '0.3'],
  ['/en/legal', '0.3'],
  ['/en/privacy', '0.3'],
  ['/en/cookies', '0.3'],
];

export const GET: APIRoute = async ({ locals }) => {
  const projects = await getProjects(getDB(locals));

  const urls: Array<[string, string]> = [...STATIC];
  for (const p of projects) {
    const priority = p.is_active ? '0.9' : '0.5';
    urls.push([`/projects/${p.slug}`, priority]);
    urls.push([`/en/projects/${p.slug}`, priority]);
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(([path, priority]) => `  <url><loc>${SITE}${path}</loc><priority>${priority}</priority></url>`)
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    },
  });
};
