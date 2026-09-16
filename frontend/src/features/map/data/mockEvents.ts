import type { HistoricalEvent } from '../types';

export const MOCK_EVENTS: HistoricalEvent[] = [
  {
    id: '1', title: 'Assassinio di Francesco Ferdinando', year: 1914, month: 6, day: 28,
    countryCode: 'RS', countryName: 'Serbia',
    description: "L'assassinio dell'arciduca austriaco a Sarajevo scatena la Prima Guerra Mondiale.",
    importance: 'high', category: 'war', coordinates: [18.4131, 43.8563],
  },
  {
    id: '2', title: 'Rivoluzione d\'Ottobre', year: 1917, month: 11, day: 7,
    countryCode: 'RU', countryName: 'Russia',
    description: "I bolscevichi di Lenin prendono il potere, nasce la Russia sovietica.",
    importance: 'high', category: 'politics', coordinates: [30.3158, 59.9343],
  },
  {
    id: '3', title: 'Marcia su Roma', year: 1922, month: 10, day: 28,
    countryCode: 'IT', countryName: 'Italia',
    description: "Mussolini guida le camicie nere verso Roma; il re Vittorio Emanuele III lo nomina primo ministro.",
    importance: 'high', category: 'politics', coordinates: [12.4964, 41.9028],
  },
  {
    id: '4', title: 'Giovedì Nero – crollo di Wall Street', year: 1929, month: 10, day: 24,
    countryCode: 'US', countryName: 'USA',
    description: "Il crollo della borsa di New York innesca la Grande Depressione mondiale.",
    importance: 'high', category: 'economy', coordinates: [-74.006, 40.7128],
  },
  {
    id: '5', title: 'Hitler diventa Cancelliere', year: 1933, month: 1, day: 30,
    countryCode: 'DE', countryName: 'Germania',
    description: "Adolf Hitler è nominato Cancelliere della Repubblica di Weimar.",
    importance: 'high', category: 'politics', coordinates: [13.405, 52.52],
  },
  {
    id: '6', title: 'Invasione della Polonia', year: 1939, month: 9, day: 1,
    countryCode: 'PL', countryName: 'Polonia',
    description: "La Wehrmacht attraversa il confine polacco: inizia la Seconda Guerra Mondiale.",
    importance: 'high', category: 'war', coordinates: [21.0122, 52.2297],
  },
  {
    id: '7', title: 'Sbarco in Normandia', year: 1944, month: 6, day: 6,
    countryCode: 'FR', countryName: 'Francia',
    description: "Gli Alleati sbarcano in Normandia in quella che è la più grande operazione anfibia della storia.",
    importance: 'high', category: 'war', coordinates: [-0.3524, 49.2144],
  },
  {
    id: '8', title: 'Bomba atomica su Hiroshima', year: 1945, month: 8, day: 6,
    countryCode: 'JP', countryName: 'Giappone',
    description: "Il B-29 Enola Gay sgancia Little Boy su Hiroshima: 80.000 morti istantanei.",
    importance: 'high', category: 'war', coordinates: [132.4553, 34.3853],
  },
  {
    id: '9', title: 'Indipendenza dell\'India', year: 1947, month: 8, day: 15,
    countryCode: 'IN', countryName: 'India',
    description: "L'India ottiene l'indipendenza dal dominio britannico dopo decenni di lotta nonviolenta.",
    importance: 'high', category: 'politics', coordinates: [77.209, 28.6139],
  },
  {
    id: '10', title: 'Fondazione della Repubblica Popolare Cinese', year: 1949, month: 10, day: 1,
    countryCode: 'CN', countryName: 'Cina',
    description: "Mao Zedong proclama la Repubblica Popolare Cinese da piazza Tienanmen.",
    importance: 'high', category: 'politics', coordinates: [116.3912, 39.9042],
  },
  {
    id: '11', title: 'Crisi dei missili di Cuba', year: 1962, month: 10, day: 22,
    countryCode: 'CU', countryName: 'Cuba',
    description: "Kennedy annuncia il blocco navale: il mondo è sull'orlo della guerra nucleare.",
    importance: 'high', category: 'politics', coordinates: [-82.3666, 23.1136],
  },
  {
    id: '12', title: 'Assassinio di Kennedy', year: 1963, month: 11, day: 22,
    countryCode: 'US', countryName: 'USA',
    description: "Il presidente John F. Kennedy viene assassinato durante una visita a Dallas, Texas.",
    importance: 'high', category: 'politics', coordinates: [-96.797, 32.7767],
  },
  {
    id: '13', title: 'Apollo 11: primo uomo sulla Luna', year: 1969, month: 7, day: 20,
    countryCode: 'US', countryName: 'USA',
    description: "Neil Armstrong è il primo essere umano a camminare sulla Luna.",
    importance: 'high', category: 'science', coordinates: [-80.6077, 28.6024],
  },
  {
    id: '14', title: 'Fine della guerra del Vietnam', year: 1975, month: 4, day: 30,
    countryCode: 'VN', countryName: 'Vietnam',
    description: "La caduta di Saigon segna la fine della guerra; il Vietnam si riunifica sotto il governo comunista.",
    importance: 'high', category: 'war', coordinates: [106.6602, 10.8231],
  },
  {
    id: '15', title: 'Disastro di Chernobyl', year: 1986, month: 4, day: 26,
    countryCode: 'UA', countryName: 'Ucraina',
    description: "Il reattore n°4 della centrale esplode: il peggior incidente nucleare civile della storia.",
    importance: 'high', category: 'disaster', coordinates: [30.0972, 51.389],
  },
  {
    id: '16', title: 'Caduta del Muro di Berlino', year: 1989, month: 11, day: 9,
    countryCode: 'DE', countryName: 'Germania',
    description: "Il muro che divideva Berlino viene abbattuto; si apre la fine della Guerra Fredda.",
    importance: 'high', category: 'politics', coordinates: [13.3777, 52.5162],
  },
  {
    id: '17', title: 'Dissoluzione dell\'URSS', year: 1991, month: 12, day: 25,
    countryCode: 'RU', countryName: 'Russia',
    description: "Gorbaciov si dimette, l'URSS viene formalmente sciolta: nasce la Federazione Russa.",
    importance: 'high', category: 'politics', coordinates: [37.6173, 55.7558],
  },
  {
    id: '18', title: 'Mandela Presidente del Sudafrica', year: 1994, month: 5, day: 10,
    countryCode: 'ZA', countryName: 'Sudafrica',
    description: "Nelson Mandela è eletto presidente: fine ufficiale dell'apartheid.",
    importance: 'high', category: 'politics', coordinates: [25.7461, -28.6644],
  },
  {
    id: '19', title: 'Hong Kong torna alla Cina', year: 1997, month: 7, day: 1,
    countryCode: 'CN', countryName: 'Cina',
    description: "Il Regno Unito cede la sovranità di Hong Kong alla Repubblica Popolare Cinese.",
    importance: 'high', category: 'politics', coordinates: [114.1694, 22.3193],
  },
  {
    id: '20', title: 'Fondazione di Israele', year: 1948, month: 5, day: 14,
    countryCode: 'IL', countryName: 'Israele',
    description: "David Ben Gurion proclama la nascita dello Stato di Israele.",
    importance: 'high', category: 'politics', coordinates: [34.8516, 31.0461],
  },
  {
    id: '21', title: 'Prima Guerra del Golfo', year: 1991, month: 1, day: 17,
    countryCode: 'IQ', countryName: 'Iraq',
    description: "Operazione Desert Storm: la coalizione guidata dagli USA bombarda Baghdad.",
    importance: 'high', category: 'war', coordinates: [44.3661, 33.3152],
  },
  {
    id: '22', title: 'Massacro di Tiananmen', year: 1989, month: 6, day: 4,
    countryCode: 'CN', countryName: 'Cina',
    description: "L'esercito cinese reprime le proteste studentesche a Piazza Tienanmen.",
    importance: 'high', category: 'politics', coordinates: [116.3912, 39.9042],
  },
  {
    id: '23', title: 'Armistizio della Prima Guerra Mondiale', year: 1918, month: 11, day: 11,
    countryCode: 'FR', countryName: 'Francia',
    description: "Alle 11:00 dell'11 novembre il cessate-il-fuoco pone fine alla Grande Guerra.",
    importance: 'high', category: 'war', coordinates: [2.3522, 48.8566],
  },
  {
    id: '24', title: 'Gandhi assassinato', year: 1948, month: 1, day: 30,
    countryCode: 'IN', countryName: 'India',
    description: "Mohandas Gandhi viene ucciso a New Delhi da un estremista indù.",
    importance: 'high', category: 'politics', coordinates: [77.209, 28.6139],
  },

  // ── 30 maggio – eventi per il demo della heatmap ─────────────────────────
  {
    id: '25', title: 'Inaugurazione del Lincoln Memorial', year: 1922, month: 5, day: 30,
    countryCode: 'US', countryName: 'USA',
    description: 'Il Lincoln Memorial di Washington D.C. viene inaugurato alla presenza di migliaia di persone.',
    importance: 'high', category: 'culture', coordinates: [-77.0502, 38.8893],
  },
  {
    id: '26', title: 'Lancio della sonda Mariner 9', year: 1971, month: 5, day: 30,
    countryCode: 'US', countryName: 'USA',
    description: 'La NASA lancia Mariner 9, prima sonda a orbitare attorno a Marte.',
    importance: 'high', category: 'science', coordinates: [-80.6077, 28.6024],
  },
  {
    id: '27', title: 'Dust Bowl – La grande tempesta di polvere', year: 1934, month: 5, day: 30,
    countryCode: 'US', countryName: 'USA',
    description: 'Una delle più devastanti tempeste di polvere della storia travolge le Grandi Pianure americane.',
    importance: 'high', category: 'disaster', coordinates: [-99.0, 35.5],
  },
  {
    id: '28', title: 'Dichiarazione di indipendenza del Biafra', year: 1967, month: 5, day: 30,
    countryCode: 'NG', countryName: 'Nigeria',
    description: 'Il colonnello Ojukwu proclama la Repubblica del Biafra, dando inizio alla sanguinosa guerra civile nigeriana.',
    importance: 'high', category: 'war', coordinates: [7.4913, 5.0510],
  },
];
