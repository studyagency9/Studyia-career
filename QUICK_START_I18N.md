# 🚀 Guide Rapide : Comment Switcher FR ↔ EN

## ✅ Le système i18n est ACTIF !

Le système d'internationalisation est maintenant intégré dans `App.tsx`. Voici comment l'utiliser immédiatement.

---

## 🎯 Solution Simple : Ajouter le Bouton Toggle

### Étape 1 : Ouvrir `src/pages/Index.tsx`

Ajouter ces imports en haut du fichier (après les imports existants) :

```tsx
import { LanguageSwitcherDemo } from "@/components/LanguageSwitcherDemo";
```

### Étape 2 : Ajouter le bouton dans le header

Chercher la section du header (vers ligne 20-30) et ajouter le composant :

```tsx
// Exemple de placement dans le header
<header className="fixed top-0 w-full z-50">
  <div className="container mx-auto px-4 py-4 flex justify-between items-center">
    <div className="logo">Studyia Career</div>
    <nav className="flex items-center gap-4">
      <a href="#features">Fonctionnalités</a>
      <a href="#templates">Modèles</a>
      <LanguageSwitcherDemo />  {/* 👈 AJOUTER ICI */}
    </nav>
  </div>
</header>
```

---

## 🎨 Alternative : Bouton Dropdown Élégant

Utiliser `LanguageSwitcher` au lieu de `LanguageSwitcherDemo` :

```tsx
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

// Dans votre navigation
<LanguageSwitcher />
```

---

## 💻 Test Immédiat dans la Console

Ouvrir la console du navigateur (F12) et taper :

```javascript
// Changer vers anglais
localStorage.setItem('language', 'en');
window.location.reload();

// Changer vers français
localStorage.setItem('language', 'fr');
window.location.reload();

// Voir la langue actuelle
console.log(localStorage.getItem('language'));
```

---

## 📝 Utiliser les Traductions dans Vos Composants

### Exemple Simple :

```tsx
import { useTranslation } from '@/i18n/i18nContext';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('home.hero.title')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### Exemple avec Changement de Langue :

```tsx
import { useI18n } from '@/i18n/i18nContext';

function MyComponent() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div>
      <p>Langue : {language}</p>
      <button onClick={() => setLanguage('fr')}>🇫🇷 Français</button>
      <button onClick={() => setLanguage('en')}>🇬🇧 English</button>
      <h1>{t('home.hero.title')}</h1>
    </div>
  );
}
```

---

## 📊 Clés de Traduction Disponibles

Voici les principales clés que vous pouvez utiliser immédiatement :

### Common (Commun)
```tsx
t('common.loading')    // "Chargement..." / "Loading..."
t('common.save')       // "Enregistrer" / "Save"
t('common.cancel')     // "Annuler" / "Cancel"
t('common.next')       // "Suivant" / "Next"
t('common.download')   // "Télécharger" / "Download"
```

### Navigation
```tsx
t('nav.home')          // "Accueil" / "Home"
t('nav.builder')       // "Créer un CV" / "Create CV"
t('nav.upload')        // "Mettre à jour" / "Update"
```

### Page d'Accueil
```tsx
t('home.hero.title')              // "Crée un CV professionnel"
t('home.hero.titleHighlight')     // "qui ouvre des portes."
t('home.hero.subtitle')           // "Guidé étape par étape..."
t('home.hero.ctaPrimary')         // "Créer un CV de zéro"
t('home.hero.ctaSecondary')       // "Mettre à jour mon CV"
```

### Builder (Créateur de CV)
```tsx
t('builder.steps.personal')       // "Informations"
t('builder.personal.firstName')   // "Prénom" / "First name"
t('builder.personal.email')       // "Email"
t('builder.experience.add')       // "Ajouter une expérience"
```

### Erreurs
```tsx
t('errors.required')              // "Ce champ est requis"
t('errors.invalidEmail')          // "Email invalide"
```

---

## 🔧 Comportement Automatique

Le système i18n détecte automatiquement :

1. **Langue du navigateur** : Si l'utilisateur a son navigateur en anglais, l'app démarre en anglais
2. **Préférence sauvegardée** : Si l'utilisateur a déjà choisi une langue, elle est restaurée
3. **Synchronisation** : Si vous changez la langue dans un onglet, les autres onglets se mettent à jour

---

## ⚡ État Actuel

### ✅ Déjà Fait
- ✅ Système i18n intégré dans App.tsx
- ✅ Traductions FR/EN complètes (300+ clés)
- ✅ Détection automatique de la langue
- ✅ Persistance localStorage
- ✅ 2 composants de switcher prêts à l'emploi
- ✅ PageLoader internationalisé

### ⚠️ À Faire (Optionnel)
- Remplacer les textes en dur par `t('...')` dans Index.tsx
- Remplacer les textes en dur par `t('...')` dans BuilderPage.tsx
- Remplacer les textes en dur par `t('...')` dans UploadPage.tsx

**Note** : L'app fonctionne déjà ! Les textes en dur sont en français, mais dès que vous ajoutez `t('...')`, ils deviennent multilingues.

---

## 🎯 Exemple Complet : Ajouter le Switcher dans Index.tsx

```tsx
// En haut du fichier, ajouter l'import
import { LanguageSwitcherDemo } from "@/components/LanguageSwitcherDemo";

// Dans le composant Index, ajouter un header fixe
const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header avec switcher de langue */}
      <header className="fixed top-0 w-full z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-white">
            Studyia Career
          </a>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-white/80 hover:text-white">
              Fonctionnalités
            </a>
            <a href="#templates" className="text-white/80 hover:text-white">
              Modèles
            </a>
            <LanguageSwitcherDemo />  {/* 👈 Bouton de langue */}
          </nav>
        </div>
      </header>

      {/* Reste du contenu... */}
      <HeroSection />
      {/* ... */}
    </div>
  );
};
```

---

## 🆘 Dépannage

### Le bouton n'apparaît pas ?
- Vérifier que l'import est correct
- Vérifier que le composant est bien dans `src/components/`
- Recharger la page (Ctrl+R)

### La langue ne change pas ?
- Ouvrir la console (F12) et vérifier les erreurs
- Vérifier que `I18nProvider` est bien dans App.tsx
- Vider le cache du navigateur

### Les traductions ne s'affichent pas ?
- Vérifier que vous utilisez `useTranslation()` dans le composant
- Vérifier que la clé existe dans `src/i18n/translations.ts`
- Le composant doit être à l'intérieur du `<I18nProvider>`

---

**Prêt à l'emploi !** 🚀

Le système est maintenant actif. Il suffit d'ajouter le bouton de changement de langue où vous voulez dans votre interface.
