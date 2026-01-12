# 🔧 Configuration Vercel - Variable d'Environnement

## ⚠️ ERREUR ACTUELLE EN PRODUCTION

```
Error: La clé API OpenRouter n'est pas configurée.
```

Cette erreur apparaît car la variable d'environnement `VITE_OPENROUTER_API_KEY` n'est **PAS configurée sur Vercel**.

---

## ✅ SOLUTION : Ajouter la Variable sur Vercel

### Étape 1 : Accéder aux Settings

1. Va sur **Vercel Dashboard** : https://vercel.com/dashboard
2. Sélectionne ton projet : **Studyia-career**
3. Clique sur **Settings** (dans le menu du haut)
4. Dans le menu latéral, clique sur **Environment Variables**

### Étape 2 : Ajouter la Variable

Clique sur **Add New** et remplis :

| Champ | Valeur |
|-------|--------|
| **Key** | `VITE_OPENROUTER_API_KEY` |
| **Value** | `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` |
| **Environments** | ✅ Production<br>✅ Preview<br>✅ Development |

### Étape 3 : Sauvegarder

Clique sur **Save**

### Étape 4 : Redéployer

**IMPORTANT** : Vercel ne redéploie PAS automatiquement quand tu ajoutes une variable d'environnement.

Tu dois **redéployer manuellement** :

1. Va dans **Deployments** (menu du haut)
2. Trouve le dernier déploiement (celui qui est actuellement en production)
3. Clique sur les **3 points** (⋮) à droite
4. Sélectionne **Redeploy**
5. Confirme en cliquant sur **Redeploy** dans la popup

---

## 🧪 Vérification Après Redéploiement

Une fois le redéploiement terminé (2-3 minutes) :

1. **Va sur** : https://career.studyia.net/upload
2. **Upload un CV PDF**
3. **L'analyse devrait fonctionner** ✅

---

## 📸 Captures d'Écran des Étapes

### 1. Settings → Environment Variables
```
Vercel Dashboard
└── Ton Projet (Studyia-career)
    └── Settings
        └── Environment Variables
            └── [Add New]
```

### 2. Formulaire à Remplir
```
Key:    VITE_OPENROUTER_API_KEY
Value:  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

Environments:
☑ Production
☑ Preview  
☑ Development
```

### 3. Redéployer
```
Deployments → Latest Deployment → ⋮ → Redeploy
```

---

## ⚠️ IMPORTANT : Sécurité

- **NE JAMAIS** commiter cette clé dans le code
- **NE JAMAIS** partager cette clé publiquement
- La clé est maintenant **uniquement** sur Vercel (sécurisé)
- Le fichier `.env` local est dans `.gitignore` (protégé)

---

## 🎯 Résumé

| Étape | Status |
|-------|--------|
| 1. Aller sur Vercel Settings | ⏳ À faire |
| 2. Environment Variables | ⏳ À faire |
| 3. Ajouter `VITE_OPENROUTER_API_KEY` | ⏳ À faire |
| 4. Sauvegarder | ⏳ À faire |
| 5. Redéployer | ⏳ À faire |
| 6. Tester l'upload en production | ⏳ À faire |

---

**Une fois ces étapes complétées, l'upload de CV fonctionnera en production !** 🚀

*Document créé le 12 janvier 2026*
