# 📋 Guide Administrateur - Gestion des Partenaires

## 🎯 Vue d'ensemble

Ce guide explique comment gérer les demandes d'accès partenaire et créer des comptes pour Studyia Career.

---

## 📧 Réception des demandes

### Format de l'email reçu

Lorsqu'un utilisateur soumet une demande d'accès partenaire, vous recevrez un email à **contact@studyia.net** avec le format suivant :

```
Objet : 🆕 Nouvelle demande d'accès partenaire - [Nom de l'entreprise]

Corps :
Nouvelle demande d'accès à l'espace partenaire Studyia Career

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    INFORMATIONS DU DEMANDEUR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 IDENTITÉ
   Prénom          : [Prénom]
   Nom             : [Nom]

🏢 ENTREPRISE
   Nom             : [Nom de l'entreprise]

📧 CONTACT
   Email           : [email@example.com]
   Téléphone       : [+XXX X XX XX XX XX]

📍 LOCALISATION
   Pays            : [🇨🇲 Cameroun / 🇬🇦 Gabon / 🇬🇶 Guinée Équatoriale]
   Ville           : [Ville]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Date de la demande : [Date complète]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 ACTIONS À EFFECTUER :

1. Vérifier la légitimité de l'entreprise
2. Créer le compte partenaire dans le système
3. Générer un mot de passe sécurisé
4. Envoyer les identifiants par email à : [email@example.com]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ✅ Validation d'une demande

### Étape 1 : Évaluation

Évaluez la demande selon vos critères :
- Légitimité de l'entreprise
- Pertinence du partenariat
- Informations complètes et cohérentes

### Étape 2 : Création du compte

#### Option A : Via la Console Développeur (Recommandé)

1. Ouvrez la console du navigateur sur https://studyia-career.vercel.app
2. Exécutez le script suivant en remplaçant les valeurs :

```javascript
// Fonction pour générer un mot de passe sécurisé
function generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$%&';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Récupérer les partenaires existants
const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');

// Générer un mot de passe sécurisé
const generatedPassword = generatePassword(12);

// Créer le nouveau partenaire
const newPartner = {
  id: Date.now().toString(),
  email: "email@example.com",           // Email du demandeur
  password: generatedPassword,          // Mot de passe généré automatiquement
  firstName: "Prénom",                   // Prénom du demandeur
  lastName: "Nom",                       // Nom du demandeur
  company: "Nom Entreprise",             // Nom de l'entreprise
  phone: "+237 6 XX XX XX XX",          // Téléphone du demandeur
  country: "CM",                         // Code pays (CM/GA/GQ)
  city: "Yaoundé",                       // Ville du demandeur
  createdAt: new Date().toISOString(),
};

// Ajouter le partenaire
partners.push(newPartner);
localStorage.setItem('studyia_partners', JSON.stringify(partners));

console.log('✅ Compte partenaire créé avec succès !');
console.log('Email:', newPartner.email);
console.log('Mot de passe généré:', generatedPassword);
console.log('⚠️ IMPORTANT: Envoyez ce mot de passe au partenaire par email !');
```

#### Option B : Manuellement via localStorage

1. Ouvrez l'application dans le navigateur
2. Ouvrez les DevTools (F12)
3. Allez dans l'onglet **Application** > **Local Storage**
4. Créez ou modifiez la clé `studyia_partners`
5. Ajoutez le nouveau partenaire au tableau JSON

---

## 📨 Notification au partenaire

### Email de confirmation à envoyer

Une fois le compte créé, envoyez cet email au nouveau partenaire :

```
Objet : ✅ Votre accès partenaire Studyia Career est activé !

Bonjour [Prénom],

Excellente nouvelle ! Votre demande d'accès à l'espace partenaire Studyia Career a été validée.

🎉 VOTRE COMPTE EST MAINTENANT ACTIF

Vos identifiants de connexion :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email           : [email@example.com]
🔐 Mot de passe    : [mot_de_passe_généré]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Pour votre sécurité, nous vous recommandons de changer ce mot de passe 
   lors de votre première connexion.

🔗 ACCÉDER À VOTRE ESPACE :
https://studyia-career.vercel.app/partner/login

✨ CE QUE VOUS POUVEZ FAIRE :
• Créer des CV professionnels illimités
• Gérer votre historique de documents
• Choisir la langue de vos CV (FR/EN)
• Télécharger vos CV en PDF
• Interface premium et intuitive

📚 PREMIERS PAS :
1. Connectez-vous avec vos identifiants
2. Explorez votre tableau de bord
3. Créez votre premier CV en cliquant sur "Nouveau CV"
4. Choisissez votre langue (Français ou Anglais)
5. Suivez les étapes guidées

📍 VOTRE PROFIL :
   Entreprise : [Nom Entreprise]
   Localisation : [Ville], [Pays]

💡 BESOIN D'AIDE ?
Notre équipe est à votre disposition : contact@studyia.net

Bienvenue dans la famille Studyia Career ! 🚀

Cordialement,
L'équipe Studyia Career
```

---

## 🔧 Gestion des comptes existants

### Lister tous les partenaires

```javascript
const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
console.table(partners.map(p => ({
  ID: p.id,
  Email: p.email,
  Nom: `${p.firstName} ${p.lastName}`,
  Entreprise: p.company,
  Créé: new Date(p.createdAt).toLocaleDateString('fr-FR')
})));
```

### Modifier un partenaire

```javascript
const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
const partnerIndex = partners.findIndex(p => p.email === 'email@example.com');

if (partnerIndex !== -1) {
  partners[partnerIndex].company = 'Nouveau nom entreprise';
  // Modifiez d'autres champs si nécessaire
  localStorage.setItem('studyia_partners', JSON.stringify(partners));
  console.log('✅ Partenaire mis à jour');
}
```

### Supprimer un partenaire

```javascript
const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
const filteredPartners = partners.filter(p => p.email !== 'email@example.com');
localStorage.setItem('studyia_partners', JSON.stringify(filteredPartners));
console.log('✅ Partenaire supprimé');
```

### Réinitialiser le mot de passe

```javascript
const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
const partner = partners.find(p => p.email === 'email@example.com');

if (partner) {
  partner.password = 'nouveau_mot_de_passe';
  localStorage.setItem('studyia_partners', JSON.stringify(partners));
  console.log('✅ Mot de passe réinitialisé');
  // N'oubliez pas d'envoyer le nouveau mot de passe par email
}
```

---

## 📊 Statistiques

### Nombre total de partenaires

```javascript
const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
console.log(`📊 Nombre total de partenaires : ${partners.length}`);
```

### Partenaires par mois

```javascript
const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
const byMonth = partners.reduce((acc, p) => {
  const month = new Date(p.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  acc[month] = (acc[month] || 0) + 1;
  return acc;
}, {});
console.table(byMonth);
```

---

## 🚨 Dépannage

### Un partenaire ne peut pas se connecter

1. Vérifiez que le compte existe :
```javascript
const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
const partner = partners.find(p => p.email === 'email@example.com');
console.log(partner ? '✅ Compte trouvé' : '❌ Compte introuvable');
```

2. Vérifiez le mot de passe :
```javascript
console.log('Mot de passe actuel:', partner?.password);
```

3. Réinitialisez si nécessaire (voir section ci-dessus)

### Données corrompues

Si les données sont corrompues, vous pouvez réinitialiser :

```javascript
// ⚠️ ATTENTION : Cela supprime TOUS les partenaires
localStorage.removeItem('studyia_partners');
console.log('⚠️ Tous les comptes partenaires ont été supprimés');
```

---

## 🔐 Sécurité

### Bonnes pratiques

- ✅ Vérifiez toujours l'identité du demandeur
- ✅ Utilisez des mots de passe forts (min. 8 caractères)
- ✅ Conservez une trace des comptes créés
- ✅ Répondez aux demandes sous 24-48h
- ✅ Envoyez toujours un email de confirmation
- ❌ Ne partagez jamais les identifiants publiquement
- ❌ Ne créez pas de comptes sans validation

---

## 📞 Support

Pour toute question sur la gestion des partenaires :
- Email : contact@studyia.net
- Documentation technique : Ce fichier

---

**Dernière mise à jour :** Janvier 2026  
**Version :** 1.0
