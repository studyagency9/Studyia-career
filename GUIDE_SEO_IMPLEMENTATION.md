# 📘 Guide d'Implémentation SEO - Studyia Career

## 🎯 Guide Pratique pour Développeurs

Ce guide explique comment utiliser le système SEO implémenté sur Studyia Career.

---

## 🚀 Quick Start

### 1. Ajouter le SEO à une Nouvelle Page

```typescript
import { useSEO } from '@/hooks/useSEO';
import { getWebPageSchema } from '@/utils/seo';

const MaNouvellePage = () => {
  // Configurer le SEO de la page
  useSEO({
    title: 'Titre de ma page - Studyia Career',
    description: 'Description optimisée pour les moteurs de recherche (150-160 caractères)',
    keywords: 'mot-clé1, mot-clé2, mot-clé3',
    canonical: 'https://career.studyia.net/ma-page',
    ogType: 'website', // ou 'article' pour un blog
    structuredData: getWebPageSchema({
      name: 'Nom de la page',
      description: 'Description de la page',
      url: 'https://career.studyia.net/ma-page'
    })
  });

  return (
    <div>
      <h1>Mon Titre Principal</h1>
      {/* Contenu de la page */}
    </div>
  );
};
```

---

## 📋 Checklist SEO par Page

### Avant de Créer une Page

- [ ] Définir le titre unique (50-60 caractères)
- [ ] Rédiger la meta description (150-160 caractères)
- [ ] Identifier 5-10 mots-clés pertinents
- [ ] Définir l'URL canonique
- [ ] Choisir le type de structured data approprié

### Pendant le Développement

- [ ] Ajouter le hook `useSEO()` en haut du composant
- [ ] Utiliser un seul `<h1>` par page
- [ ] Respecter la hiérarchie H1 → H2 → H3
- [ ] Ajouter des `alt` text descriptifs aux images
- [ ] Utiliser des liens internes avec anchor text descriptif
- [ ] Ajouter des breadcrumbs si navigation profonde

### Après le Développement

- [ ] Tester la page avec Google Rich Results Test
- [ ] Vérifier les meta tags avec View Page Source
- [ ] Valider le structured data
- [ ] Tester la performance (PageSpeed Insights)
- [ ] Vérifier l'accessibilité (WAVE)

---

## 🛠️ Fonctions Utilitaires SEO

### `updateMetaTags(config)`

Met à jour dynamiquement les meta tags de la page.

```typescript
import { updateMetaTags } from '@/utils/seo';

updateMetaTags({
  title: 'Mon Titre',
  description: 'Ma description',
  keywords: 'mot1, mot2',
  canonical: 'https://career.studyia.net/page',
  ogImage: '/images/og-image.jpg'
});
```

### `setupPageSEO(config)`

Configuration complète du SEO (meta tags + structured data).

```typescript
import { setupPageSEO } from '@/utils/seo';

setupPageSEO({
  title: 'Mon Titre',
  description: 'Ma description',
  structuredData: [schema1, schema2]
});
```

---

## 📊 Types de Structured Data Disponibles

### 1. Organization Schema

```typescript
import { getOrganizationSchema } from '@/utils/seo';

const schema = getOrganizationSchema();
// Utiliser sur la homepage uniquement
```

### 2. WebSite Schema

```typescript
import { getWebSiteSchema } from '@/utils/seo';

const schema = getWebSiteSchema();
// Utiliser sur la homepage uniquement
```

### 3. WebPage Schema

```typescript
import { getWebPageSchema } from '@/utils/seo';

const schema = getWebPageSchema({
  name: 'Nom de la page',
  description: 'Description',
  url: 'https://career.studyia.net/page',
  breadcrumbs: [
    { name: 'Accueil', url: 'https://career.studyia.net/' },
    { name: 'Section', url: 'https://career.studyia.net/section' },
    { name: 'Page actuelle', url: 'https://career.studyia.net/page' }
  ]
});
```

### 4. SoftwareApplication Schema

```typescript
import { getSoftwareApplicationSchema } from '@/utils/seo';

const schema = getSoftwareApplicationSchema();
// Pour présenter l'application CV
```

### 5. HowTo Schema

```typescript
import { getHowToSchema } from '@/utils/seo';

const schema = getHowToSchema({
  name: 'Comment créer un CV',
  description: 'Guide étape par étape',
  steps: [
    { name: 'Étape 1', text: 'Description étape 1' },
    { name: 'Étape 2', text: 'Description étape 2' }
  ]
});
```

### 6. FAQ Schema

```typescript
import { getFAQSchema } from '@/utils/seo';

const schema = getFAQSchema([
  {
    question: 'Comment créer un CV ?',
    answer: 'Réponse détaillée...'
  },
  {
    question: 'Est-ce gratuit ?',
    answer: 'Oui, totalement gratuit...'
  }
]);
```

### 7. Breadcrumb Schema

```typescript
import { getBreadcrumbSchema } from '@/utils/seo';

const schema = getBreadcrumbSchema([
  { name: 'Accueil', url: 'https://career.studyia.net/' },
  { name: 'Section', url: 'https://career.studyia.net/section' }
]);
```

---

## 🧩 Composants SEO

### Breadcrumbs

```typescript
import { Breadcrumbs } from '@/components/SEO/Breadcrumbs';

<Breadcrumbs 
  items={[
    { name: 'Partenaires', url: '/partner-info' },
    { name: 'Inscription', url: '/partner/signup' }
  ]}
  className="mb-4"
/>
```

### LazyImage

```typescript
import { LazyImage } from '@/components/SEO/LazyImage';

<LazyImage
  src="/images/mon-image.jpg"
  alt="Description détaillée de l'image pour SEO"
  aspectRatio="16/9"
  fallback="/placeholder.svg"
/>
```

---

## 📝 Bonnes Pratiques

### Titles (Titres)

✅ **BON**
```
Créer un CV professionnel - Studyia Career | Gratuit
```

❌ **MAUVAIS**
```
Page | Studyia Career
```

**Règles:**
- 50-60 caractères maximum
- Inclure mot-clé principal
- Inclure nom de marque
- Unique pour chaque page
- Descriptif et engageant

### Meta Descriptions

✅ **BON**
```
Créez votre CV professionnel en quelques minutes avec Studyia Career. 
Guidé étape par étape, templates approuvés par les recruteurs, 
téléchargement PDF instantané. Gratuit pour l'Afrique francophone.
```

❌ **MAUVAIS**
```
Studyia Career - CV
```

**Règles:**
- 150-160 caractères
- Inclure mots-clés principaux
- Call-to-action clair
- Unique pour chaque page
- Pas de duplication du title

### Keywords (Mots-clés)

✅ **BON**
```
CV professionnel, créer CV, générateur CV, emploi Cameroun, 
template CV gratuit, modèle CV PDF
```

❌ **MAUVAIS**
```
cv, emploi, travail, job
```

**Règles:**
- 5-10 mots-clés pertinents
- Longue traîne (3-4 mots)
- Variations naturelles
- Spécifiques au contenu
- Inclure localisation

### Hiérarchie des Titres

```html
<h1>Titre Principal de la Page</h1>
  <h2>Section Principale 1</h2>
    <h3>Sous-section 1.1</h3>
    <h3>Sous-section 1.2</h3>
  <h2>Section Principale 2</h2>
    <h3>Sous-section 2.1</h3>
```

**Règles:**
- Un seul H1 par page
- Ne pas sauter de niveaux (H1 → H3 ❌)
- Ordre logique et hiérarchique
- Inclure mots-clés naturellement

### Images

```typescript
<img 
  src="/images/cv-template.jpg"
  alt="Template de CV professionnel moderne avec sections expérience et formation"
  loading="lazy"
  width="800"
  height="600"
/>
```

**Règles:**
- Alt text descriptif (10-15 mots)
- Inclure mots-clés si pertinent
- Lazy loading pour performance
- Dimensions explicites (width/height)
- Format optimisé (WebP si possible)

### Liens Internes

✅ **BON**
```typescript
<Link to="/builder">
  Créer votre CV professionnel gratuitement
</Link>
```

❌ **MAUVAIS**
```typescript
<Link to="/builder">Cliquez ici</Link>
```

**Règles:**
- Anchor text descriptif
- Inclure mots-clés
- Éviter "cliquez ici"
- Liens contextuels
- Maillage interne stratégique

---

## 🔍 Validation et Tests

### 1. Structured Data

**Google Rich Results Test**
```
https://search.google.com/test/rich-results
```

Tester chaque page pour vérifier le structured data.

### 2. Meta Tags

**View Page Source**
```
Ctrl+U (Windows) ou Cmd+Option+U (Mac)
```

Vérifier que les meta tags sont bien présents et uniques.

### 3. Performance

**PageSpeed Insights**
```
https://pagespeed.web.dev/
```

Objectifs:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: 100

### 4. Accessibilité

**WAVE**
```
https://wave.webaim.org/
```

Vérifier:
- 0 erreurs
- Contraste suffisant
- ARIA labels corrects

---

## 📈 Suivi et Monitoring

### Google Search Console

1. **Soumettre le sitemap**
   ```
   https://career.studyia.net/sitemap.xml
   ```

2. **Vérifier l'indexation**
   - Performance → Requêtes
   - Couverture → Pages indexées
   - Améliorations → Structured data

3. **Surveiller les erreurs**
   - Erreurs 404
   - Erreurs serveur
   - Problèmes mobile

### Google Analytics

1. **Configurer les événements**
   ```typescript
   // Exemple: Tracking création CV
   gtag('event', 'cv_created', {
     'event_category': 'engagement',
     'event_label': 'builder'
   });
   ```

2. **Objectifs à suivre**
   - CV créés
   - CV téléchargés
   - Inscriptions partenaires
   - Inscriptions associés

---

## 🚨 Erreurs Courantes à Éviter

### ❌ Erreur 1: Duplicate Content

**Problème:** Même contenu sur plusieurs URLs

**Solution:** Utiliser canonical URLs
```typescript
useSEO({
  canonical: 'https://career.studyia.net/page-principale'
});
```

### ❌ Erreur 2: Missing H1

**Problème:** Page sans H1 ou plusieurs H1

**Solution:** Un seul H1 par page
```typescript
<h1>Titre Principal Unique</h1>
```

### ❌ Erreur 3: Thin Content

**Problème:** Contenu trop court (< 300 mots)

**Solution:** Enrichir le contenu avec informations utiles

### ❌ Erreur 4: Broken Links

**Problème:** Liens internes cassés

**Solution:** Tester régulièrement avec Screaming Frog

### ❌ Erreur 5: Missing Alt Text

**Problème:** Images sans alt text

**Solution:** Toujours ajouter alt descriptif
```typescript
<LazyImage alt="Description détaillée" />
```

---

## 🎓 Ressources Supplémentaires

### Documentation Officielle
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Web.dev](https://web.dev/)

### Outils SEO
- [Screaming Frog](https://www.screamingfrog.co.uk/)
- [Ahrefs](https://ahrefs.com/)
- [SEMrush](https://www.semrush.com/)
- [Moz](https://moz.com/)

### Communautés
- [r/SEO](https://www.reddit.com/r/SEO/)
- [WebmasterWorld](https://www.webmasterworld.com/)
- [Search Engine Journal](https://www.searchenginejournal.com/)

---

## 📞 Support

Pour toute question sur l'implémentation SEO:

1. **Documentation**: Ce guide
2. **Code source**: `src/utils/seo.ts`
3. **Exemples**: Voir pages existantes (Index.tsx, BuilderPage.tsx)

---

*Guide créé le 11 janvier 2026*  
*Pour Studyia Career - https://career.studyia.net*
