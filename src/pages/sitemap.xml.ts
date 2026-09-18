import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { pages } from "../data/site";

/** Derive URLs from the same page metadata and content used by the website. */
export const GET: APIRoute = async ({ site }) => {
  const articles = await getCollection("articles");
  const paths = [
    ...Object.values(pages).map((page) => page.path),
    ...articles.map((article) => `/articles/${article.id}/`),
  ];
  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
