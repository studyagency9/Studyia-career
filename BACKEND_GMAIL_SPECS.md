# 📋 SPÉCIFICATIONS BACKEND - INTÉGRATION GMAIL API

## 🎯 OBJECTIF
Permettre aux recruteurs de connecter leur compte Gmail et d'importer automatiquement les CV reçus par email vers leurs job posts.

## ⚠️ IMPORTANT - ARCHITECTURE MULTI-TENANT (SaaS)
**Chaque Partner (recruteur) connecte SA PROPRE boîte Gmail personnelle.**

- Partner A connecte → son Gmail personnel (ex: recruteur.a@entreprise.com)
- Partner B connecte → son Gmail personnel (ex: recruteur.b@startup.com)
- Partner C connecte → son Gmail personnel (ex: rh@company.com)

**Les tokens Gmail sont ISOLÉS par partnerId** :
- Un Partner ne peut voir QUE ses propres emails
- Un Partner ne peut importer QUE depuis son propre Gmail
- Les tokens sont stockés avec `partnerId` comme clé unique

---

## 🔧 CONFIGURATION PRÉALABLE

### 1. Google Cloud Console
1. Créer un projet "Studyia Career Pro"
2. Activer **Gmail API**
3. Créer des identifiants OAuth 2.0 (Application Web)
4. Ajouter les URI de redirection :
   - Dev: `http://localhost:5000/api/gmail/callback`
   - Prod: `https://votre-domaine.com/api/gmail/callback`
5. Récupérer Client ID et Client Secret

### 2. Variables d'environnement (.env)
```env
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=http://localhost:5000/api/gmail/callback
FRONTEND_URL=http://localhost:5173
```

### 3. Dépendances NPM
```bash
npm install googleapis google-auth-library
```

---

## 🗄️ MODÈLE DE DONNÉES

### Collection: `gmailTokens`
```javascript
{
  partnerId: ObjectId,        // Référence au Partner
  email: String,              // Email Gmail connecté
  accessToken: String,        // Token d'accès (crypté recommandé)
  refreshToken: String,       // Token de refresh (crypté recommandé)
  expiresAt: Date,           // Date d'expiration du token
  scope: String,             // Scopes autorisés
  createdAt: Date,
  updatedAt: Date
}

// Index: partnerId (unique), expiresAt
```

---

## 🛣️ ROUTES API À CRÉER

### **GET /api/gmail/auth-url**
**Description**: Génère l'URL OAuth2 pour connecter Gmail

**Auth**: Requiert authentification Partner

**Réponse**:
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

**Scopes requis**:
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/userinfo.email`

---

### **GET /api/gmail/callback**
**Description**: Callback OAuth2 après autorisation Google

**Paramètres query**:
- `code`: Code d'autorisation de Google
- `state`: (optionnel) État pour sécurité CSRF

**Logique**:
1. Échanger le code contre access_token et refresh_token
2. Récupérer l'email de l'utilisateur (userinfo API)
3. Sauvegarder les tokens en DB (associés au partnerId)
4. Rediriger vers `${FRONTEND_URL}/pro/gmail/success`

**En cas d'erreur**: Rediriger vers `${FRONTEND_URL}/pro/gmail/error`

---

### **GET /api/gmail/status**
**Description**: Vérifier si le Partner a connecté Gmail

**Auth**: Requiert authentification Partner

**Réponse**:
```json
{
  "connected": true,
  "email": "recruteur@example.com"
}
```

---

### **GET /api/gmail/emails**
**Description**: Lister les emails avec pièces jointes CV

**Auth**: Requiert authentification Partner

**Paramètres query**:
- `maxResults`: Nombre d'emails (défaut: 20)
- `query`: Requête Gmail (défaut: `has:attachment (filename:pdf OR filename:doc OR filename:docx)`)
- `pageToken`: Token de pagination

**Logique**:
1. Vérifier/refresh le token si expiré
2. Appeler Gmail API `users.messages.list`
3. Pour chaque message, récupérer les détails (`users.messages.get`)
4. Extraire: subject, from, date, snippet, attachments
5. Filtrer uniquement les pièces jointes PDF/DOC/DOCX

**Réponse**:
```json
{
  "emails": [
    {
      "id": "18d1a2b3c4d5e6f7",
      "threadId": "18d1a2b3c4d5e6f7",
      "subject": "Candidature Développeur",
      "from": "candidat@example.com",
      "date": "2026-02-27T14:30:00Z",
      "snippet": "Bonjour, veuillez trouver ci-joint mon CV...",
      "attachments": [
        {
          "filename": "CV_Jean_Dupont.pdf",
          "mimeType": "application/pdf",
          "size": 245678,
          "attachmentId": "ANGjdJ..."
        }
      ],
      "hasAttachments": true
    }
  ],
  "nextPageToken": "NEXT_PAGE_TOKEN"
}
```

---

### **GET /api/gmail/attachment/:messageId/:attachmentId**
**Description**: Télécharger une pièce jointe

**Auth**: Requiert authentification Partner

**Paramètres**:
- `messageId`: ID du message Gmail
- `attachmentId`: ID de la pièce jointe

**Logique**:
1. Vérifier/refresh le token
2. Appeler Gmail API `users.messages.attachments.get`
3. Décoder le contenu base64url
4. Retourner le buffer binaire

**Réponse**: Fichier binaire (PDF/DOC/DOCX)

---

### **POST /api/gmail/import-to-job**
**Description**: Importer des CV depuis Gmail vers un job post

**Auth**: Requiert authentification Partner

**Body**:
```json
{
  "jobPostId": "65abc123...",
  "attachments": [
    {
      "messageId": "18d1a2b3c4d5e6f7",
      "attachmentId": "ANGjdJ...",
      "filename": "CV_Jean_Dupont.pdf",
      "senderEmail": "candidat@example.com"
    }
  ]
}
```

**Logique** (pour chaque attachment):
1. Télécharger la pièce jointe depuis Gmail
2. Uploader vers votre système de stockage (S3/Cloudinary/etc.)
3. Créer un Candidate avec:
   - `jobPostId`
   - `originalFileName`: filename
   - `originalFileUrl`: URL du fichier uploadé
   - `fileType`: extension (pdf/doc/docx)
   - `fileSize`: taille du fichier
   - Email extrait de `senderEmail`
4. Lancer l'analyse automatique du CV (votre service existant)
5. Logger les succès/échecs

**Réponse**:
```json
{
  "success": true,
  "imported": 3,
  "failed": 0,
  "results": [
    {
      "filename": "CV_Jean_Dupont.pdf",
      "status": "success",
      "candidateId": "65def456..."
    }
  ]
}
```

---

### **DELETE /api/gmail/disconnect**
**Description**: Déconnecter Gmail

**Auth**: Requiert authentification Partner

**Logique**:
1. Supprimer les tokens de la DB
2. (Optionnel) Révoquer le token côté Google

**Réponse**:
```json
{
  "success": true,
  "message": "Gmail déconnecté"
}
```

---

## 🔐 SÉCURITÉ

### Gestion des tokens
- **IMPORTANT**: Crypter les tokens en DB (AES-256 recommandé)
- Refresh automatique si expiration < 5 minutes
- Stocker `refresh_token` de manière sécurisée
- Ne JAMAIS exposer les tokens au frontend

### Validation
- Vérifier que le Partner est authentifié
- Vérifier que le jobPostId appartient au Partner
- Limiter le nombre d'imports simultanés (rate limiting)

### 🔒 ISOLATION MULTI-TENANT (CRITIQUE)
**TOUTES les requêtes doivent filtrer par `partnerId` :**

```javascript
// ✅ CORRECT - Utilise le partnerId du middleware auth
const tokens = await GmailToken.findOne({ partnerId: req.partner._id });

// ❌ INCORRECT - Ne jamais faire ça (faille de sécurité)
const tokens = await GmailToken.findOne({ email: req.body.email });
```

**Vérifications obligatoires** :
1. Chaque route vérifie `req.partner._id` (depuis le middleware auth)
2. Les tokens Gmail sont récupérés avec `partnerId`
3. Les imports vérifient que le `jobPostId` appartient au Partner
4. Un Partner ne peut JAMAIS accéder aux emails d'un autre Partner

---

## 📊 GESTION DES ERREURS

### Codes d'erreur à gérer:
- **401**: Token expiré → Refresh automatique
- **403**: Permissions insuffisantes → Redemander autorisation
- **404**: Email/Attachment non trouvé
- **429**: Rate limit Google → Retry avec backoff
- **500**: Erreur serveur

### Logs recommandés:
```javascript
console.log('[Gmail] Connexion réussie:', email);
console.log('[Gmail] Import:', { jobPostId, count: attachments.length });
console.error('[Gmail] Erreur:', error.message);
```

---

## 🧪 TESTS À FAIRE

1. ✅ Connexion Gmail réussie
2. ✅ Refresh automatique du token
3. ✅ Liste des emails avec filtres
4. ✅ Téléchargement de pièce jointe
5. ✅ Import vers job post
6. ✅ Gestion des erreurs (token expiré, rate limit)
7. ✅ Déconnexion

---

## 📝 CE QUE LE FRONTEND ATTEND

### Format des réponses (IMPORTANT):

**Tous les endpoints doivent retourner du JSON**

**En cas de succès**:
```json
{
  "success": true,
  "data": { ... }
}
```

**En cas d'erreur**:
```json
{
  "success": false,
  "error": "Message d'erreur clair"
}
```

### Headers CORS:
```javascript
res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
res.header('Access-Control-Allow-Credentials', 'true');
```

---

## 🚀 ORDRE D'IMPLÉMENTATION RECOMMANDÉ

1. **Configuration Google Cloud** (30 min)
2. **Modèle GmailToken** (15 min)
3. **Route /auth-url** (30 min)
4. **Route /callback** (1h)
5. **Route /status** (15 min)
6. **Route /emails** (2h) ← Plus complexe
7. **Route /attachment** (30 min)
8. **Route /import-to-job** (2h) ← Plus complexe
9. **Route /disconnect** (15 min)
10. **Tests** (1h)

**Total estimé: ~8 heures de développement**

---

## ❓ QUESTIONS FRÉQUENTES

**Q: Faut-il stocker tous les emails en DB ?**
R: Non, on les récupère en temps réel depuis Gmail API.

**Q: Que faire si le token expire ?**
R: Le refresh automatiquement avec le refresh_token.

**Q: Combien de temps est valide un access_token ?**
R: ~1 heure. Le refresh_token est permanent (sauf révocation).

**Q: Limite de requêtes Gmail API ?**
R: 1 milliard/jour (largement suffisant).

---

## 📞 CONTACT

Si besoin de clarifications sur les specs, demande-moi !

**Pendant ce temps, je vais implémenter le frontend** 🚀
