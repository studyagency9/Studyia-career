# 🔄 Guide de Cache Busting - Mises à Jour Automatiques

## 🎯 Problème Résolu

Quand vous déployez une nouvelle version de votre application, les utilisateurs qui ont déjà ouvert le site ne voient pas les mises à jour car leur navigateur utilise des versions cachedées.

## ✅ Solutions Implémentées

### 1. **Cache Busting Automatique (Vite)**
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      entryFileNames: `assets/[name].[hash].js`,
      chunkFileNames: `assets/[name].[hash].js`,
      assetFileNames: `assets/[name].[hash].[ext]`,
    }
  }
}
```
**Résultat**: Chaque build génère des noms de fichiers uniques avec hash

### 2. **Service Worker Intelligent**
```javascript
// public/sw.js
const CACHE_NAME = 'studyia-career-v2'; // Version incrémentée
```
**Fonctionnalités**:
- Network First pour les pages HTML
- Cache First pour les assets (1h max)
- Nettoyage automatique des anciens caches
- Activation immédiate des nouvelles versions

### 3. **Système de Notification de Mise à Jour**
- Composant `UpdateNotification` qui alerte les utilisateurs
- Hook `useForceUpdate` pour détecter les nouvelles versions
- Bouton "Mettre à jour" pour recharger la page

### 4. **Meta Tags Anti-Cache**
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

### 5. **Version Tracking**
- Fichier `version.json` généré automatiquement
- Timestamp et hash de commit Git
- Comparaison automatique des versions

## 🚀 Comment Déployer

### Méthode 1: Déploiement Simple
```bash
npm run build
# Déployer le dossier dist/
```

### Méthode 2: Déploiement avec Cache Busting Avancé
```bash
npm run deploy
# Équivaut à: npm run build:deploy
```

**Ce que fait le script `deploy`**:
1. Génère un timestamp unique
2. Met à jour `version.json`
3. Build avec hash dans les noms de fichiers
4. Ajoute les meta tags anti-cache
5. Crée `assets-version.json`

## 📱 Comportement Utilisateur

### **Avant (Problème)**
- ❌ Utilisateur ouvre le site
- ❌ Vous déployez une nouvelle version
- ❌ L'utilisateur ne voit pas les changements
- ❌ Doit faire F5 + Ctrl/Cmd pour voir la mise à jour

### **Maintenant (Solution)**
- ✅ Utilisateur ouvre le site
- ✅ Vous déployez une nouvelle version
- ✅ Le service worker détecte la mise à jour
- ✅ Une notification s'affiche: "Mise à jour disponible"
- ✅ L'utilisateur clique sur "Mettre à jour"
- ✅ La page se recharge avec la nouvelle version

## 🔧 Configuration

### **Pour forcer une mise à jour manuelle**
1. Incrémentez la version dans `package.json`
2. Ou utilisez `npm run deploy` (timestamp automatique)

### **Pour vérifier la version actuelle**
```javascript
// Dans la console du navigateur
localStorage.getItem('appVersion')
localStorage.getItem('buildTime')
```

### **Pour désactiver temporairement le cache**
```javascript
// Ajouter à l'URL
?cache=bust&v=123456789
```

## 📋 Checklist de Déploiement

- [ ] `npm run deploy` (ou `npm run build`)
- [ ] Déployer le dossier `dist/`
- [ ] Vérifier que `version.json` est accessible
- [ ] Tester la notification de mise à jour
- [ ] Vérifier les nouveaux noms de fichiers avec hash

## 🛠️ Fichiers Modifiés

1. **vite.config.ts** - Configuration du cache busting
2. **public/sw.js** - Service worker intelligent
3. **src/hooks/useForceUpdate.ts** - Hook de détection de mise à jour
4. **src/components/UpdateNotification.tsx** - Notification utilisateur
5. **src/utils/updateChecker.ts** - Utilitaires de vérification
6. **index.html** - Meta tags anti-cache
7. **scripts/deploy-with-cache-busting.js** - Script de déploiement
8. **package.json** - Scripts de déploiement

## 🎯 Résultats

### **Build Output (Exemple)**
```
✅ Fichiers avec hash:
- assets/index.D15JuSZU.js (19.64 kB)
- assets/ApplyPage.CwbamuHM.js (73.88 kB)
- assets/react-vendor.B8GxMeI8.js (155.06 kB)

✅ Version tracking:
{
  "version": "0.0.0",
  "buildTime": "2026-02-10T11:21:34.869Z",
  "environment": "production"
}
```

### **Expérience Utilisateur**
- 🔄 Détection automatique des mises à jour
- 📢 Notification claire et non intrusive
- ⚡ Rechargement rapide avec cache busting
- 🎯 Plus besoin de F5 manuel

## 🚨 Dépannage

### **Si la mise à jour ne s'affiche pas**
1. Vérifier la console pour les erreurs du service worker
2. Vider manuellement le cache: `Application > Storage > Clear Storage`
3. Forcer le rechargement: `location.reload(true)`

### **Si le build échoue**
1. Vérifier que le dossier `public/` est accessible en écriture
2. Supprimer `node_modules` et réinstaller: `npm install`
3. Vérifier les permissions du script de déploiement

---

## 🎉 Conclusion

Votre application dispose maintenant d'un système complet de cache busting qui garantit que tous les utilisateurs verront automatiquement les dernières mises à jour, sans intervention manuelle complexe.

**Les utilisateurs verront une notification de mise à jour et pourront l'accepter en un clic!** 🚀
