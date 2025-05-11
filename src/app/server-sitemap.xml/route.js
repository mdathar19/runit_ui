import { getServerSideSitemap } from 'next-sitemap';

export async function GET(request) {
  // Get dynamic language routes from your code
  const languages = ['typescript', 'python', 'c', 'cpp', 'go', 'java'];
  
  // Generate fields for sitemap
  const fields = languages.map(language => ({
    loc: `https://runit.in/${language}`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.8,
  }));

  // Return the sitemap XML
  const sitemap = await getServerSideSitemap(fields);
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}