const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wetrippo.com';

// Static pages for tour guide platform
const staticPages = [
  '',
  '/tours',
  '/destinations',
  '/about',
  '/contact',
  '/blog',
  '/guide-registration',
  '/how-it-works',
  '/pricing',
  '/faq'
];

function generateSiteMap(pages) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
     ${pages
       .map((page) => {
         const url = page.url || page;
         const lastmod = page.lastmod || new Date().toISOString().split('T')[0];
         const changefreq = page.changefreq || 'weekly';
         const priority = page.priority || '0.8';
         
         return `
       <url>
           <loc>${baseUrl}${url}</loc>
           <lastmod>${lastmod}</lastmod>
           <changefreq>${changefreq}</changefreq>
           <priority>${priority}</priority>
           <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en${url}"/>
           <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/ru${url}"/>
           <xhtml:link rel="alternate" hreflang="uz" href="${baseUrl}/uz${url}"/>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  try {
    // Fetch tour guides and tours from your API
    const [toursRes, guidesRes, blogsRes] = await Promise.all([
      fetch(`${baseUrl}/api/tour/list`).catch(() => null),
      fetch(`${baseUrl}/api/guide/list`).catch(() => null),
      fetch(`${baseUrl}/api/blog/list`).catch(() => null),
    ]);

    const allPages = [
      // Static pages with high priority for tour guide platform
      ...staticPages.map(url => ({ 
        url, 
        priority: url === '' ? '1.0' : (url === '/tours' ? '0.9' : '0.8'),
        changefreq: url === '' ? 'daily' : 'weekly'
      })),
      
      // Tour guide profiles
      ...(guidesRes ? (await guidesRes.json()).data?.map(guide => ({
        url: `/guide/${guide.id}`,
        lastmod: guide.updatedAt,
        changefreq: 'monthly',
        priority: '0.9'
      })) : []),
      
      // Tour listings
      ...(toursRes ? (await toursRes.json()).data?.map(tour => ({
        url: `/tour/tour-single/${tour.id}`,
        lastmod: tour.updatedAt,
        changefreq: 'weekly',
        priority: '0.9'
      })) : []),
      
      // Blog posts
      ...(blogsRes ? (await blogsRes.json()).data?.map(blog => ({
        url: `/blog/blog-details/${blog.id}`,
        lastmod: blog.updatedAt,
        changefreq: 'monthly',
        priority: '0.7'
      })) : []),
    ];

    const sitemap = generateSiteMap(allPages);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to static pages only
    const staticPagesWithPriority = staticPages.map(url => ({ 
      url, 
      priority: url === '' ? '1.0' : (url === '/tours' ? '0.9' : '0.8'),
      changefreq: url === '' ? 'daily' : 'weekly'
    }));
    
    const sitemap = generateSiteMap(staticPagesWithPriority);
    
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  }
}

export default SiteMap;
