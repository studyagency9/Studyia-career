import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n/i18nContext';
import PartnerLayout from '@/components/partner/PartnerLayout';
import BuilderPage from '@/pages/BuilderPage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/services/api';
import { generatePDFBlob } from '@/utils/pdfGenerator';
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

  // Fonction pour télécharger le CV en tant que partenaire
  const handlePartnerDownload = async () => {
    try {
      // Récupérer les données du CV depuis localStorage
      const builderData = localStorage.getItem('cv_data');
      if (!builderData) {
        toast({
          title: 'Erreur',
          description: 'Aucune donnée CV trouvée',
          variant: 'destructive',
        });
        return;
      }

      const cvData = JSON.parse(builderData);
      
      // Afficher le toast de début de processus
      toast({
        title: 'Génération en cours...',
        description: 'Génération du PDF et création du CV...',
      });

      console.log('🎯 DÉBUT - TÉLÉCHARGEMENT PARTENAIRE');
      console.log('============================================================');
      console.log('📋 INFOS DU CV :');
      console.log(`   👤 Nom: ${cvData.personalInfo?.firstName} ${cvData.personalInfo?.lastName}`);
      console.log(`   📧 Email: ${cvData.personalInfo?.email}`);
      console.log(`   🎨 Template: ${cvData.template}`);
      console.log('');

      // 1. Générer le PDF en local
      console.log('📥 Génération du PDF...');
      const pdfBlob = await generatePDFBlob(cvData);
      console.log('✅ PDF généré localement, taille:', pdfBlob.size, 'bytes');

      // 2. Créer une URL temporaire pour le PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);
      console.log('🔗 URL temporaire PDF créée');

      // 3. Préparer les données pour l'API partenaire
      const partnerData = {
        name: `CV ${cvData.personalInfo?.firstName} ${cvData.personalInfo?.lastName} - ${cvData.targetJob || 'Professionnel'}`,
        language: localStorage.getItem('language') || 'fr',
        data: {
          personalInfo: {
            firstName: cvData.personalInfo?.firstName || '',
            lastName: cvData.personalInfo?.lastName || '',
            email: cvData.personalInfo?.email || '',
            phoneNumber: cvData.personalInfo?.phone || '',
            dateOfBirth: "1990-01-01", // Valeur par défaut
            gender: "M", // Valeur par défaut
            position: cvData.targetJob || 'Professionnel',
            address: `${cvData.personalInfo?.city || ''}, ${cvData.personalInfo?.country || ''}`
          },
          experiences: cvData.experiences || [],
          education: cvData.education || [],
          skills: cvData.skills || [],
          template: cvData.template || 'modern'
        },
        pdfUrl: pdfUrl // URL temporaire pour le PDF
      };

      console.log('📤 Données partenaire:', partnerData);

      // 4. Appeler l'API partenaire
      console.log('🌐 Appel API /api/cvs/partner/create...');
      const response = await api.post('/cvs/partner/create', partnerData);

      if (response.data.success) {
        console.log('✅ CV créé avec succès !');
        console.log('   🆔 CV ID:', response.data.data.cv._id);
        console.log('   📊 Quota utilisé:', response.data.data.quotaInfo.used);
        console.log('   📊 Quota restant:', response.data.data.quotaInfo.remaining);

        // 5. Télécharger le PDF localement pour le client
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = `CV_${cvData.personalInfo?.firstName}_${cvData.personalInfo?.lastName}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Nettoyer l'URL temporaire
        URL.revokeObjectURL(pdfUrl);

        toast({
          title: 'CV créé avec succès !',
          description: `CV enregistré et téléchargé. Quota restant: ${response.data.data.quotaInfo.remaining}`,
        });

        console.log('🎉 TÉLÉCHARGEMENT PARTENAIRE TERMINÉ AVEC SUCCÈS');
        console.log('='.repeat(60));

      } else {
        throw new Error(response.data.error || 'Erreur lors de la création du CV');
      }

    } catch (error) {
      console.error('❌ Erreur lors du téléchargement partenaire:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
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

            <div className="flex items-center gap-2">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all"
              >
                <Save className="w-4 h-4 mr-2" />
                {t('home.partner.builder.save')}
              </Button>
              
              <Button
                onClick={handlePartnerDownload}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Builder Content */}
        <div className="bg-background">
          <BuilderPage isPartner={true} />
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
