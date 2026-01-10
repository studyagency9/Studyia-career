# 🔧 Script de Création de Compte Partenaire Test

## 📋 Script à exécuter dans la console du navigateur

Ouvrez la console (F12) et exécutez ce script pour créer un compte partenaire de test avec le nouveau système de forfaits :

```javascript
// ============================================
// SCRIPT DE CRÉATION DE COMPTE PARTENAIRE TEST
// ============================================

// Créer un compte partenaire avec forfait PRO par défaut
const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');

// Date de renouvellement (dans 30 jours)
const renewalDate = new Date();
renewalDate.setMonth(renewalDate.getMonth() + 1);

const testPartner = {
  id: Date.now().toString(),
  email: "test@techrecruit.cm",
  password: "Test123456@",
  firstName: "Marie",
  lastName: "Kamga",
  company: "TechRecruit Cameroun",
  phone: "+237 6 77 88 99 00",
  country: "CM",
  city: "Douala",
  plan: "pro",                          // Forfait PRO par défaut
  cvUsedThisMonth: 15,                  // 15 CV déjà utilisés (pour tester l'affichage du quota)
  planRenewalDate: renewalDate.toISOString(),
  createdAt: new Date().toISOString()
};

partners.push(testPartner);
localStorage.setItem('studyia_partners', JSON.stringify(partners));

console.log('✅ Compte partenaire créé avec succès !');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📧 Email:', testPartner.email);
console.log('🔑 Mot de passe:', testPartner.password);
console.log('💼 Forfait:', testPartner.plan.toUpperCase());
console.log('📊 Quota utilisé:', testPartner.cvUsedThisMonth + '/100 CV');
console.log('📅 Renouvellement:', new Date(testPartner.planRenewalDate).toLocaleDateString('fr-FR'));
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
```

## 🔄 Script pour Mettre à Jour un Compte Existant

Si vous avez déjà un compte créé sans les nouveaux champs (plan, cvUsedThisMonth, planRenewalDate), utilisez ce script :

```javascript
// ============================================
// SCRIPT DE MISE À JOUR DE COMPTE EXISTANT
// ============================================

const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
const emailToUpdate = "test@techrecruit.cm"; // Changez l'email si nécessaire

const partnerIndex = partners.findIndex(p => p.email === emailToUpdate);

if (partnerIndex !== -1) {
  // Date de renouvellement (dans 30 jours)
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1);

  // Mettre à jour avec les nouveaux champs
  partners[partnerIndex] = {
    ...partners[partnerIndex],
    plan: partners[partnerIndex].plan || "pro",
    cvUsedThisMonth: partners[partnerIndex].cvUsedThisMonth || 0,
    planRenewalDate: partners[partnerIndex].planRenewalDate || renewalDate.toISOString(),
  };

  localStorage.setItem('studyia_partners', JSON.stringify(partners));

  console.log('✅ Compte mis à jour avec succès !');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Email:', partners[partnerIndex].email);
  console.log('💼 Forfait:', partners[partnerIndex].plan.toUpperCase());
  console.log('📊 Quota utilisé:', partners[partnerIndex].cvUsedThisMonth);
  console.log('📅 Renouvellement:', new Date(partners[partnerIndex].planRenewalDate).toLocaleDateString('fr-FR'));
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
} else {
  console.error('❌ Aucun compte trouvé avec cet email:', emailToUpdate);
}
```

## 🎯 Créer des Comptes avec Différents Forfaits

### Compte STARTER (30 CV/mois)
```javascript
const starterPartner = {
  id: Date.now().toString(),
  email: "starter@test.cm",
  password: "Test123456@",
  firstName: "Jean",
  lastName: "Starter",
  company: "Petit Secrétariat",
  phone: "+237 6 11 22 33 44",
  country: "CM",
  city: "Yaoundé",
  plan: "starter",
  cvUsedThisMonth: 25,  // Presque au quota
  planRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString()
};

const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
partners.push(starterPartner);
localStorage.setItem('studyia_partners', JSON.stringify(partners));
console.log('✅ Compte STARTER créé !');
```

### Compte BUSINESS (300 CV/mois)
```javascript
const businessPartner = {
  id: Date.now().toString(),
  email: "business@test.cm",
  password: "Test123456@",
  firstName: "Sophie",
  lastName: "Business",
  company: "Grande Agence RH",
  phone: "+237 6 55 66 77 88",
  country: "GA",
  city: "Libreville",
  plan: "business",
  cvUsedThisMonth: 150,
  planRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString()
};

const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
partners.push(businessPartner);
localStorage.setItem('studyia_partners', JSON.stringify(partners));
console.log('✅ Compte BUSINESS créé !');
```

## 🧹 Nettoyer Tous les Comptes

Pour repartir de zéro :

```javascript
localStorage.removeItem('studyia_partners');
localStorage.removeItem('studyia_partner');
localStorage.removeItem('studyia_partner_cvs');
console.log('✅ Tous les comptes et données ont été supprimés !');
```

## 📊 Voir Tous les Comptes

```javascript
const partners = JSON.parse(localStorage.getItem('studyia_partners') || '[]');
console.table(partners.map(p => ({
  Email: p.email,
  Nom: `${p.firstName} ${p.lastName}`,
  Entreprise: p.company,
  Forfait: p.plan,
  'CV utilisés': `${p.cvUsedThisMonth}/${p.plan === 'starter' ? 30 : p.plan === 'pro' ? 100 : 300}`
})));
```

## 🎯 Identifiants de Test Recommandés

| Email | Mot de passe | Forfait | Quota | Usage |
|-------|--------------|---------|-------|-------|
| `test@techrecruit.cm` | `Test123456@` | PRO | 15/100 | Compte principal de test |
| `starter@test.cm` | `Test123456@` | STARTER | 25/30 | Test quota presque atteint |
| `business@test.cm` | `Test123456@` | BUSINESS | 150/300 | Test gros volume |

---

**Note :** Ces scripts fonctionnent uniquement avec localStorage. En production, vous aurez besoin d'un vrai backend avec base de données.
