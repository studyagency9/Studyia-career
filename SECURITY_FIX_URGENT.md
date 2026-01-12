# 🚨 ALERTE SÉCURITÉ - Clé API Exposée

## ⚠️ Problème Identifié

Ta clé API OpenRouter a été **exposée publiquement** sur GitHub :
- **Localisation** : https://github.com/studyagency9/Studyia-career/blob/a4516cc38daea9e9effd677806152e10c9517d93/.vercel/output/static/assets/UploadPage-DO62lzMk.js
- **Clé exposée** : Se termine par `...4c1a`
- **Statut** : **DÉSACTIVÉE automatiquement** par OpenRouter

**C'est pour ça que tu as l'erreur 401 "User not found" !**

---

## ✅ Actions Immédiates à Faire (URGENT)

### 1. **Générer une Nouvelle Clé API** 🔑

1. Va sur : **https://openrouter.ai/keys**
2. Clique sur **"Create Key"**
3. Copie la nouvelle clé (commence par `sk-or-v1-...`)

### 2. **Mettre à Jour le Fichier .env** 📝

Ouvre le fichier `.env` et remplace l'ancienne clé :

```env
VITE_OPENROUTER_API_KEY=sk-or-v1-NOUVELLE_CLE_ICI
```

**⚠️ NE JAMAIS COMMITER CE FICHIER SUR GITHUB !**

### 3. **Vérifier que .env est dans .gitignore** ✅

J'ai déjà ajouté `.env` dans le `.gitignore`. Vérifie :

```bash
cat .gitignore | grep .env
```

Tu devrais voir :
```
.env
.env.local
.env.production
.env.development
```

### 4. **Supprimer la Clé Exposée de GitHub** 🗑️

**Option A : Supprimer le fichier du dépôt**
```bash
git rm --cached .vercel/output/static/assets/UploadPage-DO62lzMk.js
git commit -m "Remove exposed API key file"
git push
```

**Option B : Nettoyer l'historique Git (Recommandé)**

⚠️ **ATTENTION** : Cela réécrit l'historique Git !

```bash
# Installer BFG Repo-Cleaner
# Télécharge depuis: https://rtyley.github.io/bfg-repo-cleaner/

# Nettoyer les clés API de l'historique
bfg --replace-text passwords.txt

# Ou utiliser git filter-branch (plus complexe)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .vercel/output/static/assets/UploadPage-DO62lzMk.js" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (⚠️ Attention!)
git push origin --force --all
```

### 5. **Configurer les Variables d'Environnement sur Vercel** 🚀

**Ne jamais mettre les clés API dans le code !**

Sur Vercel :
1. Va dans **Settings** → **Environment Variables**
2. Ajoute : `VITE_OPENROUTER_API_KEY` = `ta_nouvelle_cle`
3. Redéploie le site

---

## 🛡️ Bonnes Pratiques de Sécurité

### ✅ À FAIRE

1. **Toujours utiliser .env pour les secrets**
   ```env
   VITE_OPENROUTER_API_KEY=sk-or-v1-...
   ```

2. **Ajouter .env au .gitignore**
   ```gitignore
   .env
   .env.local
   .env.production
   ```

3. **Utiliser les variables d'environnement de la plateforme**
   - Vercel : Environment Variables
   - Netlify : Environment Variables
   - Heroku : Config Vars

4. **Créer un .env.example** (sans valeurs sensibles)
   ```env
   VITE_OPENROUTER_API_KEY=your_api_key_here
   ```

### ❌ À NE JAMAIS FAIRE

1. ❌ Commiter `.env` sur Git
2. ❌ Hardcoder les clés API dans le code
3. ❌ Partager les clés API publiquement
4. ❌ Utiliser la même clé pour dev et prod

---

## 🔍 Vérifier les Autres Secrets Exposés

```bash
# Chercher d'autres clés potentiellement exposées
git log -p | grep -i "api.key\|secret\|password\|token"

# Utiliser un outil automatique
npm install -g gitleaks
gitleaks detect --source . --verbose
```

---

## 📊 Checklist de Sécurité

- [x] `.env` ajouté au `.gitignore`
- [ ] Nouvelle clé API générée sur OpenRouter
- [ ] `.env` mis à jour avec la nouvelle clé
- [ ] Fichier exposé supprimé de GitHub
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Historique Git nettoyé (optionnel mais recommandé)
- [ ] Application testée avec la nouvelle clé
- [ ] Déploiement sécurisé effectué

---

## 🚀 Après la Correction

1. **Redémarre le serveur de dev**
   ```bash
   npm run dev
   ```

2. **Teste l'upload de CV**
   - Va sur http://localhost:8081/upload
   - Upload un PDF
   - Vérifie que l'analyse fonctionne

3. **Redéploie sur Vercel**
   ```bash
   npm run build
   # Puis déployer via Vercel CLI ou interface web
   ```

---

## 📞 Support

Si tu as besoin d'aide :
- OpenRouter Support : support@openrouter.ai
- Documentation : https://openrouter.ai/docs

---

**IMPORTANT** : Ne partage JAMAIS ta nouvelle clé API publiquement !

*Document créé le 12 janvier 2026*
