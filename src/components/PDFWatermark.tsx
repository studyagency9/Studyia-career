import React from 'react';
import { Text, View } from '@react-pdf/renderer';

interface WatermarkProps {
  text: string;
}

/**
 * Composant filigrane pour les PDF générés avec react-pdf
 */
const PDFWatermark: React.FC<WatermarkProps> = ({ text }) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        opacity: 0.2,
        transform: 'rotate(-45deg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 72,
          fontWeight: 'bold',
          color: '#666666',
          textAlign: 'center',
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export default PDFWatermark;
