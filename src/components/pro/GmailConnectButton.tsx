import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Check, Loader2 } from 'lucide-react';
import { gmailService } from '@/services/gmailService';
import { useToast } from '@/hooks/use-toast';

interface GmailConnectButtonProps {
  onConnectionChange?: (connected: boolean) => void;
}

export const GmailConnectButton = ({ onConnectionChange }: GmailConnectButtonProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const status = await gmailService.getStatus();
      setIsConnected(status.connected);
      setUserEmail(status.email);
      onConnectionChange?.(status.connected);
    } catch (error) {
      console.error('Erreur vérification statut Gmail:', error);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await gmailService.openAuthWindow();
      
      setTimeout(async () => {
        await checkStatus();
        setIsLoading(false);
        
        const status = await gmailService.getStatus();
        if (status.connected) {
          toast({
            title: '✅ Gmail connecté',
            description: `Connecté avec ${status.email}`,
          });
        }
      }, 1000);
    } catch (error) {
      console.error('Erreur connexion Gmail:', error);
      setIsLoading(false);
      toast({
        title: '❌ Erreur',
        description: 'Impossible de se connecter à Gmail',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await gmailService.disconnect();
      setIsConnected(false);
      setUserEmail(null);
      onConnectionChange?.(false);
      
      toast({
        title: 'Gmail déconnecté',
        description: 'Votre compte Gmail a été déconnecté',
      });
    } catch (error) {
      console.error('Erreur déconnexion Gmail:', error);
      toast({
        title: '❌ Erreur',
        description: 'Impossible de déconnecter Gmail',
        variant: 'destructive',
      });
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">{userEmail}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Déconnecter
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Connexion...
        </>
      ) : (
        <>
          <Mail className="w-4 h-4" />
          Connecter Gmail
        </>
      )}
    </Button>
  );
};
