import { SafeUrl } from "@angular/platform-browser";
import { Iblock } from "./iblock";
import { Ingredient } from "./ingredient";
import { Instruction } from "./instruction";
import { User } from "./user";

export class Recipe {
    // [x: string]: any;
      id!: number;
    title!: string;
    portionSize!: string;
    iblocks!: Iblock[];
    instructions!: Instruction[];
    pic: File | SafeUrl;
    user: User;
    isCustom: boolean;

    constructor(){}

}   
