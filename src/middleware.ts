import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, verifySession } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, locals, redirect } = context;
  const path = url.pathname;

  const isAdmin = path === '/admin' || path.startsWith('/admin/');
  const isApi = path === '/api' || path.startsWith('/api/');
  if (!isAdmin && !isApi) return next();

  // The login page (and its POST handler) must stay reachable.
  if (path === '/admin/login') return next();

  const password = locals.runtime?.env?.ADMIN_PASSWORD;
  const token = cookies.get(SESSION_COOKIE)?.value;
  const authed = !!password && (await verifySession(password, token));

  if (!authed) {
    if (isApi) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return redirect('/admin/login');
  }

  return next();
});
