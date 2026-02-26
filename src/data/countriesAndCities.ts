// Pays d'Afrique de l'Ouest et CEMAC avec leurs villes principales

export interface Country {
  code: string;
  name: string;
  cities: string[];
}

export const westAfricaAndCEMAC: Country[] = [
  // Afrique de l'Ouest
  {
    code: 'SN',
    name: 'Sénégal',
    cities: [
      'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Touba',
      'Mbour', 'Rufisque', 'Diourbel', 'Louga', 'Tambacounda', 'Kolda',
      'Richard-Toll', 'Matam', 'Sédhiou', 'Kédougou'
    ]
  },
  {
    code: 'CI',
    name: 'Côte d\'Ivoire',
    cities: [
      'Abidjan', 'Yamoussoukro', 'Bouaké', 'Daloa', 'San-Pédro', 'Korhogo',
      'Man', 'Gagnoa', 'Divo', 'Abengourou', 'Agboville', 'Grand-Bassam',
      'Dabou', 'Soubré', 'Bondoukou', 'Odienné'
    ]
  },
  {
    code: 'ML',
    name: 'Mali',
    cities: [
      'Bamako', 'Sikasso', 'Mopti', 'Koutiala', 'Kayes', 'Ségou', 'Gao',
      'Kati', 'Tombouctou', 'Koulikoro', 'San', 'Niono', 'Markala', 'Djenné'
    ]
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    cities: [
      'Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Ouahigouya', 'Banfora',
      'Dédougou', 'Kaya', 'Tenkodogo', 'Fada N\'Gourma', 'Houndé', 'Réo',
      'Gaoua', 'Ziniaré', 'Manga'
    ]
  },
  {
    code: 'NE',
    name: 'Niger',
    cities: [
      'Niamey', 'Zinder', 'Maradi', 'Agadez', 'Tahoua', 'Dosso', 'Diffa',
      'Tillabéri', 'Arlit', 'Nguigmi', 'Téra', 'Birni N\'Konni'
    ]
  },
  {
    code: 'GN',
    name: 'Guinée',
    cities: [
      'Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Labé', 'Mamou', 'Boké',
      'Siguiri', 'Kissidougou', 'Guéckédou', 'Macenta', 'Faranah', 'Dabola'
    ]
  },
  {
    code: 'BJ',
    name: 'Bénin',
    cities: [
      'Cotonou', 'Porto-Novo', 'Parakou', 'Djougou', 'Bohicon', 'Kandi',
      'Abomey', 'Natitingou', 'Lokossa', 'Ouidah', 'Savé', 'Malanville',
      'Pobé', 'Nikki'
    ]
  },
  {
    code: 'TG',
    name: 'Togo',
    cities: [
      'Lomé', 'Sokodé', 'Kara', 'Atakpamé', 'Kpalimé', 'Dapaong', 'Tsévié',
      'Aného', 'Bassar', 'Tabligbo', 'Vogan', 'Notsé', 'Mango'
    ]
  },
  {
    code: 'GH',
    name: 'Ghana',
    cities: [
      'Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 'Tema',
      'Sekondi', 'Sunyani', 'Koforidua', 'Ho', 'Wa', 'Bolgatanga', 'Techiman'
    ]
  },
  {
    code: 'LR',
    name: 'Liberia',
    cities: [
      'Monrovia', 'Gbarnga', 'Kakata', 'Bensonville', 'Harper', 'Voinjama',
      'Buchanan', 'Zwedru', 'New Yekepa', 'Ganta'
    ]
  },
  {
    code: 'SL',
    name: 'Sierra Leone',
    cities: [
      'Freetown', 'Bo', 'Kenema', 'Koidu', 'Makeni', 'Lunsar', 'Port Loko',
      'Waterloo', 'Kabala', 'Kailahun'
    ]
  },
  {
    code: 'GM',
    name: 'Gambie',
    cities: [
      'Banjul', 'Serekunda', 'Brikama', 'Bakau', 'Farafenni', 'Lamin',
      'Sukuta', 'Basse Santa Su', 'Gunjur'
    ]
  },
  {
    code: 'GW',
    name: 'Guinée-Bissau',
    cities: [
      'Bissau', 'Bafatá', 'Gabú', 'Bissorã', 'Bolama', 'Cacheu', 'Catió',
      'Canchungo', 'Farim'
    ]
  },
  {
    code: 'CV',
    name: 'Cap-Vert',
    cities: [
      'Praia', 'Mindelo', 'Santa Maria', 'Assomada', 'São Filipe', 'Pedra Badejo',
      'Tarrafal', 'Espargos', 'Porto Novo'
    ]
  },
  
  // CEMAC (Communauté Économique et Monétaire de l'Afrique Centrale)
  {
    code: 'CM',
    name: 'Cameroun',
    cities: [
      'Douala', 'Yaoundé', 'Garoua', 'Bamenda', 'Bafoussam', 'Maroua',
      'Ngaoundéré', 'Bertoua', 'Edéa', 'Loum', 'Kumba', 'Nkongsamba',
      'Buea', 'Limbé', 'Kribi', 'Ebolowa'
    ]
  },
  {
    code: 'GA',
    name: 'Gabon',
    cities: [
      'Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda', 'Mouila',
      'Lambaréné', 'Tchibanga', 'Koulamoutou', 'Makokou', 'Bitam'
    ]
  },
  {
    code: 'CG',
    name: 'Congo-Brazzaville',
    cities: [
      'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso', 'Owando',
      'Impfondo', 'Sibiti', 'Madingou', 'Kinkala', 'Gamboma'
    ]
  },
  {
    code: 'TD',
    name: 'Tchad',
    cities: [
      'N\'Djamena', 'Moundou', 'Sarh', 'Abéché', 'Kelo', 'Koumra', 'Pala',
      'Am Timan', 'Bongor', 'Mongo', 'Doba', 'Ati'
    ]
  },
  {
    code: 'CF',
    name: 'République Centrafricaine',
    cities: [
      'Bangui', 'Bimbo', 'Berbérati', 'Carnot', 'Bambari', 'Bouar', 'Bossangoa',
      'Bria', 'Bangassou', 'Nola', 'Kaga-Bandoro'
    ]
  },
  {
    code: 'GQ',
    name: 'Guinée Équatoriale',
    cities: [
      'Malabo', 'Bata', 'Ebebiyin', 'Aconibe', 'Añisoc', 'Luba', 'Evinayong',
      'Mongomo', 'Rebola'
    ]
  }
];

// Fonction pour obtenir les villes d'un pays
export const getCitiesByCountry = (countryName: string): string[] => {
  const country = westAfricaAndCEMAC.find(
    c => c.name.toLowerCase() === countryName.toLowerCase()
  );
  return country ? country.cities : [];
};

// Fonction pour obtenir tous les noms de pays
export const getAllCountryNames = (): string[] => {
  return westAfricaAndCEMAC.map(c => c.name);
};

// Fonction pour obtenir toutes les villes (pour la recherche globale)
export const getAllCities = (): string[] => {
  return westAfricaAndCEMAC.flatMap(c => c.cities);
};

// Fonction de recherche de villes avec filtre par pays
export const searchCities = (query: string, countryName?: string): string[] => {
  let cities: string[] = [];
  
  if (countryName) {
    cities = getCitiesByCountry(countryName);
  } else {
    cities = getAllCities();
  }
  
  if (!query) return cities.slice(0, 10);
  
  const lowerQuery = query.toLowerCase();
  return cities
    .filter(city => city.toLowerCase().includes(lowerQuery))
    .sort((a, b) => {
      const aIndex = a.toLowerCase().indexOf(lowerQuery);
      const bIndex = b.toLowerCase().indexOf(lowerQuery);
      return aIndex - bIndex;
    })
    .slice(0, 10);
};
