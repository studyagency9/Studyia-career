// Utilitaire pour vérifier les mises à jour et forcer le rechargement

export interface UpdateInfo {
  version: string;
  buildTime: string;
  hasUpdate: boolean;
}

// Fonction pour vérifier si une mise à jour est disponible
export const checkForUpdates = async (): Promise<UpdateInfo> => {
  try {
    // Récupérer la version actuelle depuis le localStorage
    const currentVersion = localStorage.getItem('appVersion') || '1.0.0';
    const currentBuildTime = localStorage.getItem('buildTime') || '';
    
    // Récupérer les informations de la version actuelle depuis le serveur
    const response = await fetch('/version.json', {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error('Impossible de vérifier la version');
    }
    
    const serverVersion = await response.json();
    
    const hasUpdate = serverVersion.version !== currentVersion || 
                     serverVersion.buildTime !== currentBuildTime;
    
    console.log('🔍 Vérification de mise à jour:', {
      current: { version: currentVersion, buildTime: currentBuildTime },
      server: serverVersion,
      hasUpdate
    });
    
    return {
      version: serverVersion.version,
      buildTime: serverVersion.buildTime,
      hasUpdate
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des mises à jour:', error);
    
    // En cas d'erreur, retourner les infos actuelles
    return {
      version: localStorage.getItem('appVersion') || '1.0.0',
      buildTime: localStorage.getItem('buildTime') || '',
      hasUpdate: false
    };
  }
};

// Fonction pour forcer le rechargement avec cache busting
export const forceReloadWithCacheBusting = () => {
  console.log('🔄 Rechargement forcé avec cache busting');
  
  // Ajouter un timestamp pour casser le cache
  const timestamp = Date.now();
  const url = new URL(window.location.href);
  
  // Ajouter des paramètres pour forcer le rechargement
  url.searchParams.set('v', timestamp.toString());
  url.searchParams.set('cache', 'bust');
  
  // Nettoyer le cache localStorage
  const keysToRemove = ['appVersion', 'buildTime'];
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // Rediriger vers la nouvelle URL
  window.location.href = url.toString();
};

// Fonction pour sauvegarder la version actuelle
export const saveCurrentVersion = (version: string, buildTime: string) => {
  localStorage.setItem('appVersion', version);
  localStorage.setItem('buildTime', buildTime);
  console.log('💾 Version sauvegardée:', { version, buildTime });
};

// Hook pour vérifier périodiquement les mises à jour
export const setupPeriodicUpdateCheck = (callback: (updateInfo: UpdateInfo) => void, intervalMinutes: number = 5) => {
  const intervalMs = intervalMinutes * 60 * 1000;
  
  console.log(`⏰ Vérification automatique des mises à jour toutes les ${intervalMinutes} minutes`);
  
  // Vérification immédiate
  checkForUpdates().then(callback);
  
  // Vérification périodique
  const intervalId = setInterval(() => {
    checkForUpdates().then(callback);
  }, intervalMs);
  
  // Nettoyer l'intervalle quand la page se ferme
  const cleanup = () => {
    clearInterval(intervalId);
    console.log('🧹 Nettoyage de la vérification périodique des mises à jour');
  };
  
  window.addEventListener('beforeunload', cleanup);
  
  return cleanup;
};

// Fonction pour détecter si l'utilisateur est sur mobile (plus susceptible d'avoir des problèmes de cache)
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Fonction pour afficher une notification de mise à jour (alternative au composant React)
export const showUpdateNotification = (updateInfo: UpdateInfo, onAccept: () => void, onDismiss: () => void) => {
  if (!updateInfo.hasUpdate) return;
  
  // Créer une notification HTML simple
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 right-4 z-50 max-w-sm p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-lg';
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium text-blue-900">Mise à jour disponible</p>
        <p class="text-xs text-blue-700">Une nouvelle version est disponible</p>
      </div>
      <div class="flex gap-2">
        <button id="update-accept" class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
          Mettre à jour
        </button>
        <button id="update-dismiss" class="px-3 py-1 text-xs border border-blue-200 text-blue-700 rounded hover:bg-blue-50">
          Plus tard
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Ajouter les écouteurs d'événements
  const acceptBtn = notification.querySelector('#update-accept');
  const dismissBtn = notification.querySelector('#update-dismiss');
  
  acceptBtn?.addEventListener('click', () => {
    onAccept();
    document.body.removeChild(notification);
  });
  
  dismissBtn?.addEventListener('click', () => {
    onDismiss();
    document.body.removeChild(notification);
  });
  
  // Auto-suppression après 30 secondes
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 30000);
};
