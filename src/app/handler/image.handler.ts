import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Recipe } from '../classes/recipe';

@Injectable({
    providedIn: 'root'
  })


  export class ImageHandler {
    public defaultPic = "restaurant.png";
    public defaultPicPath = "/assets/restaurant.png";

    constructor(private httpClient: HttpClient, private recipeService: RecipeService,
        private sanitizer: DomSanitizer) { }


    uploadImage(file: File, id: any){
        //   this.recipeService.uploadFile(this.currentFileUpload , result).subscribe( 
            this.recipeService.uploadFile(file , id).subscribe(   
            res => {  
              let re = res;  
               if(re > 0) {  
                  alert("file upload successful");  
               }  
               else{  
                  alert("error while uploading file");  
               }  
            },  
            err => {  
                alert("error while uploading file");  
            }  
        );  
    }

//     displayImage(recipe){
//         this.loadImage(recipe);

//         return this.logObserve()
        
//     }

//     pic=null;
//     loadImage(recipe){
//         console.log(recipe)
//         this.recipeService.displayImage(recipe.id).subscribe((blob : any) => {
//           let objectURL = URL.createObjectURL(blob);       
//          this.pic = this.sanitizer.bypassSecurityTrustUrl(objectURL);
//          console.log(this.pic)
//          this.logObserve();
//         });
//       }

// logObserve(){
//     console.log(this.pic)
//     return this.pic;
// }



}