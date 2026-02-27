# 🧪 GUIDE DE TEST - INTÉGRATION GMAIL API

## ✅ PRÉREQUIS

Avant de tester, vérifier que :
- ✅ Backend démarré sur `http://localhost:5000`
- ✅ Frontend démarré sur `http://localhost:5173`
- ✅ Google Cloud OAuth2 configuré
- ✅ Variables d'environnement définies :
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_REDIRECT_URI=http://localhost:5000/api/gmail/callback`
  - `FRONTEND_URL=http://localhost:5173`

---

## 🎯 SCÉNARIO DE TEST COMPLET

### **ÉTAPE 1 : Connexion Gmail**

1. Se connecter à Studyia Career Pro (Partner)
2. Aller sur le Dashboard (`/pro/dashboard`)
3. Cliquer sur le bouton **"Importer depuis Gmail"**
4. Vérifier la redirection vers `/pro/gmail`
5. Vérifier l'affichage de la page avec le message "Connectez votre compte Gmail"
6. Cliquer sur **"Connecter Gmail"**

**Résultat attendu** :
- ✅ Popup Google OAuth2 s'ouvre
- ✅ URL contient `accounts.google.com/o/oauth2/v2/auth`
- ✅ Scopes visibles : Gmail (lecture seule)

---

### **ÉTAPE 2 : Autorisation Google**

1. Dans la popup, sélectionner un compte Gmail
2. Autoriser l'accès à Gmail (lecture seule)
3. Attendre la redirection automatique

**Résultat attendu** :
- ✅ Redirection vers `http://localhost:5000/api/gmail/callback?code=...`
- ✅ Backend sauvegarde les tokens en DB
- ✅ Redirection finale vers `http://localhost:5173/pro/gmail/success`
- ✅ Popup se ferme automatiquement
- ✅ Badge vert avec l'email Gmail s'affiche
- ✅ Bouton "Déconnecter" visible

---

### **ÉTAPE 3 : Vérification du statut**

**Test API** :
```bash
curl -X GET http://localhost:5000/api/gmail/status \
  -H "Authorization: Bearer {PARTNER_TOKEN}"
```

**Résultat attendu** :
```json
{
  "success": true,
  "data": {
    "connected": true,
    "email": "votre-email@gmail.com"
  }
}
```

---

### **ÉTAPE 4 : Liste des emails**

1. Attendre le chargement automatique des emails
2. Vérifier l'affichage de la liste

**Résultat attendu** :
- ✅ Liste des emails avec pièces jointes CV (PDF/DOC/DOCX)
- ✅ Pour chaque email :
  - Sujet
  - Expéditeur
  - Date formatée
  - Snippet (aperçu)
  - Badges des pièces jointes avec nom et taille
- ✅ Checkbox pour sélection multiple
- ✅ Compteur "X / Y sélectionné(s)"

**Test API** :
```bash
curl -X GET "http://localhost:5000/api/gmail/emails?maxResults=10" \
  -H "Authorization: Bearer {PARTNER_TOKEN}"
```

**Résultat attendu** :
```json
{
  "success": true,
  "data": {
    "emails": [
      {
        "id": "...",
        "subject": "Candidature...",
        "from": "candidat@example.com",
        "attachments": [
          {
            "filename": "CV.pdf",
            "mimeType": "application/pdf",
            "size": 245678,
            "attachmentId": "..."
          }
        ]
      }
    ]
  }
}
```

---

### **ÉTAPE 5 : Recherche et filtres**

1. Dans le champ "Rechercher dans les emails", taper : `Candidature développeur`
2. Cliquer sur "Rechercher"

**Résultat attendu** :
- ✅ Liste filtrée avec uniquement les emails contenant "Candidature développeur"
- ✅ Loader pendant le chargement
- ✅ Message si aucun résultat

---

### **ÉTAPE 6 : Sélection d'emails**

1. Cocher 2-3 emails avec des CV
2. Vérifier le compteur de sélection
3. Cliquer sur "Tout sélectionner"
4. Vérifier que tous les emails sont cochés
5. Re-cliquer pour tout désélectionner

**Résultat attendu** :
- ✅ Compteur mis à jour en temps réel
- ✅ Emails sélectionnés ont un fond violet clair
- ✅ Bouton "Importer" affiche le nombre sélectionné

---

### **ÉTAPE 7 : Choix du job post**

1. Dans le dropdown "Importer vers", sélectionner un job post
2. Vérifier que le job post est bien sélectionné

**Résultat attendu** :
- ✅ Liste des job posts actifs visible
- ✅ Sélection enregistrée

---

### **ÉTAPE 8 : Import des CV**

1. Sélectionner 2 emails avec CV
2. Choisir un job post
3. Cliquer sur **"Importer (2)"**

**Résultat attendu** :
- ✅ Bouton affiche "Import en cours..." avec loader
- ✅ Toast de succès : "2 CV importés avec succès"
- ✅ Redirection vers `/pro/jobs/{jobPostId}`
- ✅ Les nouveaux candidats apparaissent dans la liste

**Test API** :
```bash
curl -X POST http://localhost:5000/api/gmail/import-to-job \
  -H "Authorization: Bearer {PARTNER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "jobPostId": "65abc123...",
    "attachments": [
      {
        "messageId": "18d1a2b3...",
        "attachmentId": "ANGjdJ...",
        "filename": "CV_Jean_Dupont.pdf",
        "senderEmail": "jean.dupont@example.com"
      }
    ]
  }'
```

**Résultat attendu** :
```json
{
  "success": true,
  "data": {
    "imported": 1,
    "failed": 0,
    "results": [
      {
        "filename": "CV_Jean_Dupont.pdf",
        "status": "success",
        "candidateId": "65def456..."
      }
    ]
  }
}
```

---

### **ÉTAPE 9 : Vérification des candidats importés**

1. Aller sur la page du job post
2. Vérifier la liste des candidats

**Résultat attendu** :
- ✅ Nouveaux candidats visibles
- ✅ Email du candidat extrait correctement
- ✅ CV téléchargeable
- ✅ Analyse automatique lancée (si configurée)

---

### **ÉTAPE 10 : Déconnexion Gmail**

1. Retourner sur `/pro/gmail`
2. Cliquer sur **"Déconnecter"**

**Résultat attendu** :
- ✅ Toast : "Gmail déconnecté"
- ✅ Badge vert disparaît
- ✅ Bouton "Connecter Gmail" réapparaît
- ✅ Liste des emails disparaît

**Test API** :
```bash
curl -X DELETE http://localhost:5000/api/gmail/disconnect \
  -H "Authorization: Bearer {PARTNER_TOKEN}"
```

**Résultat attendu** :
```json
{
  "success": true,
  "message": "Gmail déconnecté"
}
```

---

## 🧪 TESTS SUPPLÉMENTAIRES

### **Test 1 : Multi-tenant (SaaS)**

1. Se connecter avec Partner A
2. Connecter Gmail de Partner A
3. Se déconnecter
4. Se connecter avec Partner B
5. Connecter Gmail de Partner B
6. Vérifier que Partner B voit UNIQUEMENT ses emails

**Résultat attendu** :
- ✅ Partner A et Partner B ont des comptes Gmail différents
- ✅ Aucun croisement de données
- ✅ Isolation totale

---

### **Test 2 : Gestion des erreurs**

**Cas 1 : Gmail non connecté**
```bash
curl -X GET http://localhost:5000/api/gmail/emails \
  -H "Authorization: Bearer {PARTNER_TOKEN}"
```
**Résultat attendu** :
```json
{
  "success": false,
  "error": "Gmail not connected. Please connect your Gmail account first."
}
```

**Cas 2 : Job post invalide**
```bash
curl -X POST http://localhost:5000/api/gmail/import-to-job \
  -H "Authorization: Bearer {PARTNER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"jobPostId": "invalid", "attachments": []}'
```
**Résultat attendu** :
```json
{
  "success": false,
  "error": "Job post not found"
}
```

**Cas 3 : Token expiré**
- Attendre 1 heure (expiration du token)
- Essayer de lister les emails
- Vérifier le refresh automatique

**Résultat attendu** :
- ✅ Backend refresh automatiquement le token
- ✅ Requête réussit sans erreur

---

### **Test 3 : Pagination**

1. Charger 20 emails
2. Vérifier si `nextPageToken` est présent
3. Charger la page suivante

**Résultat attendu** :
- ✅ Pagination fonctionne
- ✅ Pas de doublons

---

### **Test 4 : Filtres de pièces jointes**

1. Envoyer un email avec :
   - 1 PDF (CV)
   - 1 image JPG
   - 1 fichier TXT
2. Vérifier la liste des emails

**Résultat attendu** :
- ✅ Seul le PDF apparaît dans les attachments
- ✅ JPG et TXT sont filtrés automatiquement

---

## 📊 CHECKLIST FINALE

Avant de déployer en production :

- [ ] ✅ Connexion Gmail fonctionne
- [ ] ✅ Liste des emails affichée correctement
- [ ] ✅ Sélection multiple fonctionne
- [ ] ✅ Import vers job post réussit
- [ ] ✅ Candidats créés avec bon email
- [ ] ✅ Déconnexion fonctionne
- [ ] ✅ Multi-tenant testé (2+ Partners)
- [ ] ✅ Gestion d'erreurs testée
- [ ] ✅ Refresh automatique des tokens
- [ ] ✅ Filtrage des pièces jointes (PDF/DOC/DOCX uniquement)
- [ ] ✅ Logs backend vérifiés
- [ ] ✅ Tokens cryptés en DB
- [ ] ✅ CORS configuré correctement
- [ ] ✅ Variables d'env en production
- [ ] ✅ URI de redirection OAuth2 en production

---

## 🐛 DEBUGGING

### **Problème : Popup OAuth2 ne s'ouvre pas**
- Vérifier que `GOOGLE_CLIENT_ID` est défini
- Vérifier la console navigateur pour les erreurs
- Vérifier que le popup n'est pas bloqué par le navigateur

### **Problème : Redirection échoue après autorisation**
- Vérifier `GOOGLE_REDIRECT_URI` dans .env
- Vérifier que l'URI est autorisée dans Google Cloud Console
- Vérifier les logs backend

### **Problème : Aucun email affiché**
- Vérifier que le compte Gmail a des emails avec CV
- Vérifier la requête Gmail API dans les logs backend
- Tester avec une requête plus large : `has:attachment`

### **Problème : Import échoue**
- Vérifier les logs backend
- Vérifier que le jobPostId existe
- Vérifier que le Partner a accès au job post
- Vérifier l'upload vers le stockage (S3/Cloudinary)

---

## 📞 SUPPORT

Si un test échoue :
1. Vérifier les logs backend
2. Vérifier la console navigateur
3. Tester l'API avec curl/Postman
4. Vérifier la configuration Google Cloud
5. Vérifier les variables d'environnement

**Tout devrait fonctionner si le backend suit exactement les specs !** 🚀
