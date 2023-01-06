import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Recipe } from './classes/recipe';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeComponent } from './recipe/recipe.component';
import { UpdateRecipeComponent } from './update-recipe/update-recipe.component';
// import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {path: "recipes", component: RecipeListComponent},
  {path: "create-recipe", component: CreateRecipeComponent},
  // {path: "upload", component: UploadComponent},
  {path: "update-recipe/:id", component: UpdateRecipeComponent},
  {path: "", redirectTo: 'recipes', pathMatch: 'full'},
  {path: "recipes/:id", component: RecipeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
