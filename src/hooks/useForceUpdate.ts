import { useEffect, useState } from 'react';

interface UpdateInfo {
  hasUpdate: boolean;
  newVersion: string;
  currentVersion: string;
}

export const useForceUpdate = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    hasUpdate: false,
    newVersion: '',
    currentVersion: ''
  });

  useEffect(() => {
    // Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker enregistré:', registration);

          // Écouter les mises à jour du service worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              console.log('🔄 Nouveau Service Worker détecté');
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Un nouveau service worker est installé et prêt
                  console.log('🆕 Nouvelle version disponible');
                  setUpdateInfo({
                    hasUpdate: true,
                    newVersion: Date.now().toString(), // Version basée sur le timestamp
                    currentVersion: localStorage.getItem('appVersion') || '1.0.0'
                  });
                }
              });
            }
          });

          // Vérifier s'il y a déjà une mise à jour en attente
          if (registration.waiting) {
            console.log('⏳ Service Worker en attente de redémarrage');
            setUpdateInfo({
              hasUpdate: true,
              newVersion: Date.now().toString(),
              currentVersion: localStorage.getItem('appVersion') || '1.0.0'
            });
          }
        })
        .catch((error) => {
          console.error('❌ Erreur enregistrement Service Worker:', error);
        });

      // Écouter les messages du service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          console.log('📨 Mise à jour disponible via message');
          setUpdateInfo({
            hasUpdate: true,
            newVersion: event.data.version,
            currentVersion: localStorage.getItem('appVersion') || '1.0.0'
          });
        }
      });
    }

    // Sauvegarder la version actuelle
    const currentVersion = localStorage.getItem('appVersion');
    if (!currentVersion) {
      localStorage.setItem('appVersion', '1.0.0');
    }
  }, []);

  const forceReload = () => {
    console.log('🔄 Rechargement forcé de l\'application');
    
    // Sauvegarder la nouvelle version
    if (updateInfo.newVersion) {
      localStorage.setItem('appVersion', updateInfo.newVersion);
    }
    
    // Forcer le rechargement avec cache busting
    const timestamp = Date.now();
    const url = new URL(window.location.href);
    url.searchParams.set('v', timestamp.toString());
    
    // Rediriger vers la nouvelle URL
    window.location.href = url.toString();
    
    // Alternative plus radicale si nécessaire
    // window.location.reload(true);
  };

  const dismissUpdate = () => {
    setUpdateInfo({
      ...updateInfo,
      hasUpdate: false
    });
  };

  return {
    updateInfo,
    forceReload,
    dismissUpdate
  };
};
