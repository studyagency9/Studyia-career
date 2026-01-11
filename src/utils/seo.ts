/**
 * SEO Utilities for Studyia Career
 * Manages dynamic meta tags, structured data, and SEO optimization
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Update document meta tags dynamically for SPA
 */
export const updateMetaTags = (config: SEOConfig) => {
  const baseUrl = 'https://career.studyia.net';
  
  // Update title
  document.title = config.title;
  
  // Update or create meta tags
  const updateMeta = (name: string, content: string, isProperty = false) => {
    const attribute = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  };
  
  // Standard meta tags
  updateMeta('description', config.description);
  if (config.keywords) updateMeta('keywords', config.keywords);
  if (config.author) updateMeta('author', config.author);
  
  // Open Graph
  updateMeta('og:title', config.title, true);
  updateMeta('og:description', config.description, true);
  updateMeta('og:type', config.ogType || 'website', true);
  updateMeta('og:url', config.canonical || window.location.href, true);
  updateMeta('og:site_name', 'Studyia Career', true);
  
  if (config.ogImage) {
    updateMeta('og:image', config.ogImage.startsWith('http') ? config.ogImage : `${baseUrl}${config.ogImage}`, true);
    updateMeta('og:image:width', '1200', true);
    updateMeta('og:image:height', '630', true);
  }
  
  // Twitter Card
  updateMeta('twitter:card', 'summary_large_image');
  updateMeta('twitter:title', config.title);
  updateMeta('twitter:description', config.description);
  if (config.ogImage) {
    updateMeta('twitter:image', config.ogImage.startsWith('http') ? config.ogImage : `${baseUrl}${config.ogImage}`);
  }
  
  // Robots
  if (config.noindex || config.nofollow) {
    const robotsContent = [
      config.noindex ? 'noindex' : 'index',
      config.nofollow ? 'nofollow' : 'follow'
    ].join(', ');
    updateMeta('robots', robotsContent);
  }
  
  // Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = config.canonical || window.location.href;
  
  // Article meta tags
  if (config.publishedTime) {
    updateMeta('article:published_time', config.publishedTime, true);
  }
  if (config.modifiedTime) {
    updateMeta('article:modified_time', config.modifiedTime, true);
  }
};

/**
 * Generate JSON-LD structured data for Organization
 */
export const getOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Studyia Career',
    url: 'https://career.studyia.net',
    logo: 'https://career.studyia.net/favicon.svg',
    description: 'Plateforme de création de CV professionnels pour l\'Afrique francophone',
    address: {
      '@type': 'PostalAddress',
      addressCountry: ['CM', 'GA', 'GQ']
    },
    sameAs: [
      // Add social media profiles when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['fr', 'en', 'es']
    }
  };
};

/**
 * Generate JSON-LD structured data for WebSite
 */
export const getWebSiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Studyia Career',
    url: 'https://career.studyia.net',
    description: 'Créez un CV professionnel en quelques minutes. Guidé étape par étape, modèles approuvés par les recruteurs.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://career.studyia.net/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    inLanguage: ['fr', 'en', 'es']
  };
};

/**
 * Generate JSON-LD structured data for WebPage
 */
export const getWebPageSchema = (config: {
  name: string;
  description: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
}) => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: config.name,
    description: config.description,
    url: config.url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Studyia Career',
      url: 'https://career.studyia.net'
    }
  };
  
  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    schema.breadcrumb = getBreadcrumbSchema(config.breadcrumbs);
  }
  
  return schema;
};

/**
 * Generate JSON-LD structured data for BreadcrumbList
 */
export const getBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

/**
 * Generate JSON-LD structured data for SoftwareApplication
 */
export const getSoftwareApplicationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Studyia Career',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'XAF'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '247',
      bestRating: '5',
      worstRating: '1'
    },
    description: 'Application de création de CV professionnels avec templates approuvés par les recruteurs',
    featureList: [
      'Création de CV guidée',
      'Templates professionnels',
      'Export PDF instantané',
      'Prévisualisation en temps réel',
      'Support multilingue'
    ]
  };
};

/**
 * Generate JSON-LD structured data for FAQPage
 */
export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

/**
 * Generate JSON-LD structured data for HowTo
 */
export const getHowToSchema = (config: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: config.name,
    description: config.description,
    step: config.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image })
    }))
  };
};

/**
 * Inject structured data into the page
 */
export const injectStructuredData = (schema: object | object[]) => {
  // Remove existing structured data
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => script.remove());
  
  // Inject new structured data
  const schemas = Array.isArray(schema) ? schema : [schema];
  
  schemas.forEach(schemaObj => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObj);
    document.head.appendChild(script);
  });
};

/**
 * Complete SEO setup for a page
 */
export const setupPageSEO = (config: SEOConfig & {
  structuredData?: object | object[];
}) => {
  // Update meta tags
  updateMetaTags(config);
  
  // Inject structured data if provided
  if (config.structuredData) {
    injectStructuredData(config.structuredData);
  }
  
  // Scroll to top on page change
  window.scrollTo(0, 0);
};

/**
 * Generate sitemap data (for static generation)
 */
export const getSitemapData = () => {
  const baseUrl = 'https://career.studyia.net';
  const today = new Date().toISOString().split('T')[0];
  
  return [
    // Public pages
    { loc: `${baseUrl}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: `${baseUrl}/builder`, lastmod: today, changefreq: 'monthly', priority: '0.9' },
    { loc: `${baseUrl}/upload`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { loc: `${baseUrl}/partner-info`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
    
    // Partner pages (public)
    { loc: `${baseUrl}/partner/login`, lastmod: today, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/partner/signup`, lastmod: today, changefreq: 'monthly', priority: '0.6' },
    
    // Associate pages (public)
    { loc: `${baseUrl}/associate/login`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
    { loc: `${baseUrl}/associate/signup`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
  ];
};
