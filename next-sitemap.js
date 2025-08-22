/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://jcic.vercel.app', // Replace with your actual domain
    generateRobotsTxt: true,               // Generates robots.txt automatically
    sitemapSize: 5000,                      // Optional: split sitemap if you have many pages
    changefreq: 'daily',                    // Optional: frequency for search engines
    priority: 0.7,                          // Optional: default priority
};
