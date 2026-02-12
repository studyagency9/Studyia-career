import api from '@/services/api';

// Interface CVData locale pour éviter les erreurs d'import
interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    summary: string;
    photo: string;
  };
  targetJob: string;
  experiences: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  template: string;
  translations?: any;
}

/**
 * Système réel d'upload de PDF sur le serveur
 */
export class RealPDFUploader {
  /**
   * Génère un ID unique pour le PDF
   */
  static generatePDFId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `pdf_${timestamp}_${random}`;
  }

  /**
   * Upload vraiment le PDF sur le serveur et retourne l'URL
   */
  static async uploadPDFToServer(cvData: CVData, pdfBlob: Blob, price: number): Promise<{
    success: boolean;
    url?: string;
    pdfId?: string;
    error?: string;
  }> {
    try {
      const pdfId = this.generatePDFId();
      
      console.log('🎯 DÉBUT - UPLOAD RÉEL DU PDF');
      console.log('='.repeat(60));
      console.log('📋 INFOS DU CV :');
      console.log(`   👤 Nom: ${cvData.personalInfo?.firstName} ${cvData.personalInfo?.lastName}`);
      console.log(`   📧 Email: ${cvData.personalInfo?.email}`);
      console.log(`   🎨 Template: ${cvData.template}`);
      console.log(`   💰 Prix: ${price} FCFA`);
      console.log('');
      console.log('� INFOS DU PDF :');
      console.log(`   🆔 ID: ${pdfId}`);
      console.log(`   📊 Taille: ${pdfBlob.size} bytes`);
      console.log(`   📄 Type: ${pdfBlob.type}`);
      console.log('');

      // 1. Créer le FormData pour l'upload
      const formData = new FormData();
      formData.append('pdf', pdfBlob, `${pdfId}.pdf`);
      formData.append('pdfId', pdfId);
      formData.append('price', price.toString());
      // Note: cvData est envoyé pour info mais votre API ne l'utilise pas directement

      // 2. Uploader sur votre serveur DigitalOcean
      console.log('🌐 Upload vers le serveur DigitalOcean...');
      console.log(`   URL: https://studyiacareer-backend-qpmpz.ondigitalocean.app/api/pdfs/upload`);
      
      const response = await api.post('/pdfs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 secondes timeout
      });

      if (response.data.success) {
        const pdfUrl = response.data.data.url; // Votre API retourne data.url
        
        console.log('✅ PDF uploadé avec succès !');
        console.log('');
        console.log('🔗 URL DU PDF :');
        console.log(`   ${pdfUrl}`);
        console.log('');
        console.log('📁 EMPLACEMENT SERVEUR :');
        console.log(`   Serveur: https://studyiacareer-backend-qpmpz.ondigitalocean.app`);
        console.log(`   Dossier: /uploads/pdfs/`);
        console.log(`   Fichier: ${response.data.data.filename}`);
        console.log('');
        console.log('🎉 RÉSUMÉ :');
        console.log(`   🔗 URL: ${pdfUrl}`);
        console.log(`   🆔 ID: ${response.data.data.pdfId}`);
        console.log(`   📄 Fichier: ${response.data.data.filename}`);
        console.log(`   💰 Prix: ${price} FCFA`);
        console.log('='.repeat(60));
        
        return {
          success: true,
          url: pdfUrl,
          pdfId: pdfId
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de l\'upload');
      }

    } catch (error) {
      console.error('❌ Erreur upload PDF:', error);
      
      // En cas d'erreur, on retourne l'URL simulée pour que vous puissiez quand même tester
      const pdfId = this.generatePDFId();
      const fallbackUrl = `https://studyiacareer-backend-qpmpz.ondigitalocean.app/uploads/pdfs/${pdfId}.pdf`;
      
      console.log('⚠️ Erreur upload, URL simulée générée :');
      console.log(`   ${fallbackUrl}`);
      
      return {
        success: false,
        url: fallbackUrl,
        pdfId: pdfId,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Vérifie si le PDF est accessible sur le serveur (utilise votre API)
   */
  static async verifyPDFExists(pdfUrl: string): Promise<boolean> {
    try {
      console.log('🔍 Vérification de l\'accessibilité du PDF...');
      
      // Extraire le filename de l'URL
      const filename = pdfUrl.split('/').pop();
      
      // Utiliser votre API de vérification
      const response = await api.get(`/pdfs/verify/${filename}`);
      
      if (response.data.success) {
        const accessible = response.data.data.accessible;
        console.log(`   📄 PDF accessible: ${accessible ? '✅ Oui' : '❌ Non'}`);
        console.log(`   📊 Taille: ${response.data.data.size} bytes`);
        console.log(`   📅 Créé le: ${response.data.data.createdAt}`);
        return accessible;
      } else {
        console.log(`   ❌ PDF non trouvé: ${response.data.error}`);
        return false;
      }
    } catch (error) {
      console.log(`   ❌ Erreur vérification: ${error}`);
      return false;
    }
  }
}

export default RealPDFUploader;
