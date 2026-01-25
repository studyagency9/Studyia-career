import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import PDFWatermark from './PDFWatermark';

// Fonction utilitaire pour traiter les images base64
const processImage = (photoUrl: string) => {
  try {
    // Si l'image est déjà au format base64, on la retourne telle quelle
    if (photoUrl && photoUrl.startsWith('data:image')) {
      return photoUrl;
    }
    // Sinon on retourne une chaîne vide
    return '';
  } catch (error) {
    console.error('Erreur lors du traitement de l\'image:', error);
    return '';
  }
};

// Fonction pour créer un composant d'image sécurisé
const SafeImage = ({ src, style }: { src: string, style: any }) => {
  try {
    if (!src || !src.startsWith('data:image')) {
      return null;
    }
    return <Image src={src} style={style} />;
  } catch (error) {
    console.error('Erreur lors du rendu de l\'image:', error);
    return null;
  }
};

// Types
interface PDFTranslations {
  profile: string;
  experience: string;
  education: string;
  skills: string;
  contact: string;
  languages: string;
  interests: string;
  present: string;
  start: string;
  end: string;
  yourName: string;
  jobTitle: string;
  degree: string;
  company: string;
}

interface PDFTemplateProps {
  data: CVData;
  showWatermark?: boolean;
}

interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    summary: string;
    photo: string;
  };
  targetJob: string;
  experiences: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  template: string;
  translations?: PDFTranslations;
  showWatermark?: boolean; // Nouveau paramètre pour contrôler l'affichage du filigrane
}

// Styles pour PDF - reproduisant fidèlement les templates web
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 0,
    fontFamily: 'Helvetica',
  },
  // Professional Template Styles
  professionalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  professionalHeader: {
    background: 'linear-gradient(to right, #3B82F6, #60A5FA)',
    backgroundColor: '#3B82F6',
    padding: 24,
    color: 'white',
  },
  professionalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  professionalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  professionalAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  professionalHeaderInfo: {
    flex: 1,
  },
  professionalFullName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'white',
  },
  professionalTargetJob: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
    color: 'white',
  },
  professionalLocation: {
    fontSize: 12,
    opacity: 0.6,
    color: 'white',
  },
  professionalBody: {
    padding: 24,
  },
  professionalContactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
    fontSize: 12,
    color: '#6B7280',
  },
  professionalContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  professionalSection: {
    marginBottom: 20,
  },
  professionalSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  professionalExperienceItem: {
    marginBottom: 12,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
    position: 'relative',
  },
  professionalExperienceDot: {
    position: 'absolute',
    left: -5,
    top: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  professionalExperienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  professionalExperienceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  professionalExperienceCompany: {
    fontSize: 10,
    color: '#3B82F6',
    marginBottom: 2,
  },
  professionalExperienceDates: {
    fontSize: 10,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    padding: '2 8',
    borderRadius: 4,
  },
  professionalExperienceDescription: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 1.4,
    marginTop: 8,
  },
  professionalSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  professionalSkillItem: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#3B82F6',
    padding: '4 8',
    borderRadius: 16,
    fontSize: 10,
  },
  professionalSummaryText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 1.5,
  },
});

// Template PDF Professional - Reproduction fidèle du template web
export const ProfessionalPDFTemplate = ({ data }: { data: CVData }) => {
  const { personalInfo, targetJob, experiences, education, skills, translations } = data;
  const t = translations || { profile: 'PROFIL', experience: 'EXPÉRIENCE PROFESSIONNELLE', education: 'FORMATION', skills: 'COMPÉTENCES', contact: 'Contact', present: 'Présent', start: 'Début', end: 'Fin', yourName: 'Votre Nom', jobTitle: 'Titre du poste', degree: 'Diplôme', company: 'Entreprise' };
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t.yourName;
  const initials = `${personalInfo.firstName[0] || "V"}${personalInfo.lastName[0] || "N"}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.professionalContainer}>
          {/* Header avec gradient bleu */}
          <View style={styles.professionalHeader}>
            <View style={styles.professionalHeaderContent}>
              {personalInfo.photo ? (
                <View style={styles.professionalAvatar}>
                  <SafeImage src={processImage(personalInfo.photo)} style={{width: '100%', height: '100%', borderRadius: 32}} />
                </View>
              ) : (
                <View style={styles.professionalAvatar}>
                  <Text style={styles.professionalAvatarText}>{initials}</Text>
                </View>
              )}
              <View style={styles.professionalHeaderInfo}>
                <Text style={styles.professionalFullName}>{fullName}</Text>
                {targetJob && <Text style={styles.professionalTargetJob}>{targetJob}</Text>}
                {(personalInfo.city || personalInfo.country) && (
                  <Text style={styles.professionalLocation}>
                    {[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.professionalBody}>
            {/* Contact */}
            {(personalInfo.email || personalInfo.phone) && (
              <View style={styles.professionalContactInfo}>
                {personalInfo.email && (
                  <View style={styles.professionalContactItem}>
                    <Text>{personalInfo.email}</Text>
                  </View>
                )}
                {personalInfo.phone && (
                  <View style={styles.professionalContactItem}>
                    <Text>{personalInfo.phone}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Summary */}
            {personalInfo.summary && (
              <View style={styles.professionalSection}>
                <Text style={styles.professionalSectionTitle}>{t.profile.toUpperCase()}</Text>
                <Text style={styles.professionalSummaryText}>{personalInfo.summary}</Text>
              </View>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <View style={styles.professionalSection}>
                <Text style={styles.professionalSectionTitle}>{t.experience.toUpperCase()}</Text>
                {experiences.map((exp) => (
                  <View key={exp.id} style={styles.professionalExperienceItem}>
                    <View style={styles.professionalExperienceDot} />
                    <View style={styles.professionalExperienceHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.professionalExperienceTitle}>{exp.title || t.jobTitle}</Text>
                        <Text style={styles.professionalExperienceCompany}>{exp.company || t.company}</Text>
                      </View>
                      <Text style={styles.professionalExperienceDates}>
                        {exp.startDate || t.start} - {exp.current ? t.present : exp.endDate || t.end}
                      </Text>
                    </View>
                    {exp.description && (
                      <View>
                        {exp.description.split('\n').map((line, i) => 
                          line.trim() ? (
                            <Text key={i} style={styles.professionalExperienceDescription}>
                              • {line}
                            </Text>
                          ) : <Text key={i}></Text>
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {education.length > 0 && (
              <View style={styles.professionalSection}>
                <Text style={styles.professionalSectionTitle}>{t.education.toUpperCase()}</Text>
                {education.map((edu) => (
                  <View key={edu.id} style={styles.professionalExperienceItem}>
                    <View style={styles.professionalExperienceDot} />
                    <View style={styles.professionalExperienceHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.professionalExperienceTitle}>{edu.degree || "Diplôme"}</Text>
                        <Text style={styles.professionalExperienceCompany}>{edu.school || "Établissement"}</Text>
                      </View>
                      <Text style={styles.professionalExperienceDates}>
                        {edu.startDate || "Début"} - {edu.endDate || "Fin"}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <View style={styles.professionalSection}>
                <Text style={styles.professionalSectionTitle}>{t.skills.toUpperCase()}</Text>
                <View style={styles.professionalSkillsContainer}>
                  {skills.map((skill) => (
                    <Text key={skill} style={styles.professionalSkillItem}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Template PDF Minimal - Version simplifiée
export const MinimalPDFTemplate = ({ data }: { data: CVData }) => {
  const { personalInfo, targetJob, experiences, education, skills, translations } = data;
  const t = translations || { profile: 'PROFIL', experience: 'EXPERIENCE', education: 'FORMATION', skills: 'COMPETENCES', contact: 'Contact', present: 'Présent', start: 'Début', end: 'Fin', yourName: 'Votre Nom', jobTitle: 'Titre du poste', degree: 'Diplôme', company: 'Entreprise' };
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t.yourName;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ padding: 30 }}>
          {/* Header centré */}
          <View style={{ textAlign: 'center', borderBottomWidth: 2, borderBottomColor: '#000000', paddingBottom: 20, marginBottom: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>{fullName}</Text>
            {targetJob && <Text style={{ fontSize: 14, marginTop: 4 }}>{targetJob}</Text>}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8, fontSize: 10 }}>
              {personalInfo.email && <Text>{personalInfo.email}</Text>}
              {personalInfo.phone && <Text> • {personalInfo.phone}</Text>}
              {(personalInfo.city || personalInfo.country) && (
                <Text> • {[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</Text>
              )}
            </View>
          </View>

          {/* Contenu */}
          {personalInfo.summary && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#000000', paddingBottom: 4, marginBottom: 8 }}>{t.profile.toUpperCase()}</Text>
              <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{personalInfo.summary}</Text>
            </View>
          )}

          {experiences.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#000000', paddingBottom: 4, marginBottom: 8 }}>{t.experience.toUpperCase()}</Text>
              {experiences.map((exp) => (
                <View key={exp.id} style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{exp.title}</Text>
                    <Text style={{ fontSize: 9, fontStyle: 'italic' }}>{exp.startDate || t.start} - {exp.current ? t.present : exp.endDate || t.end}</Text>
                  </View>
                  <Text style={{ fontSize: 9, marginBottom: 2 }}>{exp.company}</Text>
                  {exp.description && (
                    <View>
                      {exp.description.split('\n').map((line, i) => 
                        line.trim() ? <Text key={i} style={{ fontSize: 9, marginLeft: 10 }}>• {line}</Text> : <Text key={i}></Text>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {education.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#000000', paddingBottom: 4, marginBottom: 8 }}>{t.education.toUpperCase()}</Text>
              {education.map((edu) => (
                <View key={edu.id} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{edu.degree}</Text>
                    <Text style={{ fontSize: 9, fontStyle: 'italic' }}>{edu.startDate} - {edu.endDate}</Text>
                  </View>
                  <Text style={{ fontSize: 9 }}>{edu.school}</Text>
                </View>
              ))}
            </View>
          )}

          {skills.length > 0 && (
            <View>
              <Text style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#000000', paddingBottom: 4, marginBottom: 8 }}>{t.skills.toUpperCase()}</Text>
              <Text style={{ fontSize: 10 }}>{skills.join(' • ')}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

// Template PDF Creative - Reproduction exacte du template web
export const CreativePDFTemplate = ({ data }: { data: CVData }) => {
  const { personalInfo, targetJob, experiences, education, skills, translations } = data;
  const t = translations || { profile: 'PROFIL', experience: 'EXPÉRIENCE', education: 'FORMATION', skills: 'COMPÉTENCES', contact: 'Contact', present: 'Présent', start: 'Début', end: 'Fin', yourName: 'Votre Nom', jobTitle: 'Titre', degree: 'Diplôme', company: 'Entreprise' };
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t.yourName;
  const initials = `${personalInfo.firstName[0] || "V"}${personalInfo.lastName[0] || "N"}`;

  return (
    <Document>
      <Page size="A4" style={{ flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 0, fontFamily: 'Helvetica' }}>
        {/* Sidebar violet-rose exactement comme le web */}
        <View style={{ width: '33.333%', backgroundColor: '#9333EA', padding: 24, color: 'white' }}>
          {/* Header centré avec avatar */}
          <View style={{ textAlign: 'center', marginBottom: 24 }}>
            {personalInfo.photo ? (
              <View style={{ width: 80, height: 80, borderRadius: 40, overflow: 'hidden', marginBottom: 12, alignSelf: 'center' }}>
                <SafeImage src={processImage(personalInfo.photo)} style={{ width: '100%', height: '100%' }} />
              </View>
            ) : (
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, alignSelf: 'center' }}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>{initials}</Text>
              </View>
            )}
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>{fullName}</Text>
            {targetJob && <Text style={{ fontSize: 14, color: 'white', opacity: 0.8 }}>{targetJob}</Text>}
          </View>

          {/* Contact sans icônes pour éviter les problèmes d'affichage */}
          <View style={{ marginBottom: 24 }}>
            {personalInfo.email && (
              <Text style={{ fontSize: 10, color: 'white', opacity: 0.9, marginBottom: 8 }}>{personalInfo.email}</Text>
            )}
            {personalInfo.phone && (
              <Text style={{ fontSize: 10, color: 'white', opacity: 0.9, marginBottom: 8 }}>{personalInfo.phone}</Text>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <Text style={{ fontSize: 10, color: 'white', opacity: 0.9 }}>{[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</Text>
            )}
          </View>

          {/* Compétences */}
          {skills.length > 0 && (
            <View>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{t.skills.toUpperCase()}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                {skills.map((skill) => (
                  <Text key={skill} style={{ fontSize: 10, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '4 8', borderRadius: 4, marginBottom: 4 }}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Contenu principal - exactement comme le web */}
        <View style={{ width: '66.667%', padding: 24 }}>
          {/* À propos de moi */}
          {personalInfo.summary && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9333EA', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{t.profile.toUpperCase()}</Text>
              <Text style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>{personalInfo.summary}</Text>
            </View>
          )}

          {/* Expérience */}
          {experiences.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9333EA', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{t.experience.toUpperCase()}</Text>
              {experiences.map((exp) => (
                <View key={exp.id} style={{ marginBottom: 16, paddingLeft: 16, borderLeftWidth: 3, borderLeftColor: '#A855F7' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1F2937' }}>{exp.title || t.jobTitle}</Text>
                      <Text style={{ fontSize: 11, color: '#9333EA', marginBottom: 8 }}>{exp.company || t.company}</Text>
                    </View>
                    <Text style={{ fontSize: 9, color: '#6B7280', backgroundColor: '#F3F4F6', padding: '2 8', borderRadius: 4 }}>
                      {exp.startDate || t.start} - {exp.current ? t.present : exp.endDate || t.end}
                    </Text>
                  </View>
                  {exp.description && (
                    <View>
                      {exp.description.split('\n').map((line, i) => 
                        line.trim() ? (
                          <Text key={i} style={{ fontSize: 10, color: '#6B7280', marginBottom: 2 }}>
                            • {line}
                          </Text>
                        ) : <Text key={i}></Text>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Formation */}
          {education.length > 0 && (
            <View>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9333EA', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{t.education.toUpperCase()}</Text>
              {education.map((edu) => (
                <View key={edu.id} style={{ marginBottom: 12, paddingLeft: 16, borderLeftWidth: 3, borderLeftColor: '#A855F7' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1F2937' }}>{edu.degree || t.degree}</Text>
                      <Text style={{ fontSize: 11, color: '#9333EA' }}>{edu.school}</Text>
                    </View>
                    <Text style={{ fontSize: 9, color: '#6B7280' }}>
                      {edu.startDate || t.start} - {edu.endDate || t.end}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};


// Template PDF Modern - Design structuré
export const ModernPDFTemplate = ({ data }: { data: CVData }) => {
  const { personalInfo, targetJob, experiences, education, skills, translations } = data;
  const t = translations || { profile: 'PROFIL PROFESSIONNEL', experience: 'EXPÉRIENCE PROFESSIONNELLE', education: 'FORMATION', skills: 'COMPÉTENCES', contact: 'Contact', present: 'Présent', start: 'Début', end: 'Fin', yourName: 'Votre Nom', jobTitle: 'Titre', degree: 'Diplôme', company: 'Entreprise' };
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t.yourName;
  const initials = `${personalInfo.firstName[0] || "V"}${personalInfo.lastName[0] || "N"}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ padding: 30 }}>
          {/* Header Modern avec photo */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 25, marginBottom: 30, paddingBottom: 20, borderBottomWidth: 2, borderBottomColor: '#64748B' }}>
            {personalInfo.photo ? (
              <View style={{ width: 90, height: 90, borderRadius: 8, overflow: 'hidden' }}>
                <SafeImage src={processImage(personalInfo.photo)} style={{ width: '100%', height: '100%' }} />
              </View>
            ) : (
              <View style={{ width: 90, height: 90, borderRadius: 8, backgroundColor: '#64748B', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>{initials}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#1E293B', marginBottom: 6 }}>{fullName}</Text>
              {targetJob && <Text style={{ fontSize: 16, color: '#64748B', marginBottom: 10 }}>{targetJob}</Text>}
              <View style={{ flexDirection: 'row', gap: 15, fontSize: 11, color: '#475569' }}>
                {personalInfo.email && <Text>{personalInfo.email}</Text>}
                {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
                {(personalInfo.city || personalInfo.country) && (
                  <Text>{[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Contenu Modern en deux colonnes */}
          <View style={{ flexDirection: 'row', gap: 30 }}>
            {/* Colonne principale */}
            <View style={{ flex: 2 }}>
              {personalInfo.summary && (
                <View style={{ marginBottom: 25 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{t.profile.toUpperCase()}</Text>
                  <Text style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{personalInfo.summary}</Text>
                </View>
              )}

              {experiences.length > 0 && (
                <View style={{ marginBottom: 25 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 }}>{t.experience.toUpperCase()}</Text>
                  {experiences.map((exp) => (
                    <View key={exp.id} style={{ marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1E293B' }}>{exp.title}</Text>
                          <Text style={{ fontSize: 12, color: '#64748B', fontWeight: 'bold' }}>{exp.company}</Text>
                        </View>
                        <Text style={{ fontSize: 10, color: '#64748B', backgroundColor: '#F1F5F9', padding: '4 8', borderRadius: 4 }}>
                          {exp.startDate || t.start} - {exp.current ? t.present : exp.endDate || t.end}
                        </Text>
                      </View>
                      {exp.description && (
                        <View>
                          {exp.description.split('\n').map((line, i) => 
                            line.trim() ? <Text key={i} style={{ fontSize: 11, color: '#475569', marginBottom: 3 }}>• {line}</Text> : <Text key={i}></Text>
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Sidebar */}
            <View style={{ flex: 1 }}>
              {education.length > 0 && (
                <View style={{ marginBottom: 25 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1E293B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{t.education.toUpperCase()}</Text>
                  {education.map((edu) => (
                    <View key={edu.id} style={{ marginBottom: 15, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 6, borderLeftWidth: 3, borderLeftColor: '#64748B' }}>
                      <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 }}>{edu.degree}</Text>
                      <Text style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>{edu.school}</Text>
                      <Text style={{ fontSize: 9, color: '#64748B' }}>{edu.startDate} - {edu.endDate}</Text>
                    </View>
                  ))}
                </View>
              )}

              {skills.length > 0 && (
                <View>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1E293B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{t.skills.toUpperCase()}</Text>
                  <View style={{ flexDirection: 'column', gap: 6 }}>
                    {skills.map((skill) => (
                      <View key={skill} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#64748B', marginRight: 8 }} />
                        <Text style={{ fontSize: 10, color: '#475569' }}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};



// Template PDF Elegant - Design épuré et sophistiqué
export const ElegantPDFTemplate = ({ data }: { data: CVData }) => {
  const { personalInfo, targetJob, experiences, education, skills, translations } = data;
  const t = translations || { profile: 'Profil', experience: 'Expérience Professionnelle', education: 'Formation', skills: 'Compétences', contact: 'Contact', present: 'Présent', start: 'Début', end: 'Fin', yourName: 'Votre Nom', jobTitle: 'Titre', degree: 'Diplôme', company: 'Entreprise' };
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t.yourName;
  const initials = `${personalInfo.firstName[0] || "V"}${personalInfo.lastName[0] || "N"}`;

  return (
    <Document>
      <Page size="A4" style={{ backgroundColor: '#FFFFFF', padding: 0, fontFamily: 'Helvetica' }}>
        {/* Header avec nom et titre */}
        <View style={{ padding: 40, paddingBottom: 30, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            {personalInfo.photo ? (
              <View style={{ width: 100, height: 100, borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
                <SafeImage src={processImage(personalInfo.photo)} style={{ width: '100%', height: '100%' }} />
              </View>
            ) : (
              <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB' }}>
                <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#9CA3AF' }}>{initials}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 5, letterSpacing: 1 }}>{fullName}</Text>
              {targetJob && <Text style={{ fontSize: 14, color: '#4B5563', marginBottom: 10 }}>{targetJob}</Text>}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15 }}>
                {personalInfo.email && (
                  <Text style={{ fontSize: 10, color: '#6B7280' }}>{personalInfo.email}</Text>
                )}
                {personalInfo.phone && (
                  <Text style={{ fontSize: 10, color: '#6B7280' }}>{personalInfo.phone}</Text>
                )}
                {(personalInfo.city || personalInfo.country) && (
                  <Text style={{ fontSize: 10, color: '#6B7280' }}>
                    {[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Contenu principal */}
        <View style={{ padding: 40, paddingTop: 30 }}>
          {/* Résumé */}
          {personalInfo.summary && (
            <View style={{ marginBottom: 30 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{t.profile}</Text>
              <Text style={{ fontSize: 11, color: '#4B5563', lineHeight: 1.6 }}>{personalInfo.summary}</Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 20 }}>
            {/* Colonne principale */}
            <View style={{ width: '65%' }}>
              {/* Expériences */}
              {experiences.length > 0 && (
                <View style={{ marginBottom: 30 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 }}>{t.experience}</Text>
                  {experiences.map((exp) => (
                    <View key={exp.id} style={{ marginBottom: 20 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#1F2937', width: '55%' }}>{exp.title}</Text>
                        <Text style={{ fontSize: 9, color: '#6B7280', width: '45%', textAlign: 'right', flexShrink: 0 }}>
                          {exp.startDate || t.start} - {exp.current ? t.present : exp.endDate || t.end}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 11, color: '#4B5563', marginBottom: 5 }}>{exp.company}</Text>
                      {exp.description && (
                        <View>
                          {exp.description.split('\n').map((line, i) => 
                            line.trim() ? <Text key={i} style={{ fontSize: 10, color: '#6B7280', marginBottom: 2 }}>• {line}</Text> : <Text key={i}></Text>
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Formation */}
              {education.length > 0 && (
                <View>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 }}>{t.education}</Text>
                  {education.map((edu) => (
                    <View key={edu.id} style={{ marginBottom: 15 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1F2937', width: '55%' }}>{edu.degree}</Text>
                        <Text style={{ fontSize: 9, color: '#6B7280', width: '45%', textAlign: 'right' }}>
                          {edu.startDate} - {edu.endDate}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 11, color: '#4B5563' }}>{edu.school}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Colonne latérale */}
            <View style={{ width: '30%' }}>
              {/* Compétences */}
              {skills.length > 0 && (
                <View style={{ padding: 10, backgroundColor: '#F9FAFB', borderRadius: 5 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1F2937', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{t.skills}</Text>
                  <View style={{ gap: 3 }}>
                    {skills.map((skill) => (
                      <Text key={skill} style={{ fontSize: 8, color: '#4B5563', padding: 4, backgroundColor: '#F3F4F6', borderRadius: 3, marginBottom: 2 }}>
                        {skill}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Template PDF Bold - Design audacieux avec couleurs vives
export const BoldPDFTemplate = ({ data }: { data: CVData }) => {
  const { personalInfo, targetJob, experiences, education, skills, translations } = data;
  const t = translations || { profile: 'PROFIL', experience: 'EXPÉRIENCE', education: 'FORMATION', skills: 'COMPÉTENCES', contact: 'Contact', present: 'Présent', start: 'Début', end: 'Fin', yourName: 'Votre Nom', jobTitle: 'Titre', degree: 'Diplôme', company: 'Entreprise' };
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t.yourName;
  const initials = `${personalInfo.firstName[0] || "V"}${personalInfo.lastName[0] || "N"}`;

  return (
    <Document>
      <Page size="A4" style={{ backgroundColor: '#FFFFFF', padding: 0, fontFamily: 'Helvetica' }}>
        {/* Header avec couleur vive */}
        <View style={{ backgroundColor: '#FF4500', padding: '20 30', color: 'white' }} fixed>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            {personalInfo.photo ? (
              <View style={{ width: 70, height: 70, borderRadius: 35, overflow: 'hidden', borderWidth: 2, borderColor: 'white' }}>
                <SafeImage src={processImage(personalInfo.photo)} style={{ width: '100%', height: '100%' }} />
              </View>
            ) : (
              <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white' }}>
                <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>{initials}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>{fullName}</Text>
              {targetJob && <Text style={{ fontSize: 13, color: 'white', opacity: 0.9, marginBottom: 6 }}>{targetJob}</Text>}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {personalInfo.email && (
                  <Text style={{ fontSize: 9, color: 'white', opacity: 0.9 }}>{personalInfo.email}</Text>
                )}
                {personalInfo.phone && (
                  <Text style={{ fontSize: 9, color: 'white', opacity: 0.9 }}>{personalInfo.phone}</Text>
                )}
                {(personalInfo.city || personalInfo.country) && (
                  <Text style={{ fontSize: 9, color: 'white', opacity: 0.9 }}>
                    {[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Contenu principal */}
        <View style={{ padding: '15 30' }}>
          {/* Résumé */}
          {personalInfo.summary && (
            <View style={{ marginBottom: 15, backgroundColor: '#FAFAFA', padding: 12, borderRadius: 5, borderLeftWidth: 3, borderLeftColor: '#FF4500' }} wrap={false}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#333333', marginBottom: 6 }}>{t.profile.toUpperCase()}</Text>
              <Text style={{ fontSize: 10, color: '#555555', lineHeight: 1.4 }}>{personalInfo.summary}</Text>
            </View>
          )}

          {/* Expériences */}
          {experiences.length > 0 && (
            <View style={{ marginBottom: 15 }} wrap={false}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FF4500', marginBottom: 8, borderBottomWidth: 1.5, borderBottomColor: '#FF4500', paddingBottom: 2 }}>{t.experience.toUpperCase()}</Text>
              {experiences.map((exp) => (
                <View key={exp.id} style={{ marginBottom: 10, paddingLeft: 8, borderLeftWidth: 1.5, borderLeftColor: '#FF4500' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#333333', width: '60%' }}>{exp.title}</Text>
                    <Text style={{ fontSize: 9, color: '#666666', backgroundColor: '#F3F3F3', padding: '2 4', borderRadius: 3, width: '40%', textAlign: 'right' }}>
                      {exp.startDate || t.start} - {exp.current ? t.present : exp.endDate || t.end}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 10, color: '#FF4500', fontWeight: 'bold', marginBottom: 3 }}>{exp.company}</Text>
                  {exp.description && (
                    <View>
                      {exp.description.split('\n').map((line, i) => 
                        line.trim() && <Text key={i} style={{ fontSize: 9, color: '#555555', marginBottom: 1, lineHeight: 1.3 }}>• {line}</Text>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Formation */}
          {education.length > 0 && (
            <View style={{ marginBottom: 15 }} wrap={false}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FF4500', marginBottom: 8, borderBottomWidth: 1.5, borderBottomColor: '#FF4500', paddingBottom: 2 }}>{t.education.toUpperCase()}</Text>
              {education.map((edu) => (
                <View key={edu.id} style={{ marginBottom: 8, paddingLeft: 8, borderLeftWidth: 1.5, borderLeftColor: '#FF4500' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#333333', width: '60%' }}>{edu.degree}</Text>
                    <Text style={{ fontSize: 9, color: '#666666', width: '40%', textAlign: 'right' }}>
                      {edu.startDate} - {edu.endDate}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 10, color: '#FF4500', fontWeight: 'bold' }}>{edu.school}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Compétences */}
          {skills.length > 0 && (
            <View wrap={false}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FF4500', marginBottom: 8, borderBottomWidth: 1.5, borderBottomColor: '#FF4500', paddingBottom: 2 }}>{t.skills.toUpperCase()}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                {skills.map((skill) => (
                  <Text key={skill} style={{ fontSize: 9, color: 'white', backgroundColor: '#FF4500', padding: '2 5', borderRadius: 10, margin: 1 }}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

// Template PDF Gradient - Design moderne avec dégradés
export const GradientPDFTemplate = ({ data }: { data: CVData }) => {
  const { personalInfo, targetJob, experiences, education, skills, translations } = data;
  const t = translations || { profile: 'PROFIL', experience: 'EXPÉRIENCE', education: 'FORMATION', skills: 'COMPÉTENCES', contact: 'Contact', present: 'Présent', start: 'Début', end: 'Fin', yourName: 'Votre Nom', jobTitle: 'Titre', degree: 'Diplôme', company: 'Entreprise' };
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t.yourName;
  const initials = `${personalInfo.firstName[0] || "V"}${personalInfo.lastName[0] || "N"}`;

  return (
    <Document>
      <Page size="A4" style={{ backgroundColor: '#FFFFFF', padding: 0, fontFamily: 'Helvetica' }}>
        {/* Header avec dégradé */}
        <View style={{ backgroundColor: '#6366F1', padding: '20 30' }} fixed>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            {personalInfo.photo ? (
              <View style={{ width: 70, height: 70, borderRadius: 35, overflow: 'hidden', borderWidth: 2, borderColor: 'white' }}>
                <SafeImage src={processImage(personalInfo.photo)} style={{ width: '100%', height: '100%' }} />
              </View>
            ) : (
              <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white' }}>
                <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>{initials}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>{fullName}</Text>
              {targetJob && <Text style={{ fontSize: 13, color: 'white', opacity: 0.9, marginBottom: 6 }}>{targetJob}</Text>}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {personalInfo.email && <Text style={{ fontSize: 9, color: 'white', opacity: 0.9 }}>{personalInfo.email}</Text>}
                {personalInfo.phone && <Text style={{ fontSize: 9, color: 'white', opacity: 0.9 }}>{personalInfo.phone}</Text>}
                {(personalInfo.city || personalInfo.country) && (
                  <Text style={{ fontSize: 9, color: 'white', opacity: 0.9 }}>
                    {[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Contenu principal */}
        <View style={{ padding: '20 30' }}>
          {/* Résumé */}
          {personalInfo.summary && (
            <View style={{ marginBottom: 15 }} wrap={false}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#6366F1', marginBottom: 6 }}>{t.profile.toUpperCase()}</Text>
              <Text style={{ fontSize: 10, color: '#4B5563', lineHeight: 1.4 }}>{personalInfo.summary}</Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 20 }}>
            {/* Colonne principale */}
            <View style={{ width: '65%' }}>
              {/* Expériences */}
              {experiences.length > 0 && (
                <View style={{ marginBottom: 15 }} wrap={false}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#6366F1', marginBottom: 8 }}>{t.experience.toUpperCase()}</Text>
                  {experiences.map((exp) => (
                    <View key={exp.id} style={{ marginBottom: 10, padding: 8, backgroundColor: '#F9FAFB', borderRadius: 6, borderLeftWidth: 3, borderLeftColor: '#6366F1' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827', width: '60%' }}>{exp.title}</Text>
                        <Text style={{ fontSize: 9, color: '#6B7280', backgroundColor: '#EEF2FF', padding: '2 4', borderRadius: 4, width: '40%', textAlign: 'right' }}>
                          {exp.startDate || t.start} - {exp.current ? t.present : exp.endDate || t.end}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 10, color: '#6366F1', marginBottom: 3 }}>{exp.company}</Text>
                      {exp.description && (
                        <View>
                          {exp.description.split('\n').map((line, i) => 
                            line.trim() && <Text key={i} style={{ fontSize: 9, color: '#4B5563', marginBottom: 1, lineHeight: 1.3 }}>• {line}</Text>
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Formation */}
              {education.length > 0 && (
                <View wrap={false}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#6366F1', marginBottom: 8 }}>{t.education.toUpperCase()}</Text>
                  {education.map((edu) => (
                    <View key={edu.id} style={{ marginBottom: 8, padding: 8, backgroundColor: '#F9FAFB', borderRadius: 6, borderLeftWidth: 3, borderLeftColor: '#6366F1' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827', width: '60%' }}>{edu.degree}</Text>
                        <Text style={{ fontSize: 9, color: '#6B7280', width: '40%', textAlign: 'right' }}>
                          {edu.startDate} - {edu.endDate}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 10, color: '#6366F1' }}>{edu.school}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Colonne latérale */}
            <View style={{ width: '30%' }}>
              {/* Compétences */}
              {skills.length > 0 && (
                <View style={{ padding: 10, backgroundColor: '#EEF2FF', borderRadius: 6 }} wrap={false}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#6366F1', marginBottom: 6 }}>{t.skills.toUpperCase()}</Text>
                  <View style={{ gap: 4 }}>
                    {skills.map((skill) => (
                      <View key={skill} style={{ backgroundColor: 'white', padding: 5, borderRadius: 4, borderLeftWidth: 2, borderLeftColor: '#6366F1' }}>
                        <Text style={{ fontSize: 9, color: '#4B5563' }}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};


// Export des templates PDF
type PDFTemplateComponent = React.FC<PDFTemplateProps>;

// Template Stockholm (Modern Blue)  
const StockholmPDFTemplate: PDFTemplateComponent = ({ data, showWatermark = true }) => {
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const t = data.translations || {
    profile: 'Profile',
    experience: 'Professional Experience',
    education: 'Education',
    skills: 'Skills',
    contact: 'Contact',
    languages: 'Languages',
    interests: 'Interests',
    present: 'Present',
    start: 'Start',
    end: 'End',
    yourName: 'Your Name',
    jobTitle: 'Job Title',
    degree: 'Degree',
    company: 'Company',
  };

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || t.yourName;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Filigrane */}
        {showWatermark && <PDFWatermark text="STUDYIA CAREER" />}
        
        {/* Header */}
        <View style={{ backgroundColor: '#EFF6FF', padding: 30, alignItems: 'center', borderBottom: '4 solid #F1F5F9' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B', textTransform: 'uppercase', letterSpacing: 1 }}>{fullName}</Text>
          {targetJob && <Text style={{ fontSize: 12, color: '#3B82F6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{targetJob}</Text>}
        </View>

        <View style={{ flexDirection: 'row' }}>
          {/* Colonne Gauche (35%) */}
          <View style={{ width: '35%', padding: 20, paddingRight: 10, borderRight: '1 solid #F1F5F9' }}>
            
            {/* Contact */}
            {(personalInfo.email || personalInfo.phone || personalInfo.city || personalInfo.country) && (
              <View style={{ marginBottom: 25 }} wrap={false}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderBottom: '1 solid #BFDBFE', paddingBottom: 2 }}>
                  <View style={{ width: 4, height: 16, backgroundColor: '#BFDBFE', marginRight: 6, borderRadius: 2 }}></View>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.contact}</Text>
                </View>
                <View style={{ gap: 6 }}>
                  {personalInfo.phone && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{ width: 12, height: 12, backgroundColor: '#EFF6FF', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 6, color: '#3B82F6' }}>☎</Text>
                      </View>
                      <Text style={{ fontSize: 8, color: '#475569' }}>{personalInfo.phone}</Text>
                    </View>
                  )}
                  {personalInfo.email && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{ width: 12, height: 12, backgroundColor: '#EFF6FF', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 6, color: '#3B82F6' }}>✉</Text>
                      </View>
                      <Text style={{ fontSize: 8, color: '#475569' }}>{personalInfo.email}</Text>
                    </View>
                  )}
                  {(personalInfo.city || personalInfo.country) && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{ width: 12, height: 12, backgroundColor: '#EFF6FF', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 6, color: '#3B82F6' }}>⌂</Text>
                      </View>
                      <Text style={{ fontSize: 8, color: '#475569' }}>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Formation */}
            {education.length > 0 && (
              <View style={{ marginBottom: 25 }} wrap={false}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderBottom: '1 solid #BFDBFE', paddingBottom: 2 }}>
                  <View style={{ width: 4, height: 16, backgroundColor: '#BFDBFE', marginRight: 6, borderRadius: 2 }}></View>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.education}</Text>
                </View>
                <View style={{ gap: 12 }}>
                  {education.map((edu) => (
                    <View key={edu.id}>
                      <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#334155' }}>{edu.degree}</Text>
                      <Text style={{ fontSize: 8, fontStyle: 'italic', color: '#3B82F6', marginBottom: 2 }}>{edu.startDate || t.start} - {edu.endDate || t.end}</Text>
                      <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>{edu.school}</Text>
                      <Text style={{ fontSize: 7, color: '#64748B' }}>{edu.location}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Compétences */}
            {skills.length > 0 && (
              <View style={{ marginBottom: 25 }} wrap={false}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderBottom: '1 solid #BFDBFE', paddingBottom: 2 }}>
                  <View style={{ width: 4, height: 16, backgroundColor: '#BFDBFE', marginRight: 6, borderRadius: 2 }}></View>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.skills}</Text>
                </View>
                <View style={{ gap: 4 }}>
                  {skills.map((skill) => (
                    <View key={skill} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 4 }}>
                      <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#60A5FA', marginTop: 3 }}></View>
                      <Text style={{ fontSize: 8, color: '#475569' }}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Langues (Placeholder) */}
            <View style={{ marginBottom: 25 }} wrap={false}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderBottom: '1 solid #BFDBFE', paddingBottom: 2 }}>
                <View style={{ width: 4, height: 16, backgroundColor: '#BFDBFE', marginRight: 6, borderRadius: 2 }}></View>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {data.translations?.languages || (data.translations?.profile === 'Profile' ? 'LANGUAGES' : 'LANGUES')}
                </Text>
              </View>
              <View style={{ gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#60A5FA' }}></View>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#475569' }}>Français :</Text>
                  <Text style={{ fontSize: 8, color: '#475569' }}>Très Bien</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#60A5FA' }}></View>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#475569' }}>Anglais :</Text>
                  <Text style={{ fontSize: 8, color: '#475569' }}>Bien</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Colonne Droite (65%) */}
          <View style={{ width: '65%', padding: 20, paddingLeft: 15 }}>
            
            {/* Profil */}
            {personalInfo.summary && (
              <View style={{ marginBottom: 25 }} wrap={false}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderBottom: '1 solid #BFDBFE', paddingBottom: 2 }}>
                  <View style={{ width: 4, height: 16, backgroundColor: '#BFDBFE', marginRight: 6, borderRadius: 2 }}></View>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.profile}</Text>
                </View>
                <Text style={{ fontSize: 8, color: '#475569', textAlign: 'justify', lineHeight: 1.5 }}>
                  {personalInfo.summary}
                </Text>
              </View>
            )}

            {/* Expérience Professionnelle */}
            {experiences.length > 0 && (
              <View style={{ marginBottom: 25 }} wrap={false}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderBottom: '1 solid #BFDBFE', paddingBottom: 2 }}>
                  <View style={{ width: 4, height: 16, backgroundColor: '#BFDBFE', marginRight: 6, borderRadius: 2 }}></View>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.experience}</Text>
                </View>
                <View style={{ gap: 15 }}>
                  {experiences.map((exp) => (
                    <View key={exp.id}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                        <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', width: '60%' }}>{exp.title}</Text>
                        <View style={{ backgroundColor: '#EFF6FF', padding: '2 4', borderRadius: 2 }}>
                          <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#3B82F6', textTransform: 'uppercase' }}>
                            {exp.startDate || t.start} - {exp.current ? t.present : exp.endDate || t.end}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>
                        {exp.company} {exp.location && `- ${exp.location}`}
                      </Text>
                      
                      {exp.description && (
                        <View style={{ borderLeft: '1 solid #EFF6FF', paddingLeft: 6 }}>
                          {exp.description.split('\n').map((line, i) => (
                            line.trim() && (
                              <View key={i} style={{ flexDirection: 'row', marginBottom: 2 }}>
                                <Text style={{ fontSize: 8, color: '#60A5FA', marginRight: 4 }}>•</Text>
                                <Text style={{ fontSize: 8, color: '#475569' }}>{line.replace(/^[•-]\s*/, '')}</Text>
                              </View>
                            )
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Centres d'intérêt */}
            <View style={{ marginBottom: 25 }} wrap={false}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderBottom: '1 solid #BFDBFE', paddingBottom: 2 }}>
                <View style={{ width: 4, height: 16, backgroundColor: '#BFDBFE', marginRight: 6, borderRadius: 2 }}></View>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {data.translations?.interests || (data.translations?.profile === 'Profile' ? 'INTERESTS' : 'CENTRE D\'INTÉRÊT')}
                </Text>
              </View>
              <View style={{ gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#94A3B8' }}></View>
                  <Text style={{ fontSize: 8, color: '#475569' }}>Lecture</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#94A3B8' }}></View>
                  <Text style={{ fontSize: 8, color: '#475569' }}>Musique</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#94A3B8' }}></View>
                  <Text style={{ fontSize: 8, color: '#475569' }}>Voyage</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Wrapper pour chaque template qui accepte le paramètre showWatermark
const createTemplateWithWatermark = (Template: React.FC<{ data: CVData }>) => {
  const WrappedTemplate: PDFTemplateComponent = ({ data, showWatermark = true }) => {
    return <Template data={data} />;
  };
  return WrappedTemplate;
};

// Enregistrement des templates avec support du filigrane
export const pdfTemplateComponents: Record<string, PDFTemplateComponent> = {
  professional: createTemplateWithWatermark(ProfessionalPDFTemplate),
  creative: createTemplateWithWatermark(CreativePDFTemplate),
  minimal: createTemplateWithWatermark(MinimalPDFTemplate),
  modern: createTemplateWithWatermark(ModernPDFTemplate),
  elegant: createTemplateWithWatermark(ElegantPDFTemplate),
  bold: createTemplateWithWatermark(BoldPDFTemplate),
  gradient: createTemplateWithWatermark(GradientPDFTemplate),
  stockholm: StockholmPDFTemplate, // Ce template supporte déjà le filigrane
};
