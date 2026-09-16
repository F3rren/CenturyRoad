export type ProjectionType = 'mercator' | 'globe';

export interface Country {
  name: string;
  code: string; // ISO A2
}

export interface HistoricalEvent {
  id: string;
  title: string;
  year: number;
  month: number;
  day: number;
  countryCode: string;
  countryName: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  category: 'war' | 'politics' | 'science' | 'culture' | 'disaster' | 'economy';
  coordinates: [number, number];
}
