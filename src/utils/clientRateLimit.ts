// Rate limiting côté client avec localStorage
const LIMIT_PER_DAY = 2;
const STORAGE_KEY = 'cv_update_limit';

interface RateLimitData {
  count: number;
  lastReset: Date;
}

export class ClientRateLimiter {
  /**
   * Récupère les données de limitation depuis localStorage
   */
  private static getData(): RateLimitData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return {
          count: 0,
          lastReset: new Date()
        };
      }
      
      const data = JSON.parse(stored);
      return {
        count: data.count || 0,
        lastReset: new Date(data.lastReset)
      };
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error);
      return {
        count: 0,
        lastReset: new Date()
      };
    }
  }

  /**
   * Sauvegarde les données dans localStorage
   */
  private static saveData(data: RateLimitData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans localStorage:', error);
    }
  }

  /**
   * Vérifie si 24h se sont écoulées depuis la dernière réinitialisation
   */
  private static shouldReset(data: RateLimitData): boolean {
    const now = new Date();
    const hoursSinceReset = (now.getTime() - data.lastReset.getTime()) / (1000 * 60 * 60);
    return hoursSinceReset >= 24;
  }

  /**
   * Vérifie si l'utilisateur peut faire une mise à jour
   */
  static canUpdateCV(): { canUpdate: boolean; remaining: number; resetTime: Date } {
    const data = this.getData();
    const now = new Date();

    // Réinitialiser si 24h se sont écoulées
    if (this.shouldReset(data)) {
      data.count = 0;
      data.lastReset = now;
      this.saveData(data);
    }

    const remaining = LIMIT_PER_DAY - data.count;
    const resetTime = new Date(data.lastReset.getTime() + 24 * 60 * 60 * 1000);

    return {
      canUpdate: remaining > 0,
      remaining: Math.max(0, remaining),
      resetTime
    };
  }

  /**
   * Incrémente le compteur de l'utilisateur
   */
  static incrementUsage(): void {
    const data = this.getData();
    
    // Réinitialiser si 24h se sont écoulées
    if (this.shouldReset(data)) {
      data.count = 0;
      data.lastReset = new Date();
    }
    
    data.count++;
    this.saveData(data);
  }

  /**
   * Récupère le statut actuel
   */
  static getStatus(): { count: number; remaining: number; resetTime: Date | null } {
    const data = this.getData();
    const now = new Date();

    // Réinitialiser si 24h se sont écoulées
    if (this.shouldReset(data)) {
      return {
        count: 0,
        remaining: LIMIT_PER_DAY,
        resetTime: null
      };
    }

    const resetTime = new Date(data.lastReset.getTime() + 24 * 60 * 60 * 1000);
    return {
      count: data.count,
      remaining: Math.max(0, LIMIT_PER_DAY - data.count),
      resetTime
    };
  }

  /**
   * Réinitialise manuellement le quota (pour les tests)
   */
  static reset(): void {
    const data: RateLimitData = {
      count: 0,
      lastReset: new Date()
    };
    this.saveData(data);
  }

  /**
   * Formate le temps restant avant réinitialisation
   */
  static formatTimeRemaining(resetTime: Date): string {
    const now = new Date();
    const diff = resetTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Disponible maintenant';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `Réinitialisation dans ${hours}h ${minutes}min`;
    } else {
      return `Réinitialisation dans ${minutes} minutes`;
    }
  }
}
