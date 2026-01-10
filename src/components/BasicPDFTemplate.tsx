import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Types
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
}

/**
 * Modèle PDF Simple
 * 
 * Structure:
 * - En-tête: Nom, titre du poste, coordonnées
 * - Section résumé
 * - Section expérience
 * - Section formation
 * - Section compétences
 * 
 * Ce modèle est conçu pour être simple et garantir une cohérence à 100%
 * entre l'aperçu et l'export PDF final.
 */

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333333',
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 10,
    color: '#666666',
  },
  contactItem: {
    marginRight: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 5,
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#333333',
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: 10,
    color: '#666666',
  },
  itemSubtitle: {
    fontSize: 11,
    marginBottom: 3,
    color: '#333333',
  },
  itemDescription: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 1.4,
  },
  bulletPoint: {
    marginLeft: 10,
    marginBottom: 2,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    fontSize: 10,
    backgroundColor: '#F0F0F0',
    padding: '5 10',
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
});

// Composant principal du modèle
export const BasicPDFTemplate = ({ data }: { data: CVData }) => {
  const { personalInfo, targetJob, experiences, education, skills } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Votre Nom";
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête avec nom et coordonnées */}
        <View style={styles.header}>
          <Text style={styles.name}>{fullName}</Text>
          {targetJob && <Text style={styles.jobTitle}>{targetJob}</Text>}
          
          <View style={styles.contactInfo}>
            {personalInfo.email && (
              <Text style={styles.contactItem}>Email: {personalInfo.email}</Text>
            )}
            {personalInfo.phone && (
              <Text style={styles.contactItem}>Tél: {personalInfo.phone}</Text>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <Text style={styles.contactItem}>
                Lieu: {[personalInfo.city, personalInfo.country].filter(Boolean).join(", ")}
              </Text>
            )}
          </View>
        </View>

        {/* Section Résumé */}
        {personalInfo.summary && (
          <View>
            <Text style={styles.sectionTitle}>PROFIL</Text>
            <Text style={styles.summaryText}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Section Expérience */}
        {experiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>EXPÉRIENCE PROFESSIONNELLE</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.title || "Titre du poste"}</Text>
                  <Text style={styles.itemDate}>
                    {exp.startDate || "Début"} - {exp.current ? "Présent" : exp.endDate || "Fin"}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company || "Entreprise"}{exp.location ? `, ${exp.location}` : ''}</Text>
                {exp.description && (
                  <View>
                    {exp.description.split('\n').map((line, i) => 
                      line.trim() && (
                        <Text key={i} style={styles.bulletPoint}>
                          • {line}
                        </Text>
                      )
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Section Formation */}
        {education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>FORMATION</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree || "Diplôme"}</Text>
                  <Text style={styles.itemDate}>
                    {edu.startDate || "Début"} - {edu.endDate || "Fin"}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.school || "Établissement"}{edu.location ? `, ${edu.location}` : ''}</Text>
                {edu.description && (
                  <Text style={styles.itemDescription}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Section Compétences */}
        {skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>COMPÉTENCES</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <Text key={index} style={styles.skillItem}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default BasicPDFTemplate;
