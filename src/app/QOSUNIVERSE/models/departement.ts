import { Region } from "./region";

export class Departement {
    constructor( 
        public id?: string,
        public name?: string,
        public regionId?: string,
        public region?:Region
       
    ){
    }
}