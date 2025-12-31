import type { LanguageOddWordDataset } from '../types';

const travelSets = [
  {
    category_de: 'Reisen',
    category_en: 'Travel',
    options: ['Bahnhof', 'Gepäck', 'Pass', 'Besen'],
    answerIndex: 3,
  },
  {
    category_de: 'Unterwegs',
    category_en: 'On the move',
    options: ['Taxi', 'Bus', 'Rezept', 'Zug'],
    answerIndex: 2,
  },
  {
    category_de: 'Am Bahnhof',
    category_en: 'At the station',
    options: ['Koffer', 'Fensterplatz', 'Ticket', 'Suppenteller'],
    answerIndex: 3,
  },
  {
    category_de: 'Im Hotel',
    category_en: 'At the hotel',
    options: ['Hotel', 'Zimmer', 'Schlüsselkarte', 'Schraubenzieher'],
    answerIndex: 3,
  },
  {
    category_de: 'Am Flughafen',
    category_en: 'At the airport',
    options: ['Abflug', 'Landung', 'Startbahn', 'Gießkanne'],
    answerIndex: 3,
  },
  {
    category_de: 'Unterwegs',
    category_en: 'Navigation',
    options: ['Karte', 'Stadtplan', 'Kompass', 'Toaster'],
    answerIndex: 3,
  },
  {
    category_de: 'Boarding',
    category_en: 'Boarding',
    options: ['Bordkarte', 'Gate', 'Boarding', 'Backofen'],
    answerIndex: 3,
  },
  {
    category_de: 'Sicherheit',
    category_en: 'Security',
    options: ['Sicherheitskontrolle', 'Flughafen', 'Check-in', 'Schneebesen'],
    answerIndex: 3,
  },
  {
    category_de: 'Busfahrt',
    category_en: 'Bus ride',
    options: ['Busfahrt', 'Haltestelle', 'Fahrplan', 'Kissen'],
    answerIndex: 3,
  },
  {
    category_de: 'Ausflug',
    category_en: 'Excursion',
    options: ['Reisegruppe', 'Ausflug', 'Museumsbesuch', 'Schraube'],
    answerIndex: 3,
  },
];

const foodSets = [
  {
    category_de: 'Obst und Gemüse',
    category_en: 'Fruit and veg',
    options: ['Apfel', 'Banane', 'Karotte', 'Schlüssel'],
    answerIndex: 3,
  },
  {
    category_de: 'Backwaren',
    category_en: 'Bakery',
    options: ['Brot', 'Brötchen', 'Erdbeere', 'Stein'],
    answerIndex: 3,
  },
  {
    category_de: 'Milchprodukte',
    category_en: 'Dairy',
    options: ['Käse', 'Milch', 'Joghurt', 'Lampe'],
    answerIndex: 3,
  },
  {
    category_de: 'Sättigungsbeilagen',
    category_en: 'Staples',
    options: ['Nudel', 'Reis', 'Kartoffel', 'Schuh'],
    answerIndex: 3,
  },
  {
    category_de: 'Gemüse',
    category_en: 'Vegetables',
    options: ['Tomate', 'Gurke', 'Salat', 'Computer'],
    answerIndex: 3,
  },
  {
    category_de: 'Eiweiß',
    category_en: 'Protein',
    options: ['Fisch', 'Hähnchen', 'Steak', 'Handtuch'],
    answerIndex: 3,
  },
  {
    category_de: 'Gewürze',
    category_en: 'Spices',
    options: ['Pfeffer', 'Salz', 'Gewürz', 'Regenschirm'],
    answerIndex: 3,
  },
  {
    category_de: 'Süßes',
    category_en: 'Sweet treats',
    options: ['Kuchen', 'Torte', 'Muffin', 'Briefmarke'],
    answerIndex: 3,
  },
  {
    category_de: 'Getränke',
    category_en: 'Drinks',
    options: ['Wasser', 'Saft', 'Tee', 'Ziegel'],
    answerIndex: 3,
  },
  {
    category_de: 'Nachspeisen',
    category_en: 'Desserts',
    options: ['Apfelstrudel', 'Pfannkuchen', 'Biskuit', 'Schraubenzieher'],
    answerIndex: 3,
  },
];

const homeSets = [
  {
    category_de: 'Wohnzimmer',
    category_en: 'Living room',
    options: ['Sofa', 'Tisch', 'Lampe', 'Banane'],
    answerIndex: 3,
  },
  {
    category_de: 'Schlafzimmer',
    category_en: 'Bedroom',
    options: ['Bett', 'Kissen', 'Decke', 'Fahrrad'],
    answerIndex: 3,
  },
  {
    category_de: 'Schrank',
    category_en: 'Wardrobe',
    options: ['Schrank', 'Kommode', 'Kleiderschrank', 'Regenschirm'],
    answerIndex: 3,
  },
  {
    category_de: 'Fenster',
    category_en: 'Windows',
    options: ['Fenster', 'Vorhang', 'Rollladen', 'Kartoffel'],
    answerIndex: 3,
  },
  {
    category_de: 'Treppenhaus',
    category_en: 'Stairs',
    options: ['Treppe', 'Geländer', 'Stufe', 'Apfelsine'],
    answerIndex: 3,
  },
  {
    category_de: 'Tür',
    category_en: 'Door',
    options: ['Tür', 'Klinke', 'Schloss', 'Mandarine'],
    answerIndex: 3,
  },
  {
    category_de: 'Bad',
    category_en: 'Bathroom',
    options: ['Badewanne', 'Waschbecken', 'Dusche', 'Paprika'],
    answerIndex: 3,
  },
  {
    category_de: 'Küche',
    category_en: 'Kitchen',
    options: ['Küche', 'Herd', 'Spüle', 'Giraffe'],
    answerIndex: 3,
  },
  {
    category_de: 'Hausarbeit',
    category_en: 'Household',
    options: ['Bügeleisen', 'Wäschekorb', 'Waschmaschine', 'Zug'],
    answerIndex: 3,
  },
  {
    category_de: 'Putzen',
    category_en: 'Cleaning',
    options: ['Staubsauger', 'Wischmopp', 'Eimer', 'Schokolade'],
    answerIndex: 3,
  },
];

export const languageOddwordDatasets: Record<string, LanguageOddWordDataset> = {
  travel_odd: {
    puzzleType: 'language-oddword',
    datasetKey: 'travel_odd',
    sets: travelSets,
  },
  food_odd: {
    puzzleType: 'language-oddword',
    datasetKey: 'food_odd',
    sets: foodSets,
  },
  home_odd: {
    puzzleType: 'language-oddword',
    datasetKey: 'home_odd',
    sets: homeSets,
  },
  everyday_odd: {
    puzzleType: 'language-oddword',
    datasetKey: 'everyday_odd',
    sets: homeSets,
  },
};


