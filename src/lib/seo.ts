import { BUSINESS_INFO, HERO_IMAGES } from '@/lib/constants';

/**
 * Canonical production URL. Set NEXT_PUBLIC_SITE_URL in Vercel to the exact
 * production domain (including www/non-www) so canonical tags, the sitemap,
 * robots.txt, Open Graph URLs and JSON-LD all stay consistent.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vinoostrading.com'
).replace(/\/$/, '');

export const SITE_NAME = BUSINESS_INFO.name; // 'Vinoos Trading EST.'

export const SITE_TITLE =
  'Vinoos Trading EST. | Custom Fish Tanks & Aquariums in the UAE';

export const DEFAULT_DESCRIPTION =
  'Vinoos Trading EST. designs and builds custom, high-quality fish tanks, aquariums, acrylic fabrication and cabinets for homes and businesses across the UAE and the GCC. Trusted aquarium manufacturer based in Umm Al Quwain since 1997.';

export const DEFAULT_KEYWORDS = [
  'custom fish tanks UAE',
  'custom aquariums UAE',
  'aquarium manufacturer Umm Al Quwain',
  'fish tank builder Dubai',
  'acrylic fish tank fabrication',
  'aquarium cabinets UAE',
  'saltwater aquarium UAE',
  'aquarium equipment UAE',
  'fish tank maker Abu Dhabi',
  'aquarium builder Saudi Arabia',
  'aquarium builder Oman',
  'Vinoos Trading',
];

/** A real, always-available photo for LocalBusiness `image`. */
const PRIMARY_IMAGE = HERO_IMAGES[0]?.url ?? `${SITE_URL}/opengraph-image`;

/**
 * LocalBusiness JSON-LD — the highest-impact structured data for a
 * location-based business. Rendered once in the root layout.
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    image: PRIMARY_IMAGE,
    logo: `${SITE_URL}/icon`,
    description: DEFAULT_DESCRIPTION,
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    foundingDate: '1997',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Umm Al Thuoob',
      addressLocality: 'Umm Al Quwain',
      addressCountry: 'AE',
    },
    hasMap: BUSINESS_INFO.googleMapsLink,
    areaServed: [
      'United Arab Emirates',
      'Dubai',
      'Abu Dhabi',
      'Saudi Arabia',
      'Oman',
    ].map((name) => ({ '@type': 'AdministrativeArea', name })),
    sameAs: [BUSINESS_INFO.instagramUrl, BUSINESS_INFO.facebookUrl].filter(
      Boolean
    ),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Aquarium & Fabrication Services',
      itemListElement: [
        'Custom Fish Tank Design & Build',
        'Acrylic Fabrication',
        'Aquarium Cabinets',
        'Aquarium Equipment Supply',
      ].map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  };
}

/** WebSite JSON-LD, tied to the business as publisher. */
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'en',
    publisher: { '@id': `${SITE_URL}/#business` },
  };
}

/** BreadcrumbList JSON-LD for an inner page. */
export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** ItemList JSON-LD describing a gallery of projects on a listing page. */
export function getItemListSchema(
  name: string,
  items: { title: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
    })),
  };
}
