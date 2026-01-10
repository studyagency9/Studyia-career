# Documentation du modèle PDF

## Structure du modèle

Le modèle PDF a été simplifié pour garantir une cohérence parfaite entre l'aperçu et l'export final. Un seul modèle est maintenant utilisé pour tous les styles de CV, ce qui assure que ce que l'utilisateur voit dans l'aperçu est exactement ce qu'il obtiendra lors du téléchargement.

### Composants du modèle

Le modèle est structuré en sections distinctes :

1. **En-tête**
   - Nom et prénom
   - Titre du poste
   - Informations de contact (email, téléphone, localisation)

2. **Profil**
   - Résumé professionnel

3. **Expérience professionnelle**
   - Liste des expériences avec :
     - Titre du poste
     - Entreprise et localisation
     - Période (date de début - date de fin/présent)
     - Description des responsabilités (avec puces)

4. **Formation**
   - Liste des formations avec :
     - Diplôme
     - Établissement et localisation
     - Période (date de début - date de fin)
     - Description (optionnelle)

5. **Compétences**
   - Liste des compétences présentées sous forme de badges

### Styles

Les styles sont définis de manière inline dans le composant React PDF pour garantir une cohérence parfaite entre l'aperçu et l'export. Les styles incluent :

- Polices : Helvetica (police standard supportée par PDF)
- Couleurs : Palette de gris et noir pour le texte, avec des accents pour les badges de compétences
- Espacements : Marges et paddings cohérents pour une mise en page propre
- Tailles de police : Hiérarchie claire pour les titres, sous-titres et texte

## Utilisation

### Dans l'application

Le modèle est utilisé à deux endroits principaux :

1. **Aperçu en direct** : Composant `PDFPreview` qui utilise `PDFViewer` de react-pdf
2. **Export PDF** : Fonction `generatePDF` qui utilise `pdf` de react-pdf

Les deux utilisent le même composant `BasicPDFTemplate` pour garantir la cohérence.

### Personnalisation

Pour ajouter de nouveaux modèles à l'avenir :

1. Créer un nouveau composant dans un fichier séparé (ex: `NewTemplate.tsx`)
2. Importer ce composant dans `PDFTemplates.tsx`
3. Ajouter le composant à l'objet `pdfTemplateComponents`

## Dépendances

- `@react-pdf/renderer` : Bibliothèque principale pour la génération de PDF
- Styles inline pour garantir la cohérence entre aperçu et export

## Résolution des problèmes courants

- **Différences de rendu** : Si des différences apparaissent entre l'aperçu et l'export, vérifier que les styles sont correctement définis de manière inline dans le composant PDF.
- **Polices manquantes** : Utiliser uniquement les polices standard supportées par PDF ou enregistrer des polices personnalisées via `Font.register()`.
- **Mise en page incorrecte** : Vérifier les unités de mesure et les styles de flexbox utilisés dans le composant PDF.
