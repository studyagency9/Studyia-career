import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { FileQuestion, Home, ArrowLeft, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/i18nContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  useSEO({
    title: '404 - Page non trouvée | Studyia Career',
    description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
    noindex: true,
    nofollow: true
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-bright/5 rounded-full blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      <div className="relative z-10 w-full max-w-2xl">
        <motion.div 
          className="bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div 
              className="mb-6"
              variants={itemVariants}
              animate={{ 
                y: [0, -15, 0],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: [0.42, 0, 0.58, 1] // easeInOut
                }
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full transform scale-75 -translate-y-4" />
                <div className="relative bg-gradient-to-br from-primary/80 to-blue-bright/80 w-24 h-24 rounded-full flex items-center justify-center">
                  <FileQuestion className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-blue-bright bg-clip-text text-transparent">
                404
              </h1>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('errors.pageNotFound') || 'Page non trouvée'}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {t('errors.pageNotFoundDesc') || 'La page que vous recherchez n\'existe pas ou a été déplacée.'}
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="w-full max-w-sm mb-6">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  placeholder={t('errors.searchPlaceholder') || 'Essayez de rechercher...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 justify-center">
              <Link to="/">
                <Button variant="default" className="gap-2">
                  <Home className="w-4 h-4" />
                  {t('errors.backToHome') || 'Retour à l\'accueil'}
                </Button>
              </Link>
              <Button variant="outline" className="gap-2" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4" />
                {t('errors.goBack') || 'Page précédente'}
              </Button>
              <Button variant="ghost" className="gap-2" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4" />
                {t('errors.refresh') || 'Actualiser'}
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-8 text-xs text-muted-foreground">
              <p>ID: <code className="bg-muted px-1 py-0.5 rounded">{location.pathname}</code></p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
