import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';

interface WatermarkedDocumentProps {
  children: React.ReactNode;
  showWatermark?: boolean;
}

/**
 * Composant Document avec filigrane pour les PDF
 * Le filigrane est affiché uniquement si showWatermark est true
 */
const WatermarkedDocument: React.FC<WatermarkedDocumentProps> = ({ 
  children, 
  showWatermark = true 
}) => {
  return (
    <Document>
      {children}
      {showWatermark && (
        <View style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          zIndex: 1000,
          opacity: 0.2,
          transform: 'rotate(-45deg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: '#666666',
            textAlign: 'center',
          }}>
            STUDYIA CAREER
          </Text>
        </View>
      )}
    </Document>
  );
};

export default WatermarkedDocument;
