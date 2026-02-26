import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface UploadedFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface CVUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  onAnalyzeAll?: () => void;
  isAnalyzing?: boolean;
  maxFiles?: number;
  maxSize?: number; // en MB
  className?: string;
}

export const CVUploadZone = ({
  onFilesSelected,
  onAnalyzeAll,
  isAnalyzing = false,
  maxFiles = 10,
  maxSize = 10,
  className,
}: CVUploadZoneProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const MAX_CV_LIMIT = 10;

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Gérer les fichiers rejetés
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach((rejected) => {
          const error = rejected.errors[0]?.message || 'Fichier invalide';
          console.error('Fichier rejeté:', rejected.file.name, error);
        });
      }

      // Vérifier la limite de 10 CV
      const remainingSlots = MAX_CV_LIMIT - uploadedFiles.length;
      if (remainingSlots <= 0) {
        console.warn('⚠️ Limite de 10 CV atteinte');
        return;
      }

      // Limiter le nombre de fichiers à ajouter
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);
      if (filesToAdd.length < acceptedFiles.length) {
        console.warn(`⚠️ Seulement ${filesToAdd.length} CV ajouté(s) - Limite de 10 atteinte`);
      }

      // Ajouter les fichiers acceptés
      const newFiles: UploadedFile[] = filesToAdd.map((file) => ({
        file,
        id: Math.random().toString(36).substring(7),
        status: 'pending',
        progress: 0,
      }));

      const allFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(allFiles);
      onFilesSelected(allFiles.map(f => f.file));
    },
    [onFilesSelected, uploadedFiles, MAX_CV_LIMIT]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles,
    maxSize: maxSize * 1024 * 1024,
    multiple: true,
  });

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter((f) => f.id !== id);
    setUploadedFiles(updatedFiles);
    onFilesSelected(updatedFiles.map(f => f.file));
  };

  const clearAll = () => {
    setUploadedFiles([]);
    onFilesSelected([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Zone de drop */}
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer',
          'hover:border-violet-500 hover:bg-violet-50/50',
          isDragActive
            ? 'border-violet-500 bg-violet-50 scale-[1.02]'
            : 'border-gray-300 bg-gray-50/50'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-xl bg-violet-100 flex items-center justify-center">
            <Upload className="w-10 h-10 text-violet-600" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {isDragActive
                ? 'Déposez les fichiers ici'
                : 'Importer des CV'}
            </h3>
            <p className="text-sm text-gray-600 max-w-sm">
              Glissez-déposez vos fichiers ou cliquez pour parcourir
            </p>
            <p className="text-xs text-gray-500">
              Formats acceptés : PDF, Word • Max {maxSize}MB par fichier
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="gap-2 border-violet-200 hover:bg-violet-50 hover:border-violet-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Upload className="w-4 h-4" />
            Sélectionner des fichiers
          </Button>
        </div>

        {/* Overlay quand on drag */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-violet-500/10 rounded-xl pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Liste des fichiers uploadés */}
      <AnimatePresence mode="popLayout">
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  {uploadedFiles.length} fichier{uploadedFiles.length > 1 ? 's' : ''} sélectionné{uploadedFiles.length > 1 ? 's' : ''}
                </h4>
                <div className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded text-xs font-medium">
                  {uploadedFiles.length}/{MAX_CV_LIMIT}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  disabled={isAnalyzing}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs whitespace-nowrap"
                >
                  Tout supprimer
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {uploadedFiles.map((uploadedFile) => (
                <motion.div
                  key={uploadedFile.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-violet-300 transition-colors"
                >
                  {/* Icône fichier */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-violet-600" />
                    </div>
                  </div>

                  {/* Infos fichier */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadedFile.file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                      {uploadedFile.status === 'uploading' && (
                        <Progress value={uploadedFile.progress} className="h-1 flex-1 max-w-[100px]" />
                      )}
                    </div>
                  </div>

                  {/* Statut */}
                  <div className="flex-shrink-0">
                    {uploadedFile.status === 'pending' && (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    {uploadedFile.status === 'uploading' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 rounded-full border-2 border-violet-500 border-t-transparent"
                      />
                    )}
                    {uploadedFile.status === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {uploadedFile.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  {/* Bouton supprimer */}
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Bouton Analyser en bas */}
            {onAnalyzeAll && uploadedFiles.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={onAnalyzeAll}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyse en cours...
                    </>
                  ) : (
                    `Analyser ${uploadedFiles.length > 1 ? `les ${uploadedFiles.length} CV` : 'le CV'}`
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
