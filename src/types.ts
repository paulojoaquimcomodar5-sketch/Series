export type Language = 'pt' | 'ny' | 'en' | 'es';

export interface Movie {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  year: number;
  rating: number;
  image: string;
  cast: string[];
  category: string;
  trailerUrl?: string;
}

export interface TranslationStrings {
  title: string;
  subtitle: string;
  trending: string;
  blackPantherCast: string;
  allMovies: string;
  search: string;
  language: string;
  audioLanguage: string;
  details: string;
  cast: string;
  year: string;
  rating: string;
}
