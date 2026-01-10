import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Search, Trash2, Edit, Download, Calendar, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import PartnerLayout from '@/components/partner/PartnerLayout';
import { useToast } from '@/hooks/use-toast';
import { generatePDF } from '@/utils/pdfGenerator';
import { useTranslation } from '@/i18n/i18nContext';

const CVsPage = () => {
  const { savedCVs, deleteCV } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [cvToDelete, setCvToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const filteredCVs = savedCVs.filter(cv =>
    cv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteCV(id);
    setCvToDelete(null);
    toast({
      title: t('home.partner.cvs.cvDeleted'),
      description: t('home.partner.cvs.cvDeletedDesc'),
    });
  };

  const handleDownload = async (cv: any) => {
    try {
      await generatePDF(cv.data);
      toast({
        title: t('home.partner.cvs.downloadSuccess'),
        description: t('home.partner.cvs.downloadSuccessDesc'),
      });
    } catch (error) {
      toast({
        title: t('home.partner.cvs.error'),
        description: t('home.partner.cvs.downloadError'),
        variant: 'destructive',
      });
    }
  };

  return (
    <PartnerLayout>
      <div className="p-8 lg:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{t('home.partner.cvs.title')}</h1>
              <p className="text-muted-foreground">
                {t('home.partner.cvs.subtitle').replace('{{count}}', savedCVs.length.toString())}
              </p>
            </div>

            <Link to="/partner/create">
              <Button size="lg" className="bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all">
                <Plus className="w-5 h-5 mr-2" />
                {t('home.partner.cvs.newCV')}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('home.partner.cvs.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-background border-border focus:border-primary transition-colors"
            />
          </div>
        </motion.div>

        {/* CVs Grid */}
        {filteredCVs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredCVs.map((cv, index) => (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-6 bg-card border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
                    {/* CV Preview */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted rounded-xl mb-4 flex items-center justify-center border-2 border-border group-hover:border-primary/30 transition-colors overflow-hidden">
                      <div className="text-center p-6">
                        <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-sm font-medium text-foreground">
                          {cv.data?.personalInfo?.firstName} {cv.data?.personalInfo?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {cv.data?.targetJob || t('home.partner.cvs.untitled')}
                        </p>
                      </div>
                    </div>

                    {/* CV Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg mb-1 truncate group-hover:text-primary transition-colors">
                          {cv.name}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(cv.updatedAt).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {cv.language.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <Link to={`/partner/builder/${cv.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full group-hover:border-primary group-hover:text-primary transition-colors">
                            <Edit className="w-4 h-4 mr-2" />
                            {t('home.partner.cvs.edit')}
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(cv)}
                          className="group-hover:border-primary group-hover:text-primary transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCvToDelete(cv.id)}
                          className="text-destructive hover:bg-destructive/10 hover:border-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-12 text-center bg-card border-2 border-dashed border-border">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {searchQuery ? t('home.partner.cvs.noCVFound') : t('home.partner.cvs.noCVYet')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery
                  ? t('home.partner.cvs.tryAnotherSearch')
                  : t('home.partner.cvs.createFirstCV')}
              </p>
              {!searchQuery && (
                <Link to="/partner/create">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all">
                    <Plus className="w-5 h-5 mr-2" />
                    {t('home.partner.cvs.createFirstCVButton')}
                  </Button>
                </Link>
              )}
            </Card>
          </motion.div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!cvToDelete} onOpenChange={() => setCvToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('home.partner.cvs.deleteTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('home.partner.cvs.deleteDescription')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('home.partner.cvs.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => cvToDelete && handleDelete(cvToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t('home.partner.cvs.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PartnerLayout>
  );
};

export default CVsPage;
