/**
 * Breadcrumbs Component for SEO and Navigation
 * Implements semantic HTML and structured data for better SEO
 */

import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { getBreadcrumbSchema, injectStructuredData } from '@/utils/seo';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className = '' }: BreadcrumbsProps) => {
  // Add home as first item if not present
  const breadcrumbItems = [
    { name: 'Accueil', url: 'https://career.studyia.net/' },
    ...items
  ];

  useEffect(() => {
    // Inject breadcrumb structured data
    const schema = getBreadcrumbSchema(breadcrumbItems);
    injectStructuredData(schema);
  }, [items]);

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbItems.map((item, index) => (
          <li 
            key={index}
            className="flex items-center gap-2"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            {index === breadcrumbItems.length - 1 ? (
              <span 
                className="text-foreground font-medium"
                itemProp="name"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <Link 
                to={item.url.replace('https://career.studyia.net', '')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                itemProp="item"
              >
                <span itemProp="name">
                  {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
                  {item.name}
                </span>
              </Link>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
