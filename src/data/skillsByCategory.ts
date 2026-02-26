// Compétences organisées par catégorie de métier

export const skillsByJobCategory: Record<string, string[]> = {
  // Développement & IT
  'développeur': [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 'Git',
    'SQL', 'HTML', 'CSS', 'API REST', 'Agile', 'Problem Solving', 'Travail d\'équipe'
  ],
  'data': [
    'Python', 'SQL', 'Machine Learning', 'Pandas', 'NumPy', 'Tableau', 'Power BI',
    'Excel', 'Statistiques', 'Data Visualization', 'Analyse de données', 'R', 'Jupyter'
  ],
  'devops': [
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD', 'Jenkins', 'Git', 'Linux',
    'Terraform', 'Ansible', 'Monitoring', 'Shell Scripting', 'Cloud Computing'
  ],
  'sécurité': [
    'Cybersecurity', 'Penetration Testing', 'Firewall', 'OWASP', 'Cryptographie',
    'ISO 27001', 'Risk Assessment', 'Network Security', 'Incident Response', 'SIEM'
  ],
  
  // Design & Créatif
  'designer': [
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI Design', 'UX Research',
    'Prototyping', 'Design System', 'Wireframing', 'User Testing', 'Créativité', 'Communication'
  ],
  'graphique': [
    'Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Créativité',
    'Typographie', 'Print Design', 'Branding', 'Layout', 'Color Theory'
  ],
  
  // Marketing & Communication
  'marketing': [
    'Marketing Digital', 'SEO', 'Google Analytics', 'Content Marketing', 'Social Media',
    'Email Marketing', 'Copywriting', 'Google Ads', 'Facebook Ads', 'Communication',
    'Analyse de données', 'Stratégie Marketing', 'CRM'
  ],
  'community': [
    'Social Media', 'Content Creation', 'Community Management', 'Copywriting',
    'Engagement', 'Analytics', 'Facebook', 'Instagram', 'LinkedIn', 'Twitter',
    'Communication', 'Créativité', 'Veille digitale'
  ],
  'communication': [
    'Communication', 'Relations Publiques', 'Rédaction', 'Événementiel',
    'Relations Presse', 'Storytelling', 'Présentation', 'Médias Sociaux', 'Créativité'
  ],
  
  // Commercial & Ventes
  'commercial': [
    'Vente', 'Négociation', 'Prospection', 'Relation Client', 'CRM', 'Salesforce',
    'Communication', 'Persuasion', 'Closing', 'Pipeline Management', 'Présentation',
    'Écoute active', 'Gestion du temps'
  ],
  'business': [
    'Business Development', 'Stratégie', 'Négociation', 'Analyse de marché',
    'Networking', 'Partenariats', 'Prospection', 'Présentation', 'CRM', 'Excel'
  ],
  
  // RH & Recrutement
  'rh': [
    'Recrutement', 'Gestion RH', 'Entretiens', 'Sourcing', 'LinkedIn Recruiter',
    'Évaluation', 'Onboarding', 'Droit du travail', 'Communication', 'Empathie',
    'Organisation', 'Confidentialité', 'ATS'
  ],
  'recrutement': [
    'Sourcing', 'Entretiens', 'Évaluation', 'LinkedIn', 'ATS', 'Talent Acquisition',
    'Screening', 'Négociation', 'Communication', 'Réseaux sociaux', 'Assessment'
  ],
  
  // Finance & Comptabilité
  'comptable': [
    'Comptabilité', 'Excel', 'Sage', 'Fiscalité', 'Bilan', 'Compte de résultat',
    'Déclarations fiscales', 'Rapprochement bancaire', 'Rigueur', 'Analyse financière'
  ],
  'finance': [
    'Analyse financière', 'Excel', 'Modélisation financière', 'Budget', 'Reporting',
    'Comptabilité', 'Investissement', 'Valorisation', 'Power BI', 'Rigueur'
  ],
  'audit': [
    'Audit', 'Contrôle interne', 'Comptabilité', 'Analyse de risques', 'Conformité',
    'Excel', 'Reporting', 'Normes IFRS', 'Rigueur', 'Esprit critique'
  ],
  
  // Gestion de Projet
  'projet': [
    'Gestion de projet', 'Agile', 'Scrum', 'JIRA', 'Planning', 'Budget',
    'Communication', 'Leadership', 'Coordination', 'Reporting', 'Risk Management',
    'MS Project', 'Gantt', 'Organisation'
  ],
  'product': [
    'Product Management', 'Roadmap', 'User Stories', 'Agile', 'Scrum', 'JIRA',
    'Analyse de données', 'UX', 'Priorisation', 'Communication', 'Stakeholder Management'
  ],
  
  // Support & Service Client
  'support': [
    'Service Client', 'Communication', 'Empathie', 'Résolution de problèmes',
    'Patience', 'Écoute active', 'CRM', 'Ticketing', 'Zendesk', 'Multitâche',
    'Gestion du stress', 'Connaissance produit'
  ],
  'customer': [
    'Relation Client', 'Communication', 'CRM', 'Satisfaction Client', 'Empathie',
    'Analyse', 'Reporting', 'Onboarding', 'Upselling', 'Retention', 'Écoute active'
  ],
  
  // Logistique & Supply Chain
  'logistique': [
    'Gestion de stock', 'Supply Chain', 'Transport', 'Planification', 'SAP',
    'Excel', 'Optimisation', 'Coordination', 'Négociation fournisseurs', 'Organisation'
  ],
  'achat': [
    'Achats', 'Négociation', 'Sourcing fournisseurs', 'Analyse de coûts', 'Excel',
    'SAP', 'Contrats', 'Supply Chain', 'Analyse de marché', 'Communication'
  ],
  
  // Management & Direction
  'manager': [
    'Leadership', 'Management', 'Communication', 'Stratégie', 'Prise de décision',
    'Coaching', 'Motivation d\'équipe', 'Gestion de conflits', 'Budget', 'Reporting',
    'Vision', 'Délégation', 'Performance Management'
  ],
  'directeur': [
    'Leadership', 'Stratégie', 'Vision', 'Prise de décision', 'Budget', 'P&L',
    'Management', 'Négociation', 'Communication', 'Analyse financière', 'Innovation',
    'Change Management', 'Stakeholder Management'
  ],
  
  // Juridique
  'juriste': [
    'Droit', 'Contrats', 'Conformité', 'Rédaction juridique', 'Négociation',
    'Veille juridique', 'Contentieux', 'Conseil juridique', 'Analyse', 'Rigueur'
  ],
  
  // Administratif
  'assistant': [
    'Organisation', 'Gestion d\'agenda', 'Communication', 'Excel', 'Word', 'PowerPoint',
    'Accueil', 'Téléphone', 'Classement', 'Multitâche', 'Discrétion', 'Rigueur'
  ],
  'office': [
    'Organisation', 'Gestion administrative', 'Budget', 'Coordination', 'Communication',
    'Excel', 'Gestion de fournisseurs', 'Événementiel', 'Multitâche', 'Proactivité'
  ],
  
  // Enseignement & Formation
  'formateur': [
    'Pédagogie', 'Communication', 'Présentation', 'Animation de groupe', 'Évaluation',
    'Conception de formation', 'Écoute active', 'Patience', 'Adaptabilité', 'PowerPoint'
  ],
  'enseignant': [
    'Pédagogie', 'Communication', 'Gestion de classe', 'Évaluation', 'Patience',
    'Créativité', 'Organisation', 'Empathie', 'Connaissance du sujet', 'Adaptabilité'
  ],
  
  // Santé
  'médical': [
    'Soins médicaux', 'Diagnostic', 'Empathie', 'Communication', 'Rigueur',
    'Gestion du stress', 'Travail d\'équipe', 'Éthique', 'Confidentialité', 'Dossier patient'
  ],
  'infirmier': [
    'Soins infirmiers', 'Empathie', 'Communication', 'Rigueur', 'Gestion du stress',
    'Travail d\'équipe', 'Organisation', 'Observation', 'Protocoles médicaux'
  ],
  
  // Ingénierie
  'ingénieur': [
    'Analyse technique', 'Problem Solving', 'CAO', 'Gestion de projet', 'Innovation',
    'Rigueur', 'Travail d\'équipe', 'Documentation technique', 'Tests', 'Optimisation'
  ],
  
  // Restauration & Hôtellerie
  'cuisine': [
    'Cuisine', 'Hygiène alimentaire', 'Gestion de stock', 'Créativité culinaire',
    'Travail d\'équipe', 'Gestion du stress', 'Organisation', 'HACCP', 'Service'
  ],
  'hôtellerie': [
    'Accueil', 'Service client', 'Communication', 'Langues étrangères', 'Organisation',
    'Gestion de réservations', 'Discrétion', 'Présentation', 'Multitâche', 'Empathie'
  ],
  
  // Pharmacie
  'pharmacie': [
    'Pharmacologie', 'Gestion de stock', 'Conseil client', 'Ordonnances', 'Médicaments',
    'Hygiène', 'Rigueur', 'Communication', 'Service client'
  ],
  
  // Restauration
  'chef': [
    'Cuisine', 'Pâtisserie', 'HACCP', 'Hygiène alimentaire', 'Gestion d\'équipe',
    'Créativité culinaire', 'Gestion de stock', 'Menu engineering', 'Leadership'
  ],
  'cuisinier': [
    'Cuisine', 'HACCP', 'Hygiène alimentaire', 'Travail d\'équipe', 'Gestion du stress',
    'Organisation', 'Créativité', 'Rapidité'
  ],
  'serveur': [
    'Service client', 'Communication', 'Mémorisation', 'Rapidité', 'Travail d\'équipe',
    'Gestion du stress', 'Présentation', 'Vente'
  ],
  
  // Hôtellerie
  'hôtel': [
    'Accueil clientèle', 'Réservation', 'Opera PMS', 'Communication', 'Langues étrangères',
    'Service client', 'Organisation', 'Discrétion', 'Présentation'
  ],
  
  // Ingénierie
  'civil': [
    'Génie civil', 'AutoCAD', 'Lecture de plans', 'Gestion de chantier', 'BTP',
    'Normes construction', 'Métrés', 'Devis', 'Sécurité chantier'
  ],
  'mécanique': [
    'Mécanique', 'CAO', 'Conception', 'Maintenance', 'Rigueur', 'Analyse technique',
    'Problem Solving', 'Innovation'
  ],
  
  // Banque & Assurance
  'banque': [
    'Conseil bancaire', 'Produits financiers', 'Analyse crédit', 'Relation client',
    'Vente', 'Négociation', 'Rigueur', 'Confidentialité', 'Excel'
  ],
  'assurance': [
    'Produits d\'assurance', 'Conseil client', 'Vente', 'Négociation', 'Analyse de risques',
    'Gestion de contrats', 'Communication', 'Rigueur'
  ],
  
  // Transport
  'chauffeur': [
    'Conduite', 'Permis de conduire', 'Code de la route', 'Orientation', 'Ponctualité',
    'Service client', 'Prudence', 'Gestion du stress'
  ],
  'livreur': [
    'Conduite', 'Orientation', 'Ponctualité', 'Organisation', 'Service client',
    'Gestion du temps', 'Rapidité'
  ],
  
  // Sécurité
  'agent': [
    'Surveillance', 'Prévention des risques', 'Premiers secours', 'Vigilance',
    'Gestion de crise', 'Communication', 'Rigueur', 'Discrétion'
  ],
  
  // Agriculture
  'agronome': [
    'Agronomie', 'Irrigation', 'Fertilisation', 'Cultures', 'Analyse de sol',
    'Gestion exploitation', 'Innovation', 'Développement rural'
  ],
  
  // Compétences génériques (fallback)
  'default': [
    'Communication', 'Travail d\'équipe', 'Organisation', 'Adaptabilité', 'Rigueur',
    'Autonomie', 'Gestion du temps', 'Problem Solving', 'Esprit d\'initiative', 'Créativité'
  ]
};

// Fonction pour obtenir les compétences suggérées en fonction du titre du poste
export const getSuggestedSkills = (jobTitle: string): string[] => {
  const lowerTitle = jobTitle.toLowerCase();
  
  // Chercher la catégorie qui correspond le mieux au titre
  for (const [category, skills] of Object.entries(skillsByJobCategory)) {
    if (lowerTitle.includes(category)) {
      return skills;
    }
  }
  
  // Si aucune correspondance, retourner les compétences par défaut
  return skillsByJobCategory.default;
};

// Fonction pour obtenir des compétences supplémentaires basées sur plusieurs mots-clés
export const getEnhancedSkillsSuggestions = (jobTitle: string): string[] => {
  const lowerTitle = jobTitle.toLowerCase();
  const allSuggestions = new Set<string>();
  
  // Ajouter les compétences de toutes les catégories qui matchent
  for (const [category, skills] of Object.entries(skillsByJobCategory)) {
    if (lowerTitle.includes(category)) {
      skills.forEach(skill => allSuggestions.add(skill));
    }
  }
  
  // Si on a trouvé des correspondances, retourner
  if (allSuggestions.size > 0) {
    return Array.from(allSuggestions);
  }
  
  // Sinon, retourner les compétences par défaut
  return skillsByJobCategory.default;
};
