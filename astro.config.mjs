import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://aimoviebase.com',
  output: 'static',
  // Matches vercel.json's "trailingSlash": false (Vercel strips/redirects
  // trailing slashes at serve time) so the sitemap, canonical tags and the
  // routing config all agree on one URL shape for every page.
  trailingSlash: 'never',
  // The sitemap is a hand-maintained static file: public/sitemap.xml.
  // (@astrojs/sitemap was removed, so nothing is auto-generated at build —
  // add new pages to that file by hand.)
});
