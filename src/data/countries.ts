export const countries = [
  {
    code: 'CM',
    name: 'Cameroun',
    flag: '🇨🇲',
    cities: [
      'Yaoundé',
      'Douala',
      'Garoua',
      'Bamenda',
      'Bafoussam',
      'Maroua',
      'Ngaoundéré',
      'Bertoua',
      'Loum',
      'Kumba',
      'Nkongsamba',
      'Buea',
      'Limbé',
      'Edéa',
      'Kribi',
      'Dschang',
      'Ebolowa',
      'Sangmélima',
      'Mbalmayo',
      'Foumban',
    ]
  },
  {
    code: 'GA',
    name: 'Gabon',
    flag: '🇬🇦',
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
      'Ntoum',
      'Owendo',
      'Akanda',
      'Mounana',
      'Lastoursville',
      'Fougamou',
      'Ndendé',
      'Mayumba',
    ]
  },
  {
    code: 'GQ',
    name: 'Guinée Équatoriale',
    flag: '🇬🇶',
    cities: [
      'Malabo',
      'Bata',
      'Ebebiyin',
      'Aconibe',
      'Añisoc',
      'Luba',
      'Evinayong',
      'Mongomo',
      'Mengomeyén',
      'Mikomeseng',
      'Nsok',
      'Nsang',
      'Rebola',
      'Baney',
      'Corisco',
      'Santiago de Baney',
      'Pale',
      'Riaba',
      'San Antonio de Palé',
      'Mbini',
    ]
  },
];

export const getCountryByCode = (code: string) => {
  return countries.find(c => c.code === code);
};

export const getCitiesByCountry = (countryCode: string) => {
  const country = getCountryByCode(countryCode);
  return country?.cities || [];
};
