/**
 * React Hook for SEO management
 * Automatically updates meta tags and structured data when component mounts
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEOConfig, setupPageSEO } from '@/utils/seo';

export const useSEO = (config: SEOConfig & { structuredData?: object | object[] }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Setup SEO for the page
    setupPageSEO(config);
  }, [location.pathname, config.title, config.description]);
};

export default useSEO;
