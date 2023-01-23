import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/internal/operators/finalize';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  constructor(private appService : AppService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
      this.logout();
     this.router.navigate(['/']);
     console.log(this.appService.authenticated)
     
  }

  logout() {
          this.appService.authenticated = false;
          this.appService.authUser = null;
          this.router.navigateByUrl('/');
}

//   logout() {
//     this.http.post('http://localhost/api/v1/logout', {}).pipe(
//       finalize(() => {
//           this.appService.authenticated = false;
//           this.router.navigateByUrl('/');
//           console.log(this.appService.authenticated)
//       })).subscribe();

// }

}
