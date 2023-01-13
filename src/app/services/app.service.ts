import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/internal/operators/delay';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  authenticated = false;

  constructor(private http: HttpClient) { }

login(credentials) {
  console.log(credentials.name)
  let url = 'http://localhost:80/api/v1/login';
   this.http.post<Observable<boolean>>(url, {
    name: credentials.name,
    password: credentials.password
}).subscribe(isValid => {
    if (isValid) {
        sessionStorage.setItem(
          'token', btoa(credentials.username+ ':' + credentials.password)
        );
        this.authenticated = true;

    } else {
      this.authenticated = false;
        alert("Authentication failed.")
    }
});
}

createUser(user: User): Observable<Object>{
  return this.http.post('http://localhost:80/api/v1/signup', user);
}

}
