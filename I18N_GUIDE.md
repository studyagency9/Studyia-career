# 🌍 Guide d'Internationalisation (i18n)

## Comment switcher entre Français et Anglais ?

### ✅ Le système est maintenant intégré !

Le système i18n est maintenant actif dans `App.tsx`. Voici comment l'utiliser :

---

## 🎯 Méthode 1 : Utiliser le LanguageSwitcher (Recommandé)

### Ajouter le bouton de changement de langue dans votre navigation :

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Dans votre composant Header/Navigation
<nav className="flex items-center gap-4">
  <a href="/">Accueil</a>
  <a href="/builder">Créer CV</a>
  <LanguageSwitcher />  {/* 👈 Ajouter ici */}
</nav>
```

### Ou utiliser la version simple :

```tsx
import { LanguageSwitcherDemo } from '@/components/LanguageSwitcherDemo';

<LanguageSwitcherDemo />
```

---

## 🎯 Méthode 2 : Switcher programmatiquement

```tsx
import { useI18n } from '@/i18n/i18nContext';

function MyComponent() {
  const { language, setLanguage } = useI18n();

  // Changer vers français
  const switchToFrench = () => setLanguage('fr');

  // Changer vers anglais
  const switchToEnglish = () => setLanguage('en');

  // Toggle entre les deux
  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <div>
      <p>Langue actuelle : {language}</p>
      <button onClick={switchToFrench}>Français</button>
      <button onClick={switchToEnglish}>English</button>
      <button onClick={toggleLanguage}>Toggle</button>
    </div>
  );
}
```

---

## 📝 Comment utiliser les traductions dans vos composants ?

### Méthode simple avec `useTranslation` :

```tsx
import { useTranslation } from '@/i18n/i18nContext';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('home.hero.title')}</h1>
      <p>{t('home.hero.subtitle')}</p>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### Accès complet avec `useI18n` :

```tsx
import { useI18n } from '@/i18n/i18nContext';

function MyComponent() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div>
      <p>Current language: {language}</p>
      <h1>{t('home.hero.title')}</h1>
      <button onClick={() => setLanguage('en')}>
        Switch to English
      </button>
    </div>
  );
}
```

---

## 📚 Structure des clés de traduction

Les traductions sont organisées hiérarchiquement dans `src/i18n/translations.ts` :

```
translations
├── fr
│   ├── common (loading, save, cancel, etc.)
│   ├── nav (home, builder, upload, etc.)
│   ├── home
│   │   ├── hero
│   │   ├── why
│   │   └── howItWorks
│   ├── builder
│   │   ├── steps
│   │   ├── personal
│   │   ├── job
│   │   ├── experience
│   │   ├── education
│   │   ├── skills
│   │   ├── template
│   │   └── preview
│   ├── upload
│   ├── analysis
│   └── errors
└── en (même structure)
```

### Exemples de clés disponibles :

```tsx
t('common.loading')              // "Chargement..." / "Loading..."
t('common.save')                 // "Enregistrer" / "Save"
t('nav.home')                    // "Accueil" / "Home"
t('home.hero.title')             // "Crée un CV professionnel" / "Create a professional CV"
t('builder.steps.personal')      // "Informations" / "Information"
t('builder.personal.firstName')  // "Prénom" / "First name"
t('errors.required')             // "Ce champ est requis" / "This field is required"
```

---

## 🔧 Ajouter de nouvelles traductions

### 1. Ouvrir `src/i18n/translations.ts`

### 2. Ajouter votre clé dans les deux langues :

```typescript
export const translations = {
  fr: {
    mySection: {
      myKey: 'Mon texte en français',
      anotherKey: 'Un autre texte'
    }
  },
  en: {
    mySection: {
      myKey: 'My text in English',
      anotherKey: 'Another text'
    }
  }
};
```

### 3. Utiliser dans votre composant :

```tsx
const { t } = useTranslation();
<p>{t('mySection.myKey')}</p>
```

---

## 🎨 Où placer le LanguageSwitcher ?

### Option 1 : Dans Index.tsx (Landing Page)

Ajouter dans la navigation du header :

```tsx
// Dans src/pages/Index.tsx, ligne ~50
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Dans le header
<nav className="hidden md:flex items-center gap-8">
  <a href="#features">Fonctionnalités</a>
  <a href="#templates">Modèles</a>
  <LanguageSwitcher />  {/* 👈 Ici */}
</nav>
```

### Option 2 : Dans BuilderPage.tsx

Ajouter dans le header de la page builder :

```tsx
// Dans src/pages/BuilderPage.tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Dans le header
<div className="flex items-center justify-between mb-8">
  <h1>Mon CV</h1>
  <LanguageSwitcher />  {/* 👈 Ici */}
</div>
```

### Option 3 : Créer un Header global

```tsx
// src/components/Header.tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export const Header = () => (
  <header className="sticky top-0 z-50 bg-background border-b">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <a href="/" className="text-xl font-bold">Studyia Career</a>
      <nav className="flex items-center gap-6">
        <a href="/builder">Créer CV</a>
        <a href="/upload">Importer</a>
        <LanguageSwitcher />
      </nav>
    </div>
  </header>
);
```

---

## 🚀 Test rapide

### 1. Ouvrir la console du navigateur

```javascript
// Changer la langue
localStorage.setItem('language', 'en');
window.location.reload();

// Ou
localStorage.setItem('language', 'fr');
window.location.reload();
```

### 2. Vérifier la langue actuelle

```javascript
console.log(localStorage.getItem('language'));
console.log(document.documentElement.lang);
```

---

## 📊 État actuel de l'internationalisation

### ✅ Déjà fait :
- ✅ Système i18n complet (Context + Provider)
- ✅ Traductions FR/EN complètes
- ✅ Détection automatique de la langue du navigateur
- ✅ Persistance dans localStorage
- ✅ Synchronisation entre onglets
- ✅ Composants LanguageSwitcher et LanguageSwitcherDemo
- ✅ App.tsx intégré avec I18nProvider
- ✅ PageLoader internationalisé

### ⚠️ À faire :
- ⚠️ Internationaliser Index.tsx (landing page)
- ⚠️ Internationaliser BuilderPage.tsx
- ⚠️ Internationaliser UploadPage.tsx
- ⚠️ Ajouter LanguageSwitcher dans la navigation

---

## 💡 Exemple complet d'utilisation

```tsx
import { useTranslation } from '@/i18n/i18nContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';

export const MyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-8">
      {/* Header avec switcher */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('home.hero.title')}</h1>
        <LanguageSwitcher />
      </header>

      {/* Contenu traduit */}
      <main>
        <p className="text-lg mb-4">{t('home.hero.subtitle')}</p>
        <Button>{t('common.save')}</Button>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-sm text-muted-foreground">
        {t('home.hero.trustFree')}
      </footer>
    </div>
  );
};
```

---

## 🎯 Prochaines étapes recommandées

1. **Ajouter le LanguageSwitcher dans Index.tsx** (landing page)
2. **Remplacer les textes en dur par `t('...')` dans toutes les pages**
3. **Tester le changement de langue sur toutes les pages**
4. **Ajouter plus de langues si nécessaire** (ES, DE, etc.)

---

## ❓ FAQ

**Q: Comment ajouter une nouvelle langue (ex: Espagnol) ?**

R: 
1. Ajouter `es` dans `src/i18n/translations.ts`
2. Copier la structure de `fr` ou `en`
3. Traduire tous les textes
4. Ajouter dans `LanguageSwitcher.tsx` : `{ code: 'es', name: 'Español', flag: '🇪🇸' }`

**Q: La langue ne change pas ?**

R: Vérifier que :
1. Le composant est bien à l'intérieur du `<I18nProvider>`
2. Vous utilisez `useTranslation()` ou `useI18n()`
3. Le localStorage contient la bonne valeur

**Q: Comment forcer une langue par défaut ?**

R: Modifier `src/i18n/i18nContext.tsx` ligne 25 :
```tsx
return 'fr'; // ou 'en'
```

---

**Créé le** : 9 janvier 2026  
**Auteur** : Cascade AI Assistant
