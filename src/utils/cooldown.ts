/**
 * Utilitaires pour gérer les délais d'attente (cooldown) pour les tentatives de connexion
 */

/**
 * Définit un délai d'attente pour une action spécifique
 * @param key Identifiant de l'action (ex: 'login', 'signup', etc.)
 * @param durationMs Durée du délai en millisecondes
 */
export const setCooldown = (key: string, durationMs: number): void => {
  const expiryTime = Date.now() + durationMs;
  localStorage.setItem(`${key}_cooldown`, expiryTime.toString());
};

/**
 * Vérifie si un délai d'attente est actif pour une action spécifique
 * @param key Identifiant de l'action
 * @returns Objet contenant l'état du délai et le temps restant en secondes
 */
export const checkCooldown = (key: string): { active: boolean; remainingSeconds: number } => {
  const cooldownUntil = localStorage.getItem(`${key}_cooldown`);
  
  if (!cooldownUntil) {
    return { active: false, remainingSeconds: 0 };
  }
  
  const timeLeft = parseInt(cooldownUntil) - Date.now();
  
  if (timeLeft <= 0) {
    // Le délai est expiré, on le supprime
    localStorage.removeItem(`${key}_cooldown`);
    return { active: false, remainingSeconds: 0 };
  }
  
  // Le délai est toujours actif
  return { 
    active: true, 
    remainingSeconds: Math.ceil(timeLeft / 1000)
  };
};

/**
 * Supprime un délai d'attente pour une action spécifique
 * @param key Identifiant de l'action
 */
export const clearCooldown = (key: string): void => {
  localStorage.removeItem(`${key}_cooldown`);
};
