/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://runit.in',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*', '/admin/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://runit.in/server-sitemap.xml', // For dynamic routes that need server-side generation
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  // Transform the URLs if needed
  transform: async (config, path) => {
    // Custom priority for specific pages
    let priority = 0.7;
    
    if (path === '/') {
      priority = 1.0;
    } else if (path === '/create-snippet') {
      priority = 0.9;
    } else if (path.startsWith('/typescript') || 
               path.startsWith('/python') || 
               path.startsWith('/java')) {
      priority = 0.8;
    }
    
    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
