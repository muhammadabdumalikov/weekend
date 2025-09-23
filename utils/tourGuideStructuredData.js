export const generateTourGuideStructuredData = (tourGuide) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": tourGuide.name,
    "description": tourGuide.description,
    "image": tourGuide.profileImage,
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/guide/${tourGuide.id}`,
    "jobTitle": "Professional Tour Guide",
    "worksFor": {
      "@type": "TravelAgency",
      "name": "WeTrippo"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": tourGuide.city,
      "addressCountry": tourGuide.country
    },
    "telephone": tourGuide.phone,
    "email": tourGuide.email,
    "knowsLanguage": tourGuide.languages || ["English", "Russian", "Uzbek"],
    "hasCredential": tourGuide.certifications?.map(cert => ({
      "@type": "EducationalOccupationalCredential",
      "name": cert.name,
      "credentialCategory": "certification"
    })) || [],
    "alumniOf": tourGuide.education ? {
      "@type": "EducationalOrganization",
      "name": tourGuide.education
    } : undefined,
    "award": tourGuide.awards?.map(award => ({
      "@type": "Award",
      "name": award
    })) || []
  };
};

export const generateTourBookingStructuredData = (tour) => {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tour.title,
    "description": tour.description,
    "image": tour.images?.map(img => img.url) || tour.slideImg || [],
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/tour/tour-single/${tour.id}`,
    "offers": {
      "@type": "Offer",
      "price": tour.price,
      "priceCurrency": tour.currency || "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString().split('T')[0],
      "seller": {
        "@type": "TravelAgency",
        "name": "WeTrippo"
      }
    },
    "provider": {
      "@type": "TravelAgency",
      "name": "WeTrippo",
      "url": process.env.NEXT_PUBLIC_BASE_URL
    },
    "touristType": "Leisure",
    "duration": tour.duration,
    "itinerary": tour.route_json?.map(day => ({
      "@type": "TouristAttraction",
      "name": day.title,
      "description": day.description
    })) || [],
    "location": {
      "@type": "Place",
      "name": tour.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": tour.location
      }
    },
    "includedInDataCatalog": {
      "@type": "DataCatalog",
      "name": "Central Asia Tour Guide Database"
    }
  };
};

export const generateLocalBusinessStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "WeTrippo",
    "description": "Central Asia's premier tour guide booking platform",
    "url": process.env.NEXT_PUBLIC_BASE_URL,
    "logo": `${process.env.NEXT_PUBLIC_BASE_URL}/img/general/logo-dark.svg`,
    "image": `${process.env.NEXT_PUBLIC_BASE_URL}/img/general/logo-dark.svg`,
    "telephone": "+998-XX-XXX-XXXX",
    "email": "info@wetrippo.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Address",
      "addressLocality": "Tashkent",
      "addressRegion": "Tashkent",
      "postalCode": "100000",
      "addressCountry": "UZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.2995",
      "longitude": "69.2401"
    },
    "openingHours": "Mo-Fr 09:00-18:00",
    "priceRange": "$$",
    "paymentAccepted": "Cash, Credit Card, PayPal",
    "currenciesAccepted": "USD, UZS, EUR",
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
    "serviceType": [
      "Tour Guide Booking",
      "Local Guide Services",
      "Cultural Tours",
      "Historical Tours",
      "Adventure Tours",
      "City Tours"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Central Asia Tour Guide Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Uzbekistan Tour Guide",
            "description": "Professional tour guides for Uzbekistan"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Kazakhstan Tour Guide",
            "description": "Professional tour guides for Kazakhstan"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Kyrgyzstan Tour Guide",
            "description": "Professional tour guides for Kyrgyzstan"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Tajikistan Tour Guide",
            "description": "Professional tour guides for Tajikistan"
          }
        }
      ]
    }
  };
};

export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};
