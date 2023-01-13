import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../classes/user';
import { AppService } from '../services/app.service';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user: User = new User();

  
  constructor(private router: Router, private fb: FormBuilder, 
    private appService: AppService){}


  newUser = this.fb.group({
    'name': ['', [Validators.required]],
    'email': ['', [Validators.required]],
    'password': ['', [Validators.required]],
  });

  signup(){
      this.user = Object.assign(this.user,this.newUser.value);
      this.appService.createUser(this.user).subscribe(  
      response => {  
          let result = response;   
          console.log(result); 
      },  
      error => {  
        console.log(error);  
      }  
    );  
    this.router.navigateByUrl('/login');
  }

}
