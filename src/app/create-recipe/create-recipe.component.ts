import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlMatchResult } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { Iblock } from '../classes/iblock';
import { Recipe } from '../classes/recipe';
import { Unit } from '../enum/unit';
import { RecipeService } from '../services/recipe.service';
import { ImageHandler } from '../handler/image.handler';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css']
})

export class CreateRecipeComponent implements OnInit {
  id!: number;
  recipe: Recipe = new Recipe();
  units=Object.values(Unit);

  selectedFiles: FileList;
  currentFileUpload: File;
  selectedFile = null;
  changeImage = false;

  constructor(private recipeService: RecipeService, private router: Router, 
    private fb: FormBuilder, private route: ActivatedRoute, 
    private imageHandler: ImageHandler){}
  
  ngOnInit(): void {}

  change($event) {
    this.changeImage = true;
  }
  changedImage(event) {
    this.selectedFile = event.target.files[0];
  }
  
  
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }


  ingredient = this.fb.group({
    'name':[''],
    'unit':[''],
    'quantity':[0],
   })

   iblock = this.fb.group({
    'title':[''],
    'ingredients': new FormArray([this.ingredient]),
   })

   instruction = this.fb.group({
    'body':[''],
   })

   iblocks = new FormArray([ this.iblock ]);

    newRecipe = this.fb.group({
    'title': ['', [Validators.required]],
    'portionSize': [''],
    'iblocks': new FormArray([ this.iblock ]),
    'instructions': new FormArray([ this.instruction ]),
    'pic': new FormControl(null),
  });


saveRecipe(){
  this.recipe = Object.assign(this.recipe,this.newRecipe.value);
  this.recipeService.createRecipe(this.recipe).subscribe(  
  response => {  
      let result = response;  
      console.log(result);  
      if(result > 0 )  {  
        if(this.selectedFiles != null) {  
          this.currentFileUpload = this.selectedFiles.item(0);   
          this.imageHandler.uploadImage(this.currentFileUpload , result)
        }
        else{
          this.recipeService.setDefaultPic(this.recipe.id);
        }  
      }  
  },  
  error => {  
    console.log("error while saving data in the DB");  
  }  
);  

}  

  goToRecipeList(){
    this.router.navigate(['/recipes']);
  }

  // goToRecipe(){
  //   this.recipeService.getLastRecipe().subscribe({
  //     next: (data: Recipe) => {this.recipe = data},
  //   });
  //   console.log(this.recipe.id);
  //   this.router.navigate(['/recipes/'+this.recipe.id]);
  // }

  onSubmit(){
    this.saveRecipe();

    this.goToRecipeList();
  }

  get allIBlocks() {
    return this.newRecipe.get('iblocks') as FormArray;
  }

  getIBlock(i:number){
    return (this.newRecipe.get('iblocks') as FormArray).at(i) as FormGroup
  }

  get allIngredients() {
    console.log(this.iblock.value)
    return this.iblock.get('ingredients') as FormArray;
  }

  removeIngredient(j:number, i: number): void {
    this.iblock = this.getIBlock(i);
    console.log(this.allIngredients.at(j).value)
    this.allIngredients.removeAt(j);
  }

  addIngredient(i): void {
    let newIngredient = this.fb.group({
      name:'',
      unit:'',
      quantity:0,
    })

    this.iblock = this.getIBlock(i);
    console.log(this.allIngredients.value)
    this.allIngredients.push(newIngredient);
  }

  get allInstructions() {
    return this.newRecipe.get('instructions') as FormArray;
  }

  removeInstruction(i:number): void {
    this.allInstructions.removeAt(i);
  }

  addInstruction(): void {
    let newInstruction = this.fb.group({
      body:'',
    })
 
    this.allInstructions.push(newInstruction);
  }

  removeBlock(i:number): void {
    this.allIBlocks.removeAt(i);
  }

  addBlock(): void {
    let newBlock = this.fb.group({
      title:'',
      ingredients: this.fb.array([this.ingredient])
    })
    this.allIBlocks.push(newBlock);
  }

  convertToEnumKey(u: string){
    const indexOf = Object.values(Unit).indexOf(u as unknown as Unit);
    const key = Object.keys(Unit)[indexOf];
    return key;
  }

 

}


  