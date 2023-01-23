import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'Receptes';

  isLoggedIn = this.appService.authenticated;


   constructor(private appService: AppService, private router: Router, private http: HttpClient,private route: ActivatedRoute) {}

   ngOnInit() {
      this.router.events.subscribe(event => {
        if (event.constructor.name === "NavigationEnd") {
         this.isLoggedIn = this.appService.authenticated;
        }
      })
    
   }


}

