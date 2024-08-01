export enum Region {
  Africa = 'Africa',
  Americas = 'Americas',
  Asia = 'Asia',
  Europe = 'Europe',
  Oceania = 'Oceania',
}

export interface CountryInfo {
  name: string;
  cca3: string;
  borders: string[];
}

export interface Country {
  name: Name;
  cca3: string;
  region: string;
  borders: string[];
}

export interface Name {
  common: string;
  official: string;
  nativeName: { [key: string]: Translation };
}

export interface Translation {
  official: string;
  common: string;
}
