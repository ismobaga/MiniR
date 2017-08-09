import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

let apiUrl = 'http://cdi.x10.mx/api/';
@Injectable()
export class AuthService {

  constructor(public http: Http) {
    console.log('Hello AuthServiceProvider Provider');
  }

    postData(donnees, type) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(apiUrl + type, JSON.stringify(donnees), {headers: headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });

  }

  

}

