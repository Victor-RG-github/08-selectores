import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country, CountryInfo, Region } from '../interfaces/country.interface';
import { filter, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private _regions: Region[] = [
    Region.Africa,
    Region.Americas,
    Region.Asia,
    Region.Europe,
    Region.Oceania,
  ];

  private baseUrl: string = 'https://restcountries.com/v3.1';

  constructor(private http: HttpClient) {}

  get regions() {
    return [...this._regions];
  }

  getCountriesByRegion(region: Region): Observable<CountryInfo[]> {
    if (!region) {
      return of([]);
    }
    return this.http
      .get<Country[]>(
        `${this.baseUrl}/region/${region}?fields=cca3,name,borders`
      )
      .pipe(
        map((countries) =>
          countries.map((country) => ({
            name: country.name.common,
            cca3: country.cca3,
            borders: country.borders || [],
          }))
        )
      );
  }

  getBordersByCountry(cca3: string): Observable<CountryInfo[]> {
    if (!cca3) {
      return of([]);
    }
    return this.http
      .get<Country>(`${this.baseUrl}/alpha/${cca3}?fields=cca3,name,borders`)
      .pipe(
        map((country) => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders || [],
        })),
        filter((value) => (value.borders.length > 0 ? true : false)),
        switchMap((country) =>
          this.http.get<Country[]>(
            `${this.baseUrl}/alpha?codes=${country.borders.join(
              ','
            )}?fields=cca3,name,borders`
          )
        ),
        map((borders) =>
          borders.map((border) => ({
            name: border.name.common,
            cca3: border.cca3,
            borders: border.borders || [],
          }))
        )
      );
  }
}
