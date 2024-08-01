import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { CountryInfo, Region } from '../../interfaces/country.interface';
import { filter, Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'countries-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``,
})
export class SelectorPageComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  countriesByRegion: CountryInfo[] = [];
  bordersByCountry: CountryInfo[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService
  ) {}

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }

  private onRegionChange(): void {
    this.form
      .get('region')!
      .valueChanges.pipe(
        tap(() => {
          this.form.get('country')?.setValue('');
          this.bordersByCountry = [];
        }),
        switchMap((region) =>
          this.countriesService.getCountriesByRegion(region)
        )
      )
      .subscribe((countries) => {
        this.countriesByRegion = countries;
      });
  }

  private onCountryChange(): void {
    this.form
      .get('country')!
      .valueChanges.pipe(
        tap(() => this.form.get('border')?.setValue('')),
        filter((value) => (value.length > 0 ? true : false)), // Esto impide que se ejecute si el valor de country viene vacio
        switchMap((country) =>
          this.countriesService.getBordersByCountry(country)
        )
      )
      .subscribe((borders) => {
        this.bordersByCountry = borders;
      });
  }
}
