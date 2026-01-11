# STUDYIA CAREER - SYSTÈME DE COMMERCIAUX ET AFFILIATION

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble du système](#vue-densemble)
2. [Modèles de données](#modèles-de-données)
3. [Système de parrainage](#système-de-parrainage)
4. [Calcul des commissions](#calcul-des-commissions)
5. [Flux utilisateur](#flux-utilisateur)
6. [Endpoints API](#endpoints-api)
7. [Interface commerciaux](#interface-commerciaux)
8. [Paiements et retraits](#paiements-et-retraits)
9. [Statistiques et reporting](#statistiques-et-reporting)
10. [Sécurité et fraude](#sécurité-et-fraude)

---

## 🎯 VUE D'ENSEMBLE

### **Concept**

Permettre à **n'importe qui** de devenir commercial Studyia Career et gagner des commissions en vendant des CV via un système de parrainage.

### **Fonctionnement**

1. **Inscription commercial** : Tout le monde peut s'inscrire comme commercial
2. **Code de parrainage unique** : Chaque commercial reçoit un code unique (ex: `JOHN2024`)
3. **Lien de parrainage** : URL personnalisée (ex: `studyia.net?ref=JOHN2024`)
4. **Tracking** : Tous les CV créés via le lien sont trackés
5. **Commission automatique** : Commission créditée instantanément après chaque vente
6. **Tableau de bord** : Interface pour suivre les ventes et commissions
7. **Retrait** : Système de retrait des gains

### **Avantages**

- ✅ Croissance virale et exponentielle
- ✅ Coût d'acquisition client réduit
- ✅ Motivation des commerciaux (gains illimités)
- ✅ Pas de salaire fixe (uniquement commissions)
- ✅ Scalabilité infinie

---

## 📊 MODÈLES DE DONNÉES

### **1. Commercial (Affilié)**

```typescript
interface Commercial {
  id: string;                           // UUID unique
  email: string;                        // Email de connexion
  password: string;                     // Hash du mot de passe
  firstName: string;                    // Prénom
  lastName: string;                     // Nom
  phone: string;                        // Téléphone
  
  // Informations de parrainage
  referralCode: string;                 // Code unique (ex: "JOHN2024")
  referralLink: string;                 // Lien complet
  
  // Statistiques
  totalSales: number;                   // Nombre total de ventes
  totalCommission: number;              // Commission totale gagnée (FCFA)
  availableBalance: number;             // Solde disponible pour retrait
  withdrawnAmount: number;              // Montant déjà retiré
  
  // Informations bancaires (pour les retraits)
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  mobileMoneyNumber?: string;           // Pour Mobile Money
  mobileMoneyProvider?: 'MTN' | 'Orange' | 'Moov';
  
  // Statut
  status: 'active' | 'suspended' | 'banned';
  isVerified: boolean;                  // Email vérifié
  
  // Dates
  createdAt: string;                    // Date d'inscription (ISO)
  lastLoginAt: string;                  // Dernière connexion
  updatedAt: string;
}
```

### **2. Referral (Parrainage/Vente)**

```typescript
interface Referral {
  id: string;                           // UUID unique
  commercialId: string;                 // ID du commercial
  
  // Informations client
  customerEmail?: string;               // Email du client (optionnel)
  customerName?: string;                // Nom du client
  
  // Informations de la vente
  cvId?: string;                        // ID du CV créé (si sauvegardé)
  cvType: 'public' | 'partner';         // Type de CV
  partnerId?: string;                   // ID du partenaire (si SaaS)
  
  // Tracking
  referralCode: string;                 // Code utilisé
  ipAddress: string;                    // IP du client
  userAgent: string;                    // Navigateur
  landingPage: string;                  // Page d'atterrissage
  
  // Commission
  commissionAmount: number;             // Montant de la commission (FCFA)
  commissionRate: number;               // Taux appliqué (%)
  status: 'pending' | 'validated' | 'cancelled';
  
  // Dates
  createdAt: string;                    // Date de la vente
  validatedAt?: string;                 // Date de validation
  cancelledAt?: string;                 // Date d'annulation
}
```

### **3. Commission (Configuration)**

```typescript
interface CommissionConfig {
  id: string;
  type: 'public_cv' | 'partner_starter' | 'partner_pro' | 'partner_business';
  
  // Taux de commission
  rate: number;                         // Pourcentage (ex: 20 = 20%)
  fixedAmount?: number;                 // Montant fixe (FCFA)
  
  // Conditions
  minAmount?: number;                   // Montant minimum de vente
  maxAmount?: number;                   // Montant maximum de commission
  
  // Validité
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  
  createdAt: string;
  updatedAt: string;
}
```

### **4. Withdrawal (Retrait)**

```typescript
interface Withdrawal {
  id: string;
  commercialId: string;
  
  // Montant
  amount: number;                       // Montant demandé (FCFA)
  fees: number;                         // Frais de retrait
  netAmount: number;                    // Montant net reçu
  
  // Méthode de paiement
  method: 'bank_transfer' | 'mobile_money' | 'cash';
  
  // Détails bancaires
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  mobileMoneyNumber?: string;
  mobileMoneyProvider?: string;
  
  // Statut
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  rejectionReason?: string;
  
  // Traitement
  processedBy?: string;                 // ID de l'admin
  processedAt?: string;
  transactionId?: string;               // ID de transaction externe
  
  // Dates
  createdAt: string;
  completedAt?: string;
}
```

### **5. CommercialStats (Statistiques)**

```typescript
interface CommercialStats {
  commercialId: string;
  period: 'today' | 'week' | 'month' | 'year' | 'all';
  
  // Ventes
  totalSales: number;                   // Nombre de ventes
  publicCVs: number;                    // CV publics
  partnerCVs: number;                   // CV partenaires
  
  // Commissions
  totalCommission: number;              // Commission totale
  averageCommission: number;            // Commission moyenne
  highestCommission: number;            // Commission la plus élevée
  
  // Conversion
  clicks: number;                       // Clics sur le lien
  conversions: number;                  // Conversions
  conversionRate: number;               // Taux de conversion (%)
  
  // Top produits
  topProducts: Array<{
    type: string;
    count: number;
    commission: number;
  }>;
  
  updatedAt: string;
}
```

---

## 🔗 SYSTÈME DE PARRAINAGE

### **1. Génération du code de parrainage**

**Format du code:**
```
{PRENOM}{ANNEE}{RANDOM}
Exemple: JOHN2024A7B
```

**Algorithme:**
```typescript
function generateReferralCode(firstName: string): string {
  const prefix = firstName.substring(0, 4).toUpperCase();
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  
  return `${prefix}${year}${random}`;
}
```

**Unicité garantie:**
- Vérification en base de données
- Régénération si collision
- Index unique sur `referralCode`

### **2. Lien de parrainage**

**Format:**
```
https://studyia.net?ref={CODE}
https://studyia.net/builder?ref={CODE}
https://studyia.net/upload?ref={CODE}
```

**Tracking:**
- Cookie `studyia_ref` (durée: 30 jours)
- localStorage `studyia_referral`
- Session serveur

**Persistance:**
- Le code reste valide pendant 30 jours
- Même si l'utilisateur revient plus tard
- Attribution au premier commercial

### **3. Attribution de la vente**

**Scénarios:**

1. **CV Public (gratuit)**
   - Utilisateur crée un CV via le lien
   - Commission fixe au commercial
   - Validation immédiate

2. **Partenaire SaaS (payant)**
   - Utilisateur s'inscrit comme partenaire via le lien
   - Commission sur le forfait choisi
   - Validation après paiement

3. **Conversion différée**
   - Utilisateur clique sur le lien aujourd'hui
   - S'inscrit comme partenaire dans 15 jours
   - Commission attribuée au commercial (cookie valide)

---

## 💰 CALCUL DES COMMISSIONS

### **1. Grille de commissions**

| Type de vente | Prix | Commission | Montant |
|---------------|------|------------|---------|
| **CV Public** | Gratuit | Fixe | **500 FCFA** |
| **Partner Starter** | 15,000 FCFA | 20% | **3,000 FCFA** |
| **Partner Pro** | 30,000 FCFA | 20% | **6,000 FCFA** |
| **Partner Business** | 60,000 FCFA | 20% | **12,000 FCFA** |

### **2. Calcul automatique**

```typescript
function calculateCommission(saleType: string, saleAmount: number): number {
  const config = {
    public_cv: { type: 'fixed', amount: 500 },
    partner_starter: { type: 'percentage', rate: 20 },
    partner_pro: { type: 'percentage', rate: 20 },
    partner_business: { type: 'percentage', rate: 20 },
  };
  
  const rule = config[saleType];
  
  if (rule.type === 'fixed') {
    return rule.amount;
  } else {
    return (saleAmount * rule.rate) / 100;
  }
}
```

### **3. Validation des commissions**

**Statuts:**

- **Pending** : Vente enregistrée, en attente de validation
- **Validated** : Commission confirmée et créditée
- **Cancelled** : Vente annulée (remboursement, fraude)

**Délais de validation:**

- CV Public : **Immédiat** (validation automatique)
- Partner Starter/Pro/Business : **Après paiement confirmé**

**Annulation:**
- Remboursement client : Commission annulée
- Fraude détectée : Commission annulée + sanction
- Délai d'annulation : 7 jours après paiement

### **4. Cumul et solde**

```typescript
interface CommercialBalance {
  totalEarned: number;        // Total gagné (toutes ventes)
  pendingAmount: number;      // En attente de validation
  availableBalance: number;   // Disponible pour retrait
  withdrawnAmount: number;    // Déjà retiré
  
  // Calcul
  // availableBalance = totalEarned - withdrawnAmount - pendingAmount
}
```

---

## 👤 FLUX UTILISATEUR

### **1. Inscription commercial**

**Étapes:**

1. Accès à `/commercial/signup`
2. Formulaire d'inscription :
   - Prénom, Nom
   - Email, Téléphone
   - Mot de passe
   - Conditions d'utilisation
3. Validation email
4. Génération automatique du code de parrainage
5. Accès au dashboard commercial

**Email de bienvenue:**
```
Sujet: Bienvenue chez Studyia Career - Votre code de parrainage

Bonjour {Prénom},

Félicitations ! Vous êtes maintenant commercial Studyia Career.

Votre code de parrainage : {CODE}
Votre lien de parrainage : {LIEN}

Partagez ce lien et gagnez :
- 500 FCFA par CV public créé
- 3,000 à 12,000 FCFA par partenaire inscrit

Commencez dès maintenant !
```

### **2. Partage du lien**

**Canaux de partage:**

- WhatsApp (bouton direct)
- Facebook (bouton direct)
- Email (copier le lien)
- SMS (copier le lien)
- QR Code (téléchargeable)

**Matériel marketing fourni:**

- Visuels prêts à partager
- Messages types
- Vidéos explicatives
- Guide de vente

### **3. Tracking d'un clic**

**Process:**

1. Utilisateur clique sur `studyia.net?ref=JOHN2024A7B`
2. Backend enregistre :
   - Code de parrainage
   - IP, User-Agent
   - Page d'atterrissage
   - Timestamp
3. Cookie `studyia_ref` créé (30 jours)
4. Redirection vers la page demandée

### **4. Création de CV (conversion)**

**Scénario A : CV Public**

1. Utilisateur crée un CV via le builder
2. Télécharge le PDF
3. Backend détecte le cookie `studyia_ref`
4. Création d'un `Referral` :
   - commercialId récupéré
   - commissionAmount = 500 FCFA
   - status = 'validated'
5. Crédit immédiat du solde commercial
6. Notification au commercial (email + dashboard)

**Scénario B : Partenaire SaaS**

1. Utilisateur s'inscrit comme partenaire
2. Choisit un forfait (ex: Pro - 30,000 FCFA)
3. Effectue le paiement
4. Backend détecte le cookie `studyia_ref`
5. Création d'un `Referral` :
   - commercialId récupéré
   - commissionAmount = 6,000 FCFA (20% de 30,000)
   - status = 'pending'
6. Après confirmation paiement :
   - status = 'validated'
   - Crédit du solde commercial
7. Notification au commercial

### **5. Consultation du dashboard**

**Informations affichées:**

- Solde disponible
- Nombre de ventes (aujourd'hui, ce mois, total)
- Commissions gagnées
- Graphiques de performance
- Liste des dernières ventes
- Lien et code de parrainage
- Boutons de partage

### **6. Demande de retrait**

**Étapes:**

1. Commercial accède à `/commercial/withdraw`
2. Saisit le montant à retirer
3. Choisit la méthode :
   - Virement bancaire
   - Mobile Money (MTN, Orange, Moov)
   - Retrait en espèces (agence)
4. Saisit les informations de paiement
5. Confirmation
6. Demande envoyée à l'admin
7. Traitement sous 24-48h
8. Notification de paiement

**Conditions de retrait:**

- Montant minimum : **5,000 FCFA**
- Frais de retrait :
  - Virement bancaire : 1,000 FCFA
  - Mobile Money : 2% (min 500 FCFA)
  - Espèces : Gratuit
- Délai : 24-48h ouvrées

---

## 🌐 ENDPOINTS API

### **Authentification Commercial**

#### **POST /api/commercial/signup**
Inscription d'un nouveau commercial

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+237 6XX XXX XXX"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "commercial": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "referralCode": "JOHN2024A7B",
      "referralLink": "https://studyia.net?ref=JOHN2024A7B",
      "totalSales": 0,
      "totalCommission": 0,
      "availableBalance": 0
    },
    "accessToken": "jwt_token"
  }
}
```

---

#### **POST /api/commercial/login**
Connexion commercial

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "commercial": { /* Commercial object */ },
    "accessToken": "jwt_token"
  }
}
```

---

### **Tracking et Parrainage**

#### **POST /api/referral/track-click**
Enregistrer un clic sur un lien de parrainage

**Request:**
```json
{
  "referralCode": "JOHN2024A7B",
  "landingPage": "/builder",
  "ipAddress": "41.202.XXX.XXX",
  "userAgent": "Mozilla/5.0..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tracked": true,
    "cookieSet": true,
    "expiresAt": "2024-02-10T00:00:00Z"
  }
}
```

---

#### **POST /api/referral/convert**
Enregistrer une conversion (vente)

**Request:**
```json
{
  "referralCode": "JOHN2024A7B",
  "cvType": "public",
  "customerEmail": "client@example.com",
  "customerName": "Jane Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "referral": {
      "id": "uuid",
      "commercialId": "uuid",
      "commissionAmount": 500,
      "status": "validated",
      "createdAt": "2024-01-11T09:00:00Z"
    },
    "commercial": {
      "newBalance": 500,
      "totalSales": 1
    }
  }
}
```

---

#### **GET /api/referral/validate/:code**
Valider qu'un code de parrainage existe

**Response (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "commercialName": "John Doe"
  }
}
```

---

### **Dashboard Commercial**

#### **GET /api/commercial/dashboard**
Récupérer les statistiques du dashboard

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "balance": {
      "available": 15000,
      "pending": 3000,
      "withdrawn": 10000,
      "total": 28000
    },
    "stats": {
      "today": {
        "sales": 3,
        "commission": 1500
      },
      "thisWeek": {
        "sales": 12,
        "commission": 6000
      },
      "thisMonth": {
        "sales": 45,
        "commission": 22500
      },
      "allTime": {
        "sales": 150,
        "commission": 75000
      }
    },
    "recentSales": [
      {
        "id": "uuid",
        "customerName": "Jane Doe",
        "type": "public_cv",
        "commission": 500,
        "status": "validated",
        "createdAt": "2024-01-11T08:30:00Z"
      }
    ],
    "topProducts": [
      {
        "type": "partner_pro",
        "count": 20,
        "totalCommission": 120000
      }
    ]
  }
}
```

---

#### **GET /api/commercial/sales**
Liste des ventes du commercial

**Headers:** `Authorization: Bearer {token}`

**Query params:**
- `page` (optional): Numéro de page
- `limit` (optional): Résultats par page
- `status` (optional): Filtrer par statut
- `startDate` (optional): Date de début
- `endDate` (optional): Date de fin

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sales": [
      {
        "id": "uuid",
        "customerName": "Jane Doe",
        "customerEmail": "jane@example.com",
        "type": "partner_pro",
        "commission": 6000,
        "status": "validated",
        "createdAt": "2024-01-11T08:00:00Z",
        "validatedAt": "2024-01-11T08:05:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    },
    "summary": {
      "totalCommission": 75000,
      "validatedCommission": 70000,
      "pendingCommission": 5000
    }
  }
}
```

---

### **Retraits**

#### **POST /api/commercial/withdraw**
Demander un retrait

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "amount": 10000,
  "method": "mobile_money",
  "mobileMoneyNumber": "+237 6XX XXX XXX",
  "mobileMoneyProvider": "MTN"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "withdrawal": {
      "id": "uuid",
      "amount": 10000,
      "fees": 200,
      "netAmount": 9800,
      "method": "mobile_money",
      "status": "pending",
      "createdAt": "2024-01-11T09:00:00Z"
    },
    "newBalance": 5000
  }
}
```

**Errors:**
- 400: Solde insuffisant
- 400: Montant inférieur au minimum
- 422: Informations de paiement invalides

---

#### **GET /api/commercial/withdrawals**
Historique des retraits

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "withdrawals": [
      {
        "id": "uuid",
        "amount": 10000,
        "fees": 200,
        "netAmount": 9800,
        "method": "mobile_money",
        "status": "completed",
        "createdAt": "2024-01-10T10:00:00Z",
        "completedAt": "2024-01-11T08:00:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 20
    }
  }
}
```

---

### **Profil Commercial**

#### **GET /api/commercial/profile**
Récupérer le profil

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+237 6XX XXX XXX",
    "referralCode": "JOHN2024A7B",
    "referralLink": "https://studyia.net?ref=JOHN2024A7B",
    "bankName": "Ecobank",
    "accountNumber": "XXXX XXXX XXXX",
    "status": "active",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

#### **PUT /api/commercial/profile**
Mettre à jour le profil

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "phone": "+237 6XX XXX XXX",
  "bankName": "Ecobank",
  "accountNumber": "1234567890",
  "accountName": "John Doe"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* Updated commercial object */ }
}
```

---

### **Admin - Gestion des commerciaux**

#### **GET /api/admin/commercials**
Liste de tous les commerciaux

**Headers:** `Authorization: Bearer {admin_token}`

**Query params:**
- `status` (optional): Filtrer par statut
- `search` (optional): Recherche par nom/email
- `sortBy` (optional): Trier par (sales, commission, date)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "commercials": [
      {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "referralCode": "JOHN2024A7B",
        "totalSales": 150,
        "totalCommission": 75000,
        "availableBalance": 15000,
        "status": "active",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

---

#### **GET /api/admin/withdrawals**
Liste des demandes de retrait

**Headers:** `Authorization: Bearer {admin_token}`

**Query params:**
- `status` (optional): pending, processing, completed, rejected

**Response (200):**
```json
{
  "success": true,
  "data": {
    "withdrawals": [
      {
        "id": "uuid",
        "commercial": {
          "id": "uuid",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "amount": 10000,
        "fees": 200,
        "netAmount": 9800,
        "method": "mobile_money",
        "mobileMoneyNumber": "+237 6XX XXX XXX",
        "status": "pending",
        "createdAt": "2024-01-11T09:00:00Z"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

---

#### **PUT /api/admin/withdrawals/:id/process**
Traiter une demande de retrait

**Headers:** `Authorization: Bearer {admin_token}`

**Request:**
```json
{
  "status": "completed",
  "transactionId": "MTN-123456789"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "withdrawal": { /* Updated withdrawal */ },
    "emailSent": true
  }
}
```

---

## 🎨 INTERFACE COMMERCIAUX

### **1. Page d'inscription**

**Route:** `/commercial/signup`

**Éléments:**
- Formulaire d'inscription
- Avantages du programme
- Témoignages de commerciaux
- FAQ

**Design:**
- Moderne et attractif
- Mise en avant des gains potentiels
- Call-to-action fort

### **2. Dashboard commercial**

**Route:** `/commercial/dashboard`

**Sections:**

1. **Header**
   - Solde disponible (grand et visible)
   - Bouton "Retirer mes gains"
   - Bouton "Partager mon lien"

2. **Statistiques rapides**
   - Ventes aujourd'hui
   - Ventes ce mois
   - Commission totale
   - Taux de conversion

3. **Graphiques**
   - Évolution des ventes (7/30 jours)
   - Répartition par type de produit
   - Commissions par jour

4. **Lien de parrainage**
   - Code de parrainage (copier)
   - Lien complet (copier)
   - QR Code (télécharger)
   - Boutons de partage (WhatsApp, Facebook, Email)

5. **Dernières ventes**
   - Tableau des 10 dernières ventes
   - Nom client, Type, Commission, Date, Statut

6. **Matériel marketing**
   - Visuels à télécharger
   - Messages types
   - Guide de vente

### **3. Page des ventes**

**Route:** `/commercial/sales`

**Fonctionnalités:**
- Tableau complet de toutes les ventes
- Filtres (date, statut, type)
- Recherche par client
- Export CSV/Excel
- Détails de chaque vente

### **4. Page de retrait**

**Route:** `/commercial/withdraw`

**Sections:**
- Solde disponible
- Formulaire de retrait
- Historique des retraits
- Informations bancaires enregistrées

### **5. Page profil**

**Route:** `/commercial/profile`

**Sections:**
- Informations personnelles
- Informations bancaires
- Changer mot de passe
- Statistiques globales

---

## 💳 PAIEMENTS ET RETRAITS

### **1. Méthodes de paiement**

#### **A. Mobile Money**

**Providers supportés:**
- MTN Mobile Money
- Orange Money
- Moov Money

**Process:**
1. Commercial saisit son numéro
2. Admin effectue le transfert manuellement
3. Confirmation par SMS
4. Mise à jour du statut

**Frais:** 2% (minimum 500 FCFA)

#### **B. Virement bancaire**

**Banques supportées:**
- Toutes les banques locales

**Process:**
1. Commercial saisit ses coordonnées bancaires
2. Admin effectue le virement
3. Délai: 24-48h
4. Confirmation par email

**Frais:** 1,000 FCFA fixe

#### **C. Retrait en espèces**

**Agences:**
- Bureaux Studyia Career (si disponibles)

**Process:**
1. Commercial demande un retrait
2. Rendez-vous fixé
3. Retrait sur présentation de la CNI
4. Reçu signé

**Frais:** Gratuit

### **2. Sécurité des retraits**

**Vérifications:**
- Vérification d'identité (CNI)
- Confirmation par email
- Code OTP par SMS
- Limite de retrait : 500,000 FCFA/jour

**Anti-fraude:**
- Analyse des patterns de vente
- Vérification des IPs
- Délai de sécurité (7 jours pour nouveaux commerciaux)

---

## 📊 STATISTIQUES ET REPORTING

### **1. Dashboard commercial**

**Métriques affichées:**
- Solde disponible
- Ventes (jour/semaine/mois/total)
- Commission (jour/semaine/mois/total)
- Taux de conversion
- Clics sur le lien
- Top produits vendus

**Graphiques:**
- Courbe des ventes (30 jours)
- Répartition par type de produit (pie chart)
- Commissions par jour (bar chart)

### **2. Rapports exportables**

**Formats:**
- CSV
- Excel
- PDF

**Contenu:**
- Liste complète des ventes
- Détails des commissions
- Historique des retraits

### **3. Leaderboard (classement)**

**Affichage:**
- Top 10 commerciaux du mois
- Classement par ventes
- Classement par commissions
- Badges et récompenses

**Gamification:**
- Badges (Bronze, Silver, Gold, Platinum)
- Niveaux (Débutant, Intermédiaire, Expert, Master)
- Récompenses bonus

---

## 🔒 SÉCURITÉ ET ANTI-FRAUDE

### **1. Détection de fraude**

**Indicateurs suspects:**
- Trop de ventes en peu de temps
- Même IP pour plusieurs ventes
- Patterns de clics anormaux
- Ventes puis annulations répétées

**Actions automatiques:**
- Mise en attente des commissions
- Alerte admin
- Vérification manuelle requise

### **2. Validation des ventes**

**Règles:**
- CV public : Validation immédiate
- Partenaire SaaS : Validation après paiement confirmé
- Délai d'annulation : 7 jours
- Vérification anti-bot

### **3. Sanctions**

**Types:**
- Avertissement (1ère fois)
- Suspension temporaire (récidive)
- Bannissement définitif (fraude avérée)
- Annulation des commissions non retirées

### **4. Conditions d'utilisation**

**Interdictions:**
- Spam
- Publicité mensongère
- Création de faux comptes
- Manipulation des liens
- Auto-parrainage

---

## 🚀 PLAN DE DÉPLOIEMENT

### **Phase 1: MVP (2-3 semaines)**

1. ✅ Modèles de données
2. ✅ Inscription/Connexion commercial
3. ✅ Génération code de parrainage
4. ✅ Tracking des clics
5. ✅ Enregistrement des ventes
6. ✅ Calcul des commissions
7. ✅ Dashboard basique

### **Phase 2: Paiements (1-2 semaines)**

8. ✅ Système de retrait
9. ✅ Intégration Mobile Money
10. ✅ Gestion admin des retraits
11. ✅ Notifications email

### **Phase 3: Optimisation (1-2 semaines)**

12. ✅ Statistiques avancées
13. ✅ Graphiques et rapports
14. ✅ Matériel marketing
15. ✅ Leaderboard
16. ✅ Gamification

### **Phase 4: Sécurité (1 semaine)**

17. ✅ Anti-fraude
18. ✅ Validation avancée
19. ✅ Monitoring
20. ✅ Tests de charge

---

## 📱 FONCTIONNALITÉS BONUS

### **1. Application mobile**

- App dédiée pour les commerciaux
- Notifications push pour les ventes
- Partage rapide du lien
- Scan QR Code

### **2. Programme de parrainage à 2 niveaux**

- Niveau 1 : Commission directe (20%)
- Niveau 2 : Commission sur les filleuls (5%)
- Exemple : John parraine Marie, Marie vend → John gagne 5%

### **3. Challenges et concours**

- Concours mensuel (meilleur vendeur)
- Challenges hebdomadaires
- Récompenses spéciales
- Voyages, cadeaux, bonus

### **4. Formation et support**

- Vidéos de formation
- Webinaires mensuels
- Groupe WhatsApp/Telegram
- Support dédié

---

## 💡 EXEMPLES DE GAINS

### **Scénario 1 : Commercial débutant**

**Objectif:** 10 CV publics/jour

- 10 CV × 500 FCFA = **5,000 FCFA/jour**
- 30 jours = **150,000 FCFA/mois**

### **Scénario 2 : Commercial actif**

**Objectif:** 5 CV publics + 2 partenaires Pro/semaine

- 20 CV publics × 500 = 10,000 FCFA
- 8 partenaires Pro × 6,000 = 48,000 FCFA
- **Total mois : 58,000 FCFA**

### **Scénario 3 : Commercial expert**

**Objectif:** 10 partenaires/mois (mix Starter/Pro/Business)

- 3 Starter × 3,000 = 9,000 FCFA
- 5 Pro × 6,000 = 30,000 FCFA
- 2 Business × 12,000 = 24,000 FCFA
- **Total mois : 63,000 FCFA**

### **Scénario 4 : Super commercial**

**Objectif:** 30 partenaires/mois

- 10 Starter × 3,000 = 30,000 FCFA
- 15 Pro × 6,000 = 90,000 FCFA
- 5 Business × 12,000 = 60,000 FCFA
- **Total mois : 180,000 FCFA**

---

## 📧 EMAILS AUTOMATIQUES

### **1. Bienvenue commercial**

**Trigger:** Inscription validée

**Contenu:**
- Code et lien de parrainage
- Guide de démarrage
- Matériel marketing
- Premiers conseils

### **2. Nouvelle vente**

**Trigger:** Vente enregistrée

**Contenu:**
- Détails de la vente
- Montant de la commission
- Nouveau solde
- Lien vers le dashboard

### **3. Commission validée**

**Trigger:** Statut passe à "validated"

**Contenu:**
- Confirmation de validation
- Montant crédité
- Solde disponible

### **4. Demande de retrait**

**Trigger:** Retrait demandé

**Contenu:**
- Confirmation de la demande
- Montant et frais
- Délai de traitement
- Numéro de référence

### **5. Retrait effectué**

**Trigger:** Retrait complété

**Contenu:**
- Confirmation du paiement
- Montant reçu
- ID de transaction
- Nouveau solde

### **6. Rappels et alertes**

**Triggers:**
- Pas de vente depuis 7 jours
- Solde > 10,000 FCFA (incitation au retrait)
- Nouveau matériel marketing disponible
- Challenge en cours

---

## 🎯 KPIs À SUIVRE

### **Métriques commerciaux**

- Nombre total de commerciaux
- Commerciaux actifs (vente dans les 30 derniers jours)
- Taux d'activation (commerciaux avec au moins 1 vente)
- Churn rate (commerciaux inactifs)

### **Métriques ventes**

- Ventes totales via parrainage
- Taux de conversion (clics → ventes)
- Panier moyen
- Répartition par type de produit

### **Métriques financières**

- Commissions totales versées
- Commissions en attente
- Montant moyen des retraits
- Coût d'acquisition client (via parrainage)

### **Métriques performance**

- Top 10 commerciaux
- Ventes moyennes par commercial
- Commission moyenne par vente
- ROI du programme d'affiliation

---

## 🔗 INTÉGRATION FRONTEND

### **Nouvelles routes à ajouter**

```typescript
// Routes commerciaux
<Route path="/commercial/signup" element={<CommercialSignupPage />} />
<Route path="/commercial/login" element={<CommercialLoginPage />} />
<Route path="/commercial/dashboard" element={<ProtectedRoute><CommercialDashboardPage /></ProtectedRoute>} />
<Route path="/commercial/sales" element={<ProtectedRoute><CommercialSalesPage /></ProtectedRoute>} />
<Route path="/commercial/withdraw" element={<ProtectedRoute><CommercialWithdrawPage /></ProtectedRoute>} />
<Route path="/commercial/profile" element={<ProtectedRoute><CommercialProfilePage /></ProtectedRoute>} />
```

### **Nouveau contexte AuthCommercial**

```typescript
interface CommercialAuthContext {
  commercial: Commercial | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  balance: {
    available: number;
    pending: number;
    withdrawn: number;
  };
  stats: CommercialStats;
  refreshStats: () => void;
}
```

### **Tracking des parrainages**

```typescript
// Dans App.tsx ou un composant racine
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  
  if (refCode) {
    // Enregistrer dans cookie et localStorage
    document.cookie = `studyia_ref=${refCode}; max-age=2592000; path=/`;
    localStorage.setItem('studyia_referral', refCode);
    
    // Tracker le clic
    trackReferralClick(refCode);
  }
}, []);
```

### **Conversion tracking**

```typescript
// Dans BuilderPage après création de CV
const handleCVCreated = async (cvData) => {
  // ... logique existante
  
  // Vérifier si parrainage
  const refCode = localStorage.getItem('studyia_referral');
  if (refCode) {
    await trackConversion({
      referralCode: refCode,
      cvType: 'public',
      customerEmail: cvData.personalInfo.email,
      customerName: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`
    });
  }
};
```

---

## 📝 CHECKLIST DE DÉVELOPPEMENT

### **Backend**

- [ ] Créer les tables (commercials, referrals, withdrawals, etc.)
- [ ] Implémenter les endpoints d'authentification
- [ ] Implémenter le tracking des clics
- [ ] Implémenter le tracking des conversions
- [ ] Implémenter le calcul des commissions
- [ ] Implémenter le système de retrait
- [ ] Créer les emails automatiques
- [ ] Implémenter l'anti-fraude
- [ ] Créer le dashboard admin
- [ ] Tests unitaires et d'intégration

### **Frontend**

- [ ] Créer CommercialSignupPage
- [ ] Créer CommercialLoginPage
- [ ] Créer CommercialDashboardPage
- [ ] Créer CommercialSalesPage
- [ ] Créer CommercialWithdrawPage
- [ ] Créer CommercialProfilePage
- [ ] Implémenter AuthCommercialContext
- [ ] Implémenter le tracking des parrainages
- [ ] Créer les composants de partage
- [ ] Créer les graphiques et statistiques
- [ ] Tests E2E

### **Design**

- [ ] Maquettes des pages commerciaux
- [ ] Visuels pour le matériel marketing
- [ ] Templates d'emails
- [ ] Badges et récompenses
- [ ] QR Codes personnalisés

---

**Version:** 1.0.0  
**Date:** Janvier 2024  
**Auteur:** Équipe Studyia Career

---

**FIN DU DOCUMENT - SYSTÈME DE COMMERCIAUX ET AFFILIATION**
