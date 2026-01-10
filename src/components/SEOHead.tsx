import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

/**
 * Composant pour gérer les meta tags dynamiques pour le SEO
 */
export const SEOHead = ({
  title = 'Studyia Career - Crée un CV professionnel qui ouvre des portes',
  description = 'Créez un CV professionnel en quelques minutes. Guidé étape par étape, modèles approuvés par les recruteurs. Téléchargement instantané en PDF. Parfait pour le Cameroun, Gabon et Guinée Équatoriale.',
  keywords = 'CV, curriculum vitae, emploi, recrutement, Cameroun, Gabon, Guinée Équatoriale, Afrique, carrière, professionnel',
  image = '/og-image.jpg',
  url,
  type = 'website',
}: SEOHeadProps) => {
  const location = useLocation();
  const currentUrl = url || `https://studyiacareer.com${location.pathname}`;

  useEffect(() => {
    // Mettre à jour le titre
    document.title = title;

    // Fonction helper pour mettre à jour ou créer une meta tag
    const updateMetaTag = (property: string, content: string, isProperty = true) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Meta tags standards
    updateMetaTag('description', description, false);
    updateMetaTag('keywords', keywords, false);

    // Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', type);
    updateMetaTag('og:url', currentUrl);
    updateMetaTag('og:image', image);
    updateMetaTag('og:site_name', 'Studyia Career');
    updateMetaTag('og:locale', 'fr_FR');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', false);
    updateMetaTag('twitter:title', title, false);
    updateMetaTag('twitter:description', description, false);
    updateMetaTag('twitter:image', image, false);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;

    // Structured Data (JSON-LD)
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Studyia Career',
      description: description,
      url: 'https://studyiacareer.com',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'XAF',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1250',
      },
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
  }, [title, description, keywords, image, currentUrl, type]);

  return null;
};

// Configurations SEO prédéfinies pour chaque page
export const SEOConfigs = {
  home: {
    title: 'Studyia Career - Crée un CV professionnel qui ouvre des portes',
    description: 'Créez un CV professionnel en quelques minutes. Guidé étape par étape, modèles approuvés par les recruteurs. Téléchargement instantané en PDF.',
    keywords: 'CV gratuit, créer CV, CV professionnel, emploi Cameroun, CV Afrique, recrutement',
  },
  builder: {
    title: 'Créateur de CV - Studyia Career',
    description: 'Créez votre CV professionnel étape par étape avec notre éditeur intuitif. Modèles modernes, suggestions IA, téléchargement PDF instantané.',
    keywords: 'créateur CV, éditeur CV, builder CV, faire un CV, CV en ligne',
  },
  upload: {
    title: 'Mettre à jour mon CV - Studyia Career',
    description: 'Importez votre CV existant et laissez notre IA l\'analyser et le pré-remplir automatiquement. Gagnez du temps avec l\'extraction intelligente.',
    keywords: 'importer CV, analyser CV, parser CV, IA CV, mise à jour CV',
  },
};
