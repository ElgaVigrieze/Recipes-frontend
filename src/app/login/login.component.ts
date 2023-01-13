import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AppService } from '../services/app.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {name: '', password: ''};

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private http: HttpClient,
      private appService: AppService
  ) { }

  ngOnInit() { }

 login() {
      this.appService.login(this.credentials)
      this.router.navigateByUrl('/');
  }






}


