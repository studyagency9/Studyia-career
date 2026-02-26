// Liste exhaustive de postes avec mots-clés associés pour l'autocomplétion
export const jobTitles = [
  // Tech & IT
  { title: 'Développeur Full-Stack', keywords: ['dev', 'développeur', 'fullstack', 'full stack', 'web', 'programmeur'] },
  { title: 'Développeur Front-End', keywords: ['dev', 'frontend', 'front end', 'react', 'vue', 'angular', 'web'] },
  { title: 'Développeur Back-End', keywords: ['dev', 'backend', 'back end', 'node', 'python', 'java', 'api'] },
  { title: 'Développeur Mobile', keywords: ['dev', 'mobile', 'ios', 'android', 'react native', 'flutter'] },
  { title: 'Ingénieur DevOps', keywords: ['devops', 'ingénieur', 'cloud', 'aws', 'azure', 'kubernetes', 'docker'] },
  { title: 'Architecte Logiciel', keywords: ['architecte', 'software', 'système', 'technique'] },
  { title: 'Data Scientist', keywords: ['data', 'science', 'machine learning', 'ia', 'python', 'analyse'] },
  { title: 'Data Analyst', keywords: ['data', 'analyst', 'analyse', 'bi', 'tableau', 'power bi'] },
  { title: 'Ingénieur Data', keywords: ['data', 'engineer', 'ingénieur', 'etl', 'pipeline', 'big data'] },
  { title: 'Administrateur Système', keywords: ['admin', 'système', 'linux', 'windows', 'serveur', 'réseau'] },
  { title: 'Administrateur Réseau', keywords: ['admin', 'réseau', 'network', 'cisco', 'infrastructure'] },
  { title: 'Ingénieur Sécurité', keywords: ['sécurité', 'security', 'cybersecurity', 'pentest', 'firewall'] },
  { title: 'Chef de Projet IT', keywords: ['chef', 'projet', 'it', 'scrum', 'agile', 'manager'] },
  { title: 'Product Owner', keywords: ['product', 'owner', 'po', 'agile', 'scrum', 'backlog'] },
  { title: 'Scrum Master', keywords: ['scrum', 'master', 'agile', 'coach', 'sprint'] },
  { title: 'Testeur QA', keywords: ['qa', 'test', 'quality', 'qualité', 'automatisation'] },
  { title: 'Ingénieur QA', keywords: ['qa', 'quality', 'test', 'automatisation', 'selenium'] },
  
  // Design & Creative
  { title: 'Designer UX/UI', keywords: ['design', 'ux', 'ui', 'interface', 'figma', 'adobe'] },
  { title: 'Designer Graphique', keywords: ['design', 'graphique', 'graphic', 'photoshop', 'illustrator'] },
  { title: 'Designer Produit', keywords: ['design', 'product', 'produit', 'ux', 'interface'] },
  { title: 'Motion Designer', keywords: ['motion', 'animation', 'after effects', 'video', 'design'] },
  { title: 'Directeur Artistique', keywords: ['directeur', 'artistique', 'art', 'creative', 'design'] },
  { title: 'Infographiste', keywords: ['infographiste', 'graphic', 'design', 'print', 'web'] },
  
  // Marketing & Communication
  { title: 'Responsable Marketing', keywords: ['marketing', 'responsable', 'manager', 'stratégie', 'digital'] },
  { title: 'Chef de Projet Marketing', keywords: ['chef', 'projet', 'marketing', 'campagne', 'digital'] },
  { title: 'Community Manager', keywords: ['community', 'social', 'réseaux sociaux', 'content', 'manager'] },
  { title: 'Content Manager', keywords: ['content', 'contenu', 'rédaction', 'web', 'seo'] },
  { title: 'Responsable Communication', keywords: ['communication', 'responsable', 'com', 'relations', 'presse'] },
  { title: 'Chargé de Communication', keywords: ['chargé', 'communication', 'com', 'événementiel'] },
  { title: 'Traffic Manager', keywords: ['traffic', 'manager', 'digital', 'acquisition', 'ads'] },
  { title: 'Growth Hacker', keywords: ['growth', 'hacker', 'acquisition', 'marketing', 'startup'] },
  { title: 'SEO Manager', keywords: ['seo', 'référencement', 'google', 'search', 'web'] },
  { title: 'Social Media Manager', keywords: ['social', 'media', 'réseaux', 'sociaux', 'community'] },
  
  // Commercial & Ventes
  { title: 'Commercial', keywords: ['commercial', 'vente', 'sales', 'business', 'vendeur'] },
  { title: 'Responsable Commercial', keywords: ['responsable', 'commercial', 'vente', 'manager', 'sales'] },
  { title: 'Business Developer', keywords: ['business', 'developer', 'développement', 'commercial', 'vente'] },
  { title: 'Account Manager', keywords: ['account', 'manager', 'client', 'commercial', 'relation'] },
  { title: 'Chargé de Clientèle', keywords: ['chargé', 'clientèle', 'client', 'relation', 'service'] },
  { title: 'Ingénieur Commercial', keywords: ['ingénieur', 'commercial', 'technique', 'vente', 'b2b'] },
  { title: 'Directeur Commercial', keywords: ['directeur', 'commercial', 'vente', 'sales', 'stratégie'] },
  
  // RH & Recrutement
  { title: 'Responsable RH', keywords: ['rh', 'ressources humaines', 'hr', 'responsable', 'manager'] },
  { title: 'Chargé de Recrutement', keywords: ['recrutement', 'rh', 'talent', 'acquisition', 'hr'] },
  { title: 'Talent Acquisition', keywords: ['talent', 'acquisition', 'recrutement', 'rh', 'sourcing'] },
  { title: 'Gestionnaire de Paie', keywords: ['paie', 'rh', 'salaire', 'gestionnaire', 'social'] },
  { title: 'Responsable Formation', keywords: ['formation', 'rh', 'développement', 'compétences', 'learning'] },
  { title: 'HR Business Partner', keywords: ['hr', 'business', 'partner', 'rh', 'stratégie'] },
  
  // Finance & Comptabilité
  { title: 'Comptable', keywords: ['comptable', 'comptabilité', 'finance', 'gestion', 'sage'] },
  { title: 'Chef Comptable', keywords: ['chef', 'comptable', 'comptabilité', 'responsable', 'finance'] },
  { title: 'Contrôleur de Gestion', keywords: ['contrôleur', 'gestion', 'finance', 'budget', 'reporting'] },
  { title: 'Analyste Financier', keywords: ['analyste', 'financier', 'finance', 'analyse', 'investissement'] },
  { title: 'Directeur Financier', keywords: ['directeur', 'financier', 'cfo', 'finance', 'stratégie'] },
  { title: 'Auditeur', keywords: ['audit', 'auditeur', 'contrôle', 'finance', 'comptabilité'] },
  
  // Management & Direction
  { title: 'Chef de Projet', keywords: ['chef', 'projet', 'manager', 'gestion', 'coordination'] },
  { title: 'Directeur Général', keywords: ['directeur', 'général', 'ceo', 'direction', 'stratégie'] },
  { title: 'Directeur Opérationnel', keywords: ['directeur', 'opérationnel', 'coo', 'opérations', 'gestion'] },
  { title: 'Responsable d\'Équipe', keywords: ['responsable', 'équipe', 'manager', 'team', 'lead'] },
  { title: 'Chef de Service', keywords: ['chef', 'service', 'responsable', 'manager', 'département'] },
  
  // Support & Service Client
  { title: 'Chargé de Support', keywords: ['support', 'technique', 'client', 'assistance', 'helpdesk'] },
  { title: 'Customer Success Manager', keywords: ['customer', 'success', 'client', 'relation', 'satisfaction'] },
  { title: 'Responsable Service Client', keywords: ['service', 'client', 'responsable', 'support', 'relation'] },
  { title: 'Technicien Support', keywords: ['technicien', 'support', 'technique', 'helpdesk', 'it'] },
  
  // Logistique & Supply Chain
  { title: 'Responsable Logistique', keywords: ['logistique', 'supply', 'chain', 'transport', 'stock'] },
  { title: 'Gestionnaire de Stock', keywords: ['stock', 'inventaire', 'logistique', 'gestion', 'entrepôt'] },
  { title: 'Acheteur', keywords: ['achat', 'acheteur', 'procurement', 'fournisseur', 'négociation'] },
  { title: 'Responsable Supply Chain', keywords: ['supply', 'chain', 'logistique', 'flux', 'approvisionnement'] },
  
  // Juridique
  { title: 'Juriste', keywords: ['juriste', 'droit', 'legal', 'contrat', 'juridique'] },
  { title: 'Avocat', keywords: ['avocat', 'droit', 'legal', 'plaidoirie', 'contentieux'] },
  { title: 'Juriste d\'Entreprise', keywords: ['juriste', 'entreprise', 'corporate', 'droit', 'contrat'] },
  { title: 'Juriste Fiscaliste', keywords: ['juriste', 'fiscal', 'fiscalité', 'impôt', 'droit'] },
  
  // Administratif & Assistanat
  { title: 'Assistant de Direction', keywords: ['assistant', 'direction', 'secrétaire', 'administratif', 'gestion'] },
  { title: 'Secrétaire', keywords: ['secrétaire', 'administratif', 'accueil', 'bureau', 'gestion'] },
  { title: 'Office Manager', keywords: ['office', 'manager', 'administratif', 'gestion', 'bureau'] },
  { title: 'Réceptionniste', keywords: ['réceptionniste', 'accueil', 'standard', 'téléphone', 'front desk'] },
  { title: 'Assistant Administratif', keywords: ['assistant', 'administratif', 'bureau', 'gestion', 'support'] },
  
  // Conseil & Stratégie
  { title: 'Consultant', keywords: ['consultant', 'conseil', 'expertise', 'stratégie', 'advisory'] },
  { title: 'Consultant en Stratégie', keywords: ['consultant', 'stratégie', 'conseil', 'management', 'transformation'] },
  { title: 'Consultant IT', keywords: ['consultant', 'it', 'informatique', 'conseil', 'technique'] },
  { title: 'Business Analyst', keywords: ['business', 'analyst', 'analyse', 'processus', 'optimisation'] },
  
  // Santé & Médical
  { title: 'Médecin', keywords: ['médecin', 'docteur', 'santé', 'médical', 'soins'] },
  { title: 'Infirmier', keywords: ['infirmier', 'infirmière', 'santé', 'soins', 'médical'] },
  { title: 'Pharmacien', keywords: ['pharmacien', 'pharmacie', 'médicament', 'santé', 'ordonnance'] },
  { title: 'Sage-Femme', keywords: ['sage-femme', 'maternité', 'accouchement', 'santé', 'femme'] },
  { title: 'Kinésithérapeute', keywords: ['kiné', 'kinésithérapeute', 'rééducation', 'physiothérapie', 'santé'] },
  { title: 'Dentiste', keywords: ['dentiste', 'dentaire', 'orthodontie', 'santé', 'soins'] },
  
  // Enseignement & Formation
  { title: 'Professeur', keywords: ['professeur', 'enseignant', 'éducation', 'cours', 'pédagogie'] },
  { title: 'Formateur', keywords: ['formateur', 'formation', 'pédagogie', 'enseignement', 'coaching'] },
  { title: 'Enseignant', keywords: ['enseignant', 'professeur', 'éducation', 'école', 'cours'] },
  { title: 'Professeur de Langues', keywords: ['professeur', 'langues', 'enseignement', 'français', 'anglais'] },
  { title: 'Formateur Professionnel', keywords: ['formateur', 'professionnel', 'formation', 'adultes', 'compétences'] },
  
  // Restauration & Hôtellerie
  { title: 'Chef Cuisinier', keywords: ['chef', 'cuisinier', 'cuisine', 'restaurant', 'gastronomie'] },
  { title: 'Cuisinier', keywords: ['cuisinier', 'cuisine', 'restaurant', 'chef', 'plats'] },
  { title: 'Serveur', keywords: ['serveur', 'service', 'restaurant', 'bar', 'hôtellerie'] },
  { title: 'Barman', keywords: ['barman', 'bar', 'cocktails', 'boissons', 'service'] },
  { title: 'Directeur d\'Hôtel', keywords: ['directeur', 'hôtel', 'hôtellerie', 'management', 'tourisme'] },
  { title: 'Réceptionniste d\'Hôtel', keywords: ['réceptionniste', 'hôtel', 'accueil', 'réservation', 'tourisme'] },
  { title: 'Gouvernante', keywords: ['gouvernante', 'hôtel', 'ménage', 'entretien', 'hôtellerie'] },
  
  // Ingénierie & Technique
  { title: 'Ingénieur Civil', keywords: ['ingénieur', 'civil', 'btp', 'construction', 'génie civil'] },
  { title: 'Ingénieur Mécanique', keywords: ['ingénieur', 'mécanique', 'machines', 'conception', 'technique'] },
  { title: 'Ingénieur Électrique', keywords: ['ingénieur', 'électrique', 'électricité', 'énergie', 'technique'] },
  { title: 'Ingénieur Informatique', keywords: ['ingénieur', 'informatique', 'it', 'système', 'réseau'] },
  { title: 'Technicien', keywords: ['technicien', 'technique', 'maintenance', 'réparation', 'support'] },
  { title: 'Électricien', keywords: ['électricien', 'électricité', 'installation', 'câblage', 'technique'] },
  { title: 'Plombier', keywords: ['plombier', 'plomberie', 'installation', 'sanitaire', 'technique'] },
  
  // Production & Industrie
  { title: 'Responsable Production', keywords: ['responsable', 'production', 'usine', 'fabrication', 'industrie'] },
  { title: 'Chef d\'Atelier', keywords: ['chef', 'atelier', 'production', 'équipe', 'fabrication'] },
  { title: 'Opérateur de Production', keywords: ['opérateur', 'production', 'machine', 'fabrication', 'usine'] },
  { title: 'Contrôleur Qualité', keywords: ['contrôleur', 'qualité', 'inspection', 'norme', 'production'] },
  { title: 'Technicien de Maintenance', keywords: ['technicien', 'maintenance', 'réparation', 'machine', 'entretien'] },
  
  // Agriculture & Environnement
  { title: 'Agronome', keywords: ['agronome', 'agriculture', 'agronomie', 'culture', 'rural'] },
  { title: 'Ingénieur Agronome', keywords: ['ingénieur', 'agronome', 'agriculture', 'production', 'rural'] },
  { title: 'Responsable Environnement', keywords: ['responsable', 'environnement', 'écologie', 'durable', 'hse'] },
  { title: 'Technicien Agricole', keywords: ['technicien', 'agricole', 'agriculture', 'culture', 'exploitation'] },
  
  // Banque & Assurance
  { title: 'Conseiller Bancaire', keywords: ['conseiller', 'bancaire', 'banque', 'client', 'finance'] },
  { title: 'Chargé de Clientèle Banque', keywords: ['chargé', 'clientèle', 'banque', 'conseil', 'finance'] },
  { title: 'Analyste Crédit', keywords: ['analyste', 'crédit', 'banque', 'risque', 'finance'] },
  { title: 'Conseiller en Assurance', keywords: ['conseiller', 'assurance', 'contrat', 'client', 'vente'] },
  { title: 'Courtier en Assurance', keywords: ['courtier', 'assurance', 'contrat', 'négociation', 'vente'] },
  
  // Transport & Logistique
  { title: 'Chauffeur', keywords: ['chauffeur', 'conducteur', 'transport', 'véhicule', 'livraison'] },
  { title: 'Livreur', keywords: ['livreur', 'livraison', 'transport', 'colis', 'logistique'] },
  { title: 'Chauffeur Poids Lourd', keywords: ['chauffeur', 'poids lourd', 'camion', 'transport', 'permis'] },
  { title: 'Responsable Transport', keywords: ['responsable', 'transport', 'logistique', 'flotte', 'gestion'] },
  { title: 'Magasinier', keywords: ['magasinier', 'entrepôt', 'stock', 'logistique', 'manutention'] },
  
  // Sécurité
  { title: 'Agent de Sécurité', keywords: ['agent', 'sécurité', 'surveillance', 'gardiennage', 'protection'] },
  { title: 'Responsable Sécurité', keywords: ['responsable', 'sécurité', 'hse', 'prévention', 'risque'] },
  { title: 'Vigile', keywords: ['vigile', 'sécurité', 'surveillance', 'gardien', 'protection'] },
  
  // Autres métiers
  { title: 'Photographe', keywords: ['photographe', 'photo', 'image', 'shooting', 'créatif'] },
  { title: 'Journaliste', keywords: ['journaliste', 'presse', 'média', 'rédaction', 'information'] },
  { title: 'Traducteur', keywords: ['traducteur', 'traduction', 'langue', 'interprète', 'linguistique'] },
  { title: 'Architecte', keywords: ['architecte', 'architecture', 'conception', 'bâtiment', 'design'] },
  { title: 'Urbaniste', keywords: ['urbaniste', 'urbanisme', 'aménagement', 'ville', 'territoire'] },
];

// Liste exhaustive de compétences techniques et soft skills
export const skills = [
  // Langages de programmation
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Go', 'Rust',
  'Swift', 'Kotlin', 'Dart', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML', 'CSS', 'SASS',
  
  // Frameworks & Libraries Front-End
  'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'jQuery', 'Bootstrap',
  'Tailwind CSS', 'Material-UI', 'Ant Design', 'Chakra UI', 'Redux', 'MobX', 'Zustand',
  
  // Frameworks & Libraries Back-End
  'Node.js', 'Express.js', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'Laravel', 'Symfony', 'Ruby on Rails', 'ASP.NET', '.NET Core',
  
  // Mobile
  'React Native', 'Flutter', 'Ionic', 'Xamarin', 'SwiftUI', 'Android SDK',
  
  // Bases de données
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Oracle', 'SQL Server',
  'Firebase', 'Supabase', 'DynamoDB', 'Cassandra', 'Neo4j',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
  'GitHub Actions', 'Terraform', 'Ansible', 'CircleCI', 'Travis CI',
  
  // Data & AI
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn',
  'Pandas', 'NumPy', 'Jupyter', 'Power BI', 'Tableau', 'Apache Spark', 'Hadoop',
  
  // Design & Creative
  'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects',
  'Premiere Pro', 'Blender', 'Cinema 4D', 'UI Design', 'UX Research', 'Prototyping',
  'Design System', 'Wireframing', 'User Testing',
  
  // Marketing & Communication
  'SEO', 'SEM', 'Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'Google Analytics',
  'Content Marketing', 'Email Marketing', 'Social Media Marketing', 'Copywriting',
  'Marketing Automation', 'HubSpot', 'Mailchimp', 'Hootsuite', 'Buffer',
  
  // Gestion de projet
  'Agile', 'Scrum', 'Kanban', 'JIRA', 'Trello', 'Asana', 'Monday.com', 'Notion',
  'Confluence', 'MS Project', 'Gantt', 'Roadmapping',
  
  // Soft Skills
  'Leadership', 'Communication', 'Travail d\'équipe', 'Résolution de problèmes',
  'Pensée critique', 'Créativité', 'Adaptabilité', 'Gestion du temps',
  'Négociation', 'Présentation', 'Rédaction', 'Analyse', 'Organisation',
  'Autonomie', 'Esprit d\'initiative', 'Empathie', 'Écoute active',
  'Gestion du stress', 'Proactivité', 'Rigueur', 'Flexibilité', 'Patience',
  'Persuasion', 'Motivation', 'Esprit critique', 'Prise de décision',
  'Gestion de conflits', 'Intelligence émotionnelle', 'Assertivité',
  'Collaboration', 'Curiosité', 'Résilience', 'Diplomatie', 'Multitâche',
  
  // Langues
  'Français', 'Anglais', 'Espagnol', 'Allemand', 'Arabe', 'Chinois', 'Portugais',
  'Italien', 'Russe', 'Japonais', 'Wolof', 'Bambara', 'Peul', 'Lingala',
  'Swahili', 'Haoussa', 'Yoruba', 'Igbo', 'Akan', 'Mandingue',
  
  // Autres compétences techniques
  'Git', 'GitHub', 'GitLab', 'REST API', 'GraphQL', 'Microservices', 'CI/CD',
  'Testing', 'Jest', 'Cypress', 'Selenium', 'Unit Testing', 'Integration Testing',
  'Security', 'OWASP', 'Penetration Testing', 'Cryptography',
  'Blockchain', 'Web3', 'Smart Contracts', 'Solidity',
  
  // Business & Finance
  'Excel', 'PowerPoint', 'Word', 'SAP', 'Salesforce', 'CRM', 'ERP',
  'Comptabilité', 'Finance', 'Budget', 'Reporting', 'Audit',
  'QuickBooks', 'Sage Comptabilité', 'Ciel', 'Odoo', 'Zoho',
  
  // Compétences métiers spécifiques
  'Vente B2B', 'Vente B2C', 'Prospection téléphonique', 'Cold calling',
  'Account management', 'Customer retention', 'Upselling', 'Cross-selling',
  'Pipeline management', 'Lead generation', 'Closing', 'Forecasting',
  
  // RH & Recrutement
  'Talent acquisition', 'Screening CV', 'Conduite d\'entretien', 'Assessment',
  'Onboarding', 'Offboarding', 'SIRH', 'Paie', 'Formation', 'GPEC',
  'Droit du travail', 'Relations sociales', 'Marque employeur',
  
  // Marketing spécifique
  'Inbound marketing', 'Outbound marketing', 'Marketing automation',
  'Lead nurturing', 'A/B testing', 'Conversion optimization', 'Funnel marketing',
  'Retargeting', 'Affiliate marketing', 'Influencer marketing',
  'Brand management', 'Product marketing', 'Event marketing',
  
  // Logistique & Supply Chain
  'Gestion des stocks', 'Inventaire', 'WMS', 'TMS', 'Planification',
  'Approvisionnement', 'Distribution', 'Import-Export', 'Douane',
  'Incoterms', 'Gestion de flotte', 'Optimisation logistique',
  
  // Santé
  'Soins infirmiers', 'Diagnostic médical', 'Protocoles médicaux',
  'Hygiène hospitalière', 'Gestion dossier patient', 'Urgences',
  'Pharmacologie', 'Anatomie', 'Physiologie', 'Éthique médicale',
  
  // Juridique
  'Droit des affaires', 'Droit du travail', 'Droit fiscal', 'Droit pénal',
  'Rédaction de contrats', 'Contentieux', 'Veille juridique', 'Compliance',
  'RGPD', 'Propriété intellectuelle', 'Droit commercial',
  
  // Enseignement
  'Pédagogie', 'Didactique', 'Gestion de classe', 'Évaluation',
  'Conception pédagogique', 'E-learning', 'Animation de groupe',
  'Suivi individuel', 'Programmes scolaires',
  
  // Restauration
  'Cuisine française', 'Cuisine africaine', 'Pâtisserie', 'Boulangerie',
  'HACCP', 'Hygiène alimentaire', 'Gestion des stocks alimentaires',
  'Menu engineering', 'Food cost', 'Service en salle',
  
  // Hôtellerie & Tourisme
  'Accueil clientèle', 'Réservation', 'Front office', 'Back office',
  'Yield management', 'Opera PMS', 'Amadeus', 'Sabre',
  'Gestion hôtelière', 'Conciergerie', 'Housekeeping',
  
  // Construction & BTP
  'Lecture de plans', 'AutoCAD', 'Revit', 'SketchUp', 'BIM',
  'Gestion de chantier', 'Métrés', 'Devis', 'Planning travaux',
  'Normes construction', 'Sécurité chantier', 'VRD',
  
  // Agriculture
  'Agronomie', 'Irrigation', 'Fertilisation', 'Phytosanitaire',
  'Élevage', 'Cultures maraîchères', 'Arboriculture', 'Agroforesterie',
  'Mécanisation agricole', 'Gestion exploitation agricole',
  
  // Environnement
  'Gestion des déchets', 'Traitement des eaux', 'Énergies renouvelables',
  'Audit environnemental', 'ISO 14001', 'Bilan carbone', 'RSE',
  'Développement durable', 'Économie circulaire',
  
  // Sécurité
  'Prévention des risques', 'Sécurité incendie', 'Premiers secours',
  'SST', 'SSIAP', 'Vidéosurveillance', 'Contrôle d\'accès',
  'Gestion de crise', 'Plan de sécurité',
  
  // Compétences transversales
  'Gestion de projet', 'Planification', 'Coordination', 'Suivi budgétaire',
  'Reporting', 'Tableaux de bord', 'KPI', 'Amélioration continue',
  'Lean management', 'Six Sigma', 'Kaizen', ' 5S',
  'Change management', 'Conduite du changement',
];

// Villes principales d'Afrique de l'Ouest
export const cities = [
  // Sénégal
  'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Touba', 'Mbour', 'Rufisque',
  
  // Côte d'Ivoire
  'Abidjan', 'Yamoussoukro', 'Bouaké', 'Daloa', 'San-Pédro', 'Korhogo', 'Man',
  
  // Mali
  'Bamako', 'Sikasso', 'Mopti', 'Koutiala', 'Kayes', 'Ségou', 'Gao',
  
  // Burkina Faso
  'Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Ouahigouya', 'Banfora',
  
  // Niger
  'Niamey', 'Zinder', 'Maradi', 'Agadez', 'Tahoua', 'Dosso',
  
  // Guinée
  'Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Labé', 'Mamou',
  
  // Bénin
  'Cotonou', 'Porto-Novo', 'Parakou', 'Djougou', 'Bohicon', 'Kandi',
  
  // Togo
  'Lomé', 'Sokodé', 'Kara', 'Atakpamé', 'Kpalimé', 'Dapaong',
  
  // Cameroun
  'Douala', 'Yaoundé', 'Garoua', 'Bamenda', 'Bafoussam', 'Maroua', 'Ngaoundéré',
  
  // Ghana
  'Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 'Tema',
];

// Fonction de recherche floue pour l'autocomplétion
export const fuzzySearch = (query: string, items: string[]): string[] => {
  if (!query) return items.slice(0, 10);
  
  const lowerQuery = query.toLowerCase();
  
  return items
    .filter(item => item.toLowerCase().includes(lowerQuery))
    .sort((a, b) => {
      const aIndex = a.toLowerCase().indexOf(lowerQuery);
      const bIndex = b.toLowerCase().indexOf(lowerQuery);
      return aIndex - bIndex;
    })
    .slice(0, 10);
};

// Fonction de recherche pour les titres de poste avec mots-clés
export const searchJobTitles = (query: string): string[] => {
  if (!query) return jobTitles.slice(0, 10).map(j => j.title);
  
  const lowerQuery = query.toLowerCase();
  
  return jobTitles
    .filter(job => 
      job.title.toLowerCase().includes(lowerQuery) ||
      job.keywords.some(keyword => keyword.includes(lowerQuery))
    )
    .sort((a, b) => {
      const aExact = a.title.toLowerCase().startsWith(lowerQuery);
      const bExact = b.title.toLowerCase().startsWith(lowerQuery);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    })
    .slice(0, 10)
    .map(j => j.title);
};
