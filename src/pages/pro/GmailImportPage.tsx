import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, FileText, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { gmailService, GmailEmail } from '@/services/gmailService';
import { jobPostsService } from '@/services/jobPostsService';
import { useToast } from '@/hooks/use-toast';
import { GmailConnectButton } from '@/components/pro/GmailConnectButton';

export const GmailImportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isConnected, setIsConnected] = useState(false);
  const [emails, setEmails] = useState<GmailEmail[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [jobPosts, setJobPosts] = useState<any[]>([]);
  const [selectedJobPost, setSelectedJobPost] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadJobPosts();
  }, []);

  useEffect(() => {
    if (isConnected) {
      loadEmails();
    }
  }, [isConnected]);

  const loadJobPosts = async () => {
    try {
      const { jobPosts: posts } = await jobPostsService.getJobPosts({ status: 'active' });
      setJobPosts(posts);
      if (posts.length > 0) {
        setSelectedJobPost(posts[0]._id || posts[0].id);
      }
    } catch (error) {
      console.error('Erreur chargement job posts:', error);
    }
  };

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      const result = await gmailService.getEmails({
        maxResults: 50,
        query: searchQuery || 'has:attachment (filename:pdf OR filename:doc OR filename:docx)',
      });
      setEmails(result.emails);
    } catch (error) {
      console.error('Erreur chargement emails:', error);
      toast({
        title: '❌ Erreur',
        description: 'Impossible de charger les emails',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEmailSelection = (emailId: string) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(emailId)) {
      newSelected.delete(emailId);
    } else {
      newSelected.add(emailId);
    }
    setSelectedEmails(newSelected);
  };

  const selectAll = () => {
    if (selectedEmails.size === emails.length) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(emails.map(e => e.id)));
    }
  };

  const handleImport = async () => {
    if (!selectedJobPost) {
      toast({
        title: '⚠️ Attention',
        description: 'Veuillez sélectionner un job post',
        variant: 'destructive',
      });
      return;
    }

    if (selectedEmails.size === 0) {
      toast({
        title: '⚠️ Attention',
        description: 'Veuillez sélectionner au moins un email',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);
    try {
      const attachmentsToImport = emails
        .filter(email => selectedEmails.has(email.id))
        .flatMap(email => 
          email.attachments.map(att => ({
            messageId: email.id,
            attachmentId: att.attachmentId,
            filename: att.filename,
            senderEmail: extractEmail(email.from),
          }))
        );

      const result = await gmailService.importToJobPost(selectedJobPost, attachmentsToImport);

      toast({
        title: '✅ Import réussi',
        description: `${result.imported} CV importé${result.imported > 1 ? 's' : ''} avec succès`,
      });

      setSelectedEmails(new Set());
      navigate(`/pro/jobs/${selectedJobPost}`);
    } catch (error) {
      console.error('Erreur import:', error);
      toast({
        title: '❌ Erreur',
        description: 'Impossible d\'importer les CV',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const extractEmail = (from: string): string => {
    const match = from.match(/<(.+?)>/);
    return match ? match[1] : from;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/pro/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Importer depuis Gmail</h1>
              <p className="text-gray-600 mt-1">
                Importez automatiquement les CV reçus par email
              </p>
            </div>
          </div>
          <GmailConnectButton onConnectionChange={setIsConnected} />
        </div>

        {!isConnected ? (
          <Card className="p-12 text-center">
            <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Mail className="w-12 h-12 text-violet-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Connectez votre compte Gmail
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Accédez à vos emails et importez directement les CV reçus vers vos offres d'emploi
            </p>
            <GmailConnectButton onConnectionChange={setIsConnected} />
          </Card>
        ) : (
          <>
            {/* Filtres et sélection job post */}
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rechercher dans les emails
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Candidature développeur..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && loadEmails()}
                    />
                    <Button onClick={loadEmails} disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Rechercher'}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Importer vers
                  </label>
                  <select
                    value={selectedJobPost}
                    onChange={(e) => setSelectedJobPost(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    {jobPosts.map((job) => (
                      <option key={job._id || job.id} value={job._id || job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Actions */}
            {emails.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedEmails.size === emails.length}
                    onCheckedChange={selectAll}
                  />
                  <span className="text-sm text-gray-600">
                    {selectedEmails.size} / {emails.length} sélectionné{selectedEmails.size > 1 ? 's' : ''}
                  </span>
                </div>
                <Button
                  onClick={handleImport}
                  disabled={selectedEmails.size === 0 || isImporting}
                  className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Importer {selectedEmails.size > 0 ? `(${selectedEmails.size})` : ''}
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Liste des emails */}
            {isLoading ? (
              <Card className="p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-violet-600 mx-auto mb-4" />
                <p className="text-gray-600">Chargement des emails...</p>
              </Card>
            ) : emails.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun email trouvé
                </h3>
                <p className="text-gray-600">
                  Aucun email avec pièce jointe CV (PDF/DOC/DOCX) trouvé
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {emails.map((email, index) => (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        selectedEmails.has(email.id)
                          ? 'border-violet-500 bg-violet-50'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => toggleEmailSelection(email.id)}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedEmails.has(email.id)}
                          onCheckedChange={() => toggleEmailSelection(email.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{email.subject}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                De: {email.from}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(email.date)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{email.snippet}</p>
                          <div className="flex flex-wrap gap-2">
                            {email.attachments.map((att, idx) => (
                              <Badge
                                key={idx}
                                className="gap-2 bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 border-violet-200"
                              >
                                <FileText className="w-3 h-3" />
                                {att.filename}
                                <span className="text-xs opacity-70">
                                  ({formatFileSize(att.size)})
                                </span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GmailImportPage;
