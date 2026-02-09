import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { ClientRateLimiter } from '@/utils/clientRateLimit';

interface RateLimitStatusProps {
  onLimitReached?: () => void;
  showDetails?: boolean;
}

export const RateLimitStatus: React.FC<RateLimitStatusProps> = ({ 
  onLimitReached, 
  showDetails = true 
}) => {
  const [status, setStatus] = useState({
    count: 0,
    remaining: 2,
    resetTime: null as Date | null,
    isLoading: true
  });

  useEffect(() => {
    const updateStatus = () => {
      try {
        const rateLimitStatus = ClientRateLimiter.getStatus();
        
        setStatus({
          count: rateLimitStatus.count,
          remaining: rateLimitStatus.remaining,
          resetTime: rateLimitStatus.resetTime,
          isLoading: false
        });

        if (rateLimitStatus.remaining === 0 && onLimitReached) {
          onLimitReached();
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du statut:', error);
        setStatus(prev => ({ ...prev, isLoading: false }));
      }
    };

    updateStatus();
    
    // Rafraîchir toutes les minutes
    const interval = setInterval(updateStatus, 60000);
    
    return () => clearInterval(interval);
  }, [onLimitReached]);

  if (status.isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span>Chargement...</span>
      </div>
    );
  }

  if (status.remaining === 0 && status.resetTime) {
    return (
      <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-orange-800">Limite atteinte</p>
          <p className="text-orange-600">
            {ClientRateLimiter.formatTimeRemaining(status.resetTime)}
          </p>
        </div>
      </div>
    );
  }

  if (!showDetails) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>
          {status.remaining} mise{status.remaining > 1 ? 's' : ''} à jour disponible{status.remaining > 1 ? 's' : ''}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="w-4 h-4" />
      <span>
        {status.remaining}/2 mises à jour disponibles aujourd'hui
      </span>
      {status.resetTime && (
        <span className="text-xs">
          ({ClientRateLimiter.formatTimeRemaining(status.resetTime)})
        </span>
      )}
    </div>
  );
};

// Hook pour utiliser le rate limiting facilement
export const useRateLimit = () => {
  const [status, setStatus] = useState(() => ClientRateLimiter.getStatus());

  useEffect(() => {
    const updateStatus = () => {
      setStatus(ClientRateLimiter.getStatus());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const canUpdate = status.remaining > 0;
  const incrementUsage = () => {
    if (canUpdate) {
      ClientRateLimiter.incrementUsage();
      setStatus(ClientRateLimiter.getStatus());
    }
  };

  return {
    canUpdate,
    remaining: status.remaining,
    count: status.count,
    resetTime: status.resetTime,
    incrementUsage,
    formatTimeRemaining: ClientRateLimiter.formatTimeRemaining
  };
};
