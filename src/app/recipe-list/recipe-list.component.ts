import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../classes/recipe';
import { AppService } from '../services/app.service';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {
  recipes!: Recipe[];
  isLoggedIn = this.appService.authenticated;

  constructor(private recipeService: RecipeService, private router: Router, private appService: AppService){}

  ngOnInit(): void{
    this.getRecipes();
    console.log(this.appService.authenticated)
  }

  private getRecipes(){
    this.recipeService.getRecipeList().subscribe(data=>{
      this.recipes = data;
    })
  }

  updateRecipe(id: number){
    this.router.navigate(['update-recipe', id]);
  }

  viewRecipe(id: number){
    this.router.navigate(['recipes/', id]);
  }


  deleteRecipe(id: number){
    this.recipeService.deleteRecipe(id).subscribe(data => {
      console.log(data);
      this.getRecipes();
    })

  }

}
