// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://olivermartinezharo.com',
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [
    tailwind(),
    react(),
    // Secondary auto-sitemap for static pages. The canonical sitemap is the
    // dynamic /sitemap.xml endpoint (sourced from D1). Keep /admin out of both.
    sitemap({ filter: (page) => !page.includes('/admin') }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    resolve: {
      // React 19's `react-dom/server.browser` relies on `MessageChannel`,
      // which doesn't exist in the Cloudflare Workers runtime. Use the edge
      // build (Web Streams based) for SSR in production builds only, so the
      // local dev server keeps working unchanged.
      alias: process.env.NODE_ENV === 'production'
        ? { 'react-dom/server': 'react-dom/server.edge' }
        : undefined,
    },
  },
});