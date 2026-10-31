import type { APIRoute } from 'astro';
import { clinic } from '../clinic.config';

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', clinic.siteUrl).href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
