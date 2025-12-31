import type { LanguageOddWordDataset } from '../types';

const travelSets = [
  {
    category_de: 'Reisen',
    category_en: 'Travel',
    options_de: ['Bahnhof', 'Gepäck', 'Pass', 'Besen'],
    options_en: ['Train station', 'Luggage', 'Passport', 'Broom'],
    answerIndex: 3,
  },
  {
    category_de: 'Unterwegs',
    category_en: 'On the move',
    options_de: ['Taxi', 'Bus', 'Rezept', 'Zug'],
    options_en: ['Taxi', 'Bus', 'Recipe', 'Train'],
    answerIndex: 2,
  },
  {
    category_de: 'Am Bahnhof',
    category_en: 'At the station',
    options_de: ['Koffer', 'Fensterplatz', 'Ticket', 'Suppenteller'],
    options_en: ['Suitcase', 'Window seat', 'Ticket', 'Soup bowl'],
    answerIndex: 3,
  },
  {
    category_de: 'Im Hotel',
    category_en: 'At the hotel',
    options_de: ['Hotel', 'Zimmer', 'Schlüsselkarte', 'Schraubenzieher'],
    options_en: ['Hotel', 'Room', 'Key card', 'Screwdriver'],
    answerIndex: 3,
  },
  {
    category_de: 'Am Flughafen',
    category_en: 'At the airport',
    options_de: ['Abflug', 'Landung', 'Startbahn', 'Gießkanne'],
    options_en: ['Departure', 'Landing', 'Runway', 'Watering can'],
    answerIndex: 3,
  },
  {
    category_de: 'Unterwegs',
    category_en: 'Navigation',
    options_de: ['Karte', 'Stadtplan', 'Kompass', 'Toaster'],
    options_en: ['Map', 'City map', 'Compass', 'Toaster'],
    answerIndex: 3,
  },
  {
    category_de: 'Boarding',
    category_en: 'Boarding',
    options_de: ['Bordkarte', 'Gate', 'Boarding', 'Backofen'],
    options_en: ['Boarding pass', 'Gate', 'Boarding', 'Oven'],
    answerIndex: 3,
  },
  {
    category_de: 'Sicherheit',
    category_en: 'Security',
    options_de: ['Sicherheitskontrolle', 'Flughafen', 'Check-in', 'Schneebesen'],
    options_en: ['Security check', 'Airport', 'Check-in', 'Whisk'],
    answerIndex: 3,
  },
  {
    category_de: 'Busfahrt',
    category_en: 'Bus ride',
    options_de: ['Busfahrt', 'Haltestelle', 'Fahrplan', 'Kissen'],
    options_en: ['Bus ride', 'Bus stop', 'Timetable', 'Pillow'],
    answerIndex: 3,
  },
  {
    category_de: 'Ausflug',
    category_en: 'Excursion',
    options_de: ['Reisegruppe', 'Ausflug', 'Museumsbesuch', 'Schraube'],
    options_en: ['Tour group', 'Excursion', 'Museum visit', 'Screw'],
    answerIndex: 3,
  },
];

const foodSets = [
  {
    category_de: 'Obst und Gemüse',
    category_en: 'Fruit and veg',
    options_de: ['Apfel', 'Banane', 'Karotte', 'Schlüssel'],
    options_en: ['Apple', 'Banana', 'Carrot', 'Key'],
    answerIndex: 3,
  },
  {
    category_de: 'Backwaren',
    category_en: 'Bakery',
    options_de: ['Brot', 'Brötchen', 'Erdbeere', 'Stein'],
    options_en: ['Bread', 'Bread roll', 'Strawberry', 'Stone'],
    answerIndex: 3,
  },
  {
    category_de: 'Milchprodukte',
    category_en: 'Dairy',
    options_de: ['Käse', 'Milch', 'Joghurt', 'Lampe'],
    options_en: ['Cheese', 'Milk', 'Yogurt', 'Lamp'],
    answerIndex: 3,
  },
  {
    category_de: 'Sättigungsbeilagen',
    category_en: 'Staples',
    options_de: ['Nudel', 'Reis', 'Kartoffel', 'Schuh'],
    options_en: ['Pasta', 'Rice', 'Potato', 'Shoe'],
    answerIndex: 3,
  },
  {
    category_de: 'Gemüse',
    category_en: 'Vegetables',
    options_de: ['Tomate', 'Gurke', 'Salat', 'Computer'],
    options_en: ['Tomato', 'Cucumber', 'Lettuce', 'Computer'],
    answerIndex: 3,
  },
  {
    category_de: 'Eiweiß',
    category_en: 'Protein',
    options_de: ['Fisch', 'Hähnchen', 'Steak', 'Handtuch'],
    options_en: ['Fish', 'Chicken', 'Steak', 'Towel'],
    answerIndex: 3,
  },
  {
    category_de: 'Gewürze',
    category_en: 'Spices',
    options_de: ['Pfeffer', 'Salz', 'Gewürz', 'Regenschirm'],
    options_en: ['Pepper', 'Salt', 'Spice', 'Umbrella'],
    answerIndex: 3,
  },
  {
    category_de: 'Süßes',
    category_en: 'Sweet treats',
    options_de: ['Kuchen', 'Torte', 'Muffin', 'Briefmarke'],
    options_en: ['Cake', 'Torte', 'Muffin', 'Stamp'],
    answerIndex: 3,
  },
  {
    category_de: 'Getränke',
    category_en: 'Drinks',
    options_de: ['Wasser', 'Saft', 'Tee', 'Ziegel'],
    options_en: ['Water', 'Juice', 'Tea', 'Brick'],
    answerIndex: 3,
  },
  {
    category_de: 'Nachspeisen',
    category_en: 'Desserts',
    options_de: ['Apfelstrudel', 'Pfannkuchen', 'Biskuit', 'Schraubenzieher'],
    options_en: ['Apple strudel', 'Pancake', 'Biscuit', 'Screwdriver'],
    answerIndex: 3,
  },
];

const homeSets = [
  {
    category_de: 'Wohnzimmer',
    category_en: 'Living room',
    options_de: ['Sofa', 'Tisch', 'Lampe', 'Banane'],
    options_en: ['Sofa', 'Table', 'Lamp', 'Banana'],
    answerIndex: 3,
  },
  {
    category_de: 'Schlafzimmer',
    category_en: 'Bedroom',
    options_de: ['Bett', 'Kissen', 'Decke', 'Fahrrad'],
    options_en: ['Bed', 'Pillow', 'Blanket', 'Bicycle'],
    answerIndex: 3,
  },
  {
    category_de: 'Schrank',
    category_en: 'Wardrobe',
    options_de: ['Schrank', 'Kommode', 'Kleiderschrank', 'Regenschirm'],
    options_en: ['Closet', 'Dresser', 'Wardrobe', 'Umbrella'],
    answerIndex: 3,
  },
  {
    category_de: 'Fenster',
    category_en: 'Windows',
    options_de: ['Fenster', 'Vorhang', 'Rollladen', 'Kartoffel'],
    options_en: ['Window', 'Curtain', 'Shutter', 'Potato'],
    answerIndex: 3,
  },
  {
    category_de: 'Treppenhaus',
    category_en: 'Stairs',
    options_de: ['Treppe', 'Geländer', 'Stufe', 'Apfelsine'],
    options_en: ['Stairs', 'Handrail', 'Step', 'Orange'],
    answerIndex: 3,
  },
  {
    category_de: 'Tür',
    category_en: 'Door',
    options_de: ['Tür', 'Klinke', 'Schloss', 'Mandarine'],
    options_en: ['Door', 'Handle', 'Lock', 'Mandarin'],
    answerIndex: 3,
  },
  {
    category_de: 'Bad',
    category_en: 'Bathroom',
    options_de: ['Badewanne', 'Waschbecken', 'Dusche', 'Paprika'],
    options_en: ['Bathtub', 'Sink', 'Shower', 'Bell pepper'],
    answerIndex: 3,
  },
  {
    category_de: 'Küche',
    category_en: 'Kitchen',
    options_de: ['Küche', 'Herd', 'Spüle', 'Giraffe'],
    options_en: ['Kitchen', 'Stove', 'Sink', 'Giraffe'],
    answerIndex: 3,
  },
  {
    category_de: 'Hausarbeit',
    category_en: 'Household',
    options_de: ['Bügeleisen', 'Wäschekorb', 'Waschmaschine', 'Zug'],
    options_en: ['Iron', 'Laundry basket', 'Washing machine', 'Train'],
    answerIndex: 3,
  },
  {
    category_de: 'Putzen',
    category_en: 'Cleaning',
    options_de: ['Staubsauger', 'Wischmopp', 'Eimer', 'Schokolade'],
    options_en: ['Vacuum cleaner', 'Mop', 'Bucket', 'Chocolate'],
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


