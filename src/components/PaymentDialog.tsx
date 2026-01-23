import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PaymentOptions } from './PaymentOptions';
import { useTranslation } from '@/i18n/i18nContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreditCard } from 'lucide-react';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: (transactionId?: string) => void;
  onCancel?: () => void;
  isAIGenerated?: boolean;
}

export function PaymentDialog({ 
  open, 
  onOpenChange, 
  onClose,
  onCancel,
  isAIGenerated = false
}: PaymentDialogProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[95vw] max-w-[380px] p-0 rounded-xl border-0 shadow-xl bg-gradient-to-b from-background to-background/98 overflow-hidden"
        onInteractOutside={(e) => {
          // Empêcher la fermeture accidentelle sur mobile
          e.preventDefault();
        }}
      >
        <DialogTitle className="sr-only">{t('payment.title')}</DialogTitle>
        <DialogDescription className="sr-only">
          {isAIGenerated 
            ? t('payment.descriptionAI').replace('{price}', '2100') 
            : t('payment.description').replace('{price}', '1100')}
        </DialogDescription>
        
        <div className="flex items-center p-3 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="bg-primary/10 p-1.5 rounded-full mr-2">
            <CreditCard className="h-3.5 w-3.5 text-primary" />
          </div>
          <h2 className="text-sm font-medium text-primary">
            {t('payment.title')}
          </h2>
        </div>
        
        <div className="p-3 text-xs text-muted-foreground bg-muted/10">
          {isAIGenerated 
            ? t('payment.descriptionAI').replace('{price}', '2100') 
            : t('payment.description').replace('{price}', '1100')}
        </div>
        
        <PaymentOptions onClose={onClose} onCancel={onCancel} isAIGenerated={isAIGenerated} />
      </DialogContent>
    </Dialog>
  );
}
