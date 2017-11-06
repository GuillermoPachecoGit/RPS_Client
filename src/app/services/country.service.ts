
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


import { Country } from '../components/register/country';


@Injectable()
export class CountryService{
    url = 'http://localhost:8080/initialization/get_countries';

 constructor(private http: Http){ }

   getCountry(): Observable<Country[]> {
    return this.http.get(this.url)
        .map( response => response.json() as Country[]);
    } 
    /*
    private handleErrorObservable (error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    } */

}