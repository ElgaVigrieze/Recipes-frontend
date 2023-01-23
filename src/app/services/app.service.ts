import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/internal/operators/finalize';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  authenticated = false;
  authUser: User = null;

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials) {
    let url = 'http://localhost:80/api/v1/login';
     this.http.post(url, {
      name: credentials.name,
      password: credentials.password
  }).subscribe(result=> {
      if (result>0) {
          this.authenticated = true;
          this.getUserById(result);
          // this.router.navigate(['/recipes']);
      } else {
        this.authenticated = false;
          alert("Authentication failed.")
      }
  });
  }

  getUserById(id){
  this.http.get<User>(`http://localhost:80/api/v1/user/${id}`).pipe(
    finalize(() => {
      this.router.navigate(['/recipes']);
    })
  ).
  subscribe(result=> {
    this.authUser = result;
    console.log(this.authUser)
  });
  }


createUser(user: User): Observable<Object>{
  return this.http.post('http://localhost:80/api/v1/signup', user);
}


}
