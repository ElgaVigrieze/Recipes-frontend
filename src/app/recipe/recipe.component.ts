import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Recipe } from '../classes/recipe';
import { Iblock } from '../classes/iblock';
import { RecipeService } from '../services/recipe.service';
import { Ingredient } from '../classes/ingredient';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageHandler } from '../handler/image.handler';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})


export class RecipeComponent implements OnInit {
  id!: number;
  recipe: Recipe = new Recipe();
  ingredients: Ingredient[];
  pic: any;

  constructor(private recipeService: RecipeService, private router: Router, private appService: AppService, 
    private route: ActivatedRoute, private sanitizer: DomSanitizer, 
    private imageHandler: ImageHandler){
  }


  ngOnInit(): void { 
    this.id = this.route.snapshot.params['id'];
    this.getRecipe(this.id);
  }

  private getRecipe(id: number){
    this.recipeService.getRecipeById(id).subscribe(data=>{
      this.recipe = data as Recipe;
      if(this.recipe.pic == this.imageHandler.defaultPic){
          this.pic = this.imageHandler.defaultPicPath;
      }else{
        this.pic = this.loadPic();
      }
      this.recipe.iblocks = data.iblocks as Iblock[];
    })
  }

  private loadPic(){
    this.recipeService.displayImage(this.id)
    .subscribe((blob : any) => {
      let objectURL = URL.createObjectURL(blob);       
      this.pic = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  }
}
