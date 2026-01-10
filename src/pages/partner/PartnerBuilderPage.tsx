import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n/i18nContext';
import PartnerLayout from '@/components/partner/PartnerLayout';
import BuilderPage from '@/pages/BuilderPage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PartnerBuilderPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getCV, saveCV, updateCV } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [cvName, setCvName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [cvData, setCvData] = useState<any>(null);
  const [isNewCV, setIsNewCV] = useState(false);

  useEffect(() => {
    if (id === 'new') {
      setIsNewCV(true);
      setShowSaveDialog(true);
      
      // Vérifier si des données uploadées sont passées via location.state
      if (location.state?.uploadedData) {
        const data = location.state.uploadedData;
        // Stocker dans localStorage pour que BuilderPage puisse les charger
        localStorage.setItem('cv_data', JSON.stringify(data));
        setCvData(data);
        
        // Nettoyer le state pour éviter de recharger les données au prochain render
        navigate(location.pathname, { replace: true, state: {} });
      } else {
        // Sinon, vérifier si des données existent déjà dans le localStorage
        const uploadedData = localStorage.getItem('cv_data');
        if (uploadedData) {
          try {
            setCvData(JSON.parse(uploadedData));
          } catch (e) {
            console.error('Error parsing uploaded CV data:', e);
          }
        }
      }
    } else if (id) {
      const existingCV = getCV(id);
      if (existingCV) {
        setCvData(existingCV.data);
        setCvName(existingCV.name);
        // Charger les données du CV dans le localStorage pour BuilderPage
        localStorage.setItem('cv_data', JSON.stringify(existingCV.data));
      } else {
        toast({
          title: t('home.partner.builder.cvNotFound'),
          description: t('home.partner.builder.cvNotFoundDesc'),
          variant: 'destructive',
        });
        navigate('/partner/cvs');
      }
    }
  }, [id, getCV, navigate, toast]);

  const handleSave = () => {
    if (!cvName.trim()) {
      toast({
        title: t('home.partner.builder.nameRequired'),
        description: t('home.partner.builder.nameRequiredDesc'),
        variant: 'destructive',
      });
      setShowSaveDialog(true);
      return;
    }

    // Récupérer les données depuis localStorage (où BuilderPage les stocke)
    const builderData = localStorage.getItem('cv_data');
    if (!builderData) {
      toast({
        title: t('home.partner.builder.error'),
        description: t('home.partner.builder.noDataToSave'),
        variant: 'destructive',
      });
      return;
    }

    const data = JSON.parse(builderData);

    if (isNewCV || id === 'new') {
      // Récupérer la langue depuis le contexte i18n
      const language = localStorage.getItem('language') as 'fr' | 'en' || 'fr';
      
      saveCV({
        name: cvName,
        language,
        data,
      });

      toast({
        title: t('home.partner.builder.cvCreated'),
        description: t('home.partner.builder.cvCreatedDesc'),
      });

      navigate('/partner/cvs');
    } else if (id) {
      updateCV(id, data);

      toast({
        title: t('home.partner.builder.cvUpdated'),
        description: t('home.partner.builder.cvUpdatedDesc'),
      });
    }
  };

  const handleNameSubmit = () => {
    if (cvName.trim()) {
      setShowSaveDialog(false);
    }
  };

  return (
    <PartnerLayout>
      <div className="relative">
        {/* Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
        >
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/partner/cvs')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('home.partner.builder.back')}
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <p className="text-sm font-medium text-foreground">{cvName || t('home.partner.builder.newCV')}</p>
                <p className="text-xs text-muted-foreground">
                  {isNewCV || id === 'new' ? t('home.partner.builder.creating') : t('home.partner.builder.editing')}
                </p>
              </div>
            </div>

            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              {t('home.partner.builder.save')}
            </Button>
          </div>
        </motion.div>

        {/* Builder Content */}
        <div className="bg-background">
          <BuilderPage />
        </div>

        {/* Name Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('home.partner.builder.nameYourCV')}</DialogTitle>
              <DialogDescription>
                {t('home.partner.builder.nameYourCVDesc')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cvName">{t('home.partner.builder.cvName')}</Label>
                <Input
                  id="cvName"
                  placeholder={t('home.partner.builder.cvNamePlaceholder')}
                  value={cvName}
                  onChange={(e) => setCvName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNameSubmit();
                    }
                  }}
                  autoFocus
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => navigate('/partner/cvs')}>
                {t('home.partner.builder.cancel')}
              </Button>
              <Button onClick={handleNameSubmit} disabled={!cvName.trim()}>
                {t('home.partner.builder.continue')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PartnerLayout>
  );
};

export default PartnerBuilderPage;
