import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, FileText, Download, Eye } from 'lucide-react';
import { useState } from 'react';
import { templateComponents } from '@/components/CVTemplates';

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  candidateName: string;
  isGenerating?: boolean;
  cvData?: any;
}

const templates = [
  { 
    id: 'professional', 
    name: 'Professionnel', 
    description: 'Sobre et élégant, idéal pour tous secteurs',
    color: 'from-blue-600 to-blue-700'
  },
  { 
    id: 'modern', 
    name: 'Moderne', 
    description: 'Design contemporain et épuré',
    color: 'from-slate-500 to-slate-700'
  },
  { 
    id: 'creative', 
    name: 'Créatif', 
    description: 'Original et coloré pour les métiers créatifs',
    color: 'from-purple-600 to-pink-500'
  },
  { 
    id: 'minimal', 
    name: 'Minimaliste', 
    description: 'Simple et efficace',
    color: 'from-gray-200 to-gray-400'
  },
  { 
    id: 'elegant', 
    name: 'Élégant', 
    description: 'Raffiné pour les postes de direction',
    color: 'from-gray-100 to-gray-300'
  },
  { 
    id: 'bold', 
    name: 'Audacieux', 
    description: 'Dynamique et percutant',
    color: 'from-orange-500 to-red-500'
  },
  { 
    id: 'gradient', 
    name: 'Gradient', 
    description: 'Moderne avec des dégradés de couleurs',
    color: 'from-indigo-500 to-purple-500'
  },
  { 
    id: 'shi', 
    name: 'SHI', 
    description: 'Design premium et luxueux',
    color: 'from-purple-600 via-pink-600 to-purple-700'
  },
  { 
    id: 'tnmd', 
    name: 'TNMD', 
    description: 'Tech et moderne',
    color: 'from-cyan-500 via-blue-500 to-indigo-600'
  },
  { 
    id: 'stockholm', 
    name: 'Stockholm', 
    description: 'Scandinave et épuré',
    color: 'from-white to-blue-100'
  },
];

export const TemplateSelectionModal = ({
  isOpen,
  onClose,
  onSelectTemplate,
  candidateName,
  isGenerating = false,
  cvData,
}: TemplateSelectionModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = () => {
    onSelectTemplate(selectedTemplate);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden my-8"
            >
              <div className="relative bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50 p-6 pb-8">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isGenerating}
                >
                  <X className="w-5 h-5" />
                </button>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <FileText className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              <div className="p-6 pt-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  Choisir un template de CV
                </h3>
                <p className="text-gray-600 text-center mb-1">
                  Sélectionnez le design pour le CV de <span className="font-semibold text-violet-600">{candidateName}</span>
                </p>
                <p className="text-sm text-gray-500 text-center mb-6">
                  Le CV sera généré avec les informations du candidat
                </p>

                {/* Layout en 2 colonnes : Templates à gauche, Preview à droite */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Colonne gauche : Liste des templates */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Templates disponibles</h4>
                    <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                      {templates.map((template) => (
                        <motion.div
                          key={template.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedTemplate(template.id);
                            setShowPreview(true);
                          }}
                          className={`relative p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedTemplate === template.id
                              ? 'border-violet-600 bg-violet-50 shadow-lg'
                              : 'border-gray-200 hover:border-violet-300'
                          }`}
                        >
                          {selectedTemplate === template.id && (
                            <div className="absolute -top-2 -right-2 bg-violet-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                              ✓
                            </div>
                          )}
                          <div className={`aspect-[3/4] bg-gradient-to-br ${template.color} rounded mb-2 flex items-center justify-center shadow-sm`}>
                            <FileText className="w-6 h-6 text-white opacity-80" />
                          </div>
                          <h4 className="font-semibold text-xs text-center mb-1">{template.name}</h4>
                          <p className="text-[10px] text-gray-500 text-center leading-tight">{template.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Colonne droite : Preview grand et visible */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Aperçu : {templates.find(t => t.id === selectedTemplate)?.name}
                      </h4>
                    </div>
                    {cvData ? (
                      <div className="border-2 border-violet-200 rounded-lg overflow-hidden bg-white shadow-lg">
                        <div className="bg-gradient-to-r from-violet-50 to-blue-50 px-4 py-2 border-b border-violet-200">
                          <p className="text-xs text-violet-700 font-medium">Aperçu en temps réel</p>
                        </div>
                        <div className="bg-gray-50 p-4 max-h-[500px] overflow-y-auto">
                          <div className="bg-white shadow-xl mx-auto" style={{ width: '210mm', transform: 'scale(0.35)', transformOrigin: 'top center' }}>
                            {(() => {
                              const TemplateComponent = templateComponents[selectedTemplate as keyof typeof templateComponents];
                              return TemplateComponent ? <TemplateComponent data={cvData} /> : null;
                            })()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg h-[500px] flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Sélectionnez un template pour voir l'aperçu</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-violet-900">
                        Template sélectionné : {templates.find(t => t.id === selectedTemplate)?.name}
                      </p>
                      <p className="text-xs text-violet-700">
                        Le CV sera généré au format PDF avec toutes les informations du candidat
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isGenerating}
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Génération...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Télécharger le CV
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
