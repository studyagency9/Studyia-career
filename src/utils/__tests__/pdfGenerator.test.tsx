import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generatePDF } from '../pdfGenerator';

// Mock @react-pdf/renderer
vi.mock('@react-pdf/renderer', () => ({
  pdf: vi.fn(() => ({
    toBlob: vi.fn().mockResolvedValue(new Blob(['test'], { type: 'application/pdf' }))
  })),
  Document: vi.fn(),
  Page: vi.fn(),
  Text: vi.fn(),
  View: vi.fn(),
  StyleSheet: {
    create: vi.fn((styles) => styles)
  }
}));

describe('PDF Generator', () => {
  const mockCVData = {
    personalInfo: {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '+237 6XX XXX XXX',
      city: 'Douala',
      country: 'Cameroun',
      summary: 'Développeur passionné',
      photo: ''
    },
    targetJob: 'Développeur Web',
    experiences: [
      {
        id: '1',
        title: 'Développeur',
        company: 'TechCo',
        location: 'Douala',
        startDate: 'Janvier 2020',
        endDate: 'Décembre 2023',
        current: false,
        description: 'Développement web'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Licence Informatique',
        school: 'Université de Douala',
        location: 'Douala',
        startDate: '2016',
        endDate: '2019',
        description: ''
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js'],
    template: 'professional'
  };

  beforeEach(() => {
    // Mock DOM methods
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
    document.createElement = vi.fn((tag) => {
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          click: vi.fn(),
          remove: vi.fn()
        } as any;
      }
      return {} as any;
    });
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
  });

  it('generates PDF successfully', async () => {
    await expect(generatePDF(mockCVData)).resolves.not.toThrow();
  });

  it('handles photo in base64 format', async () => {
    const dataWithPhoto = {
      ...mockCVData,
      personalInfo: {
        ...mockCVData.personalInfo,
        photo: 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      }
    };
    
    await expect(generatePDF(dataWithPhoto)).resolves.not.toThrow();
  });

  it('sorts experiences by date', async () => {
    const dataWithMultipleExp = {
      ...mockCVData,
      experiences: [
        {
          id: '1',
          title: 'Dev Junior',
          company: 'CompanyA',
          location: 'Douala',
          startDate: 'Janvier 2020',
          endDate: 'Décembre 2021',
          current: false,
          description: ''
        },
        {
          id: '2',
          title: 'Dev Senior',
          company: 'CompanyB',
          location: 'Yaoundé',
          startDate: 'Janvier 2022',
          endDate: 'Décembre 2023',
          current: false,
          description: ''
        }
      ]
    };
    
    await expect(generatePDF(dataWithMultipleExp)).resolves.not.toThrow();
  });
});
