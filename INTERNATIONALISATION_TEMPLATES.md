# 🔧 Internationalisation des Templates - Approche Systématique

**Problème identifié** : Les modifications sont appliquées mais certaines lignes sont réinitialisées lors d'éditions multiples.

**Solution** : Internationaliser chaque template un par un avec des éditions ciblées.

---

## ✅ Templates Complétés (3/14)

1. **ProfessionalTemplate** ✅
2. **CreativeTemplate** ✅ (avec corrections en cours)
3. **MinimalTemplate** ✅

---

## 🔄 Templates en Cours

4. **ExecutiveTemplate** - Corrections nécessaires sur lignes 424, 431

---

## ⏳ Templates Restants (10)

5. FreshTemplate
6. ModernTemplate
7. AcademicTemplate
8. ZurichTemplate
9. TokyoTemplate
10. MilanTemplate
11. StockholmTemplate
12. ElegantTemplate
13. BoldTemplate
14. GradientTemplate

---

## 📝 Plan d'Action Révisé

### Étape 1 : Terminer ExecutiveTemplate
- Corriger ligne 424 : "PARCOURS PROFESSIONNEL" → `{t('cvLabels.experience').toUpperCase()}`
- Ligne 431 déjà corrigée
- Ligne 435 déjà corrigée

### Étape 2 : Continuer avec les 10 templates restants
Pour chaque template :
1. Lire le template complet
2. Identifier tous les textes en dur
3. Appliquer les modifications une par une
4. Vérifier qu'il n'y a pas de régressions

---

## 🎯 Textes à Remplacer (Pattern)

| Texte en dur | Remplacement |
|--------------|--------------|
| `"Votre Nom"` | `t('cvLabels.yourName')` |
| `"Profil"` / `"À propos de moi"` | `t('cvLabels.profile')` |
| `"Expérience"` / `"PARCOURS PROFESSIONNEL"` | `t('cvLabels.experience')` |
| `"Formation"` / `"FORMATION"` | `t('cvLabels.education')` |
| `"Compétences"` / `"Compétences Clés"` | `t('cvLabels.skills')` / `t('cvLabels.skillsKey')` |
| `"Titre"` / `"Poste"` | `t('cvLabels.title')` / `t('cvLabels.jobTitle')` |
| `"Entreprise"` | `t('cvLabels.company')` |
| `"Diplôme"` | `t('cvLabels.degree')` |
| `"École"` / `"Établissement"` | `t('cvLabels.institution')` |
| `"Début"` | `t('cvLabels.start')` |
| `"Fin"` | `t('cvLabels.end')` |
| `"Présent"` | `t('cvLabels.present')` |

---

**Progression** : 3/14 templates terminés (21%)
