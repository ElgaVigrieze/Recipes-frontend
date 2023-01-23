import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {name: '', password: ''};

  constructor( private appService: AppService ) { }

  ngOnInit() { }

 login() {
      this.appService.login(this.credentials)
  }


}


