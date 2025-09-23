import Head from "next/head";
import { useRouter } from "next/router";

const Seo = ({ 
  pageTitle, 
  pageDescription, 
  pageKeywords, 
  pageImage, 
  structuredData,
  noIndex = false,
  canonicalUrl,
  tourGuide = null,
  tourLocation = null
}) => {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wetrippo.com';
  const currentUrl = canonicalUrl || `${baseUrl}${router.asPath}`;
  
  // Default values for Central Asia tour guide booking
  const defaultTitle = "WeTrippo - Central Asia Tour Guide Booking Platform";
  const defaultDescription = "Book professional tour guides in Central Asia. Expert local guides for Uzbekistan, Kazakhstan, Kyrgyzstan, and Tajikistan. Discover the Silk Road with certified tour guides. Instant booking, verified guides, competitive prices.";
  const defaultKeywords = "Central Asia tour guide, Uzbekistan tour guide, Kazakhstan tour guide, Kyrgyzstan tour guide, Tajikistan tour guide, Silk Road guide, local tour guide booking, professional tour guide, certified guide, Tashkent guide, Samarkand guide, Bukhara guide, Almaty guide, Bishkek guide";
  const defaultImage = `${baseUrl}/img/general/logo-dark.svg`;

  const title = pageTitle ? `${pageTitle} | WeTrippo - Central Asia Tour Guides` : defaultTitle;
  const description = pageDescription || defaultDescription;
  const keywords = pageKeywords || defaultKeywords;
  const image = pageImage || defaultImage;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="WeTrippo - Central Asia Tour Guides" />
      <meta property="og:locale" content={router.locale || 'en'} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="WeTrippo" />
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      
      {/* Language and Region */}
      <meta name="language" content={router.locale || 'en'} />
      <meta name="geo.region" content="UZ" />
      <meta name="geo.placename" content="Tashkent" />
      
      {/* Tour Guide Specific Meta Tags */}
      {tourGuide && (
        <>
          <meta name="tour-guide" content={tourGuide.name} />
          <meta name="guide-experience" content={tourGuide.experience} />
          <meta name="guide-languages" content={tourGuide.languages?.join(', ')} />
        </>
      )}
      
      {tourLocation && (
        <meta name="tour-location" content={tourLocation} />
      )}
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      
      {/* Default Structured Data for Tour Guide Booking Platform */}
      {!structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "WeTrippo",
              "description": "Central Asia's premier tour guide booking platform",
              "url": baseUrl,
              "logo": `${baseUrl}/img/general/logo-dark.svg`,
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+998-XX-XXX-XXXX",
                "contactType": "customer service",
                "availableLanguage": ["English", "Russian", "Uzbek"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "UZ",
                "addressLocality": "Tashkent"
              },
              "areaServed": [
                {
                  "@type": "Country",
                  "name": "Uzbekistan"
                },
                {
                  "@type": "Country", 
                  "name": "Kazakhstan"
                },
                {
                  "@type": "Country",
                  "name": "Kyrgyzstan"
                },
                {
                  "@type": "Country",
                  "name": "Tajikistan"
                }
              ],
              "serviceType": "Tour Guide Booking",
              "sameAs": [
                "https://www.facebook.com/wetrippo",
                "https://www.instagram.com/wetrippo",
                "https://www.twitter.com/wetrippo"
              ]
            })
          }}
        />
      )}
    </Head>
  );
};

export default Seo;
