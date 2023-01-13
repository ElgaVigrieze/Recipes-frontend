import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlMatchResult } from '@angular/router';
import { Recipe } from '../classes/recipe';
import { Unit } from '../enum/unit';
import { RecipeService } from '../services/recipe.service';
import { ImageHandler } from '../handler/image.handler';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css']
})

export class CreateRecipeComponent implements OnInit {
  id!: number;
  recipe: Recipe = new Recipe();
  units=Object.values(Unit);
  isLoggedIn = this.appService.authenticated;

  selectedFiles: FileList;
  currentFileUpload: File;
  selectedFile = null;
  changeImage = false;

  constructor(private recipeService: RecipeService, private router: Router, 
    private fb: FormBuilder, private route: ActivatedRoute, private appService: AppService,
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
      if(result > 0 )  {  
        if(this.selectedFiles != null) {  
          this.currentFileUpload = this.selectedFiles.item(0);   
          this.imageHandler.uploadImage(this.currentFileUpload , result)
        }
        else{
          this.recipeService.setDefaultPic(result) .subscribe(response => {
            console.log("default picture set successfully")
          }, error => {
            console.log(error)
          });
        }  
      }  
  },  
  error => {  
    console.log(error);  
  }  
);  

}  

  goToRecipeList(){
    this.router.navigate(['/recipes']);
  }


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


  