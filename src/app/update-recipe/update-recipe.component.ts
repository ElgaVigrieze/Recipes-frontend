import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../classes/recipe';
import { RecipeService } from '../services/recipe.service';

import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Unit } from '../enum/unit';
import { Ingredient } from '../classes/ingredient';
import { Instruction } from '../classes/instruction';
import { Iblock } from '../classes/iblock';
import { ImageHandler } from '../handler/image.handler';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-update-recipe',
  templateUrl: './update-recipe.component.html',
  styleUrls: ['./update-recipe.component.css']
})
export class UpdateRecipeComponent implements OnInit {
    id!: number;
    recipe: Recipe = new Recipe();
    pic: any;
    units=Object.values(Unit);
    newRecipe: FormGroup;
    iblock: FormGroup;
    ingredient: FormGroup;
    selectedFiles: FileList;
    currentFileUpload: File;
    selectedFile: File | null;
    changeImage = false;


  constructor(private recipeService: RecipeService, private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder, private imageHandler: ImageHandler,
    private sanitizer: DomSanitizer){
      this.selectedFile = null;
    }

    change($event) {
      this.changeImage = true;
    }
    changedImage(event) {
      this.selectedFile = event.target.files[0];
    }
    
    
    selectFile(event) {
      this.selectedFiles = event.target.files;
    }
  

  addIngredientGroup(){
    return this.fb.group({
      'id': new FormControl(0),
      'name':new FormControl(''),
      'unit':new FormControl(''),
      'quantity':new FormControl(0),
    })
  }

  addInstructionGroup(){
    return this.fb.group({
      'id': new FormControl(0),
      'body':new FormControl(''),
    })
  }

  addIblockGroup(){
    return this.fb.group({
      'id': new FormControl(0),
      'title':new FormControl(''),
      'ingredients': new FormArray([this.addIngredientGroup()])
    })
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.newRecipe = this.fb.group({
      id : [0],
      title: [''],
      pic : [''],
      portionSize: [''],
      iblocks: this.fb.array([this.addIblockGroup()])  ,
      instructions: this.fb.array([this.addInstructionGroup()])  ,
    })
    this.getRecipe(this.id);
    this.mapFormValuesToRecipeModel();
    this.pic = this.loadPic();
  }

  getRecipe(id: number){
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe: Recipe) => {
        this.uploadRecipe(recipe);
        this.recipe = recipe;
      },
      error: (err: any) => console.log(err)
    }
    );
  }

  uploadRecipe(recipe: Recipe){
    this.newRecipe.patchValue({
      title: recipe.title,  
      portionSize: recipe.portionSize,  
      pic: recipe.pic,
    });
    this.newRecipe.setControl('iblocks',this.setExistingIblocks(recipe.iblocks));
     this.newRecipe.setControl('instructions',this.setExistingInstructions(recipe.instructions));
    }

  setExistingIngredients(ingredients: Ingredient[]): FormArray{
    const ingredients1 = new FormArray([]);
    ingredients?.forEach(i=> {
      ingredients1.push(this.fb.group({
        id: i.id,
        name: i.name,
        unit: i.unit,
        quantity: i.quantity
      }))
    });
    return ingredients1;
  }

  setExistingIblocks(iblocks: Iblock[]): FormArray{
    const iblocks1 = new FormArray([]);
    iblocks?.forEach(b=> {
      iblocks1.push(this.fb.group({
        id: b.id,
        title: b.title,
        ingredients: this.setExistingIngredients(b.ingredients),
      }))
    });
    return iblocks1;
  }

  setExistingInstructions(instructions: Instruction[]): FormArray{
    const instructions1 = new FormArray([]);
    instructions?.forEach(i=> {
      instructions1.push(this.fb.group({
        id: i.id,
        body: i.body
      }))
    });
    return instructions1;
  }

  onSubmit(){
    this.mapFormValuesToRecipeModel();
    console.log(this.recipe)
    this.recipeService.updateRecipe( this.recipe, this.id).subscribe({
      next: () => this.router.navigate(['/recipes']),
      error: (err: any) => console.log(err)
  });

  if(this.selectedFiles != null)  {  
    this.currentFileUpload = this.selectedFiles.item(0);   
    this.imageHandler.uploadImage(this.currentFileUpload , this.id)
  }  
  }

  mapFormValuesToRecipeModel(){
    this.recipe.title = this.newRecipe.value.title;
    this.recipe.portionSize = this.newRecipe.value.portionSize;
    this.recipe.iblocks = this.newRecipe.value.iblocks;
    this.recipe.instructions = this.newRecipe.value.instructions;
    this.recipe.pic = this.newRecipe.value.pic;
  }


  convertToEnumKey(u: string){
    const indexOf = Object.values(Unit).indexOf(u as unknown as Unit);
    const key = Object.keys(Unit)[indexOf];
    return key;
  }


 get allIBlocks() {
    return this.newRecipe.get('iblocks') as FormArray;
  }

  getIBlock(i:number){
    return (this.newRecipe.get('iblocks') as FormArray).at(i) as FormGroup
  }


  get allIngredients() {
    return this.iblock.get('ingredients') as FormArray;
  }

  removeIngredient(j:number, i: number): void {
    this.iblock = this.getIBlock(i);
    this.allIngredients.removeAt(j);
  }

  addIngredient(i): void {
    let newIngredient = this.fb.group({
      name:'',
      unit:'',
      quantity:0,
    })

    this.iblock = this.getIBlock(i);
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
      ingredients: this.fb.array([this.addIngredientGroup()]),
    })
    this.allIBlocks.push(newBlock);
  }

  loadPic(){
    this.recipeService.displayImage(this.id)
        .subscribe((blob : any) => {
          let objectURL = URL.createObjectURL(blob);       
          this.pic = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        });
        return this.pic;
  }

}

