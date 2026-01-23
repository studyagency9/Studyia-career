import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Copy, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n/i18nContext';
import { Input } from '@/components/ui/input';

interface PaymentOptionsProps {
  onClose: (transactionId?: string) => void;
  onCancel?: () => void;
  isAIGenerated?: boolean;
}

export function PaymentOptions({ onClose, onCancel, isAIGenerated = false }: PaymentOptionsProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [copied, setCopied] = useState<'orange' | 'mtn' | null>(null);
  const [transactionId, setTransactionId] = useState<string>('');
  const [transactionError, setTransactionError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'orange' | 'mtn'>('orange');
  
  const price = isAIGenerated ? 2000 : 1100;
  
  // Codes USSD avec les numéros et montants
  const orangeCode = `#150*1*1*691988958*${price}*2*career#`;
  const mtnCode = `*126*1*1*671373978*${price}#`;

  const copyToClipboard = (text: string, type: 'orange' | 'mtn') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      toast({
        title: t('payment.codeCopied'),
        description: t('payment.pasteInDialer'),
      });
      
      setTimeout(() => {
        setCopied(null);
      }, 3000);
    });
  };
  
  // Vérifier le format de l'ID de transaction
  const validateTransactionId = (id: string, type: 'orange' | 'mtn'): boolean => {
    if (!id || id.trim().length < 5) return false;
    
    if (type === 'orange') {
      // Format Orange: "PP260122.1311.C31445" ou "MP260122.1542.B58643"
      // Format: [MP|PP] + 6 chiffres (date) + . + 4 chiffres (heure) + . + [A-Z] + 5-6 chiffres
      const formatValid = /^[A-Z]{2}\d{6}\.\d{4}\.[A-Z]\d{5,6}$/.test(id.trim());
      
      if (!formatValid) return false;
      
      // Vérification de la date et l'heure avec une marge de temps
      try {
        const currentDate = new Date();
        
        // Extraire la date et l'heure de l'ID
        const idTrimmed = id.trim();
        const yearStr = idTrimmed.substring(2, 4);
        const monthStr = idTrimmed.substring(4, 6);
        const dayStr = idTrimmed.substring(6, 8);
        const hourStr = idTrimmed.substring(9, 11);
        const minuteStr = idTrimmed.substring(11, 13);
        
        // Convertir en nombres
        const year = 2000 + parseInt(yearStr, 10); // Supposer 20xx
        const month = parseInt(monthStr, 10) - 1; // Les mois commencent à 0 en JS
        const day = parseInt(dayStr, 10);
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        
        // Créer la date de la transaction
        const transactionDate = new Date(year, month, day, hour, minute);
        
        // Vérifier si la date est valide
        if (isNaN(transactionDate.getTime())) return false;
        
        // Vérifier si la date est aujourd'hui
        const isToday = (
          currentDate.getFullYear() === transactionDate.getFullYear() &&
          currentDate.getMonth() === transactionDate.getMonth() &&
          currentDate.getDate() === transactionDate.getDate()
        );
        
        if (!isToday) return false;
        
        // Calculer la différence en minutes
        const diffMs = Math.abs(currentDate.getTime() - transactionDate.getTime());
        const diffMinutes = Math.floor(diffMs / 60000);
        
        // Accepter les transactions des 60 dernières minutes (marge d'une heure)
        // ou des 5 prochaines minutes (pour les horloges légèrement décalées)
        const isWithinTimeWindow = (
          (transactionDate <= currentDate && diffMinutes <= 60) || // Transaction dans le passé (jusqu'à 60 min)
          (transactionDate > currentDate && diffMinutes <= 5)      // Transaction dans le futur (jusqu'à 5 min - décalage d'horloge)
        );
        
        return isWithinTimeWindow;
      } catch (error) {
        console.error('Erreur lors de la validation de la date/heure:', error);
        // En cas d'erreur dans le parsing, accepter si le format est valide
        return true;
      }
    } else {
      // Format MTN: 15405748542 (numérique, exactement 11 chiffres)
      return /^\d{11}$/.test(id.trim());
    }
  };

  const handleConfirmPayment = () => {
    
    if (!validateTransactionId(transactionId, activeTab)) {
      // Alterner entre les deux messages d'erreur
      setErrorCount(prevCount => prevCount + 1);
      const isAlternateMessage = errorCount % 2 === 0;
      
      if (isAlternateMessage) {
        setTransactionError(t('payment.pleaseEnterValidId'));
      } else {
        setTransactionError(t('payment.invalidId'));
      }
      return;
    }
    
    // Démarrer l'animation de vérification
    setIsVerifying(true);
    
    // Simuler une vérification
    setTimeout(() => {
      setIsVerifying(false);
      setIsConfirmed(true);
      
      // Afficher un toast de confirmation
      toast({
        title: t('payment.paymentConfirmed'),
        description: t('payment.processingPayment'),
      });
      
      // Fermer le modal et télécharger après un court délai
      setTimeout(() => {
        // Passer l'ID de transaction à la fonction onClose
        onClose(transactionId);
      }, 1500);
    }, 2000);
  };

  // Nous ne sauvegardons plus l'ID de transaction automatiquement

  return (
    <div>
      {/* Montant à payer */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent p-3 text-center border-y border-primary/10 relative overflow-hidden">
        <div className="absolute -right-3 -top-3 w-12 h-12 bg-primary/5 rounded-full blur-lg"></div>
        <div className="text-xs text-muted-foreground font-medium">{t('payment.amount')}</div>
        <div className="text-xl font-bold text-primary">{price} <span className="text-sm font-normal">FCFA</span></div>
      </div>

      {/* Tabs de paiement */}
      <Tabs defaultValue="orange" className="w-full" onValueChange={(value) => setActiveTab(value as 'orange' | 'mtn')}>
        <TabsList className="grid w-full grid-cols-2 p-0 bg-transparent border-b border-primary/10">
          <TabsTrigger value="orange" className="text-xs py-2 rounded-none border-r border-primary/10 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-b-primary transition-all duration-200">{t('payment.orangeMoney')}</TabsTrigger>
          <TabsTrigger value="mtn" className="text-xs py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-b-primary transition-all duration-200">{t('payment.mtnMoMo')}</TabsTrigger>
        </TabsList>

        {/* Orange Money Content */}
        <TabsContent value="orange" className="p-3">
          <div className="bg-gradient-to-r from-orange-50/40 to-orange-50/20 p-2 rounded-lg border border-orange-100/50 mb-3 shadow-sm">
            <div className="text-xs text-orange-700 mb-1 font-medium flex items-center">
              <div className="bg-orange-100 p-1 rounded-full mr-1">
                <div className="bg-orange-500 h-1.5 w-1.5 rounded-full"></div>
              </div>
              {t('payment.ussdCode')}
            </div>
            <div className="flex items-center">
              <code className="font-mono text-xs bg-white p-1.5 rounded border border-orange-100 flex-1 text-center shadow-inner">
                {orangeCode}
              </code>
              <Button 
                variant={copied === 'orange' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => copyToClipboard(orangeCode, 'orange')}
                className="ml-1 h-7 w-7 p-0 transition-all duration-200"
              >
                {copied === 'orange' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          
          <div className="text-xs mb-3 bg-blue-50/20 p-2 rounded-lg border border-blue-100/30">
            <div className="font-medium mb-1 text-blue-600/80 flex items-center">
              <div className="bg-blue-100 p-1 rounded-full mr-1">
                <div className="bg-blue-500 h-1.5 w-1.5 rounded-full"></div>
              </div>
              {t('payment.instructions')}:
            </div>
            <ol className="list-decimal pl-4 space-y-0.5 text-blue-600/70">
              <li>{t('payment.copyCode')}</li>
              <li>{t('payment.openDialer')}</li>
              <li>{t('payment.pasteAndCall')}</li>
              <li>{t('payment.followPrompts')}</li>
            </ol>
          </div>
        </TabsContent>

        {/* MTN Content */}
        <TabsContent value="mtn" className="p-3">
          <div className="bg-gradient-to-r from-yellow-50/40 to-yellow-50/20 p-2 rounded-lg border border-yellow-100/50 mb-3 shadow-sm">
            <div className="text-xs text-yellow-700 mb-1 font-medium flex items-center">
              <div className="bg-yellow-100 p-1 rounded-full mr-1">
                <div className="bg-yellow-500 h-1.5 w-1.5 rounded-full"></div>
              </div>
              {t('payment.ussdCode')}
            </div>
            <div className="flex items-center">
              <code className="font-mono text-xs bg-white p-1.5 rounded border border-yellow-100 flex-1 text-center shadow-inner">
                {mtnCode}
              </code>
              <Button 
                variant={copied === 'mtn' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => copyToClipboard(mtnCode, 'mtn')}
                className="ml-1 h-7 w-7 p-0 transition-all duration-200"
              >
                {copied === 'mtn' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          
          <div className="text-xs mb-3 bg-blue-50/20 p-2 rounded-lg border border-blue-100/30">
            <div className="font-medium mb-1 text-blue-600/80 flex items-center">
              <div className="bg-blue-100 p-1 rounded-full mr-1">
                <div className="bg-blue-500 h-1.5 w-1.5 rounded-full"></div>
              </div>
              {t('payment.instructions')}:
            </div>
            <ol className="list-decimal pl-4 space-y-0.5 text-blue-600/70">
              <li>{t('payment.copyCode')}</li>
              <li>{t('payment.openDialer')}</li>
              <li>{t('payment.pasteAndCall')}</li>
              <li>{t('payment.followPrompts')}</li>
            </ol>
          </div>
        </TabsContent>
      </Tabs>

      {/* Champ de confirmation de transaction */}
      <div className="p-3 border-t border-primary/10 bg-gradient-to-b from-muted/20 to-transparent">
        <div className="text-xs font-medium mb-1 flex items-center text-primary/90">
          <div className="bg-primary/10 p-1 rounded-full mr-1">
            <div className="bg-primary h-1.5 w-1.5 rounded-full"></div>
          </div>
          {t('payment.transactionIdLabel')}
        </div>
        <div className="mb-3">
          <Input 
            id="transaction-id"
            value={transactionId}
            onChange={(e) => {
              setTransactionId(e.target.value);
              if (transactionError) setTransactionError('');
            }}
            placeholder={activeTab === 'orange' ? t('payment.orangeIdFormat') : t('payment.mtnIdFormat')}
            className={`text-xs h-8 ${transactionError ? 'border-red-500 ring-1 ring-red-200' : 'focus:ring-1 focus:ring-primary/30'} transition-all duration-200 bg-white/90 shadow-inner`}
          />
          {transactionError && (
            <div className="flex items-center text-red-500 text-xs mt-1 bg-red-50/50 p-1 rounded">
              <AlertCircle className="h-3 w-3 mr-1" />
              {transactionError}
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={onCancel || (() => {})} 
            className="text-xs h-8 flex-1 border-primary/20 hover:bg-primary/5 transition-all duration-200"
          >
            {t('payment.cancel')}
          </Button>
          <Button 
            size="sm"
            onClick={handleConfirmPayment}
            disabled={isVerifying || isConfirmed}
            className={`text-xs h-8 flex-1 bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 shadow-sm hover:shadow transition-all duration-200 ${isVerifying || isConfirmed ? 'opacity-80' : ''}`}
          >
            {isVerifying ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-3 w-3 border-2 border-white/50 border-t-white rounded-full mr-2"></div>
                {t('payment.verifying')}
              </div>
            ) : isConfirmed ? (
              <div className="flex items-center justify-center">
                <svg className="h-3 w-3 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('payment.paymentConfirmed')}
              </div>
            ) : (
              t('payment.confirmPayment')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
