import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Recipe } from '../classes/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private baseUrl='http://localhost/api/v1/recipes';

  constructor(private httpClient: HttpClient) { }

  getRecipeList(): Observable<Recipe[]>{
    return this.httpClient.get<Recipe[]>(`${this.baseUrl}`)
  }

  createRecipe(recipe: Recipe): Observable<Object>{
    return this.httpClient.post(`${this.baseUrl}`, recipe);
  }

  uploadFile( file: File , id : any) : Observable<any> {  
    let url = this.baseUrl + "/uploadImage/" + id ;  
    const formdata: FormData = new FormData();  
    formdata.append('file', file);  
    return this.httpClient.post(url , formdata);  
  }  

  setDefaultPic(id){
    console.log("default pic funkcija javascriptā")
    return this.httpClient.get(`${this.baseUrl}/defaultPic/${id}`, id);  
  }


  getRecipeById(id: number): Observable<Recipe>{
    return this.httpClient.get<Recipe>(`${this.baseUrl}/${id}`);
  }

  updateRecipe(recipe: Recipe, id: number): Observable<Object>{
    return this.httpClient.put(`${this.baseUrl}/${id}`, recipe);
  }

  deleteRecipe(id: number): Observable<Object>{
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

 displayImage(id: number){
  return this.httpClient.get(`${this.baseUrl}/imageDisplay/${id}`,
  {
    responseType: "blob",
});
}
 

}