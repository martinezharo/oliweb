/// <reference path="../.astro/types.d.ts" />

interface Env {
  /** Cloudflare D1 database binding */
  DB: D1Database;
  /** Single admin password used to log into /admin */
  ADMIN_PASSWORD: string;
  /** Web3Forms public access key (already used on the contact form) */
  WEB3FORMS?: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
