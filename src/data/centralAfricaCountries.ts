// Pays d'Afrique Centrale et leurs villes principales
export const centralAfricaCountries = [
  {
    code: 'CM',
    name: 'Cameroun',
    nameEn: 'Cameroon',
    cities: [
      'Yaoundé',
      'Douala',
      'Garoua',
      'Bafoussam',
      'Bamenda',
      'Maroua',
      'Ngaoundéré',
      'Bertoua',
      'Ebolowa',
      'Kribi',
      'Limbé',
      'Buea',
      'Kumba',
      'Nkongsamba',
      'Edéa',
    ],
  },
  {
    code: 'GA',
    name: 'Gabon',
    nameEn: 'Gabon',
    cities: [
      'Libreville',
      'Port-Gentil',
      'Franceville',
      'Oyem',
      'Moanda',
      'Mouila',
      'Lambaréné',
      'Tchibanga',
      'Koulamoutou',
      'Makokou',
      'Bitam',
      'Gamba',
    ],
  },
  {
    code: 'GQ',
    name: 'Guinée Équatoriale',
    nameEn: 'Equatorial Guinea',
    cities: [
      'Malabo',
      'Bata',
      'Ebebiyin',
      'Aconibe',
      'Añisoc',
      'Luba',
      'Evinayong',
      'Mongomo',
      'Nsok',
      'Mikomeseng',
    ],
  },
  {
    code: 'SN',
    name: 'Sénégal',
    nameEn: 'Senegal',
    cities: [
      'Dakar',
      'Thiès',
      'Kaolack',
      'Saint-Louis',
      'Ziguinchor',
      'Diourbel',
      'Louga',
      'Tambacounda',
      'Mbour',
      'Rufisque',
      'Kolda',
      'Matam',
      'Kédougou',
      'Sédhiou',
      'Touba',
    ],
  },
];

export const getCitiesByCountryCode = (countryCode: string): string[] => {
  const country = centralAfricaCountries.find(c => c.code === countryCode);
  return country ? country.cities : [];
};

export const getCountryName = (countryCode: string, language: 'fr' | 'en' = 'fr'): string => {
  const country = centralAfricaCountries.find(c => c.code === countryCode);
  if (!country) return countryCode;
  return language === 'en' ? country.nameEn : country.name;
};
